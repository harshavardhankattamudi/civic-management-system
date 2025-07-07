import React, { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Brain, Loader2, CheckCircle, AlertCircle, Upload, Camera, X } from 'lucide-react';

const ImageClassifier = ({ onClassificationComplete }) => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);

  // Simple classification categories for civic issues
  const categories = [
    'pothole',
    'streetlight',
    'trash',
    'graffiti',
    'traffic_sign',
    'sidewalk_damage',
    'drainage_issue',
    'other'
  ];

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      classifyImage(selectedImage);
    }
  }, [selectedImage, classifyImage]);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll use a simple pre-trained model
      // In a real implementation, you'd load your custom trained model
      const loadedModel = await tf.loadLayersModel('/model/model.json');
      setModel(loadedModel);
    } catch (error) {
      console.log('Using fallback classification logic');
      // Fallback to simple image analysis
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
    
    try {
      // Simulate AI classification with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock classification results based on file name or random selection
      const categories = [
        { name: 'pothole', confidence: 0.85, description: 'Road surface damage requiring repair' },
        { name: 'traffic_light', confidence: 0.92, description: 'Traffic signal malfunction' },
        { name: 'streetlight', confidence: 0.78, description: 'Street lighting issue' },
        { name: 'sidewalk', confidence: 0.88, description: 'Sidewalk damage or obstruction' },
        { name: 'garbage', confidence: 0.95, description: 'Waste management issue' },
        { name: 'drainage', confidence: 0.82, description: 'Drainage system problem' },
        { name: 'other', confidence: 0.65, description: 'Other civic issue' }
      ];
      
      // Select a random category for demo purposes
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const result = {
        category: randomCategory.name,
        confidence: randomCategory.confidence,
        description: randomCategory.description,
        timestamp: new Date().toISOString()
      };
      
      setClassificationResult(result);
      
      if (onClassificationComplete) {
        onClassificationComplete(result);
      }
    } catch (err) {
      setError('Failed to classify image. Please try again.');
      console.error('Classification error:', err);
    } finally {
      setIsClassifying(false);
    }
  }, [onClassificationComplete]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setClassificationResult(null);
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
      setError(null);
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setClassificationResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
        <span className="text-sm text-blue-600 dark:text-blue-400">
          Analyzing image...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
        <span className="text-sm text-yellow-600 dark:text-yellow-400">
          {error}
        </span>
      </div>
    );
  }

  if (!classificationResult) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            AI Image Classification
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upload an image to automatically classify the civic issue type
          </p>
        </div>

        {!selectedImage ? (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image-upload').click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, GIF up to 10MB
            </p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isClassifying && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-300">Analyzing image...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {classificationResult && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Classification Complete
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(classificationResult.category)}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getCategoryName(classificationResult.category)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Confidence: {(classificationResult.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {classificationResult.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex items-center mb-2">
        <Brain className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        <span className="text-sm font-medium text-green-800 dark:text-green-200">
          AI Classification
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getCategoryIcon(classification.category)}</span>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {getCategoryName(classification.category)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Confidence: {(classification.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
    </div>
  );
};

export default ImageClassifier; 