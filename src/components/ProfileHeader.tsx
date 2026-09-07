import type { Profile } from '../types/profile';

type ProfileHeaderProps = {
    profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <header>
            <h1>{profile.displayName}</h1>
            <p>@{profile.username}</p>
            <p>{profile.bio}</p>
        </header>
    );
}