import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/register";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

interface User {
  _id: string;
  username: string;
  email: string;
}

function App() {
  const [token , setToken] = useState<string | null>(localStorage.getItem("token"));
  const [showLogin , setShowLogin] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const handleLoginSuccess = () => {
    setToken(localStorage.getItem("token"));
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  if (!token){
    return (
      <div>
        <h1>TeamMind</h1>
        <div className = "LoginPage">
             {showLogin ? (
            <Login onLoginSuccess={handleLoginSuccess} onShowRegister={() => setShowLogin(false)} />
          ) : (
            <Register onShowLogin={() => setShowLogin(true)} />
          )}
          </div>
      </div>
    );
  }


  return (
    <div className="ChatWindowPage">
      <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onLogout={handleLogout} user={user} />
      <ChatWindow user={user} />   {/* <-- this is where messages + input live */}
      </div>
    </div>
  );
}

export default App;
