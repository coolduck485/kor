import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePinkTheme } from "@/hooks/use-pink-theme";

const NotFound = () => {
  const location = useLocation();
  const { isPinkActive } = usePinkTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isPinkActive ? 'bg-black' : 'bg-gray-100'}`}>
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${isPinkActive ? 'text-pink-500' : 'text-gray-900'}`}>404</h1>
        <p className={`text-xl mb-4 ${isPinkActive ? 'text-pink-300' : 'text-gray-600'}`}>Oops! Page not found</p>
        <a
          href="/"
          className={`underline ${isPinkActive ? 'text-pink-500 hover:text-pink-300' : 'text-blue-500 hover:text-blue-700'}`}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
