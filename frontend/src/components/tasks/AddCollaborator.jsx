import React, { useState } from 'react';
import { userService } from '../../services/userService';
import { taskService } from '../../services/taskService';
import { toast } from 'react-toastify';

const AddCollaborator = ({ taskId, onClose, onCollaboratorAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [responsibility, setResponsibility] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const data = await userService.searchUsers(term);
      setSearchResults(data.users);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchTerm(user.username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setLoading(true);
    try {
      await taskService.addCollaborator(taskId, {
        username: selectedUser.username,
        responsibility
      });
      toast.success(`${selectedUser.username} added successfully! Email notification sent.`);
      onCollaboratorAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Collaborator</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">Search User *</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Type username..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            
            {searching && (
              <div className="absolute right-3 top-11 text-gray-400">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                  >
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedUser && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
              <div className="font-medium text-indigo-900">{selectedUser.username}</div>
              <div className="text-sm text-indigo-700">{selectedUser.email}</div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Assigned Responsibility</label>
            <textarea
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              placeholder="e.g., UI implementation, API integration..."
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">Optional: Specify what this person should work on</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !selectedUser}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Collaborator'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollaborator;