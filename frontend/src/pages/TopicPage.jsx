import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./TopicPage.css";
import Quiz from "../components/Quiz";
import Sidebar from "../components/Sidebar";

function Section({ title, children, isOpen, onClick }) {
  return (
    <div className="topic-card">
      <div className="section-header" onClick={onClick}>
        <h2>{title}</h2>
        <span>{isOpen ? "−" : "+"}</span>
      </div>

      <div className={`section-content-wrapper ${isOpen ? "open" : ""}`}>
        <div className="section-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function TopicPage() {
  const { topicName } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const markCompleted = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topicName: topicName,
          completed: true,
          username: localStorage.getItem("user")
        })
      });
  
      if (response.ok) {
        setSavedMessage("✅ Progress saved!");
      
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }else {
        setSavedMessage("❌ Failed to save progress");
      }
    } catch (error) {
      setSavedMessage("❌ Backend error");
    }
  };

  const formattedTitle = topicName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderContent = () => {
    if (topicName === "oops") {
      return (
        <>
          <Section
            title="🧠 What is OOPs?"
            isOpen={openIndex === 0}
            onClick={() => toggleSection(0)}
          >
            <p>
              Object-Oriented Programming organizes code into objects containing data and behavior.
            </p>
          </Section>

          <Section
            title="🏛️ 4 Pillars of OOPs"
            isOpen={openIndex === 1}
            onClick={() => toggleSection(1)}
          >
            <ul>
              <li><strong>Encapsulation:</strong> Protect data inside class.</li>
              <li><strong>Abstraction:</strong> Hide complexity.</li>
              <li><strong>Inheritance:</strong> Reuse parent features.</li>
              <li><strong>Polymorphism:</strong> Same action, different behavior.</li>
            </ul>
          </Section>

          <Section
            title="🚀 Why OOPs Matters"
            isOpen={openIndex === 2}
            onClick={() => toggleSection(2)}
          >
            <p>Helps build scalable, modular and maintainable systems.</p>
          </Section>

          <Section
            title="💻 Java Example"
            isOpen={openIndex === 3}
            onClick={() => toggleSection(3)}
          >
            <pre className="code-block">
{`class Car {
   String brand = "BMW";

   void drive() {
      System.out.println("Driving...");
   }
}`}
            </pre>
          </Section>

          <Section
            title="🎯 Interview Tip"
            isOpen={openIndex === 4}
            onClick={() => toggleSection(4)}
          >
            <p>Explain each pillar with a real Java example.</p>
          </Section>

          <Quiz
            question="Which OOP pillar hides internal implementation details?"
            options={[
              "Encapsulation",
              "Abstraction",
              "Inheritance",
              "Polymorphism"
            ]}
            correctAnswer="Abstraction"
          />
        </>
      );
    }

    return (
      <div className="topic-card">
        <p>Detailed learning content for {formattedTitle} will come here.</p>
      </div>
    );
  };

  return (
    <div className="layout">
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <Sidebar
        isOpen={menuOpen}
        closeSidebar={() => setMenuOpen(false)}
      />

      <div className="topic-container">
        <h1 className="topic-title">{formattedTitle}</h1>
        <button className="progress-btn" onClick={markCompleted}>
          ✅ Mark as Completed
        </button> 

        {savedMessage && <p className="saved-msg">{savedMessage}</p>}
        {renderContent()}
      </div>
    </div>
  );
}

export default TopicPage;