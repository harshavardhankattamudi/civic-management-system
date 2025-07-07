export const sampleReports = [
  {
    id: '1',
    title: 'Large Pothole on Connaught Place Road',
    category: 'pothole',
    description: 'There is a significant pothole on the main road near Connaught Place. It\'s causing traffic issues and potential damage to vehicles.',
    latitude: 28.6139,
    longitude: 77.2090,
    timestamp: '2024-01-15T10:30:00Z',
    status: 'Submitted',
    image: null
  },
  {
    id: '2',
    title: 'Broken Traffic Light at India Gate',
    category: 'traffic_light',
    description: 'Traffic light at the intersection near India Gate is not working properly. The red light stays on too long and causes traffic jams.',
    latitude: 28.6129,
    longitude: 77.2295,
    timestamp: '2024-01-14T18:45:00Z',
    status: 'In Progress',
    image: null
  },
  {
    id: '3',
    title: 'Streetlight Out of Order in Lajpat Nagar',
    category: 'streetlight',
    description: 'Streetlight on the main market road in Lajpat Nagar is completely dark. It\'s been like this for the past week and poses a safety concern for pedestrians at night.',
    latitude: 28.5679,
    longitude: 77.2437,
    timestamp: '2024-01-13T14:20:00Z',
    status: 'Resolved',
    image: null
  },
  {
    id: '4',
    title: 'Broken Sidewalk in Chandni Chowk',
    category: 'sidewalk',
    description: 'Large crack in the sidewalk on the main street in Chandni Chowk. It\'s a tripping hazard for pedestrians, especially elderly residents and children.',
    latitude: 28.6562,
    longitude: 77.2410,
    timestamp: '2024-01-12T09:15:00Z',
    status: 'Submitted',
    image: null
  },
  {
    id: '5',
    title: 'Missing Stop Sign in South Extension',
    category: 'stop_sign',
    description: 'Stop sign at the corner of South Extension market has been knocked down. This is a critical safety issue for drivers and pedestrians.',
    latitude: 28.5679,
    longitude: 77.2437,
    timestamp: '2024-01-11T16:30:00Z',
    status: 'In Progress',
    image: null
  },
  {
    id: '6',
    title: 'Garbage Can Overflow in Lodhi Garden',
    category: 'garbage',
    description: 'Public trash bin at Lodhi Garden is overflowing and garbage is scattered around the area. Needs immediate attention.',
    latitude: 28.5891,
    longitude: 77.2273,
    timestamp: '2024-01-10T12:45:00Z',
    status: 'Submitted',
    image: null
  },
  {
    id: '7',
    title: 'Broken Bench in Central Park',
    category: 'bench',
    description: 'Park bench in Central Park is broken and unsafe to sit on. The wooden slats are loose and could cause injury.',
    latitude: 28.5679,
    longitude: 77.2437,
    timestamp: '2024-01-09T15:20:00Z',
    status: 'Resolved',
    image: null
  },
  {
    id: '8',
    title: 'Drainage Problem in Dwarka',
    category: 'drainage',
    description: 'Water is pooling on the street after rain due to a blocked drain in Dwarka Sector 12. This creates a hazard for drivers and could damage the road.',
    latitude: 28.5929,
    longitude: 77.0593,
    timestamp: '2024-01-08T11:30:00Z',
    status: 'In Progress',
    image: null
  }
];

export const initializeSampleData = () => {
  const existingReports = localStorage.getItem('civicReports');
  if (!existingReports) {
    localStorage.setItem('civicReports', JSON.stringify(sampleReports));
    return sampleReports;
  }
  return JSON.parse(existingReports);
}; 