import OpenAI from "openai";
import { InputSchema, OutputSchema, type Input, type Output } from "./schema";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";

function hasKey() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
}

function safeJsonParse(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(text.slice(start, end + 1));
  }
  return JSON.parse(text);
}

function fallbackOutput(input: Input): Output {
  const q = input.question.trim();
  const base = [
    { tag: "澄清定义", q: "你说的“更好”具体指什么？（更稳定/更自由/更有意义/更赚钱/更轻松？）" },
    { tag: "时间范围", q: "你希望这个问题在什么时间范围内解决？（一周/三个月/一年？）" },
    { tag: "约束条件", q: "你现在有哪些硬约束？（钱、时间、家庭责任、健康、签证等）" },
    { tag: "目标与代价", q: "如果选择 A，你最能接受的代价是什么？最不能接受的代价是什么？" },
    { tag: "证据", q: "你已经有哪些事实证据支持/反对这个想法？哪些只是感觉？" },
    { tag: "替代方案", q: "除了“全做/全不做”，有没有一个更小的试验版本？" },
    { tag: "风险", q: "最坏会怎样？概率多大？你能做什么把风险从 8/10 降到 4/10？" },
    { tag: "机会成本", q: "如果你选了这个，你要放弃的是什么？你愿意吗？" }
  ];
  return {
    reframed_question: `在明确你的目标、约束与证据后，${q} 是否可以通过一个低风险的试验在短期内验证？`,
    clarifying_questions: input.depth === "quick" ? base : [
      ...base,
      { tag: "动机", q: "你更像是在“追求某个东西”，还是在“逃离某种痛苦”？分别是什么？" },
      { tag: "可控性", q: "这里面哪些因素你能控制？哪些你控制不了？" }
    ],
    key_facts_to_collect: [
      { why: "决定你能承受多大试错成本", fact: "资金缓冲/固定支出/责任与时间安排" },
      { why: "决定你是否真的想要它", fact: "真实日常：你将每天做什么、和谁合作、节奏如何" },
      { why: "决定路线是否可行", fact: "可行路径：最短路径需要哪些门槛/作品/资源" },
      { why: "决定风险管理方式", fact: "最坏结果是什么、你能接受到什么程度" }
    ],
    hidden_assumptions: [
      "你可能默认“只有一种正确答案”，但更可能需要用试验逐步逼近。",
      "你可能把短期情绪当成长期信号，需要用事实校正。"
    ],
    avoided_questions: [
      "如果一年后你没有改变，你最担心失去的是什么？",
      "如果你改变失败，你最害怕的代价是什么？"
    ],
    variable_map: [
      { if: "资金/时间缓冲很小", then: "优先选择低风险试验：先验证再承诺" },
      { if: "痛苦来源主要是环境/人而不是事情本身", then: "先换环境或边界管理，再评估是否需要大改变" },
      { if: "你能在 2-4 周做出可验证的小样", then: "先做试验，用结果而不是想象来决定" }
    ],
    next_actions: [
      { time: "15分钟", do: "写下你最在意的 3 个衡量指标，并按重要性排序（例如：收入/自由/成长/意义/稳定）" },
      { time: "30分钟", do: "列出 3 个你需要补齐的关键事实，并写出获取方式（访谈/数据/试做）" },
      { time: "48小时内", do: "做一个最小试验：把决策拆成可验证的一小步，并给它一个明确截止时间" }
    ]
  };
}

export async function generate(inputRaw: unknown): Promise<{ output: Output; usedAI: boolean }> {
  const input = InputSchema.parse(inputRaw);

  if (!hasKey()) return { output: fallbackOutput(input), usedAI: false };

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const resp = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: "json_object" } as any,
    messages: [
      { role: "system", content: buildSystemPrompt(input) },
      { role: "user", content: buildUserPrompt(input) }
    ]
  });

  const text = resp.choices?.[0]?.message?.content ?? "";
  const parsed = safeJsonParse(text);
  const output = OutputSchema.parse(parsed);

  return { output, usedAI: true };
}
