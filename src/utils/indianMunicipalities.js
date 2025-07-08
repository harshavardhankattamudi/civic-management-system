// Indian Municipalities Data
export const indianMunicipalities = [
  {
    id: 'mumbai',
    name: 'Mumbai Municipal Corporation',
    state: 'Maharashtra',
    districts: ['Mumbai City', 'Mumbai Suburban', 'Thane'],
    coordinates: { lat: 19.0760, lng: 72.8777 },
    adminEmail: 'admin@mumbai.gov.in',
    phone: '+91-22-22621817',
    website: 'https://portal.mcgm.gov.in'
  },
  {
    id: 'delhi',
    name: 'Municipal Corporation of Delhi',
    state: 'Delhi',
    districts: ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'],
    coordinates: { lat: 28.7041, lng: 77.1025 },
    adminEmail: 'admin@mcd.gov.in',
    phone: '+91-11-23414200',
    website: 'https://mcdonline.gov.in'
  },
  {
    id: 'bangalore',
    name: 'Bruhat Bengaluru Mahanagara Palike',
    state: 'Karnataka',
    districts: ['Bangalore Urban', 'Bangalore Rural'],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    adminEmail: 'admin@bbmp.gov.in',
    phone: '+91-80-22660000',
    website: 'https://bbmp.gov.in'
  },
  {
    id: 'chennai',
    name: 'Greater Chennai Corporation',
    state: 'Tamil Nadu',
    districts: ['Chennai'],
    coordinates: { lat: 13.0827, lng: 80.2707 },
    adminEmail: 'admin@chennaicorporation.gov.in',
    phone: '+91-44-25384520',
    website: 'https://chennaicorporation.gov.in'
  },
  {
    id: 'kolkata',
    name: 'Kolkata Municipal Corporation',
    state: 'West Bengal',
    districts: ['Kolkata'],
    coordinates: { lat: 22.5726, lng: 88.3639 },
    adminEmail: 'admin@kmcgov.in',
    phone: '+91-33-22435110',
    website: 'https://www.kmcgov.in'
  },
  {
    id: 'hyderabad',
    name: 'Greater Hyderabad Municipal Corporation',
    state: 'Telangana',
    districts: ['Hyderabad', 'Rangareddy'],
    coordinates: { lat: 17.3850, lng: 78.4867 },
    adminEmail: 'admin@ghmc.gov.in',
    phone: '+91-40-23225333',
    website: 'https://www.ghmc.gov.in'
  },
  {
    id: 'pune',
    name: 'Pune Municipal Corporation',
    state: 'Maharashtra',
    districts: ['Pune'],
    coordinates: { lat: 18.5204, lng: 73.8567 },
    adminEmail: 'admin@punecorporation.org',
    phone: '+91-20-25501111',
    website: 'https://www.punecorporation.org'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad Municipal Corporation',
    state: 'Gujarat',
    districts: ['Ahmedabad'],
    coordinates: { lat: 23.0225, lng: 72.5714 },
    adminEmail: 'admin@ahmedabadcity.gov.in',
    phone: '+91-79-25391800',
    website: 'https://ahmedabadcity.gov.in'
  },
  {
    id: 'jaipur',
    name: 'Jaipur Municipal Corporation',
    state: 'Rajasthan',
    districts: ['Jaipur'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    adminEmail: 'admin@jaipurmc.org',
    phone: '+91-141-2700744',
    website: 'https://jaipurmc.org'
  },
  {
    id: 'lucknow',
    name: 'Lucknow Municipal Corporation',
    state: 'Uttar Pradesh',
    districts: ['Lucknow'],
    coordinates: { lat: 26.8467, lng: 80.9462 },
    adminEmail: 'admin@lmc.up.gov.in',
    phone: '+91-522-2611111',
    website: 'https://lmc.up.gov.in'
  }
];

// Indian-specific issue categories
export const indianIssueCategories = [
  { value: '', label: 'समस्या का प्रकार चुनें / Select Issue Type' },
  { value: 'water_supply', label: '🚰 पानी की आपूर्ति / Water Supply' },
  { value: 'electricity', label: '⚡ बिजली / Electricity' },
  { value: 'roads', label: '🛣️ सड़कें / Roads' },
  { value: 'drainage', label: '💧 नाली / Drainage' },
  { value: 'garbage', label: '🗑️ कचरा / Garbage' },
  { value: 'streetlight', label: '💡 स्ट्रीट लाइट / Streetlight' },
  { value: 'traffic', label: '🚦 यातायात / Traffic' },
  { value: 'sanitation', label: '🚽 स्वच्छता / Sanitation' },
  { value: 'parks', label: '🌳 पार्क / Parks' },
  { value: 'public_transport', label: '🚌 सार्वजनिक परिवहन / Public Transport' },
  { value: 'noise_pollution', label: '🔊 ध्वनि प्रदूषण / Noise Pollution' },
  { value: 'air_pollution', label: '🌫️ वायु प्रदूषण / Air Pollution' },
  { value: 'water_pollution', label: '🌊 जल प्रदूषण / Water Pollution' },
  { value: 'encroachment', label: '🏗️ अतिक्रमण / Encroachment' },
  { value: 'street_vendors', label: '🛒 फुटपाथ विक्रेता / Street Vendors' },
  { value: 'parking', label: '🅿️ पार्किंग / Parking' },
  { value: 'public_toilets', label: '🚻 सार्वजनिक शौचालय / Public Toilets' },
  { value: 'other', label: '📋 अन्य / Other' }
];

// Function to find municipality based on coordinates
export const findMunicipalityByLocation = (lat, lng) => {
  // This is a simplified version - in a real app, you'd use proper geospatial queries
  // For now, we'll use a simple distance calculation
  let closestMunicipality = null;
  let minDistance = Infinity;

  indianMunicipalities.forEach(municipality => {
    const distance = Math.sqrt(
      Math.pow(lat - municipality.coordinates.lat, 2) + 
      Math.pow(lng - municipality.coordinates.lng, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestMunicipality = municipality;
    }
  });

  return closestMunicipality;
};

// Function to get municipality by ID
export const getMunicipalityById = (id) => {
  return indianMunicipalities.find(m => m.id === id);
};

// Function to get all municipalities
export const getAllMunicipalities = () => {
  return indianMunicipalities;
}; 