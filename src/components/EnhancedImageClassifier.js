import React, { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { 
  Brain, Loader2, CheckCircle, AlertCircle, Upload, Camera, X,
  Zap, Target, TrendingUp, Shield, Eye, BarChart3
} from 'lucide-react';

const EnhancedImageClassifier = ({ onClassificationComplete, onAnalysisComplete }) => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);

  // Enhanced categories with detailed descriptions
  const categories = [
    {
      name: 'pothole',
      icon: '🚗',
      description: 'Road surface damage requiring immediate repair',
      severity: 'high',
      priority: 'urgent',
      estimatedCost: '$500-2000',
      responseTime: '24-48 hours'
    },
    {
      name: 'traffic_light',
      icon: '🚦',
      description: 'Traffic signal malfunction or damage',
      severity: 'high',
      priority: 'urgent',
      estimatedCost: '$1000-5000',
      responseTime: '2-4 hours'
    },
    {
      name: 'streetlight',
      icon: '💡',
      description: 'Street lighting issue or damage',
      severity: 'medium',
      priority: 'high',
      estimatedCost: '$200-800',
      responseTime: '24-72 hours'
    },
    {
      name: 'sidewalk',
      icon: '🚶',
      description: 'Sidewalk damage or obstruction',
      severity: 'medium',
      priority: 'medium',
      estimatedCost: '$300-1200',
      responseTime: '48-96 hours'
    },
    {
      name: 'garbage',
      icon: '🗑️',
      description: 'Waste management or litter issue',
      severity: 'low',
      priority: 'medium',
      estimatedCost: '$50-200',
      responseTime: '24-48 hours'
    },
    {
      name: 'drainage',
      icon: '💧',
      description: 'Drainage system problem',
      severity: 'high',
      priority: 'high',
      estimatedCost: '$500-3000',
      responseTime: '24-72 hours'
    },
    {
      name: 'graffiti',
      icon: '🎨',
      description: 'Vandalism or graffiti',
      severity: 'low',
      priority: 'low',
      estimatedCost: '$100-500',
      responseTime: '72-168 hours'
    },
    {
      name: 'other',
      icon: '📋',
      description: 'Other civic infrastructure issue',
      severity: 'medium',
      priority: 'medium',
      estimatedCost: '$200-1000',
      responseTime: '48-96 hours'
    }
  ];

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      classifyImage(selectedImage);
    }
  }, [selectedImage]);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate model loading with enhanced features
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock model with enhanced capabilities
      setModel('enhanced');
      console.log('Enhanced AI model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      setError('Failed to load AI model. Using fallback classification.');
      setModel('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const preprocessImage = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 224;
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);
        
        const imageData = ctx.getImageData(0, 0, 224, 224);
        const tensor = tf.browser.fromPixels(imageData, 3);
        const normalized = tensor.div(255.0);
        const batched = normalized.expandDims(0);
        
        resolve(batched);
      };
      img.src = imageUrl;
    });
  };

  const classifyImage = useCallback(async (imageFile) => {
    setIsClassifying(true);
    setError(null);
    setClassificationResult(null);
    setAnalysisResult(null);
    
    try {
      // Simulate enhanced AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Enhanced classification with multiple predictions
      const predictions = categories.map(category => ({
        ...category,
        confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
        features: generateFeatures(category.name)
      }));
      
      // Sort by confidence
      predictions.sort((a, b) => b.confidence - a.confidence);
      
      const topPrediction = predictions[0];
      const confidence = topPrediction.confidence;
      
      // Generate detailed analysis
      const analysis = generateDetailedAnalysis(topPrediction, predictions);
      
      const result = {
        category: topPrediction.name,
        confidence: confidence,
        description: topPrediction.description,
        severity: topPrediction.severity,
        priority: topPrediction.priority,
        estimatedCost: topPrediction.estimatedCost,
        responseTime: topPrediction.responseTime,
        timestamp: new Date().toISOString(),
        allPredictions: predictions,
        analysis: analysis
      };
      setClassificationResult(result);
      setAnalysisResult(analysis);
      setConfidence(confidence);
      
      if (onClassificationComplete) {
        onClassificationComplete(result);
      }
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
      
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Classification error:', err);
    } finally {
      setIsClassifying(false);
    }
  }, [onClassificationComplete, onAnalysisComplete]);

  const generateFeatures = (category) => {
    const features = {
      pothole: ['road damage', 'surface irregularity', 'safety hazard'],
      traffic_light: ['signal malfunction', 'electrical issue', 'traffic safety'],
      streetlight: ['lighting failure', 'electrical problem', 'night visibility'],
      sidewalk: ['walkway damage', 'accessibility issue', 'pedestrian safety'],
      garbage: ['waste accumulation', 'environmental concern', 'public health'],
      drainage: ['water flow issue', 'flooding risk', 'infrastructure problem'],
      graffiti: ['vandalism', 'property damage', 'aesthetic concern'],
      other: ['infrastructure issue', 'public safety', 'maintenance needed']
    };
    return features[category] || ['general issue', 'maintenance required'];
  };

  const generateDetailedAnalysis = (topPrediction, allPredictions) => {
    const analysis = {
      primaryIssue: {
        category: topPrediction.name,
        confidence: topPrediction.confidence,
        severity: topPrediction.severity,
        priority: topPrediction.priority
      },
      secondaryIssues: allPredictions.slice(1, 3).map(p => ({
        category: p.name,
        confidence: p.confidence,
        description: p.description
      })),
      recommendations: generateRecommendations(topPrediction),
      riskAssessment: generateRiskAssessment(topPrediction),
      costImplications: generateCostAnalysis(topPrediction),
      timeline: generateTimeline(topPrediction)
    };
    
    return analysis;
  };

  const generateRecommendations = (prediction) => {
    const recommendations = {
      pothole: [
        'Immediate temporary repair with cold patch',
        'Schedule permanent asphalt repair',
        'Install warning signs if needed'
      ],
      traffic_light: [
        'Dispatch traffic control immediately',
        'Coordinate with traffic management',
        'Implement temporary traffic signals'
      ],
      streetlight: [
        'Check electrical connections',
        'Replace faulty components',
        'Update lighting schedule if needed'
      ],
      sidewalk: [
        'Assess accessibility impact',
        'Plan repair with minimal disruption',
        'Consider temporary walkway'
      ],
      garbage: [
        'Schedule immediate cleanup',
        'Investigate source of accumulation',
        'Implement preventive measures'
      ],
      drainage: [
        'Assess flood risk immediately',
        'Clear blockages if safe',
        'Plan long-term drainage improvement'
      ],
      graffiti: [
        'Document for police report',
        'Schedule removal within 72 hours',
        'Consider anti-graffiti measures'
      ],
      other: [
        'Assess safety implications',
        'Determine appropriate response level',
        'Coordinate with relevant departments'
      ]
    };
    
    return recommendations[prediction.name] || [
      'Assess the situation',
      'Determine appropriate response',
      'Coordinate with relevant teams'
    ];
  };

  const generateRiskAssessment = (prediction) => {
    const riskLevels = {
      high: { level: 'High Risk', color: 'red', description: 'Immediate attention required' },
      medium: { level: 'Medium Risk', color: 'yellow', description: 'Address within 24-48 hours' },
      low: { level: 'Low Risk', color: 'green', description: 'Address within 1 week' }
    };
    
    return riskLevels[prediction.severity] || riskLevels.medium;
  };

  const generateCostAnalysis = (prediction) => {
    return {
      estimatedCost: prediction.estimatedCost,
      budgetImpact: 'Medium',
      costFactors: [
        'Materials and supplies',
        'Labor and equipment',
        'Traffic control if needed',
        'Follow-up maintenance'
      ]
    };
  };

  const generateTimeline = (prediction) => {
    return {
      immediate: 'Within 24 hours',
      shortTerm: prediction.responseTime,
      longTerm: 'Follow-up assessment in 1 week',
      milestones: [
        'Initial assessment',
        'Resource allocation',
        'Work execution',
        'Quality verification',
        'Documentation'
      ]
    };
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setClassificationResult(null);
        setAnalysisResult(null);
        setError(null);
      } else {
        setError('Please select a valid image file.');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setClassificationResult(null);
      setAnalysisResult(null);
      setError(null);
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setClassificationResult(null);
    setAnalysisResult(null);
    setError(null);
    setConfidence(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'text-red-600 dark:text-red-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      low: 'text-green-600 dark:text-green-400'
    };
    return colors[severity] || colors.medium;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200',
      high: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200',
      medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
      low: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
    };
    return colors[priority] || colors.medium;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            Loading AI Model...
          </div>
          <div className="w-32 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image Upload Area */}
      {!selectedImage && (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300">
            Click to upload or drag and drop an image
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supports JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      )}

      {/* Image Preview and Analysis */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Uploaded"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Analysis Progress */}
          {isClassifying && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  AI Analysis in Progress...
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing image features...
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <Target className="w-3 h-3" />
                  Identifying issue category...
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <BarChart3 className="w-3 h-3" />
                  Calculating confidence score...
                </div>
              </div>
            </div>
          )}

          {/* Classification Results */}
          {classificationResult && !isClassifying && (
            <div className="space-y-4">
              {/* Primary Result */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{classificationResult.allPredictions[0].icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {classificationResult.allPredictions[0].description}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Category: {classificationResult.category}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {(classificationResult.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getSeverityColor(classificationResult.severity)}`}>
                      {classificationResult.severity.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Severity</div>
                  </div>
                  <div className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(classificationResult.priority)}`}>
                      {classificationResult.priority.toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {classificationResult.estimatedCost}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Est. Cost</div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              {analysisResult && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Risk Assessment */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Risk Assessment</h5>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(analysisResult.riskAssessment.level.toLowerCase())}`}>
                        {analysisResult.riskAssessment.level}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {analysisResult.riskAssessment.description}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Response Timeline</h5>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <div>Immediate: {analysisResult.timeline.immediate}</div>
                        <div>Short-term: {analysisResult.timeline.shortTerm}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">AI Recommendations</h5>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedImageClassifier; 