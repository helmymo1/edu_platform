import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useUser from "@/utils/useUser";

function DashboardLayout() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/account/signin");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return <Outlet />;
}

export default DashboardLayout;
