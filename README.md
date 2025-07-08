# भारतीय नागरिक समस्या रिपोर्टर / Indian Civic Issue Reporter

A comprehensive civic management system designed specifically for Indian municipalities to help citizens report issues and get solutions from their respective local governments.

## 🌟 Features

### For Citizens (नागरिकों के लिए)
- **Multi-language Support**: Hindi and English interface
- **Location-based Reporting**: Report issues with precise GPS coordinates
- **Municipality Routing**: Issues automatically routed to the correct municipality based on location
- **Photo Upload**: Attach photos to support your reports
- **Real-time Tracking**: Track the status of your reported issues
- **Priority Classification**: Mark issues as Low, Medium, High, or Urgent
- **Citizen Information**: Provide contact details for follow-up

### For Municipal Administrators (नगर पालिका प्रशासकों के लिए)
- **Municipality-specific Dashboard**: View and manage issues for your specific municipality
- **Status Management**: Update issue status (Submitted, In Progress, Resolved, Rejected)
- **Priority Filtering**: Filter issues by priority level
- **Citizen Communication**: Contact citizens for additional information
- **Analytics**: View statistics and trends for your municipality
- **Comment System**: Add administrative comments to issues

### Supported Indian Municipalities
- Mumbai Municipal Corporation
- Municipal Corporation of Delhi
- Bruhat Bengaluru Mahanagara Palike
- Greater Chennai Corporation
- Kolkata Municipal Corporation
- Greater Hyderabad Municipal Corporation
- Pune Municipal Corporation
- Ahmedabad Municipal Corporation
- Jaipur Municipal Corporation
- Lucknow Municipal Corporation

### Issue Categories (समस्या श्रेणियां)
- 🚰 Water Supply (पानी की आपूर्ति)
- ⚡ Electricity (बिजली)
- 🛣️ Roads (सड़कें)
- 💧 Drainage (नाली)
- 🗑️ Garbage (कचरा)
- 💡 Streetlight (स्ट्रीट लाइट)
- 🚦 Traffic (यातायात)
- 🚽 Sanitation (स्वच्छता)
- 🌳 Parks (पार्क)
- 🚌 Public Transport (सार्वजनिक परिवहन)
- 🔊 Noise Pollution (ध्वनि प्रदूषण)
- 🌫️ Air Pollution (वायु प्रदूषण)
- 🌊 Water Pollution (जल प्रदूषण)
- 🏗️ Encroachment (अतिक्रमण)
- 🛒 Street Vendors (फुटपाथ विक्रेता)
- 🅿️ Parking (पार्किंग)
- 🚻 Public Toilets (सार्वजनिक शौचालय)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd civic-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Citizens

1. **Switch to Citizen Mode**: Use the toggle in the top-right corner
2. **Report an Issue**:
   - Click the "+" button to open the report form
   - Select your municipality
   - Choose the issue category
   - Set priority level
   - Add your contact information
   - Upload a photo (optional)
   - Submit the report

3. **Track Your Reports**:
   - View all your submitted reports
   - Check status updates
   - See administrative comments

### For Administrators

1. **Switch to Admin Mode**: Use the toggle in the top-right corner
2. **Manage Issues**:
   - Filter by municipality, status, and priority
   - Update issue status
   - Add administrative comments
   - Contact citizens if needed

3. **View Analytics**:
   - See statistics for your municipality
   - Track resolution times
   - Monitor issue trends

## 🗺️ Map Features

- **Interactive Map**: View all reported issues on an interactive map
- **Color-coded Markers**: 
  - 🔴 Red: Submitted/Pending issues
  - 🟡 Yellow: In Progress issues
  - 🟢 Green: Resolved issues
- **Municipality Filtering**: Filter issues by specific municipality
- **Status Filtering**: Filter by issue status
- **Click to Report**: Click on the map to report a new issue (citizen mode)

## 🔧 Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Updates**: Status changes reflect immediately
- **Local Storage**: Data persists between sessions
- **GPS Integration**: Automatic location detection
- **Image Upload**: Support for photo evidence
- **Multi-language**: Hindi and English interface

## 🏛️ Municipality Integration

Each municipality has:
- **Unique ID**: For proper routing
- **Contact Information**: Email, phone, website
- **Geographic Boundaries**: For location-based routing
- **Administrative Access**: Municipality-specific admin dashboard

## 📊 Data Structure

### Issue Report Format
```javascript
{
  id: "unique_id",
  title: "Issue title in Hindi/English",
  category: "issue_category",
  description: "Detailed description",
  latitude: 23.5937,
  longitude: 78.9629,
  municipality: "municipality_id",
  priority: "low|medium|high|urgent",
  status: "Submitted|In Progress|Resolved|Rejected",
  citizenName: "Citizen name",
  citizenPhone: "+91-9876543210",
  citizenEmail: "citizen@email.com",
  timestamp: "2024-01-15T10:30:00Z",
  image: "base64_image_data",
  adminComment: "Administrative comment"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **SMS Notifications**: Send status updates via SMS
- **WhatsApp Integration**: Report issues via WhatsApp
- **Voice Reports**: Voice-to-text reporting
- **AI-powered Classification**: Automatic issue categorization
- **Mobile App**: Native mobile applications
- **API Integration**: Connect with existing municipal systems
- **Multi-language Expansion**: Support for more Indian languages
- **Offline Support**: Work without internet connection

---

**Made with ❤️ for Indian Citizens and Municipalities** 
