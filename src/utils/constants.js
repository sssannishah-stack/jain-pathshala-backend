// src/utils/constants.js

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Approval status
const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Gatha types
const GATHA_TYPES = {
  NEW: 'new',
  REVISION: 'revision'
};

// Sutra list
const SUTRA_LIST = [
  { id: 'namokar_mantra', name: 'Namokar Mantra', nameHi: 'णमोकार मंत्र', nameGu: 'ણમોકાર મંત્ર' },
  { id: 'pratikraman_sutra', name: 'Pratikraman Sutra', nameHi: 'प्रतिक्रमण सूत्र', nameGu: 'પ્રતિક્રમણ સૂત્ર' },
  { id: 'samayik_sutra', name: 'Samayik Sutra', nameHi: 'सामायिक सूत्र', nameGu: 'સામાયિક સૂત્ર' },
  { id: 'bhaktamar_stotra', name: 'Bhaktamar Stotra', nameHi: 'भक्तामर स्तोत्र', nameGu: 'ભક્તામર સ્તોત્ર' },
  { id: 'kalyan_mandir_stotra', name: 'Kalyan Mandir Stotra', nameHi: 'कल्याण मंदिर स्तोत्र', nameGu: 'કલ્યાણ મંદિર સ્તોત્ર' },
  { id: 'logassa_sutra', name: 'Logassa Sutra', nameHi: 'लोगस्स सूत्र', nameGu: 'લોગસ્સ સૂત્ર' },
  { id: 'uvasagharam_stotra', name: 'Uvasagharam Stotra', nameHi: 'उवसग्गहरं स्तोत्र', nameGu: 'ઉવસગ્ગહરં સ્તોત્ર' },
  { id: 'dashvaikalik_sutra', name: 'Dashvaikalik Sutra', nameHi: 'दशवैकालिक सूत्र', nameGu: 'દશવૈકાલિક સૂત્ર' },
  { id: 'uttaradhyayan_sutra', name: 'Uttaradhyayan Sutra', nameHi: 'उत्तराध्ययन सूत्र', nameGu: 'ઉત્તરાધ્યયન સૂત્ર' },
  { id: 'other', name: 'Other', nameHi: 'अन्य', nameGu: 'અન્ય' }
];

// Months for reports
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ALREADY_EXISTS: 'Record already exists',
  NOT_FOUND: 'Record not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error'
};

// Success messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  ATTENDANCE_MARKED: 'Attendance marked successfully',
  GATHA_ADDED: 'Gatha added successfully',
  APPROVED: 'Approved successfully',
  REJECTED: 'Rejected successfully',
  DELETED: 'Deleted successfully',
  UPDATED: 'Updated successfully'
};

module.exports = {
  USER_ROLES,
  APPROVAL_STATUS,
  GATHA_TYPES,
  SUTRA_LIST,
  MONTHS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
