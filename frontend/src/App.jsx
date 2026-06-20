import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const defaultFormData = {
  gender: "male",
  raceEthnicity: "group A",
  parentalEducation: "bachelor's degree",
  lunch: "standard",
  testPreparationCourse: "none",
  readingScore: 70,
  writingScore: 75,
};

function FieldGroup({ label, children }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function App() {
  const [formData, setFormData] = useState(defaultFormData);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/predictdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();
      setPrediction(data.predicted_maths_score);
    } catch (submitError) {
      setPrediction(null);
      setError("Unable to predict maths score right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Student Performance Indicator</p>
          <h1>Predict a student&apos;s maths score</h1>
          <p className="hero-text">
            Enter the student details below. The model uses background details,
            reading score, and writing score to estimate the maths score.
          </p>
        </div>

        <div className="result-card">
          <p className="result-label">Predicted Maths Score</p>
          <h2>{prediction === null ? "--" : prediction}</h2>
          <p className="result-note">
            {loading
              ? "Calculating..."
              : "The score appears here after prediction."}
          </p>
        </div>
      </section>

      <section className="form-card">
        <form onSubmit={handleSubmit} className="prediction-form">
          <FieldGroup label="Gender">
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Race / Ethnicity">
            <select
              name="raceEthnicity"
              value={formData.raceEthnicity}
              onChange={handleChange}
            >
              <option value="group A">Group A</option>
              <option value="group B">Group B</option>
              <option value="group C">Group C</option>
              <option value="group D">Group D</option>
              <option value="group E">Group E</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Parental Education">
            <select
              name="parentalEducation"
              value={formData.parentalEducation}
              onChange={handleChange}
            >
              <option value="associate's degree">Associate&apos;s degree</option>
              <option value="bachelor's degree">Bachelor&apos;s degree</option>
              <option value="high school">High school</option>
              <option value="master's degree">Master&apos;s degree</option>
              <option value="some college">Some college</option>
              <option value="some high school">Some high school</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Lunch">
            <select name="lunch" value={formData.lunch} onChange={handleChange}>
              <option value="standard">Standard</option>
              <option value="free/reduced">Free / Reduced</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Test Preparation Course">
            <select
              name="testPreparationCourse"
              value={formData.testPreparationCourse}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="completed">Completed</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Reading Score">
            <input
              type="number"
              name="readingScore"
              min="0"
              max="100"
              value={formData.readingScore}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup label="Writing Score">
            <input
              type="number"
              name="writingScore"
              min="0"
              max="100"
              value={formData.writingScore}
              onChange={handleChange}
            />
          </FieldGroup>

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Maths Score"}
          </button>
        </form>

        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </main>
  );
}
