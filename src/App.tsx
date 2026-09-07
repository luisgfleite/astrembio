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
  avatarUrl: "https://i.pinimg.com/736x/92/43/75/924375a346cf364596413aeecf102f13.jpg",
}

const initialLinks: ProfileLink[] = [
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
  const [links, setLinks] = useState<ProfileLink[]>(initialLinks);
  const [status, setStatus] = useState("Testando conexão...");

  function removeLink(id: string) {
    setLinks((currentLinks) =>
      currentLinks.filter((link) => link.id !== id)
    );
  }

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
          <div key={link.id}>
            <LinkButton link={link} />

            <button type="button" onClick={() => removeLink(link.id)}>
              Remover {link.title}
            </button>
          </div>
        ))}
      </nav>

      <p>{status}</p>
    </main>
  );
}

export default App;