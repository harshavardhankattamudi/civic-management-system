import { findMunicipalityByLocation } from './indianMunicipalities';

export const sampleReports = [
  {
    id: '1',
    title: 'पानी की आपूर्ति में समस्या - मुंबई',
    category: 'water_supply',
    description: 'मुंबई के अंधेरी पश्चिम में पानी की आपूर्ति 3 दिनों से बंद है। निवासियों को पानी के लिए संघर्ष करना पड़ रहा है।',
    latitude: 19.1197,
    longitude: 72.8464,
    timestamp: '2024-01-15T10:30:00Z',
    status: 'Submitted',
    municipality: 'mumbai',
    image: null,
    citizenName: 'राजेश कुमार',
    citizenPhone: '+91-9876543210',
    citizenEmail: 'rajesh.kumar@email.com'
  },
  {
    id: '2',
    title: 'दिल्ली में सड़क की मरम्मत आवश्यक',
    category: 'roads',
    description: 'दिल्ली के कनॉट प्लेस के पास मुख्य सड़क पर बड़ा गड्ढा है। यह यातायात समस्याओं का कारण बन रहा है।',
    latitude: 28.6139,
    longitude: 77.2090,
    timestamp: '2024-01-14T18:45:00Z',
    status: 'In Progress',
    municipality: 'delhi',
    image: null,
    citizenName: 'प्रिया शर्मा',
    citizenPhone: '+91-9876543211',
    citizenEmail: 'priya.sharma@email.com'
  },
  {
    id: '3',
    title: 'बैंगलोर में स्ट्रीट लाइट नहीं काम कर रही',
    category: 'streetlight',
    description: 'बैंगलोर के इंदिरानगर में स्ट्रीट लाइट पिछले एक सप्ताह से बंद है। रात में पैदल चलने वालों के लिए सुरक्षा का खतरा है।',
    latitude: 12.9716,
    longitude: 77.5946,
    timestamp: '2024-01-13T14:20:00Z',
    status: 'Resolved',
    municipality: 'bangalore',
    image: null,
    citizenName: 'अरुण रेड्डी',
    citizenPhone: '+91-9876543212',
    citizenEmail: 'arun.reddy@email.com'
  },
  {
    id: '4',
    title: 'चेन्नई में नाली की समस्या',
    category: 'drainage',
    description: 'चेन्नई के तमिलनाडु में बारिश के बाद सड़क पर पानी जमा हो रहा है। नाली बंद हो गई है।',
    latitude: 13.0827,
    longitude: 80.2707,
    timestamp: '2024-01-12T09:15:00Z',
    status: 'Submitted',
    municipality: 'chennai',
    image: null,
    citizenName: 'लक्ष्मी वेंकटेश',
    citizenPhone: '+91-9876543213',
    citizenEmail: 'lakshmi.venkatesh@email.com'
  },
  {
    id: '5',
    title: 'कोलकाता में कचरा प्रबंधन की समस्या',
    category: 'garbage',
    description: 'कोलकाता के पार्क स्ट्रीट में कचरा डिब्बे भर गए हैं और कचरा चारों ओर बिखरा हुआ है। तत्काल ध्यान देने की आवश्यकता है।',
    latitude: 22.5726,
    longitude: 88.3639,
    timestamp: '2024-01-11T16:30:00Z',
    status: 'In Progress',
    municipality: 'kolkata',
    image: null,
    citizenName: 'सुबोध बनर्जी',
    citizenPhone: '+91-9876543214',
    citizenEmail: 'subodh.banerjee@email.com'
  },
  {
    id: '6',
    title: 'हैदराबाद में यातायात सिग्नल की समस्या',
    category: 'traffic',
    description: 'हैदराबाद के बनजारा हिल्स में यातायात सिग्नल ठीक से काम नहीं कर रहा। लाल बत्ती बहुत देर तक जलती रहती है।',
    latitude: 17.3850,
    longitude: 78.4867,
    timestamp: '2024-01-10T12:45:00Z',
    status: 'Submitted',
    municipality: 'hyderabad',
    image: null,
    citizenName: 'मोहम्मद अली',
    citizenPhone: '+91-9876543215',
    citizenEmail: 'mohammed.ali@email.com'
  },
  {
    id: '7',
    title: 'पुणे में पार्क की सुविधाओं की मरम्मत',
    category: 'parks',
    description: 'पुणे के ओशो पार्क में बेंच टूटी हुई है और बैठने के लिए असुरक्षित है। लकड़ी के स्लैट्स ढीले हैं।',
    latitude: 18.5204,
    longitude: 73.8567,
    timestamp: '2024-01-09T15:20:00Z',
    status: 'Resolved',
    municipality: 'pune',
    image: null,
    citizenName: 'सुनीता पाटिल',
    citizenPhone: '+91-9876543216',
    citizenEmail: 'sunita.patil@email.com'
  },
  {
    id: '8',
    title: 'अहमदाबाद में बिजली की समस्या',
    category: 'electricity',
    description: 'अहमदाबाद के साबरमती क्षेत्र में बिजली कटौती की समस्या है। पिछले 2 दिनों से बिजली नहीं आ रही।',
    latitude: 23.0225,
    longitude: 72.5714,
    timestamp: '2024-01-08T11:30:00Z',
    status: 'In Progress',
    municipality: 'ahmedabad',
    image: null,
    citizenName: 'दीपक शाह',
    citizenPhone: '+91-9876543217',
    citizenEmail: 'deepak.shah@email.com'
  },
  {
    id: '9',
    title: 'जयपुर में सार्वजनिक शौचालय की सफाई',
    category: 'sanitation',
    description: 'जयपुर के हवा महल के पास सार्वजनिक शौचालय की सफाई नहीं हुई है। स्वच्छता की समस्या है।',
    latitude: 26.9124,
    longitude: 75.7873,
    timestamp: '2024-01-07T13:45:00Z',
    status: 'Submitted',
    municipality: 'jaipur',
    image: null,
    citizenName: 'राजेश गुप्ता',
    citizenPhone: '+91-9876543218',
    citizenEmail: 'rajesh.gupta@email.com'
  },
  {
    id: '10',
    title: 'लखनऊ में पार्किंग की समस्या',
    category: 'parking',
    description: 'लखनऊ के हजरतगंज में पार्किंग की जगह नहीं है। वाहनों को सड़क पर खड़ा करना पड़ रहा है।',
    latitude: 26.8467,
    longitude: 80.9462,
    timestamp: '2024-01-06T10:15:00Z',
    status: 'In Progress',
    municipality: 'lucknow',
    image: null,
    citizenName: 'अमित वर्मा',
    citizenPhone: '+91-9876543219',
    citizenEmail: 'amit.verma@email.com'
  }
];

export const initializeSampleData = () => {
  const existingReports = localStorage.getItem('civicReports');
  if (!existingReports) {
    // Add municipality information to each report
    const reportsWithMunicipality = sampleReports.map(report => {
      const municipality = findMunicipalityByLocation(
        parseFloat(report.latitude), 
        parseFloat(report.longitude)
      );
      return {
        ...report,
        municipality: municipality ? municipality.id : 'unknown'
      };
    });
    
    localStorage.setItem('civicReports', JSON.stringify(reportsWithMunicipality));
    return reportsWithMunicipality;
  }
  return JSON.parse(existingReports);
}; 