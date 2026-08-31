<template>
  <div v-if="isArticle" class="post-widget">
    <div class="pw-actions">
      <button
        class="pw-btn"
        :class="{ active: liked }"
        :disabled="!user.token"
        @click="toggleLike"
      >
        <span class="pw-icon">{{ liked ? '❤️' : '🤍' }}</span>
        <span class="pw-count">{{ likeCount }}</span>
        <span class="pw-text">{{ liked ? '已喜欢' : '喜欢' }}</span>
      </button>

      <button
        class="pw-btn"
        :class="{ active: favorited }"
        :disabled="!user.token"
        @click="toggleFavorite"
      >
        <span class="pw-icon">{{ favorited ? '⭐' : '☆' }}</span>
        <span class="pw-text">{{ favorited ? '已收藏' : '收藏' }}</span>
      </button>

      <button v-if="!user.token" class="pw-login" @click="goLogin">登录后可点赞、收藏</button>
    </div>

    <h2 class="pw-title">评论区</h2>
    <div ref="walineEl" class="pw-waline"></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const WALINE_SERVER_URL = 'https://my-blog-7men.vercel.app'
const USER_KEY = 'WALINE_USER'

const { page } = useData()

// 只在真正的文章页显示（笔记/随笔的正文页），排除讨论区、标签、关于等页面
const isArticle = computed(() => {
  const p = page.value.relativePath
  if (!p || !/^(notes|essays)\//.test(p)) return false
  return !/\/index\.md$/.test(p)
})

const walineEl = ref(null)
let walineInstance = null
let updateCounterFn = null

const user = ref({})
const liked = ref(false)
const favorited = ref(false)
const likeCount = ref(0)

const curPath = () => location.pathname
const curTitle = () =>
  document.querySelector('.vp-doc h1')?.textContent?.trim() || document.title || ''

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
    const resp = await fetch(`${WALINE_SERVER_URL}/api/token`, {
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
    /* 拉取失败用空 label */
  }
  return {}
}

function arr(label, key) {
  const v = label[key]
  return Array.isArray(v) ? v : []
}

async function saveLabel(label) {
  if (!user.value.token) return
  try {
    await fetch(`${WALINE_SERVER_URL}/api/user?lang=zh-cn`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.value.token}`
      },
      body: JSON.stringify({ label: JSON.stringify(label) })
    })
  } catch {
    /* 同步失败不影响本地 */
  }
}

async function toggleLike() {
  if (!user.value.token || !updateCounterFn) return
  const p = curPath()
  const label = await loadLabel()
  const likes = arr(label, 'likes')
  const idx = likes.findIndex((x) => x.path === p)

  if (idx >= 0) {
    // 取消喜欢
    likes.splice(idx, 1)
    liked.value = false
    likeCount.value = Math.max(0, likeCount.value - 1)
    try {
      await updateCounterFn({ serverURL: WALINE_SERVER_URL, lang: 'zh-CN', path: p, type: 'reaction0', action: 'desc' })
    } catch { /* 计数失败不影响状态 */ }
  } else {
    likes.push({ path: p, title: curTitle() })
    liked.value = true
    likeCount.value += 1
    try {
      await updateCounterFn({ serverURL: WALINE_SERVER_URL, lang: 'zh-CN', path: p, type: 'reaction0', action: 'inc' })
    } catch { /* 同上 */ }
  }
  label.likes = likes
  await saveLabel(label)
}

async function toggleFavorite() {
  if (!user.value.token) return
  const p = curPath()
  const label = await loadLabel()
  const favorites = arr(label, 'favorites')
  const idx = favorites.findIndex((x) => x.path === p)

  if (idx >= 0) {
    favorites.splice(idx, 1)
    favorited.value = false
  } else {
    favorites.push({ path: p, title: curTitle() })
    favorited.value = true
  }
  label.favorites = favorites
  await saveLabel(label)
}

function goLogin() {
  const btn = document.querySelector('.auth-btn')
  btn?.click()
}

onMounted(async () => {
  user.value = getUser()

  const [{ init, getArticleCounter, updateArticleCounter }] = await Promise.all([
    import('@waline/client'),
    import('@waline/client/style')
  ])
  updateCounterFn = updateArticleCounter

  walineInstance = init({
    el: walineEl.value,
    serverURL: WALINE_SERVER_URL,
    path: curPath(),
    lang: 'zh-CN',
    dark: 'html.dark',
    login: 'force',
    commentSorting: 'latest',
    pageSize: 10,
    pageview: true,
    reaction: false
  })

  try {
    const [cnt] = await getArticleCounter({
      serverURL: WALINE_SERVER_URL,
      lang: 'zh-CN',
      paths: [curPath()],
      type: ['reaction0']
    })
    likeCount.value = cnt?.reaction0 || 0
  } catch {
    likeCount.value = 0
  }

  if (user.value.token) {
    const label = await loadLabel()
    liked.value = arr(label, 'likes').some((x) => x.path === curPath())
    favorited.value = arr(label, 'favorites').some((x) => x.path === curPath())
  }
})

onBeforeUnmount(() => {
  walineInstance?.destroy()
  walineInstance = null
})
</script>

<style scoped>
.post-widget {
  margin-top: 40px;
}

.pw-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.pw-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.pw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pw-btn.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pw-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pw-icon {
  font-size: 16px;
  line-height: 1;
}

.pw-count {
  font-weight: 700;
  min-width: 12px;
  text-align: center;
}

.pw-text {
  font-weight: 500;
}

.pw-login {
  margin-left: auto;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.pw-login:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.pw-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 24px 0 16px;
  padding-left: 12px;
  border-left: 4px solid var(--vp-c-brand-1);
}

.pw-waline {
  --waline-theme-color: var(--vp-c-brand-1);
  --waline-active-color: var(--vp-c-brand-2);
}
</style>
