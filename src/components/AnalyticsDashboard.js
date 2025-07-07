import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, 
  MapPin, Users, Calendar, Filter, Download, Brain, Zap,
  TrendingDown, Activity, Target, Award
} from 'lucide-react';

const AnalyticsDashboard = ({ reports = [], userRole = 'admin' }) => {
  const [timeFilter, setTimeFilter] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAIInsights, setShowAIInsights] = useState(true);

  // Helper functions
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

  const generateAIInsights = (reports, categoryStats, avgResponseTime) => {
    const insights = [];
    
    // Most common issues
    const topCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    if (topCategories.length > 0) {
      insights.push({
        type: 'trend',
        icon: '📊',
        title: 'Top Issue Categories',
        description: `Most reported issues: ${topCategories.map(([cat, count]) => 
          `${getCategoryName(cat)} (${count})`).join(', ')}`,
        priority: 'high'
      });
    }

    // Response time insights
    if (avgResponseTime > 7) {
      insights.push({
        type: 'warning',
        icon: '⏰',
        title: 'Slow Response Times',
        description: `Average resolution time is ${avgResponseTime.toFixed(1)} days. Consider increasing resources.`,
        priority: 'high'
      });
    } else if (avgResponseTime < 3) {
      insights.push({
        type: 'success',
        icon: '✅',
        title: 'Excellent Response Times',
        description: `Average resolution time is ${avgResponseTime.toFixed(1)} days. Great performance!`,
        priority: 'medium'
      });
    }

    // Seasonal patterns
    const monthlyStats = {};
    reports.forEach(report => {
      const month = new Date(report.timestamp).getMonth();
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    const currentMonth = new Date().getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;
    
    if (monthlyStats[currentMonth] > monthlyStats[lastMonth] * 1.5) {
      insights.push({
        type: 'trend',
        icon: '📈',
        title: 'Increasing Reports',
        description: 'Report volume has increased significantly this month. Monitor for patterns.',
        priority: 'medium'
      });
    }

    return insights;
  };

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        filterDate.setDate(now.getDate() - 30);
    }

    const filteredReports = reports.filter(report => 
      new Date(report.timestamp) >= filterDate &&
      (selectedCategory === 'all' || report.category === selectedCategory)
    );

    // Basic stats
    const total = filteredReports.length;
    const submitted = filteredReports.filter(r => r.status === 'Submitted').length;
    const inProgress = filteredReports.filter(r => r.status === 'In Progress').length;
    const resolved = filteredReports.filter(r => r.status === 'Resolved').length;

    // Category breakdown
    const categoryStats = filteredReports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {});

    // Response time analysis
    const responseTimes = filteredReports
      .filter(r => r.status === 'Resolved' && r.resolvedAt)
      .map(r => {
        const submitted = new Date(r.timestamp);
        const resolved = new Date(r.resolvedAt);
        return Math.floor((resolved - submitted) / (1000 * 60 * 60 * 24)); // days
      });

    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    // Trend analysis
    const dailyStats = {};
    filteredReports.forEach(report => {
      const date = new Date(report.timestamp).toDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = { submitted: 0, resolved: 0 };
      }
      if (report.status === 'Submitted') {
        dailyStats[date].submitted++;
      } else if (report.status === 'Resolved') {
        dailyStats[date].resolved++;
      }
    });

    // AI Insights
    const aiInsights = generateAIInsights(filteredReports, categoryStats, avgResponseTime);

    return {
      total,
      submitted,
      inProgress,
      resolved,
      categoryStats,
      avgResponseTime,
      dailyStats,
      aiInsights,
      resolutionRate: total > 0 ? (resolved / total * 100).toFixed(1) : 0
    };
  }, [reports, timeFilter, selectedCategory]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {Object.keys(analytics.categoryStats).map(category => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Insights Section */}
      {showAIInsights && analytics.aiInsights.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Insights
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.priority === 'high' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                    : insight.priority === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Issues</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Resolution Rate</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.resolutionRate}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.avgResponseTime.toFixed(1)}d</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Issues</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{analytics.submitted + analytics.inProgress}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Issue Categories
        </h3>
        <div className="space-y-3">
          {Object.entries(analytics.categoryStats)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(category)}</span>
                  <span className="text-gray-900 dark:text-white">{getCategoryName(category)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / analytics.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Performance Trends */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {analytics.resolutionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Resolution Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.avgResponseTime.toFixed(1)}d
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analytics.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Reports</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard; 