import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar/Navbar";
import History from "./pages/History";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { SyncProvider } from "./context/SyncProvider";

const App = () => {
  return (
    <BrowserRouter>
      <SyncProvider>
        <Layout>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </SyncProvider>
    </BrowserRouter>
  );
};

export default App;
