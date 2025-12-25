// src/config/languages.js
const translations = {
  en: {
    // Common
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    
    // Greetings
    greeting: 'Jai Jinendra',
    welcome: 'Welcome',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    loginSuccess: 'Login successful!',
    loginError: 'Invalid email or password',
    logoutSuccess: 'Logged out successfully',
    
    // Navigation
    dashboard: 'Dashboard',
    history: 'History',
    students: 'Students',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'Profile',
    
    // Member
    selectMember: 'Select Member',
    members: 'Members',
    addMember: 'Add Member',
    memberName: 'Member Name',
    
    // Attendance
    attendance: 'Attendance',
    markAttendance: 'Mark Attendance',
    markPresent: 'Mark Present',
    todayDate: "Today's Date",
    alreadyMarked: 'Attendance already marked for today',
    attendanceMarked: 'Attendance marked! Waiting for admin approval.',
    attendanceApproved: 'Attendance approved',
    attendanceRejected: 'Attendance rejected',
    
    // Gatha
    gatha: 'Gatha',
    addGatha: 'Add Gatha',
    newGatha: 'New',
    revision: 'Revision',
    sutraName: 'Sutra Name',
    gathaNumber: 'Gatha Number',
    totalGatha: 'Total Gatha',
    selectSutra: 'Select Sutra',
    enterSutraName: 'Enter sutra name',
    gathaAdded: 'Gatha added! Waiting for admin approval.',
    
    // Status
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    
    // Admin
    pendingApprovals: 'Pending Approvals',
    approve: 'Approve',
    reject: 'Reject',
    approveAll: 'Approve All',
    noPending: 'No pending records',
    
    // Reports
    monthlyReport: 'Monthly Report',
    gathaProgress: 'Gatha Progress',
    exportPdf: 'Export PDF',
    exportExcel: 'Export Excel',
    daysPresent: 'Days Present',
    totalNewGatha: 'Total New Gatha',
    totalRevision: 'Total Revision',
    
    // Sutras
    sutras: {
      namokarMantra: 'Namokar Mantra',
      pratikramanSutra: 'Pratikraman Sutra',
      samayikSutra: 'Samayik Sutra',
      bhaktamarStotra: 'Bhaktamar Stotra',
      kalyanMandirStotra: 'Kalyan Mandir Stotra',
      logassaSutra: 'Logassa Sutra',
      uvasagharamStotra: 'Uvasagharam Stotra',
      dashvaikalikSutra: 'Dashvaikalik Sutra',
      uttaradhyayanSutra: 'Uttaradhyayan Sutra',
      other: 'Other'
    },
    
    // Errors
    selectMemberFirst: 'Please select a member first',
    fillAllFields: 'Please fill all fields',
    somethingWentWrong: 'Something went wrong',
    unauthorized: 'Unauthorized access',
    notFound: 'Not found'
  },
  
  hi: {
    // Common
    success: 'सफल',
    error: 'त्रुटि',
    loading: 'लोड हो रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    submit: 'जमा करें',
    back: 'वापस',
    next: 'आगे',
    close: 'बंद करें',
    
    // Greetings
    greeting: 'जय जिनेन्द्र',
    welcome: 'स्वागत है',
    
    // Auth
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    loginSuccess: 'लॉगिन सफल!',
    loginError: 'गलत ईमेल या पासवर्ड',
    logoutSuccess: 'सफलतापूर्वक लॉगआउट',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    history: 'इतिहास',
    students: 'विद्यार्थी',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',
    
    // Member
    selectMember: 'सदस्य चुनें',
    members: 'सदस्य',
    addMember: 'सदस्य जोड़ें',
    memberName: 'सदस्य का नाम',
    
    // Attendance
    attendance: 'उपस्थिति',
    markAttendance: 'उपस्थिति दर्ज करें',
    markPresent: 'उपस्थित दर्ज करें',
    todayDate: 'आज की तारीख',
    alreadyMarked: 'आज की उपस्थिति पहले से दर्ज है',
    attendanceMarked: 'उपस्थिति दर्ज! व्यवस्थापक की स्वीकृति की प्रतीक्षा है।',
    attendanceApproved: 'उपस्थिति स्वीकृत',
    attendanceRejected: 'उपस्थिति अस्वीकृत',
    
    // Gatha
    gatha: 'गाथा',
    addGatha: 'गाथा जोड़ें',
    newGatha: 'नई',
    revision: 'दोहराई',
    sutraName: 'सूत्र का नाम',
    gathaNumber: 'गाथा संख्या',
    totalGatha: 'कुल गाथा',
    selectSutra: 'सूत्र चुनें',
    enterSutraName: 'सूत्र का नाम लिखें',
    gathaAdded: 'गाथा जोड़ी गई! व्यवस्थापक की स्वीकृति की प्रतीक्षा है।',
    
    // Status
    pending: 'लंबित',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    
    // Admin
    pendingApprovals: 'लंबित स्वीकृतियां',
    approve: 'स्वीकृत करें',
    reject: 'अस्वीकृत करें',
    approveAll: 'सभी स्वीकृत करें',
    noPending: 'कोई लंबित रिकॉर्ड नहीं',
    
    // Reports
    monthlyReport: 'मासिक रिपोर्ट',
    gathaProgress: 'गाथा प्रगति',
    exportPdf: 'PDF डाउनलोड करें',
    exportExcel: 'Excel डाउनलोड करें',
    daysPresent: 'उपस्थित दिन',
    totalNewGatha: 'कुल नई गाथा',
    totalRevision: 'कुल दोहराई',
    
    // Sutras
    sutras: {
      namokarMantra: 'णमोकार मंत्र',
      pratikramanSutra: 'प्रतिक्रमण सूत्र',
      samayikSutra: 'सामायिक सूत्र',
      bhaktamarStotra: 'भक्तामर स्तोत्र',
      kalyanMandirStotra: 'कल्याण मंदिर स्तोत्र',
      logassaSutra: 'लोगस्स सूत्र',
      uvasagharamStotra: 'उवसग्गहरं स्तोत्र',
      dashvaikalikSutra: 'दशवैकालिक सूत्र',
      uttaradhyayanSutra: 'उत्तराध्ययन सूत्र',
      other: 'अन्य'
    },
    
    // Errors
    selectMemberFirst: 'कृपया पहले सदस्य चुनें',
    fillAllFields: 'कृपया सभी फ़ील्ड भरें',
    somethingWentWrong: 'कुछ गलत हो गया',
    unauthorized: 'अनधिकृत पहुंच',
    notFound: 'नहीं मिला'
  },
  
  gu: {
    // Common
    success: 'સફળ',
    error: 'ભૂલ',
    loading: 'લોડ થઈ રહ્યું છે...',
    save: 'સાચવો',
    cancel: 'રદ કરો',
    delete: 'કાઢી નાખો',
    edit: 'સંપાદિત કરો',
    add: 'ઉમેરો',
    submit: 'સબમિટ કરો',
    back: 'પાછળ',
    next: 'આગળ',
    close: 'બંધ કરો',
    
    // Greetings
    greeting: 'જય જિનેન્દ્ર',
    welcome: 'સ્વાગત છે',
    
    // Auth
    login: 'લૉગિન',
    logout: 'લૉગઆઉટ',
    email: 'ઇમેઇલ',
    password: 'પાસવર્ડ',
    loginSuccess: 'લૉગિન સફળ!',
    loginError: 'ખોટો ઇમેઇલ અથવા પાસવર્ડ',
    logoutSuccess: 'સફળતાપૂર્વક લૉગઆઉટ',
    
    // Navigation
    dashboard: 'ડેશબોર્ડ',
    history: 'ઇતિહાસ',
    students: 'વિદ્યાર્થીઓ',
    reports: 'રિપોર્ટ',
    settings: 'સેટિંગ્સ',
    profile: 'પ્રોફાઇલ',
    
    // Member
    selectMember: 'સભ્ય પસંદ કરો',
    members: 'સભ્યો',
    addMember: 'સભ્ય ઉમેરો',
    memberName: 'સભ્યનું નામ',
    
    // Attendance
    attendance: 'હાજરી',
    markAttendance: 'હાજરી નોંધો',
    markPresent: 'હાજર નોંધો',
    todayDate: 'આજની તારીખ',
    alreadyMarked: 'આજની હાજરી પહેલેથી નોંધાયેલ છે',
    attendanceMarked: 'હાજરી નોંધાઈ! એડમિનની મંજૂરીની રાહ જોવામાં આવી રહી છે.',
    attendanceApproved: 'હાજરી મંજૂર',
    attendanceRejected: 'હાજરી નામંજૂર',
    
    // Gatha
    gatha: 'ગાથા',
    addGatha: 'ગાથા ઉમેરો',
    newGatha: 'નવી',
    revision: 'પુનરાવર્તન',
    sutraName: 'સૂત્રનું નામ',
    gathaNumber: 'ગાથા નંબર',
    totalGatha: 'કુલ ગાથા',
    selectSutra: 'સૂત્ર પસંદ કરો',
    enterSutraName: 'સૂત્રનું નામ લખો',
    gathaAdded: 'ગાથા ઉમેરાઈ! એડમિનની મંજૂરીની રાહ જોવામાં આવી રહી છે.',
    
    // Status
    pending: 'બાકી',
    approved: 'મંજૂર',
    rejected: 'નામંજૂર',
    
    // Admin
    pendingApprovals: 'બાકી મંજૂરીઓ',
    approve: 'મંજૂર કરો',
    reject: 'નામંજૂર કરો',
    approveAll: 'બધું મંજૂર કરો',
    noPending: 'કોઈ બાકી રેકોર્ડ નથી',
    
    // Reports
    monthlyReport: 'માસિક રિપોર્ટ',
    gathaProgress: 'ગાથા પ્રગતિ',
    exportPdf: 'PDF ડાઉનલોડ કરો',
    exportExcel: 'Excel ડાઉનલોડ કરો',
    daysPresent: 'હાજર દિવસો',
    totalNewGatha: 'કુલ નવી ગાથા',
    totalRevision: 'કુલ પુનરાવર્તન',
    
    // Sutras
    sutras: {
      namokarMantra: 'ણમોકાર મંત્ર',
      pratikramanSutra: 'પ્રતિક્રમણ સૂત્ર',
      samayikSutra: 'સામાયિક સૂત્ર',
      bhaktamarStotra: 'ભક્તામર સ્તોત્ર',
      kalyanMandirStotra: 'કલ્યાણ મંદિર સ્તોત્ર',
      logassaSutra: 'લોગસ્સ સૂત્ર',
      uvasagharamStotra: 'ઉવસગ્ગહરં સ્તોત્ર',
      dashvaikalikSutra: 'દશવૈકાલિક સૂત્ર',
      uttaradhyayanSutra: 'ઉત્તરાધ્યયન સૂત્ર',
      other: 'અન્ય'
    },
    
    // Errors
    selectMemberFirst: 'કૃપા કરીને પહેલા સભ્ય પસંદ કરો',
    fillAllFields: 'કૃપા કરીને બધા ફીલ્ડ ભરો',
    somethingWentWrong: 'કંઈક ખોટું થયું',
    unauthorized: 'અનધિકૃત ઍક્સેસ',
    notFound: 'મળ્યું નથી'
  }
};

// Get translation
const getTranslation = (lang = 'en') => {
  return translations[lang] || translations.en;
};

// Get specific text
const getText = (key, lang = 'en') => {
  const t = translations[lang] || translations.en;
  const keys = key.split('.');
  let result = t;
  
  for (const k of keys) {
    result = result?.[k];
  }
  
  return result || key;
};

// Supported languages
const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
];

module.exports = {
  translations,
  getTranslation,
  getText,
  supportedLanguages
};
