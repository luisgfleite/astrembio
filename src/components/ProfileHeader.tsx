import type { Profile } from '../types/profile';

type ProfileHeaderProps = {
    profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <header>
            {profile.avatarUrl ? (
                <img 
                    className="profile-avatar"
                    src={profile.avatarUrl}
                    alt={`Foto de ${profile.displayName}`}
                />
            ) : (
                <div className="profile-avatar profile-avatar-placeholder" aria-hidden="true">
                    {profile.displayName.charAt(0).toUpperCase()}
                </div>
            )}
            <h1>{profile.displayName}</h1>
            <p>@{profile.username}</p>
            <p>{profile.bio}</p>
        </header>
    );
}