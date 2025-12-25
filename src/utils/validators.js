// src/utils/validators.js

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields
const validateRequired = (data, requiredFields) => {
  const errors = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`${field} is required`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate attendance data
const validateAttendance = (data) => {
  const requiredFields = ['memberId', 'memberName', 'date'];
  return validateRequired(data, requiredFields);
};

// Validate gatha data
const validateGatha = (data) => {
  const errors = [];
  
  // Required fields
  const requiredFields = ['memberId', 'memberName', 'type', 'sutraName', 'gathaNo', 'totalGatha'];
  const { isValid, errors: requiredErrors } = validateRequired(data, requiredFields);
  errors.push(...requiredErrors);
  
  // Validate type
  if (data.type && !['new', 'revision'].includes(data.type)) {
    errors.push('Invalid gatha type');
  }
  
  // Validate numbers
  if (data.gathaNo && (isNaN(data.gathaNo) || data.gathaNo < 1)) {
    errors.push('Gatha number must be a positive number');
  }
  
  if (data.totalGatha && (isNaN(data.totalGatha) || data.totalGatha < 1)) {
    errors.push('Total gatha must be a positive number');
  }
  
  if (data.gathaNo && data.totalGatha && data.gathaNo > data.totalGatha) {
    errors.push('Gatha number cannot be greater than total gatha');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate member data
const validateMember = (data) => {
  const errors = [];
  
  if (!data.name || !data.name.trim()) {
    errors.push('Member name is required');
  }
  
  if (data.name && data.name.length < 2) {
    errors.push('Member name must be at least 2 characters');
  }
  
  if (data.name && data.name.length > 50) {
    errors.push('Member name cannot exceed 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate date format (YYYY-MM-DD)
const isValidDateFormat = (dateStr) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

// Validate pagination params
const validatePagination = (page, limit) => {
  const errors = [];
  
  if (page && (isNaN(page) || page < 1)) {
    errors.push('Page must be a positive number');
  }
  
  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20
  };
};

module.exports = {
  isValidEmail,
  validateRequired,
  validateAttendance,
  validateGatha,
  validateMember,
  isValidDateFormat,
  validatePagination
};
