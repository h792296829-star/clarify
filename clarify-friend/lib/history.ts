"use client";

import type { Output } from "./schema";

export type HistoryItem = {
  id: string;
  createdAt: number;
  question: string;
  output: Output;
};

const KEY = "cf_history_v1";

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 50)));
}

export function addHistory(item: HistoryItem) {
  const items = loadHistory();
  items.unshift(item);
  saveHistory(items);
}
