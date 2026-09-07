import React from "react";
import { Footer, Header } from "./components";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  AdminDashboard,
  CreateTicket,
  Dashboard,
  FAQ,
  Landing,
  Login,
  Signup,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
