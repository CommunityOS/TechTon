import { supabase } from './supabase';
import { event } from './config';

/**
 * Combina una fecha (día del mes) con una hora (HH:MM:SS o HH:MM) para crear un timestamp completo
 * @param {number} day - Día del mes (23 o 24)
 * @param {string} time - Hora en formato HH:MM:SS o HH:MM
 * @returns {string} Timestamp completo en formato ISO
 */
function combineDayAndTime(day, time) {
    console.log('day', day);
    console.log('time', time);

    if (day == null || !time) {
        console.warn('combineDayAndTime: day or time is missing', { day, time });
        const defaultDate = event.dates[0];
        return defaultDate.toISOString();
    }



    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];


    // necesito que sea en el formato yyyy-mm-ddT16:00:00 esta bien, pero tiene que utilizar el time que le pasamos sin considerar el segundo y el 000008
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

/**
 * Obtiene todos los charlistas/talks desde Supabase
 * Mapea las columnas de la tabla Talks a la estructura esperada por el componente
 * @returns {Promise<Array>} Array de talks con la estructura esperada
 */
export async function getTalks() {
    try {
        const { data, error } = await supabase
            .from('Talks')
            .select('*');
        // Nota: No ordenamos por startHour aquí porque es solo hora, no timestamp completo
        // El ordenamiento se hará después de combinar con el día

        if (error) {
            console.error('Error fetching talks from Supabase:', error);
            throw new Error(`Error al obtener charlistas: ${error.message}`);
        }

        if (!data || data.length === 0) {
            console.warn('No talks found in Supabase');
            return [];
        }

        const mappedTalks = data.map((talk) => {

            const startHourFull = combineDayAndTime(talk.Day, talk.startHour);
            const endHourFull = combineDayAndTime(talk.Day, talk.endHour);

            return {
                id: talk.id,
                name: talk.speakerName || 'Sin nombre',
                topic: talk.topic || 'Sin tema',
                startHour: startHourFull,
                endHour: endHourFull,
                image: talk.image || '/images/qr_placeholder.svg',
                community: talk.community || 'ninguna',
                communityUrl: null,
                Day: talk.Day,
            };

        });


        mappedTalks.sort((a, b) => {
            return new Date(a.startHour) - new Date(b.startHour);
        });

        return mappedTalks;
    } catch (err) {
        console.error('Error in getTalks:', err);
        throw err;
    }
}

/**
 * Obtiene talks filtrados por día usando la columna Day
 * @param {number} day - Día del mes (ej: 23, 24)
 * @returns {Promise<Array>} Array de talks del día especificado
 */
export async function getTalksByDay(day) {
    const today = new Date();
    today.setDate(day);
    const formattedDate = today.toISOString().split('T')[0];

    try {
        const { data, error } = await supabase
            .from('Talks')
            .select('*')
            .eq('Day', formattedDate);

        if (error) {
            console.error('Error fetching talks by day from Supabase:', error);
            throw new Error(`Error al obtener charlistas del día ${day}: ${error.message}`);
        }

        if (!data || data.length === 0) {
            console.warn(`No talks found for day ${day}`);
            return [];
        }

        const mappedTalks = data.map((talk) => {
            return {
                id: talk.id,
                name: talk.speakerName || 'Sin nombre',
                topic: talk.topic || 'Sin tema',
                startHour: talk.startHour,
                endHour: talk.endHour,
                image: talk.image || '/images/qr_placeholder.svg',
                community: talk.community || 'ninguna',
                communityUrl: null,
                day: talk.Day,
            };

        });

        mappedTalks.sort((a, b) => {
            return new Date(a.startHour) - new Date(b.startHour);
        });

        return mappedTalks;
    } catch (err) {
        console.error('Error in getTalksByDay:', err);
        throw err;
    }
}

