import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Profile } from "./types/profile";
import type { ProfileLink } from "./types/link";
import ProfileHeader from "./components/ProfileHeader";

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
    <main>
      <ProfileHeader profile={profile} />
      
      <nav aria-label="Links do perfil">
        {links.map((link) => (
          <a key={link.id} href={link.url}>
            {link.title}
          </a>
        ))}
      </nav>

      <p>{status}</p>
    </main>
  );
}

export default App;