<template>
  <div class="grid-container">
    <!-- 循环渲染格子 -->
    <div v-for="(item, index) in items" :key="index" class="grid-item" @click="goChat(item)">
      <h2 class="grid-title">{{ item.title }}</h2>
      <image :src="item.image" :alt="item.title" class="grid-image" mode="aspectFill" />
    </div>
  </div>

  <wd-popup v-model="show" custom-style="border-radius:32rpx;" @close="handleClose">
    <wd-form ref="form" :model="model" class="custom-txt">
      <wd-cell-group border>
        <wd-input
          label="动漫名/片名"
          label-width="100px"
          prop="value1"
          clearable
          v-model="model.value1"
          placeholder="请填写出自哪里"
          :rules="[{ required: true, message: '必填' }]"
        />
        <wd-input
          label="角色名称"
          label-width="100px"
          prop="value2"
          clearable
          v-model="model.value2"
          placeholder="请填写AI要扮演的角色"
          :rules="[{ required: true, message: '必填' }]"
        />
        <wd-input
          label="人物性格"
          label-width="100px"
          prop="value3"
          clearable
          v-model="model.value2"
          placeholder="可不填"
        />
      </wd-cell-group>
      <view class="footer flex flex-row">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
        <wd-button type="error" size="large" @click="handleSubmit" block>取消</wd-button>
      </view>
    </wd-form>
  </wd-popup>
  <wd-toast></wd-toast>
</template>

<script setup>
import { ref, reactive } from 'vue'

const show = ref(false)

const goChat = (item) => {
  if (!item.title) {
    return
  }
  if (item.flag) {
    show.value = true
  } else {
    if (!item.name) {
      uni.showToast({
        title: '暂不支持',
        icon: 'none', // 不显示图标
        duration: 1500,
      })
      return
    }
    uni.navigateTo({
      url: '/pages/chat/index?name=' + item.name, // 目标页面路径
    })
  }
}

const handleClose = () => {
  show.value = false
}
// 定义数组，包含标题和图片
const items = [
  { title: '亚里亚', name: 'yaliya', image: '/static/images/yaliya.jpg' },
  { title: '峰·理子·罗宾', name: 'riko', image: '/static/images/riko.jpg' },
  { title: '自定义', name: '', image: '/static/images/custom.jpeg', flag: 1 },
  { title: '聊天', name: 'chat', image: '' },
  { title: '', image: '' },
  { title: '', image: '' },
]

// const { success } = useToast()

const model = reactive({
  value1: '',
  value2: '',
  value3: '',
})

const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        console.log(111)
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<style scoped>
.footer {
  padding: 12px;
}

.custom-txt {
  width: 600rpx;
  max-height: 600rpx;
  margin-top: 20rpx;
  font-size: 40rpx;
  color: black;
  border-radius: 32rpx;
}
/* 页面容器 */
.grid-container {
  display: grid;
  /* grid-template-columns:  repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr); */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* 自适应列数 */
  gap: 16px; /* 格子间距 */
  height: 100vh;
  padding: 16px;
  background: linear-gradient(to bottom, #fff7e6, #ffd699); /* 白黄色渐变 */
}
/* 格子样式 */
.grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* 光影效果 */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
/* 鼠标悬停效果 */
.grid-item:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transform: scale(1.05);
}
/* 标题样式 */
.grid-title {
  margin-bottom: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); /* 文字阴影 */
}
/* 图片样式 */
.grid-image {
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
}
</style>
