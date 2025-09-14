// Date formatting utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN');
};

export const getDaysLeft = (expiryDate) => {
  const today = new Date('2025-09-14'); // Fixed date for demo
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Train status utilities
export const getTrainStatusClass = (status) => {
  switch (status) {
    case 'Revenue Service':
      return 'revenue';
    case 'Standby':
      return 'standby';
    case 'IBL Maintenance':
      return 'maintenance';
    default:
      return '';
  }
};

export const getCertificateStatusClass = (certificate) => {
  if (!certificate.valid) return 'critical';
  if (certificate.daysLeft <= 3) return 'critical';
  if (certificate.daysLeft <= 7) return 'warning';
  return 'good';
};

// Data filtering utilities
export const filterTrainsBySearch = (trains, searchTerm) => {
  if (!searchTerm) return trains;
  return trains.filter(train => 
    train.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterTrainsByBay = (trains, bayFilter) => {
  if (!bayFilter) return trains;
  return trains.filter(train => train.bay.startsWith(bayFilter));
};

export const filterTrainsByStatus = (trains, statusFilter) => {
  if (!statusFilter) return trains;
  return trains.filter(train => train.status === statusFilter);
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};