// import React, { useState, useEffect } from 'react';
// import { taskService } from '../../services/taskService';
// import TaskCard from './TaskCard';
// import TaskForm from './TaskForm';
// import { toast } from 'react-toastify';

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [filter, setFilter] = useState('all'); // all, created, collaborated
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalTasks, setTotalTasks] = useState(0);
//   const tasksPerPage = 10;

//   useEffect(() => {
//     setCurrentPage(1);
//     fetchTasks(1);
//   }, [filter]);

//   useEffect(() => {
//     if (currentPage !== 1) {
//       fetchTasks(currentPage);
//     }
//   }, [currentPage]);

//   const fetchTasks = async (page = 1) => {
//     try {
//       setLoading(true);
//       const data = await taskService.getTasks(page, tasksPerPage);
//       setTasks(data.tasks);
//       setTotalPages(data.pages);
//       setTotalTasks(data.total);
//       console.log('API Response:', { total: data.total, pages: data.pages, count: data.count });
//     } catch (error) {
//       toast.error('Failed to fetch tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const groupTasksByPriority = (tasksList) => {
//     return {
//       High: tasksList.filter(t => t.priority === 'High'),
//       Medium: tasksList.filter(t => t.priority === 'Medium'),
//       Low: tasksList.filter(t => t.priority === 'Low')
//     };
//   };

//   const filteredTasks = tasks.filter(task => {
//     if (filter === 'all') return true;
//     if (filter === 'created') return task.createdBy?._id === JSON.parse(localStorage.getItem('user'))?.id;
//     if (filter === 'collaborated') {
//       return task.collaborators?.some(c => c.userId?._id === JSON.parse(localStorage.getItem('user'))?.id);
//     }
//     return true;
//   });

//   const groupedTasks = groupTasksByPriority(filteredTasks);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg text-gray-600">Loading tasks...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
//         >
//           <span>+</span>
//           <span>New Task</span>
//         </button>
//       </div>

//       {/* Filter Tabs */}
//       <div className="flex space-x-4 mb-6 border-b">
//         <button
//           onClick={() => setFilter('all')}
//           className={`pb-2 px-4 ${filter === 'all' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
//         >
//           All Tasks
//         </button>
//         <button
//           onClick={() => setFilter('created')}
//           className={`pb-2 px-4 ${filter === 'created' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
//         >
//           Created by Me
//         </button>
//         <button
//           onClick={() => setFilter('collaborated')}
//           className={`pb-2 px-4 ${filter === 'collaborated' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
//         >
//           Collaborated
//         </button>
//       </div>

//       {filteredTasks.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No tasks found. Create your first task!</p>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {/* High Priority */}
//           {groupedTasks.High.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
//                 <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
//                 High Priority ({groupedTasks.High.length})
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {groupedTasks.High.map(task => (
//                   <TaskCard key={task._id} task={task} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Medium Priority */}
//           {groupedTasks.Medium.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center">
//                 <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
//                 Medium Priority ({groupedTasks.Medium.length})
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {groupedTasks.Medium.map(task => (
//                   <TaskCard key={task._id} task={task} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Low Priority */}
//           {groupedTasks.Low.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
//                 <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
//                 Low Priority ({groupedTasks.Low.length})
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {groupedTasks.Low.map(task => (
//                   <TaskCard key={task._id} task={task} />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Pagination - Bottom */}
//       {totalTasks > 0 && totalPages > 1 && (
//         <div className="flex justify-center items-center space-x-2 mt-8 p-4 bg-gray-50 rounded-lg">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
//           >
//             ← Previous
//           </button>
//           <span className="text-gray-700 font-medium">
//             Page {currentPage} of {totalPages} ({totalTasks} total tasks)
//           </span>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
//           >
//             Next →
//           </button>
//         </div>
//       )}

//       {showForm && (
//         <TaskForm
//           onClose={() => setShowForm(false)}
//           onTaskCreated={() => fetchTasks(currentPage)}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskList;










import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9; // 9 tasks per page (3x3 grid)

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(1, 1000); // Fetch all tasks
      setTasks(data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const groupTasksByPriority = (tasksList) => {
    return {
      High: tasksList.filter(t => t.priority === 'High'),
      Medium: tasksList.filter(t => t.priority === 'Medium'),
      Low: tasksList.filter(t => t.priority === 'Low')
    };
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'created') return task.createdBy?._id === JSON.parse(localStorage.getItem('user'))?.id;
    if (filter === 'collaborated') {
      return task.collaborators?.some(c => c.userId?._id === JSON.parse(localStorage.getItem('user'))?.id);
    }
    return true;
  });

  // Calculate pagination
  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);
  
  const groupedTasks = groupTasksByPriority(currentTasks);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <span>+</span>
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-4 ${filter === 'all' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter('created')}
          className={`pb-2 px-4 ${filter === 'created' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
        >
          Created by Me
        </button>
        <button
          onClick={() => setFilter('collaborated')}
          className={`pb-2 px-4 ${filter === 'collaborated' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
        >
          Collaborated
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* High Priority */}
          {groupedTasks.High.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                High Priority ({groupedTasks.High.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.High.map(task => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {groupedTasks.Medium.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Medium Priority ({groupedTasks.Medium.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.Medium.map(task => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Low Priority */}
          {groupedTasks.Low.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Low Priority ({groupedTasks.Low.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.Low.map(task => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalTasks > tasksPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-8 p-4 bg-gray-50 rounded-lg">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages} ({totalTasks} total tasks)
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          onTaskCreated={fetchTasks}
        />
      )}
    </div>
  );
};

export default TaskList;