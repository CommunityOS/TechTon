"use client";
import React from "react";
import { useCssTransitionOnView } from "@/components/hooks/useCssTransitionOnView";
import { cn } from "@/lib/utils";
import { event } from "@/lib/config";
import { formatDateChileDateOnly } from "@/lib/utils";

const CounterSubtitle = () => {
  const ref = React.useRef(null);
  const transitions = useCssTransitionOnView(ref, "delay-[1300ms]");

  return (
    <div
      ref={ref}
      className={cn("space-y-3 pb-8 xl:px-20 2xl:w-4/6 2xl:px-0", transitions)}
    >
      <h3 className="font-museo text-center text-2xl font-bold">
        ¡Gracias por ayudarnos a levantar Chile!
      </h3>
      <p className="font-extralight text-center px-2 text-sm">
        Recaudaremos fondos que serán entregados a{" "}
        <a
          href="https://www.instagram.com/p/C243rhlsLsb/?hl=es"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-primary duration-300 font-semibold underline"
        >
          Bomberos de Chile
        </a>{" "}
        para ayudar a mitigar los efectos causados por los incendios que
        comenzaron a ocurrir el {formatDateChileDateOnly(event.initialIncident, { day: "2-digit", month: "2-digit", year: "numeric" })} en la {event.place}.
      </p>
    </div>
  );
};

export { CounterSubtitle };
