import React, { useState } from 'react';

const AccountSettings = ({ userId }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
  });

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Password updated successfully');
      } else {
        console.error('Failed to update password:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const submitEmailChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Email updated successfully');
      } else {
        console.error('Failed to update email:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={submitPasswordChange}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          required
        />
        <button type="submit">Change Password</button>
      </form>

      <form onSubmit={submitEmailChange}>
        <input
          type="email"
          name="newEmail"
          placeholder="New Email"
          value={emailData.newEmail}
          onChange={handleEmailChange}
          required
        />
        <button type="submit">Update Email</button>
      </form>
    </div>
  );
};

export default AccountSettings;
