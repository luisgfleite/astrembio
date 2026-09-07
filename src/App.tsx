import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import type { Profile } from "./types/profile";
import type { ProfileLink } from "./types/link";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";

import ProfileHeader from "./components/ProfileHeader";
import LinkButton from "./components/LinkButton";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { Link, Navigate, Route, Routes} from "react-router-dom";

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
  const [title, setTitle ] = useState("");
  const [url, setUrl ] = useState("");

  const [formError, setFormError ] = useState("");
  
  const [isEditing, setIsEditing] = useState(true);
  
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function removeLink(id: string) {
    setLinks((currentLinks) =>
      currentLinks.filter((link) => link.id !== id)
    );
  }

  function addLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const cleanTitle = title.trim();
    const cleanUrl = url.trim();

    if (!cleanTitle) {
      setFormError("Informe o tituto do link.");
      return;
    }

    try {
      const parsedUrl = new URL(cleanUrl);

      if ( parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:" ) {
        setFormError("Use uma url que comece com http ou https");
        return
      }
    } catch {
      setFormError("Informe uma url valida");
      return
    }

    const newLink: ProfileLink = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      url: cleanUrl,
    }

    setLinks((currentLinks) => [...currentLinks, newLink]);

    setTitle("");
    setUrl("");

  }

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setIsAuthLoading(false);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    }
  }, []);

  async function handleLogout() {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) {
        setLogoutError(error.message);
      }
    } catch {
      setLogoutError("Nao foi possivel sair. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const dashboard = (
    <main className="profile-page">
      <button
        className="mode-button"
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Saindo..." : "Sair"}
      </button>
      {logoutError && <p role="alert">{logoutError}</p>}
      <p>
        <Link to={`/@${profile.username}`}>
          Abrir pagina publica
        </Link>
      </p>
      <button className="mode-button" type="button" onClick={() => setIsEditing((current) => !current)}>
        {isEditing ? "Visualizar perfil" : "Voltar à edição"}
      </button>
      <ProfileHeader profile={profile} />
      
      <nav className="profile-links" aria-label="Links do perfil">
        {links.map((link) => (
          <div key={link.id}>
            <LinkButton link={link} />

            {isEditing && (
              <button className="remove-button" type="button" onClick={() => removeLink(link.id)}>
                Remover {link.title}
              </button>
            )}

          </div>
        ))}
      </nav>
      
      {isEditing && (
        <form className="link-form" onSubmit={addLink}>
          <h2>Adicionar Links</h2>

          <label htmlFor="link-title">Titulo</label>
          <input
            id="link-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="link-url">Endereço</label>
          <input
            id="link-url"
            type="url"
            value={url}
            placeholder="https://"
            onChange={(event) => setUrl(event.target.value)}
            required
          />

          {formError && <p role="alert">{formError}</p>}

          <button type="submit">Adicionar link</button>

        </form>
      )}
      
    </main>
  );

  if (isAuthLoading) {
    return (
      <main className="profile-page">
        <p role="status">Carregando...</p>
      </main>
    );
  }
  return (
    <Routes>
      <Route 
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route 
        path="/dashboard"
        element={
          session ? dashboard : <Navigate to="/login" replace />
        }
      />

      <Route 
        path={`/@${profile.username}`}
        element={
          <main className="profile-page">
            <ProfileHeader profile={profile} />

            <nav className="profile-links" aria-label="Links do perfil">
              {links.map((link) => (
                <LinkButton key={link.id} link={link} />
              ))}
            </nav>
          </main>
        }
      />

      <Route 
      path="/login"
      element={<Login />}
      />

      <Route 
      path="/register"
      element={<Register />}
      />

    </Routes>
  )
}

export default App;