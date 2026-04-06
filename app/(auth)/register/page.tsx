import AuthForm from "@/app/_component/miscellaneous/AuthForm";
import Link from "next/link";

export default function Register() {
  return (
    <div className="grid place-content-center bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-212">
      <AuthForm mode="sign-up" />
      <p className="">
        Already registered{" "}
        <Link
          className="pb-1 px-1 hover:text-green-500 border-b border-transparent hover:border-green-500 transition-colors"
          href="/register"
        >
          Login here &rarr;
        </Link>
      </p>
    </div>
    
  );
}
