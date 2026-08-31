import { defineConfig } from 'vitepress'

// 站点配置：先搭骨架，美化后面再做
export default defineConfig({
  title: '越过山丘·AC',
  description: 'AC是良药，可治愈一切伤痛...',
  lang: 'zh-CN',
  base: '/ac-blog/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/ac-blog/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/ac-blog/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/ac-blog/apple-touch-icon.png' }]
  ],

  themeConfig: {
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
      { text: '随笔', link: '/essays/' },
      {
        text: '关于',
        items: [
          { text: '关于我', link: '/about' },
          { text: '时间线', link: '/about/timeline' }
        ]
      },
      { text: '动态', link: '/updates/' },
      { text: '标签', link: '/tags/' },
      {
        text: 'Chat',
        items: [
          { text: '留言', link: '/chat/' },
          { text: '讨论区', link: '/chat/discussion' }
        ]
      }
    ],

    // 笔记区侧边栏：新增分类/文章时在这里加一项
    sidebar: {
      '/notes/': [
        {
          text: '算法笔记',
          collapsed: false,
          items: [
            { text: '分类首页', link: '/notes/algo/' },
            { text: '模板速查', link: '/notes/algo/模板速查' },
            {
              text: '算法',
              collapsed: false,
              items: [
                { text: '前缀和', link: '/notes/algo/prefix-sum' },
                { text: '差分', link: '/notes/algo/difference' },
                { text: '二分', link: '/notes/algo/binary-search' },
                { text: '贪心算法', link: '/notes/algo/greedy' },
                { text: '高精度算法', link: '/notes/algo/high-precision' },
                { text: 'kmp算法', link: '/notes/algo/kmp' },
                { text: '双指针算法', link: '/notes/algo/双指针算法（解决误区）' },
                { text: '倍增', link: '/notes/algo/倍增' },
                { text: '连通块', link: '/notes/algo/connected-components' },
                { text: '树状数组', link: '/notes/algo/fenwick-tree' },
                { text: '矩阵快速幂', link: '/notes/algo/matrix-fast-pow' },
                { text: '匈牙利算法', link: '/notes/algo/hungarian' },
                { text: '乘法逆元', link: '/notes/algo/乘法逆元' },
                { text: '剪绳子问题', link: '/notes/algo/剪绳子问题' },
                { text: '卡特兰数', link: '/notes/algo/卡特兰数' },
                { text: '巴什博弈', link: '/notes/algo/巴什博弈' },
                { text: '数学规律题', link: '/notes/algo/数学规律题' },
                { text: '格雷码', link: '/notes/algo/格雷码' },
                { text: '约瑟夫环问题', link: '/notes/algo/约瑟夫环问题' },
                { text: '鸽巢原理', link: '/notes/algo/鸽巢原理' }
              ]
            },
            {
              text: 'RMQ',
              collapsed: true,
              items: [
                { text: 'ST表', link: '/notes/algo/RMQ/ST表' },
                { text: '单调栈', link: '/notes/algo/RMQ/单调栈' },
                { text: '单调队列', link: '/notes/algo/RMQ/单调队列' },
                { text: '线段树', link: '/notes/algo/RMQ/线段树' },
                { text: '线段树进阶', link: '/notes/algo/RMQ/线段树进阶' }
              ]
            },
            {
              text: '动态规划',
              collapsed: true,
              items: [
                { text: '动态规划（DP）', link: '/notes/algo/动态规划/动态规划（DP）' },
                { text: '动态规划实例', link: '/notes/algo/动态规划/动态规划实例' },
                { text: '动态规划深度分析', link: '/notes/algo/动态规划/动态规划深度分析' },
                { text: '数位DP', link: '/notes/algo/动态规划/数位DP' },
                { text: '最大连续子序列和问题', link: '/notes/algo/动态规划/最大连续子序列和问题' },
                { text: '最长上升子序列', link: '/notes/algo/动态规划/最长上升子序列' },
                { text: '最长公共子序列', link: '/notes/algo/动态规划/最长公共子序列' },
              ]
            },
            {
              text: '数据结构',
              collapsed: true,
              items: [
                { text: '引言', link: '/notes/algo/数据结构/引言' },
                { text: '并查集', link: '/notes/algo/数据结构/并查集' },
                {
                  text: '图论',
                  collapsed: true,
                  items: [
                    { text: '图论基础', link: '/notes/algo/数据结构/图论/图论基础' },
                    { text: '图的遍历', link: '/notes/algo/数据结构/图论/图的遍历' },
                    { text: '拓扑排序', link: '/notes/algo/数据结构/图论/拓扑排序' },
                    { text: '最短路问题', link: '/notes/algo/数据结构/图论/最短路问题' }
                  ]
                },
                {
                  text: '栈',
                  collapsed: true,
                  items: [
                    { text: '栈', link: '/notes/algo/数据结构/栈/栈' },
                    { text: '例题汇总', link: '/notes/algo/数据结构/栈/例题汇总' }
                  ]
                },
                {
                  text: '树',
                  collapsed: true,
                  items: [
                    { text: '最小生成树', link: '/notes/algo/数据结构/树/最小生成树' }
                  ]
                },
                {
                  text: '队列',
                  collapsed: true,
                  items: [
                    { text: '队列', link: '/notes/algo/数据结构/队列/队列' },
                    { text: '优先队列', link: '/notes/algo/数据结构/队列/优先队列' },
                    { text: '例题集合', link: '/notes/algo/数据结构/队列/例题集合' }
                  ]
                }
              ]
            },
            {
              text: '基础知识',
              collapsed: true,
              items: [
                { text: '1LL的用法', link: '/notes/algo/基础知识/1LL的用法' },
                { text: 'c++头文件', link: '/notes/algo/基础知识/c++头文件' },
                { text: 'format使用', link: '/notes/algo/基础知识/format使用' },
                { text: 'lower_bound,upper_bound函数', link: '/notes/algo/基础知识/lower_bound,upper_bound函数' },
                { text: 'map容器', link: '/notes/algo/基础知识/map容器' },
                { text: 'max_element,min_element函数', link: '/notes/algo/基础知识/max_element,min_element函数' },
                { text: 'setprecision，fixed，setw的使用', link: '/notes/algo/基础知识/setprecision，fixed，setw的使用' },
                { text: 'vector容器中clear的神奇之处', link: '/notes/algo/基础知识/vector容器中clear的神奇之处' },
                { text: '关于gcd和lcm函数', link: '/notes/algo/基础知识/关于gcd和lcm函数' },
                { text: '关于scanf函数读入问题', link: '/notes/algo/基础知识/关于scanf函数读入问题' },
                { text: '卡超时应对技巧', link: '/notes/algo/基础知识/卡超时应对技巧' },
                { text: '复杂度分析', link: '/notes/algo/基础知识/复杂度分析' },
                { text: '字符串相关函数', link: '/notes/algo/基础知识/字符串相关函数' },
                { text: '快速读入', link: '/notes/algo/基础知识/快速读入' },
                { text: '换行操作', link: '/notes/algo/基础知识/换行操作' },
                { text: '算竞常用 C++ STL 用法', link: '/notes/algo/基础知识/算竞常用C++STL用法' }
              ]
            },
            {
              text: '巧妙思路',
              collapsed: true,
              items: [
                { text: 'Atcoder--逆向思维', link: '/notes/algo/巧妙思路/Atcoder--逆向思维' },
                { text: 'Codeforces--分块思想', link: '/notes/algo/巧妙思路/Codeforces--分块思想' },
                { text: 'Codeforces--前缀和思想', link: '/notes/algo/巧妙思路/Codeforces--前缀和思想' },
                { text: '删数问题--洛谷', link: '/notes/algo/巧妙思路/删数问题--洛谷' },
                { text: '并查集--牛客', link: '/notes/algo/巧妙思路/并查集--牛客' },
                { text: '数列找不同--洛谷', link: '/notes/algo/巧妙思路/数列找不同--洛谷' },
                { text: '数矩形--洛谷', link: '/notes/algo/巧妙思路/数矩形--洛谷' },
                { text: '洛谷--求k倍连续区间数量', link: '/notes/algo/巧妙思路/洛谷--求k倍连续区间数量' },
                { text: '牛客--不相邻取数', link: '/notes/algo/巧妙思路/牛客--不相邻取数' },
                { text: '牛客--二阶差分', link: '/notes/algo/巧妙思路/牛客--二阶差分' },
                { text: '牛客--差分思想', link: '/notes/algo/巧妙思路/牛客--差分思想' },
                { text: '牛客--往前匹配法', link: '/notes/algo/巧妙思路/牛客--往前匹配法' },
                { text: '牛客--曼哈顿距离妙想', link: '/notes/algo/巧妙思路/牛客--曼哈顿距离妙想' },
                { text: '跳石头--洛谷', link: '/notes/algo/巧妙思路/跳石头--洛谷' }
              ]
            },
            {
              text: '排序',
              collapsed: true,
              items: [
                { text: '基数排序', link: '/notes/algo/排序/基数排序' },
                { text: '桶排序', link: '/notes/algo/排序/桶排序' },
                { text: '计数排序', link: '/notes/algo/排序/计数排序' }
              ]
            },
            {
              text: '数学',
              collapsed: true,
              items: [
                { text: 'Dilworth定理', link: '/notes/algo/数学/Dilworth定理' },
                { text: '构造函数', link: '/notes/algo/数学/构造函数' }
              ]
            },
            {
              text: '杂项',
              collapsed: true,
              items: [
                { text: '位运算', link: '/notes/algo/杂项/位运算' },
                { text: '二进制集合操作', link: '/notes/algo/杂项/二进制集合操作' },
                { text: '离散化', link: '/notes/algo/杂项/离散化' },
                { text: '双指针经典', link: '/notes/algo/杂项/双指针经典' },
                { text: '素数筛选', link: '/notes/algo/杂项/素数筛选' },
                { text: '记忆化搜索', link: '/notes/algo/杂项/记忆化搜索' },
                { text: '汉诺塔问题', link: '/notes/algo/杂项/汉诺塔问题' },
                { text: '三色旗问题', link: '/notes/algo/杂项/三色旗问题' },
                { text: 'bitset', link: '/notes/algo/杂项/bitset' }
              ]
            },
            {
              text: '经典',
              collapsed: true,
              items: [
                { text: '一元三次方程求解', link: '/notes/algo/经典/一元三次方程求解' },
                { text: '十进制转二进制的通用方法', link: '/notes/algo/经典/十进制转二进制的通用方法' }
              ]
            }
          ]
        },
        {
          text: '比赛补题',
          collapsed: false,
          items: [
            { text: '分类首页', link: '/notes/contest/' },
            {
              text: 'Atcoder',
              collapsed: false,
              items: [
                { text: 'AtCoder Beginner Contest 449', link: '/notes/contest/Atcoder/AtCoder-Beginner-Contest-449' },
                { text: 'AtCoder Beginner Contest 454', link: '/notes/contest/Atcoder/AtCoder-Beginner-Contest-454' },
                { text: 'AtCoder Beginner Contest 465', link: '/notes/contest/Atcoder/AtCoder-Beginner-Contest-465' },
                { text: 'AtCoder Beginner Contest 468', link: '/notes/contest/Atcoder/AtCoder-Beginner-Contest-468' }
              ]
            },
            {
              text: 'Codeforces',
              collapsed: false,
              items: [
                { text: 'Codeforces Round 1082 Div2', link: '/notes/contest/Codeforces/Codeforces-Round-1082-Div2' },
                { text: 'Codeforces Round 1108 (Div. 2)', link: '/notes/contest/Codeforces/Codeforces-Round-1108-Div-2' },
                { text: 'Codeforces Round 1109 (Div. 3)', link: '/notes/contest/Codeforces/Codeforces-Round-1109-Div-3' }
              ]
            },
            {
              text: '寒假集训',
              collapsed: true,
              items: [
                { text: '寒假集训第一场', link: '/notes/contest/寒假集训/寒假集训第一场' },
                { text: '寒假集训第二场', link: '/notes/contest/寒假集训/寒假集训第二场' },
                { text: '寒假集训第三场', link: '/notes/contest/寒假集训/寒假集训第三场' },
                { text: '寒假集训第四场', link: '/notes/contest/寒假集训/寒假集训第四场' },
                { text: '寒假集训第五场', link: '/notes/contest/寒假集训/寒假集训第五场' }
              ]
            },
            {
              text: '比赛',
              collapsed: true,
              items: [
                { text: '蓝桥杯模拟赛补题', link: '/notes/contest/比赛/蓝桥杯模拟赛补题' }
              ]
            }
          ]
        }
      ],
      '/essays/': [
        {
          text: '随笔',
          items: [
            { text: '随笔说明', link: '/essays/' }
          ]
        },
        {
          text: '血泪史',
          items: [
            { text: '注意点合集', link: '/essays/注意点合集' },
            { text: '血泪史一', link: '/essays/血泪史一' },
            { text: '迷宫问题深思', link: '/essays/迷宫问题深思' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/3133q' }
    ],

    // 页脚
    footer: {
      message: 'AC是良药，可治愈一切伤痛...',
      copyright: 'Copyright © 2026 南柯一梦'
    },

    // 右侧页面大纲
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    search: { provider: 'local' }
  },

  // Markdown 扩展：渲染 LaTeX 数学公式（$...$ / $$...$$）
  markdown: {
    math: true
  },

  lastUpdated: true
})
