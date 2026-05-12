import { useEffect } from "react";
import { io } from "socket.io-client";
import { GameCanvas } from "./components/Gamecanvas";

const socket = io("http://localhost:3000");

function App() {
  useEffect(() => {
    socket.on("connected", (data) => {
      console.log("Connecté au serveur :", data);
    });

    socket.on("pong", (data) => {
      console.log("Pong reçu :", data);
    });

    socket.emit("ping", {
      message: "Hello depuis React",
    });

    return () => {
      socket.off("connected");
      socket.off("pong");
    };
  }, []);

  return (
    <>
      <GameCanvas />
    </>
  );
}

export default App;