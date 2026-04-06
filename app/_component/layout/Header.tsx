import Link from "next/link";

import AuthContainer from "./AuthContainer";
import NavLinks from "./NavLinks";

function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-700 fixed w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-white">
            TeamAccess
          </Link>
          <NavLinks />
          <AuthContainer />
        </div>
      </div>
    </header>
  );
}

export default Header;
