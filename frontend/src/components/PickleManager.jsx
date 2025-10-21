import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const PickleManager = () => {
  const [pickles, setPickles] = useState([]);
  const [pickle, setPickle] = useState({
    id: '',
    name: '',
    type: '',
    price: '',
    description: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedPickle, setFetchedPickle] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/pickleapi`;

  useEffect(() => {
    fetchAllPickles();
  }, []);

  const fetchAllPickles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setPickles(res.data);
    } catch (error) {
      setMessage('Failed to fetch pickles.');
    }
  };

  const handleChange = (e) => {
    setPickle({ ...pickle, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in pickle) {
      if (!pickle[key] || pickle[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addPickle = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, pickle);
      setMessage('Pickle added successfully.');
      fetchAllPickles();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data || 'Error adding pickle.');
    }
  };

  const updatePickle = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, pickle);
      setMessage('Pickle updated successfully.');
      fetchAllPickles();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data || 'Error updating pickle.');
    }
  };

  const deletePickle = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllPickles();
    } catch (error) {
      setMessage('Error deleting pickle.');
    }
  };

  const getPickleById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedPickle(res.data);
      setMessage('');
    } catch (error) {
      setFetchedPickle(null);
      setMessage('Pickle not found.');
    }
  };

  const handleEdit = (p) => {
    setPickle(p);
    setEditMode(true);
    setMessage(`Editing pickle with ID ${p.id}`);
  };

  const resetForm = () => {
    setPickle({
      id: '',
      name: '',
      type: '',
      price: '',
      description: ''
    });
    setEditMode(false);
  };

  // Predefined dropdown options
  const pickleNames = ['Mango', 'Lemon', 'Mixed', 'Carrot', 'Chili'];
  const pickleTypes = ['Sweet', 'Sour', 'Spicy', 'Tangy'];
  const picklePrices = [50, 100, 150, 200, 250];

  return (
    <div className="pickle-container">

      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Pickle Management</h2>

      <div>
        <h3>{editMode ? 'Edit Pickle' : 'Add Pickle'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={pickle.id} onChange={handleChange} />

          <select name="name" value={pickle.name} onChange={handleChange}>
            <option value="">Select Name</option>
            {pickleNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select name="type" value={pickle.type} onChange={handleChange}>
            <option value="">Select Type</option>
            {pickleTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select name="price" value={pickle.price} onChange={handleChange}>
            <option value="">Select Price</option>
            {picklePrices.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <input type="text" name="description" placeholder="Description" value={pickle.description} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addPickle}>Add Pickle</button>
          ) : (
            <>
              <button className="btn-green" onClick={updatePickle}>Update Pickle</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Pickle By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getPickleById}>Fetch</button>

        {fetchedPickle && (
          <div>
            <h4>Pickle Found:</h4>
            <pre>{JSON.stringify(fetchedPickle, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Pickles</h3>
        {pickles.length === 0 ? (
          <p>No pickles found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(pickle).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pickles.map((p) => (
                  <tr key={p.id}>
                    {Object.keys(pickle).map((key) => (
                      <td key={key}>{p[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn-red" onClick={() => deletePickle(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default PickleManager;

