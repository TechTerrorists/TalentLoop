"use client";
import React from "react";
import Link from "next/link";
import { IconMicrophone } from "@tabler/icons-react";
import { IconBrandTwitter, IconBrandLinkedin, IconBrandGithub } from "@tabler/icons-react";
import { AnimatedShinyText } from "../components/ui/animated-shiny-text";

const SocialLinks = () => {
  return (
    <div className="relative p-4 sm:p-8 flex flex-col gap-4 justify-center items-start">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
          <IconMicrophone className="w-8 h-8 text-black" />
        </div>
        <span className="text-3xl font-bold text-white bg-clip-text">TalentLoop</span>
      </div>
      <AnimatedShinyText className="text-base w-full text-left mx-0">
        Built for developers and job seekers who'd rather code than design — we make your interview
        practice shine so you can focus on building.
      </AnimatedShinyText>
      <div className="flex w-full gap-3 items-start">
        <Link target="_blank" href="https://twitter.com">
          <button className="h-12 w-12 rounded-full cursor-pointer p-0 border border-white/20 hover:border-white/40 transition-all">
            <div className="bg-white rounded-2xl w-full h-full flex items-center justify-center">
              <IconBrandTwitter className="w-6 h-6 text-black" />
            </div>
          </button>
        </Link>
        <Link target="_blank" href="https://linkedin.com">
          <button className="h-12 w-12 rounded-full cursor-pointer border border-white/20 hover:border-white/40 transition-all flex items-center justify-center text-white">
            <IconBrandLinkedin className="w-6 h-6" />
          </button>
        </Link>
        <Link target="_blank" href="https://github.com">
          <button className="h-12 w-12 rounded-full cursor-pointer p-0 border border-white/20 hover:border-white/40 transition-all">
            <div className="bg-white rounded-2xl w-full h-full flex items-center justify-center">
              <IconBrandGithub className="w-6 h-6 text-black" />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SocialLinks;

