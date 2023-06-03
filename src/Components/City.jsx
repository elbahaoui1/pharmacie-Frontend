import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const City = () => {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [cityId, setCityId] = useState('');

  useEffect(() => {
    getCities();
  }, []);

  const getCities = async () => {
    try {
      const response = await axios.get('/api/Villes'); // Replace with your API endpoint for fetching cities
      setCities(response.data);
    } catch (error) {
      console.error('Error getting cities:', error);
    }
  };

  const getCityById = async (id) => {
    try {
      const response = await axios.get(`/api/Villes/${id}`); // Replace with your API endpoint for fetching a city by ID
      const city = response.data;
      setCityId(city.id);
      setCityName(city.nom);
    } catch (error) {
      console.error('Error getting city by ID:', error);
    }
  };

  const addCity = async () => {
    try {
      const response = await axios.post('/api/Villes', { nom: cityName }); // Replace with your API endpoint for adding a city
      const newCity = response.data;
      setCities([...cities, newCity]);
      setCityName('');
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  const updateCity = async () => {
    try {
      await axios.put(`/api/Villes/${cityId}`, { nom: cityName }); // Replace with your API endpoint for updating a city
      const updatedCities = cities.map((city) =>
        city.id === cityId ? { ...city, nom: cityName } : city
      );
      setCities(updatedCities);
      setCityId('');
      setCityName('');
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`/api/Villes/${id}`); // Replace with your API endpoint for deleting a city
      const filteredCities = cities.filter((city) => city.id !== id);
      setCities(filteredCities);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  return (
    <div>
    <div className="map-container-inner bg-light text-secondary p-4">
        <h1 className="font-bold text-center">Gestion des villes</h1>
      </div>
    <div className="container mt-4 mb-5">
      <h1>Villes</h1>
      <table className="table mt-3 border border-secondary ">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">City Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr key={city.id}>
              <th scope="row">{index + 1}</th>
              <td>{city.nom}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm mx-1"
                  onClick={() => getCityById(city.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCity(city.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
      <h4>Operation :</h4>
        <input
          type="text"
          className="form-control mr-2 d-inline-block mt-4"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        {cityId ? (
          <button className="btn btn-success mt-5" onClick={updateCity}>
            Update City
          </button>
        ) : (
          <button className="btn btn-primary mt-3" onClick={addCity}>
            Add City
          </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default City;
