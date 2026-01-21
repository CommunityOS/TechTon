import { event, organizer } from "./config";

export const getMetaData = ({
  title: _title = "",
  description = `TechTon — Comunidades Tech unidas por una causa | ${event.hours} horas de Streaming | ${event.speakers} Charlistas. ¡Ayúdanos a levantar Chile! Donaremos los fondos a Bomberos de Chile `,
  url = "https://techton.jschile.org/",
  overwriteTitle = false
}) => {
  const title = overwriteTitle ? _title : _title ? `${_title} | TechTon - ${organizer.name}` : `TechTon - ${organizer.name}`
  const images = ["/og-image.jpg"]

  return {
    metadataBase: new URL(url),
    title,
    description,

    keywords: [
      "TechTon",
      "JSChile",
      organizer.name,
      "Comunidades",
      "Streaming",
      "Donación",
      "Bomberos de Chile"
    ],
    authors: [{ name: organizer.name, url }],

    // OpenGraph
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
};

export const getViewports = () => {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#4ac9b4" },
      { media: "(prefers-color-scheme: dark)", color: "#4ac9b4" },
    ],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
  };
};
