"use client";
import { useState, useCallback, useEffect } from "react";
import AgendaLogo from "@/components/AgendaLogo";
import { Button } from "@/components/Button/Button.js";
import { Title } from "@/components/Title";
import { Timeline } from "@/components/Timeline";
import { AnimatePresence, motion } from "framer-motion";
import { event, steps } from "@/lib/config";
import { formatDateChileDateOnly } from "@/lib/utils";
import { getTalksByDay } from "@/lib/supabase-talks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

const firstDay = 23;
const secondDay = 24;

function AgendaContent() {
  const [activeDay, setActiveDay] = useState(firstDay);
  const [talksDay1, setTalksDay1] = useState([]);
  const [talksDay2, setTalksDay2] = useState([]);



  const getTalks = useCallback(async () => {
    const talksDay1 = await getTalksByDay(firstDay);
    const talksDay2 = await getTalksByDay(secondDay);

    setTalksDay1(talksDay1);
    setTalksDay2(talksDay2);
  }, []);



  useEffect(() => {
    getTalks();
  }, []);


  return (
    <div className="flex flex-col w-full relative justify-center items-center">
      <section className="lg:px-64 pt-10 ">
        <Title
          logo={
            <svg
              aria-label="TechTon"
              className="fill-primary h-32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>TechTon | Agenda </title>
              <desc>Logo de TechTon</desc>
              <AgendaLogo />
            </svg>
          }
        />
        <section className="flex flex-wrap items-center justify-center gap-4">
          {[].map((elem) =>
            <Button
              href={elem.url}
              key={`${elem.title.toLowerCase().replace(" ", "-")}-btn`}
              id={`${elem.title.toLowerCase().replace(" ", "-")}-btn`}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              classnames="py-3 md:py-3.5">
              {elem.title}
            </Button>
          )}
        </section>
      </section>
      <div className="sticky top-0 pt-6 pb-10 w-full h-fit z-10">
        <div className="relative z-10 flex justify-center gap-4 flex-wrap">
          <Button
            id="day23"
            variant={`${activeDay === firstDay ? "primary" : "tertiary"}`}
            classnames={`${talksDay1.length > 0 && steps.hasShowedSpeakers ? "block" : "hidden"}`}
            onClick={() => setActiveDay(firstDay)}
          >
            {event.days[0].day} {formatDateChileDateOnly(event.dates[0], { day: "2-digit" })}
          </Button>
          <Button
            id="day24"
            variant={`${activeDay === secondDay ? "primary" : "tertiary"}`}
            classnames={`${talksDay2.length > 0 && steps.hasShowedSpeakers ? "block" : "hidden"}`}
            onClick={() => setActiveDay(secondDay)}
          >
            {event.days[1].day} {formatDateChileDateOnly(event.dates[1], { day: "2-digit" })}
          </Button>
        </div>
        <div
          className="absolute  top-0 bottom-0 left-0 right-0 z-0"
          style={{
            backgroundImage:
              "-webkit-gradient(linear, left top, left bottom, color-stop(1, rgba(35, 33, 33, 0)), color-stop(0, rgba(35, 33, 33, 1)))",
          }}
        ></div>
      </div>

      <AnimatePresence>
        {talksDay1.length > 0 && activeDay === firstDay && steps.hasShowedSpeakers && (
          <motion.div
            key="day23"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Timeline data={talksDay1} />
          </motion.div>
        )}
        {talksDay2.length > 0 && activeDay === secondDay && steps.hasShowedSpeakers && (
          <motion.div
            key="day24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Timeline data={talksDay2} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function Agenda() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgendaContent />
    </QueryClientProvider>
  );
}
