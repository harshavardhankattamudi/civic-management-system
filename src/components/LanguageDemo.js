import React, { useState } from 'react';
import { getTranslation, getCurrentLanguage, setLanguagePreference, supportedLanguages } from '../utils/languagePreferences';

const LanguageDemo = () => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [demoReports] = useState([
    {
      id: 1,
      title: 'Broken Street Light',
      description: 'Street light not working for 3 days',
      category: 'streetlight',
      priority: 'medium',
      status: 'Submitted',
      municipality: 'mumbai',
      citizenName: 'Rajesh Kumar',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Water Pipeline Leak',
      description: 'Major water leak near main road',
      category: 'water_supply',
      priority: 'urgent',
      status: 'In Progress',
      municipality: 'delhi',
      citizenName: 'Priya Sharma',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleLanguageChange = (language) => {
    setLanguagePreference(language);
    setCurrentLang(language);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Language System Demo
      </h2>

      {/* Language Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {getTranslation(currentLang, 'selectLanguage') || 'Select Language'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {supportedLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                currentLang === lang.code
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {lang.nativeName} ({lang.name})
            </button>
          ))}
        </div>
      </div>

      {/* Current Language Display */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Current Language:</strong> {supportedLanguages.find(l => l.code === currentLang)?.nativeName}
        </p>
      </div>

      {/* Demo Reports */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Sample Reports (Translated)
        </h3>
        
        {demoReports.map(report => {
          // Translate the report for current language
          const translatedReport = {
            ...report,
            categoryDisplay: getTranslation(currentLang, report.category.replace('_', '')),
            priorityDisplay: getTranslation(currentLang, report.priority),
            statusDisplay: getTranslation(currentLang, report.status.toLowerCase().replace(' ', ''))
          };

          return (
            <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {report.title}
                </h4>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  {translatedReport.statusDisplay}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                  {translatedReport.priorityDisplay}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {report.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {getTranslation(currentLang, 'issueType')}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {translatedReport.categoryDisplay}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {getTranslation(currentLang, 'status')}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {translatedReport.statusDisplay}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {getTranslation(currentLang, 'priority')}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {translatedReport.priorityDisplay}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {getTranslation(currentLang, 'municipality')}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {report.municipality}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Language Features */}
      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
          Language System Features:
        </h3>
        <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
          <li>• <strong>Persistent Language Selection:</strong> Language preference is saved in localStorage</li>
          <li>• <strong>Real-time Translation:</strong> All UI elements update immediately when language changes</li>
          <li>• <strong>Report Translation:</strong> Report categories, priorities, and statuses are translated</li>
          <li>• <strong>Multi-language Support:</strong> Supports 10 Indian languages + English</li>
          <li>• <strong>Admin & Citizen Access:</strong> Both user types can change language</li>
          <li>• <strong>Fallback System:</strong> Falls back to English if translation not found</li>
        </ul>
      </div>
    </div>
  );
};

export default LanguageDemo; 