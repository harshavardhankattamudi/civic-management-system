import React, { useState, useEffect } from 'react';
import FlexibleLayout from './FlexibleLayout';
import { Users, Settings } from 'lucide-react';
import { initializeSampleData } from '../utils/sampleData';

const CivicManagement = () => {
  const [userRole, setUserRole] = useState('citizen');
  const [reports, setReports] = useState([]);

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('civicReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      // Initialize with sample data if no reports exist
      const sampleData = initializeSampleData();
      setReports(sampleData);
    }
  }, []);

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('civicReports', JSON.stringify(reports));
  }, [reports]);

  const handleSubmitReport = (reportData) => {
    setReports(prev => [reportData, ...prev]);
  };

  return (
    <div className="h-screen bg-white dark:bg-[#071c2f] text-gray-900 dark:text-white">
      {/* Top Bar with Role Toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#071c2f]/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Civic Issue Reporter
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Role Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="flex">
                <button
                  onClick={() => setUserRole('citizen')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'citizen'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Citizen
                </button>
                <button
                  onClick={() => setUserRole('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Flexible Layout */}
      <div className="pt-16 h-full">
        <FlexibleLayout 
          reports={reports}
          userRole={userRole}
          onSubmitReport={handleSubmitReport}
        />
      </div>
    </div>
  );
};

export default CivicManagement; 