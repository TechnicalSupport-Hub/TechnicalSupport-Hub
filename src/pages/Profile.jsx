import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, LogOut } from "lucide-react";
import { useApp } from "../context/useApp";
import { Button, Input } from "../components";

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, auth, logout } = useApp();

  const [fullName, setFullName] = useState(profile.fullName || auth.name || "");
  const [department, setDepartment] = useState(profile.department || "Operations");
  const [phone, setPhone] = useState(profile.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        fullName,
        department,
        phone,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Back navigation & Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/faq")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            title="Back to Help Center"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Hero Section Banner */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gray-950 px-6 py-7 sm:px-8 sm:py-8 text-left">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0084ff] to-blue-700 text-white font-bold text-xl shadow-md">
                {fullName ? fullName[0].toUpperCase() : "U"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {fullName || "User Profile"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <ShieldCheck size={11} />
                    <span>{auth.role === "admin" ? "Admin" : "User"}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {profile.email || auth.email || "user@autoticket.com"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800 animate-in fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-left"
        >
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            <p className="mt-1 text-xs text-gray-500">
              Update your account details and contact information for ticket notifications.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              id="profile-name"
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />

            {/* Email field (Read Only) */}
            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profile.email || auth.email || "user@autoticket.com"}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400">
                Managed via authentication provider.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="profile-department"
                label="Department / Team"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Engineering, Operations"
              />

              <Input
                id="profile-phone"
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <Button
              type="submit"
              isLoading={isSaving}
            >
              Save Profile Details
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
