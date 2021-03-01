import {fs} from '../deps.ts'
import * as etc from "../etc/mod.ts";
import {MarkdownInfo, readMarkdownInfo} from "../utils/md.tsx";

let infos: MarkdownInfo[] = []

export async function reloadInfos() {
  infos = []
  const posts = scanPosts(etc.Global.posts.dir)
  for await (let post of posts) {
    infos.push(await readMarkdownInfo(post))
  }
  // from new to old
  infos.sort((a, b) => b.created.getTime() - a.created.getTime())
}

export function getInfo(file: string): MarkdownInfo | undefined {
  return infos.find(info => info.path == file)
}

export function getInfos(size: number, page: number): { total: number, content: MarkdownInfo[] } {
  const start = Math.min(size * page, infos.length);
  const end = Math.min(size * (page + 1), infos.length);
  return {
    total: infos.length,
    content: infos.slice(start, end),
  }
}

export async function getContent(file: string): Promise<string | undefined> {
  const info = getInfo(file);
  if (!!info) {
    return await Deno.readTextFile(info.path)
  } else {
    return undefined
  }
}

export async function watch() {

}

function reloadInfo(file: string) {

}

export async function* scanPosts(folder: string) {
  for await (const entry of fs.walk(folder, {
    includeDirs: false,
    exts: ['.md'],
  })) {
    yield entry.path
  }
}