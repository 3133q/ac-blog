<template>
  <Teleport to="body">
    <div class="ps-mask" @click.self="$emit('close')">
      <div class="ps-modal">
        <button class="ps-close" aria-label="关闭" @click="$emit('close')">×</button>

        <!-- 渐变标题（SVG，避开 background-clip 渲染 bug） -->
        <svg class="ps-title" viewBox="0 0 300 60" role="img" :aria-label="title">
          <defs>
            <linearGradient id="ps-title-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#2ea88d" />
              <stop offset="50%" stop-color="#7fd8be" />
              <stop offset="100%" stop-color="#2ea88d" />
            </linearGradient>
          </defs>
          <text x="150" y="32" text-anchor="middle" dominant-baseline="central" fill="url(#ps-title-grad)">{{ title }}</text>
        </svg>
        <p class="ps-sub">{{ sub }}</p>

        <!-- 选项卡：资料 / 点赞 / 收藏 -->
        <div class="ps-tabs">
          <button
            :class="['ps-tab', { active: tab === 'profile' }]"
            @click="tab = 'profile'"
          >个人资料</button>
          <button
            :class="['ps-tab', { active: tab === 'likes' }]"
            @click="tab = 'likes'"
          >点赞<span v-if="likes.length" class="ps-tab-badge">{{ likes.length }}</span></button>
          <button
            :class="['ps-tab', { active: tab === 'favorites' }]"
            @click="tab = 'favorites'"
          >收藏<span v-if="favorites.length" class="ps-tab-badge">{{ favorites.length }}</span></button>
        </div>

        <!-- 个人资料表单 -->
        <form v-if="tab === 'profile'" class="ps-form" @submit.prevent="save">
          <!-- 头像上传 -->
          <div class="ps-avatar-row">
            <div class="ps-avatar" @click="fileInput.click()">
              <img v-if="avatarPreview" :src="avatarPreview" alt="头像预览" />
              <span v-else class="ps-avatar-letter">{{ (name || '?')[0] }}</span>
            </div>
            <div class="ps-avatar-side">
              <button type="button" class="ps-upload-btn" @click="fileInput.click()">上传头像</button>
              <p class="ps-hint">自动裁剪压缩为 128×128</p>
            </div>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile" />
          </div>

          <input v-model.trim="name" class="ps-input" maxlength="20" placeholder="昵称" required />
          <input v-model.trim="url" class="ps-input" type="url" placeholder="个人网站（选填）" />

          <label class="ps-label">生日</label>
          <input v-model="birthday" class="ps-input" type="date" />

          <input v-model.trim="hobbies" class="ps-input" maxlength="50" placeholder="爱好（选填，如：代码 / 音乐 / 篮球）" />

          <label class="ps-label">社交账号（选填，填用户名即可，管理员后台可见）</label>
          <div v-for="s in SOCIALS" :key="s.key" class="ps-social-row">
            <svg class="ps-social-icon" viewBox="0 0 24 24" role="img" :aria-label="s.label">
              <path fill="currentColor" :d="s.path" />
            </svg>
            <input
              v-model.trim="socials[s.key]"
              class="ps-input ps-social-input"
              maxlength="100"
              :placeholder="s.placeholder"
            />
          </div>

          <p v-if="error" class="ps-error">{{ error }}</p>

          <button class="ps-submit" type="submit" :disabled="saving">
            {{ saving ? '保存中…' : '保 存' }}
          </button>
        </form>

        <!-- 点赞列表 -->
        <div v-else-if="tab === 'likes'" class="ps-list">
          <template v-if="likesView.length">
            <div v-for="item in likesView" :key="item.path" class="ps-item">
              <a class="ps-item-link" :href="item.path" :title="item.title">{{ item.title }}</a>
              <button class="ps-item-del" aria-label="取消点赞" @click="removeLike(item)">取消</button>
            </div>
          </template>
          <p v-else class="ps-empty">还没有点赞过任何文章</p>
        </div>

        <!-- 收藏列表 -->
        <div v-else class="ps-list">
          <template v-if="favoritesView.length">
            <div v-for="item in favoritesView" :key="item.path" class="ps-item">
              <a class="ps-item-link" :href="item.path" :title="item.title">{{ item.title }}</a>
              <button class="ps-item-del" aria-label="取消收藏" @click="removeFavorite(item)">取消</button>
            </div>
          </template>
          <p v-else class="ps-empty">还没有收藏过任何文章</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

// 社交账号字段：存进 wl_users 的对应列，Waline 后台用户列表会点亮对应图标
// 图标 path 来自 simple-icons（@iconify-json/simple-icons）
const SOCIALS = [
  {
    key: 'github',
    label: 'GitHub',
    placeholder: 'GitHub 用户名',
    path: 'M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
  },
  {
    key: 'qq',
    label: 'QQ',
    placeholder: 'QQ 号',
    path: 'M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673c.54.065 2.103-2.472 2.103-2.472c0 1.469.756 3.387 2.394 4.771c-.612.188-1.363.479-1.845.835c-.434.32-.379.646-.301.778c.343.578 5.883.369 7.482.189c1.6.18 7.14.389 7.483-.189c.078-.132.132-.458-.301-.778c-.483-.356-1.233-.646-1.846-.836c1.637-1.384 2.393-3.302 2.393-4.771c0 0 1.563 2.537 2.103 2.472c.251-.03.581-1.39-.438-4.673'
  },
  {
    key: 'weibo',
    label: '微博',
    placeholder: '微博用户名',
    path: 'M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02c-.259-2.609 2.759-5.047 6.74-5.441c3.979-.394 7.413 1.404 7.671 4.018c.259 2.6-2.759 5.049-6.737 5.439zM9.05 17.219c-.384.616-1.208.884-1.829.602c-.612-.279-.793-.991-.406-1.593c.379-.595 1.176-.861 1.793-.601c.622.263.82.972.442 1.592m1.27-1.627c-.141.237-.449.353-.689.253c-.236-.09-.313-.361-.177-.586c.138-.227.436-.346.672-.24c.239.09.315.36.18.601zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118c-.836 1.704-.026 3.591 1.886 4.21c1.983.64 4.318-.341 5.132-2.179c.8-1.793-.201-3.642-2.161-4.149m7.563-1.224c-.346-.105-.57-.18-.405-.615c.375-.977.42-1.804 0-2.404c-.781-1.112-2.915-1.053-5.364-.03c0 0-.766.331-.571-.271c.376-1.217.315-2.224-.27-2.809c-1.338-1.337-4.869.045-7.888 3.08C1.309 10.87 0 13.273 0 15.348c0 3.981 5.099 6.395 10.086 6.395c6.536 0 10.888-3.801 10.888-6.82c0-1.822-1.547-2.854-2.915-3.284zm1.908-5.092a3.1 3.1 0 0 0-2.96-.962a.786.786 0 0 0-.616.932a.79.79 0 0 0 .932.602a1.51 1.51 0 0 1 1.442.465c.376.421.466.977.316 1.473a.786.786 0 0 0 .51.992a.813.813 0 0 0 .992-.512a3.11 3.11 0 0 0-.646-3.035zm2.418-2.195c-1.576-1.757-3.905-2.419-6.054-1.968a.91.91 0 0 0-.706 1.081a.91.91 0 0 0 1.082.707a4.5 4.5 0 0 1 4.296 1.383a4.53 4.53 0 0 1 .947 4.416a.91.91 0 0 0 .586 1.157c.479.165.991-.104 1.157-.586a6.39 6.39 0 0 0-1.338-6.235z'
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    placeholder: 'X 用户名（不含 @）',
    path: 'M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z'
  }
]

const props = defineProps({
  user: { type: Object, required: true }
})
const emit = defineEmits(['close'])

const SERVER = 'https://my-blog-7men.vercel.app'
const USER_KEY = 'WALINE_USER'

const tab = ref('profile')
const name = ref(props.user.display_name || '')
const url = ref(props.user.url || '')
const birthday = ref('')
const hobbies = ref('')
const avatarPreview = ref(props.user.avatar || '')
const socials = reactive({ github: '', qq: '', weibo: '', twitter: '' })
const saving = ref(false)

// label 完整对象 + 点赞/收藏列表（与生日/爱好/打卡共存，不互相覆盖）
const labelObj = ref({})
const likes = ref([])
const favorites = ref([])

const title = computed(() =>
  tab.value === 'profile' ? '个人资料' : tab.value === 'likes' ? '我的点赞' : '我的收藏'
)
const sub = computed(() =>
  tab.value === 'profile'
    ? '资料保存在云端，换设备也在'
    : tab.value === 'likes'
      ? '你点赞过的文章'
      : '你收藏过的文章'
)
const likesView = computed(() => [...likes.value].reverse())
const favoritesView = computed(() => [...favorites.value].reverse())

// 回填社交账号（数据来源：本地缓存的用户信息 / 服务器拉取的最新资料）
function fillSocials(src) {
  if (!src) return
  for (const key of Object.keys(socials)) {
    if (typeof src[key] === 'string') socials[key] = src[key]
  }
}
const error = ref('')
const fileInput = ref(null)

// 解析 label：生日/爱好/点赞/收藏/打卡等扩展字段都打包在这里
function applyLabel(labelStr) {
  let full = {}
  try {
    full = JSON.parse(labelStr || '{}')
  } catch {
    // label 不是 JSON（比如管理员手动填过标签），忽略
  }
  labelObj.value = full
  birthday.value = full.birthday || ''
  hobbies.value = full.hobbies || ''
  likes.value = Array.isArray(full.likes) ? full.likes : []
  favorites.value = Array.isArray(full.favorites) ? full.favorites : []
}

onMounted(async () => {
  applyLabel(props.user.label)
  fillSocials(props.user)
  // 拉取最新资料，防止多设备间不同步
  try {
    const resp = await fetch(`${SERVER}/api/token`, {
      headers: { Authorization: `Bearer ${props.user.token}` }
    })
    const res = await resp.json()
    if (res.errno === 0 && res.data) {
      name.value = res.data.display_name || name.value
      url.value = res.data.url || ''
      avatarPreview.value = res.data.avatar || avatarPreview.value
      applyLabel(res.data.label)
      fillSocials(res.data)
    }
  } catch {
    // 拉取失败就用本地缓存的资料，不影响编辑
  }
})

// 图片裁剪为正方形并压缩到 128×128，转成 data URI 直接存数据库
function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const size = Math.min(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size) / 2,
        size,
        size,
        0,
        0,
        128,
        128
      )
      avatarPreview.value = canvas.toDataURL('image/jpeg', 0.85)
      error.value = ''
    }
    img.onerror = () => (error.value = '图片读取失败，换一张试试')
    img.src = reader.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

// 只更新 label 字段（点赞/收藏的增删），不动其它资料
async function putLabel(label) {
  if (!props.user.token) return
  try {
    await fetch(`${SERVER}/api/user?lang=zh-cn`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.user.token}`
      },
      body: JSON.stringify({ label: JSON.stringify(label) })
    })
  } catch {
    // 同步失败不影响本地
  }
}

async function removeLike(item) {
  const idx = likes.value.findIndex((x) => x.path === item.path)
  if (idx < 0) return
  likes.value.splice(idx, 1)
  labelObj.value.likes = [...likes.value]

  // 同步扣减文章下方的点赞计数
  try {
    const [{ updateArticleCounter }] = await Promise.all([
      import('@waline/client'),
      import('@waline/client/style')
    ])
    await updateArticleCounter({
      serverURL: SERVER,
      lang: 'zh-CN',
      path: item.path,
      type: 'reaction0',
      action: 'desc'
    })
  } catch {
    // 计数失败不影响列表状态
  }

  await putLabel(labelObj.value)
}

async function removeFavorite(item) {
  const idx = favorites.value.findIndex((x) => x.path === item.path)
  if (idx < 0) return
  favorites.value.splice(idx, 1)
  labelObj.value.favorites = [...favorites.value]
  await putLabel(labelObj.value)
}

async function save() {
  error.value = ''
  saving.value = true
  try {
    // 合并进完整 label，保留已有的点赞/收藏/打卡等字段
    const label = { ...labelObj.value, birthday: birthday.value, hobbies: hobbies.value }
    labelObj.value = label

    const resp = await fetch(`${SERVER}/api/user?lang=zh-cn`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.user.token}`
      },
      body: JSON.stringify({
        display_name: name.value,
        url: url.value,
        avatar: avatarPreview.value,
        label: JSON.stringify(label),
        ...socials
      })
    })
    const res = await resp.json()
    if (res.errno !== 0) {
      error.value = res.errmsg || '保存失败，请稍后重试'
      return
    }

    // 同步本地登录信息并刷新，让导航栏和留言框用上新资料
    const raw = localStorage.getItem(USER_KEY)
    const u = raw ? JSON.parse(raw) : {}
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        ...u,
        display_name: name.value,
        url: url.value,
        avatar: avatarPreview.value,
        label: JSON.stringify(label),
        ...socials
      })
    )
    location.reload()
  } catch {
    error.value = '网络异常，请稍后重试'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.ps-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  animation: ps-fade 0.25s ease both;
}

@keyframes ps-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ps-modal {
  position: relative;
  width: 380px;
  max-width: calc(100vw - 48px);
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px 32px 28px;
  border-radius: 20px;
  background: var(--vp-c-bg);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  animation: ps-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes ps-pop {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.ps-close {
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

.ps-close:hover {
  color: var(--vp-c-brand-1);
}

.ps-title {
  display: block;
  width: 200px;
  height: 44px;
  margin: 0 auto;
}

.ps-title text {
  font-family: var(--font-serif);
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.ps-sub {
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 4px 0 16px;
}

/* ===== 选项卡 ===== */
.ps-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  padding: 4px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.ps-tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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

.ps-tab.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ps-tab-badge {
  min-width: 16px;
  height: 16px;
  padding: 0 5px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 11px;
  line-height: 16px;
  font-weight: 600;
}

/* ===== 点赞 / 收藏列表 ===== */
.ps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 52vh;
  overflow-y: auto;
  padding: 2px;
}

.ps-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s ease;
}

.ps-item:hover {
  border-color: var(--vp-c-brand-1);
}

.ps-item-link {
  flex: 1;
  color: var(--vp-c-text-1);
  font-size: 14px;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ps-item-link:hover {
  color: var(--vp-c-brand-1);
}

.ps-item-del {
  flex-shrink: 0;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.ps-item-del:hover {
  color: #d33;
  border-color: #d33;
}

.ps-empty {
  margin: 0;
  padding: 28px 0;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.ps-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ps-avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}

.ps-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.ps-avatar:hover {
  transform: scale(1.05);
}

.ps-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ps-avatar-letter {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.ps-upload-btn {
  padding: 7px 14px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.ps-upload-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.ps-hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.ps-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: -6px;
}

.ps-social-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ps-social-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-left: 4px;
  color: var(--vp-c-text-2);
}

.ps-social-input {
  flex: 1;
}

.ps-input {
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.ps-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.ps-error {
  margin: 0;
  font-size: 13px;
  color: #d33;
  text-align: center;
}

.ps-submit {
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

.ps-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 168, 141, 0.3);
}

.ps-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
