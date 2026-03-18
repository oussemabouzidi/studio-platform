// components/FilterPanel.jsx
import { useState } from 'react';
import { useI18n } from '@/app/i18n/I18nProvider';
import { useT } from '@/app/i18n/useT';

const FilterPanel = ({ filters, onChange, onReset, studios }) => {
  const { locale } = useI18n();
  const t = useT();

  // Extract unique values for filters from studios data
  const allGenres = [...new Set(studios.flatMap(studio => studio.genres))];
  const allServices = [...new Set(studios.flatMap(studio => studio.types))];
  const allAmenities = [...new Set(studios.flatMap(studio => studio.amenities))];
  const allEquipment = [...new Set(studios.flatMap(studio => studio.equipment))];
  const allLanguages = [...new Set(studios.flatMap(studio => studio.languages))];
  const allAvailability = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const availabilityLabel = (code) => {
    const map = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    const day = map[code] ?? 0;
    const base = new Date(Date.UTC(2023, 0, 1 + day)); // 2023-01-01 is Sunday
    try {
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(base);
    } catch {
      return code;
    }
  };
  
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    location: true,
    genre: true,
    availability: true,
    services: true,
    amenities: true,
    price: true,
    equipment: true,
    studioType: true,
    languages: true
  });
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="bg-gray-900 rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{t('studios.filtersTitle')}</h3>
        <button 
          onClick={onReset}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          {t('studios.resetAll')}
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Location */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('location')}
          >
            <span>{t('studios.location')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.location ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.location && (
            <div className="mt-2">
              <input
                type="text"
                placeholder={t('studios.cityOrStatePlaceholder')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent"
                value={filters.location}
                onChange={(e) => onChange('location', e.target.value)}
              />
            </div>
          )}
        </div>
        
        {/* Genre */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('genre')}
          >
            <span>{t('studios.genre')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.genre ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.genre && (
            <div className="mt-2">
              <input
                type="text"
                placeholder={t('studios.searchGenresPlaceholder')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent mb-2"
                value={filters.genre}
                onChange={(e) => onChange('genre', e.target.value)}
              />
              
              <div className="flex flex-wrap gap-2">
                {allGenres.slice(0, 5).map(genre => (
                  <button
                    key={genre}
                    className={`px-3 py-1 rounded-full text-xs ${
                      filters.genre === genre
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => onChange('genre', genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Availability */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('availability')}
          >
            <span>{t('studios.availability')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.availability ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.availability && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {allAvailability.map(day => (
                <button
                  key={day}
                  className={`py-2 rounded-lg text-center text-sm ${
                    filters.availability.includes(day)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    const newAvailability = filters.availability.includes(day)
                      ? filters.availability.filter(d => d !== day)
                      : [...filters.availability, day];
                    onChange('availability', newAvailability);
                  }}
                >
                  {availabilityLabel(day)}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Services */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('services')}
          >
            <span>{t('studios.services')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.services ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.services && (
            <div className="mt-2 space-y-2">
              {allServices.map(service => (
                <div key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`service-${service}`}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                    checked={filters.services.includes(service)}
                    onChange={(e) => {
                      const newServices = e.target.checked
                        ? [...filters.services, service]
                        : filters.services.filter(s => s !== service);
                      onChange('services', newServices);
                    }}
                  />
                  <label htmlFor={`service-${service}`} className="ml-2 text-gray-300 text-sm">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Amenities */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('amenities')}
          >
            <span>{t('studios.amenities')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.amenities ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.amenities && (
            <div className="mt-2 space-y-2">
              {allAmenities.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) => {
                      const newAmenities = e.target.checked
                        ? [...filters.amenities, amenity]
                        : filters.amenities.filter(a => a !== amenity);
                      onChange('amenities', newAmenities);
                    }}
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 text-gray-300 text-sm">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Price Range */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('price')}
          >
            <span>{t('studios.priceRange')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.price ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.price && (
            <div className="mt-2">
              <div className="flex justify-between text-gray-400 text-sm mb-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) => onChange('priceRange', filters.priceRange[0], parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Equipment */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('equipment')}
          >
            <span>{t('studios.equipment')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.equipment ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.equipment && (
            <div className="mt-2 space-y-2">
              {allEquipment.map(equipment => (
                <div key={equipment} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`equipment-${equipment}`}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                    checked={filters.equipment.includes(equipment)}
                    onChange={(e) => {
                      const newEquipment = e.target.checked
                        ? [...filters.equipment, equipment]
                        : filters.equipment.filter(eq => eq !== equipment);
                      onChange('equipment', newEquipment);
                    }}
                  />
                  <label htmlFor={`equipment-${equipment}`} className="ml-2 text-gray-300 text-sm">
                    {equipment}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Studio Type */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('studioType')}
          >
            <span>{t('studios.studioType')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.studioType ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.studioType && (
            <div className="mt-2 space-y-2">
              {allServices.map(type => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                    checked={filters.studioType.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.studioType, type]
                        : filters.studioType.filter(t => t !== type);
                      onChange('studioType', newTypes);
                    }}
                  />
                  <label htmlFor={`type-${type}`} className="ml-2 text-gray-300 text-sm">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Languages */}
        <div>
          <button 
            className="flex justify-between items-center w-full text-left text-white mb-2"
            onClick={() => toggleSection('languages')}
          >
            <span>{t('studios.languages')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${openSections.languages ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {openSections.languages && (
            <div className="mt-2 space-y-2">
              {allLanguages.map(language => (
                <div key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`language-${language}`}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                    checked={filters.languages.includes(language)}
                    onChange={(e) => {
                      const newLanguages = e.target.checked
                        ? [...filters.languages, language]
                        : filters.languages.filter(l => l !== language);
                      onChange('languages', newLanguages);
                    }}
                  />
                  <label htmlFor={`language-${language}`} className="ml-2 text-gray-300 text-sm">
                    {language}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
