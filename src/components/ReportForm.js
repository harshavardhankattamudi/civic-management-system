import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, MapPin, AlertCircle, Brain, Zap } from 'lucide-react';
import EnhancedImageClassifier from './EnhancedImageClassifier';

const ReportForm = ({ isOpen, onClose, onSubmit, selectedLocation }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    latitude: selectedLocation?.lat || '',
    longitude: selectedLocation?.lng || '',
    image: null,
    imagePreview: null
  });
  const [showClassifier, setShowClassifier] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Update form data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: selectedLocation.lat || '',
        longitude: selectedLocation.lng || ''
      }));
    }
  }, [selectedLocation]);

  const issueCategories = [
    { value: '', label: 'Select Issue Type' },
    { value: 'pothole', label: '🚗 Pothole' },
    { value: 'traffic_light', label: '🚦 Traffic Light' },
    { value: 'streetlight', label: '💡 Streetlight' },
    { value: 'sidewalk', label: '🚶 Sidewalk' },
    { value: 'stop_sign', label: '🛑 Stop Sign' },
    { value: 'garbage', label: '🗑️ Garbage/Trash' },
    { value: 'drainage', label: '💧 Drainage' },
    { value: 'bench', label: '🪑 Park Bench' },
    { value: 'graffiti', label: '🎨 Graffiti' },
    { value: 'other', label: '📋 Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result, // Base64 string
          imagePreview: e.target.result
        }));
        setShowClassifier(true);
        setAiAnalysis(null);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Please select an issue type';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.latitude || !formData.longitude) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const reportData = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'Submitted',
        aiAnalysis: aiAnalysis
      };

      await onSubmit(reportData);
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        latitude: '',
        longitude: '',
        image: null,
        imagePreview: null
      });
      setErrors({});
      setAiAnalysis(null);
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit report. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          setErrors(prev => ({ ...prev, location: '' }));
        },
        (error) => {
          setErrors(prev => ({
            ...prev,
            location: 'Unable to get your location. Please enter manually.'
          }));
        }
      );
    } else {
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by your browser.'
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Report Civic Issue
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issue Type *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              >
                {issueCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="e.g., Large pothole on Main Street"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Describe the issue in detail. Include location details, severity, and any safety concerns..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              {selectedLocation && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    📍 Location selected from map: {selectedLocation.lat?.toFixed(6)}, {selectedLocation.lng?.toFixed(6)}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Latitude"
                />
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Longitude"
                />
              </div>
              <button
                type="button"
                onClick={handleLocationCapture}
                className="mt-2 flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Use Current Location
              </button>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {formData.imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        setShowClassifier(false);
                      }}
                      className="text-red-500 text-sm hover:text-red-700 dark:hover:text-red-400"
                    >
                      Remove Image
                    </button>
                    
                    {/* AI Image Classification */}
                    {showClassifier && (
                      <div className="mt-3">
                        <EnhancedImageClassifier 
                          onClassificationComplete={(result) => {
                            setFormData(prev => ({
                              ...prev,
                              category: result.category
                            }));
                          }}
                          onAnalysisComplete={(analysis) => {
                            setAiAnalysis(analysis);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm; 