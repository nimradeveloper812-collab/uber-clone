import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// default marker icon fix (Vite bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const driverIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [22, 36],
  iconAnchor: [11, 36],
});

export default function LiveMap({ drivers, center = [31.5204, 74.3587] }) {
  return (
    <div style={{ borderRadius: "14px", overflow: "hidden", height: "300px", marginTop: "16px" }}>
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {drivers.map((d) =>
          d.lat && d.lng ? (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={driverIcon}>
              <Popup>
                🚗 {d.name} <br /> {d.vehicleModel}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}