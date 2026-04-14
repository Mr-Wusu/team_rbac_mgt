import { getCurrentuser } from "@/app/lib/auth";
import Link from "next/link";

async function UserAtHomePage() {
  const user = await getCurrentuser();
  return (
    <>
      {user ? (
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
          <p className="text-green-300 text-center">
            Welcome back, <strong>{user.name}</strong>! You are logged in as{" "}
            <strong className="text-green-200">{user.role}</strong>
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ml-4.5"
          >
            Go to dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <p className="text-slate-300 text-center">You are not logged in</p>
          <div className="w-full flex items-center justify-center mb-2">
            <Link
              href="/login"
              className="inline-block mt-3  px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ml-4.5"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default UserAtHomePage;
