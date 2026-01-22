import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Home - PCB Automation";
  }, []);
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PCB Automotions
        </h1>
        <p className="text-gray-600 mb-8">Internal Tools & Utils</p>

        <div className="flex flex-col gap-4">
          <Link
            to="/product-prompt"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            SEO Product Prompt Generator
          </Link>
          <Link
            to="/reports"
            className="block w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Updates & Reports
          </Link>
          {/* Add more links here in the future */}
        </div>
      </div>
    </div>
  );
};

export default Home;
