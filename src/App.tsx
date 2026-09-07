import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Profile } from "./types/profile";

const profile: Profile = {
  username: "luisgleite",
  displayName: "Luis Gustavo",
  bio: "Desenvolvedor Full-stack",
  avatarUrl: "",
}
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
      <h1>{profile.displayName}</h1>
      <p>@{profile.username}</p>
      <p>{profile.bio}</p>

      <p>{status}</p>
    </main>
  );
}

export default App;