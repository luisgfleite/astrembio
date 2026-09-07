import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import { getProfile } from "./services/profiles";
import { getLinks, createLink, deleteLink } from "./services/links";

import type { Profile } from "./types/profile";
import type { ProfileLink } from "./types/link";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";

import ProfileHeader from "./components/ProfileHeader";
import LinkButton from "./components/LinkButton";
import ProfileSetup from './components/ProfileSetup';

import Login from "./pages/Login";
import Register from "./pages/Register";

import { Navigate, Route, Routes} from "react-router-dom";

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
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [isUpdatingLinks, setIsUpdatingLinks] = useState(false);
  const [title, setTitle ] = useState("");
  const [url, setUrl ] = useState("");

  const [formError, setFormError ] = useState("");
  
  const [isEditing, setIsEditing] = useState(true);
  
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState("");
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  const userId = session?.user.id;

  async function removeLink(id: string) {
    if (!userId || isUpdatingLinks) {
      return;
    }

    setFormError("");
    setIsUpdatingLinks(true);

    try {
      await deleteLink(userId, id);

      setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));

    } catch {
      setFormError("Nao foi possivel deleter o link, tente novamente.")
    } finally {
      setIsUpdatingLinks(false);
    }
  }

  async function addLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!userId || !userProfile || isUpdatingLinks) {
      return
    }
    
    setFormError("");

    const cleanTitle = title.trim();
    const cleanUrl = url.trim();

    if (!cleanTitle || cleanTitle.length > 100) {
      setFormError("Informe o tituto do link com 1 ou 100 caracteres");
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

    setIsUpdatingLinks(true);

    try {
      const savedLink = await createLink(userId, {
        title: cleanTitle,
        url: cleanUrl,
      });

      setLinks((currentLinks) => [...currentLinks, savedLink]);
      setTitle("");
      setUrl("");
    } catch {
      setFormError("Nao foi possivel salvar o link. Tente novamente");
    } finally {
      setIsUpdatingLinks(false);
    }

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

  useEffect(() => {
    let cancelled = false;

    setUserProfile(null);
    setProfileError("");
    setLoadedUserId(null);

    setLinks([]);
    setFormError("");
    setTitle("");
    setUrl("");

    if (!userId) {
      return;
    }

    async function loadProfile(id: string) {
      try {
        const profile = await getProfile(id);
        const savedLinks = profile ? await getLinks(id) : [];

        if (!cancelled) {
          setUserProfile(profile);
          setLinks(savedLinks);
        }


      } catch {
        if (!cancelled) {
          setProfileError("Nao foi possivel carregar o perfil.");
        }
      } finally {
        if (!cancelled) {
          setLoadedUserId(id);
        }
      }
    }

    loadProfile(userId);

    return () => {
      cancelled = true;
    };
  }, [userId]);

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
        disabled={isLoggingOut || isUpdatingLinks}
      >
        {isLoggingOut ? "Saindo..." : "Sair"}
      </button>
      {logoutError && <p role="alert">{logoutError}</p>}
      {loadedUserId !== userId ? (
        <p role="status">Carregando seu perfil...</p>

      ) : profileError ? (
        <p role="alert">{profileError}</p>
      ) : !userProfile ? (
        <section>
          <h1>Vamos criar o seu perfil?</h1>
          <p>Sua conta esta pronta, mas seu perfil ainda nao foi configurado.</p>

          {userId && (
            <ProfileSetup 
              key={userId}
              userId={userId}
              onCreated={setUserProfile}
            />
          )}
        </section>
      ) : (
        <>
          <button className="mode-button" type="button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? "Visualizar perfil" : "Voltar à edição"}
          </button>
          <ProfileHeader profile={userProfile} />
          {formError && <p role="alert">{formError}</p>}

          {links.length === 0 && (
            <p>Você ainda não adicionou links ao seu perfil.</p>
          )}
          <nav className="profile-links" aria-label="Links do perfil">
            {initialLinks.map((link) => (
              <div key={link.id}>
                <LinkButton link={link} />

                {isEditing && (
                  <button className="remove-button" type="button" onClick={() => removeLink(link.id)} disabled={isUpdatingLinks}>
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
                disabled={isUpdatingLinks}
                required
              />

              <label htmlFor="link-url">Endereço</label>
              <input
                id="link-url"
                type="url"
                value={url}
                placeholder="https://"
                onChange={(event) => setUrl(event.target.value)}
                disabled={isUpdatingLinks}
                required
              />
              <button type="submit" disabled={isUpdatingLinks}>
                {isUpdatingLinks ? "Aguarde..." : "Adicionar link"}
              </button>

            </form>
          )}
        </>
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
              {initialLinks.map((link) => (
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
