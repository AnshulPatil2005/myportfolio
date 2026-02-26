import React from 'react';

export default function Modal({ isOpen, onClose, title, description }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded border border-slate-700 bg-slate-900 p-6 text-left shadow-lg">
        <h2 className="mb-2 text-xl font-semibold text-slate-100">{title}</h2>
        <p className="text-slate-300">{description}</p>

        <button
          className="mt-4 rounded border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}


