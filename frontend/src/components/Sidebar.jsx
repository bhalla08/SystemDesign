import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const [completedTopics, setCompletedTopics] = useState([]);

  const topics = [
    "oops",
    "solid-principles",
    "dbms",
    "operating-system",
    "networking",
    "low-level-design",
    "high-level-design",
    "design-patterns",
    "microservices",
    "scalability"
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");

    fetch(`http://localhost:8080/api/progress/${user}`)
      .then((response) => response.json())
      .then((data) => {
        const completed = data
          .filter(item => item.completed)
          .map(item => item.topicName);

        setCompletedTopics(completed);
      })
      .catch((error) => console.error(error));
  }, [location.pathname]);

  const completedCount = completedTopics.length;
  const totalTopics = topics.length;
  const percentage = Math.round((completedCount / totalTopics) * 100);

  return (
    <div className={`sidebar ${isOpen ? "show" : ""}`}>
      <h2 className="sidebar-title">📚 Topics</h2>

      <div className="progress-box">
        <p><strong>Progress: {percentage}%</strong></p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <small>
          {completedCount} of {totalTopics} topics completed
        </small>
      </div>

      {topics.map((topic) => {
        const isCompleted = completedTopics.includes(topic);

        return (
          <Link
            key={topic}
            to={`/topic/${topic}`}
            className={`sidebar-link ${
              location.pathname === `/topic/${topic}` ? "active" : ""
            }`}
            onClick={closeSidebar}
          >
            {topic.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            <span style={{ float: "right" }}>
              {isCompleted ? "✅" : "⏳"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;