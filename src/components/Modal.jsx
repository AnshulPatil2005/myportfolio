import React from 'react';

export default function Modal({ isOpen, onClose, title, description }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg shadow-lg text-left">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{title}</h2>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
