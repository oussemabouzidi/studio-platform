'use client';

import { useState, useRef } from 'react';
import { FaCheck, FaPlus, FaTrash, FaChevronLeft } from 'react-icons/fa';

export default function CreateStudioAccountPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 Data
    studioName: '',
    description: '',
    avatarImage: null,
    galleryImages: [],
    location: '',
    contact: {
      email: '',
      phone: '',
      website: '',
      instagram: '',
      soundcloud: '',
      youtube: ''
    },
    
    // Step 2 Data
    schedule: {
      monday: { open: false, start: '', end: '' },
      tuesday: { open: false, start: '', end: '' },
      wednesday: { open: false, start: '', end: '' },
      thursday: { open: false, start: '', end: '' },
      friday: { open: false, start: '', end: '' },
      saturday: { open: false, start: '', end: '' },
      sunday: { open: false, start: '', end: '' }
    },
    services: [],
    
    // Step 3 Data
    additionalInfo: {
      amenities: [],
      rules: '',
      cancellationPolicy: ''
    }
  });
  
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    priceType: 'hour',
    duration: '',
    maxCapacity: '',
    availableTimes: '',
    tags: ''
  });
  
  const avatarInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Handle image uploads
  const handleImageUpload = (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check if it's an image
  if (!file.type.match('image.*')) {
    alert('Please select an image file (JPEG, PNG, etc.)');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    if (type === 'avatar') {
      setFormData(prev => ({ ...prev, avatarImage: reader.result }));
    } else {
      // Use functional update to ensure we have latest state
      setFormData(prev => {
        // Check if we can add more images
        if (prev.galleryImages.length < 5) {
          return {
            ...prev,
            galleryImages: [...prev.galleryImages, reader.result]
          };
        } else {
          alert('Maximum of 5 gallery images reached');
          return prev;
        }
      });
    }
  };
  reader.readAsDataURL(file);
};

  // Handle contact info changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  // Handle schedule changes
  const handleScheduleChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value
        }
      }
    }));
  };

  // Toggle day open/closed
  const toggleDayOpen = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          open: !prev.schedule[day].open
        }
      }
    }));
  };

  // Handle new service changes
  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  // Add new service
  const addService = () => {
    if (newService.name && newService.price) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService({
        name: '',
        description: '',
        price: '',
        priceType: 'hour',
        duration: '',
        maxCapacity: '',
        availableTimes: '',
        tags: ''
      });
    }
  };

  // Remove service
  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Studio Account Created:', formData);
    // Add your form submission logic here
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Step indicator component
  const StepIndicator = ({ number, title, active }) => (
    <div className={`flex items-center mb-6 ${active ? 'text-white' : 'text-purple-200'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
        active ? 'bg-white text-purple-600' : 'border-2 border-purple-200'
      }`}>
        {active ? <FaCheck /> : number}
      </div>
      <div>
        <p className="text-sm font-light">STEP {number}</p>
        <p className="font-medium">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      {/* Left Side - Steps Indicator */}
      <div className="w-1/3 bg-gradient-to-br from-purple-600 to-blue-600 p-12 flex flex-col justify-center">
        <div className="mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold text-purple-600">L</div>
          </div>
          <h1 className="text-4xl font-bold text-white text-center">Labz</h1>
          <p className="text-purple-200 text-center mt-2">Studio Account Setup</p>
        </div>
        
        <div className="space-y-2">
          <StepIndicator number={1} title="Basic Infos" active={currentStep === 1} />
          <StepIndicator number={2} title="Planning & Services" active={currentStep === 2} />
          <StepIndicator number={3} title="Additional Infos" active={currentStep === 3} />
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-2/3 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Planning & Services'}
              {currentStep === 3 && 'Additional Information'}
            </h2>
            <p className="text-gray-600 mt-2">
              {currentStep === 1 && 'Tell us about your studio'}
              {currentStep === 2 && 'Set your schedule and services'}
              {currentStep === 3 && 'Add final details about your studio'}
            </p>
          </div>

          {/* Form Steps */}
          <div className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Studio Name & Description */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Studio Name*</label>
                    <input
                      type="text"
                      value={formData.studioName}
                      onChange={(e) => setFormData({...formData, studioName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Description*</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </div>
                
                {/* Avatar Image */}
                <div>
                  <label className="block text-gray-700 mb-2">Studio Logo*</label>
                  <div className="flex items-center">
                    <div className="relative">
                      {formData.avatarImage ? (
                        <img 
                          src={formData.avatarImage} 
                          alt="Studio avatar" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <button
                        onClick={() => avatarInputRef.current.click()}
                        className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                      >
                        <FaPlus />
                      </button>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'avatar')}
                      />
                    </div>
                    <p className="text-sm text-gray-500 ml-4">
                      Recommended size: 400×400px<br />
                      JPG, PNG format
                    </p>
                  </div>
                </div>
                
                {/* Gallery Images */}
                <div>
                  <label className="block text-gray-700 mb-2">Gallery Images (max 5)</label>
                  <div className="flex flex-wrap gap-4">
                    {formData.galleryImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={img} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                    {formData.galleryImages.length < 5 && (
                      <div 
                        className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => galleryInputRef.current.click()}
                      >
                        <FaPlus className="text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={galleryInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'gallery')}
                    />
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-gray-700 mb-2">Location*</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Search with Google Maps"
                    required
                  />
                </div>
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.contact.email}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.contact.phone}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.contact.website}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.contact.instagram}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">SoundCloud</label>
                      <input
                        type="url"
                        name="soundcloud"
                        value={formData.contact.soundcloud}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="https://soundcloud.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">YouTube</label>
                      <input
                        type="url"
                        name="youtube"
                        value={formData.contact.youtube}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="https://youtube.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Planning & Services */}
            {currentStep === 2 && (
              <div className="space-y-8">
                {/* Schedule */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Schedule</h3>
                  <div className="space-y-4">
                    {Object.entries(formData.schedule).map(([day, data]) => (
                      <div key={day} className="flex items-center border-b border-gray-100 pb-4">
                        <div className="w-32">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleDayOpen(day)}
                              className={`w-12 h-6 rounded-full p-1 mr-3 transition-colors ${
                                data.open ? 'bg-purple-600' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                                  data.open ? 'translate-x-6' : ''
                                }`}
                              ></div>
                            </button>
                            <span className="capitalize font-medium">{day}</span>
                          </div>
                        </div>
                        
                        {data.open ? (
                          <div className="flex space-x-4">
                            <div>
                              <label className="text-sm text-gray-600 mb-1 block">Open</label>
                              <input
                                type="time"
                                value={data.start}
                                onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 mb-1 block">Close</label>
                              <input
                                type="time"
                                value={data.end}
                                onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Services */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Services</h3>
                  <div className="space-y-6">
                    {/* Add New Service Form */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-3">Add New Service</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Service Name*</label>
                          <input
                            type="text"
                            name="name"
                            value={newService.name}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Recording Session"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Price Type*</label>
                          <select
                            name="priceType"
                            value={newService.priceType}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="hour">Per Hour</option>
                            <option value="session">Per Session</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Price*</label>
                          <input
                            type="number"
                            name="price"
                            value={newService.price}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Duration (minutes)</label>
                          <input
                            type="number"
                            name="duration"
                            value={newService.duration}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="60"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Max Capacity</label>
                          <input
                            type="number"
                            name="maxCapacity"
                            value={newService.maxCapacity}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Available Times</label>
                          <input
                            type="text"
                            name="availableTimes"
                            value={newService.availableTimes}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="9AM-5PM"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-700 mb-1 text-sm">Description</label>
                          <textarea
                            name="description"
                            value={newService.description}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            rows="2"
                            placeholder="Describe your service..."
                          ></textarea>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-700 mb-1 text-sm">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            value={newService.tags}
                            onChange={handleNewServiceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="recording, mixing, mastering"
                          />
                        </div>
                      </div>
                      <button
                        onClick={addService}
                        className="mt-4 flex items-center text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FaPlus className="mr-2" /> Add Service
                      </button>
                    </div>
                    
                    {/* Services List */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Your Services</h4>
                      {formData.services.length > 0 ? (
                        <div className="space-y-4">
                          {formData.services.map((service, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{service.name}</h5>
                                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                    ${service.price}/{service.priceType}
                                  </span>
                                  {service.duration && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      {service.duration} mins
                                    </span>
                                  )}
                                  {service.maxCapacity && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      Max {service.maxCapacity} people
                                    </span>
                                  )}
                                  {service.tags && (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                      {service.tags}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => removeService(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No services added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Infos */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                  <p className="text-gray-600 mb-6">
                    Provide any additional details that artists should know about your studio.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Studio Rules</label>
                      <textarea
                        value={formData.additionalInfo.rules}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          additionalInfo: {
                            ...prev.additionalInfo,
                            rules: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="4"
                        placeholder="List any specific rules for your studio..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Cancellation Policy</label>
                      <textarea
                        value={formData.additionalInfo.cancellationPolicy}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          additionalInfo: {
                            ...prev.additionalInfo,
                            cancellationPolicy: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="3"
                        placeholder="Describe your cancellation policy..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Wi-Fi', 'Parking', 'Air Conditioning', 
                          'Kitchen', 'Restroom', 'Wheelchair Access',
                          'Instruments', 'Mixing Console', 'Monitor Speakers'
                        ].map(amenity => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => setFormData(prev => {
                              const amenities = [...prev.additionalInfo.amenities];
                              const index = amenities.indexOf(amenity);
                              
                              if (index > -1) {
                                amenities.splice(index, 1);
                              } else {
                                amenities.push(amenity);
                              }
                              
                              return {
                                ...prev,
                                additionalInfo: {
                                  ...prev.additionalInfo,
                                  amenities
                                }
                              };
                            })}
                            className={`px-3 py-1 rounded-full text-sm ${
                              formData.additionalInfo.amenities.includes(amenity)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChevronLeft className="mr-2" /> Back
            </button>
            
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {currentStep === 3 ? 'Complete Registration' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}