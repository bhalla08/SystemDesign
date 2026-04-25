import { useState } from "react";

function Quiz({ question, options, correctAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (option) => {
    setSelected(option);
  };

  return (
    <div className="topic-card">
      <h2>🧠 Quiz</h2>
      <p style={{ marginBottom: "15px" }}>{question}</p>

      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(option)}
          className="quiz-option"
        >
          {option}
        </button>
      ))}

      {selected && (
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>
          {selected === correctAnswer
            ? "✅ Correct!"
            : `❌ Wrong! Correct Answer: ${correctAnswer}`}
        </p>
      )}
    </div>
  );
}

export default Quiz;