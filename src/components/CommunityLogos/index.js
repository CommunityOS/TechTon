"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCommunities } from "@/hooks/useCommunities";

export const CommunityLogos = () => {
  const { data: communities = [], isLoading, error } = useCommunities();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[100px]">
        <p className="text-gray-400">Cargando comunidades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[100px]">
        <p className="text-red-400">Error al cargar comunidades</p>
      </div>
    );
  }

  if (communities.length === 0) {
    return null;
  }

  // Mezclar aleatoriamente las comunidades
  const shuffledCommunities = [...communities].sort(() => Math.random() - 0.5);

  return (
    <AnimatePresence mode="popLayout">
      {shuffledCommunities.map((logo, i) => {
        const delay = 0.05 * i + 0.9;
        return (
          <motion.div
            className="flex justify-center h-[100px] aspect-square relative"
            key={`logo-${logo.id || i}`}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay }}
          >
            <Link href={logo.url} target="_blank" rel="noopener noreferrer">
              <Image
                className="p-4 cursor-pointer transition transform hover:scale-150"
                alt={logo.alt}
                src={logo.src}
                fill
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};
