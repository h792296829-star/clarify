"use client";

import { useMemo, useState } from "react";
import type { Output } from "@/lib/schema";
import { encodeShare } from "@/lib/share";

export function ShareBar({ output }: { output: Output }) {
  const shareUrl = useMemo(() => {
    const encoded = encodeShare(output);
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/r?d=${encoded}`;
  }, [output]);

  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <div className="card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold">分享链接（不需要登录）</div>
          <div className="mt-1 truncate text-xs text-zinc-600">{shareUrl || "（生成中…）"}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn2" onClick={copy} type="button">{copied ? "已复制" : "复制链接"}</button>
          <a className="btn" href={`/r?d=${encodeShare(output)}`} target="_blank" rel="noreferrer">打开分享页</a>
        </div>
      </div>
    </div>
  );
}
