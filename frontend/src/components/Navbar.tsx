import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onScrollToAgent: () => void;
  onScrollToCustomer: () => void;
}

export default function Navbar({ onScrollToAgent, onScrollToCustomer }: NavbarProps) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        
        <div className="flex-1 flex justify-center gap-8">
          <button
            onClick={onScrollToAgent}
            className="text-gray-800 hover:text-blue-700 font-semibold transition"
          >
            Agent
          </button>
          <button
            onClick={onScrollToCustomer}
            className="text-gray-800 hover:text-blue-700 font-semibold transition"
          >
            Customer
          </button>
        </div>

        <div>
          <button
            onClick={logout}
            className="bg-blue-600/80 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700/90 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
