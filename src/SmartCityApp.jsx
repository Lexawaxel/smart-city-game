import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://oaxxoizstcclbuhjuhlh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heHhvaXpzdGNjbGJ1aGp1aGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzkwMTcsImV4cCI6MjA2NTc1NTAxN30.Vh4elTReLKdm28hhR-3pBt_hOI83POunp-jKXqwLBLE"
);

const scenarios = [
  { text: "You enter a supermarket where an AI scans your emotions.", choices: [{ text: "Accept for personalized discounts", impact: 2 }, { text: "Decline and pay anonymously", impact: 0 }] },
  { text: "A city app offers to track your movements to optimize traffic.", choices: [{ text: "Allow tracking", impact: 2 }, { text: "Refuse and use a paper map", impact: 0 }] },
  { text: "A biometric scanner in the subway monitors your heartbeat.", choices: [{ text: "Accept to avoid physical checks", impact: 2 }, { text: "Decline and submit to manual control", impact: 0 }] },
  { text: "A surveillance drone follows you for your nighttime safety.", choices: [{ text: "Let it follow you", impact: 2 }, { text: "Find a path without drones", impact: 0 }] },
  { text: "To access public Wi-Fi, you must enable geolocation.", choices: [{ text: "Accept", impact: 2 }, { text: "Refuse and use personal data", impact: 0 }] },
  { text: "Your smartwatch wants to send your health data to your insurance.", choices: [{ text: "Share the data", impact: 2 }, { text: "Decline", impact: 0 }] },
  { text: "A municipal voice assistant wants to analyze your conversations.", choices: [{ text: "Allow analysis", impact: 2 }, { text: "Turn the assistant off", impact: 0 }] },
  { text: "Your school uses facial recognition to automate attendance.", choices: [{ text: "Accept facial scan", impact: 2 }, { text: "Use student ID", impact: 0 }] },
  { text: "City kiosks ask to record your voice for multilingual services.", choices: [{ text: "Contribute voice samples", impact: 2 }, { text: "Politely decline", impact: 0 }] },
  { text: "A mall tracks your phone's Bluetooth to analyze crowd flow.", choices: [{ text: "Leave Bluetooth on", impact: 2 }, { text: "Turn off Bluetooth before entering", impact: 0 }] },
];

const ScoreBoard = ({ onLogout }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false });
      if (!error) setScores(data);
    };
    fetchScores();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Admin Panel - Scoreboard</h2>
      <ul>
        {scores.map((entry, idx) => (
          <li key={idx}><strong>{entry.username}</strong>: {entry.score}</li>
        ))}
      </ul>
      <button onClick={onLogout} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#ff00ff', color: 'white', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
    </div>
  );
};

const Game = ({ username, onSave }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [confirmCount, setConfirmCount] = useState(0);
  const [confirmMax, setConfirmMax] = useState(Math.floor(Math.random() * 3) + 3);
  const [ended, setEnded] = useState(false);

  const handleChoice = (impact) => {
    if (impact === 0 && confirmCount < confirmMax) {
      setConfirmCount(confirmCount + 1);
      alert("Are you sure you want to give up convenience for privacy?");
    } else {
      const newScore = score + impact;
      setScore(newScore);
      setConfirmCount(0);
      setConfirmMax(Math.floor(Math.random() * 3) + 3);
      if (current < scenarios.length - 1) {
        setCurrent(current + 1);
      } else {
        setEnded(true);
        onSave(username, newScore);
      }
    }
  };

  if (ended) {
    let level = "";
    if (score <= 3) level = "🟢 Low surveillance – You protected your privacy well.";
    else if (score <= 10) level = "🟠 Moderate surveillance – You're being watched...";
    else level = "🔴 High surveillance – Welcome to the watchlist.";

    return (
      <motion.div style={{ padding: '2rem', textAlign: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Game Over, {username}!</h2>
        <p>Final Score: {score}</p>
        <p>{level}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#ff00ff", color: "white", border: "none", borderRadius: "4px" }}>
          Replay
        </button>
      </motion.div>
    );
  }

  const scenario = scenarios[current];
  return (
    <motion.div style={{ padding: '1rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Scenario {current + 1}</h2>
      <p>{scenario.text}</p>
      {scenario.choices.map((choice, idx) => (
        <button key={idx} onClick={() => handleChoice(choice.impact)} style={{ display: 'block', margin: '10px 0', backgroundColor: '#ff00ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>
          {choice.text}
        </button>
      ))}
    </motion.div>
  );
};

export default function SmartCityApp() {
  const [login, setLogin] = useState("");
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const saveScore = async (username, score) => {
    await supabase.from("scores").insert([{ username, score }]);
  };

  const handleLogout = () => {
    setLogin("");
    setUsername("");
    setSubmitted(false);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/cyberpunk_font.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#39ff14',
        padding: '2rem',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{
        maxWidth: '800px',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center',
        fontSize: '1.25rem'
      }}>
        {!submitted && (
          <div>
            <h1>Login</h1>
            <input placeholder="Login (user/admin)" value={login} onChange={(e) => setLogin(e.target.value)} style={{ margin: '0.5rem', padding: '0.5rem' }} />
            {login === "user" && (
              <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ margin: '0.5rem', padding: '0.5rem' }} />
            )}
            <button onClick={() => {
              if ((login === "user" && username) || login === "admin") setSubmitted(true);
              else alert("Enter valid login and username.");
            }} style={{ padding: '0.5rem 1rem', backgroundColor: '#ff00ff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Start
            </button>
          </div>
        )}
        {submitted && login === "user" && <Game username={username} onSave={saveScore} />}
        {submitted && login === "admin" && <ScoreBoard onLogout={handleLogout} />}
      </div>
    </main>
  );
}
