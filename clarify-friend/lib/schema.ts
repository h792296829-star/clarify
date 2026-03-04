import { z } from "zod";

export const DomainEnum = z.enum(["career", "relationship", "learning", "startup", "health", "other"]);
export const ToneEnum = z.enum(["gentle_rational", "warm_coach", "straight_friend"]);
export const DepthEnum = z.enum(["quick", "standard", "deep"]);

export const OutputSchema = z.object({
  reframed_question: z.string().min(1),
  clarifying_questions: z.array(z.object({
    tag: z.string().min(1),
    q: z.string().min(1)
  })).min(6).max(14),
  key_facts_to_collect: z.array(z.object({
    why: z.string().min(1),
    fact: z.string().min(1)
  })).min(3).max(8),
  hidden_assumptions: z.array(z.string().min(1)).min(2).max(6),
  avoided_questions: z.array(z.string().min(1)).min(2).max(6),
  variable_map: z.array(z.object({
    if: z.string().min(1),
    then: z.string().min(1)
  })).min(3).max(10),
  next_actions: z.array(z.object({
    time: z.string().min(1),
    do: z.string().min(1)
  })).min(3).max(6)
});

export type Output = z.infer<typeof OutputSchema>;

export const InputSchema = z.object({
  question: z.string().min(1).max(2000),
  context: z.string().max(4000).optional().default(""),
  domain: DomainEnum.default("other"),
  tone: ToneEnum.default("gentle_rational"),
  depth: DepthEnum.default("standard")
});

export type Input = z.infer<typeof InputSchema>;
