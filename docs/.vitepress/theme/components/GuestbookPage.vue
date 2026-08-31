<template>
  <div class="gb-hero">
    <div class="gb-hero-orb"></div>
    <div class="gb-hero-orb gb-hero-orb--small"></div>
    <!-- SVG 渐变标题：避开 background-clip:text 的文字重叠渲染 bug -->
    <svg class="gb-hero-title" viewBox="0 0 360 72" role="img" aria-label="留言板">
      <defs>
        <linearGradient id="gb-title-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2ea88d" />
          <stop offset="50%" stop-color="#7fd8be" />
          <stop offset="100%" stop-color="#2ea88d" />
          <animate attributeName="x1" values="0;-1;0" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="1;0;1" dur="6s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <text x="180" y="38" text-anchor="middle" dominant-baseline="central" fill="url(#gb-title-grad)">留言板</text>
    </svg>
    <p class="gb-hero-sub">五颜六色的想法，都从这里漂过</p>
  </div>

  <!-- 彩色对话条：多行反向流动，悬停暂停 -->
  <div class="gb-flow">
    <div v-for="(row, i) in rows" :key="i" class="gb-row">
      <div
        class="gb-row-track"
        :style="{
          animationDuration: row.duration,
          animationDirection: row.reverse ? 'reverse' : 'normal'
        }"
      >
        <div
          v-for="(msg, j) in [...row.messages, ...row.messages]"
          :key="j"
          class="gb-bubble"
          :style="{ background: msg.color.bg, color: msg.color.fg }"
        >
          <span class="gb-name">{{ msg.name }}</span>
          <span class="gb-text">{{ msg.text }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Waline 评论区：真正的留言在这里 -->
  <div class="gb-comments">
    <h2 class="gb-comments-title">写下一条留言</h2>
    <div id="waline" class="gb-waline"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// Waline 服务端地址（部署在 Vercel 上，数据存 Supabase）
const WALINE_SERVER_URL = 'https://my-blog-7men.vercel.app'

// 马卡龙色系：浅底深字，随便搭都好看
const palette = [
  { bg: '#e3f6ef', fg: '#16604c' },
  { bg: '#fdeef3', fg: '#8c2f52' },
  { bg: '#eef2fd', fg: '#2f4a8c' },
  { bg: '#fff6e5', fg: '#8c622f' },
  { bg: '#f3eefd', fg: '#5b2f8c' },
  { bg: '#e5f4fd', fg: '#2f6e8c' }
]

const samples = [
  { name: '南柯一梦', text: '欢迎大家来玩，随便聊点什么吧～' },
  { name: '路过的acmer', text: '前缀和那篇写得太清楚了，收藏！' },
  { name: '小透明', text: '博客好好看，花瓣特效好评' },
  { name: '算法苦行僧', text: '匈牙利算法终于看懂了，谢谢博主' },
  { name: '摸鱼大师', text: '上班时间刷博客，别告诉我老板' },
  { name: '一杯美式', text: 'AC 是良药，WA 是日常 😭' },
  { name: '夜猫子', text: '凌晨两点还在补题的我路过' },
  { name: '键盘侠', text: '求更树状数组进阶篇！' },
  { name: '芝士雪豹', text: '这里的猫咪桌宠同款想要一个' },
  { name: '好好学习', text: '卡特兰数讲得有股清流的感觉' },
  { name: '楼下老王', text: '小伙子博客做得不错嘛' },
  { name: '风居住的街道', text: '字好好看，什么字体呀' },
  { name: '再睡五分钟', text: '早八人早八魂，看完这篇就睡' },
  { name: '二进制少女', text: '01001000 01101001（打招呼）' },
  { name: '橘子味汽水', text: '夏天、汽水、算法，绝配' },
  { name: '退役选手', text: '想起了当年打比赛的日子，泪目' },
  { name: '萌新求带', text: '纯小白，从哪篇开始看比较好？' },
  { name: '山有木兮', text: '越过山丘，才发现无人等候（不是）' }
]

// 流动条消息：默认是示例，拉到真实留言后「真实留言在前，示例在后补齐」
const messages = ref([...samples])

// 每条消息按顺序分配颜色，一行内不会撞色
const rows = computed(() => {
  const buckets = [[], [], []]
  messages.value.forEach((m, i) => {
    buckets[i % 3].push({ name: m.name, text: m.text, color: palette[i % palette.length] })
  })
  return [
    { messages: buckets[0], duration: '38s', reverse: false },
    { messages: buckets[1], duration: '46s', reverse: true },
    { messages: buckets[2], duration: '42s', reverse: false }
  ]
})

// 把评论内容清洗成一行短文本（去图片/链接/markdown 符号）
function toPlain(t) {
  return (t || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*#_>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
}

// 拉取留言板真实留言，真实留言在前，不足再用示例补齐（留言多了会自然覆盖示例）
async function loadRecentComments() {
  try {
    const [{ getComment }] = await Promise.all([
      import('@waline/client'),
      import('@waline/client/style')
    ])
    const res = await getComment({
      serverURL: WALINE_SERVER_URL,
      lang: 'zh-CN',
      path: '/chat/',
      page: 1,
      pageSize: 18,
      sortBy: 'latest'
    })
    const real = (res.data || [])
      .map((c) => ({ name: c.nick || '匿名', text: toPlain(c.orig || c.comment) }))
      .filter((c) => c.text)
    if (real.length) {
      messages.value = [...real, ...samples].slice(0, 18)
    }
  } catch {
    // 拉取失败保持示例，不影响页面
  }
}

onMounted(async () => {
  // 服务端地址未配置时不加载，避免控制台报错
  if (WALINE_SERVER_URL.includes('YOUR_WALINE_SERVER')) return

  const [{ init }] = await Promise.all([
    import('@waline/client'),
    import('@waline/client/style')
  ])

  init({
    el: '#waline',
    serverURL: WALINE_SERVER_URL,
    lang: 'zh-CN',
    path: '/chat/',          // 留言板页面独占一份评论数据
    dark: 'html.dark',       // 跟随站点暗色模式
    login: 'force',          // 必须注册/登录后才能留言
    commentSorting: 'latest',
    pageSize: 10
  })

  // 流动条动态拉取真实留言
  loadRecentComments()
})
</script>

<style scoped>
.gb-hero {
  position: relative;
  text-align: center;
  padding: 48px 24px 12px;
  overflow: hidden;
}

.gb-hero-orb {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(46, 168, 141, 0.14);
  filter: blur(70px);
  top: -60px;
  left: 12%;
  pointer-events: none;
}

.gb-hero-orb--small {
  width: 150px;
  height: 150px;
  background: rgba(127, 216, 190, 0.18);
  top: 20px;
  left: auto;
  right: 14%;
}

.gb-hero-title {
  display: block;
  width: 320px;
  max-width: 80vw;
  height: auto;
  margin: 0 auto;
}

.gb-hero-title text {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

@keyframes gb-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.gb-hero-sub {
  position: relative;
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 12px 0 0;
  animation: gb-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}

/* ===== 流动对话条 ===== */
.gb-flow {
  margin: 36px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  /* 左右边缘渐隐，对话条像从雾中漂过 */
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
}

.gb-row {
  overflow: hidden;
}

.gb-row-track {
  display: flex;
  gap: 14px;
  width: max-content;
  padding: 2px 0;
  animation: gb-scroll linear infinite;
}

.gb-row:hover .gb-row-track {
  animation-play-state: paused;
}

@keyframes gb-scroll {
  to { transform: translateX(-50%); }
}

.gb-bubble {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 16px 16px 16px 4px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease;
}

.gb-bubble:hover {
  transform: translateY(-3px) scale(1.03);
}

.gb-name {
  font-weight: 600;
  flex-shrink: 0;
}

.gb-name::after {
  content: '·';
  margin-left: 8px;
  opacity: 0.5;
}

.gb-text {
  opacity: 0.9;
}

/* ===== Waline 评论区 ===== */
.gb-comments {
  max-width: 720px;
  margin: 44px auto 0;
  padding: 0 24px 64px;
}

.gb-comments-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid var(--vp-c-brand-1);
}

/* 让 Waline 控件贴合站点圆角风格 */
.gb-waline {
  --waline-theme-color: var(--vp-c-brand-1);
  --waline-active-color: var(--vp-c-brand-2);
}

@media (max-width: 640px) {
  .gb-hero-title { width: 260px; }
}
</style>
