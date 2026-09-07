import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';

export async function getProfile(userId: string): Promise<Profile | null> {
    const {data, error} = await supabase
        .from("profiles")
        .select("username, display_name, bio, avatar_url")
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        return null;
    }

    return {
        username: data.username,
        displayName: data.display_name,
        bio: data.bio,
        avatarUrl: data.avatar_url,
    };

}

export async function createProfile(userId: string, profile: Profile): Promise<Profile> {
    const {data, error} = await supabase
        .from("profiles")
        .insert({
            id: userId,
            username: profile.username.trim().toLowerCase(),
            display_name: profile.displayName.trim(),
            bio: profile.bio.trim(),
            avatar_url: profile.avatarUrl.trim(),
        })
        .select("username, display_name, bio, avatar_url")
        .single();
    
    if (error) {
        throw error;
    }

    return {
        username: data.username,
        displayName: data.display_name,
        bio: data.bio,
        avatarUrl: data.avatar_url
    };
}