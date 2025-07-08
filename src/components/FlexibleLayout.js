import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, BarChart3, Brain, Settings, Menu, X, 
  Plus, User, Shield, LogOut, Sun, Moon, Home,
  Grid, List, Search, Filter, Bell, Calendar, AlertCircle
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import AnalyticsDashboard from './AnalyticsDashboard';
import AIDashboard from './AIDashboard';
import CitizenDashboard from './CitizenDashboard';
import IndianAdminDashboard from './IndianAdminDashboard';
import ReportForm from './ReportForm';
import { useTheme } from '../context/ThemeContext';

const FlexibleLayout = ({ 
  userRole = 'citizen', 
  reports = [], 
  onSubmitReport, 
  onUpdateReport,
  onDeleteReport,
  currentLanguage = 'en'
}) => {
  const [activePanel, setActivePanel] = useState(userRole === 'admin' ? 'analytics' : 'dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const { theme, toggleTheme } = useTheme();
  const settingsRef = useRef(null);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const handleMapClick = (location) => {
    if (userRole === 'citizen') {
      setSelectedLocation(location);
      setIsFormOpen(true);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedLocation(null);
  };

  const handleSubmitReport = (reportData) => {
    onSubmitReport(reportData);
    handleCloseForm();
  };

  // Citizen View - Clean and focused layout
  const renderCitizenView = () => (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Citizen Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white flex-shrink-0">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Community Issues
              </h1>
              <p className="text-blue-100 text-sm">
                Report and track local problems
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                <User className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {reports.length} Issues
                </span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-blue-100">Resolved</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-xs text-blue-100">In Progress</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">
                {reports.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-xs text-blue-100">Pending</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Citizen Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActivePanel('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activePanel === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Issues
            </button>
            <button
              onClick={() => setActivePanel('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activePanel === 'map'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              Map View
            </button>
          </div>
        </div>
      </div>
      
      {/* Citizen Content */}
      <div className="flex-1 overflow-auto">
        {activePanel === 'dashboard' ? (
          <CitizenDashboard 
            reports={reports}
            onSubmitReport={handleSubmitReport}
            onUpdateReport={onUpdateReport}
            currentLanguage={currentLanguage}
          />
        ) : (
          <InteractiveMap 
            reports={reports}
            onMapClick={handleMapClick}
            userRole={userRole}
            currentLanguage={currentLanguage}
          />
        )}
      </div>

      {/* Floating Action Button for Report Issue */}
      <motion.button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Report Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <ReportForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmitReport}
                selectedLocation={selectedLocation}
                currentLanguage={currentLanguage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Admin View - Professional dashboard layout
  const renderAdminView = () => (
    <IndianAdminDashboard 
      reports={reports}
      userRole={userRole}
      onUpdateReport={onUpdateReport}
    />
  );

  return (
    <div className="h-full">
      {/* Render different views based on user role */}
      {userRole === 'admin' ? renderAdminView() : renderCitizenView()}

      {/* Settings Dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            ref={settingsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-64"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    {userRole === 'admin' ? <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userRole === 'admin' ? 'Administrator' : 'Citizen'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {userRole === 'admin' ? 'Full access' : 'Limited access'}
                    </p>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <ReportForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmitReport}
                selectedLocation={selectedLocation}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlexibleLayout;