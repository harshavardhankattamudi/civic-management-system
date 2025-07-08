import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, MapPin, Globe } from 'lucide-react';
import { getAllMunicipalities, getMunicipalityById } from '../utils/indianMunicipalities';
import { getTranslation, translateReport } from '../utils/languagePreferences';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored markers for different status types
const createColoredMarker = (status) => {
  let color;
  switch (status?.toLowerCase()) {
    case 'submitted':
    case 'pending':
      color = '#ef4444'; // Red
      break;
    case 'in progress':
    case 'in-progress':
      color = '#f59e0b'; // Yellow/Orange
      break;
    case 'resolved':
    case 'completed':
      color = '#10b981'; // Green
      break;
    default:
      color = '#6b7280'; // Gray for unknown status
  }

  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">!</div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const InteractiveMap = ({ reports = [], onReportClick, onMapClick, isAdmin = false, userRole = 'citizen', currentLanguage = 'en' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [municipalityFilter, setMunicipalityFilter] = useState('all');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState(false);
  const municipalities = getAllMunicipalities();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    let map = null;
    let timer = null;

    const initMap = () => {
      try {
        // Remove existing map if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Create map with minimal configuration - centered on India
        map = L.map(mapRef.current);
        map.setView([23.5937, 78.9629], 5); // Center of India

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add click handler for adding new reports (only for citizens)
        if (!isAdmin) {
          map.on('click', (e) => {
            if (onMapClick && e.latlng) {
              onMapClick(e.latlng.lng, e.latlng.lat);
            }
          });
        }

        mapInstanceRef.current = map;
        setMapInitialized(true);
        setMapError(false);

        // Force resize
        timer = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapInitialized(false);
      }
    };

    // Delay initialization
    const initTimer = setTimeout(initMap, 200);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
      setMapInitialized(false);
      setMapError(false);
    };
  }, [onMapClick, isAdmin]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized) return;

    try {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Filter reports based on status and municipality
      const filteredReports = reports.filter(report => {
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        const matchesMunicipality = municipalityFilter === 'all' || report.municipality === municipalityFilter;
        return matchesStatus && matchesMunicipality;
      }).map(report => translateReport(report, currentLanguage));

      // Add markers for each report
      filteredReports.forEach((report) => {
        try {
          if (report.latitude && report.longitude && 
              !isNaN(report.latitude) && !isNaN(report.longitude) &&
              report.latitude >= -90 && report.latitude <= 90 &&
              report.longitude >= -180 && report.longitude <= 180) {
            
            // Create colored marker based on status
            const coloredIcon = createColoredMarker(report.status);
            
            const marker = L.marker([report.latitude, report.longitude], { icon: coloredIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(`
                <div class="p-3 min-w-64">
                  <h3 class="font-bold text-lg mb-2">${report.title || 'Untitled'}</h3>
                  <p class="text-sm text-gray-600 mb-3">${report.description || 'No description'}</p>
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">${getTranslation(currentLanguage, 'issueType')}:</span>
                      <span class="text-gray-600">${report.categoryDisplay || report.category || 'Unknown'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">${getTranslation(currentLanguage, 'status')}:</span>
                      <span class="px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }">${report.statusDisplay || report.status || 'Unknown'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">${getTranslation(currentLanguage, 'priority')}:</span>
                      <span class="text-gray-600">${report.priorityDisplay || report.priority || 'Medium'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">नगर पालिका / Municipality:</span>
                      <span class="text-gray-600">${getMunicipalityById(report.municipality)?.name || 'Unknown'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">रिपोर्ट किया गया / Reported:</span>
                      <span class="text-gray-600">${report.timestamp ? new Date(report.timestamp).toLocaleDateString('hi-IN') : 'Unknown date'}</span>
                    </div>
                    ${report.citizenName ? `
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">नागरिक / Citizen:</span>
                      <span class="text-gray-600">${report.citizenName}</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
              `);

            marker.on('click', () => {
              if (onReportClick) {
                onReportClick(report);
              }
            });
          }
        } catch (error) {
          console.error('Error adding marker for report:', report.id, error);
        }
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [reports, statusFilter, municipalityFilter, onReportClick, mapInitialized]);

  const handleRetry = () => {
    setMapError(false);
    setMapInitialized(false);
    // Force re-initialization
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full">
      {!mapInitialized && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Failed to load map</p>
            <button 
              onClick={handleRetry}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{getTranslation(currentLanguage, 'filter')}</span>
          </div>
          <div className="space-y-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{getTranslation(currentLanguage, 'allStatus')}</option>
              <option value="Submitted">{getTranslation(currentLanguage, 'submitted')}</option>
              <option value="In Progress">{getTranslation(currentLanguage, 'inProgress')}</option>
              <option value="Resolved">{getTranslation(currentLanguage, 'resolved')}</option>
            </select>
            <select
              value={municipalityFilter}
              onChange={(e) => setMunicipalityFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{getTranslation(currentLanguage, 'allMunicipalities')}</option>
              {municipalities.map(municipality => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 z-20">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">{getTranslation(currentLanguage, 'legend')}</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-600 dark:text-gray-300">{getTranslation(currentLanguage, 'submitted')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-600 dark:text-gray-300">{getTranslation(currentLanguage, 'inProgress')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            <span className="text-gray-600 dark:text-gray-300">{getTranslation(currentLanguage, 'resolved')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap; 