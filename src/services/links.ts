import { supabase } from '../lib/supabase';
import type { ProfileLink } from '../types/link';

type NewLink = Omit<ProfileLink, "id">;

export async function getLinks(profileId: string): Promise<ProfileLink[]> {
    const {data, error} = await supabase
        .from("links")
        .select("id, title, url")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: true})
        .order("id", { ascending: true });
    
    if (error) {
        throw error;
    }

    return data;
    
}

export async function createLink(profileId: string, link: NewLink): Promise<ProfileLink> {
    const {data, error} = await supabase
        .from("links")
        .insert({
            profile_id: profileId,
            title: link.title.trim(),
            url: link.url.trim(),
        })
        .select("id, title, url")
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteLink(profileId: string, linkId: string): Promise<void> {
    const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", linkId)
        .eq("profile_id", profileId)
        .select("id")
        .single();
    
    if (error) {
        throw error;
    }
    
}