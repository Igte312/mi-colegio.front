import { useEffect, useState } from "react";
import { getHello } from "./services/api";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHello().then((response) => {
      console.log("data : ", response.data.message);
      setMessage(response.data.message);
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>Mensaje desde el backend: {message || "Cargando..."}</p>
      </div>
    </>
  );
}

export default App;
