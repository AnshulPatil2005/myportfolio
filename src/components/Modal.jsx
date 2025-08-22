import React from 'react';

// Modal component takes in props:
// - isOpen: boolean → whether the modal should be visible
// - onClose: function → callback to close the modal
// - title: string → heading text
// - description: string → body content
export default function Modal({ isOpen, onClose, title, description }) {
  // If isOpen is false, don't render anything (return null = nothing on screen)
  if (!isOpen) return null;

  return (
    // Full-screen overlay: covers entire viewport with dark background
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Modal content container */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg shadow-lg text-left">
        {/* Title */}
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {title}
        </h2>

        {/* Description text */}
        <p className="text-gray-700 dark:text-gray-300">{description}</p>

        {/* Close button */}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onClose} // Call onClose when clicked
        >
          Close
        </button>
      </div>
    </div>
  );
}
