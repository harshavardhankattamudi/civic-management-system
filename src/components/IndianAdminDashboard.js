import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Phone, Mail, Globe, 
  AlertTriangle, CheckCircle, Clock, Star,
  Filter, Search, Download, Share2, MessageSquare
} from 'lucide-react';
import { getMunicipalityById, getAllMunicipalities } from '../utils/indianMunicipalities';
import { getTranslation, translateReport } from '../utils/languagePreferences';

const IndianAdminDashboard = ({ reports, userRole, onUpdateReport, currentLanguage = 'en' }) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateComment, setUpdateComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  // Add state for details modal and comment input
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsReport, setDetailsReport] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const municipalities = getAllMunicipalities();

  // Filter reports based on selected municipality and filters
  const filteredReports = reports.filter(report => {
    const matchesMunicipality = selectedMunicipality === 'all' || report.municipality === selectedMunicipality;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizenName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesMunicipality && matchesStatus && matchesSearch;
  }).map(report => translateReport(report, currentLanguage));

  const statusOptions = [
    { value: 'all', label: getTranslation(currentLanguage, 'allStatus') },
    { value: 'Submitted', label: getTranslation(currentLanguage, 'submitted') },
    { value: 'In Progress', label: getTranslation(currentLanguage, 'inProgress') },
    { value: 'Resolved', label: getTranslation(currentLanguage, 'resolved') },
    { value: 'Rejected', label: getTranslation(currentLanguage, 'rejected') }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'In Progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'Submitted': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleUpdateStatus = () => {
    if (selectedReport && newStatus) {
      const timelineEntry = {
        status: newStatus,
        user: userRole === 'admin' ? 'Admin' : 'Citizen',
        timestamp: Date.now(),
        comment: updateComment
      };
      const updatedReport = {
        ...selectedReport,
        status: newStatus,
        adminComment: updateComment,
        updatedAt: new Date().toISOString(),
        timeline: [...(selectedReport.timeline || []), timelineEntry]
      };
      onUpdateReport(updatedReport);
      setShowUpdateModal(false);
      setSelectedReport(null);
      setUpdateComment('');
      setNewStatus('');
    }
  };

  const getMunicipalityStats = () => {
    const municipalityReports = reports.filter(r => r.municipality === selectedMunicipality);
    const total = municipalityReports.length;
    const resolved = municipalityReports.filter(r => r.status === 'Resolved').length;
    const inProgress = municipalityReports.filter(r => r.status === 'In Progress').length;
    const pending = municipalityReports.filter(r => r.status === 'Submitted').length;
    
    return { total, resolved, inProgress, pending };
  };

  const stats = selectedMunicipality === 'all' ? {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    pending: reports.filter(r => r.status === 'Submitted').length
  } : getMunicipalityStats();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {getTranslation(currentLanguage, 'adminDashboard')}
            </h1>
            <p className="text-purple-100 text-sm">
              {getTranslation(currentLanguage, 'manageIssues')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
              <Globe className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                {selectedMunicipality === 'all' ? 'All Municipalities' : 
                 municipalities.find(m => m.id === selectedMunicipality)?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-purple-100">{getTranslation(currentLanguage, 'total')}</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-purple-100">{getTranslation(currentLanguage, 'resolved')}</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">{stats.resolved}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-purple-100">{getTranslation(currentLanguage, 'inProgress')}</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-xs text-purple-100">{getTranslation(currentLanguage, 'pending')}</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Municipality Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getTranslation(currentLanguage, 'municipality')}:
            </label>
            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">{getTranslation(currentLanguage, 'allMunicipalities')}</option>
              {municipalities.map(municipality => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getTranslation(currentLanguage, 'status')}:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={getTranslation(currentLanguage, 'search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-48"
            />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {filteredReports.map((report) => {
            const municipality = getMunicipalityById(report.municipality);
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.statusDisplay || getTranslation(currentLanguage, report.status.toLowerCase().replace(' ', ''))}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {report.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {municipality?.name || 'Unknown Municipality'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {new Date(report.timestamp).toLocaleDateString('hi-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {report.citizenPhone || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {report.citizenName || 'Anonymous'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setNewStatus(report.status);
                        setShowUpdateModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {getTranslation(currentLanguage, 'update')}
                    </button>
                    <button
                      onClick={() => {
                        setDetailsReport(report);
                        setShowDetailsModal(true);
                      }}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {getTranslation(currentLanguage, 'noReports')}
            </p>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {getTranslation(currentLanguage, 'updateStatus')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getTranslation(currentLanguage, 'newStatus')}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {statusOptions.filter(option => option.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {getTranslation(currentLanguage, 'comment')}
                </label>
                <textarea
                  value={updateComment}
                  onChange={(e) => setUpdateComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={getTranslation(currentLanguage, 'addComment')}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleUpdateStatus}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {getTranslation(currentLanguage, 'update')}
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedReport(null);
                  setUpdateComment('');
                  setNewStatus('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                {getTranslation(currentLanguage, 'cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && detailsReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Report Details
            </h3>
            <div className="mb-4">
              <div className="mb-2"><strong>Title:</strong> {detailsReport.title}</div>
              <div className="mb-2"><strong>Description:</strong> {detailsReport.description}</div>
              <div className="mb-2"><strong>Status:</strong> {detailsReport.statusDisplay || detailsReport.status}</div>
              <div className="mb-2"><strong>Municipality:</strong> {getMunicipalityById(detailsReport.municipality)?.name || 'Unknown'}</div>
              <div className="mb-2"><strong>Citizen:</strong> {detailsReport.citizenName || 'Anonymous'}</div>
              <div className="mb-2"><strong>Phone:</strong> {detailsReport.citizenPhone || 'N/A'}</div>
              <div className="mb-2"><strong>Date:</strong> {detailsReport.timestamp ? new Date(detailsReport.timestamp).toLocaleDateString('hi-IN') : 'Unknown'}</div>
            </div>
            {detailsReport.timeline && detailsReport.timeline.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Status Timeline</h4>
                <div className="space-y-2">
                  {detailsReport.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-bold">{item.status}</span>
                      <span>by {item.user || 'User'}</span>
                      <span>{item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</span>
                      {item.comment && <span className="italic">({item.comment})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {detailsReport.images && detailsReport.images.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Images</h4>
                <div className="flex gap-2 flex-wrap">
                  {detailsReport.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Report Image ${idx+1}`} className="w-24 h-24 object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Comments</h4>
              <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded p-2 mb-2">
                {(detailsReport.comments || []).length === 0 && (
                  <div className="text-gray-400 text-sm">No comments yet.</div>
                )}
                {(detailsReport.comments || []).map((c, idx) => (
                  <div key={idx} className="mb-2 p-2 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-gray-500 mb-1">{c.user || 'User'} • {c.timestamp ? new Date(c.timestamp).toLocaleString() : ''}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{c.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={() => {
                    if (!commentInput.trim()) return;
                    const newComment = {
                      text: commentInput,
                      user: userRole === 'admin' ? 'Admin' : 'Citizen',
                      timestamp: Date.now()
                    };
                    const updatedReport = {
                      ...detailsReport,
                      comments: [...(detailsReport.comments || []), newComment]
                    };
                    onUpdateReport(updatedReport);
                    setDetailsReport(updatedReport);
                    setCommentInput('');
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailsReport(null);
                  setCommentInput('');
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndianAdminDashboard;

// Add default prop for onUpdateReport
IndianAdminDashboard.defaultProps = {
  onUpdateReport: () => {},
}; 