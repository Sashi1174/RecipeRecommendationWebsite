import React, { useState } from 'react';
import axios from 'axios';
import './recommend.css';                                             // adjust path if needed
import { toast, ToastContainer } from 'react-toastify';               
import 'react-toastify/dist/ReactToastify.css';                       
const RecommendForm = () => {                                        
  const [ingredients, setIngredients] = useState('');                 
  const [isVeg, setIsVeg] = useState('all');                          
  const [results, setResults] = useState([]);                          
  const [message, setMessage] = useState('');                        
 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: 'veg',
  });

const handleRecommend = async (e) => {
  e.preventDefault();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.access;

    const res = await axios.post(
      'http://localhost:8000/api/recommend/',
      {
        ingredients: ingredients,
        is_veg: isVeg === 'veg' ? true : isVeg === 'non-veg' ? false : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ Correct
        },
      }
    );

    if (res.data.message) {
      setResults([]);
      setMessage(res.data.message);
    } else {
      setResults(res.data);
      setMessage('');
    }
  } catch (error) {
    console.error('Recommendation error:', error);
    setMessage('An error occurred while fetching recommendations.');
  }
};


const saveFavorite = async (recipeTitle) => {
  try {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;

    await axios.post(
      'http://localhost:8000/api/recipes/save_favorite/',
      { recipe_title: recipeTitle },  // changed key and value to title
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    <ToastContainer position="top-right" autoClose={3000} />
    console.log("Recipe saved to favorites!");
    toast.success('✅ Login successful!');
    alert("Recipe saved to favorites!")
  } catch (error) {
    console.error("Error saving recipe to favorites:", error);
  }
};


  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/recipes/add/', newRecipe);
      alert(res.data.message || 'Recipe added!');
      setNewRecipe({ title: '', ingredients: '', instructions: '', category: 'veg' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Add recipe error:', err);
      alert('Failed to add recipe. Please check your input.');
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Recommender</h1>
      {/* Add Recipe Toggle Button */}
      <div className="text-right mb-4">
        <button
  onClick={toggleAddForm}
  className="bg-purple-500 text-yellow-300 px-4 py-2 rounded"
>
  {showAddForm ? 'Close Add Recipe' : 'Add New Recipe'}
</button>

      </div>

      {/* Add Recipe Form */}
      {showAddForm && (
        <form onSubmit={handleAddRecipe} className="mb-6 border p-4 rounded shadow-sm bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Add New Recipe</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            className="w-full border p-2 mb-2"
            required
          />
          <textarea
            name="ingredients"
            placeholder="Ingredients (comma-separated)"
            value={newRecipe.ingredients}
            onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
            className="w-full border p-2 mb-2"
            required
          />
          <textarea
            name="instructions"
            placeholder="Instructions"
            value={newRecipe.instructions}
            onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
            className="w-full border p-2 mb-2"
            required
          />
          <select
            name="category"
            value={newRecipe.category}
            onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
            className="w-full border p-2 mb-2"
          >
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Recipe
          </button>
        </form>
      )}

      {/* Recommendation Form */}
      <form onSubmit={handleRecommend} className="mb-4">
        <textarea
          className="w-full border p-2"
          placeholder="Enter your ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <div className="my-2">
          <label className="block mb-1 font-semibold">Filter by Type:</label>
          <select
            className="border p-2 w-full"
            value={isVeg}
            onChange={(e) => setIsVeg(e.target.value)}
          >
            <option value="all">All</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
          Recommend
        </button>
      </form>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <div>
        {results.map((r, index) => (
          <div key={index} className="border p-4 mb-4 rounded shadow-sm">
            <h2 className="text-xl font-bold">{r.title}</h2>
            <p className="text-sm italic mb-2">{r.message}</p>
            <p><strong>Ingredients:</strong> {r.ingredients}</p>
            <p><strong>Instructions:</strong> {r.instructions}</p>
            <button
              onClick={() => saveFavorite(r.title)}
              className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
            >
              Save Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendForm; 