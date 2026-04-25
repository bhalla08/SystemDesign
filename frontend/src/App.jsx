import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TopicPage from "./pages/TopicPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");

  return user ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/topic/:topicName"
          element={
            <PrivateRoute>
              <TopicPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;