import { Route, Routes } from "react-router-dom";
import Header from "./components/navigation/Header";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PersistentLogin from "./components/common/PersistentLogin";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import { Toaster } from "sonner";
import { FaWandSparkles } from "react-icons/fa6";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <div id="main" className="min-h-screen bg-background text-text">
            <Toaster
              position="bottom-center"
              visibleToasts={1}
              toastOptions={{
                className:
                  "bg-foreground text-red-500 border-border border rounded-xl",
              }}
            />
            <Header />
            <div className="flex-1 container px-0 lg:px-[2rem]">
              <Routes>
                <Route element={<PersistentLogin />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Chat />} />
                    <Route path="/users" element={<Users />} />
                  </Route>

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
              </Routes>
            </div>
          </div>
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
