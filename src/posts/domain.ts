export type PostMeta = {
  path: string
  title: string
  summary: string[]
  image: string
  created: string
  updated: string
  author: string
  contributors: string[]
  categories: string[]
  tags: string[]
  [key: string]: any
}

export type PostMetaGroupType = 'year' | 'category' | 'tag'
export const PostMetaGroupTypes: PostMetaGroupType[] = ['year', 'category', 'tag']

export type PostMetaGroup = {
  name: string
  count: number
}