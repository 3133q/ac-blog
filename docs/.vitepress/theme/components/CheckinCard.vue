<template>
  <div class="checkin-card">
    <div v-if="ready" class="ck-body">
      <p class="ck-welcome">欢迎回来，<b>{{ nick }}</b></p>

      <!-- 日期块：月份竖排 + 大数字 + 星期 -->
      <div class="ck-date">
        <span class="ck-month">{{ month }}月</span>
        <span class="ck-day">{{ day }}</span>
        <span class="ck-week">{{ week }}</span>
      </div>

      <button v-if="!checkedToday" class="ck-btn" @click="checkin">点击打卡</button>

      <!-- 打卡后：今日运势（同一天同一账号结果固定） -->
      <div v-else class="ck-fortune">
        <p class="ck-fortune-title">{{ nick }} 的运势</p>
        <p class="ck-level" :class="fortune.tone">§ {{ fortune.level }} §</p>
        <div class="ck-yiji">
          <div class="ck-col">
            <div v-for="g in fortune.good" :key="g.t" class="ck-item">
              <b class="ck-good">宜：{{ g.t }}</b>
              <span>{{ g.d }}</span>
            </div>
          </div>
          <div class="ck-col">
            <div v-for="b in fortune.bad" :key="b.t" class="ck-item">
              <b class="ck-bad">忌：{{ b.t }}</b>
              <span>{{ b.d }}</span>
            </div>
          </div>
        </div>
        <p class="ck-streak">你已经连续打卡了 {{ streak }} 天</p>
      </div>

      <!-- 答案之书：每次点击随机一句 -->
      <div class="ck-book">
        <button class="ck-book-btn" @click="drawAnswer">📖 答案之书</button>
        <p v-if="answer" :key="answer" class="ck-answer">{{ answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const SERVER = 'https://my-blog-7men.vercel.app'
const USER_KEY = 'WALINE_USER'
const CHECKIN_KEY = 'CHECKIN_DATA'

const ready = ref(false)
const user = ref({})
const record = ref({ last: '', streak: 0 })
const answer = ref('')

const nick = computed(() => user.value.display_name || '朋友')
const today = new Date()
const todayStr = fmtDate(today)

const month = today.getMonth() + 1
const day = today.getDate()
const week = '星期' + '日一二三四五六'[today.getDay()]

const checkedToday = computed(() => record.value.last === todayStr)
const streak = computed(() => record.value.streak)

// 运势由「账号 + 日期」播种生成：同一天结果固定，换一天重新随机
const fortune = computed(() =>
  genFortune(`${user.value.email || 'guest'}|${todayStr}`)
)

onMounted(async () => {
  try {
    user.value = JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  } catch {
    user.value = {}
  }
  record.value = loadLocal()

  // 已登录则拉取云端的打卡记录（存在资料 label 里），取较新的一份
  if (user.value.token) {
    try {
      const resp = await fetch(`${SERVER}/api/token`, {
        headers: { Authorization: `Bearer ${user.value.token}` }
      })
      const res = await resp.json()
      if (res.errno === 0 && res.data) {
        let label = {}
        try { label = JSON.parse(res.data.label || '{}') } catch { label = {} }
        const cloud = label.checkin
        if (cloud && cloud.last > record.value.last) {
          record.value = { last: cloud.last, streak: cloud.streak }
          saveLocal(record.value)
        }
      }
    } catch {
      // 拉取失败用本地记录，不影响打卡
    }
  }
  ready.value = true
})

function fmtDate(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function loadLocal() {
  try {
    const r = JSON.parse(localStorage.getItem(CHECKIN_KEY) || '{}')
    if (r && typeof r.last === 'string' && typeof r.streak === 'number') return r
  } catch { /* 数据损坏则重置 */ }
  return { last: '', streak: 0 }
}

function saveLocal(r) {
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(r))
}

async function checkin() {
  const yesterday = fmtDate(new Date(today.getTime() - 86400000))
  const streak = record.value.last === yesterday ? record.value.streak + 1 : 1
  record.value = { last: todayStr, streak }
  saveLocal(record.value)
  syncCloud(record.value)
}

// 把打卡记录合并进云端资料的 label 字段（与生日/爱好共存，不覆盖它们）
async function syncCloud(r) {
  if (!user.value.token) return
  try {
    const resp = await fetch(`${SERVER}/api/token`, {
      headers: { Authorization: `Bearer ${user.value.token}` }
    })
    const res = await resp.json()
    if (res.errno !== 0 || !res.data) return

    let label = {}
    try { label = JSON.parse(res.data.label || '{}') } catch { label = {} }
    label.checkin = { last: r.last, streak: r.streak }

    await fetch(`${SERVER}/api/user?lang=zh-cn`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.value.token}`
      },
      body: JSON.stringify({ label: JSON.stringify(label) })
    })
  } catch {
    // 同步失败没关系，本地已记录
  }
}

// ===== 运势生成 =====
const LEVELS = [
  { name: '大吉', w: 16, tone: 'great' },
  { name: '中吉', w: 24, tone: 'good' },
  { name: '小吉', w: 26, tone: 'good' },
  { name: '吉', w: 20, tone: 'good' },
  { name: '末吉', w: 10, tone: 'ok' },
  { name: '小凶', w: 4, tone: 'bad' }
]

const GOOD = [
  { t: '刷题', d: '说不定一遍就 AC' },
  { t: '补题', d: '昨天的坑今天填' },
  { t: '写博客', d: '好记性不如烂笔头' },
  { t: '打比赛', d: 'rating 涨涨涨' },
  { t: '看题解', d: '豁然开朗的感觉' },
  { t: '默写模板', d: '肌肉记忆又强了' },
  { t: '贴贴', d: '说不定擦出火花' },
  { t: '熬夜', d: '事情终究可以完成的' },
  { t: '摸鱼', d: '劳逸结合效率高' },
  { t: '喝奶茶', d: '快乐水是第一生产力' },
  { t: '复习数学', d: '数论组合全拿下' },
  { t: '早睡', d: '明天状态拉满' }
]

const BAD = [
  { t: '水讨论区', d: '和其他人激情对线' },
  { t: '去食堂', d: '爱吃的菜刚被打完' },
  { t: '抄代码', d: '抄来的总会还回去' },
  { t: '面向样例编程', d: '样例过了不代表能对' },
  { t: '改 bug', d: '越改越多' },
  { t: '点开视频', d: '再看一集就学习' },
  { t: '压哨提交', d: '评测机排队中' },
  { t: '不看数据范围', d: 'long long 救不了你' },
  { t: '挑战难题', d: '今天宜量力而行' },
  { t: '立 flag', d: '倒了会很尴尬' }
]

// 答案之书
const ANSWERS = [
  '你走的每一步都算数。',
  '别急，答案会在合适的时候出现。',
  '今天也要好好吃饭，好好睡觉。',
  ' WA 只是暂时的，AC 才是归宿。',
  '山高路远，看世界，也找自己。',
  '你已经比昨天的自己更厉害了。',
  '允许一切发生，然后继续向前。',
  '越过山丘，会有人等候。',
  '代码写不下去的时候，就去吹吹风。',
  '所有的努力，都在悄悄扎根。',
  '别怕，慢慢来，谁都是这么过来的。',
  '你只管努力，剩下的交给时间。',
  '生活明朗，万物可爱。',
  '今天的好运，正在派送中。',
  '坚持下去，花开会有时。',
  '愿你被这个世界温柔以待。'
]

// FNV-1a + xmur3 风格的确定性伪随机数
function seedRandom(seed) {
  let h = 2166136261
  for (const c of seed) {
    h ^= c.codePointAt(0)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

function genFortune(seed) {
  const rnd = seedRandom(seed)

  const total = LEVELS.reduce((s, l) => s + l.w, 0)
  let x = rnd() * total
  let level = LEVELS[0]
  for (const l of LEVELS) {
    x -= l.w
    if (x < 0) { level = l; break }
  }

  const pick2 = (arr) => {
    const pool = [...arr]
    const out = []
    for (let i = 0; i < 2; i++) {
      out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0])
    }
    return out
  }

  return { level: level.name, tone: level.tone, good: pick2(GOOD), bad: pick2(BAD) }
}

function drawAnswer() {
  let next = answer.value
  while (next === answer.value) {
    next = ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
  }
  answer.value = next
}
</script>

<style scoped>
.checkin-card {
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 20px 18px;
  margin-top: 16px;
  text-align: center;
  min-height: 120px;
}

.ck-welcome {
  font-size: 15px;
  color: var(--vp-c-text-1);
  margin: 0;
}

.ck-welcome b {
  color: var(--vp-c-brand-1);
}

/* ===== 日期块 ===== */
.ck-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 12px 0 16px;
}

.ck-month {
  writing-mode: vertical-lr;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.1em;
}

.ck-day {
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-brand-1);
  font-family: var(--font-serif);
}

.ck-week {
  writing-mode: vertical-lr;
  font-size: 14px;
  color: var(--vp-c-text-2);
  letter-spacing: 0.1em;
}

/* ===== 打卡按钮 ===== */
.ck-btn {
  padding: 10px 34px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f6a545, #ef7d1a);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ck-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 125, 26, 0.35);
}

/* ===== 运势 ===== */
.ck-fortune-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 4px 0 2px;
}

.ck-level {
  font-size: 40px;
  font-weight: 700;
  margin: 4px 0 12px;
  font-family: var(--font-serif);
  letter-spacing: 0.05em;
}

.ck-level.great,
.ck-level.good {
  color: #e2574c;
}

.ck-level.ok {
  color: #e08e3c;
}

.ck-level.bad {
  color: #555;
}

.ck-yiji {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  text-align: left;
}

.ck-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.ck-item b {
  font-size: 14px;
}

.ck-item .ck-good {
  color: #e2574c;
}

.ck-item .ck-bad {
  color: var(--vp-c-text-1);
}

.ck-item span {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.ck-streak {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* ===== 答案之书 ===== */
.ck-book {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--vp-c-divider);
}

.ck-book-btn {
  padding: 8px 20px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.ck-book-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.ck-answer {
  margin: 12px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
  font-family: var(--font-serif);
  animation: ck-fade 0.4s ease both;
}

@keyframes ck-fade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
