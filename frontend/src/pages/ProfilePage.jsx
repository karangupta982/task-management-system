import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    emailNotifications: true,
    theme: 'light'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data.user);
      setFormData({
        username: data.user.username,
        emailNotifications: data.user.preferences.emailNotifications,
        theme: data.user.preferences.theme
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        username: formData.username,
        preferences: {
          emailNotifications: formData.emailNotifications,
          theme: formData.theme
        }
      });
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {!editing ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold">
                  {profile?.username[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{profile?.username}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-4 mt-6">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Email Notifications:</span>
                    <span className="font-medium">
                      {profile?.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-700">Theme:</span>
                    <span className="font-medium capitalize">{profile?.preferences.theme}</span>
                  </div> */}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Member Since:</span>
                    <span className="font-medium">
                      {new Date(profile?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-gray-700">Enable Email Notifications</span>
              </label>
            </div>

            {/* <div className="mb-6">
              <label className="block text-gray-700 mb-2">Theme</label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div> */}

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;