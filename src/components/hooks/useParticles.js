"use client";

import { useRef, useCallback } from "react";

export const DEFAULT_PARTICLE_CONFIG = {
    particleCount: 800,
    particleSize: { min: 1.5, max: 2.5 },
    physics: {
        spring: 0.08,
        friction: 0.85,
        scatterForce: 15,
    },
    glow: {
        enabled: true,
        size: 2,
        alpha: 0.2,
    },
};


export function useParticles({ width, height, config }) {
    const particlesRef = useRef([]);
    const mergedConfig = { ...DEFAULT_PARTICLE_CONFIG, ...config };

    const getTextPixels = useCallback(
        (text, fontSize) => {
            const offscreen = document.createElement("canvas");
            offscreen.width = width;
            offscreen.height = height;
            const ctx = offscreen.getContext("2d");
            if (!ctx) return [];

            ctx.fillStyle = "white";
            // Use a more readable font stack (fonts are loaded globally in the app: Kufam/Inter).
            // Weight included here instead of relying on "bold" keyword for better consistency.
            ctx.font = `200 ${fontSize}px  Roboto, Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, width / 2, height / 2);

            const imageData = ctx.getImageData(0, 0, width, height);
            const allPixels = [];

            // Collect all text pixels
            // Use finer sampling on small canvases (mobile) so text edges look sharper.
            const sampleStep = width <= 110 || height <= 110 || fontSize <= 52 ? 1 : 2;
            for (let y = 0; y < height; y += sampleStep) {
                for (let x = 0; x < width; x += sampleStep) {
                    const i = (y * width + x) * 4;
                    if (imageData.data[i + 3] > 128) {
                        allPixels.push({ x, y });
                    }
                }
            }

            // Sample fixed number of particles from all pixels
            const targetCount = mergedConfig.particleCount;
            if (allPixels.length <= targetCount) {
                return allPixels;
            }

            // Uniformly sample particles
            const sampled = [];
            const step = allPixels.length / targetCount;
            for (let i = 0; i < targetCount; i++) {
                const index = Math.floor(i * step);
                sampled.push(allPixels[index]);
            }

            return sampled;
        },
        [width, height]
    );

    const createParticles = useCallback(
        (
            pixels,
            color,
            scatter
        ) => {
            const { particleSize } = mergedConfig;

            return pixels.map((pixel) => ({
                x: scatter ? Math.random() * width : pixel.x,
                y: scatter ? Math.random() * height : pixel.y,
                targetX: pixel.x,
                targetY: pixel.y,
                vx: 0,
                vy: 0,
                size: particleSize.min + Math.random() * (particleSize.max - particleSize.min),
                color,
                alpha: 0.7 + Math.random() * 0.3,
            }));
        },
        [width, height]
    );

    const updateParticles = useCallback(
        (
            newPixels,
            color,
            animate
        ) => {
            const currentParticles = particlesRef.current;
            const { physics, particleSize } = mergedConfig;

            // Scatter existing particles if animating
            if (animate) {
                currentParticles.forEach((p) => {
                    p.vx = (Math.random() - 0.5) * physics.scatterForce;
                    p.vy = (Math.random() - 0.5) * physics.scatterForce;
                });
            }

            const newParticles = [];

            newPixels.forEach((pixel, i) => {
                if (i < currentParticles.length) {
                    const p = currentParticles[i];
                    p.targetX = pixel.x;
                    p.targetY = pixel.y;
                    p.color = color;
                    newParticles.push(p);
                } else {
                    newParticles.push({
                        x: animate ? Math.random() * width : pixel.x,
                        y: animate ? Math.random() * height : pixel.y,
                        targetX: pixel.x,
                        targetY: pixel.y,
                        vx: 0,
                        vy: 0,
                        size: particleSize.min + Math.random() * (particleSize.max - particleSize.min),
                        color,
                        alpha: 0.7 + Math.random() * 0.3,
                    });
                }
            });

            particlesRef.current = newParticles;
        },
        [width, height]
    );

    const updatePhysics = useCallback(
        (animate) => {
            const { physics } = mergedConfig;

            particlesRef.current.forEach((p) => {
                if (animate) {
                    const dx = p.targetX - p.x;
                    const dy = p.targetY - p.y;

                    p.vx += dx * physics.spring;
                    p.vy += dy * physics.spring;
                    p.vx *= physics.friction;
                    p.vy *= physics.friction;

                    p.x += p.vx;
                    p.y += p.vy;
                } else {
                    p.x = p.targetX;
                    p.y = p.targetY;
                }
            });
        },
        []
    );

    const drawParticles = useCallback(
        (ctx) => {
            const { glow } = mergedConfig;

            particlesRef.current.forEach((p) => {
                // Main particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();

                // Glow effect
                if (glow.enabled) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * glow.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color}, ${p.alpha * glow.alpha})`;
                    ctx.fill();
                }
            });
        },
        []
    );

    const setColor = useCallback((color) => {
        particlesRef.current.forEach((p) => {
            p.color = color;
        });
    }, []);

    const initParticles = useCallback(
        (text, fontSize, color, scatter) => {
            const pixels = getTextPixels(text, fontSize);
            particlesRef.current = createParticles(pixels, color, scatter);
        },
        [getTextPixels, createParticles]
    );

    return {
        particles: particlesRef,
        config: mergedConfig,
        getTextPixels,
        initParticles,
        createParticles,
        updateParticles,
        updatePhysics,
        drawParticles,
        setColor,
    };
}
