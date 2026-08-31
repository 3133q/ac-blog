---
layout: home

hero:
  name: 越过山丘·AC
  tagline: AC是良药，可治愈一切伤痛...
  actions:
    - theme: brand
      text: 进入笔记
      link: /notes/
    - theme: alt
      text: 关于
      link: /about

features:
  - icon: 🌱
    title: 学习笔记
    details: 把学到的东西写下来，好记性不如烂笔头。
    link: /notes/
    linkText: 进入笔记
  - icon: 🍵
    title: 生活随笔
    details: 记录日常里细碎的想法和片刻的心情。
    link: /essays/
    linkText: 去看看
  - icon: 🧭
    title: 关于我
    details: 南柯一梦，一个在代码与生活之间游荡的人。
    link: /about
    linkText: 了解更多
---

<script setup>
import CheckinCard from './.vitepress/theme/components/CheckinCard.vue'
import PostTimeline from './.vitepress/theme/components/PostTimeline.vue'
import ProfileStats from './.vitepress/theme/components/ProfileStats.vue'
</script>

<div class="site-author">
  <span class="author-avatar">梦</span>
  <span class="author-name">南柯一梦 · 执笔于此</span>
</div>

<div class="home-scene">
<div class="notes-body">
  <main class="notes-main">
    <h2 class="section-title">文章时间线</h2>
    <PostTimeline :limit="7" more-link />
  </main>
  <aside class="notes-side">
    <div class="profile-card">
      <img class="profile-avatar" src="/images/avatar.jpg" alt="S3133 的头像" />
      <div class="profile-name">S3133</div>
      <div class="profile-bio">一个在代码与生活之间游荡的人——把学过的东西写下来，把写下的东西分享出去。</div>
      <ProfileStats />
    </div>
    <CheckinCard />
  </aside>
</div>
</div>
