<template>
  <div class="timeline">
    <div v-for="day in days" :key="day.date" class="timeline-day">
      <div class="timeline-date">{{ day.date.replaceAll('-', '.') }}</div>
      <a v-for="a in day.articles" :key="a.url" class="timeline-item" :href="a.url">{{ a.title }}</a>
    </div>
    <a v-if="moreLink" class="timeline-more" href="/about/timeline">查看完整时间线 →</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { data } from '../articleData.data.js'

// limit: 只显示最近 N 天，0 = 全部；moreLink: 显示"查看完整时间线"链接
const props = defineProps({
  limit: { type: Number, default: 0 },
  moreLink: { type: Boolean, default: false }
})

const days = computed(() =>
  props.limit > 0 ? data.timeline.slice(0, props.limit) : data.timeline
)
</script>
