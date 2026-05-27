// src/pages/NotFound.jsx
// 404 page

import { Link } from 'react-router-dom';
import { HiHome, HiArrowLeft } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center p-4">
      <div className="text-center animate-slide-up max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="font-heading text-[120px] font-black leading-none bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent select-none">
            404
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 blur-3xl -z-10 rounded-full" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <HiHome className="w-5 h-5" />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <HiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
