"use client";

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { Output } from "./schema";

export function encodeShare(output: Output): string {
  return compressToEncodedURIComponent(JSON.stringify(output));
}

export function decodeShare(encoded: string): Output | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as Output;
  } catch {
    return null;
  }
}
