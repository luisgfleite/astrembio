import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [status, setStatus] = useState("Testando conexão...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      if (error && error.code !== "42P01") {
        setStatus(`Erro: ${error.message}`);
        return;
      }

      setStatus("Supabase conectado.");
    }

    testConnection();
  }, []);

  return (
    <main>
      <h1>Astrembio</h1>
      <p>{status}</p>
    </main>
  );
}

export default App;