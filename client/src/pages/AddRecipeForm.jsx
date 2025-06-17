import React, { useState } from 'react';
import axios from 'axios';
const AddRecipeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: 'veg',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('/api/recipes/add/', formData);
      setMessage(response.data.message);
      setFormData({ title: '', ingredients: '', instructions: '', category: 'veg' });
    } catch (err) {
      console.error(err);
      setError('Failed to submit recipe. Make sure all fields are filled correctly.');
    }
  };
  return (
    <div className="add-recipe-form">
      <h2>Add a New Recipe</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Ingredients (comma-separated):</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Instructions:</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>
        </div>

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
