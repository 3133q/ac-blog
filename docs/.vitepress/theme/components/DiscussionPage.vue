<template>
  <div class="ds-page">
    <!-- 顶部：喜欢我的博客（爱心 + 祝福语） -->
    <LikeBlogPage />

    <!-- 下方：读者互相讨论 -->
    <div class="ds-comments">
      <h2 class="ds-title">讨论区</h2>
      <p class="ds-sub">读者朋友们在这里互相交流、互相帮助</p>
      <div id="discussion-waline" class="ds-waline"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import LikeBlogPage from './LikeBlogPage.vue'

const WALINE_SERVER_URL = 'https://my-blog-7men.vercel.app'

onMounted(async () => {
  if (WALINE_SERVER_URL.includes('YOUR_WALINE_SERVER')) return

  const [{ init }] = await Promise.all([
    import('@waline/client'),
    import('@waline/client/style')
  ])

  init({
    el: '#discussion-waline',
    serverURL: WALINE_SERVER_URL,
    lang: 'zh-CN',
    path: '/chat/discussion',
    dark: 'html.dark',
    login: 'force',
    commentSorting: 'latest',
    pageSize: 10,
    pageview: true,
    reaction: false
  })
})
</script>

<style scoped>
.ds-comments {
  max-width: 720px;
  margin: 32px auto 0;
  padding: 0 24px 64px;
}

.ds-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
  padding-left: 12px;
  border-left: 4px solid var(--vp-c-brand-1);
}

.ds-sub {
  margin: 0 0 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  padding-left: 12px;
}

.ds-waline {
  --waline-theme-color: var(--vp-c-brand-1);
  --waline-active-color: var(--vp-c-brand-2);
}
</style>
