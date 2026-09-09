import { useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { HeroSection } from "../components";
import { useApp } from "../context/useApp";

export default function Landing() {
  const { auth } = useApp();
  const [activeTab, setActiveTab] = useState("login");

  if (auth.isAuthenticated) {
    return <Navigate to={auth.role === "admin" ? "/admin" : "/faq"} replace />;
  }

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid w-full grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_380px] md:gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          <div className="max-w-2xl pt-2 sm:pt-6">
            <HeroSection />
          </div>

          <div className="w-full max-w-md md:justify-self-end">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-7">
              <div className="mb-6 text-left">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  {activeTab === "login" ? "Welcome back" : "Create an account"}
                </h2>

                <p className="mt-1.5 text-sm text-gray-500">
                  {activeTab === "login"
                    ? "Sign in to manage your support tickets."
                    : "Sign up to start raising and tracking complaints."}
                </p>
              </div>

              <div className="mb-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`w-1/2 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === "login"
                      ? "bg-[#0084ff] text-white shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`w-1/2 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-[#0084ff] text-white shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {activeTab === "login" ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}