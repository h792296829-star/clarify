"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadHistory, type HistoryItem, saveHistory } from "@/lib/history";
import { encodeShare } from "@/lib/share";

function fmt(t: number) {
  const d = new Date(t);
  return d.toLocaleString();
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const has = items.length > 0;
  const cleared = useMemo(() => !has, [has]);

  function clearAll() {
    saveHistory([]);
    setItems([]);
  }

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">本地历史（仅保存在你的浏览器）</div>
            <div className="mt-1 text-xs text-zinc-600">不需要登录。清除浏览器数据会消失。</div>
          </div>
          <button className="btn2" onClick={clearAll} type="button" disabled={cleared}>清空</button>
        </div>
      </div>

      {has ? (
        <div className="card overflow-hidden">
          <div className="divide-y divide-zinc-200">
            {items.map((it) => {
              const d = encodeShare(it.output);
              return (
                <div key={it.id} className="p-4">
                  <div className="text-sm font-semibold">{it.question}</div>
                  <div className="mt-1 text-xs text-zinc-600">{fmt(it.createdAt)}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="btn2" href="/">回到首页</Link>
                    <a className="btn2" href={`/r?d=${d}`} target="_blank" rel="noreferrer">打开分享页</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card p-5">
          <div className="text-sm font-semibold">还没有历史</div>
          <div className="mt-2 text-sm text-zinc-600">去首页生成一次，就会自动记录。</div>
        </div>
      )}
    </main>
  );
}
