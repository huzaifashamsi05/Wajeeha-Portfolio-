import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom map invalidator for scroll-reveal containers
const MapInvalidator = () => {
    const map = useMap();
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => map.invalidateSize(), 100);
                }
            });
        });
        const container = map.getContainer();
        observer.observe(container);
        return () => observer.disconnect();
    }, [map]);
    return null;
};

const LocationMap = () => {
    const position = [31.4504, 73.1350]; // Faisalabad, Pakistan

    return (
        <section id="location" className="location-section">
            <div className="container">
                <h2 className="section-title reveal">Location</h2>
                
                <div className="map-wrapper glass-card reveal">
                    <div className="map-container-inner">
                        <MapContainer 
                            center={position} 
                            zoom={12} 
                            scrollWheelZoom={false}
                            style={{ height: '400px', width: '100%', borderRadius: '15px', zIndex: 1 }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={position}>
                                <Popup className="custom-popup">
                                    <strong>Wajeeha Imran</strong><br />
                                    Faisalabad, Pakistan
                                </Popup>
                            </Marker>
                            <MapInvalidator />
                        </MapContainer>
                    </div>
                    <p className="map-caption">📍 Faisalabad, Punjab, Pakistan</p>
                </div>
            </div>
        </section>
    );
};

export default LocationMap;
