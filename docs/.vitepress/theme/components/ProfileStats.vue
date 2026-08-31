<template>
  <div class="profile-stats">
    <div class="stat">
      <span class="stat-num">{{ data.stats.groups }}</span>
      <span class="stat-label">分类</span>
    </div>
    <div class="stat">
      <span class="stat-num">{{ data.stats.articles }}</span>
      <span class="stat-label">文章</span>
    </div>
    <div class="stat">
      <span class="stat-num">{{ data.stats.days }}</span>
      <span class="stat-label">更新天数</span>
    </div>
  </div>
</template>

<script setup>
import { data } from '../articleData.data.js'
</script>
