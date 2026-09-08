import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer, Header } from "./components";
import { AppProvider } from "./context/AppContext";
import {
  AdminDashboard,
  CreateTicket,
  Dashboard,
  FAQ,
  Landing,
  Profile,
} from "./pages";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
          <Header />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Landing />} />
              <Route path="/signup" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
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
