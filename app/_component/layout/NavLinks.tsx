"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks  ()  {

  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

    function getNavItemClass(href: string) {
      const isActive =
        href === "/" ? pathname === "/" : pathname.startsWith(href);
      return `px-3 py-2 rounded text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`;
    }

 return (
   <nav className="flex items-center space-x-6">
     {navigation.map((item) => (
       <Link
         key={item.name}
         href={item.href}
         className={getNavItemClass(item.href)}
       >
         {item.name}
       </Link>
     ))}
   </nav>
 );
};


