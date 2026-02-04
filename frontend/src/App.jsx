import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Home from "./pages/Home";
import ProductPrompt from "./pages/ProductPrompt";
import CategoryPrompt from "./pages/CategoryPrompt";
import Reports from "./pages/Reports";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/product-prompt"
            element={
              <PrivateRoute>
                <ProductPrompt />
              </PrivateRoute>
            }
          />
          <Route
            path="/category-prompt"
            element={
              <PrivateRoute>
                <CategoryPrompt />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
