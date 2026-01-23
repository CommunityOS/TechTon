import { useQuery } from '@tanstack/react-query';
import { getTalks } from '@/lib/supabase-talks';

/**
 * Hook para obtener todos los talks desde Supabase
 */
export function useTalks() {
    return useQuery({
        queryKey: ['talks'],
        queryFn: getTalks,
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: false,
    });
}

