import { supabase } from './supabase';

/**
 * Obtiene todas las comunidades desde Supabase
 * Mapea las columnas de la tabla a la estructura esperada por el componente
 * @returns {Promise<Array>} Array de comunidades con la estructura esperada
 */
export async function getCommunities() {
    try {
        const { data, error } = await supabase
            .from('Communities')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching communities from Supabase:', error);
            throw new Error(`Error al obtener comunidades: ${error.message}`);
        }

        if (!data || data.length === 0) {
            console.warn('No communities found in Supabase');
            return [];
        }

        // Mapear las columnas de la tabla a la estructura esperada por CommunityLogos
        return data.map((community) => {
            // Usar web como URL principal, si no existe usar linkedin, si no existe usar github
            const url = community.web || community.linkedin || community.github || '#';

            return {
                id: community.id,
                name: community.name || 'Sin nombre',
                alt: `Logo Comunidad ${community.name || 'Sin nombre'}`,
                src: community.image || '/images/qr_placeholder.svg',
                url: url,
                linkedin: community.linkedin || null,
                github: community.github || null,
                web: community.web || null,
            };
        });
    } catch (err) {
        console.error('Error in getCommunities:', err);
        throw err;
    }
}

