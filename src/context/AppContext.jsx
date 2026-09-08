import { useState } from "react";
import { AppContext } from "./AppContextInstance";
import { INITIAL_TICKETS } from "./initialTickets";

export function AppProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: "user", // 'user' | 'admin'
    email: "",
    name: "",
  });

  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const login = (role = "user", email = "") => {
    const userRole = role === "admin" ? "admin" : "user";
    const defaultEmail =
      email || (userRole === "admin" ? "admin@autoticket.com" : "user@autoticket.com");
    const defaultName = userRole === "admin" ? "Alex Rivera" : "Demo Customer";

    setAuth({
      isAuthenticated: true,
      role: userRole,
      email: defaultEmail,
      name: defaultName,
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      role: "user",
      email: "",
      name: "",
    });
  };

  const addTicket = (ticketData) => {
    const newTicket = {
      id: ticketData.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: auth.email ? `USR-${Math.floor(1000 + Math.random() * 9000)}` : "USR-9901",
      userName: auth.name || "Customer User",
      userEmail: auth.email || "user@autoticket.com",
      title: ticketData.title,
      description: ticketData.description,
      status: ticketData.status || "Pending",
      createdAt:
        ticketData.createdAt ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      attachment: ticketData.attachment || null,
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    const normalized = newStatus === "Rejected" ? "Reject" : newStatus;
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: normalized } : t))
    );
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        logout,
        tickets,
        addTicket,
        updateTicketStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
