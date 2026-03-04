import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "反套路提问器 · 温柔理性的朋友",
  description: "把模糊问题变成更聪明、更可行动的问题。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold">反套路提问器</div>
              <div className="text-sm text-zinc-600">温柔理性的朋友 · 不替你做决定，但帮你把问题问对</div>
            </div>
            <nav className="flex gap-2">
              <a className="btn2" href="/">生成</a>
              <a className="btn2" href="/history">历史</a>
            </nav>
          </header>
          {children}
          <footer className="mt-10 text-xs text-zinc-500">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>提示：本工具不提供医疗/法律等专业结论；适合做思路澄清与下一步行动。</span>
              <span className="text-zinc-400">© {new Date().getFullYear()} Clarify Friend</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
