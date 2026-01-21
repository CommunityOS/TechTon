"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ParticleText } from "./ParticleText";


export function FlipCard({
    value,
    label,
    isUrgent = false,
    particleConfig,
}) {
    const [cardSize, setCardSize] = useState({ width: 96, height: 112 }); // Initial size matches w-24 h-28
    const [fontSize, setFontSize] = useState(48);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    setCardSize({ width: rect.width, height: rect.height });
                    setFontSize(Math.floor(rect.width * 0.45));
                }
            }
        };

        // Use ResizeObserver for reliable dimension tracking
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    updateSize();
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        // Initial attempt
        requestAnimationFrame(() => {
            updateSize();
        });

        // Additional attempt after parent animation completes (delay 1.1s + duration 1.2s ≈ 2.5s)
        // This ensures we get correct dimensions after Framer Motion animation
        const timeoutId = setTimeout(() => {
            updateSize();
        }, 2500);

        // Fallback for window resize
        window.addEventListener("resize", updateSize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateSize);
            clearTimeout(timeoutId);
        };
    }, []);

    const formattedValue = String(value).padStart(2, "0");

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                ref={containerRef}
                className={cn(
                    "flip-card relative max-w-16 xs:max-w-20 h-28 sm:w-32 sm:h-36 md:max-w-32 md:max-h-36 md:w-40 md:h-44 group cursor-default",
                    "transition-all duration-300 ease-out"
                )}
            >
                {/* Glow effect */}
                <div
                    className={cn(
                        "absolute -inset-2 rounded-2xl opacity-40 blur-xl transition-all duration-300",
                        "group-hover:opacity-60 group-hover:blur-2xl group-hover:-inset-3",
                        isUrgent
                            ? "bg-gradient-to-br from-orange-500/50 to-red-500/50"
                            : "bg-gradient-to-br from-cyan-500/30 to-blue-500/30"
                    )}
                />

                {/* Main card */}
                <div
                    className={cn(
                        "relative w-full h-full rounded-xl overflow-hidden",
                        "bg-gradient-to-b from-white/10 to-white/5",
                        "border border-white/20",
                        "backdrop-blur-md",
                        "shadow-lg shadow-black/20",
                        "transition-all duration-300 ease-out",
                        "group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/30",
                        "group-hover:border-white/30",
                        "flex items-center justify-center"
                    )}
                >
                    {/* Glass highlight */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl" />

                    {/* Particle Text */}
                    <ParticleText
                        text={formattedValue}
                        width={cardSize.width}
                        height={cardSize.height}
                        isUrgent={isUrgent}
                        fontSize={fontSize}
                        particleConfig={particleConfig}
                    />

                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 rounded-xl shadow-inner shadow-black/20 pointer-events-none" />
                </div>
            </div>

            {/* Label */}
            <span className="text-[10px] xs:text-xs sm:text-sm lg:text-base font-medium text-muted-foreground uppercase tracking-widest">
                {label}
            </span>
        </div>
    );
}
