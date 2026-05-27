// src/components/Spinner.jsx
// Reusable loading spinner

const Spinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin`}
      />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
};

export default Spinner;
