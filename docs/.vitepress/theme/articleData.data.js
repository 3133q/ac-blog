// 文章归档数据加载器（构建 / dev 时在 Node 端运行，组件里 import { data } 使用）
// - 老文章的日期固化在 postDates.json，原样保留
// - 新文章自动归档：优先读文章 frontmatter 的 date，否则用文件修改时间，
//   并把结果写回 postDates.json 固化（之后改文章不会再改变它的日期）
// - 想手工调整某篇的日期或当天内的顺序，直接编辑 postDates.json
import fs from 'node:fs'
import path from 'node:path'

const NOTES_DIR = 'docs/notes'
const DATA_FILE = 'docs/.vitepress/theme/postDates.json'

// 分类目录 → 时间线标签
const TAG_RULES = [
  ['algo/数据结构', '数据结构'],
  ['algo/动态规划', '动态规划'],
  ['algo/RMQ', 'RMQ'],
  ['algo/基础知识', '基础知识'],
  ['algo/巧妙思路', '巧妙思路'],
  ['algo/排序', '排序'],
  ['algo/数学', '数学'],
  ['algo/杂项', '杂项'],
  ['algo/经典', '经典'],
  ['contest/Atcoder', 'Atcoder'],
  ['contest/Codeforces', 'Codeforces'],
  ['contest/寒假集训', '寒假集训'],
  ['contest/比赛', '比赛']
]

function tagFor(relNoExt) {
  for (const [prefix, tag] of TAG_RULES) {
    if (relNoExt.startsWith(prefix + '/') || relNoExt === prefix) return tag
  }
  if (relNoExt.startsWith('algo/')) return '算法'
  if (relNoExt.startsWith('contest/')) return '比赛补题'
  return '笔记'
}

// 递归收集 notes 下所有 md 文件
function walk(dir, rel = '', acc = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, name.name)
    const relPath = rel ? rel + '/' + name.name : name.name
    if (name.isDirectory()) walk(abs, relPath, acc)
    else if (name.name.endsWith('.md')) acc.push({ rel: relPath, abs })
  }
  return acc
}

// 标题取文章第一个一级标题，取不到就用文件名
function extractTitle(abs, fallback) {
  try {
    let src = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '')
    src = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    const m = src.match(/^#\s+(.+)$/m)
    if (m) return m[1].trim()
  } catch { /* 读不了就用文件名 */ }
  return fallback
}

// frontmatter 里的 date: 2026-08-30（可选，写了一律优先）
function frontmatterDate(abs) {
  try {
    const head = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '').slice(0, 800)
    const fm = head.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm) return null
    const dm = fm[1].match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)
    return dm ? dm[1] : null
  } catch { return null }
}

function mtimeDate(abs) {
  const d = fs.statSync(abs).mtime
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default {
  watch: ['docs/notes/**/*.md', 'docs/.vitepress/theme/postDates.json'],

  load() {
    if (!fs.existsSync(NOTES_DIR)) {
      console.warn('[articleData] 找不到 docs/notes 目录，时间线为空')
      return { timeline: [], milestones: [], stats: { groups: 0, articles: 0, days: 0 } }
    }

    // 1. 扫描磁盘上的文章（index.md 是分类首页，不算文章）
    const articles = walk(NOTES_DIR)
      .filter((f) => path.basename(f.rel) !== 'index.md')
      .map((f) => {
        const relNoExt = f.rel.replace(/\.md$/, '')
        return {
          url: '/notes/' + relNoExt,
          title: extractTitle(f.abs, path.basename(f.rel, '.md')),
          tag: tagFor(relNoExt),
          abs: f.abs,
          date: null
        }
      })

    // 2. 读归档档案
    let archive = { milestones: [], byDate: {} }
    try {
      archive = { ...archive, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }
    } catch { /* 档案不存在时从零开始 */ }
    const byDate = archive.byDate || {}
    let dirty = false

    // 3. 档案里已删除的文章链接一并移除，删空了的日期整个去掉
    const urls = new Set(articles.map((a) => a.url))
    for (const date of Object.keys(byDate)) {
      const kept = byDate[date].filter((u) => urls.has(u))
      if (kept.length !== byDate[date].length) {
        if (kept.length) byDate[date] = kept
        else delete byDate[date]
        dirty = true
      }
    }

    // 4. 已归档的文章带上日期；没见过的按 frontmatter / 修改时间归档
    const byUrl = new Map(articles.map((a) => [a.url, a]))
    for (const [date, list] of Object.entries(byDate)) {
      for (const u of list) {
        const a = byUrl.get(u)
        if (a) a.date = date
      }
    }

    for (const a of articles) {
      if (a.date) continue
      a.date = frontmatterDate(a.abs) || mtimeDate(a.abs)
      if (!byDate[a.date]) byDate[a.date] = []
      byDate[a.date].push(a.url)
      dirty = true
    }

    // 5. 档案有变化就写回；CI 只读环境写失败则静默跳过（以仓库里提交的档案为准）
    if (dirty) {
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ ...archive, byDate }, null, 2) + '\n', 'utf8')
      } catch { /* 只读文件系统 */ }
    }

    // 6. 组装输出：日期倒序，同一天内保持档案里的顺序
    const timeline = Object.keys(byDate)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({
        date,
        articles: byDate[date].map((u) => {
          const { url, title, tag } = byUrl.get(u)
          return { url, title, tag }
        })
      }))

    const groups = new Set(articles.map((a) => a.url.split('/')[2]))
    return {
      timeline,
      milestones: archive.milestones || [],
      stats: { groups: groups.size, articles: articles.length, days: timeline.length }
    }
  }
}
