// client/src/components/AdminPage.jsx
import { useNavigate } from "react-router-dom";

import { useUser } from "../redux/hooks";
import AdminForm from "../admin/AdminForm";
import Navbar from "../navbar/Navbar";

/**
 * Admin page component to render admin-specific content.
 * It checks if the user is authenticated and has admin privileges.
 * @returns {JSX.Element} - Admin-specific content or redirects to home page if not authorized.
 */
const AdminPage = () => {
  const user = useUser({ redirectTo: "/", redirectIfFound: false }); // Use useUser hook to get user data
  const navigate = useNavigate();

  // If user data is not loaded yet, handle loading state
  if (user === undefined) {
    return <div>Loading...</div>;
  }
  
  // If user is not logged in or not an admin, redirect to home page.
  if (!user || !user?.isadmin) {
    navigate("/");
    return null; // Return null to prevent rendering further content.
  }

  // Render admin-specific content here.
  return (
    <div>
      <Navbar />
      <AdminForm />
    </div>
  );
};

export default AdminPage;
