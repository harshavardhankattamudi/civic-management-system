import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { Plus, FileText, Clock, CheckCircle, AlertCircle, BarChart3, X, TrendingUp, Users, Brain } from 'lucide-react';
import InteractiveMap from '../InteractiveMap';
import ReportForm from '../ReportForm';
import AdminDashboard from '../AdminDashboard';
import AnalyticsDashboard from '../AnalyticsDashboard';
import AIDashboard from '../AIDashboard';
import { initializeSampleData } from '../../utils/sampleData';

const CivicReports = ({ userRole = 'citizen' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const [reports, setReports] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [statusChangeComment, setStatusChangeComment] = useState('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

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
    setIsFormOpen(false);
    setSelectedLocation(null);
  };

  const handleMapClick = (lng, lat) => {
    setSelectedLocation({ lng, lat });
    setIsFormOpen(true);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const handleUpdateReportStatus = (reportId, newStatus, comment = '') => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: newStatus, statusComment: comment, statusChangedAt: new Date().toISOString() }
          : report
      )
    );
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

  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'Submitted').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length
  };

  // Category statistics
  const categoryStats = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  // Recent activity (last 7 days)
  const recentActivity = reports
    .filter(report => {
      const reportDate = new Date(report.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDate > weekAgo;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <motion.section
      ref={ref}
      className="py-8 px-6 bg-gray-50 dark:bg-[#0a1a2a] transition-colors min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {userRole === 'admin' ? 'Admin Dashboard' : 'Report Civic Issues'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {userRole === 'admin' 
              ? 'Monitor and manage civic issues across the community with AI-powered insights.'
              : 'Help improve your community by reporting issues like potholes, broken streetlights, and other problems.'
            }
          </p>
        </div>

        {userRole === 'admin' ? (
          /* Admin View - Enhanced Analytics Dashboard */
          <div className="space-y-6">
            {/* Admin Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  setShowAnalytics(false);
                  setShowAIDashboard(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showAnalytics && !showAIDashboard
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => {
                  setShowAnalytics(true);
                  setShowAIDashboard(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAnalytics && !showAIDashboard
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => {
                  setShowAnalytics(false);
                  setShowAIDashboard(true);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAIDashboard
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                AI Dashboard
              </button>
            </div>

            {showAIDashboard ? (
              /* AI-Powered Dashboard */
              <AIDashboard reports={reports} userRole={userRole} />
            ) : showAnalytics ? (
              /* Analytics Dashboard */
              <AnalyticsDashboard reports={reports} userRole={userRole} />
            ) : (
              /* Main Statistics Cards */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Issues</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.submitted}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Resolved</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Interactive Map */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Issue Map
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  View all reported issues on the interactive map
                </p>
              </div>
              <div className="h-96">
                <InteractiveMap
                  reports={reports}
                  onReportClick={handleReportClick}
                  isAdmin={true}
                />
              </div>
            </motion.div>

            {/* Recent Reports */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Reports
                </h3>
              </div>
              <div className="p-4">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mb-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleReportClick(report)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {getCategoryName(report.category)} • {new Date(report.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                        report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Citizen View - Report Form and Map */
          <div className="space-y-6">
            {/* Quick Stats for Citizens */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Reports</div>
              </motion.div>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Resolved</div>
              </motion.div>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
              </motion.div>
            </div>

            {/* Interactive Map */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Report an Issue
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click on the map to report a civic issue in your area
                </p>
              </div>
              <div className="h-96">
                <InteractiveMap
                  reports={reports}
                  onMapClick={handleMapClick}
                  onReportClick={handleReportClick}
                />
              </div>
            </motion.div>

            {/* Report Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Report New Issue
              </button>
            </motion.div>
          </div>
        )}

        {/* Report Form Modal */}
        <ReportForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitReport}
          selectedLocation={selectedLocation}
        />

        {/* Report Details Modal */}
        {selectedReport && showReportDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Report Details
                  </h3>
                  <button
                    onClick={() => setShowReportDetails(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(selectedReport.category)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {selectedReport.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {getCategoryName(selectedReport.category)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Description</h5>
                    <p className="text-gray-600 dark:text-gray-300">{selectedReport.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">Status</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedReport.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                        selectedReport.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      }`}>
                        {selectedReport.status}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">Reported</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(selectedReport.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedReport.statusComment && (
                    <div className="bg-gray-100 dark:bg-gray-900 rounded p-3 mt-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Change Note:</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">{selectedReport.statusComment}</div>
                      {selectedReport.statusChangedAt && (
                        <div className="text-xs text-gray-400 mt-1">Changed at: {new Date(selectedReport.statusChangedAt).toLocaleString()}</div>
                      )}
                    </div>
                  )}
                  
                  {userRole === 'admin' && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Update Status</h5>
                      <div className="flex gap-2">
                        {['Submitted', 'In Progress', 'Resolved'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setPendingStatusChange({ reportId: selectedReport.id, newStatus: status });
                              setShowStatusConfirm(true);
                              setStatusChangeComment('');
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              selectedReport.status === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Confirmation Dialog */}
            {showStatusConfirm && (
              <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-black bg-opacity-40">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Confirm Status Change</h4>
                  <p className="mb-3 text-gray-700 dark:text-gray-300">Are you sure you want to change the status to <span className="font-bold">{pendingStatusChange?.newStatus}</span>?</p>
                  <textarea
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-3"
                    rows={3}
                    placeholder="Optional comment (reason for status change)"
                    value={statusChangeComment}
                    onChange={e => setStatusChangeComment(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => setShowStatusConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
                      onClick={() => {
                        handleUpdateReportStatus(pendingStatusChange.reportId, pendingStatusChange.newStatus, statusChangeComment);
                        setShowStatusConfirm(false);
                        setShowReportDetails(false);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default CivicReports; 