export const appData = {
  users: [
    {
      username: "admin",
      password: "admin123",
      role: "Admin",
      name: "System Administrator",
    },
    {
      username: "supervisor",
      password: "super123",
      role: "Supervisor",
      name: "John Menon",
    },
    {
      username: "maintenance",
      password: "maint123",
      role: "Maintenance Staff",
      name: "Ravi Kumar",
    },
  ],
  trainsets: [
    {
      id: "KM-001",
      status: "Revenue Service",
      bay: "B1",
      fitness: {
        rolling: { valid: true, expiry: "2025-09-30", daysLeft: 4 },
        signal: { valid: true, expiry: "2025-10-05", daysLeft: 9 },
        telecom: { valid: true, expiry: "2025-10-10", daysLeft: 14 },
      },
      jobCards: { open: 0, closed: 5, critical: 0, status: "Clear" },
      branding: {
        wrapId: "BR-001",
        advertiser: "Coca-Cola",
        requiredHours: 8,
        attainedHours: 7.2,
        slaStatus: "Compliant",
        priority: "High",
      },
      mileage: {
        current: 45200,
        target: 45000,
        variance: 200,
        lastOverhaul: 15000,
      },
      cleaning: {
        status: "Completed",
        nextScheduled: "2025-09-30",
        assignedSlot: "Morning",
        crew: "Team A",
      },
      aiRank: 1,
      confidence: 0.98,
    },
    {
      id: "KM-002",
      status: "Standby",
      bay: "A1",
      fitness: {
        rolling: { valid: true, expiry: "2025-09-28", daysLeft: 2 },
        signal: { valid: true, expiry: "2025-09-30", daysLeft: 4 },
        telecom: { valid: true, expiry: "2025-10-05", daysLeft: 9 },
      },
      jobCards: { open: 2, closed: 8, critical: 0, status: "Minor" },
      branding: {
        wrapId: "BR-002",
        advertiser: "Samsung",
        requiredHours: 6,
        attainedHours: 5.8,
        slaStatus: "At Risk",
        priority: "Medium",
      },
      mileage: {
        current: 43800,
        target: 45000,
        variance: -1200,
        lastOverhaul: 13800,
      },
      cleaning: {
        status: "Scheduled",
        nextScheduled: "2025-09-27",
        assignedSlot: "Afternoon",
        crew: "Team B",
      },
      aiRank: 3,
      confidence: 0.92,
    },
    {
      id: "KM-003",
      status: "IBL Maintenance",
      bay: "B2",
      fitness: {
        rolling: { valid: false, expiry: "2025-09-12", daysLeft: -14 },
        signal: { valid: true, expiry: "2025-09-28", daysLeft: 2 },
        telecom: { valid: true, expiry: "2025-10-26", daysLeft: 30 },
      },
      jobCards: { open: 3, closed: 12, critical: 2, status: "Major" },
      branding: {
        wrapId: "BR-003",
        advertiser: "Toyota",
        requiredHours: 4,
        attainedHours: 2.1,
        slaStatus: "Non-Compliant",
        priority: "Low",
      },
      mileage: {
        current: 47500,
        target: 45000,
        variance: 2500,
        lastOverhaul: 17500,
      },
      cleaning: {
        status: "Overdue",
        nextScheduled: "2025-09-28",
        assignedSlot: "Night",
        crew: "Team C",
      },
      aiRank: 5,
      confidence: 0.75,
    },
    {
      id: "KM-004",
      status: "Revenue Service",
      bay: "A2",
      fitness: {
        rolling: { valid: true, expiry: "2025-09-30", daysLeft: 4 },
        signal: { valid: true, expiry: "2025-10-10", daysLeft: 14 },
        telecom: { valid: true, expiry: "2025-10-15", daysLeft: 19 },
      },
      jobCards: { open: 0, closed: 6, critical: 0, status: "Clear" },
      branding: {
        wrapId: "BR-004",
        advertiser: "HDFC Bank",
        requiredHours: 8,
        attainedHours: 8.5,
        slaStatus: "Compliant",
        priority: "High",
      },
      mileage: {
        current: 44800,
        target: 45000,
        variance: -200,
        lastOverhaul: 14800,
      },
      cleaning: {
        status: "Completed",
        nextScheduled: "2025-09-27",
        assignedSlot: "Morning",
        crew: "Team A",
      },
      aiRank: 2,
      confidence: 0.95,
    },
    {
      id: "KM-005",
      status: "IBL Maintenance",
      bay: "C1",
      fitness: {
        rolling: { valid: false, expiry: "2025-09-25", daysLeft: -1 },
        signal: { valid: false, expiry: "2025-09-19", daysLeft: -7 },
        telecom: { valid: false, expiry: "2025-09-23", daysLeft: -3 },
      },
      jobCards: { open: 2, closed: 7, critical: 1, status: "Major" },
      branding: {
        wrapId: "BR-005",
        advertiser: "Pepsi",
        requiredHours: 6,
        attainedHours: 6.2,
        slaStatus: "Compliant",
        priority: "Medium",
      },
      mileage: {
        current: 44200,
        target: 45000,
        variance: -800,
        lastOverhaul: 14200,
      },
      cleaning: {
        status: "Overdue",
        nextScheduled: "2025-09-25",
        assignedSlot: "Afternoon",
        crew: "Team B",
      },
      aiRank: 25,
      confidence: 0.65,
    },
    {
      id: "KM-006",
      status: "Revenue Service",
      bay: "C2",
      fitness: {
        rolling: { valid: true, expiry: "2025-10-15", daysLeft: 19 },
        signal: { valid: true, expiry: "2025-10-12", daysLeft: 16 },
        telecom: { valid: true, expiry: "2025-10-20", daysLeft: 24 },
      },
      jobCards: { open: 0, closed: 3, critical: 0, status: "Clear" },
      branding: {
        wrapId: "BR-006",
        advertiser: "Amazon",
        requiredHours: 7,
        attainedHours: 7.0,
        slaStatus: "Compliant",
        priority: "High",
      },
      mileage: {
        current: 42300,
        target: 45000,
        variance: -2700,
        lastOverhaul: 12300,
      },
      cleaning: {
        status: "Completed",
        nextScheduled: "2025-09-30",
        assignedSlot: "Evening",
        crew: "Team C",
      },
      aiRank: 3,
      confidence: 0.91,
    },
  ],
  conflicts: [
    {
      id: "C001",
      trainId: "KM-003",
      type: "Fitness Certificate",
      severity: "Critical",
      description: "Rolling stock certificate expired",
      suggestion: "Immediate IBL maintenance required",
      impact: "Train unsafe for operation",
    },
    {
      id: "C002",
      trainId: "KM-003",
      type: "Maintenance",
      severity: "Critical",
      description: "2 critical job cards open",
      suggestion: "Complete critical maintenance before service",
      impact: "Safety and reliability risk",
    },
    {
      id: "C003",
      trainId: "KM-005",
      type: "Fitness Certificate",
      severity: "Critical",
      description:
        "All fitness certificates (rolling, signal, telecom) invalid",
      suggestion: "Complete full recertification during IBL maintenance",
      impact: "Train unsafe for operation until certificates renewed",
    },
    {
      id: "C004",
      trainId: "KM-005",
      type: "Maintenance",
      severity: "High",
      description: "Critical job card open",
      suggestion: "Complete critical maintenance before service",
      impact: "Safety and reliability risk",
    },
  ],
  notifications: [
    {
      id: "N001",
      type: "Alert",
      message: "2 trains have certificates expiring within 7 days",
      timestamp: "2025-09-26T08:00:00",
      read: false,
    },
    {
      id: "N002",
      type: "Warning",
      message: "KM-003 requires immediate maintenance attention",
      timestamp: "2025-09-26T07:30:00",
      read: false,
    },
    {
      id: "N003",
      type: "Alert",
      message: "KM-005 requires maintenance: All fitness certificates invalid",
      timestamp: "2025-09-26T07:15:00",
      read: false,
    },
    {
      id: "N004",
      type: "Info",
      message: "Daily induction plan pending approval",
      timestamp: "2025-09-26T06:00:00",
      read: true,
    },
  ],
  // Dashboard data for train induction planner
  // Ordered by status first (Revenue Service, then Standby, then Maintenance), then by AI ranking
  depot: {
    bays: {
      A1: { type: "regular", distance: 85, train: "KM-002", x: 1, y: 3 }, // AI Rank 3 - Standby
      A2: { type: "regular", distance: 75, train: "KM-004", x: 2, y: 3 }, // AI Rank 2 - Revenue Service
      B1: { type: "regular", distance: 65, train: "KM-001", x: 1, y: 2 }, // AI Rank 1 - Revenue Service
      B2: { type: "regular", distance: 55, train: "KM-003", x: 2, y: 2 }, // AI Rank 5 - Maintenance
      C1: { type: "maintenance", distance: 45, train: "KM-005", x: 1, y: 1 }, // AI Rank 25 - Maintenance
      C2: { type: "regular", distance: 35, train: "KM-006", x: 2, y: 1 }, // AI Rank 3 - Revenue Service
      EXIT: { type: "exit", distance: 0, train: null, x: 3, y: 2 },
    },
    connections: [
      ["A1", "A2"],
      ["A1", "B1"],
      ["A2", "B2"],
      ["B1", "B2"],
      ["B1", "C1"],
      ["B2", "C2"],
      ["B2", "EXIT"],
      ["C1", "C2"],
      ["C2", "EXIT"],
    ],
  },
  shuntingOptimization: [
    // Ordered by status (Revenue Service first), then by AI rank
    { train: "KM-001", fromBay: "B1", distance: 65, cost: 1350 }, // Revenue Service, AI Rank 1
    { train: "KM-004", fromBay: "A2", distance: 75, cost: 1550 }, // Revenue Service, AI Rank 2
    { train: "KM-006", fromBay: "C2", distance: 35, cost: 800 }, // Revenue Service, AI Rank 3
    { train: "KM-002", fromBay: "A1", distance: 85, cost: 1750 }, // Standby, AI Rank 3
    { train: "KM-003", fromBay: "B2", distance: 55, cost: 1120 }, // IBL Maintenance, AI Rank 5
    { train: "KM-005", fromBay: "C1", distance: 45, cost: 950 }, // IBL Maintenance, AI Rank 25
  ],
};
