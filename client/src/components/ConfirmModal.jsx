// src/components/ConfirmModal.jsx
// Confirmation dialog modal before destructive actions (e.g., delete)

import { Fragment } from 'react';
import { HiExclamationCircle } from 'react-icons/hi';

/**
 * @param {boolean}  isOpen   - Whether the modal is visible
 * @param {Function} onClose  - Called when modal is dismissed
 * @param {Function} onConfirm - Called when user confirms
 * @param {string}   title    - Modal title
 * @param {string}   message  - Body text
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message = '' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up border border-gray-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <HiExclamationCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white text-center mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
          {message || 'This action cannot be undone.'}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
