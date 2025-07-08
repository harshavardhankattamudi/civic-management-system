// AI Insights and Analytics Utilities

// Generate AI insights based on report data
export const generateAIInsights = (reports, timeFilter = '30d') => {
  const insights = [];
  
  if (reports.length === 0) {
    return insights;
  }

  // Calculate basic metrics
  const total = reports.length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;
  const inProgress = reports.filter(r => r.status === 'In Progress').length;
  const submitted = reports.filter(r => r.status === 'Submitted').length;
  
  // Category analysis
  const categoryStats = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  // Response time analysis
  const resolvedReports = reports.filter(r => r.status === 'Resolved' && r.resolvedAt);
  const responseTimes = resolvedReports.map(r => {
    const submitted = new Date(r.timestamp);
    const resolved = new Date(r.resolvedAt);
    return Math.floor((resolved - submitted) / (1000 * 60 * 60 * 24)); // days
  });

  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;

  // Top categories insight
  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  if (topCategories.length > 0) {
    insights.push({
      type: 'trend',
      icon: '📊',
      title: 'Most Common Issues',
      description: `Top reported issues: ${topCategories.map(([cat, count]) => 
        `${getCategoryName(cat)} (${count})`).join(', ')}`,
      confidence: 0.9
    });
  }

  // Response time insights
  if (avgResponseTime > 7) {
    insights.push({
      type: 'warning',
      icon: '⏰',
      title: 'Slow Response Times',
      description: `Average resolution time is ${avgResponseTime.toFixed(1)} days. Consider increasing resources.`,
      confidence: 0.85
    });
  } else if (avgResponseTime < 3) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'Excellent Response Times',
      description: `Average resolution time is ${avgResponseTime.toFixed(1)} days. Great performance!`,
      confidence: 0.9
    });
  }

  // Resolution rate insights
  const resolutionRate = total > 0 ? (resolved / total * 100) : 0;
  if (resolutionRate < 60) {
    insights.push({
      type: 'warning',
      icon: '📉',
      title: 'Low Resolution Rate',
      description: `Only ${resolutionRate.toFixed(1)}% of issues are resolved. Consider process improvements.`,
      confidence: 0.8
    });
  } else if (resolutionRate > 85) {
    insights.push({
      type: 'success',
      icon: '📈',
      title: 'High Resolution Rate',
      description: `${resolutionRate.toFixed(1)}% resolution rate shows excellent service delivery.`,
      confidence: 0.9
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
      confidence: 0.75
    });
  }

  // Category-specific insights
  if (categoryStats.pothole > total * 0.3) {
    insights.push({
      type: 'warning',
      icon: '🚗',
      title: 'High Pothole Reports',
      description: 'Potholes represent over 30% of reports. Consider road maintenance program.',
      confidence: 0.8
    });
  }

  if (categoryStats.garbage > total * 0.2) {
    insights.push({
      type: 'info',
      icon: '🗑️',
      title: 'Waste Management Focus',
      description: 'Garbage issues are frequent. Review waste collection schedules.',
      confidence: 0.7
    });
  }

  return insights;
};

// Generate predictive analytics
export const generatePredictiveAnalytics = (reports) => {
  const predictions = {
    nextWeekVolume: 0,
    priorityIssues: [],
    resourceNeeds: [],
    costEstimates: 0
  };

  if (reports.length === 0) {
    return predictions;
  }

  // Predict next week's volume based on recent trends
  const recentReports = reports.filter(report => {
    const reportDate = new Date(report.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate > weekAgo;
  });

  predictions.nextWeekVolume = Math.round(recentReports.length * 1.1); // 10% increase

  // Identify priority issues
  const categoryStats = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const highPriorityCategories = ['pothole', 'traffic_light', 'drainage'];
  predictions.priorityIssues = highPriorityCategories.filter(cat => 
    categoryStats[cat] > 0
  );

  // Estimate resource needs
  const unresolvedCount = reports.filter(r => r.status !== 'Resolved').length;
  predictions.resourceNeeds = [
    `Crew allocation for ${Math.ceil(unresolvedCount / 5)} teams`,
    `Equipment for ${Math.ceil(unresolvedCount / 3)} work orders`,
    `Materials budget: $${unresolvedCount * 500}`
  ];

  // Cost estimates
  const costPerIssue = {
    pothole: 1500,
    traffic_light: 3000,
    streetlight: 800,
    sidewalk: 1200,
    garbage: 200,
    drainage: 2500,
    graffiti: 500,
    other: 1000
  };

  predictions.costEstimates = Object.entries(categoryStats).reduce((total, [category, count]) => {
    return total + (count * (costPerIssue[category] || 1000));
  }, 0);

  return predictions;
};

// Generate performance metrics
export const generatePerformanceMetrics = (reports) => {
  const metrics = {
    efficiency: 0,
    satisfaction: 0,
    productivity: 0,
    quality: 0
  };

  if (reports.length === 0) {
    return metrics;
  }

  // Efficiency: based on resolution rate and response time
  const resolved = reports.filter(r => r.status === 'Resolved').length;
  const resolutionRate = resolved / reports.length;
  
  const responseTimes = reports
    .filter(r => r.status === 'Resolved' && r.resolvedAt)
    .map(r => {
      const submitted = new Date(r.timestamp);
      const resolved = new Date(r.resolvedAt);
      return Math.floor((resolved - submitted) / (1000 * 60 * 60 * 24));
    });

  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;

  // Efficiency score (0-100)
  metrics.efficiency = Math.round(
    (resolutionRate * 60) + 
    (Math.max(0, 40 - avgResponseTime) * 1) // Bonus for fast response
  );

  // Satisfaction: based on resolution rate and issue complexity
  const complexIssues = reports.filter(r => 
    ['pothole', 'traffic_light', 'drainage'].includes(r.category)
  ).length;
  
  const complexResolutionRate = complexIssues > 0 
    ? reports.filter(r => 
        ['pothole', 'traffic_light', 'drainage'].includes(r.category) && 
        r.status === 'Resolved'
      ).length / complexIssues
    : 1;

  metrics.satisfaction = Math.round(
    (resolutionRate * 70) + (complexResolutionRate * 30)
  );

  // Productivity: based on volume and speed
  const recentVolume = reports.filter(r => {
    const reportDate = new Date(r.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate > weekAgo;
  }).length;

  metrics.productivity = Math.round(
    Math.min(100, (recentVolume * 10) + (resolutionRate * 50))
  );

  // Quality: based on resolution rate and response time consistency
  const responseTimeVariance = responseTimes.length > 1 
    ? Math.sqrt(responseTimes.reduce((sum, time) => sum + Math.pow(time - avgResponseTime, 2), 0) / responseTimes.length)
    : 0;

  metrics.quality = Math.round(
    (resolutionRate * 60) + 
    (Math.max(0, 40 - responseTimeVariance) * 1)
  );

  return metrics;
};

// Helper function to get category names
export const getCategoryName = (category) => {
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

// Generate trend analysis
export const generateTrendAnalysis = (reports, days = 30) => {
  const trends = {
    daily: [],
    weekly: [],
    monthly: []
  };

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - days);

  // Daily trends
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayReports = reports.filter(report => {
      const reportDate = new Date(report.timestamp);
      return reportDate >= dayStart && reportDate <= dayEnd;
    });

    trends.daily.unshift({
      date: date.toISOString().split('T')[0],
      total: dayReports.length,
      submitted: dayReports.filter(r => r.status === 'Submitted').length,
      resolved: dayReports.filter(r => r.status === 'Resolved').length
    });
  }

  // Weekly trends
  for (let i = 0; i < Math.ceil(days / 7); i++) {
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - (i * 7));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekReports = reports.filter(report => {
      const reportDate = new Date(report.timestamp);
      return reportDate >= weekStart && reportDate <= weekEnd;
    });

    trends.weekly.unshift({
      week: `Week ${Math.ceil(days / 7) - i}`,
      total: weekReports.length,
      submitted: weekReports.filter(r => r.status === 'Submitted').length,
      resolved: weekReports.filter(r => r.status === 'Resolved').length
    });
  }

  return trends;
};

// Generate recommendations based on data
export const generateRecommendations = (reports, insights) => {
  const recommendations = [];

  // Based on response time
  const avgResponseTime = reports.filter(r => r.status === 'Resolved' && r.resolvedAt)
    .map(r => {
      const submitted = new Date(r.timestamp);
      const resolved = new Date(r.resolvedAt);
      return Math.floor((resolved - submitted) / (1000 * 60 * 60 * 24));
    })
    .reduce((a, b) => a + b, 0) / reports.filter(r => r.status === 'Resolved' && r.resolvedAt).length || 0;

  if (avgResponseTime > 7) {
    recommendations.push({
      type: 'process',
      title: 'Improve Response Times',
      description: 'Consider implementing automated workflows and increasing staff allocation.',
      priority: 'high',
      impact: 'high'
    });
  }

  // Based on category distribution
  const categoryStats = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  if (categoryStats.pothole > reports.length * 0.3) {
    recommendations.push({
      type: 'maintenance',
      title: 'Road Maintenance Program',
      description: 'Implement proactive road maintenance to reduce pothole reports.',
      priority: 'high',
      impact: 'medium'
    });
  }

  if (categoryStats.garbage > reports.length * 0.2) {
    recommendations.push({
      type: 'service',
      title: 'Waste Management Review',
      description: 'Review waste collection schedules and bin placement.',
      priority: 'medium',
      impact: 'medium'
    });
  }

  // Based on resolution rate
  const resolutionRate = reports.filter(r => r.status === 'Resolved').length / reports.length;
  if (resolutionRate < 0.7) {
    recommendations.push({
      type: 'process',
      title: 'Process Optimization',
      description: 'Review and optimize issue resolution workflows.',
      priority: 'high',
      impact: 'high'
    });
  }

  return recommendations;
}; 