import { ReactNode } from "react";

function AuthLayout({children}: {children: ReactNode}){

  return (
    <div className="h-fit py-16 flex justify-center items-center rounded-lg sm:px-6 lg:px-8 bg-slate-950">
      {children}
    </div>
  )
}


export default AuthLayout