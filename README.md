# 反套路提问器 · 温柔理性的朋友（Next.js + Vercel）

输入一个模糊问题 → 输出更聪明的澄清问题、关键事实、变量地图、下一步行动。  
**不需要数据库**：分享页把结果压缩进 URL 参数里（可直接复制链接分享）。

## 本地运行

```bash
npm i
npm run dev
```

打开 http://localhost:3000

> 如果你没配 API Key，也能用：会走“本地安全模板”生成（更通用）。

## 接入 OpenAI（你已经有 key ✅）

本地新建 `.env.local`：

```bash
OPENAI_API_KEY=你的key
OPENAI_MODEL=gpt-4o-mini
```

然后重启 `npm run dev`。

> 也可以把 `OPENAI_MODEL` 换成你自己想用的模型名。

## 部署到 Vercel（你说的 Verso）

1. 上传到 GitHub
2. 在 Vercel 导入该仓库
3. Vercel → Project Settings → Environment Variables 添加：
   - `OPENAI_API_KEY`（必填，启用 AI）
   - `OPENAI_MODEL`（可选）
4. Deploy

## 重要文件
- `app/api/generate/route.ts`：后端 API
- `lib/generate.ts`：OpenAI 调用（没 key 则 fallback）
- `app/page.tsx`：输入与结果展示
- `app/r/page.tsx`：分享页（`/r?d=...`）
- `app/history/page.tsx`：本地历史（localStorage）
