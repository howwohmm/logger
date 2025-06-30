
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
        <p className="text-gray-500 font-light">Loading ideas...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
