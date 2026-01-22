import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - PCB Automation";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-3 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-lg shadow-blue-600/25 hover:-translate-y-px hover:shadow-blue-600/35 transition-all cursor-pointer"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400"></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
