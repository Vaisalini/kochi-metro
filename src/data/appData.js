export const appData = {
  users: [
    {username: "admin", password: "admin123", role: "Admin", name: "System Administrator"},
    {username: "supervisor", password: "super123", role: "Supervisor", name: "John Menon"},
    {username: "maintenance", password: "maint123", role: "Maintenance Staff", name: "Ravi Kumar"}
  ],
  trainsets: [
    {
      id: "KM-001", 
      status: "Revenue Service", 
      bay: "A1", 
      fitness: {
        rolling: {valid: true, expiry: "2025-09-20", daysLeft: 6},
        signal: {valid: true, expiry: "2025-09-22", daysLeft: 8},
        telecom: {valid: true, expiry: "2025-09-18", daysLeft: 4}
      },
      jobCards: {open: 0, closed: 5, critical: 0, status: "Clear"},
      branding: {
        wrapId: "BR-001",
        advertiser: "Coca-Cola",
        requiredHours: 8,
        attainedHours: 7.2,
        slaStatus: "Compliant",
        priority: "High"
      },
      mileage: {current: 45200, target: 45000, variance: 200, lastOverhaul: 15000},
      cleaning: {
        status: "Completed",
        nextScheduled: "2025-09-16",
        assignedSlot: "Morning",
        crew: "Team A"
      },
      aiRank: 1,
      confidence: 0.95
    },
    {
      id: "KM-002",
      status: "Standby",
      bay: "A2",
      fitness: {
        rolling: {valid: true, expiry: "2025-09-25", daysLeft: 11},
        signal: {valid: true, expiry: "2025-09-20", daysLeft: 6},
        telecom: {valid: false, expiry: "2025-09-13", daysLeft: -1}
      },
      jobCards: {open: 1, closed: 8, critical: 0, status: "Minor"},
      branding: {
        wrapId: "BR-002",
        advertiser: "Samsung",
        requiredHours: 6,
        attainedHours: 5.8,
        slaStatus: "At Risk",
        priority: "Medium"
      },
      mileage: {current: 43800, target: 45000, variance: -1200, lastOverhaul: 13800},
      cleaning: {
        status: "Scheduled",
        nextScheduled: "2025-09-15",
        assignedSlot: "Afternoon",
        crew: "Team B"
      },
      aiRank: 5,
      confidence: 0.88
    },
    {
      id: "KM-003",
      status: "IBL Maintenance",
      bay: "B3",
      fitness: {
        rolling: {valid: false, expiry: "2025-09-12", daysLeft: -2},
        signal: {valid: true, expiry: "2025-09-28", daysLeft: 14},
        telecom: {valid: true, expiry: "2025-09-26", daysLeft: 12}
      },
      jobCards: {open: 3, closed: 12, critical: 2, status: "Major"},
      branding: {
        wrapId: "BR-003",
        advertiser: "Toyota",
        requiredHours: 4,
        attainedHours: 2.1,
        slaStatus: "Non-Compliant",
        priority: "Low"
      },
      mileage: {current: 47500, target: 45000, variance: 2500, lastOverhaul: 17500},
      cleaning: {
        status: "Overdue",
        nextScheduled: "2025-09-14",
        assignedSlot: "Night",
        crew: "Team C"
      },
      aiRank: 25,
      confidence: 0.99
    },
    {
      id: "KM-004",
      status: "Revenue Service",
      bay: "A4",
      fitness: {
        rolling: {valid: true, expiry: "2025-09-30", daysLeft: 16},
        signal: {valid: true, expiry: "2025-09-24", daysLeft: 10},
        telecom: {valid: true, expiry: "2025-09-21", daysLeft: 7}
      },
      jobCards: {open: 0, closed: 6, critical: 0, status: "Clear"},
      branding: {
        wrapId: "BR-004",
        advertiser: "HDFC Bank",
        requiredHours: 8,
        attainedHours: 8.5,
        slaStatus: "Compliant",
        priority: "High"
      },
      mileage: {current: 44800, target: 45000, variance: -200, lastOverhaul: 14800},
      cleaning: {
        status: "Completed",
        nextScheduled: "2025-09-17",
        assignedSlot: "Morning",
        crew: "Team A"
      },
      aiRank: 2,
      confidence: 0.93
    },
    {
      id: "KM-005",
      status: "Revenue Service",
      bay: "A5",
      fitness: {
        rolling: {valid: true, expiry: "2025-09-27", daysLeft: 13},
        signal: {valid: true, expiry: "2025-09-19", daysLeft: 5},
        telecom: {valid: true, expiry: "2025-09-23", daysLeft: 9}
      },
      jobCards: {open: 1, closed: 7, critical: 0, status: "Minor"},
      branding: {
        wrapId: "BR-005",
        advertiser: "Pepsi",
        requiredHours: 6,
        attainedHours: 6.2,
        slaStatus: "Compliant",
        priority: "Medium"
      },
      mileage: {current: 44200, target: 45000, variance: -800, lastOverhaul: 14200},
      cleaning: {
        status: "Completed",
        nextScheduled: "2025-09-18",
        assignedSlot: "Afternoon",
        crew: "Team B"
      },
      aiRank: 3,
      confidence: 0.91
    }
  ],
  conflicts: [
    {
      id: "C001",
      trainId: "KM-002",
      type: "Fitness Certificate",
      severity: "High",
      description: "Telecom certificate expired",
      suggestion: "Renew telecom certificate immediately or move to IBL",
      impact: "Cannot operate in revenue service"
    },
    {
      id: "C002",
      trainId: "KM-003",
      type: "Fitness Certificate",
      severity: "Critical",
      description: "Rolling stock certificate expired",
      suggestion: "Immediate IBL maintenance required",
      impact: "Train unsafe for operation"
    },
    {
      id: "C003",
      trainId: "KM-003",
      type: "Maintenance",
      severity: "Critical",
      description: "2 critical job cards open",
      suggestion: "Complete critical maintenance before service",
      impact: "Safety and reliability risk"
    }
  ],
  notifications: [
    {
      id: "N001",
      type: "Alert",
      message: "3 trains have certificates expiring within 7 days",
      timestamp: "2025-09-14T20:00:00",
      read: false
    },
    {
      id: "N002",
      type: "Warning",
      message: "KM-003 requires immediate maintenance attention",
      timestamp: "2025-09-14T19:30:00",
      read: false
    },
    {
      id: "N003",
      type: "Info",
      message: "Daily induction plan pending approval",
      timestamp: "2025-09-14T19:00:00",
      read: true
    }
  ],
  // Dashboard data for train induction planner
  // Ordered by AI ranking: KM-002 (rank 1), KM-004 (rank 2), KM-001 (rank 3), KM-003 (rank 5), KM-005 (rank 25), KM-006 (no rank)
  depot: {
    bays: {
      'A1': { type: 'regular', distance: 85, train: 'KM-002', x: 1, y: 3 }, // AI Rank 1 - Revenue Service
      'A2': { type: 'regular', distance: 75, train: 'KM-004', x: 2, y: 3 }, // AI Rank 2 - Standby
      'B1': { type: 'regular', distance: 65, train: 'KM-001', x: 1, y: 2 }, // AI Rank 3 - Revenue Service
      'B2': { type: 'regular', distance: 55, train: 'KM-003', x: 2, y: 2 }, // AI Rank 5 - Standby
      'C1': { type: 'maintenance', distance: 45, train: 'KM-005', x: 1, y: 1 }, // AI Rank 25 - IBL Maintenance
      'C2': { type: 'regular', distance: 35, train: 'KM-006', x: 2, y: 1 }, // No rank - Revenue Service
      'EXIT': { type: 'exit', distance: 0, train: null, x: 3, y: 2 }
    },
    connections: [
      ['A1', 'A2'], ['A1', 'B1'], ['A2', 'B2'],
      ['B1', 'B2'], ['B1', 'C1'], ['B2', 'C2'], ['B2', 'EXIT'],
      ['C1', 'C2'], ['C2', 'EXIT']
    ]
  },
  shuntingOptimization: [
    { train: 'KM-002', fromBay: 'A1', distance: 85, cost: 1750 }, // AI Rank 1
    { train: 'KM-004', fromBay: 'A2', distance: 75, cost: 1550 }, // AI Rank 2
    { train: 'KM-001', fromBay: 'B1', distance: 65, cost: 1350 }, // AI Rank 3
    { train: 'KM-003', fromBay: 'B2', distance: 55, cost: 1120 }, // AI Rank 5
    { train: 'KM-005', fromBay: 'C1', distance: 45, cost: 950 },  // AI Rank 25
    { train: 'KM-006', fromBay: 'C2', distance: 35, cost: 800 }   // No rank
  ]
};