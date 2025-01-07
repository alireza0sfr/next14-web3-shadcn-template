"use client";

import { useMediaQuery } from "react-responsive";
import resolveConfig from "tailwindcss/resolveConfig";
import { Config } from "tailwindcss/types/config";

import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig as unknown as Config);

/**
 * The breakpoints defined in the TailwindCSS configuration.
 * Defaults to common breakpoints if not explicitly defined in the config.
 */
export const breakpoints = fullConfig?.theme?.screens || {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  xllg: "1440px",
  "2xl": "1536px",
};

type BreakpointKey = keyof typeof breakpoints;
type ArbitraryBreakpoint = `${number}px`;

/**
 * A custom React hook to determine the current screen size and whether it is above or below a specified breakpoint.
 *
 * @param {BreakpointKey | ArbitraryBreakpoint} breakpointKey - The breakpoint key (e.g., "md") or an arbitrary pixel value (e.g., "800px").
 *
 * @example
 * const { isAboveMd, isBelowMd, md } = useBreakpoint("md");
 *
 * return (
 *   <div>
 *     {isAboveMd && <p>Screen is above the "md" breakpoint ({md}px).</p>}
 *     {isBelowMd && <p>Screen is below the "md" breakpoint ({md}px).</p>}
 *   </div>
 * );
 */

export function useBreakpoint<K extends BreakpointKey | ArbitraryBreakpoint>(
  breakpointKey: K
) {
  const breakpointValue =
    breakpointKey in breakpoints
      ? breakpoints[breakpointKey as BreakpointKey]
      : breakpointKey;

  const bool = useMediaQuery({
    query: `(max-width: ${breakpointValue})`,
  });

  const capitalizedKey = breakpointKey
    .toString()
    .replace(/^\d+/, "")
    .replace("px", "")
    .split("")
    .map((char, index) => (index === 0 ? char.toUpperCase() : char))
    .join("");

  type KeyAbove = `isAbove${Capitalize<K>}`;
  type KeyBelow = `isBelow${Capitalize<K>}`;

  return {
    /**
     * The numeric value of the breakpoint in pixels.
     */
    [breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, "")),
    /**
     * Indicates whether the current screen width is above the specified breakpoint.
     */
    [`isAbove${capitalizedKey}`]: !bool,
    /**
     * Indicates whether the current screen width is below the specified breakpoint.
     */
    [`isBelow${capitalizedKey}`]: bool,
  } as Record<K, number> & Record<KeyAbove | KeyBelow, boolean>;
}
