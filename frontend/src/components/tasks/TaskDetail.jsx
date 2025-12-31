import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import AddCollaborator from './AddCollaborator';
import { toast } from 'react-toastify';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: ''
  });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTask(id);
      setTask(data.task);
      setEditForm({
        title: data.task.title,
        description: data.task.description || '',
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString().split('T')[0] : '',
        priority: data.task.priority
      });
    } catch (error) {
      toast.error('Failed to fetch task');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateStatus(id, newStatus);
      setTask({ ...task, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.updateTask(id, editForm);
      setTask({ ...task, ...editForm });
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading task...</div>
      </div>
    );
  }

  if (!task) return null;

  const isCreator = task.createdBy._id === user.id;
  const currentUserCollab = task.collaborators.find(c => c.userId._id === user.id);

  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  };

  const statusOptions = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{task.title}</h1>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                    {task.priority} Priority
                  </span>
                  {isCreator && (
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      You are the owner
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {isCreator && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Task'}
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>

        {/* Status Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-gray-600 font-medium">Created By:</span>
            <p className="text-gray-800">{task.createdBy.username}</p>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Due Date:</span>
            <p className="text-gray-800">{new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Created On:</span>
            <p className="text-gray-800">{new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Last Updated:</span>
            <p className="text-gray-800">{new Date(task.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* User's Responsibility (if collaborator) */}
        {currentUserCollab && currentUserCollab.assignedResponsibility && (
          <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
            <h3 className="font-semibold text-indigo-900 mb-1">Your Responsibility</h3>
            <p className="text-indigo-700">{currentUserCollab.assignedResponsibility}</p>
            <p className="text-sm text-indigo-600 mt-2">
              You were added by {task.createdBy.username}
            </p>
          </div>
        )}

        {/* Collaborators Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Collaborators ({task.collaborators.length})
            </h2>
            {isCreator && (
              <button
                onClick={() => setShowAddCollaborator(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                + Add Collaborator
              </button>
            )}
          </div>

          {task.collaborators.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No collaborators yet</p>
          ) : (
            <div className="space-y-3">
              {task.collaborators.map((collab) => (
                <div key={collab.userId._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                      {collab.userId.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{collab.userId.username}</p>
                      <p className="text-sm text-gray-600">{collab.userId.email}</p>
                      {collab.assignedResponsibility && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-600">Responsibility:</span>
                          <p className="text-sm text-gray-700 mt-1">{collab.assignedResponsibility}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Added on {new Date(collab.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isCreator && (
                    <button
                      onClick={() => handleRemoveCollaborator(collab.userId._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Log */}
        {task.activityLog && task.activityLog.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Log</h2>
            <div className="space-y-2">
              {task.activityLog.slice(-5).reverse().map((log, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm p-3 bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      <span className="font-medium">{log.performedBy?.username || 'System'}</span>
                      {' '}{log.action}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddCollaborator && (
        <AddCollaborator
          taskId={id}
          onClose={() => setShowAddCollaborator(false)}
          onCollaboratorAdded={fetchTask}
        />
      )}
    </div>
  );
};

export default TaskDetail;