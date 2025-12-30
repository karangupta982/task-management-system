import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const priorityColors = {
    High: 'bg-red-100 text-red-800 border-red-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Low: 'bg-green-100 text-green-800 border-green-300'
  };

  const statusColors = {
    Pending: 'bg-gray-200 text-gray-700',
    'In Progress': 'bg-blue-200 text-blue-700',
    Completed: 'bg-green-200 text-green-700'
  };

  const isCreator = task.createdBy?._id === user?.id || task.createdBy === user?.id;

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className={`border-l-4 ${priorityColors[task.priority].split(' ')[2]} bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded ${statusColors[task.status]}`}>
            {task.status}
          </span>
          {isCreator && (
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Owner
            </span>
          )}
        </div>
        <span className="text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>

      {task.collaborators && task.collaborators.length > 0 && (
        <div className="mt-3 flex items-center">
          <span className="text-xs text-gray-600 mr-2">Collaborators:</span>
          <div className="flex -space-x-2">
            {task.collaborators.slice(0, 3).map((collab, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs border-2 border-white"
                title={collab.userId?.username}
              >
                {collab.userId?.username?.[0]?.toUpperCase()}
              </div>
            ))}
            {task.collaborators.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs border-2 border-white">
                +{task.collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;