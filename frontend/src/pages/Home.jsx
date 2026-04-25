import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [status, setStatus] = useState("Loading...");
  const navigate = useNavigate();

  const topics = [
    "OOPs",
    "SOLID Principles",
    "DBMS",
    "Operating System",
    "Networking",
    "Low Level Design",
    "High Level Design",
    "Design Patterns",
    "Microservices",
    "Scalability"
  ];

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Backend connection failed"));
  }, []);

  const goToTopic = (topic) => {
    const slug = topic.toLowerCase().replace(/\s+/g, "-");
    navigate(`/topic/${slug}`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  return (
    <div className="container">
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={logout}>Logout</button>
      </div>

      <h1>System Design Learning Platform</h1>
      <p className="status">
        Backend Status: {status}
      </p>

      <div className="grid">
        {topics.map((topic, index) => (
          <div
            className="card"
            key={index}
            onClick={() => goToTopic(topic)}
          >
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;