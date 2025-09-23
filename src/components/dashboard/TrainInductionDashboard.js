import React, { useState, useMemo } from 'react';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, X, AlertCircle, Train, Factory, IndianRupee } from 'lucide-react';
import { appData } from '../../data/appData';
import '../../styles/TrainInductionDashboard.css';

const TrainInductionDashboard = () => {
  // Transform existing appData to match dashboard requirements
  const trains = useMemo(() => {
    return appData.trainsets.map(train => {
      // Calculate scoring based on existing data
      let score = 0;
      let eligible = true;

      // Fitness Certificate Score (30 points max)
      const fcScore = (train.fitness.rolling.valid ? 10 : 0) + 
                     (train.fitness.signal.valid ? 10 : 0) + 
                     (train.fitness.telecom.valid ? 10 : 0);
      
      // Job Cards Score (25 points max)
      const jobScore = Math.max(0, 25 - (train.jobCards.open * 5) - (train.jobCards.critical * 10));
      
      // Branding Score (20 points max)
      const brandingScore = train.branding.slaStatus === 'Compliant' ? 20 : 
                           train.branding.slaStatus === 'At Risk' ? 15 : 
                           train.branding.slaStatus === 'Non-Compliant' ? 10 : 0;
      
      // Mileage Score (15 points max)
      const mileageVariance = Math.abs(train.mileage.variance);
      const mileageScore = Math.max(0, 15 - (mileageVariance / 200));
      
      // Cleaning Score (10 points max)
      const cleaningScore = train.cleaning.status === 'Completed' ? 10 :
                           train.cleaning.status === 'Scheduled' ? 7 :
                           train.cleaning.status === 'Overdue' ? 0 : 5;

      // Check eligibility
      if (!train.fitness.rolling.valid || !train.fitness.signal.valid || !train.fitness.telecom.valid) {
        eligible = false;
        score = 0;
      } else if (train.jobCards.critical > 0) {
        eligible = false;
        score = 0;
      } else {
        score = fcScore + jobScore + brandingScore + mileageScore + cleaningScore;
      }

      return {
        id: train.id,
        score: Math.round(score * 10) / 10,
        eligible,
        fc: fcScore,
        jobs: jobScore,
        branding: brandingScore,
        mileage: mileageScore,
        cleaning: cleaningScore,
        bay: train.bay,
        status: train.status
      };
    });
  }, []);

  const [depotBays] = useState(appData.depot.bays);
  const [shuntingData] = useState(appData.shuntingOptimization);

  // Calculate metrics
  const eligibleTrains = trains.filter(t => t.eligible);
  const totalTrains = trains.length;
  const successRate = (eligibleTrains.length / totalTrains * 100).toFixed(1);

  // Prepare radar chart data for top 3 trains
  const topTrains = eligibleTrains.slice(0, 3);
  const radarData = [
    { category: 'FC Score', ...topTrains.reduce((acc, t, i) => ({ ...acc, [`train${i}`]: t.fc }), {}) },
    { category: 'Job Cards', ...topTrains.reduce((acc, t, i) => ({ ...acc, [`train${i}`]: t.jobs }), {}) },
    { category: 'Branding', ...topTrains.reduce((acc, t, i) => ({ ...acc, [`train${i}`]: t.branding }), {}) },
    { category: 'Mileage', ...topTrains.reduce((acc, t, i) => ({ ...acc, [`train${i}`]: t.mileage }), {}) },
    { category: 'Cleaning', ...topTrains.reduce((acc, t, i) => ({ ...acc, [`train${i}`]: t.cleaning }), {}) }
  ];

  // Prepare bar chart data
  const scoreDistributionData = eligibleTrains.map(t => ({
    name: t.id,
    score: t.score
  }));

  const shuntingCostData = shuntingData.map(s => ({
    name: s.train,
    cost: s.cost
  }));

  // Calculate totals
  const totalDistance = shuntingData.reduce((sum, s) => sum + s.distance, 0);
  const totalCost = shuntingData.reduce((sum, s) => sum + s.cost, 0);
  const avgCost = (totalCost / shuntingData.length).toFixed(0);

  const DepotVisualization = () => {
    return (
      <svg viewBox="0 0 400 400" className="depot-svg">
        {/* Draw connections */}
        {appData.depot.connections.map(([from, to], i) => {
          const fromBay = depotBays[from];
          const toBay = depotBays[to];
          if (fromBay && toBay) {
            return (
              <line
                key={i}
                x1={fromBay.x * 100 + 50}
                y1={350 - fromBay.y * 100}
                x2={toBay.x * 100 + 50}
                y2={350 - toBay.y * 100}
                stroke="var(--color-gray-400)"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.3"
              />
            );
          }
          return null;
        })}

        {/* Draw bays */}
        {Object.entries(depotBays).map(([bayId, bay]) => {
          const x = bay.x * 100 + 50;
          const y = 350 - bay.y * 100;
          let fillColor = 'var(--color-slate-500)';
          let statusText = '';
          
          if (bayId === 'EXIT') {
            fillColor = 'var(--color-teal-500)';
            statusText = 'EXIT';
          } else if (bay.train) {
            const train = trains.find(t => t.id === bay.train);
            if (train) {
              // Use status-based colors matching train cards
              switch (train.status) {
                case 'Revenue Service':
                  fillColor = 'var(--color-teal-600)'; // Active/in-use
                  statusText = 'In Use';
                  break;
                case 'Standby':
                  fillColor = 'var(--color-orange-500)'; // Standby
                  statusText = 'Standby';
                  break;
                case 'IBL Maintenance':
                  fillColor = 'var(--color-red-500)'; // Maintenance
                  statusText = 'Maintenance';
                  break;
                default:
                  fillColor = 'var(--color-slate-500)';
                  statusText = 'Unknown';
              }
            }
          } else {
            statusText = 'Empty';
          }

          return (
            <g key={bayId}>
              <rect
                x={x - 40}
                y={y - 30}
                width="80"
                height="60"
                fill={fillColor}
                stroke="var(--color-gray-300)"
                strokeWidth="2"
                rx="4"
              />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill="var(--color-white)"
                fontSize="12"
                fontWeight="600"
              >
                {bayId}
              </text>
              {bay.train && (
                <>
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="var(--color-cream-100)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {bay.train}
                  </text>
                  <text
                    x={x}
                    y={y + 18}
                    textAnchor="middle"
                    fill="var(--color-cream-100)"
                    fontSize="9"
                  >
                    {statusText}
                  </text>
                </>
              )}
              {!bay.train && bayId !== 'EXIT' && (
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="var(--color-cream-100)"
                  fontSize="10"
                >
                  {statusText}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderStatusLegend = () => (
    <div className="status-legend">
      <h4>Train Status Legend</h4>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-color in-use"></div>
          <span>In Use (Revenue Service)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color standby"></div>
          <span>Standby</span>
        </div>
        <div className="legend-item">
          <div className="legend-color maintenance"></div>
          <span>Maintenance</span>
        </div>
        <div className="legend-item">
          <div className="legend-color exit"></div>
          <span>Exit Point</span>
        </div>
        <div className="legend-item">
          <div className="legend-color empty"></div>
          <span>Empty Bay</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="train-induction-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <Train size={32} />
          Train Induction Planner
        </h2>
        <p className="dashboard-subtitle">Digital Twin Dashboard for Daily Train Induction Optimization</p>
      </div>

      <div className="dashboard-grid">
        {/* Depot Visualization */}
        <div className="dashboard-card">
          <h3 className="card-title">
            <Factory size={20} />
            Depot Layout & Train Positions
          </h3>
          <DepotVisualization />
          {renderStatusLegend()}
          
          <div className="bay-info">
            <h4 className="section-title">Bay Information</h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bay</th>
                    <th>Type</th>
                    <th>Train</th>
                    <th>Exit Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(depotBays).filter(([id]) => id !== 'EXIT').map(([bayId, bay]) => (
                    <tr key={bayId}>
                      <td>{bayId}</td>
                      <td>
                        {bay.type === 'maintenance' ? '🔧 Maintenance' : '🚇 Regular'}
                      </td>
                      <td>{bay.train || 'Empty'}</td>
                      <td>{bay.distance}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="metrics-container">
            <div className="metric-card">
              <div className="metric-label">Total Trains</div>
              <div className="metric-value">{totalTrains}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Eligible</div>
              <div className="metric-value">{eligibleTrains.length}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Working Efficiency</div>
              <div className="metric-value">{successRate}%</div>
            </div>
          </div>
        </div>

        {/* Scoring Breakdown */}
        <div className="dashboard-card">
          <h3 className="card-title">
            📊 Scoring Breakdown
          </h3>
          
          <div className="chart-section">
            <h4 className="chart-title">Scoring Comparison - Top Trains</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-gray-400)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--color-gray-300)', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 30]} tick={{ fill: 'var(--color-gray-400)' }} />
                  {topTrains.map((train, i) => (
                    <Radar
                      key={train.id}
                      name={train.id}
                      dataKey={`train${i}`}
                      stroke={i === 0 ? 'var(--color-teal-300)' : i === 1 ? 'var(--color-teal-400)' : 'var(--color-orange-400)'}
                      fill={i === 0 ? 'var(--color-teal-300)' : i === 1 ? 'var(--color-teal-400)' : 'var(--color-orange-400)'}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Legend wrapperStyle={{ color: 'var(--color-gray-300)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-section">
            <h4 className="chart-title">Total Score Distribution</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-400)" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-gray-300)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--color-gray-300)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-charcoal-700)', 
                      border: '1px solid var(--color-gray-400)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'var(--color-gray-300)' }}
                  />
                  <Bar dataKey="score" fill="var(--color-teal-400)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Shunting Optimization */}
        <div className="dashboard-card">
          <h3 className="card-title">
            <IndianRupee size={20} />
            Shunting Cost Optimization
          </h3>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Train</th>
                  <th>From Bay</th>
                  <th>Distance</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {shuntingData.map((item) => (
                  <tr key={item.train}>
                    <td>{item.train}</td>
                    <td>{item.fromBay}</td>
                    <td>{item.distance}m</td>
                    <td>₹{item.cost.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="chart-section">
            <h4 className="chart-title">Shunting Cost per Train</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={shuntingCostData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-400)" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-gray-300)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--color-gray-300)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-charcoal-700)', 
                      border: '1px solid var(--color-gray-400)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'var(--color-gray-300)' }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Cost']}
                  />
                  <Bar dataKey="cost" fill="var(--color-teal-500)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="metrics-container">
            <div className="metric-card">
              <div className="metric-label">Total Distance</div>
              <div className="metric-value">{totalDistance}m</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Cost</div>
              <div className="metric-value">₹{totalCost.toLocaleString('en-IN')}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg Cost/Train</div>
              <div className="metric-value">₹{avgCost}</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card">
          <h3 className="card-title">
            <AlertCircle size={20} />
            System Status & Performance
          </h3>
          
          <div className="status-section">
            <h4 className="section-title">Validation Statistics</h4>
            <div className="validation-alerts">
              <div className="alert alert-critical">
                ⚠️ <strong>Fitness Certificate</strong>: {trains.filter(t => !t.eligible).length} violations detected
              </div>
              <div className="alert alert-info">
                ℹ️ <strong>Warnings</strong>: {appData.conflicts.filter(c => c.severity === 'High').length} trains requiring attention
              </div>
            </div>
          </div>

          <div className="status-section">
            <h4 className="section-title">Train Status Overview</h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Train ID</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train) => (
                    <tr key={train.id}>
                      <td>{train.id}</td>
                      <td>{train.score.toFixed(1)}</td>
                      <td>
                        <span className={`status-badge ${train.eligible ? 'status-eligible' : 'status-ineligible'}`}>
                          {train.eligible ? <Check size={14} /> : <X size={14} />}
                          {train.eligible ? 'Eligible' : 'Ineligible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainInductionDashboard;