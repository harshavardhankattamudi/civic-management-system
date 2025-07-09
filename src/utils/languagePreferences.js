// Language preferences and translations
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'మరాఠీ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

// Translations for the application
export const translations = {
  en: {
    // Header
    appTitle: 'Indian Civic Issue Reporter',
    citizenMode: 'Citizen',
    adminMode: 'Admin',
    
    // Navigation
    issues: 'Issues',
    mapView: 'Map View',
    dashboard: 'Dashboard',
    
    // Report Form
    reportIssue: 'Report Civic Issue',
    issueType: 'Issue Type',
    selectIssueType: 'Select Issue Type',
    title: 'Title',
    description: 'Description',
    location: 'Location',
    municipality: 'Municipality',
    selectMunicipality: 'Select Municipality',
    priority: 'Priority',
    selectPriority: 'Select Priority',
    citizenInfo: 'Citizen Information',
    name: 'Name',
    enterFullName: 'Enter your full name',
    phoneNumber: 'Phone Number',
    email: 'Email (Optional)',
    useCurrentLocation: 'Use Current Location',
    photoOptional: 'Photo (Optional)',
    submit: 'Submit Report',
    cancel: 'Cancel',
    
    // Categories
    waterSupply: '🚰 Water Supply',
    electricity: '⚡ Electricity',
    roads: '🛣️ Roads',
    drainage: '💧 Drainage',
    garbage: '🗑️ Garbage',
    streetlight: '💡 Streetlight',
    traffic: '🚦 Traffic',
    sanitation: '🚽 Sanitation',
    parks: '🌳 Parks',
    publicTransport: '🚌 Public Transport',
    noisePollution: '🔊 Noise Pollution',
    airPollution: '🌫️ Air Pollution',
    waterPollution: '🌊 Water Pollution',
    encroachment: '🏗️ Encroachment',
    streetVendors: '🛒 Street Vendors',
    parking: '🅿️ Parking',
    publicToilets: '🚻 Public Toilets',
    other: '📋 Other',
    
    // Status
    submitted: 'Submitted',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    
    // Validation
    titleRequired: 'Title is required',
    categoryRequired: 'Please select an issue type',
    descriptionRequired: 'Description is required',
    locationRequired: 'Location is required',
    municipalityRequired: 'Please select municipality',
    nameRequired: 'Name is required',
    phoneRequired: 'Phone number is required',
    
    // Map
    filter: 'Filter',
    allStatus: 'All Status',
    allMunicipalities: 'All Municipalities',
    legend: 'Legend',
    search: 'Search...',
    
    // Admin
    adminDashboard: 'Municipality Administration',
    manageIssues: 'Manage and resolve issues',
    total: 'Total',
    resolved: 'Resolved',
    inProgress: 'In Progress',
    pending: 'Pending',
    updateStatus: 'Update Status',
    newStatus: 'New Status',
    comment: 'Comment (Optional)',
    addComment: 'Add a comment about the update...',
    update: 'Update',
    noReports: 'No reports found',
    status: 'Status'
  },
  
  hi: {
    // Header
    appTitle: 'भारतीय नागरिक समस्या रिपोर्टर',
    citizenMode: 'नागरिक',
    adminMode: 'प्रशासक',
    
    // Navigation
    issues: 'समस्याएं',
    mapView: 'मानचित्र दृश्य',
    dashboard: 'डैशबोर्ड',
    
    // Report Form
    reportIssue: 'नागरिक समस्या रिपोर्ट करें',
    issueType: 'समस्या का प्रकार',
    selectIssueType: 'समस्या का प्रकार चुनें',
    title: 'शीर्षक',
    description: 'विवरण',
    location: 'स्थान',
    municipality: 'नगर पालिका',
    selectMunicipality: 'नगर पालिका चुनें',
    priority: 'प्राथमिकता',
    selectPriority: 'प्राथमिकता चुनें',
    citizenInfo: 'नागरिक की जानकारी',
    name: 'नाम',
    enterFullName: 'अपना पूरा नाम दर्ज करें',
    phoneNumber: 'फोन नंबर',
    email: 'ईमेल (वैकल्पिक)',
    useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
    photoOptional: 'फोटो (वैकल्पिक)',
    submit: 'रिपोर्ट जमा करें',
    cancel: 'रद्द करें',
    
    // Categories
    waterSupply: '🚰 पानी की आपूर्ति',
    electricity: '⚡ बिजली',
    roads: '🛣️ सड़कें',
    drainage: '💧 नाली',
    garbage: '🗑️ कचरा',
    streetlight: '💡 स्ट्रीट लाइट',
    traffic: '🚦 यातायात',
    sanitation: '🚽 स्वच्छता',
    parks: '🌳 पार्क',
    publicTransport: '🚌 सार्वजनिक परिवहन',
    noisePollution: '🔊 ध्वनि प्रदूषण',
    airPollution: '🌫️ वायु प्रदूषण',
    waterPollution: '🌊 जल प्रदूषण',
    encroachment: '🏗️ अतिक्रमण',
    streetVendors: '🛒 फुटपाथ विक्रेता',
    parking: '🅿️ पार्किंग',
    publicToilets: '🚻 सार्वजनिक शौचालय',
    other: '📋 अन्य',
    
    // Status
    submitted: 'जमा किया गया',
    inProgress: 'कार्य जारी',
    resolved: 'समाधान हो गया',
    rejected: 'अस्वीकृत',
    
    // Validation
    titleRequired: 'शीर्षक आवश्यक है',
    categoryRequired: 'कृपया समस्या का प्रकार चुनें',
    descriptionRequired: 'विवरण आवश्यक है',
    locationRequired: 'स्थान आवश्यक है',
    municipalityRequired: 'कृपया नगर पालिका चुनें',
    nameRequired: 'नाम आवश्यक है',
    phoneRequired: 'फोन नंबर आवश्यक है',
    
    // Map
    filter: 'फिल्टर',
    allStatus: 'सभी स्थिति',
    allMunicipalities: 'सभी नगर पालिकाएं',
    legend: 'सूची',
    search: 'खोजें...',
    
    // Admin
    adminDashboard: 'नगर पालिका प्रशासन',
    manageIssues: 'समस्याओं का प्रबंधन और समाधान',
    total: 'कुल',
    resolved: 'समाधान',
    inProgress: 'कार्य जारी',
    pending: 'लंबित',
    updateStatus: 'स्थिति अपडेट करें',
    newStatus: 'नई स्थिति',
    comment: 'टिप्पणी (वैकल्पिक)',
    addComment: 'अपडेट के बारे में टिप्पणी दें...',
    update: 'अपडेट करें',
    noReports: 'कोई रिपोर्ट नहीं मिली',
    status: 'स्थिति'
  },
  ta: {
    // Tamil translations (add real ones later)
  },
  te: {
    // Telugu translations (add real ones later)
  },
  bn: {
    // Bengali translations (add real ones later)
  },
  mr: {
    // Marathi translations (add real ones later)
  },
  gu: {
    // Gujarati translations (add real ones later)
  },
  kn: {
    // Kannada translations (add real ones later)
  },
  ml: {
    // Malayalam translations (add real ones later)
  },
  pa: {
    // Punjabi translations (add real ones later)
  }
};

// Function to get translation
export const getTranslation = (language, key) => {
  if (translations[language] && translations[language][key]) {
    return translations[language][key];
  }
  if (translations.en[key]) {
    return translations.en[key];
  }
  return key;
};

// Function to get current language from localStorage
export const getCurrentLanguage = () => {
  return localStorage.getItem('preferredLanguage') || 'en';
};

// Function to set language preference
export const setLanguagePreference = (language) => {
  localStorage.setItem('preferredLanguage', language);
};

// Function to get issue categories in selected language
export const getIssueCategories = (language) => {
  const lang = getTranslation(language, 'selectIssueType');
  return [
    { value: '', label: lang },
    { value: 'water_supply', label: getTranslation(language, 'waterSupply') },
    { value: 'electricity', label: getTranslation(language, 'electricity') },
    { value: 'roads', label: getTranslation(language, 'roads') },
    { value: 'drainage', label: getTranslation(language, 'drainage') },
    { value: 'garbage', label: getTranslation(language, 'garbage') },
    { value: 'streetlight', label: getTranslation(language, 'streetlight') },
    { value: 'traffic', label: getTranslation(language, 'traffic') },
    { value: 'sanitation', label: getTranslation(language, 'sanitation') },
    { value: 'parks', label: getTranslation(language, 'parks') },
    { value: 'public_transport', label: getTranslation(language, 'publicTransport') },
    { value: 'noise_pollution', label: getTranslation(language, 'noisePollution') },
    { value: 'air_pollution', label: getTranslation(language, 'airPollution') },
    { value: 'water_pollution', label: getTranslation(language, 'waterPollution') },
    { value: 'encroachment', label: getTranslation(language, 'encroachment') },
    { value: 'street_vendors', label: getTranslation(language, 'streetVendors') },
    { value: 'parking', label: getTranslation(language, 'parking') },
    { value: 'public_toilets', label: getTranslation(language, 'publicToilets') },
    { value: 'other', label: getTranslation(language, 'other') }
  ];
};

// Function to translate report data based on current language
export const translateReport = (report, targetLanguage) => {
  if (!report) return report;
  
  const translatedReport = { ...report };
  
  // Translate category
  if (report.category) {
    const categories = getIssueCategories(targetLanguage);
    const category = categories.find(cat => cat.value === report.category);
    if (category) {
      translatedReport.categoryDisplay = category.label;
    }
  }
  
  // Translate status
  if (report.status) {
    translatedReport.statusDisplay = getTranslation(targetLanguage, report.status.toLowerCase().replace(' ', ''));
  }
  
  return translatedReport;
}; 