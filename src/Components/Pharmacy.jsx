import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

const PharmacyCrudComponent = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    cityId: null,
    zoneId: null,
    adresse: '',
    lat: '',
    lon: ''
  });

  useEffect(() => {
    fetchPharmacies();
    fetchCities();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get('/api/all');
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/Villes');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchZones = async (cityId) => {
    try {
      const response = await axios.get(`/api/zones/city/${cityId}`);
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setFormData({
      ...formData,
      cityId,
      zoneId: null // Reset zone selection when city changes
    });
    fetchZones(cityId);
  };

  const openModal = (pharmacy) => {
    setFormData(
      pharmacy || {
        id: null,
        nom: '',
        cityId: null,
        zoneId: null,
        adresse: '',
        lat: '',
        lon: ''
      }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const createOrUpdatePharmacy = async () => {
    try {
      const payload = {
        id: formData.id,
        nom: formData.nom,
        zone: {
          id: formData.zoneId
        },
        adresse: formData.adresse,
        lat: formData.lat,
        lon: formData.lon
      };

      if (formData.id) {
        await axios.put(`/api/${formData.id}`, payload);
      } else {
        await axios.post('/api/save', payload);
      }

      fetchPharmacies();
      closeModal();
    } catch (error) {
      console.error('Error creating/updating pharmacy:', error);
    }
  };

  const deletePharmacy = async (id) => {
    try {
      await axios.delete(`/api/${id}`);
      fetchPharmacies();
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
    }
  };

  return (
    <div>
      <div className="map-container-inner bg-light text-secondary p-4">
        <h1 className="font-bold text-center">Gestion des zones</h1>
      </div>
    <div className='container mt-4 mb-5'>
      <Button variant="primary" onClick={() => openModal(null)}>
        Add Pharmacy
      </Button>

      <table className="table mt-3 border border-secondary ">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Zone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pharmacies.map((pharmacy) => (
            <tr key={pharmacy.id}>
              <td>{pharmacy.id}</td>
              <td>{pharmacy.nom}</td>
              <td>{pharmacy.zone.ville.nom}</td>
              <td>{pharmacy.zone.nom}</td>
              <td>
                <Button  className="btn btn-primary btn-sm mx-1" onClick={() => openModal(pharmacy)}>
                  Edit
                </Button>
                <Button className="btn btn-danger btn-sm " onClick={() => deletePharmacy(pharmacy.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Edit Pharmacy' : 'Add Pharmacy'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="pharmacyName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="pharmacyCity">
            <Form.Label>City:</Form.Label>
            <Form.Control
              as="select"
              name="cityId"
              value={formData.cityId || ''}
              onChange={handleCityChange}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nom}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="pharmacyZone">
            <Form.Label>Zone:</Form.Label>
            <Form.Control
              as="select"
              name="zoneId"
              value={formData.zoneId || ''}
              onChange={handleChange}
            >
              <option value="">Select Zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.nom}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="pharmacyAddress">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="pharmacyLat">
            <Form.Label>Latitude:</Form.Label>
            <Form.Control
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="pharmacyLon">
            <Form.Label>Longitude:</Form.Label>
            <Form.Control
              type="text"
              name="lon"
              value={formData.lon}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createOrUpdatePharmacy}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default PharmacyCrudComponent;
