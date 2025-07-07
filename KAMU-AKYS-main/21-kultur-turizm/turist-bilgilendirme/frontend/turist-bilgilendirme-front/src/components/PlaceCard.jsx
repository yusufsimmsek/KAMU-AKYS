import React from 'react';

function PlaceCard({ 
  title, 
  description, 
  location, 
  mediaUrl, 
  mediaType = 'image', // 'image' veya 'video'
  buttonText = 'Haritada Göster',
  onButtonClick
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-3">{title}</h2>

      {mediaType === 'video' ? (
        <video
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      ) : (
        <img
          src={mediaUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}

      <p className="text-gray-700 mb-2">
        {description}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        📍 {location}
      </p>

      <button 
        onClick={onButtonClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default PlaceCard; 