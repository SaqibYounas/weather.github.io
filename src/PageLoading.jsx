import { useEffect, useCallback } from "react"; // Import React hooks
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

function PageLoading() {
  const navigate = useNavigate(); // Get navigate function to move between routes

  // Memoized function to prevent unnecessary re-renders
  const stableNavigate = useCallback(() => {
    navigate("/Weather"); // Navigate to the "Weather" page
  }, [navigate]); // Dependencies: It only updates if `navigate` changes

  useEffect(() => {
    //  Set a timer to navigate after 4 seconds
    const timer = setTimeout(stableNavigate, 4000);

    //Cleanup function to clear timeout if the component unmounts before execution
    return () => clearTimeout(timer);
  }, [stableNavigate]); // Dependencies: Re-run if `stableNavigate` changes

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <h1 className="text-white text-8xl font-bold animate-spin">W</h1>
    </div>
  );
}

export default PageLoading;
