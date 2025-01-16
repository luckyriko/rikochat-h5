<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>

<template>
  <div class="bg flex flex-col items-center h-screen p-5 overflow-hidden relative">
    <!-- 黑夜背景 -->
    <div class="absolute inset-0 bg-black overflow-hidden">
      <!-- 星光效果 -->
      <div v-for="i in 30" :key="i" class="star" :style="starStyle(i)"></div>
    </div>

    <!-- 内容 -->
    <div class="relative z-10">
      <!-- 大标题 -->
      <h1 class="flex flex-row justify-center text-4xl font-bold text-white mb-5 animate-bounce">
        RikoChat
      </h1>
      <h1 class="flex flex-row justify-center text-6xl font-bold text-white mb-5 animate-bounce">
        角色对话
      </h1>
      <!-- 华丽图片 -->
      <image
        class="max-w-full rounded-2xl shadow-lg mt-10"
        src="/static/images/logo.gif"
        alt="meow~"
        mode="aspectFill"
      />

      <!-- 蓝色按钮 -->
      <button
        @click="goFirst"
        class="w-50 mt-10 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
      >
        开始探索
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import PLATFORM from '@/utils/platform'

defineOptions({
  name: 'Hello',
})
const goFirst = () => {
  uni.navigateTo({
    url: '/pages/first/index', // 目标页面路径
  })
}
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const author = ref('菲鸽')
const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)
// 测试 uni API 自动引入
onLoad(() => {
  console.log(author)
  console.log(TestEnum.A)
})
// 生成星星的随机样式
const starStyle = (i) => {
  const size = Math.random() * 3 + 2 // 星星大小（2px 到 5px）
  const left = Math.random() * 100 // 水平位置（0% 到 100%）
  const duration = Math.random() * 5 + 5 // 动画时长（5s 到 10s）
  const delay = Math.random() * -10 // 动画延迟（0s 到 -10s）

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }
}
</script>

<style scoped>
/* 隐藏滚动条 */
body {
  overflow: hidden;
}
/* 黑夜背景 */
.bg-black {
  background: black;
}

.bg {
  box-sizing: border-box;
  padding-top: 200rpx;
}
/* 星光效果 */
.star {
  position: absolute;
  top: -10px;
  background: white;
  border-radius: 50%;
  box-shadow:
    0 0 5px white,
    0 0 10px white;
  animation: fall linear infinite;
}
/* 星光落下动画 */
@keyframes fall {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>
