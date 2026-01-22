import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ChangePassword from "./ChangePassword";

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                PCB Automation
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive("/")
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/product-prompt"
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive("/product-prompt")
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Product Prompt
              </Link>
              <Link
                to="/reports"
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive("/reports")
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Reports
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.username}
            </span>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Change Password
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </nav>
  );
};

export default Navigation;
