import Image from "next/image";
import React from "react";
import { organizer, steps } from "@/lib/config";

const TwitchButton = () => {
  return (
    <div className="flex justify-end">
      <a
        className={`${!steps.hasTwitchButton && "hidden"} text-lg pointer hover:bg-[#a675f4] hover:scale-105 duration-300 font-bold bg-[#9052F4] px-5 px-10 py-2 rounded-md flex items-center gap-3`}
        href={organizer.social.twitch}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image alt="" src="/twitch_logo.svg" height={30} width={30} />
        {organizer.name}
      </a>
    </div>
  );
};

export { TwitchButton };