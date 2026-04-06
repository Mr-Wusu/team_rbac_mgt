"use client";

import signin from "@/app/actions/signIn";
import signup from "@/app/actions/signUp";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";


type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

function AuthForm({ mode }: AuthFormProps) {
  const accessType = mode === "sign-up" ? signup : signin;
  const [formState, formAction, isPending] = useActionState(accessType, {
    error: undefined,
    success: undefined,
  });
  const router = useRouter();

  useEffect(() => {
    if (mode === "sign-up" && formState?.success) {
      const timer = setTimeout(() => router.push("/login"), 2500); 
      return () => clearTimeout(timer);
    }
    if (mode === "sign-in" && formState?.success) {
      
      const timer = setTimeout(() => router.push("/dashboard"), 3000); 
      return () => clearTimeout(timer);
    }
  }, [formState?.success, router, mode]);

  return (
    <form action={formAction} className="mb-3">
      {formState?.error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
          {formState.error}
        </div>
      )}
      {mode === "sign-up" && formState?.success && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded mb-4">
          Registration successful! Redirecting to login...
        </div>
      )}
      {mode === "sign-in" && formState?.success && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded mb-4">
          Login successful! Redirecting to dashboard...
        </div>
      )}
      <div className="space-y-4">
        {mode === "sign-up" && (
          <>
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                First Name:
              </label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                autoComplete="firstname"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-sm tracking-wide"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Surname:
              </label>
              <input
                id="surname"
                type="text"
                name="surname"
                autoComplete="surname"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-sm tracking-wide"
                placeholder="Enter your surname"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-sm tracking-wide"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-sm tracking-wide"
            placeholder="Enter your password"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
      >
        {mode === "sign-in" && isPending
          ? "Logging in..."
          : mode === "sign-in"
            ? "Login"
            : mode === "sign-up" && isPending
              ? "Creating account..."
              : "Create account"}
        {/* {isPending ? "Creating account..." : "Create account"} */}
      </button>
    </form>
  );
}

export default AuthForm;
