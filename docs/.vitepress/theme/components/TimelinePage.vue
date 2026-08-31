<template>
  <div class="tl-hero">
    <div class="tl-hero-orb"></div>
    <div class="tl-hero-orb tl-hero-orb--small"></div>
    <!-- SVG 渐变标题：避开 background-clip:text 的文字重叠渲染 bug -->
    <svg class="tl-hero-title" viewBox="0 0 360 72" role="img" aria-label="时间线">
      <defs>
        <linearGradient id="tl-title-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2ea88d" />
          <stop offset="50%" stop-color="#7fd8be" />
          <stop offset="100%" stop-color="#2ea88d" />
          <animate attributeName="x1" values="0;-1;0" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="1;0;1" dur="6s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <text x="180" y="38" text-anchor="middle" dominant-baseline="central" fill="url(#tl-title-grad)">时间线</text>
    </svg>
    <p class="tl-hero-sub">每一道轨迹，都是走向 AC 的脚印</p>
  </div>

  <div class="tl-wrapper">
    <div v-for="mo in months" :key="mo.key" class="tl-month">
      <div class="tl-month-head">
        <span class="tl-month-dot"></span>
        <span class="tl-month-label">{{ mo.label }}</span>
      </div>
      <div class="tl-list">
        <div
          v-for="item in mo.items"
          :key="item.date + (item.milestone ? '-ms' : '')"
          class="tl-item"
          :class="{ 'tl-item--milestone': item.milestone }"
        >
          <div class="tl-node"><span class="tl-node-core"></span></div>
          <div class="tl-card">
            <time class="tl-date">{{ item.day }}</time>
            <div class="tl-tags"><span v-for="t in item.tags" :key="t">{{ t }}</span></div>
            <div class="tl-links">
              <span v-if="item.milestone" class="tl-milestone-text">{{ item.text }}</span>
              <a v-for="l in item.links" v-else :key="l.url" :href="l.url">{{ l.title }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tl-footer">
    <div class="tl-footer-line"></div>
    <span class="tl-footer-text">故事还在继续…</span>
    <div class="tl-footer-line"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { data } from '../articleData.data.js'

const CN_MONTH = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']

// 按月分组：文章按天聚合，里程碑（postDates.json 里的 milestones）插到对应日期
const months = (() => {
  const map = new Map()

  const push = (date, item) => {
    const [y, m] = date.split('-').map(Number)
    const key = `${y}-${m}`
    if (!map.has(key)) map.set(key, { key, label: `${y} · ${CN_MONTH[m - 1]}月`, items: [] })
    map.get(key).items.push(item)
  }

  for (const day of data.timeline) {
    push(day.date, {
      date: day.date,
      day: day.date.slice(5).replace('-', '.'),
      tags: [...new Set(day.articles.map((a) => a.tag))],
      links: day.articles,
      milestone: false
    })
  }
  for (const ms of data.milestones) {
    push(ms.date, {
      date: ms.date,
      day: ms.date.slice(5).replace('-', '.'),
      tags: ['里程碑'],
      links: [],
      milestone: true,
      text: ms.text
    })
  }

  for (const mo of map.values()) {
    // 同一天既有文章又有里程碑时，里程碑放前面
    mo.items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.milestone ? -1 : 1))
  }
  return [...map.values()]
})()

onMounted(() => {
  const items = document.querySelectorAll('.tl-item')
  if (!items.length) return
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        io.unobserve(entry.target)
      }
    }
  }, { threshold: 0.15 })
  items.forEach(el => io.observe(el))
})
</script>
