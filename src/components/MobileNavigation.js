import React from 'react';
import { motion } from 'framer-motion';
import { 
  Map, BarChart3, Brain, FileText, Plus, 
  Home, Settings, Users
} from 'lucide-react';

const MobileNavigation = ({ 
  activePanel, 
  onPanelChange, 
  userRole, 
  onNewReport,
  showNewReportButton = true 
}) => {
  const panels = [
    {
      id: 'map',
      label: 'Map',
      icon: Map,
      description: 'Interactive map',
      citizenOnly: true
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'All issues'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Performance metrics',
      adminOnly: true
    },
    {
      id: 'ai-dashboard',
      label: 'AI',
      icon: Brain,
      description: 'AI insights',
      adminOnly: true
    }
  ];

  const filteredPanels = panels.filter(panel => {
    if (userRole === 'admin') {
      return !panel.citizenOnly; // Admin sees everything except citizen-only panels
    } else {
      return !panel.adminOnly; // Citizens see everything except admin-only panels
    }
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex items-center justify-around p-2">
        {filteredPanels.map((panel) => {
          const IconComponent = panel.icon;
          const isActive = activePanel === panel.id;
          
          return (
            <motion.button
              key={panel.id}
              onClick={() => onPanelChange(panel.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{panel.label}</span>
            </motion.button>
          );
        })}
        
        {showNewReportButton && userRole === 'citizen' && (
          <motion.button
            onClick={onNewReport}
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Report</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation; 