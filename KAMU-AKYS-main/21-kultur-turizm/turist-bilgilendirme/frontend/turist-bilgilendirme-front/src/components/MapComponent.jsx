import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 39.92077, // Ankara merkez
  lng: 32.85411
};

function MapComponent({ city = 'Ankara', showRealTimePins = true, highlightedLocation = null }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Statik pin verileri
  const staticPins = [
    {
      id: 1,
      name: "Anıtkabir",
      coordinates: [39.9254, 32.8369],
      type: "cultural",
      icon: "🏛️",
      description: "Mustafa Kemal Atatürk'ün anıt mezarı"
    },
    {
      id: 2,
      name: "Anadolu Medeniyetleri Müzesi",
      coordinates: [39.9415, 32.8597],
      type: "museum",
      icon: "🏛️",
      description: "Anadolu'nun tarihi eserlerini sergileyen müze"
    },
    {
      id: 3,
      name: "Kızılay Metro İstasyonu",
      coordinates: [39.9208, 32.8541],
      type: "transportation",
      icon: "🚇",
      description: "Ana metro bağlantı noktası"
    },
    {
      id: 4,
      name: "Hacettepe Hastanesi",
      coordinates: [39.9334, 32.8597],
      type: "emergency",
      icon: "🏥",
      description: "Acil servis hizmetleri"
    }
  ];

  // Vurgulanan konum varsa onu da ekle
  const allPins = [...staticPins];
  if (highlightedLocation && highlightedLocation.coordinates) {
    allPins.push({
      id: 'highlighted',
      name: highlightedLocation.name || 'Seçili Konum',
      coordinates: highlightedLocation.coordinates,
      type: 'highlighted',
      icon: '📍',
      description: highlightedLocation.description || 'Seçili konum'
    });
  }

  const getMarkerIcon = (type) => {
    const icons = {
      cultural: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      museum: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      transportation: 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
      emergency: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      highlighted: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    return icons[type] || 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
  };

  // Vurgulanan konum varsa onun merkezi harita merkezi yap
  const mapCenter = highlightedLocation && highlightedLocation.coordinates 
    ? { lat: highlightedLocation.coordinates[0], lng: highlightedLocation.coordinates[1] }
    : center;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={highlightedLocation ? 15 : 13}
        options={{
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#242f3e' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#242f3e' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#746855' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }]
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {showRealTimePins && allPins.map((pin) => {
          if (!pin.coordinates || pin.coordinates.length !== 2) return null;
          
          return (
            <Marker
              key={pin.id}
              position={{
                lat: pin.coordinates[0],
                lng: pin.coordinates[1]
              }}
              icon={getMarkerIcon(pin.type)}
              title={pin.name}
              onClick={() => setSelectedMarker(pin)}
            />
          );
        })}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.coordinates[0],
              lng: selectedMarker.coordinates[1]
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-1">
                {selectedMarker.icon} {selectedMarker.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedMarker.description}
              </p>
              {selectedMarker.address && (
                <p className="text-xs text-gray-500">
                  📍 {selectedMarker.address}
                </p>
              )}
              {selectedMarker.phone && (
                <p className="text-xs text-gray-500">
                  📞 {selectedMarker.phone}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent; 