export const NumberBox = ({ number, text, flip }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-transparent flex flex-col items-center justify-center rounded-lg w-16 h-16 sm:w-20 sm:h-24 md:w-28 md:h-32 shadow-lg">
        <div className="rounded-t-lg rounded-b-lg bg-secondary w-full h-full"></div>

        <div className="text-2xl absolute text-white z-10 font-bold sm:text-4xl md:text-6xl font-kufam flex items-center justify-center w-full h-full">
          {number}
        </div>

        <div className="rounded-b-lg rounded-t-lg bg-primary w-full h-full"></div>

        <div
          className={`absolute w-full h-1/2 top-0 rounded-lg z-5 ${
            flip ? "animate-flip bg-primary" : "bg-transparent"
          }`}
        />
      </div>
      <p className="text-xs sm:text-sm md:text-lg lg:text-xl mt-2 sm:mt-3 font-bold text-white">{text}</p>
    </div>
  );
};
