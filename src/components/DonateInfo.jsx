"use client";

import Image from "next/image";
import React from "react";
import { Button } from "@/components/Button";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { donations } from "@/lib/config";
import { DonarSubtitulo } from "@/components/DonarSubtitulo";

import { getSpecialDonations, getTransactions } from "@/helpers/api";


const formatMoney = (amount, system) =>
  ({
    mercadopago: new Intl.NumberFormat(donations.local.numberFormat, {
      style: "currency",
      currency: donations.local.currency,
    }).format(amount),
    stripe: new Intl.NumberFormat(donations.foreign.numberFormat, {
      style: "currency",
      currency: donations.foreign.currency,
    }).format(amount / 100),
  })[system];

const DonateButton = ({
  id,
  totalDonation,
  latestDonations,
  title,
  buttonURL,
  system,
  buttonTitle,
  isLoading,
}) => {
  const handleShare = () => {
    if (navigator?.share) {
      navigator.share({ title: "Donar a Bomberos de Chile", url: buttonURL });
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(buttonURL);
    }
  };

  return (
    <div className="mx-auto w-full h-auto md:h-full md:w-auto flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 lg:p-12 text-center bg-black/50 rounded-lg drop-shadow-lg md:min-w-96 lg:min-w-fit md:grow">
      <div className="mx-auto flex items-center gap-2 lg:px-4">
        {system === donations.local.system ? (
          <Image alt="" src="/images/flags/chile.svg" height={35} width={35} />
        ) : null}
        {system === donations.foreign.system ? (
          <Image alt="" src="/images/flags/world.svg" height={35} width={35} />
        ) : null}
        <span className="font-bold text-lg sm:text-xl md:text-2xl">{title}</span>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <Button
          id={`${id}`}
          href={buttonURL}
          target="_blank"
          variant="primary"
          classnames="w-full py-2 text-sm md:text-base"
        >
          {buttonTitle}
        </Button>
        <Button
          id="share-button"
          variant="secondary"
          classnames="w-full py-2 text-sm md:text-base"
          onClick={(e) => {
            e.preventDefault();
            handleShare();
          }}
        >
          Compartir
        </Button>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse font-bold text-2xl md:text-4xl bg-primary w-1/2 rounded-md">
          &nbsp;
        </div>
      ) : (
        <div className="font-bold text-sm md:text-lg grid justify-center items-center gap-2 md:gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full items-center justify-center">
            <div className="text-center">Total Recolectado: </div>
            <div className="flex items-center gap-2 sm:gap-4 justify-center">
              <div className="rounded-full bg-primary h-6 w-6 sm:h-8 sm:w-8 shrink-0 flex items-center justify-center">
                <Image alt="" src="/images/icons/handshake.svg" height={20} width={20} className="sm:h-6 sm:w-6" />
              </div>
              <div className="text-center text-nowrap text-xs sm:text-base">
                (
                {latestDonations.length}{" "}
                {latestDonations.length == 1 ? "Donación" : "Donaciones"}
                )
              </div>
            </div>
          </div>

          <span className="text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.2rem,10vw,3rem)] text-primary">{formatMoney(totalDonation, system)}</span>
        </div>
      )}
    </div>
  );
};

function InternalDonateInfo() {
  const { isLoading, data } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    refetchInterval: 10 * donations.seconds
  });
  const { isLoading: isLoadingSpecial, data: specialDonations } = useQuery({
    queryKey: ['specialDonations'],
    queryFn: getSpecialDonations,
    refetchInterval: 10 * donations.seconds
  })
  const localTransactions =
    data?.searchPaymentLogs.filter((log) => log.currencyId === "CLP") ?? [];
  const localConsolidatedTransactions =
    data?.searchConsolidatedPaymentLogs.find((log) => log.currencyId === "CLP")
      ?.totalTransactionAmount ?? 0;
  const foreignTransactions =
    data?.searchPaymentLogs.filter((log) => log.currencyId === "usd") ?? [];
  const foreignConsolidatedTransactions =
    data?.searchConsolidatedPaymentLogs.find((log) => log.currencyId === "usd")
      ?.totalTransactionAmount ?? 0;

  const specialConsolidated = specialDonations?.reduce((acc, row) => (acc + row.donation), 0) ?? 0

  const totalConsolidated =
    localConsolidatedTransactions +
    specialConsolidated +
    (foreignConsolidatedTransactions * donations.dollarToClp / 100)

  return (
    <>
      <div className="w-full flex flex-col mb-8 gap-6 md:gap-12">
        <div className="mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="flex flex-col gap-4 md:gap-6 col-span-1 lg:col-span-2">
            <div className="text-center lg:text-left font-bold flex flex-col gap-2 md:gap-4">
              <h2 className="text-4xl sm:text-5xl xl:text-8xl">Gracias</h2>
              <p className="text-xl sm:text-2xl xl:text-3xl leading-tight">
                por <span className="text-primary">sumarte a donar</span> dinero para esta causa.
              </p>
            </div>
            <DonarSubtitulo />
          </div>

          <div className="w-full lg:w-auto flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 text-center bg-primary rounded-lg drop-shadow-lg">
            {isLoading ? (
              <div className="animate-pulse font-bold text-2xl md:text-4xl w-1/2 rounded-md bg-[#333]">
                &nbsp;
              </div>
            ) : (
              <div className="font-bold text-base md:text-lg grid justify-center items-center gap-2 md:gap-4 text-[#333]">
                Computo actualizado:
                <span className="text-lg sm:text-xl md:text-2xl xl:text-[clamp(1.2rem,10vw,3rem)] text-black ">{formatMoney(totalConsolidated, donations.local.system)}</span>
              </div>
            )}
            <div className="text-xs sm:text-sm md:text-base text-[#333]">Esto es un aproximado. Tomando en cuenta el cambio del día. Valor USD: {donations.dollarToClp} Pesos Chilenos. Pueden haber fees en las conversiones.</div>
          </div>
        </div>

        {/* Donation Buttons */}
        <div class="w-full flex flex-col lg:flex-row justify-between gap-4 md:gap-6">
          <DonateButton
            id="local-donation"
            title={donations.local.title}
            buttonTitle={donations.local.buttonTitle}
            buttonURL={donations.local.buttonURL}
            system={donations.local.system}
            totalDonation={localConsolidatedTransactions}
            latestDonations={localTransactions}
            isLoading={isLoading}
          />
          <DonateButton
            id="foreign-donation"
            title={donations.foreign.title}
            buttonTitle={donations.foreign.buttonTitle}
            buttonURL={donations.foreign.buttonURL}
            system={donations.foreign.system}
            totalDonation={foreignConsolidatedTransactions}
            latestDonations={foreignTransactions}
            isLoading={isLoading}
          />
        </div>

        {/* Special Donations */}
        {specialConsolidated ? (
          <div className="mx-auto w-full md:w-auto flex flex-col items-center justify-center gap-3 md:gap-4 p-4 text-center bg-[#333] rounded-lg drop-shadow-lg md:min-w-96 lg:min-w-fit">
            {isLoadingSpecial ? (
              <div className="animate-pulse font-bold text-2xl md:text-4xl bg-primary w-1/2 rounded-md">
                &nbsp;
              </div>
            ) : (
              <div className="font-bold text-base md:text-lg grid justify-center items-center gap-2 md:gap-4 text-white">
                <div className="font-bold text-base md:text-lg grid justify-center items-center gap-2 md:gap-4">
                  Donaciones Adicionales
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-[clamp(1.2rem,10vw,3rem)] text-primary">{formatMoney(specialConsolidated, donations.local.system)}</span>
                </div>
              </div>
            )}
            <div className="text-sm md:text-base text-[#eee]">Donadores que nos contactaron aparte.</div>
          </div>
        ) : null}
      </div>
    </>
  );
}

const queryClient = new QueryClient();

export function DonateInfo() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternalDonateInfo />
    </QueryClientProvider>
  );
}
