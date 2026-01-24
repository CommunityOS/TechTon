import { DonateInfo } from "@/components/DonateInfo";
import { FadeInBackgroundImages } from "@/components/FadeInBackgroundImages";
import bomberos from "../../../public/images/bomberos-bg-2.webp";

import { getMetaData, getViewports } from "@/lib/metadata";

export const generateMetadata = () =>
  getMetaData({
    title: "Gracias por Donar a Bomberos de Chile",
    description:
      "TechTon - Comunidades Tech Unidas. Gracias por Donar. Puedes usar MecardoPago y Stripe. Todo el dinero recaudado será donado a Bomberos de Chile.",
  });

export const generateViewport = () => getViewports();

export default function Donar() {
  return (
    <div className="flex flex-1 overflow-hidden relative">
      <FadeInBackgroundImages
        className="bg-no-repeat bg-cover bg-left absolute w-[40%] aspect-square left-80 top-0 shadow-inner -z-10 lg:block"
        image={bomberos}
      />
      <div className="flex h-full w-full flex-col relative justify-center items-center max-w-full md:px-32 xl:max-w-[1920px] xl:px-5 m-auto xl:justify-center">
        <div className="flex flex-col xl:flex-row gap-4 w-full flex-1 px-4 sm:px-6 md:px-8 xl:pl-40 pt-8 sm:pt-12 md:pt-16 xl:pt-20">
          <DonateInfo />
          <div className="xl:flex flex-1" />
        </div>
      </div>
    </div>
  );
}
