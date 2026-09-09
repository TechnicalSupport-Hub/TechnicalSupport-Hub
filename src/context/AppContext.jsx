import { useState, useEffect, useCallback } from "react";
import { AppContext } from "./AppContextInstance";
import { supabase } from "../lib/supabase";

export function AppProvider({ children }) {
  // Authentication state
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: "user",
    email: "",
    name: "",
    id: "",
  });

  // User profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    department: "",
    phone: "",
    role: "user",
  });

  // Main data collections
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch User Profile
  const fetchProfile = useCallback(async (userId, fallbackEmail = "", fallbackName = "") => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile({
          fullName: data.full_name || fallbackName,
          email: data.email || fallbackEmail,
          department: data.department || "",
          phone: data.phone || "",
          role: data.role || "user",
        });
        setAuth((prev) => ({
          ...prev,
          role: data.role || prev.role,
          name: data.full_name || prev.name,
        }));
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }, []);

  // 2. Fetch Tickets
  const fetchTickets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = data.map((t) => ({
          id: t.id,
          userId: t.user_id,
          userName: t.user_name || "Anonymous",
          userEmail: t.user_email || "",
          title: t.title,
          description: t.description,
          status: t.status === "Rejected" ? "Reject" : t.status,
          createdAt: new Date(t.created_at).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          attachment: t.attachment,
        }));
        setTickets(formatted);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  }, []);

  // 3. Fetch FAQs
  const fetchFaqs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setFaqs(data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  }, []);

  // 4. Fetch Notifications
  const fetchNotifications = useCallback(async (userId) => {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        const formatted = data.map((n) => ({
          id: n.id,
          userId: n.user_id,
          ticketId: n.ticket_id,
          title: n.title,
          message: n.message,
          isRead: Boolean(n.is_read),
          createdAt: new Date(n.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setNotifications(formatted);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  // Initialize session and data on mount
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setIsLoading(true);
      try {
        // Check active Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user;

        if (currentUser && isMounted) {
          const role = currentUser.user_metadata?.role || "user";
          const name =
            currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0];

          setAuth({
            isAuthenticated: true,
            role,
            email: currentUser.email || "",
            name,
            id: currentUser.id,
          });

          await fetchProfile(currentUser.id, currentUser.email, name);
          if (role !== "admin") {
            await fetchNotifications(currentUser.id);
          }
        }

        // Fetch shared collections
        await Promise.all([fetchTickets(), fetchFaqs()]);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initialize();

    // Listen to Supabase Auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const u = session.user;
        const role = u.user_metadata?.role || "user";
        const name = u.user_metadata?.full_name || u.email?.split("@")[0];

        setAuth({
          isAuthenticated: true,
          role,
          email: u.email || "",
          name,
          id: u.id,
        });

        await fetchProfile(u.id, u.email, name);
        if (role !== "admin") {
          await fetchNotifications(u.id);
        }
      } else if (event === "SIGNED_OUT") {
        setAuth({
          isAuthenticated: false,
          role: "user",
          email: "",
          name: "",
          id: "",
        });
        setProfile({
          fullName: "",
          email: "",
          department: "",
          phone: "",
          role: "user",
        });
        setNotifications([]);
      }
    });

    // Realtime changes channel
    const realtimeChannel = supabase
      .channel("app-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        () => {
          fetchTickets();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        () => {
          fetchFaqs();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          if (auth.id && auth.role !== "admin") fetchNotifications(auth.id);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
      supabase.removeChannel(realtimeChannel);
    };
  }, [fetchTickets, fetchFaqs, fetchNotifications, fetchProfile, auth.id, auth.role]);

  // Direct Supabase Login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    const user = data?.user;
    if (user) {
      // Fetch profile to get real role
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const userRole = profileRow?.role || user.user_metadata?.role || "user";
      const userName =
        profileRow?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0];

      setAuth({
        isAuthenticated: true,
        role: userRole,
        email: user.email || "",
        name: userName,
        id: user.id,
      });

      setProfile({
        fullName: userName,
        email: user.email || "",
        department: profileRow?.department || "",
        phone: profileRow?.phone || "",
        role: userRole,
      });

      if (userRole !== "admin") {
        fetchNotifications(user.id);
      } else {
        setNotifications([]);
      }
      return { success: true, user, role: userRole };
    }

    return { error: new Error("Authentication failed") };
  };

  // Direct Supabase Sign Up
  const signUp = async (email, password, fullName, role = "user") => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) return { error };

    if (data?.user) {
      // Create user row in public.profiles table
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          email,
          role,
        });
      } catch (profileErr) {
        console.warn("Profile creation deferred:", profileErr);
      }

      setAuth({
        isAuthenticated: true,
        role,
        email,
        name: fullName,
        id: data.user.id,
      });

      setProfile({
        fullName,
        email,
        department: "",
        phone: "",
        role,
      });

      return { success: true, user: data.user, role };
    }

    return { success: true };
  };

  // Direct Supabase Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setAuth({
      isAuthenticated: false,
      role: "user",
      email: "",
      name: "",
      id: "",
    });
    setProfile({
      fullName: "",
      email: "",
      department: "",
      phone: "",
      role: "user",
    });
  };

  // Update Profile in Supabase
  const updateProfile = async (updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));

    if (updatedData.fullName) {
      setAuth((prev) => ({ ...prev, name: updatedData.fullName }));
    }

    if (auth.id) {
      await supabase.from("profiles").upsert({
        id: auth.id,
        full_name: updatedData.fullName ?? profile.fullName,
        department: updatedData.department ?? profile.department,
        phone: updatedData.phone ?? profile.phone,
        updated_at: new Date().toISOString(),
      });
    }
  };

  // Add Ticket to Supabase
  const addTicket = async ({ title, description, attachment = null }) => {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = auth.id || `USR-${Date.now()}`;
    const userName = auth.name || profile.fullName || "User";
    const userEmail = auth.email || profile.email || "";

    const newTicket = {
      id: ticketId,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      title,
      description,
      status: "Pending",
      attachment: typeof attachment === "string" ? attachment : attachment?.previewUrl || null,
    };

    // Optimistic state update
    setTickets((prev) => [
      {
        id: newTicket.id,
        userId: newTicket.user_id,
        userName: newTicket.user_name,
        userEmail: newTicket.user_email,
        title: newTicket.title,
        description: newTicket.description,
        status: newTicket.status,
        createdAt: "Just now",
        attachment: newTicket.attachment,
      },
      ...prev,
    ]);

    const { data, error } = await supabase
      .from("tickets")
      .insert(newTicket)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creating ticket in Supabase:", error);
      throw error;
    }

    return data || newTicket;
  };

  // Update Ticket Status & Send Notification
  const updateTicketStatus = async (ticketId, newStatus) => {
    const status = newStatus === "Rejected" ? "Reject" : newStatus;
    const target = tickets.find((t) => t.id === ticketId);

    // Optimistic ticket update
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );

    // Update in Supabase
    await supabase
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    // Insert Notification for user in Supabase
    if (target) {
      const notifPayload = {
        id: `notif-${Date.now()}`,
        user_id: target.userId,
        ticket_id: ticketId,
        title: `Ticket #${ticketId} Updated`,
        message: `Your ticket "${target.title}" status is now ${status}.`,
        is_read: false,
      };

      setNotifications((prev) => [
        {
          id: notifPayload.id,
          userId: notifPayload.user_id,
          ticketId: notifPayload.ticket_id,
          title: notifPayload.title,
          message: notifPayload.message,
          isRead: false,
          createdAt: "Just now",
        },
        ...prev,
      ]);

      await supabase.from("notifications").insert(notifPayload);
    }
  };

  // Notifications Helpers
  const markNotificationRead = async (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);
  };

  const clearAllNotifications = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (auth.id) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", auth.id);
    }
  };

  // FAQ CRUD in Supabase
  const addFaq = async ({ question, answer, category = "General" }) => {
    const faqId = `faq-${Date.now()}`;
    const newFaq = {
      id: faqId,
      question,
      answer,
      category,
      created_by: auth.email || "Admin",
    };

    setFaqs((prev) => [newFaq, ...prev]);

    const { data, error } = await supabase
      .from("faqs")
      .insert(newFaq)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error inserting FAQ:", error);
      throw error;
    }

    return data || newFaq;
  };

  const deleteFaq = async (faqId) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
    await supabase.from("faqs").delete().eq("id", faqId);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
