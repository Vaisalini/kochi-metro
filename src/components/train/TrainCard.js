import React from "react";
import { useNavigate } from "react-router-dom";

const TrainCard = ({ train }) => {
  const navigate = useNavigate();

  const getTrainCardStatus = (train) => {
    const conflicts =
      train.jobCards.critical > 0 ||
      !train.fitness.rolling.valid ||
      !train.fitness.signal.valid ||
      !train.fitness.telecom.valid;

    if (conflicts) return "status-critical";
    if (train.jobCards.open > 0) return "status-warning";
    return "status-good";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Revenue Service":
        return "status-revenue";
      case "Standby":
        return "status-standby";
      case "IBL Maintenance":
        return "status-maintenance";
      default:
        return "";
    }
  };

  const handleClick = () => {
    navigate(`/train/${train.id}`);
  };

  const formatDaysLeft = (daysLeft) => {
    if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} days ago`;
    if (daysLeft === 0) return "Expires today";
    return `${daysLeft} days left`;
  };

  const getCertificateStatus = (cert) => {
    if (!cert.valid) return "critical";
    if (cert.daysLeft <= 3) return "critical";
    if (cert.daysLeft <= 7) return "warning";
    return "good";
  };

  return (
    <div
      className={`train-card ${getTrainCardStatus(train)}`}
      onClick={handleClick}
    >
      <div className="train-header">
        <div className="train-id">{train.id}</div>
        <div className={`train-status ${getStatusClass(train.status)}`}>
          {train.status}
        </div>
      </div>

      <div className="train-indicators">
        <div className="indicator">
          <span className="indicator-label">Rolling:</span>
          <span
            className={`indicator-value ${getCertificateStatus(
              train.fitness.rolling
            )}`}
          >
            {formatDaysLeft(train.fitness.rolling.daysLeft)}
          </span>
        </div>

        <div className="indicator">
          <span className="indicator-label">Signal:</span>
          <span
            className={`indicator-value ${getCertificateStatus(
              train.fitness.signal
            )}`}
          >
            {formatDaysLeft(train.fitness.signal.daysLeft)}
          </span>
        </div>

        <div className="indicator">
          <span className="indicator-label">Telecom:</span>
          <span
            className={`indicator-value ${getCertificateStatus(
              train.fitness.telecom
            )}`}
          >
            {formatDaysLeft(train.fitness.telecom.daysLeft)}
          </span>
        </div>

        <div className="indicator">
          <span className="indicator-label">Job Cards:</span>
          <span
            className={`indicator-value ${
              train.jobCards.open > 0 ? "warning" : "good"
            }`}
          >
            {train.jobCards.open} open
          </span>
        </div>
      </div>

      <div className="train-bay">
        Bay: {train.bay}
        {train.status === "IBL Maintenance" && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--color-text-secondary)",
            }}
          >
            Technician: Ravi Kumar | Est. Completion: 2 hours
            {(!train.fitness.rolling.valid ||
              !train.fitness.signal.valid ||
              !train.fitness.telecom.valid) && (
              <div style={{ marginTop: "4px", color: "var(--color-red-500)" }}>
                Certificate expired - Requires recertification
              </div>
            )}
          </div>
        )}
        {train.status === "Standby" && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--color-orange-500)",
            }}
          >
            Mileage balance required: {Math.abs(train.mileage.variance)} km
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainCard;
