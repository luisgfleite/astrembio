import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Profile } from '../types/profile';
import { createProfile } from '../services/profiles';

type ProfileSetupProps = {
    userId: string,
    onCreated: (profile: Profile) => void;
}

export default function ProfileSetup({userId, onCreated}: ProfileSetupProps) {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");

        const cleanUsername = username.trim().toLowerCase();
        const cleanDisplayName = displayName.trim();

        if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
            setErrorMessage("Use de 3 a 30 letras minúsculas, números ou _ no username.");
            return;
        }

        if (!cleanDisplayName || cleanDisplayName.length > 80) {
            setErrorMessage("Informe um nome com 1 a 80 caracteres.");
            return;
        }

        setIsSaving(true);

        try {
            const savedProfile = await createProfile(userId, {
                username: cleanUsername,
                displayName: cleanDisplayName,
                bio,
                avatarUrl: "",
            });

            onCreated(savedProfile);
        } catch {
            setErrorMessage("Nao foi possivel criar o seu perfil.")
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="link-form" onSubmit={handleSubmit}>
            <label htmlFor="profile-username">Username</label>
            <input
                id="profile-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="@usuario"
                maxLength={30}
                required
            />

            <label htmlFor="profile-name">Nome de exibição</label>
            <input
                id="profile-name"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={80}
                required
            />

            <label htmlFor="profile-bio">Biografia</label>
            <input
                id="profile-bio"
                type="text"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Conte um pouco sobre você"
            />

            {errorMessage && <p role="alert">{errorMessage}</p>}

            <button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Criar perfil"}
            </button>
        </form>
    )
}