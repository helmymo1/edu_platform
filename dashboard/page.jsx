import useAuth from "@/utils/useAuth";
import useUser from "@/utils/useUser";

function DashboardComponent() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-4">
                Signed in as {user.email}
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to your dashboard!
              </h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardComponent;
