import AuthForm from "@/app/_component/miscellaneous/AuthForm";
import Link from "next/link";

export default function Login() {
  return (
    <div className=" bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">
      <AuthForm mode="sign-in" />
      <p className="">
        Don&apos;t have an account?{" "}
        <Link
          className="pb-2 border-b border-transparent hover:border-green-500 transition-colors"
          href="/register"
        >
          Register here &rarr;
        </Link>
      </p>
    </div>
  );
}
