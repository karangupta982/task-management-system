import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Task Management System
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Collaborate, Organize, and Achieve Your Goals Together
          </p>
          <p className="text-lg mb-12 text-indigo-100 max-w-2xl mx-auto">
            Create tasks, invite team members, assign responsibilities, and track progress 
            with our intuitive task management platform.
          </p>

          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-800 transition border-2 border-white"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            {/* <div className="text-4xl mb-4"></div> */}
            <h3 className="text-xl font-semibold mb-2 text-black">Create Tasks</h3>
            <p className=" text-black">
              Easily create tasks with titles, descriptions, due dates, and priority levels.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-black">
            {/* <div className="text-4xl mb-4"></div> */}
            <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
            <p className="">
              Add team members to tasks and assign specific responsibilities with email notifications.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-black">
            {/* <div className="text-4xl mb-4"></div> */}
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="">
              Monitor task status, view activity logs, and organize by priority levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;