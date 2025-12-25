// src/utils/helpers.js

// Format date to YYYY-MM-DD
const formatDate = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get start and end of month
const getMonthRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  };
};

// Get current month and year
const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
};

// Generate unique ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate percentage
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Group array by key
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Sort array by date
const sortByDate = (array, dateKey = 'date', order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

// Get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

// Format number with leading zeros
const padNumber = (num, size = 2) => {
  return String(num).padStart(size, '0');
};

// Capitalize first letter
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Sanitize string for file names
const sanitizeFileName = (str) => {
  return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
};

// Parse date string to Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};

// Check if date is today
const isToday = (dateStr) => {
  const today = formatDate();
  return dateStr === today;
};

// Get week number
const getWeekNumber = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

module.exports = {
  formatDate,
  getMonthRange,
  getCurrentMonthYear,
  generateId,
  calculatePercentage,
  groupBy,
  sortByDate,
  getDaysInMonth,
  padNumber,
  capitalize,
  sanitizeFileName,
  parseDate,
  isToday,
  getWeekNumber
};
