import Image from "next/image";
import demo from "../../../public/demo.png";

import GetStartedButton from "../shared/GetStartedButton";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center lg:items-start">
          <span className="relative">
            <span className="absolute bg-neutral-content -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
            <span className="text-neutral relative">
              Build <span className="relative text-red-500">Firebase</span>
            </span>
          </span>
          <span className="whitespace-nowrap relative">
            <span className="mr-3 sm:mr-4 md:mr-5">apps now,</span>
            <span className=" relative whitespace-nowrap">
              <span className="absolute bg-primary-content -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 rotate-1"></span>
              <span className="relative text-primary">not later</span>
            </span>
          </span>
        </h1>

        <p className="font-semibold text-lg opacity-80 leading-relaxed">
          This NextJS template has everything you need to build your next SaaS
          project with Firebase fast.
        </p>

        <GetStartedButton />
      </div>

      <div className="relative max-md:-m-4 lg:w-full">
        <Image
          src={demo}
          alt="Hero Image"
          width={1080}
          height={1080}
          className="overflow-hidden rounded-3xl"
        />
      </div>
    </section>
  );
}
