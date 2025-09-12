// components/StudioCardGrid.jsx
import React from 'react';
import { FaStar, FaMapMarkerAlt, FaMusic } from 'react-icons/fa';
import Link from 'next/link';

const StudioCardGrid = ({ studios }) => {
  if (!studios || studios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-[#EAEAEA]">No studios found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {studios.map((studio) => (
        <Link href={`/pages/client/studios/studio-details/${studio.id}`} key={studio.id}>
          <div 
          key={studio.id} 
          className="bg-neutral-400/20 hover:bg-neutral-400/30 backdrop-blur-md rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-neutral-400/20"
        >
          {/* Cover Photo */}
          <div className="relative h-48">
            {studio.coverPhoto ? (
              <img 
                src={studio.coverPhoto} 
                alt={studio.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-[#1a1f1a] w-full h-full flex items-center justify-center">
                <FaMusic className="text-[#540D6E] text-4xl" />
              </div>
            )}
            
            {/* Avatar */}
            <div className="absolute -bottom-6 left-4">
              <div className="bg-[#0C0F0A] p-1 rounded-full">
                {studio.avatar ? (
                  <img 
                    src={studio.avatar} 
                    alt={studio.name} 
                    className="w-12 h-12 rounded-full border-2 border-[#540D6E] object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1a1f1a] border-2 border-[#540D6E] flex items-center justify-center">
                    <FaMusic className="text-[#540D6E]" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Studio Info */}
          <div className="p-5 pt-8">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[#EAEAEA] font-bold text-lg font-special">{studio.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center bg-[#1a1f1a] px-2 py-1 rounded-full">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-[#EAEAEA] font-medium font-special-regular">{studio.rating}</span>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-[#540D6E] mr-2" />
              <span className="text-[#A0A0A0] text-sm font-special-regular">{studio.location}</span>
            </div>
            
            {/* Studio Type Tags */}
            <div className="mb-4">
              <p className="text-[#EAEAEA] text-sm font-medium mb-2 font-special-regular">Studio Type</p>
              <div className="flex flex-wrap gap-2 font-special-regular">
                {studio.types.map((type, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[#540D6E] text-[#EAEAEA] text-xs rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Genre Tags */}
            <div>
              <p className="text-[#EAEAEA] text-sm font-medium mb-2 font-special-regular">Music Genres</p>
              <div className="flex flex-wrap gap-2">
                {studio.genres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[#1a1f1a] border border-[#540D6E] text-[#EAEAEA] text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
        
      ))}
    </div>
  );
};

export default StudioCardGrid;