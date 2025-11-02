"use client";
import { useRouter } from "next/navigation";
import { IconMicrophone } from "@tabler/icons-react";
import { AnimatedShinyText } from "../components/ui/animated-shiny-text";
import Link from "next/link";

const links = [
  {
    name: "Home",
    href: "/",
    type: "link",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    type: "link",
  },
  {
    name: "Features",
    href: "/#features",
    type: "link",
  },
  {
    name: "Contact",
    href: "/#contact",
    type: "link",
  },
];

const QuickLinks = () => {
  const router = useRouter();
  return (
    <div className="relative p-4 sm:p-8 flex flex-col h-full w-full items-start justify-end gap-5">
      <div className="links grid grid-cols-2 md:grid-cols-4 gap-2">
        {links.map((link, index) => {
          return (
            <button
              onClick={() => router.push(link.href)}
              key={index}
              className="mr-2 rounded-full text-white text-sm cursor-pointer border border-white/20 hover:border-white/40 px-4 py-2 transition-all"
            >
              {link.name}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex w-full items-center md:space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <IconMicrophone className="w-5 h-5 text-black" />
          </div>
          <span className="text-sm md:text-xl font-bold text-white bg-clip-text ml-1">
            TalentLoop
          </span>
        </div>
        <AnimatedShinyText className="text-right w-full">
          <button
            className="p-0 px-1 text-xs md:text-base text-white hover:opacity-80 transition-opacity"
            onClick={() => router.push("/privacy-policy")}
          >
            Privacy
          </button>
          <button
            className="p-0 px-1 text-xs md:text-base text-white hover:opacity-80 transition-opacity"
            onClick={() => router.push("/terms-of-service")}
          >
            Terms
          </button>
          <button
            className="p-0 px-1 text-xs md:text-base text-white hover:opacity-80 transition-opacity"
            onClick={() => router.push("/shipping-policy")}
          >
            Shipping
          </button>
          <button
            className="p-0 px-1 text-xs md:text-base text-white hover:opacity-80 transition-opacity"
            onClick={() => router.push("/refund-policy")}
          >
            Refund
          </button>
          <p className="text-xs md:text-base">@ {new Date().getFullYear()} All rights reserved.</p>
        </AnimatedShinyText>
      </div>
    </div>
  );
};

export default QuickLinks;

