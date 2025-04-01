import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const SecureLink = ({ to, children }) => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const uid = user?.uid || "guest";  // Default to "guest" if UID is missing

  return <Link to={`/admin/${uid}/${to}`}>{children}</Link>;

};

export default SecureLink;
