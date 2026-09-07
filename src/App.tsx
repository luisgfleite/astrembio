import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import type { Profile } from "./types/profile";
import type { ProfileLink } from "./types/link";

import ProfileHeader from "./components/ProfileHeader";
import LinkButton from "./components/LinkButton";

const profile: Profile = {
  username: "luisgleite",
  displayName: "Luis Gustavo",
  bio: "Desenvolvedor Full-stack",
  avatarUrl: "",
}

const links: ProfileLink[] = [
  {
    id: "1",
    title: "Meu GitHub",
    url: "https://github.com/luisgfleite",
  },
  {
    id: "2",
    title: "Astremfy",
    url: "https://astremfy.com/",
  },
]

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
    <main className="profile-page">
      <ProfileHeader profile={profile} />
      
      <nav className="profile-links" aria-label="Links do perfil">
        {links.map((link) => (
          <LinkButton key={link.id} link={link} />
        ))}
      </nav>

      <p>{status}</p>
    </main>
  );
}

export default App;