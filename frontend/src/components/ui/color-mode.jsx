"use client";

import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";

import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

import { useState } from "react";

export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? light : dark;
}

export function ColorModeIcon({ hover }) {
  const { colorMode } = useColorMode();
  if (hover) {
    return colorMode === "light" ? <LuMoon /> : <LuSun />;
  }
  return colorMode === "light" ? <LuSun /> : <LuMoon />;
}

export const ColorModeButton = React.forwardRef(function ColorModeButton(
  props,
  ref
) {
  const { toggleColorMode } = useColorMode();
  const [isHovering, setIsHovering] = useState(false);
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size={"sm"}
        _hover={{
          bg: useColorModeValue("gray.900", "gray.200"),
          _icon: { color: useColorModeValue("white", "black") },
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        height={10}
        width={10}
        ref={ref}
        {...props}
      >
        <ColorModeIcon hover={isHovering} />
      </IconButton>
    </ClientOnly>
  );
});
