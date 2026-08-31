---
layout: page
sidebar: false
aside: false
---

<script setup>
import PostTimeline from '../.vitepress/theme/components/PostTimeline.vue'
import ProfileStats from '../.vitepress/theme/components/ProfileStats.vue'
</script>

<div class="notes-landing">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>

  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>
  <span class="particle"></span>

  <h1 class="notes-title">笔记</h1>
  <p class="notes-subtitle">把学过的东西，一类一类放好</p>

  <div class="notes-cards">
    <a class="notes-card" href="/notes/algo/">
      <span class="notes-card-icon">📐</span>
      <span class="notes-card-title">算法笔记</span>
      <span class="notes-card-desc">知识点与题解记录</span>
      <span class="notes-card-arrow">→</span>
    </a>
    <a class="notes-card" href="/notes/contest/">
      <span class="notes-card-icon">🏆</span>
      <span class="notes-card-title">比赛补题</span>
      <span class="notes-card-desc">赛后复盘，把题吃透</span>
      <span class="notes-card-arrow">→</span>
    </a>
  </div>
</div>

<div class="notes-body">
  <main class="notes-main">
    <h2 class="section-title">最近更新</h2>
    <PostTimeline />
  </main>
  <aside class="notes-side">
    <div class="profile-card">
      <img class="profile-avatar" src="/images/avatar.jpg" alt="S3133 的头像" />
      <div class="profile-name">S3133</div>
      <div class="profile-bio">南柯一梦，一个在代码与生活之间游荡的人。</div>
      <ProfileStats />
    </div>
  </aside>
</div>
