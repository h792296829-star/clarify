"use client";

import { useMemo, useState } from "react";
import type { Input, Output } from "@/lib/schema";
import { InputSchema } from "@/lib/schema";
import { ResultCards } from "@/components/ResultCards";
import { ShareBar } from "@/components/ShareBar";
import { addHistory } from "@/lib/history";

function uid() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export default function Page() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [domain, setDomain] = useState<Input["domain"]>("other");
  const [tone, setTone] = useState<Input["tone"]>("gentle_rational");
  const [depth, setDepth] = useState<Input["depth"]>("standard");

  const [loading, setLoading] = useState(false);
  const [usedAI, setUsedAI] = useState<boolean | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGo = useMemo(() => question.trim().length > 0 && !loading, [question, loading]);

  async function run() {
    setLoading(true);
    setError(null);
    setOutput(null);
    setUsedAI(null);

    const payload = InputSchema.parse({ question, context, domain, tone, depth });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "生成失败");

      setOutput(data.output as Output);
      setUsedAI(Boolean(data.usedAI));

      addHistory({
        id: uid(),
        createdAt: Date.now(),
        question: payload.question,
        output: data.output as Output
      });
    } catch (e: any) {
      setError(e?.message || "生成失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-4">
      <div className="card p-5">
        <div className="text-sm font-semibold">输入一个模糊问题</div>
        <div className="mt-3 space-y-3">
          <textarea
            className="textarea"
            placeholder="比如：我该转行吗？/ 我要不要读研？/ 我和 TA 还要继续吗？"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <details className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <summary className="cursor-pointer text-sm font-semibold">补充上下文（可选）</summary>
            <div className="mt-3">
              <textarea
                className="textarea bg-white"
                placeholder="比如：你的现状、时间/金钱约束、你尝试过什么、你最担心什么……"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </details>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm">
              <div className="mb-1 font-semibold">领域</div>
              <select className="input" value={domain} onChange={(e) => setDomain(e.target.value as any)}>
                <option value="career">职业</option>
                <option value="relationship">关系</option>
                <option value="learning">学习</option>
                <option value="startup">创业</option>
                <option value="health">健康（非医疗）</option>
                <option value="other">其他</option>
              </select>
            </label>

            <label className="text-sm">
              <div className="mb-1 font-semibold">语气</div>
              <select className="input" value={tone} onChange={(e) => setTone(e.target.value as any)}>
                <option value="gentle_rational">温柔理性朋友</option>
                <option value="warm_coach">温暖教练</option>
                <option value="straight_friend">直白朋友</option>
              </select>
            </label>

            <label className="text-sm">
              <div className="mb-1 font-semibold">深度</div>
              <select className="input" value={depth} onChange={(e) => setDepth(e.target.value as any)}>
                <option value="quick">快版</option>
                <option value="standard">标准</option>
                <option value="deep">深入</option>
              </select>
            </label>
          </div>

          <button className="btn w-full" disabled={!canGo} onClick={run} type="button">
            {loading ? "生成中…" : "帮我把问题问对"}
          </button>

          <div className="text-xs text-zinc-500">
            {usedAI === false ? (
              <span>当前未配置 OPENAI_API_KEY：将使用本地“安全模板”生成（也能用，但更通用）。</span>
            ) : usedAI === true ? (
              <span>已使用模型生成（温柔理性版）。</span>
            ) : (
              <span>提示：部署到 Vercel 后，在环境变量里加 OPENAI_API_KEY 就能启用 AI。</span>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="card p-5">
          <div className="text-sm font-semibold text-red-700">出错了</div>
          <div className="mt-2 text-sm text-red-700">{error}</div>
        </div>
      ) : null}

      {output ? (
        <>
          <ShareBar output={output} />
          <ResultCards output={output} />
        </>
      ) : null}
    </main>
  );
}
