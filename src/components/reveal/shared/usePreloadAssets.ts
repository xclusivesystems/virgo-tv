"use client";
import { useEffect } from "react";

export function usePreloadAssets(urls: string[]) {
  useEffect(() => {
    const links = urls.map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => {
      links.forEach((l) => l.remove());
    };
  }, [urls]);
}
