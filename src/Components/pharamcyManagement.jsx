import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet-src.esm";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Map() {
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedGarde, setSelectedGarde] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedMarkerTrajet, setSelectedMarkerTrajet] = useState(null);

  const markers = pharmacies.map((pharmacy) => ({
    geocode: [pharmacy.lat, pharmacy.lon, 16],
    popUp: "Nom: " + pharmacy.nom,
  }));

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/64/839/839066.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    fetchZones();
    fetchCities();
    fetchPharmacies();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await axios.get("/api/zones");
      setZones(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get("/api/villes");
      setCities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPharmacies = async (selectedCity, selectedZone) => {
    let url = "/api/all";

    if (selectedCity && selectedZone) {
      url = `/api/villes/${selectedCity}/zones/${selectedZone}/pharmacies/garde`;
    }

    try {
      const response = await axios.get(url, {
        params: {
          periode: selectedGarde,
        },
      });
      setPharmacies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    const selectedCity = document.getElementById("city-select").value;
    const selectedZone = document.getElementById("zone-select").value;

    if (selectedCity && selectedZone) {
      fetchPharmacies(selectedCity, selectedZone);
    }
  };

  const handleReset = () => {
    document.getElementById("city-select").selectedIndex = 0;
    document.getElementById("zone-select").selectedIndex = 0;
    setSelectedGarde("");
    fetchPharmacies();
  };

  const handleShowAll = () => {
    setSelectedGarde("");
    fetchPharmacies();
  };

  const handleGardeChange = (event) => {
    setSelectedGarde(event.target.value);
  };

  const handleMarkerClick = (selectedMarker) => {
    setSelectedMarker(selectedMarker);
    setSelectedMarkerTrajet(null);
  };

  const handleLocationPermission = () => {
    // Your code for handling location permission and fetching routes here
    // Replace the following code with your implementation
    console.log("Location permission granted");
  };

  function LocationMarker() {
    useMapEvents({
      click() {
        handleLocationPermission();
      },
    });

    return null;
  }

  return (
    <div className="map">
      <div className="map-container">
        <div className="map-container-inner bg-light text-secondary p-4">
          <h1 className="font-bold text-center">GeoLocation Pharmacies</h1>
        </div>
        <div className="bg-info p-4">
          <div className="d-flex justify-content-start gap-3">
            <select
              id="city-select"
              className="form-select rounded-top rounded-bottom"
              required
            >
              <option value="">Choisissez la ville</option>
              {cities.map((city) => (
                <option key={city.id} value={city.nom}>
                  {city.nom}
                </option>
              ))}
            </select>
            <select
              id="zone-select"
              className="form-select rounded-top rounded-bottom"
              required
            >
              <option value="">Choisissez la zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.nom}>
                  {zone.nom}
                </option>
              ))}
            </select>
            <select
              id="garde-select"
              className="form-select rounded-top rounded-bottom"
              onChange={handleGardeChange}
              value={selectedGarde}
            >
              <option value="">Choisissez la garde</option>
              <option value="jour">Jour</option>
              <option value="nuit">Nuit</option>
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-success" onClick={handleShowAll}>
              Show All
            </button>
          </div>
        </div>
        <div className="p-4">
          <MapContainer
            center={[30.3477201, -11.0172497]}
            zoom={6}
            style={{ height: "calc(90vh - 160px)", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MarkerClusterGroup showCoverageOnHover={false}>
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={[marker.geocode[0], marker.geocode[1]]}
                  icon={customIcon}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <Popup>{marker.popUp}</Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
            {selectedMarker && (
              <Marker
                position={[selectedMarker.geocode[0], selectedMarker.geocode[1]]}
                icon={customIcon}
              >
                <Popup>
                  {selectedMarker.popUp}
                  {selectedMarkerTrajet && <p>{selectedMarkerTrajet}</p>}
                </Popup>
              </Marker>
            )}
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Map;
