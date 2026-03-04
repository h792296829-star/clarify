"use client";

import type { Output } from "@/lib/schema";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-3 text-sm font-semibold text-zinc-900">{title}</div>
      {children}
    </section>
  );
}

export function ResultCards({ output }: { output: Output }) {
  return (
    <div className="space-y-4">
      <Section title="把问题改写成更可行动的版本">
        <div className="text-base leading-relaxed">{output.reframed_question}</div>
      </Section>

      <Section title="更聪明的澄清问题">
        <div className="space-y-2">
          {output.clarifying_questions.map((it, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="min-w-[84px]"><span className="pill">{it.tag}</span></div>
              <div className="text-sm leading-relaxed">{it.q}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="你需要收集的关键事实（先把不确定性砍掉）">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {output.key_facts_to_collect.map((it, idx) => (
            <li key={idx}><span className="font-semibold">{it.fact}</span><span className="text-zinc-600"> —— {it.why}</span></li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="你可能默认的隐含假设">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {output.hidden_assumptions.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </Section>

        <Section title="你可能在逃避的关键问题（温柔提醒）">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {output.avoided_questions.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </Section>
      </div>

      <Section title="变量地图（如果…那么…）">
        <div className="space-y-2 text-sm leading-relaxed">
          {output.variable_map.map((it, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <div><span className="font-semibold">如果：</span>{it.if}</div>
              <div className="mt-1"><span className="font-semibold">那么：</span>{it.then}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="下一步行动（尽量做到 1 小时内可开始）">
        <div className="space-y-2">
          {output.next_actions.map((it, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3">
              <span className="pill">{it.time}</span>
              <div className="text-sm leading-relaxed">{it.do}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
