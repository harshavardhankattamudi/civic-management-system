import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, MapPin, AlertCircle, Brain, Zap, Globe, Phone, Mail } from 'lucide-react';
import EnhancedImageClassifier from './EnhancedImageClassifier';
import { indianIssueCategories, findMunicipalityByLocation, getAllMunicipalities } from '../utils/indianMunicipalities';
import { getIssueCategories, getPriorityOptions, getTranslation } from '../utils/languagePreferences';

const ReportForm = ({ isOpen, onClose, onSubmit, selectedLocation, currentLanguage = 'en' }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    latitude: selectedLocation?.lat || '',
    longitude: selectedLocation?.lng || '',
    images: [],
    imagePreview: null,
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
    municipality: '',
  });
  const [showClassifier, setShowClassifier] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Update form data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      const municipality = findMunicipalityByLocation(
        selectedLocation.lat, 
        selectedLocation.lng
      );
      setFormData(prev => ({
        ...prev,
        latitude: selectedLocation.lat || '',
        longitude: selectedLocation.lng || '',
        municipality: municipality ? municipality.id : ''
      }));
    }
  }, [selectedLocation]);

  const issueCategories = getIssueCategories(currentLanguage);
  const municipalities = getAllMunicipalities();

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    })).then(images => {
      setFormData(prev => ({ ...prev, images }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = getTranslation(currentLanguage, 'titleRequired');
    if (!formData.category) newErrors.category = getTranslation(currentLanguage, 'categoryRequired');
    if (!formData.description.trim()) newErrors.description = getTranslation(currentLanguage, 'descriptionRequired');
    if (!formData.latitude || !formData.longitude) newErrors.location = getTranslation(currentLanguage, 'locationRequired');
    if (!formData.municipality) newErrors.municipality = getTranslation(currentLanguage, 'municipalityRequired');
    if (!formData.citizenName.trim()) newErrors.citizenName = getTranslation(currentLanguage, 'nameRequired');
    if (!formData.citizenPhone.trim()) newErrors.citizenPhone = getTranslation(currentLanguage, 'phoneRequired');

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
        images: [],
        imagePreview: null,
        citizenName: '',
        citizenPhone: '',
        citizenEmail: '',
        municipality: '',
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
              {getTranslation(currentLanguage, 'reportIssue')}
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
                {getTranslation(currentLanguage, 'issueType')} *
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
                {getTranslation(currentLanguage, 'title')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder={getTranslation(currentLanguage, 'title')}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {getTranslation(currentLanguage, 'description')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder={getTranslation(currentLanguage, 'description')}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Municipality Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {getTranslation(currentLanguage, 'municipality')} *
              </label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.municipality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              >
                <option value="">{getTranslation(currentLanguage, 'selectMunicipality')}</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name} - {municipality.state}
                  </option>
                ))}
              </select>
              {errors.municipality && (
                <p className="text-red-500 text-sm mt-1">{errors.municipality}</p>
              )}
            </div>

            {/* Citizen Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {getTranslation(currentLanguage, 'citizenInfo')}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getTranslation(currentLanguage, 'name')} *
                  </label>
                  <input
                    type="text"
                    name="citizenName"
                    value={formData.citizenName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.citizenName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder={getTranslation(currentLanguage, 'enterFullName')}
                  />
                  {errors.citizenName && (
                    <p className="text-red-500 text-sm mt-1">{errors.citizenName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getTranslation(currentLanguage, 'phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    name="citizenPhone"
                    value={formData.citizenPhone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.citizenPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="+91-9876543210"
                  />
                  {errors.citizenPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.citizenPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getTranslation(currentLanguage, 'email')}
                  </label>
                  <input
                    type="email"
                    name="citizenEmail"
                    value={formData.citizenEmail}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.citizenEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="your.email@example.com"
                  />
                  {errors.citizenEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.citizenEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {getTranslation(currentLanguage, 'location')} *
              </label>
              {selectedLocation && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                      <p className="text-sm text-green-700 dark:text-green-300">
                      📍 {getTranslation(currentLanguage, 'location')}: {selectedLocation.lat?.toFixed(6)}, {selectedLocation.lng?.toFixed(6)}
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
                {getTranslation(currentLanguage, 'useCurrentLocation')}
              </button>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {getTranslation(currentLanguage, 'photoOptional')}
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                {formData.images.length > 0 ? (
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center justify-center">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, images: [] }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        setShowClassifier(false);
                      }}
                      className="text-red-500 text-sm hover:text-red-700 dark:hover:text-red-400"
                    >
                      Remove All Images
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
                  multiple
                  onChange={handleImageChange}
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
              {isSubmitting ? 'Submitting...' : getTranslation(currentLanguage, 'submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm; 