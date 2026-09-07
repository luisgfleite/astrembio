import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Profile } from "./types/profile";
import ProfileHeader from "./components/ProfileHeader";

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
      <ProfileHeader profile={profile} />

      <p>{status}</p>
    </main>
  );
}

export default App;