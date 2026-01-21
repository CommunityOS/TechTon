"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "./Button";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { organizer, event } from "@/lib/config";
import { FlipCard } from "./FlipCard";

const TIMEZONE = "America/Santiago";
// Locale "neutral" + Latin digits so parsing is consistent regardless of user/device locale.
const LOCALE = "und-u-nu-latn";

const particleConfig = {
  particleCount: 10000,
  particleSize: { min: 0.1, max: 1 },
  physics: {
    spring: 0.02,
    friction: 0.85,
    scatterForce: 5,
  },
};

const getChileTimeParts = (date) => {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
};

const parseTimeParts = (parts) => ({
  year: parseInt(parts.find(p => p.type === "year").value),
  month: parseInt(parts.find(p => p.type === "month").value),
  day: parseInt(parts.find(p => p.type === "day").value),
  hour: parseInt(parts.find(p => p.type === "hour").value),
  minute: parseInt(parts.find(p => p.type === "minute").value),
  second: parseInt(parts.find(p => p.type === "second").value || "0"),
});

const getUTCForChileTime = (year, month, day, hour, minute, second = 0) => {
  let testUTC = Date.UTC(year, month - 1, day, hour + 3, minute, second);

  for (let i = 0; i < 10; i++) {
    const testDate = new Date(testUTC);
    const testParts = getChileTimeParts(testDate);
    const test = parseTimeParts(testParts);

    if (
      test.year === year &&
      test.month === month &&
      test.day === day &&
      test.hour === hour &&
      test.minute === minute &&
      test.second === second
    ) {
      return testUTC;
    }

    const diffSeconds =
      (year - test.year) * 31536000 +
      (month - test.month) * 2592000 +
      (day - test.day) * 86400 +
      (hour - test.hour) * 3600 +
      (minute - test.minute) * 60 +
      (second - test.second);

    testUTC += diffSeconds * 1000;
  }

  return testUTC;
};

const calculateTimeRemaining = (totalMs) => {
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total: totalMs };
};




export const CountdownTimer = () => {
  const [isClient, setIsClient] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const previousTimeRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const eventDate = event.dates[0];
  const eventYear = eventDate.getUTCFullYear();
  const eventMonth = eventDate.getUTCMonth() + 1;
  const eventDay = eventDate.getUTCDate();
  const [eventHours, eventMinutes] = event.time.split(':').map(Number);

  useEffect(() => {
    if (!isClient) return;

    const updateTime = () => {
      const now = new Date();
      const currentParts = getChileTimeParts(now);
      const current = parseTimeParts(currentParts);

      const currentUTC = getUTCForChileTime(
        current.year,
        current.month,
        current.day,
        current.hour,
        current.minute,
        current.second
      );

      const eventUTC = getUTCForChileTime(
        eventYear,
        eventMonth,
        eventDay,
        eventHours,
        eventMinutes,
        0
      );

      const difference = eventUTC - currentUTC;
      setIsUrgent(difference <= 24 * 60 * 60 * 1000);
      const newTime = calculateTimeRemaining(difference);
      setTimeRemaining((prev) => {
        previousTimeRef.current = { ...prev };
        return newTime;
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isClient, eventYear, eventMonth, eventDay, eventHours, eventMinutes]);

  const completed = timeRemaining.total <= 0;


  if (completed) {
    return (
      <div className="min-h-[148px] sm:min-h-[180px] md:min-h-[224px] flex justify-center items-center py-4">
        <AnimatePresence mode="popLayout">
          {isClient && (
            <motion.div
              key="completed"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.1 }}
              className="w-full"
            >
              <Button
                href={organizer.social.twitch}
                target="_blank"
                variant="tertiary"
                classnames="bg-twitch text-white flex items-center gap-3 hover:bg-[#a675f4] hover:scale-105 duration-300 mt-10 mb-3 !text-3xl !px-10"
                id="twitch-mb-btn"
                setDefaultMinWidth={false}
              >
                <Image
                  src="./twitch_logo.svg"
                  alt="TechTon Logo"
                  width={50}
                  height={50}
                />
                Ver stream
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-[148px] sm:min-h-[180px] md:min-h-[224px] flex justify-center items-center py-4">
      <AnimatePresence mode="popLayout">
        {isClient && (
          <motion.div
            key="countdown"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="w-full"
          >
            <div className="flex gap-4 sm:gap-6 md:gap-8 flex-wrap justify-center">
              {timeRemaining.total >= 0 && <FlipCard value={timeRemaining.days} label="Días" isUrgent={isUrgent} particleConfig={particleConfig} />}
              {timeRemaining.total >= 0 && <FlipCard value={timeRemaining.hours} label="Horas" isUrgent={isUrgent} particleConfig={particleConfig} />}
              {timeRemaining.total >= 0 && <FlipCard value={timeRemaining.minutes} label="Minutos" isUrgent={isUrgent} particleConfig={particleConfig} />}
              {timeRemaining.total >= 0 && <FlipCard value={timeRemaining.seconds} label="Segundos" isUrgent={isUrgent} particleConfig={particleConfig} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
