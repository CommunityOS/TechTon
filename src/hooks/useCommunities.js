"use client";
import { useQuery } from "@tanstack/react-query";
import { getCommunities } from "@/lib/supabase-communities";

export function useCommunities() {
    return useQuery({
        queryKey: ["communities"],
        queryFn: getCommunities,
    });
}

