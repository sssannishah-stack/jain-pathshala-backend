const SUPPORTED_LANGUAGES = ['hindi', 'english', 'gujarati'];
const DEFAULT_LANGUAGE = 'hindi';

const TRANSLATIONS = {
  hindi: {
    welcome: 'स्वागत है',
    attendance_marked: 'उपस्थिति दर्ज की गई',
    error: 'त्रुटि हुई'
  },
  english: {
    welcome: 'Welcome',
    attendance_marked: 'Attendance marked',
    error: 'An error occurred'
  },
  gujarati: {
    welcome: 'સ્વાગત છે',
    attendance_marked: 'હાજરી નોંધાઈ',
    error: 'ભૂલ થઈ'
  }
};

module.exports = { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, TRANSLATIONS };
