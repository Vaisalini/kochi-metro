import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Modal from "../components/common/Modal";
import TrainInductionDashboard from "../components/dashboard/TrainInductionDashboard";
import { appData } from "../data/appData";

const AIRecommendationPage = () => {
  const [resolvedConflicts, setResolvedConflicts] = useState([]);
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-09-15");
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

  // What-If Scenario States
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [whatIfScenarios, setWhatIfScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [modifiedTrainData, setModifiedTrainData] = useState(null);
  const [isGeneratingWhatIf, setIsGeneratingWhatIf] = useState(false);

  // Sort trains by status first (Revenue Service first), then by aiRank
  const sortedTrains = [...appData.trainsets].sort((a, b) => {
    // First prioritize Revenue Service trains
    if (a.status === "Revenue Service" && b.status !== "Revenue Service") {
      return -1;
    }
    if (a.status !== "Revenue Service" && b.status === "Revenue Service") {
      return 1;
    }

    // Then prioritize Standby trains
    if (
      a.status === "Standby" &&
      b.status !== "Standby" &&
      b.status !== "Revenue Service"
    ) {
      return -1;
    }
    if (
      a.status !== "Standby" &&
      a.status !== "Revenue Service" &&
      b.status === "Standby"
    ) {
      return 1;
    }

    // For same status trains, sort by aiRank if available
    if (a.aiRank !== null && b.aiRank !== null) {
      return a.aiRank - b.aiRank;
    }
    // If a has aiRank but b doesn't, a comes first
    if (a.aiRank !== null && b.aiRank === null) {
      return -1;
    }
    // If b has aiRank but a doesn't, b comes first
    if (a.aiRank === null && b.aiRank !== null) {
      return 1;
    }
    // If both are null, sort by ID
    return a.id.localeCompare(b.id);
  });

  const generatePlan = () => {
    setIsGenerating(true);

    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 3000);
  };

  const handleConflictClick = (conflict) => {
    setSelectedConflict(conflict);
    setShowConflictModal(true);
  };

  const handleProceedToConfirmation = () => {
    navigate("/confirmation");
  };

  const handleRegeneratePlan = () => {
    setPlanGenerated(false);
    generatePlan();
  };

  // What-If Scenario Functions
  const handleWhatIfScenario = () => {
    setShowWhatIfModal(true);
  };

  const generateWhatIfScenario = (scenarioType, trainId, modifications) => {
    setIsGeneratingWhatIf(true);

    // Create modified train data based on scenario
    const modifiedData = { ...appData };
    const trainIndex = modifiedData.trainsets.findIndex(
      (t) => t.id === trainId
    );

    if (trainIndex !== -1) {
      const originalTrain = { ...modifiedData.trainsets[trainIndex] };

      switch (scenarioType) {
        case "fc_cancelled":
          modifiedData.trainsets[trainIndex] = {
            ...originalTrain,
            fitness: {
              ...originalTrain.fitness,
              rolling: { ...originalTrain.fitness.rolling, valid: false },
            },
            status: "Out of Service",
            confidence: 0, // Set low confidence for out of service trains
          };
          break;

        case "critical_maintenance":
          modifiedData.trainsets[trainIndex] = {
            ...originalTrain,
            jobCards: {
              ...originalTrain.jobCards,
              critical: originalTrain.jobCards.critical + 1,
              open: originalTrain.jobCards.open + 1,
            },
            status: "IBL Maintenance",
            confidence: Math.max(0.1, originalTrain.confidence - 0.4), // Reduce confidence
          };
          break;

        case "emergency_repair":
          modifiedData.trainsets[trainIndex] = {
            ...originalTrain,
            fitness: {
              rolling: {
                valid: false,
                expiry: new Date().toISOString().split("T")[0],
              },
              signal: {
                valid: false,
                expiry: new Date().toISOString().split("T")[0],
              },
              telecom: {
                valid: originalTrain.fitness.telecom.valid,
                expiry: originalTrain.fitness.telecom.expiry,
              },
            },
            status: "Emergency Repair",
            jobCards: {
              ...originalTrain.jobCards,
              critical: originalTrain.jobCards.critical + 2,
            },
            confidence: 0, // Emergency repair = no confidence
          };
          break;

        case "standby_activation":
          if (originalTrain.status === "Standby") {
            modifiedData.trainsets[trainIndex] = {
              ...originalTrain,
              status: "Revenue Service",
              confidence: Math.min(0.95, originalTrain.confidence + 0.1), // Slight confidence boost
            };
          }
          break;

        case "custom":
          modifiedData.trainsets[trainIndex] = {
            ...originalTrain,
            ...modifications,
          };
          break;
      }
    }

    // Recalculate rankings for modified data
    const eligibleTrains = modifiedData.trainsets.filter(
      (t) =>
        t.fitness.rolling.valid &&
        t.fitness.signal.valid &&
        t.fitness.telecom.valid &&
        t.jobCards.critical === 0
    );

    const ineligibleTrains = modifiedData.trainsets.filter(
      (t) =>
        !t.fitness.rolling.valid ||
        !t.fitness.signal.valid ||
        !t.fitness.telecom.valid ||
        t.jobCards.critical > 0
    );

    // Assign ranks to eligible trains (1 to N)
    eligibleTrains.sort((a, b) => {
      // Sort by original aiRank for consistent ordering
      if (a.aiRank !== null && b.aiRank !== null) {
        return a.aiRank - b.aiRank;
      }
      if (a.aiRank !== null && b.aiRank === null) {
        return -1;
      }
      if (a.aiRank === null && b.aiRank !== null) {
        return 1;
      }
      // If both are null, sort by ID
      return a.id.localeCompare(b.id);
    });

    eligibleTrains.forEach((train, index) => {
      const trainIndex = modifiedData.trainsets.findIndex(
        (t) => t.id === train.id
      );
      if (trainIndex !== -1) {
        modifiedData.trainsets[trainIndex].aiRank = index + 1;
      }
    });

    // Assign high ranks to ineligible trains (N+1 onwards)
    ineligibleTrains.forEach((train, index) => {
      const trainIndex = modifiedData.trainsets.findIndex(
        (t) => t.id === train.id
      );
      if (trainIndex !== -1) {
        modifiedData.trainsets[trainIndex].aiRank =
          eligibleTrains.length + index + 1;
      }
    });

    const scenario = {
      id: Date.now(),
      type: scenarioType,
      trainId,
      name: getScenarioName(scenarioType, trainId),
      description: getScenarioDescription(scenarioType, trainId),
      timestamp: new Date().toLocaleString(),
      modifiedData: modifiedData,
      impact: calculateScenarioImpact(appData, modifiedData),
    };

    setTimeout(() => {
      setWhatIfScenarios((prev) => [...prev, scenario]);
      setCurrentScenario(scenario);
      setModifiedTrainData(modifiedData);
      setIsGeneratingWhatIf(false);
      setShowWhatIfModal(false);
    }, 2000);
  };

  const getScenarioName = (type, trainId) => {
    const names = {
      fc_cancelled: `FC Cancelled - ${trainId}`,
      critical_maintenance: `Critical Maintenance - ${trainId}`,
      emergency_repair: `Emergency Repair - ${trainId}`,
      standby_activation: `Standby Activation - ${trainId}`,
      custom: `Custom Modification - ${trainId}`,
    };
    return names[type] || `Scenario - ${trainId}`;
  };

  const getScenarioDescription = (type, trainId) => {
    const descriptions = {
      fc_cancelled: `Fitness Certificate cancelled for ${trainId}. Train removed from service immediately.`,
      critical_maintenance: `Critical maintenance issue discovered on ${trainId}. Requires immediate attention.`,
      emergency_repair: `Emergency repair required for ${trainId}. Multiple systems affected.`,
      standby_activation: `Standby train ${trainId} activated for revenue service.`,
      custom: `Custom modifications applied to ${trainId}.`,
    };
    return descriptions[type] || `Modifications applied to ${trainId}`;
  };

  const calculateScenarioImpact = (originalData, modifiedData) => {
    const originalEligible = originalData.trainsets.filter(
      (t) =>
        t.fitness.rolling.valid &&
        t.fitness.signal.valid &&
        t.fitness.telecom.valid &&
        t.jobCards.critical === 0
    ).length;

    const modifiedEligible = modifiedData.trainsets.filter(
      (t) =>
        t.fitness.rolling.valid &&
        t.fitness.signal.valid &&
        t.fitness.telecom.valid &&
        t.jobCards.critical === 0
    ).length;

    const eligibleChange = modifiedEligible - originalEligible;
    const capacityImpact =
      originalEligible > 0 ? (eligibleChange / originalEligible) * 100 : 0;

    // Count trains that have different properties (more comprehensive comparison)
    const affectedTrainsCount = modifiedData.trainsets.filter(
      (modifiedTrain) => {
        const originalTrain = originalData.trainsets.find(
          (t) => t.id === modifiedTrain.id
        );
        if (!originalTrain) return true;

        return (
          modifiedTrain.status !== originalTrain.status ||
          modifiedTrain.fitness.rolling.valid !==
            originalTrain.fitness.rolling.valid ||
          modifiedTrain.fitness.signal.valid !==
            originalTrain.fitness.signal.valid ||
          modifiedTrain.fitness.telecom.valid !==
            originalTrain.fitness.telecom.valid ||
          modifiedTrain.jobCards.critical !== originalTrain.jobCards.critical ||
          modifiedTrain.aiRank !== originalTrain.aiRank
        );
      }
    ).length;

    return {
      eligibleTrainsChange: eligibleChange,
      serviceCapacityImpact: Math.abs(capacityImpact).toFixed(1),
      affectedTrains: affectedTrainsCount,
    };
  };

  const resetToOriginalPlan = () => {
    setCurrentScenario(null);
    setModifiedTrainData(null);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "var(--color-success)";
    if (confidence >= 0.8) return "var(--color-warning)";
    return "var(--color-error)";
  };

  const getRankingReason = (train) => {
    const reasons = [];

    if (train.status === "Revenue Service" && train.jobCards.critical === 0) {
      reasons.push("Optimal for revenue service");
    }

    if (
      train.fitness.rolling.valid &&
      train.fitness.signal.valid &&
      train.fitness.telecom.valid
    ) {
      reasons.push("All certificates valid");
    }

    if (train.jobCards.open === 0) {
      reasons.push("No pending maintenance");
    }

    if (train.branding.slaStatus === "Compliant") {
      reasons.push("SLA compliant");
    }

    if (train.id === "KM-005") {
      reasons.length = 0; // Clear any previous reasons for KM-005
      reasons.push(
        "All fitness certificates invalid - Requires recertification"
      );
      reasons.push("Under maintenance - not available for service");
    } else if (reasons.length === 0) {
      if (train.status === "IBL Maintenance") {
        reasons.push("Under maintenance - low priority");
      } else if (train.jobCards.critical > 0) {
        reasons.push("Critical maintenance required");
      } else {
        reasons.push("Requires attention before service");
      }
    }

    return reasons.join(", ");
  };

  return (
    <div className="page active">
      <Header
        title="AI Induction Plan Generator"
        showBackButton
        backPath="/dashboard"
      />

      <main className="ai-main">
        <div className="ai-inputs">
          <div className="card">
            <div className="card__body">
              <h3>Planning Parameters</h3>

              <div className="form-group">
                <label className="form-label">Planning Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority Criteria</label>
                <select className="form-control">
                  <option>Revenue Optimization</option>
                  <option>Maintenance Priority</option>
                  <option>SLA Compliance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service Pattern</label>
                <select className="form-control">
                  <option>Peak Hours</option>
                  <option>Off-Peak</option>
                  <option>Full Day</option>
                </select>
              </div>

              <button
                className="btn btn--primary btn--full-width"
                onClick={generatePlan}
                disabled={isGenerating || planGenerated}
              >
                {isGenerating
                  ? "Generating Plan..."
                  : planGenerated
                  ? "Plan Generated"
                  : "Generate AI Plan"}
              </button>
            </div>
          </div>

          {/* What-If Scenarios Control Panel */}
          {planGenerated && (
            <div className="card" style={{ marginTop: "var(--space-20)" }}>
              <div className="card__body">
                <h3>🔬 What-If Analysis</h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    marginBottom: "var(--space-16)",
                  }}
                >
                  Create scenarios to analyze the impact of sudden changes on
                  your induction plan
                </p>

                <button
                  className="btn btn--warning btn--full-width"
                  onClick={handleWhatIfScenario}
                >
                  🔬 Create What-If Scenario
                </button>

                {whatIfScenarios.length > 0 && (
                  <div style={{ marginTop: "var(--space-16)" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-secondary)",
                        marginBottom: "var(--space-8)",
                      }}
                    >
                      <strong>
                        Active Scenarios: {whatIfScenarios.length}
                      </strong>
                    </div>
                    <div className="scenarios-summary">
                      {whatIfScenarios.map((scenario) => (
                        <div
                          key={scenario.id}
                          className="scenario-summary-item"
                        >
                          <span className="scenario-summary-name">
                            {scenario.name}
                          </span>
                          <span className="scenario-summary-impact">
                            {scenario.impact.serviceCapacityImpact}% impact
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ai-results">
          <div className="card">
            <div className="card__body">
              <h3>AI Recommended Induction Plan</h3>

              {!planGenerated && !isGenerating && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "var(--space-32)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Click "Generate AI Plan" to see recommendations
                </div>
              )}

              {planGenerated && (
                <>
                  <div className="plan-list">
                    {sortedTrains.map((train, index) => (
                      <div key={train.id} className="plan-item">
                        <div>
                          <div className="plan-rank">#{train.aiRank}</div>
                          <div className="plan-train">{train.id}</div>
                          <div className="plan-reasoning">
                            {getRankingReason(train)}
                          </div>
                        </div>
                        <div>
                          <div
                            className="plan-confidence"
                            style={{
                              color: getConfidenceColor(train.confidence),
                            }}
                          >
                            {(train.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="conflicts-section">
                    <h4>Identified Conflicts</h4>
                    {appData.conflicts.map((conflict) => (
                      <div key={conflict.id} className="conflict-item">
                        <div>
                          <strong>{conflict.trainId}</strong> - {conflict.type}
                        </div>
                        <div className="conflict-severity">
                          {conflict.severity}: {conflict.description}
                        </div>
                        <div className="conflict-suggestion">
                          Suggestion: {conflict.suggestion}
                        </div>
                        {resolvedConflicts.includes(conflict.id) ? (
                          <div
                            style={{
                              color: "#21808d",
                              fontWeight: "bold",
                              marginTop: 8,
                            }}
                          >
                            Conflict Resolved
                          </div>
                        ) : (
                          <div
                            style={{ display: "flex", gap: 8, marginTop: 8 }}
                          >
                            <button
                              className="btn btn--sm btn--outline"
                              onClick={() => handleConflictClick(conflict)}
                            >
                              View Details
                            </button>
                            <button
                              className="btn btn--sm btn--primary"
                              onClick={() => {
                                conflict.handled = true;
                                setResolvedConflicts((prev) => [
                                  ...prev,
                                  conflict.id,
                                ]);
                                // Optionally update ranked induction list here
                              }}
                            >
                              Solve Conflict
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="ai-actions">
                    <button
                      className="btn btn--primary"
                      onClick={handleProceedToConfirmation}
                    >
                      Proceed to Final Plan
                    </button>
                    <button
                      className="btn btn--secondary"
                      onClick={handleRegeneratePlan}
                    >
                      Regenerate Plan
                    </button>
                    <button
                      className="btn btn--outline"
                      onClick={() => alert("Export feature coming soon!")}
                    >
                      Export Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Train Induction Dashboard - shown after plan is generated */}
          {planGenerated && (
            <div style={{ marginTop: "var(--space-24)" }}>
              <TrainInductionDashboard compactMode={true} />
            </div>
          )}

          {/* What-If Scenarios Section */}
          {planGenerated && whatIfScenarios.length > 0 && (
            <div
              className="what-if-section"
              style={{ marginTop: "var(--space-32)" }}
            >
              <div className="card">
                <div className="card__body">
                  <h3>🔬 What-If Scenarios</h3>
                  <div className="scenarios-list">
                    {whatIfScenarios.map((scenario) => (
                      <div key={scenario.id} className="scenario-item">
                        <div className="scenario-header">
                          <h5>{scenario.name}</h5>
                          <span className="scenario-timestamp">
                            {scenario.timestamp}
                          </span>
                        </div>
                        <p className="scenario-description">
                          {scenario.description}
                        </p>

                        <div className="scenario-impact">
                          <div className="impact-metric">
                            <strong>Service Capacity Impact:</strong>{" "}
                            {scenario.impact.serviceCapacityImpact}%
                          </div>
                          <div className="impact-metric">
                            <strong>Eligible Trains Change:</strong>{" "}
                            {scenario.impact.eligibleTrainsChange > 0
                              ? "+"
                              : ""}
                            {scenario.impact.eligibleTrainsChange}
                          </div>
                          <div className="impact-metric">
                            <strong>Affected Trains:</strong>{" "}
                            {scenario.impact.affectedTrains}
                          </div>
                        </div>

                        <div className="scenario-actions">
                          <button
                            className="btn btn--sm btn--primary"
                            onClick={() => setCurrentScenario(scenario)}
                          >
                            {currentScenario?.id === scenario.id
                              ? "Currently Active"
                              : "View Scenario Plan"}
                          </button>
                          {currentScenario?.id === scenario.id && (
                            <button
                              className="btn btn--sm btn--outline"
                              onClick={resetToOriginalPlan}
                            >
                              Close Scenario View
                            </button>
                          )}
                        </div>

                        {/* Show scenario-specific induction plan */}
                        {currentScenario?.id === scenario.id && (
                          <div
                            className="scenario-plan"
                            style={{ marginTop: "var(--space-20)" }}
                          >
                            <div
                              className="scenario-plan-header"
                              style={{
                                padding: "var(--space-12)",
                                backgroundColor: "var(--color-warning-bg)",
                                borderRadius: "6px",
                                border: "1px solid var(--color-warning)",
                                marginBottom: "var(--space-16)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "var(--space-8)",
                                }}
                              >
                                <span style={{ fontSize: "16px" }}>⚠️</span>
                                <strong>
                                  Scenario Impact - Updated Induction Plan
                                </strong>
                              </div>
                            </div>

                            <div className="updated-plan-list">
                              <h6
                                style={{
                                  marginBottom: "var(--space-12)",
                                  color: "var(--color-text)",
                                }}
                              >
                                Updated Train Ranking for "{scenario.name}"
                              </h6>
                              {[...scenario.modifiedData.trainsets]
                                .sort((a, b) => {
                                  if (a.aiRank !== null && b.aiRank !== null) {
                                    return a.aiRank - b.aiRank;
                                  }
                                  if (a.aiRank !== null && b.aiRank === null) {
                                    return -1;
                                  }
                                  if (a.aiRank === null && b.aiRank !== null) {
                                    return 1;
                                  }
                                  return a.id.localeCompare(b.id);
                                })
                                .map((train, index) => (
                                  <div
                                    key={train.id}
                                    className={`plan-item ${
                                      train.id === scenario.trainId
                                        ? "plan-item--affected"
                                        : ""
                                    }`}
                                  >
                                    <div>
                                      <div className="plan-rank">
                                        {train.aiRank !== null
                                          ? `#${train.aiRank}`
                                          : "N/A"}
                                      </div>
                                      <div className="plan-train">
                                        {train.id}
                                      </div>
                                      <div className="plan-reasoning">
                                        {train.id === scenario.trainId && (
                                          <strong
                                            style={{
                                              color: "var(--color-warning)",
                                            }}
                                          >
                                            [MODIFIED]
                                          </strong>
                                        )}
                                        {getRankingReason(train)}
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className="plan-confidence"
                                        style={{
                                          color: getConfidenceColor(
                                            train.confidence
                                          ),
                                        }}
                                      >
                                        {(train.confidence * 100).toFixed(0)}%
                                        confidence
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {/* Scenario-specific dashboard */}
                            <div style={{ marginTop: "var(--space-24)" }}>
                              <TrainInductionDashboard
                                compactMode={true}
                                scenarioData={scenario.modifiedData}
                                title={`Dashboard for "${scenario.name}"`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <LoadingOverlay
        isVisible={isGenerating}
        message="AI is analyzing train data and generating optimal induction plan..."
      />

      <Modal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        title="Conflict Details"
        actions={
          <button
            className="btn btn--primary"
            onClick={() => setShowConflictModal(false)}
          >
            Close
          </button>
        }
      >
        {selectedConflict && (
          <div>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <strong>Train:</strong> {selectedConflict.trainId}
            </div>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <strong>Type:</strong> {selectedConflict.type}
            </div>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <strong>Severity:</strong> {selectedConflict.severity}
            </div>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <strong>Description:</strong> {selectedConflict.description}
            </div>
            <div style={{ marginBottom: "var(--space-12)" }}>
              <strong>Impact:</strong> {selectedConflict.impact}
            </div>
            <div>
              <strong>Suggestion:</strong> {selectedConflict.suggestion}
            </div>
          </div>
        )}
      </Modal>

      {/* What-If Scenario Modal */}
      <WhatIfScenarioModal
        isOpen={showWhatIfModal}
        onClose={() => setShowWhatIfModal(false)}
        onGenerateScenario={generateWhatIfScenario}
        trains={appData.trainsets}
      />

      <LoadingOverlay
        isVisible={isGeneratingWhatIf}
        message="Generating what-if scenario and recalculating plan..."
      />
    </div>
  );
};

// What-If Scenario Modal Component
const WhatIfScenarioModal = ({
  isOpen,
  onClose,
  onGenerateScenario,
  trains,
}) => {
  const [selectedScenarioType, setSelectedScenarioType] =
    useState("fc_cancelled");
  const [selectedTrainId, setSelectedTrainId] = useState("");
  const [customModifications, setCustomModifications] = useState({});

  const scenarioTypes = [
    {
      value: "fc_cancelled",
      label: "Fitness Certificate Cancelled",
      description: "Remove train from service due to FC cancellation",
    },
    {
      value: "critical_maintenance",
      label: "Critical Maintenance Required",
      description: "Add critical maintenance requirement",
    },
    {
      value: "emergency_repair",
      label: "Emergency Repair",
      description: "Multiple systems failure requiring immediate repair",
    },
    {
      value: "standby_activation",
      label: "Activate Standby Train",
      description: "Bring standby train into revenue service",
    },
    {
      value: "custom",
      label: "Custom Modification",
      description: "Apply custom modifications to train status",
    },
  ];

  const handleGenerate = () => {
    if (!selectedTrainId) {
      alert("Please select a train");
      return;
    }

    onGenerateScenario(
      selectedScenarioType,
      selectedTrainId,
      customModifications
    );
    setSelectedTrainId("");
    setCustomModifications({});
  };

  const availableTrains =
    selectedScenarioType === "standby_activation"
      ? trains.filter((t) => t.status === "Standby")
      : trains;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔬 Create What-If Scenario"
      actions={
        <div style={{ display: "flex", gap: "var(--space-12)" }}>
          <button className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleGenerate}>
            Generate Scenario
          </button>
        </div>
      }
    >
      <div style={{ minWidth: "500px" }}>
        <div className="form-group">
          <label className="form-label">Scenario Type</label>
          <select
            className="form-control"
            value={selectedScenarioType}
            onChange={(e) => setSelectedScenarioType(e.target.value)}
          >
            {scenarioTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <small
            style={{
              color: "var(--color-text-secondary)",
              marginTop: "4px",
              display: "block",
            }}
          >
            {
              scenarioTypes.find((t) => t.value === selectedScenarioType)
                ?.description
            }
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Select Train</label>
          <select
            className="form-control"
            value={selectedTrainId}
            onChange={(e) => setSelectedTrainId(e.target.value)}
          >
            <option value="">Choose a train...</option>
            {availableTrains.map((train) => (
              <option key={train.id} value={train.id}>
                {train.id} - {train.status}{" "}
                {train.aiRank !== null
                  ? `(Rank #${train.aiRank})`
                  : "(No Rank)"}
              </option>
            ))}
          </select>
        </div>

        {selectedScenarioType === "custom" && (
          <div className="form-group">
            <label className="form-label">Custom Modifications</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-12)",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  New Status
                </label>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setCustomModifications((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="">Keep current</option>
                  <option value="Revenue Service">Revenue Service</option>
                  <option value="Standby">Standby</option>
                  <option value="IBL Maintenance">IBL Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Add Critical Jobs
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  min="0"
                  onChange={(e) =>
                    setCustomModifications((prev) => ({
                      ...prev,
                      jobCards: {
                        ...prev.jobCards,
                        critical: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "var(--space-16)",
            padding: "var(--space-12)",
            backgroundColor: "var(--color-gray-800)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <strong>Preview:</strong> This scenario will simulate{" "}
          {scenarioTypes
            .find((t) => t.value === selectedScenarioType)
            ?.description.toLowerCase()}
          {selectedTrainId && ` for train ${selectedTrainId}`}. The system will
          recalculate the induction plan and show the impact on service
          capacity.
        </div>
      </div>
    </Modal>
  );
};

export default AIRecommendationPage;
