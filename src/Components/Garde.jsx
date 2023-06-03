import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

const PharmacieGardeCrudComponent = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pharmacieId: '',
    date_debut: '',
    date_fin: ''
  });
  
  // Define the static gardeId
  const gardeId = 1; // 1 for "jour", 2 for "nuit"

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get('/api/all');
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const openModal = () => {
    setFormData({
      pharmacieId: '',
      date_debut: '',
      date_fin: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const savePharmacieGarde = async () => {
    try {
      const payload = {
        pharmacie: {
          id: formData.pharmacieId
        },
        garde: {
          id: gardeId
        },
        date_debut: formData.date_debut,
        date_fin: formData.date_fin
      };

      await axios.post('/api/pharmacieGarde/save', payload);
      fetchPharmacies();
      closeModal();
    } catch (error) {
      console.error('Error saving PharmacieGarde:', error);
    }
  };

  return (
    <div>
      <div className="map-container-inner bg-light text-secondary p-4">
        <h1 className="font-bold text-center">Gestion des gardes de pharmacies</h1>
      </div>
      <div className="container mt-4 mb-5">
        <Button variant="primary" onClick={openModal}>
          Add PharmacieGarde
        </Button>

        <table className="table mt-3 border border-secondary">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pharmacie</th>
              <th>Garde</th>
              <th>Date début</th>
              <th>Date fin</th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((pharmacie) => (
              <tr key={pharmacie.id}>
                <td>{pharmacie.id}</td>
                <td>{pharmacie.nom}</td>
                <td>{gardeId === 1 ? 'jour' : 'nuit'}</td>
                <td>{formData.date_debut}</td>
                <td>{formData.date_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add PharmacieGarde</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="pharmacieId">
              <Form.Label>Pharmacie:</Form.Label>
              <Form.Control
                as="select"
                name="pharmacieId"
                value={formData.pharmacieId}
                onChange={handleChange}
              >
                <option value="">Select Pharmacie</option>
                {pharmacies.map((pharmacie) => (
                  <option key={pharmacie.id} value={pharmacie.id}>
                    {pharmacie.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="date_debut">
              <Form.Label>Date début:</Form.Label>
              <Form.Control
                type="text"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="date_fin">
              <Form.Label>Date fin:</Form.Label>
              <Form.Control
                type="text"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={savePharmacieGarde}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PharmacieGardeCrudComponent;
