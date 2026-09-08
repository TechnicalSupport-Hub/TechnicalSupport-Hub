import { useState, useEffect } from "react";
import { AppContext } from "./AppContextInstance";
import { INITIAL_TICKETS, INITIAL_FAQS } from "./initialTickets";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export function AppProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: "user", // 'user' | 'admin'
    email: "",
    name: "",
    id: "",
  });

  const [profile, setProfile] = useState({
    fullName: "Demo Customer",
    email: "user@autoticket.com",
    department: "Customer Operations",
    phone: "+1 (555) 234-5678",
    role: "user",
  });

  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function loadSupabaseData() {
      setIsLoading(true);
      try {
        // 1. Auth session check
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const user = sessionData.session.user;
          const userRole = user.user_metadata?.role || "user";
          const userName = user.user_metadata?.full_name || user.email.split("@")[0];

          setAuth({
            isAuthenticated: true,
            role: userRole,
            email: user.email,
            name: userName,
            id: user.id,
          });

          setProfile({
            fullName: userName,
            email: user.email,
            department: user.user_metadata?.department || "Engineering",
            phone: user.user_metadata?.phone || "",
            role: userRole,
          });
        }

        // 2. Fetch Tickets from DB
        const { data: dbTickets, error: ticketsErr } = await supabase
          .from("tickets")
          .select("*")
          .order("created_at", { ascending: false });

        if (!ticketsErr && dbTickets && dbTickets.length > 0) {
          const mapped = dbTickets.map((t) => ({
            id: t.id,
            userId: t.user_id,
            userName: t.user_name,
            userEmail: t.user_email,
            title: t.title,
            description: t.description,
            status: t.status,
            createdAt: new Date(t.created_at).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            attachment: t.attachment,
          }));
          setTickets(mapped);
        }

        // 3. Fetch FAQs from DB
        const { data: dbFaqs, error: faqsErr } = await supabase
          .from("faqs")
          .select("*")
          .order("created_at", { ascending: false });

        if (!faqsErr && dbFaqs && dbFaqs.length > 0) {
          setFaqs(dbFaqs);
        }

        // 4. Fetch Notifications from DB
        const { data: dbNotifs, error: notifsErr } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!notifsErr && dbNotifs) {
          const mappedNotifs = dbNotifs.map((n) => ({
            id: n.id,
            userId: n.user_id,
            ticketId: n.ticket_id,
            title: n.title,
            message: n.message,
            isRead: n.is_read,
            createdAt: new Date(n.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setNotifications(mappedNotifs);
        }
      } catch (err) {
        console.warn("Supabase initial fetch failed, using fallback data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSupabaseData();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u = session.user;
          const r = u.user_metadata?.role || "user";
          const n = u.user_metadata?.full_name || u.email.split("@")[0];
          setAuth({
            isAuthenticated: true,
            role: r,
            email: u.email,
            name: n,
            id: u.id,
          });
        } else if (event === "SIGNED_OUT") {
          setAuth({
            isAuthenticated: false,
            role: "user",
            email: "",
            name: "",
            id: "",
          });
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Standard Login (works both with Supabase and mock fallback)
  const login = async (role = "user", email = "", password = "") => {
    const userRole = role === "admin" ? "admin" : "user";
    const defaultEmail =
      email || (userRole === "admin" ? "admin@autoticket.com" : "user@autoticket.com");
    const defaultName = userRole === "admin" ? "Alex Rivera" : "Demo Customer";

    // Attempt Supabase sign in if configured and password given
    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: defaultEmail,
          password: password,
        });

        if (!error && data?.user) {
          const u = data.user;
          const r = u.user_metadata?.role || userRole;
          const n = u.user_metadata?.full_name || defaultName;

          setAuth({
            isAuthenticated: true,
            role: r,
            email: u.email,
            name: n,
            id: u.id,
          });
          setProfile((prev) => ({ ...prev, fullName: n, email: u.email, role: r }));
          return { success: true };
        }
      } catch (e) {
        console.warn("Supabase auth failed, fallback to state login:", e);
      }
    }

    // Graceful fallback session
    setAuth({
      isAuthenticated: true,
      role: userRole,
      email: defaultEmail,
      name: defaultName,
      id: userRole === "admin" ? "ADM-001" : "USR-4309",
    });

    setProfile({
      fullName: defaultName,
      email: defaultEmail,
      department: userRole === "admin" ? "Support Engineering" : "Operations",
      phone: "+1 (555) 234-5678",
      role: userRole,
    });

    return { success: true };
  };

  // Sign up with Supabase
  const signUp = async (email, password, fullName, role = "user") => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });

        if (error) throw error;

        // Create profile row
        if (data?.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            role: role,
          });
        }
      } catch (err) {
        console.warn("Supabase signUp warning:", err);
      }
    }

    // Set authenticated state
    login(role, email, password);
    setProfile((prev) => ({ ...prev, fullName, email, role }));
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase sign out error:", err);
      }
    }

    setAuth({
      isAuthenticated: false,
      role: "user",
      email: "",
      name: "",
      id: "",
    });
  };

  // Profile Update
  const updateProfile = async (updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));
    if (updatedData.fullName) {
      setAuth((prev) => ({ ...prev, name: updatedData.fullName }));
    }

    if (isSupabaseConfigured && supabase && auth.id) {
      try {
        await supabase.from("profiles").upsert({
          id: auth.id,
          full_name: updatedData.fullName || profile.fullName,
          department: updatedData.department || profile.department,
          phone: updatedData.phone || profile.phone,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Failed to sync profile to Supabase:", err);
      }
    }
  };

  // Add Ticket (Stored in Supabase DB & state)
  const addTicket = async (ticketData) => {
    const generatedId =
      ticketData.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = auth.id || (auth.email ? `USR-${Math.floor(1000 + Math.random() * 9000)}` : "USR-4309");
    const userName = auth.name || profile.fullName || "Customer User";
    const userEmail = auth.email || profile.email || "user@autoticket.com";

    const newTicket = {
      id: generatedId,
      userId: userId,
      userName: userName,
      userEmail: userEmail,
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

    // Reactively update local state
    setTickets((prev) => [newTicket, ...prev]);

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("tickets").insert({
          id: newTicket.id,
          user_id: newTicket.userId,
          user_name: newTicket.userName,
          user_email: newTicket.userEmail,
          title: newTicket.title,
          description: newTicket.description,
          status: newTicket.status,
          attachment: newTicket.attachment,
        });
      } catch (err) {
        console.warn("Failed to insert ticket into Supabase:", err);
      }
    }

    return newTicket;
  };

  // Update Ticket Status & Generate Notification for User
  const updateTicketStatus = async (ticketId, newStatus) => {
    const normalized = newStatus === "Rejected" ? "Reject" : newStatus;

    // Find the target ticket to notify user
    const targetTicket = tickets.find((t) => t.id === ticketId);

    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: normalized } : t))
    );

    // Create Notification Record for User
    if (targetTicket) {
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: targetTicket.userId,
        ticketId: targetTicket.id,
        title: `Ticket #${targetTicket.id} Status Updated`,
        message: `Your ticket "${targetTicket.title}" has been updated to ${normalized}.`,
        isRead: false,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Sync notification to Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("notifications").insert({
            id: newNotif.id,
            user_id: newNotif.userId,
            ticket_id: newNotif.ticketId,
            title: newNotif.title,
            message: newNotif.message,
            is_read: false,
          });
        } catch (err) {
          console.warn("Failed to persist notification:", err);
        }
      }
    }

    // Sync ticket update to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("tickets")
          .update({
            status: normalized,
            updated_at: new Date().toISOString(),
          })
          .eq("id", ticketId);
      } catch (err) {
        console.warn("Failed to update ticket in Supabase:", err);
      }
    }
  };

  // Notification management
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from("notifications").update({ is_read: true }).eq("id", notifId).catch(console.warn);
    }
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Add FAQ (Admin feature, stored in DB)
  const addFaq = async ({ question, answer, category = "General" }) => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      category,
      createdAt: new Date().toISOString(),
    };

    setFaqs((prev) => [newFaq, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("faqs").insert({
          id: newFaq.id,
          question: newFaq.question,
          answer: newFaq.answer,
          category: newFaq.category,
          created_by: auth.email || "admin@autoticket.com",
        });
      } catch (err) {
        console.warn("Failed to insert FAQ into Supabase:", err);
      }
    }

    return newFaq;
  };

  const deleteFaq = async (faqId) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("faqs").delete().eq("id", faqId);
      } catch (err) {
        console.warn("Failed to delete FAQ from Supabase:", err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        profile,
        updateProfile,
        login,
        signUp,
        logout,
        tickets,
        addTicket,
        updateTicketStatus,
        faqs,
        addFaq,
        deleteFaq,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        isLoading,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
