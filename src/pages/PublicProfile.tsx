import {useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Profile } from "../types/profile";
import type { ProfileLink } from "../types/link";
import { getProfileByUsername } from "../services/profiles";
import { getLinks } from "../services/links";
import ProfileHeader from "../components/ProfileHeader";
import LinkButton from "../components/LinkButton";

export default function PublicProfile() {
  const { handle } = useParams();

  const username = handle?.startsWith("@")
    ? handle.slice(1).toLowerCase()
    : "";

  const isValidUsername = /^[a-z0-9_]{3,30}$/.test(username);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setProfile(null);
    setLinks([]);
    setErrorMessage("");
    setLoadedUsername(null);

    if (!isValidUsername) {
      return;
    }

    async function loadPage() {
      try {
        const foundProfile = await getProfileByUsername(username);
        const foundLinks = foundProfile
          ? await getLinks(foundProfile.id)
          : [];

        if (!cancelled) {
          setProfile(foundProfile);
          setLinks(foundLinks);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage("Não foi possível carregar este perfil.");
        }
      } finally {
        if (!cancelled) {
          setLoadedUsername(username);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [username, isValidUsername]);

  if (!isValidUsername) {
    return (
      <main className="profile-page">
        <h1>Página não encontrada</h1>
      </main>
    );
  }

  if (loadedUsername !== username) {
    return (
      <main className="profile-page">
        <p role="status">Carregando perfil...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="profile-page">
        <p role="alert">{errorMessage}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <h1>Perfil não encontrado</h1>
        <p>Confira se o username está correto.</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <ProfileHeader profile={profile} />

      {links.length === 0 && (
        <p>Este perfil ainda não publicou links.</p>
      )}

      <nav className="profile-links" aria-label="Links do perfil">
        {links.map((link) => (
          <LinkButton key={link.id} link={link} />
        ))}
      </nav>
    </main>
  );
}