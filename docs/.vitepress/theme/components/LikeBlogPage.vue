<template>
  <div class="lb-hero">
    <div class="lb-hero-orb"></div>
    <div class="lb-hero-orb lb-hero-orb--small"></div>
    <!-- SVG 渐变标题：避开 background-clip:text 的文字重叠渲染 bug -->
    <svg class="lb-hero-title" viewBox="0 0 360 72" role="img" aria-label="喜欢我的博客">
      <defs>
        <linearGradient id="lb-title-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2ea88d" />
          <stop offset="50%" stop-color="#7fd8be" />
          <stop offset="100%" stop-color="#2ea88d" />
          <animate attributeName="x1" values="0;-1;0" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="1;0;1" dur="6s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <text x="180" y="38" text-anchor="middle" dominant-baseline="central" fill="url(#lb-title-grad)">喜欢我的博客</text>
    </svg>
    <p class="lb-hero-sub">你的喜欢，是我持续更新的最大动力</p>
  </div>

  <div class="lb-card">
    <button
      class="lb-btn"
      :class="{ liked }"
      :disabled="busy"
      @click="toggle"
    >
      <span class="lb-heart">{{ liked ? '❤️' : '🤍' }}</span>
      <span class="lb-count">{{ count }}</span>
    </button>
    <p class="lb-hint">
      {{ !user.token ? '登录后即可送出你的喜欢' : liked ? '谢谢你的喜欢！' : '点击送出一个喜欢' }}
    </p>
  </div>

  <!-- 点赞后从底部滑出的祝福语 -->
  <Teleport to="body">
    <Transition name="lb-toast">
      <div v-if="toastShow" class="lb-toast">{{ toast }}</div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const SERVER = 'https://my-blog-7men.vercel.app'
const USER_KEY = 'WALINE_USER'
const LIKE_PATH = '/like-blog'

const user = ref({})
const liked = ref(false)
const count = ref(0)
const busy = ref(false)

// 送给算法玩家的话：点赞后随机抽一条
const blessings = [
  '愿你的每一发提交，都是 Accepted。',
  'WA 只是过程，AC 才是归宿。',
  '愿你的线段树永不越界，图论永远连通。',
  '愿你的 dp 状态转移，一个不漏。',
  '愿你的二分不迷路，双指针不打架。',
  '愿你的数组开得正好，不 RE 也不 MLE。',
  '愿你的 long long 永远够用。',
  '愿你的栈不溢出，队列不空，递归不爆。',
  '愿你调试三分钟，而不是三小时。',
  '愿你一次编译通过，一次提交 AC。',
  '愿你逢题必会，逢提交必 Accepted。',
  '愿你在数据范围里，总能找到最优解。',
  '愿你的 rating 一路向北。',
  '愿你在算法这条路上，越走越远，越走越亮。',
  '愿你打过的每一场比赛，都无怨无悔。',
  '愿你思维像指针一样灵活，代码像模板一样顺手。'
]

const toast = ref('')
const toastShow = ref(false)
let toastTimer = null

function showBlessing() {
  // 避免和上一条重复
  const pool = blessings.filter((b) => b !== toast.value)
  toast.value = pool[Math.floor(Math.random() * pool.length)]
  toastShow.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastShow.value = false
  }, 3600)
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  } catch {
    return {}
  }
}

async function loadLabel() {
  if (!user.value.token) return {}
  try {
    const resp = await fetch(`${SERVER}/api/token`, {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })
    const res = await resp.json()
    if (res.errno === 0 && res.data) {
      try {
        return JSON.parse(res.data.label || '{}')
      } catch {
        return {}
      }
    }
  } catch {
    // 拉取失败用空 label
  }
  return {}
}

async function saveLabel(label) {
  if (!user.value.token) return
  try {
    await fetch(`${SERVER}/api/user?lang=zh-cn`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.value.token}`
      },
      body: JSON.stringify({ label: JSON.stringify(label) })
    })
  } catch {
    // 同步失败不影响本地
  }
}

async function toggle() {
  if (busy.value) return
  if (!user.value.token) {
    document.querySelector('.auth-btn')?.click()
    return
  }

  busy.value = true
  try {
    const [{ updateArticleCounter }] = await Promise.all([
      import('@waline/client'),
      import('@waline/client/style')
    ])

    const next = !liked.value
    await updateArticleCounter({
      serverURL: SERVER,
      lang: 'zh-CN',
      path: LIKE_PATH,
      type: 'reaction0',
      action: next ? 'inc' : 'desc'
    })

    liked.value = next
    count.value = Math.max(0, count.value + (next ? 1 : -1))

    const label = await loadLabel()
    label.blogLiked = next
    await saveLabel(label)

    if (next) showBlessing()
  } catch {
    // 失败保持原状态
  } finally {
    busy.value = false
  }
}

onMounted(async () => {
  user.value = getUser()

  try {
    const [{ getArticleCounter }] = await Promise.all([
      import('@waline/client'),
      import('@waline/client/style')
    ])
    const [cnt] = await getArticleCounter({
      serverURL: SERVER,
      lang: 'zh-CN',
      paths: [LIKE_PATH],
      type: ['reaction0']
    })
    count.value = cnt?.reaction0 || 0
  } catch {
    count.value = 0
  }

  if (user.value.token) {
    const label = await loadLabel()
    liked.value = label.blogLiked === true
  }
})
</script>

<style scoped>
.lb-hero {
  position: relative;
  text-align: center;
  padding: 48px 24px 12px;
  overflow: hidden;
}

.lb-hero-orb {
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

.lb-hero-orb--small {
  width: 150px;
  height: 150px;
  background: rgba(127, 216, 190, 0.18);
  top: 20px;
  left: auto;
  right: 14%;
}

.lb-hero-title {
  display: block;
  width: 340px;
  max-width: 84vw;
  height: auto;
  margin: 0 auto;
}

.lb-hero-title text {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

@keyframes lb-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.lb-hero-sub {
  position: relative;
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 12px 0 0;
  animation: lb-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}

.lb-card {
  max-width: 720px;
  margin: 40px auto 0;
  padding: 0 24px 24px;
  text-align: center;
}

.lb-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 52px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.lb-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 24px rgba(46, 168, 141, 0.18);
}

.lb-btn.liked {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.lb-btn:disabled {
  cursor: wait;
  opacity: 0.7;
}

.lb-heart {
  font-size: 40px;
  line-height: 1;
}

.lb-count {
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: var(--font-serif);
}

.lb-hint {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* ===== 底部祝福语 toast ===== */
.lb-toast {
  position: fixed;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  max-width: calc(100vw - 48px);
  padding: 12px 22px;
  border-radius: 14px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  color: var(--vp-c-text-1);
  font-family: var(--font-serif);
  font-size: 15px;
  text-align: center;
  z-index: 300;
}

.lb-toast-enter-active,
.lb-toast-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.lb-toast-enter-from,
.lb-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 24px);
}

@media (max-width: 640px) {
  .lb-hero-title { width: 300px; }
}
</style>
