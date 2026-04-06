"use client"
import apiClient from "@/app/lib/apiClient";
import { useAuth } from "@/app/provider/authProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthContainer  ()  {
  const { user, setUser } = useAuth();
  const router = useRouter();
  async function handleSignOut() {
    try {
      await apiClient.logout(); // clears the cookie on the server
    } catch {
      // proceed regardless
    } finally {
      setUser(null); // instantly updates Header
      router.push("/login");
    }
  }
 return (
   <div className="flex items-center space-x-4">
     {user ? (
       <>
         <span className="text-sm text-slate-300">{user.name}</span>
         <button
           onClick={handleSignOut}
           className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition-colors cursor-pointer"
         >
           Logout
         </button>
       </>
     ) : (
       <>
         <Link
           href="/login"
           className="px-3 py-2 rounded text-sm font-medium transition-colors text-slate-300"
         >
           Login
         </Link>
         <Link
           href="/register"
           className="px-3 py-2 rounded text-sm font-medium transition-colors bg-blue-600 text-white"
         >
           Register
         </Link>
       </>
     )}
   </div>
 );
};

 
