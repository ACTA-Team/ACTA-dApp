"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { CredentialCard } from "../modules/credential/CredentialCard";

export default function HeroSection() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-linear-to-b from-transparent via-pink-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-linear-to-b from-transparent via-purple-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-linear-to-r from-transparent via-green-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-gray-700 md:text-4xl lg:text-7xl dark:text-neutral-300">
          {"ACTA Demo Flow".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          This demo separates the flow into four steps: create a vault, <br />{" "}
          authorize issuers, compute the credential, and issue the credential.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
        >
          <HoverBorderGradient
            containerClassName="rounded-full border border-black"
            as="button"
            className=" text-white flex items-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 "
          >
            <Link
              href="/demo"
              className="w-full sm:w-60 rounded-full px-6 py-2 font-medium text-white text-center"
            >
              View Demo
            </Link>
          </HoverBorderGradient>

          <HoverBorderGradient
            containerClassName="rounded-full border border-black"
            as="button"
            className=" text-black flex items-center bg-white space-x-2 transition-all duration-300 hover:-translate-y-0.5 "
          >
            <Link
              href="https://stellar.expert/"
              className="w-full sm:w-60 rounded-full px-6 py-2 font-medium text-black text-center"
            >
              View Stellar Expert
            </Link>
          </HoverBorderGradient>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
        >
          <CredentialCard />
        </motion.div>
      </div>
    </div>
  );
}
