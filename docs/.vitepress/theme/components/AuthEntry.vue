<template>
  <div class="auth-entry">
    <!-- 未登录：登录/注册按钮 -->
    <button v-if="!user.token" class="auth-btn" @click="open()">登录 / 注册</button>

    <!-- 已登录：头像 + 昵称，悬停弹出菜单 -->
    <div v-else class="auth-menu">
      <button class="auth-user" @click="showProfile = true">
        <img v-if="user.avatar" class="auth-avatar" :src="user.avatar" :alt="user.display_name" />
        <span class="auth-name">{{ user.display_name }}</span>
      </button>
      <div class="auth-dropdown">
        <button class="auth-menu-item" @click="showProfile = true">个人资料</button>
        <button class="auth-menu-item auth-menu-item--danger" @click="logout">退出登录</button>
      </div>
    </div>

    <ProfileSettings v-if="showProfile" :user="user" @close="showProfile = false" />

    <!-- 登录/注册弹窗 -->
    <Teleport to="body">
      <div v-if="visible" class="auth-mask" @click.self="close()">
        <div class="auth-modal">
          <button class="auth-close" aria-label="关闭" @click="close()">×</button>

          <!-- 渐变标题（SVG，避开 background-clip 渲染 bug） -->
          <svg class="auth-title" viewBox="0 0 300 60" role="img" :aria-label="tab === 'login' ? '欢迎回来' : '加入我们'">
            <defs>
              <linearGradient id="auth-title-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#2ea88d" />
                <stop offset="50%" stop-color="#7fd8be" />
                <stop offset="100%" stop-color="#2ea88d" />
              </linearGradient>
            </defs>
            <text x="150" y="32" text-anchor="middle" dominant-baseline="central" fill="url(#auth-title-grad)">
              {{ tab === 'login' ? '欢迎回来' : '加入我们' }}
            </text>
          </svg>
          <p class="auth-sub">{{ tab === 'login' ? '登录后即可留言互动' : '注册一个账号，成为小屋的一员' }}</p>

          <!-- 选项卡 -->
          <div class="auth-tabs">
            <button :class="['auth-tab', { active: tab === 'login' }]" @click="switchTab('login')">登录</button>
            <button :class="['auth-tab', { active: tab === 'register' }]" @click="switchTab('register')">注册</button>
          </div>

          <form class="auth-form" @submit.prevent="submit">
            <input
              v-if="tab === 'register'"
              v-model.trim="form.name"
              class="auth-input"
              maxlength="20"
              placeholder="昵称"
              required
            />
            <input v-model.trim="form.email" class="auth-input" type="email" placeholder="邮箱" required />
            <input
              v-model="form.password"
              class="auth-input"
              type="password"
              :placeholder="tab === 'register' ? '密码（至少 6 位）' : '密码'"
              minlength="6"
              required
            />
            <input
              v-if="tab === 'register'"
              v-model="form.confirm"
              class="auth-input"
              type="password"
              placeholder="确认密码"
              minlength="6"
              required
            />

            <label class="auth-remember">
              <input v-model="form.remember" type="checkbox" />
              <span>自动登录（不勾选则关闭浏览器后需要重新登录）</span>
            </label>

            <p v-if="error" class="auth-error">{{ error }}</p>

            <button class="auth-submit" type="submit" :disabled="loading">
              {{ loading ? '请稍候…' : tab === 'login' ? '登 录' : '注册并登录' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import ProfileSettings from './ProfileSettings.vue'

// Waline 服务端地址（与留言板共用同一套账号）
const SERVER = 'https://my-blog-7men.vercel.app'
const USER_KEY = 'WALINE_USER'
const SESSION_KEY = 'WALINE_SESSION'

const user = ref({})
const visible = ref(false)
const showProfile = ref(false)
const tab = ref('login')
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', confirm: '', remember: true })

onMounted(() => {
  try {
    user.value = JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  } catch {
    user.value = {}
  }
})

function open(t = 'login') {
  tab.value = t
  error.value = ''
  visible.value = true
}

function close() {
  visible.value = false
}

function switchTab(t) {
  tab.value = t
  error.value = ''
}

async function api(path, body) {
  const resp = await fetch(`${SERVER}${path}?lang=zh-cn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return resp.json()
}

async function submit() {
  error.value = ''

  if (tab.value === 'register') {
    if (form.password !== form.confirm) {
      error.value = '两次输入的密码不一致'
      return
    }
  }

  loading.value = true
  try {
    if (tab.value === 'register') {
      const reg = await api('/api/user', {
        display_name: form.name,
        email: form.email,
        password: form.password,
        url: ''
      })
      if (reg.errno !== 0) {
        error.value = reg.errmsg || '注册失败，邮箱可能已被使用'
        return
      }
    }

    // 登录拿 token（注册成功后直接自动登录）
    const res = await api('/api/token', { email: form.email, password: form.password })
    if (res.errno !== 0) {
      error.value = tab.value === 'login' ? '邮箱或密码错误' : '注册成功，请切换到登录页登录'
      return
    }

    // 写入与评论组件相同的键；remember=false 时本次浏览器会话结束后自动登出
    localStorage.setItem(USER_KEY, JSON.stringify({ ...res.data, remember: form.remember }))
    sessionStorage.setItem(SESSION_KEY, '1')
    location.reload()
  } catch {
    error.value = '网络异常，请稍后重试'
  } finally {
    loading.value = false
  }
}

function logout() {
  if (!confirm(`确定退出登录吗（${user.value.display_name}）？`)) return
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  location.reload()
}
</script>

<style scoped>
.auth-entry {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.auth-btn {
  padding: 7px 16px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 168, 141, 0.35);
}

.auth-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.auth-user:hover {
  border-color: var(--vp-c-brand-1);
}

.auth-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}

.auth-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 用户悬停菜单 ===== */
.auth-menu {
  position: relative;
}

.auth-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 120px;
  padding: 6px;
  padding-top: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  z-index: 60;
}

.auth-menu:hover .auth-dropdown,
.auth-menu:focus-within .auth-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.auth-dropdown::before {
  content: '';
  display: block;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  bottom: 0;
}

.auth-menu-item {
  position: relative;
  display: block;
  width: 100%;
  padding: 9px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;
}

.auth-menu-item:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.auth-menu-item--danger:hover {
  background: rgba(211, 51, 51, 0.08);
  color: #d33;
}

/* ===== 弹窗 ===== */
.auth-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  animation: auth-fade 0.25s ease both;
}

@keyframes auth-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-modal {
  position: relative;
  width: 380px;
  max-width: calc(100vw - 48px);
  padding: 36px 32px 28px;
  border-radius: 20px;
  background: var(--vp-c-bg);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  animation: auth-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes auth-pop {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.auth-close {
  position: absolute;
  top: 12px;
  right: 14px;
  border: none;
  background: none;
  font-size: 22px;
  line-height: 1;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.auth-close:hover {
  color: var(--vp-c-brand-1);
}

.auth-title {
  display: block;
  width: 220px;
  height: 44px;
  margin: 0 auto;
}

.auth-title text {
  font-family: var(--font-serif);
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.auth-sub {
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 4px 0 18px;
}

.auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  padding: 4px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.auth-tab {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 9px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.auth-tab.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-input {
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.auth-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.auth-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  user-select: none;
}

.auth-remember input {
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}

.auth-error {
  margin: 0;
  font-size: 13px;
  color: #d33;
  text-align: center;
}

.auth-submit {
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 168, 141, 0.3);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
