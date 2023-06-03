import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

const ZoneCrudComponent = () => {
  const [zones, setZones] = useState([]);
  const [villes, setVilles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    villeId: null
  });

  useEffect(() => {
    fetchZones();
    fetchVilles();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await axios.get('/api/zones');
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchVilles = async () => {
    try {
      const response = await axios.get('/api/villes');
      setVilles(response.data);
    } catch (error) {
      console.error('Error fetching villes:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const openModal = (zone) => {
    setFormData(zone || {
      id: null,
      nom: '',
      villeId: null
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveZone = async () => {
    try {
      const payload = {
        id: formData.id,
        nom: formData.nom,
        ville: {
          id: formData.villeId
        }
      };

      if (formData.id) {
        await axios.put(`/api/zones/${formData.id}`, payload);
      } else {
        await axios.post('/api/zones/save', payload);
      }

      fetchZones();
      closeModal();
    } catch (error) {
      console.error('Error saving zone:', error);
    }
  };

  const deleteZone = async (id) => {
    try {
      await axios.delete(`/api/zones/${id}`);
      fetchZones();
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  return (
    <div>
      <div className="map-container-inner bg-light text-secondary p-4">
        <h1 className="font-bold text-center">Gestion des zones</h1>
      </div>
      <div className='container mt-4 mb-5'>

        <Button variant="primary" onClick={() => openModal(null)}>
          Add Zone
        </Button>

        <table className="table mt-3 border border-secondary " >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td>{zone.id}</td>
                <td>{zone.nom}</td>
                <td>{zone.ville?.nom}</td>
                <td>
                  <Button  className="btn btn-primary btn-sm mx-1" onClick={() => openModal(zone)}>
                    Edit
                  </Button>
                  <Button  className="btn btn-danger btn-sm " onClick={() => deleteZone(zone.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{formData.id ? 'Edit Zone' : 'Add Zone'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="zoneName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="zoneVille">
              <Form.Label>Ville:</Form.Label>
              <Form.Control
                as="select"
                name="villeId"
                value={formData.villeId || ''}
                onChange={handleChange}
              >
                <option value="">Select Ville</option>
                {villes.map((ville) => (
                  <option key={ville.id} value={ville.id}>
                    {ville.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveZone}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>

  );
};

export default ZoneCrudComponent;
