import UserAtHomePage from "./_component/layout/UserAtHomePage";

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Team Access Control Demo
      </h1>
      <p className="text-slate-300 mb-8">
        Welcome to the Team RBAC Management System. This demo showcases Next.js
        16 access control features with role-based permissions!
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-6 py-4">
          <h3 className="font-semibold mb-3 text-white">
            Features Demonstrated
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            <li>Role-based access control (RBAC)</li>
            <li>Route protection with middleware</li>
            <li>Server-side permission checks</li>
            <li>Client-side permission hooks</li>
            <li>Dynamic route access</li>
          </ul>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-6 py-4">
          <h3 className="font-semibold mb-3 text-white">Users Roles</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            <li>
              <strong className="text-purple-400">Super Admin: </strong>Full
              system access
            </li>
            <li>
              <strong className="text-green-400">Admin: </strong>User and team
              management
            </li>
            <li>
              <strong className="text-yellow-400">Manager: </strong>Team
              specific management
            </li>
            <li>
              <strong className="text-blue-400">User: </strong>Basic dashboard
            </li>
          </ul>
        </div>
        <UserAtHomePage />
      </div>
    </div>
  );
}

export default Home;
