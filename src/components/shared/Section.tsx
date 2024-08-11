"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useMediaQuery } from "react-responsive";

export default function Section({
  title,
  subtitle,
  icon,
  mockup = false,
  customIcon = null,
  children,
}: any) {
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  return (
    <div
      className={`w-full flex bg-base-300 p-4 rounded-xl flex-col space-y-4 ${
        mockup ? "h-full" : "min-h-[90vh]"
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {icon && !customIcon && (
          <div className="mask mask-squircle bg-base-100 rounded-xl mt-4 lg:mt-0 p-8 h-3/4 aspect-square flex items-center justify-center">
            <FontAwesomeIcon icon={icon} size={"3x"} />
          </div>
        )}

        {customIcon && !icon && (
          <div className="mask mask-squircle bg-base-100 rounded-xl mt-4 lg:mt-0 p-8 h-3/4 aspect-square flex items-center justify-center">
            {customIcon}
          </div>
        )}

        <div className="flex flex-col py-4 gap-2 justify-center lg:text-left text-center">
          <h2 className="text-2xl xl:text-4xl font-bold">{title}</h2>
          <p className="text-xs xl:text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="divider" />

      <div>{children}</div>
    </div>
  );
}
