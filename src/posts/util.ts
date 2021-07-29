import MarkdownToc from 'markdown-toc-unlazy'
import { GithubSlugger } from 'github-slugger-typescript';
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import unified from "unified";
import remarkSlug from "remark-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkPrism from "remark-prism";
import remarkExternalLinks from "remark-external-links";

export async function markdownToHTML(content: string) {
  const res = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSlug)
    .use(remarkMath)
    .use(remarkPrism, {
      plugins: [
        'line-numbers',
        'treeview',
      ]
    })
    .use(remarkExternalLinks)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content)
  return res.contents.toString()
}

export async function extractMarkdownToc(content: string) {
  const toc = MarkdownToc(content, {
    slugify: s=>new GithubSlugger().slug(s),
    maxdepth: 2,
    firsth1: false,
  });
  return markdownToHTML(toc.content);
}