import React, { useState } from 'react';

const Profile = ({ userId }) => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profilePicture: '',
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Include the authentication token
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Profile updated:', data);
      } else {
        console.error('Failed to update profile:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={profileData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={profileData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="profilePicture"
        placeholder="Profile Picture URL"
        value={profileData.profilePicture}
        onChange={handleChange}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default Profile;
