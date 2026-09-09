import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer, Header, ProtectedRoute } from "./components";
import { AppProvider } from "./context/AppContext";
import {
  AdminDashboard,
  CreateTicket,
  FAQ,
  Landing,
  Profile,
  UserTickets,
} from "./pages";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
          <Header />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Landing />} />
              <Route path="/signup" element={<Landing />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected User Routes */}
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <UserTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-ticket"
                element={
                  <ProtectedRoute>
                    <CreateTicket />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard" element={<Navigate to="/faq" replace />} />

              {/* Protected Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
