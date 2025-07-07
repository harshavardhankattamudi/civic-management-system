import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, FileText, MapPin, Camera, AlertCircle, 
  CheckCircle, Clock, TrendingUp, Filter, Search, X
} from 'lucide-react';
import ReportForm from './ReportForm';

const CitizenDashboard = ({ reports = [], onSubmitReport }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'pothole': '🚗',
      'traffic_light': '🚦',
      'streetlight': '💡',
      'sidewalk': '🚶',
      'stop_sign': '🛑',
      'garbage': '🗑️',
      'drainage': '💧',
      'bench': '🪑',
      'graffiti': '🎨',
      'other': '📋'
    };
    return icons[category] || '📋';
  };

  const getCategoryName = (category) => {
    const names = {
      'pothole': 'Pothole',
      'traffic_light': 'Traffic Light',
      'streetlight': 'Streetlight',
      'sidewalk': 'Sidewalk',
      'stop_sign': 'Stop Sign',
      'garbage': 'Garbage',
      'drainage': 'Drainage',
      'bench': 'Park Bench',
      'graffiti': 'Graffiti',
      'other': 'Other'
    };
    return names[category] || 'Other';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
    };
    return colors[status] || colors['Submitted'];
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Statistics
  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'Submitted').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Civic Issues
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Report and track community issues
              </p>
            </div>
            
            <motion.button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Report Issue
            </motion.button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Issues</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.submitted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Submitted</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Resolved</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="pothole">Pothole</option>
                <option value="traffic_light">Traffic Light</option>
                <option value="streetlight">Streetlight</option>
                <option value="sidewalk">Sidewalk</option>
                <option value="garbage">Garbage</option>
                <option value="drainage">Drainage</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              onClick={() => handleReportClick(report)}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getCategoryName(report.category)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(report.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No issues found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Be the first to report an issue!'
              }
            </p>
          </motion.div>
        )}
      </div>

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
                onClose={() => setIsFormOpen(false)}
                onSubmit={onSubmitReport}
                selectedLocation={null}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Details Modal */}
      <AnimatePresence>
        {selectedReport && showReportDetails && (
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
              <ReportDetails
                report={selectedReport}
                onClose={() => setShowReportDetails(false)}
                userRole="citizen"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Report Details Component
const ReportDetails = ({ report, onClose, userRole }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'pothole': '🚗',
      'traffic_light': '🚦',
      'streetlight': '💡',
      'sidewalk': '🚶',
      'stop_sign': '🛑',
      'garbage': '🗑️',
      'drainage': '💧',
      'bench': '🪑',
      'graffiti': '🎨',
      'other': '📋'
    };
    return icons[category] || '📋';
  };

  const getCategoryName = (category) => {
    const names = {
      'pothole': 'Pothole',
      'traffic_light': 'Traffic Light',
      'streetlight': 'Streetlight',
      'sidewalk': 'Sidewalk',
      'stop_sign': 'Stop Sign',
      'garbage': 'Garbage',
      'drainage': 'Drainage',
      'bench': 'Park Bench',
      'graffiti': 'Graffiti',
      'other': 'Other'
    };
    return names[category] || 'Other';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
    };
    return colors[status] || colors['Submitted'];
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Report Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getCategoryIcon(report.category)}</span>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {report.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {getCategoryName(report.category)}
            </p>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Description</h5>
          <p className="text-gray-600 dark:text-gray-300">{report.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">Status</h5>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">Reported</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {new Date(report.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {report.image && (
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Photo</h5>
            <img 
              src={report.image} 
              alt="Report" 
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard; 