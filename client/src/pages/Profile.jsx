import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = user?.access;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/profile/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserInfo({ username: res.data.username, email: res.data.email });
        setFavorites(res.data.favorites || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    } else {
      setError('You are not logged in.');
      setLoading(false);
    }
  }, [accessToken]);

const handleRemoveFavorite = async (recipeTitle) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.access;

    const res = await axios.post(
      'http://localhost:8000/api/remove_favorite/',
      { recipe_title: recipeTitle }, // ✅ Send title in body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update frontend state
    setFavorites((prev) => prev.filter((r) => r.title !== recipeTitle));
  } catch (err) {
    console.error("Failed to remove favorite:", err);
  }
};



  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-header">User Profile</h1>
      <div className="profile-info">
        <p><strong>User:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
      </div>

      <div className="favorites-section">
        <h2 className="favorites-title">Favorite Recipes</h2>
        {favorites.length === 0 ? (
          <p className="text-center">No favorites saved yet.</p>
        ) : (
          favorites.map((r) => (
            <div key={r.id} className="recipe-card">
              <h3 className="recipe-title">{r.title}</h3>
              <p className="recipe-text"><strong>Ingredients:</strong> {r.ingredients}</p>
              <p className="recipe-text"><strong>Instructions:</strong> {r.instructions}</p>
              <button
                className="remove-button"
                onClick={() => handleRemoveFavorite(r.title)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
