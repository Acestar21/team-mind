import Login from "./components/Login";
import ChatWindow from "./components/ChatWindow";

function App() {
  return (
    <div>
      <h1>TeamMind</h1>
      <Login />
      <ChatWindow />   {/* <-- this is where messages + input live */}
    </div>
  );
}

export default App;
