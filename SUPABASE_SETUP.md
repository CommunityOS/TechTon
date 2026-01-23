# Configuración de Supabase para Charlistas

## Estructura de la tabla `Talks`

La tabla en Supabase se llama `Talks` (con mayúscula) y tiene la siguiente estructura:

### Columnas requeridas:

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `id` | uuid | ID único (primary key) | auto-generado |
| `speakerName` | text | Nombre del charlista | "Juan Pérez" |
| `topic` | text | Título de la charla | "Introducción a React" |
| `startHour` | timestamptz | Hora de inicio (ISO 8601) | "2026-01-23T18:00:00Z" |
| `endHour` | timestamptz | Hora de fin (ISO 8601) | "2026-01-23T19:00:00Z" |
| `image` | text | URL de la imagen del charlista | "/images/speakers/juan.jpg" |
| `community` | text | Nombre de la comunidad | "JavaScript Chile" |
| `Day` | integer | Día del mes (opcional, se puede calcular desde startHour) | 9 o 10 |
| `created_at` | timestamptz | Fecha de creación | auto-generado |

### SQL para crear la tabla (si aún no existe):

```sql
CREATE TABLE "Talks" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "speakerName" TEXT NOT NULL,
  topic TEXT NOT NULL,
  "startHour" TIMESTAMPTZ NOT NULL,
  "endHour" TIMESTAMPTZ NOT NULL,
  image TEXT NOT NULL,
  community TEXT DEFAULT 'ninguna',
  "Day" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE "Talks" ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON "Talks"
  FOR SELECT
  USING (true);
```

**Nota:** Si la tabla ya existe, solo necesitas asegurarte de que tenga estas columnas. El código mapea automáticamente `speakerName` a `name` para el componente.

### Notas importantes:

1. **Hora de Chile**: Las horas (`startHour` y `endHour`) deben estar en formato UTC. El código automáticamente las convierte a hora de Chile para filtrar por día.

2. **Imágenes**: Las URLs de imágenes pueden ser:
   - Rutas relativas: `/images/speakers/juan.jpg`
   - URLs absolutas: `https://ejemplo.com/imagen.jpg`

3. **Comunidad**: Si no hay comunidad, usa el valor `"ninguna"` (sin comillas en la base de datos, pero como string).

4. **Permisos**: La tabla está configurada para lectura pública, pero si necesitas escribir, deberás crear políticas adicionales.

## Ejemplo de datos:

```sql
INSERT INTO "Talks" ("speakerName", topic, "startHour", "endHour", image, community, "Day")
VALUES 
  (
    'Juan Pérez',
    'Introducción a React Hooks',
    '2026-01-23T18:00:00Z',
    '2026-01-23T18:45:00Z',
    '/images/speakers/juan.jpg',
    'JavaScript Chile',
    9
  ),
  (
    'María González',
    'TypeScript Avanzado',
    '2026-01-24T07:00:00Z',
    '2026-01-24T07:45:00Z',
    '/images/speakers/maria.jpg',
    'ninguna',
    10
  );
```

**Nota importante:** 
- La columna `Day` es opcional. Si no la proporcionas, el código calculará el día automáticamente desde `startHour` usando la hora de Chile.
- Si proporcionas `Day`, el código lo usará directamente para filtrar, lo cual es más eficiente.

## Verificación:

Una vez creada la tabla, puedes verificar que funciona ejecutando:

```javascript
import { getTalks } from '@/lib/supabase-talks';

const talks = await getTalks();
console.log(talks);
```

