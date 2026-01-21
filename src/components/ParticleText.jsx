"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useParticles } from "./hooks/useParticles";


const COLORS = {
    normal: "200, 225, 255",
    urgent: "255, 180, 100",
};

export function ParticleText({
    text,
    width,
    height,
    isUrgent = false,
    fontSize = 72,
    particleConfig,
}) {
    const canvasRef = useRef(null);
    const animationRef = useRef(0);
    const dprRef = useRef(1);
    const prevTextRef = useRef(text);
    const initializedRef = useRef(false);
    const prevDimensionsRef = useRef({ width: 0, height: 0 });

    const prefersReducedMotion = useReducedMotion();
    const color = isUrgent ? COLORS.urgent : COLORS.normal;

    const {
        getTextPixels,
        initParticles,
        updateParticles,
        updatePhysics,
        drawParticles,
        setColor,
    } = useParticles({ width, height, config: particleConfig });

    // Initialize particles when dimensions become valid
    useEffect(() => {
        if (width > 0 && height > 0) {
            const isInitialMount = !initializedRef.current;
            const prevWidth = prevDimensionsRef.current.width;
            const prevHeight = prevDimensionsRef.current.height;

            // Check if dimensions have changed significantly (more than 1px difference)
            // or if this is the initial mount
            const dimensionsChanged = isInitialMount ||
                prevWidth === 0 ||
                prevHeight === 0 ||
                Math.abs(prevWidth - width) > 1 ||
                Math.abs(prevHeight - height) > 1;

            if (dimensionsChanged) {
                // Scatter particles on initial mount, but not on resize
                initParticles(text, fontSize, color, isInitialMount ? !prefersReducedMotion : false);
                initializedRef.current = true;
                prevTextRef.current = text;
                prevDimensionsRef.current = { width, height };
            }
        }
    }, [initParticles, width, height, text, fontSize, color, prefersReducedMotion]);

    // Keep canvas backing store in sync with size + devicePixelRatio (avoid layout thrash in the animation loop)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width <= 0 || height <= 0) return;

        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        dprRef.current = dpr;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
    }, [width, height]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width <= 0 || height <= 0 || !initializedRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const animate = () => {
            const dpr = dprRef.current || 1;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);
            updatePhysics(!prefersReducedMotion);
            drawParticles(ctx);
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [width, height, updatePhysics, drawParticles, prefersReducedMotion]);

    // Handle text changes (only after initialization)
    useEffect(() => {
        if (!initializedRef.current || width <= 0 || height <= 0) return;

        if (prevTextRef.current !== text) {
            const newPixels = getTextPixels(text, fontSize);
            updateParticles(newPixels, color, !prefersReducedMotion);
            prevTextRef.current = text;
        }
    }, [text, fontSize, color, getTextPixels, updateParticles, prefersReducedMotion, width, height]);

    // Handle color changes (urgent mode)
    useEffect(() => {
        if (initializedRef.current) {
            setColor(color);
        }
    }, [color, setColor]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="block"
            aria-hidden="true"
        />
    );
}
