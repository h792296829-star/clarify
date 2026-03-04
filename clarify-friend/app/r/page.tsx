"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { decodeShare } from "@/lib/share";
import { ResultCards } from "@/components/ResultCards";

export default function SharePage() {
  const sp = useSearchParams();
  const output = useMemo(() => {
    const d = sp.get("d") || "";
    return d ? decodeShare(d) : null;
  }, [sp]);

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <div className="text-sm font-semibold">分享页</div>
        <div className="mt-2 text-sm text-zinc-600">
          这是一个可分享的“提问手术刀”结果。它不包含你的登录信息，也不需要数据库。
        </div>
      </div>

      {output ? (
        <ResultCards output={output} />
      ) : (
        <div className="card p-5">
          <div className="text-sm font-semibold">没有找到内容</div>
          <div className="mt-2 text-sm text-zinc-600">链接里缺少参数 d，或内容解析失败。</div>
        </div>
      )}
    </main>
  );
}
