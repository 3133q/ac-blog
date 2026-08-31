import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/500.css'
import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import AuthEntry from './components/AuthEntry.vue'
import PostWidget from './components/PostWidget.vue'

function setupNavFan() {
  // 只对启用扇面的菜单组隐藏原生下拉（样式只注入一次）
  if (!document.getElementById('nav-fan-style')) {
    const style = document.createElement('style')
    style.id = 'nav-fan-style'
    style.textContent = '.VPNavBarMenuGroup.nav-fan-enabled .VPMenu { display: none !important; }'
    document.head.appendChild(style)
  }

  const groups = document.querySelectorAll<HTMLElement>('.VPNavBarMenuGroup')
    groups.forEach((group) => {
    const links = group.querySelectorAll<HTMLElement>('.VPMenu .VPLink')
    if (links.length === 0) return

    group.querySelector('.nav-fan-pivot')?.remove()
    group.classList.add('nav-fan-enabled')

    // 扇面枢轴：按钮正下方
    const pivot = document.createElement('div')
    pivot.className = 'nav-fan-pivot'
    group.style.position = 'relative'
    group.appendChild(pivot)

    const count = links.length
    // 扇叶紧挨着枢轴往下展开，不会伸到 hero 图那边
    const radius = 16
    // 相邻扇叶间隔 50°，充分分开
    const step = 50
    const startDeg = -step * (count - 1) / 2
    // 扇面配色：品牌青绿的同色系渐变，与全站统一
    const colors = ['#a9e7d6', '#c4efe2', '#def7ee']

    // 每个链接是一片「扇叶」：绕枢轴旋转展开，竖排文字顺着扇叶方向
    const blades = Array.from(links).map((link, i) => {
      const angle = startDeg + step * i

      const blade = document.createElement('div')
      blade.className = 'nav-fan-blade'

      const item = document.createElement('a')
      item.className = 'nav-fan-item'
      item.href = link.getAttribute('href') || '#'
      item.textContent = link.textContent?.trim() || ''
      item.style.background = colors[i % colors.length]
      item.style.transform = `translate(-50%, ${radius}px)`

      blade.appendChild(item)
      pivot.appendChild(blade)
      return { blade, angle, index: i }
    })

    let timer: ReturnType<typeof setTimeout> | null = null

    group.addEventListener('mouseenter', () => {
      if (timer) { clearTimeout(timer); timer = null }
      blades.forEach(({ blade, angle, index }) => {
        blade.style.transitionDelay = `${index * 45}ms`
        blade.style.transform = `rotate(${angle}deg)`
        blade.style.opacity = '1'
        blade.style.pointerEvents = 'auto'
      })
    })

    group.addEventListener('mouseleave', () => {
      timer = setTimeout(() => {
        blades.forEach(({ blade, index }) => {
          // 收起时反向错峰，像合扇一样
          blade.style.transitionDelay = `${(blades.length - 1 - index) * 25}ms`
          blade.style.transform = 'rotate(0deg)'
          blade.style.opacity = '0'
          blade.style.pointerEvents = 'none'
        })
      }, 150)
    })

  })
}

export default {
  extends: DefaultTheme,

  // 导航栏右侧挂登录/注册入口
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(AuthEntry),
      'doc-footer-before': () => h(PostWidget)
    }),

  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    // 登录时未勾选"自动登录"的会话，浏览器关闭后自动登出
    // （sessionStorage 随浏览器会话结束清空，localStorage 不会）
    try {
      const raw = localStorage.getItem('WALINE_USER')
      if (raw) {
        const u = JSON.parse(raw)
        if (u && u.remember === false && !sessionStorage.getItem('WALINE_SESSION')) {
          localStorage.removeItem('WALINE_USER')
        }
      }
    } catch {
      // 数据异常时保持原状，不影响站点
    }

    // 刷新后始终回到顶部
    history.scrollRestoration = 'manual'
    addEventListener('load', () => scrollTo(0, 0))

    // 全局点击效果：点击处散开小光点
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement('span')
        dot.className = 'click-dot'

        // 随机方向、随机距离、随机大小
        const angle = Math.random() * Math.PI * 2
        const dist = 24 + Math.random() * 32
        dot.style.left = `${e.clientX}px`
        dot.style.top = `${e.clientY}px`
        dot.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
        dot.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
        dot.style.setProperty('--size', `${3 + Math.random() * 4}px`)

        document.body.appendChild(dot)
        dot.addEventListener('animationend', () => dot.remove())
      }
    })

    // 笔记入口页：滚动到可视区域时显现
    const setupReveal = () => {
      const els = document.querySelectorAll(
        '.notes-body .section-title, .notes-body .timeline-day, .notes-body .profile-card, .notes-body .checkin-card'
      )
      if (!els.length) return

      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }
      }, { threshold: 0.15 })

      els.forEach((el) => io.observe(el))
    }

    // 首页：清理旧版背景层 + 生成星星点点和花瓣 + 扇面菜单
    const setupScene = () => {
      document.querySelector('.hero-bg')?.remove()
      document.querySelectorAll('.shooting-star, .star-particle, .petal').forEach(e => e.remove())

      const colors = [
        'rgba(255,180,200,0.45)',
        'rgba(255,210,160,0.45)',
        'rgba(180,210,255,0.45)',
        'rgba(200,180,255,0.45)',
        'rgba(160,230,210,0.45)',
        'rgba(255,240,180,0.45)',
        'rgba(230,190,220,0.45)',
        'rgba(180,220,240,0.45)',
      ]

      for (let i = 0; i < 35; i++) {
        const dot = document.createElement('div')
        dot.className = 'star-particle'
        dot.style.top = `${Math.random() * 95}%`
        dot.style.left = `${Math.random() * 95}%`
        dot.style.background = colors[Math.floor(Math.random() * colors.length)]
        dot.style.setProperty('--dur', `${2 + Math.random() * 3}s`)
        dot.style.setProperty('--delay', `${Math.random() * 2.5}s`)
        document.body.appendChild(dot)
      }

      for (let i = 0; i < 18; i++) {
        const petal = document.createElement('div')
        petal.className = 'petal'
        const size = 14 + Math.random() * 22
        petal.style.width = `${size}px`
        petal.style.height = `${size * 0.7}px`
        petal.style.left = `${Math.random() * 95}%`
        petal.style.setProperty('--dur', `${5 + Math.random() * 7}s`)
        petal.style.setProperty('--delay', `${Math.random() * 8}s`)
        petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`)
        petal.style.setProperty('--spin', `${300 + Math.random() * 400}deg`)
        document.body.appendChild(petal)
      }
    }

    setTimeout(() => { setupReveal(); setupScene(); setupNavFan(); setupProgress(); setupSidebarScroll(); setupBackToTop(); setupReadingTime(); setupHeroTyping() }, 100)
    router.onAfterRouteChanged = () => setTimeout(() => { setupReveal(); setupScene(); setupNavFan(); setupProgress(); setupSidebarScroll(); setupReadingTime(); setupHeroTyping() }, 50)
  }
}

// 侧边栏自动定位：把当前文章对应的菜单项滚到可视区中央
function setupSidebarScroll() {
  const tryScroll = (attempt = 0) => {
    const sidebar = document.querySelector<HTMLElement>('.VPSidebar')
    const active = sidebar?.querySelector<HTMLElement>('.VPSidebarItem.is-active')
    if (!active) {
      if (attempt < 8) requestAnimationFrame(() => tryScroll(attempt + 1))
      return
    }
    const sr = sidebar.getBoundingClientRect()
    const ar = active.getBoundingClientRect()
    sidebar.scrollTop += (ar.top - sr.top) - (sr.height / 2) + (ar.height / 2)
  }
  tryScroll()
}

// 回到顶部按钮：长文章滚下去后浮出
function setupBackToTop() {
  if (document.querySelector('.back-to-top')) return
  const btn = document.createElement('button')
  btn.className = 'back-to-top'
  btn.setAttribute('aria-label', '回到顶部')
  btn.innerHTML = '↑'
  document.body.appendChild(btn)

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

  const onScroll = () => btn.classList.toggle('show', window.scrollY > 420)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// 文章元信息：标题下显示「字数 · 阅读时长」
function setupReadingTime() {
  document.querySelector('.reading-meta')?.remove()
  const doc = document.querySelector('.vp-doc')
  if (!doc) return
  const text = doc.textContent || ''
  const chars = text.replace(/\s/g, '').length
  if (chars === 0) return

  const minutes = Math.max(1, Math.round(chars / 400))
  const meta = document.createElement('div')
  meta.className = 'reading-meta'
  meta.textContent = `全文约 ${chars} 字 · 阅读约 ${minutes} 分钟`

  const h1 = doc.querySelector('h1')
  if (h1) h1.insertAdjacentElement('afterend', meta)
  else doc.prepend(meta)
}

// 首页 hero：标语打字机轮播
function setupHeroTyping() {
  const el = document.querySelector<HTMLElement>('.VPHero .tagline')
  if (!el || el.dataset.typing) return
  el.dataset.typing = '1'

  const phrases = [
    'AC是良药，可治愈一切伤痛...',
    '越过山丘，会有人等候',
    '山高路远，看世界，也找自己'
  ]

  let pi = 0
  let ci = 0
  let deleting = false

  const tick = () => {
    const cur = phrases[pi]
    if (!deleting) {
      ci++
      el.textContent = cur.slice(0, ci)
      if (ci >= cur.length) {
        deleting = true
        setTimeout(tick, 1600)
        return
      }
    } else {
      ci--
      el.textContent = cur.slice(0, ci)
      if (ci <= 0) {
        deleting = false
        pi = (pi + 1) % phrases.length
      }
    }
    setTimeout(tick, deleting ? 45 : 120)
  }

  tick()
}

// 文章页阅读进度条：顶部 2px 品牌色渐变条
function setupProgress() {
  document.querySelector('.reading-progress')?.remove()
  progressEl = null
  if (!document.querySelector('.VPDoc')) return

  const bar = document.createElement('div')
  bar.className = 'reading-progress'
  document.body.appendChild(bar)
  progressEl = bar
  updateProgress()
}

let progressEl: HTMLElement | null = null

function updateProgress() {
  if (!progressEl) return
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  const p = max > 0 ? h.scrollTop / max : 0
  progressEl.style.transform = `scaleX(${p})`
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', updateProgress, { passive: true })
}
