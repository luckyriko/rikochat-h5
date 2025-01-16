<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'chat',
  },
}
</route>

<template>
  <view class="chat-container">
    <!-- 顶部导航栏 -->
    <view class="chat-header">
      <view class="back-icon" @click="goBack">返回</view>
      <text class="chat-title">{{ chatTargetName }}</text>
    </view>

    <!-- 聊天区域 -->
    <scroll-view
      class="chat-messages"
      :scroll-y="true"
      :show-scrollbar="false"
      scroll-with-animation
      :scroll-into-view="scrollItem"
      @scrolltoupper="topMessageShow"
    >
      <!-- 樱花背景 -->
      <view
        v-for="(style, index) in sakuraStyles"
        :key="index"
        class="sakura"
        :style="style"
      ></view>

      <view
        v-for="(message, index) in messages"
        :key="index"
        class="message-item"
        :class="message.sender"
        :id="`item-${index}`"
      >
        <!-- 对方消息 -->
        <view v-if="message.sender === 'other'" class="message-other">
          <text class="message-nickname">{{ message.nickname }}</text>
          <view class="message-content-other">
            <text>{{ message.content }}</text>
          </view>
          <text class="message-time">{{ message.time }}</text>
        </view>

        <!-- 自己消息 -->
        <view v-else class="message-self">
          <text class="message-nickname">{{ message.nickname }}</text>
          <view class="message-content-self">
            <text>{{ message.content }}</text>
          </view>
          <text class="message-time">{{ message.time }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入框 -->
    <view class="chat-input-container">
      <input
        class="chat-input"
        v-model="inputMessage"
        placeholder="请输入消息"
        @confirm="sendMessage"
      />
      <wd-button @click="sendMessage" class="send-button" size="small">发送</wd-button>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import throttle from 'lodash/throttle'
import { ref, onMounted, nextTick } from 'vue'
import http from '@/utils/rikohttp'

const apiName = ref('')
const customData = reactive({
  from: '',
  name: '',
  detail: '',
})

onLoad((options) => {
  // console.log('接收到的参数:', options)
  apiName.value = options.api
  customData.from = options.from
  customData.name = options.name
  customData.detail = options.detail

  fetchData(options)
})

// 触顶加载更多
const topMessageShow = () => {
  console.log('触顶加载更多！')
}

const fetchData = async (params) => {
  uni.showLoading({
    title: '加载中...', // 提示内容
    mask: true, // 是否显示透明蒙层（防止触摸穿透）
  })

  try {
    const data = { content: params.content || '' }
    if (apiName.value === 'custom') {
      data.from = customData.from
      data.name = customData.name
      data.detail = customData.detail
    }
    const result = await http({
      url: '/deepseek/' + apiName.value,
      method: 'POST',
      data,
    })
    // 成功消息
    messages.value.push({
      sender: 'other',
      nickname: 'TA',
      content: result.reply,
      time: new Date().toLocaleTimeString().slice(0, 5), // 获取当前时间（HH:MM）
    })
  } catch (error) {
    // 失败弹窗提示
    uni.showToast({
      title: error.errMsg || '请求超时',
      icon: 'none', // 不显示图标
      duration: 1500,
    })
    // 失败消息
    messages.value.push({
      sender: 'other',
      nickname: 'TA',
      content: '请求超时/失败，请重试',
      time: new Date().toLocaleTimeString().slice(0, 5), // 获取当前时间（HH:MM）
    })
    console.error('请求失败:', error)
  } finally {
    uni.hideLoading()
  }
}

// 定义樱花的样式数据
const sakuraStyles = ref([])

onMounted(() => {
  randomSakura()
})
function randomSakura() {
  const styles = []
  for (let i = 0; i < 5; i++) {
    styles.push({
      top: Math.random() * 90 + 5 + '%',
      left: Math.random() * 90 + 5 + '%',
      animationDuration: Math.random() * 6 + 4 + 's',
      animationDirection: Math.random() < 0.5 ? 'normal' : 'reverse',
    })
  }
  sakuraStyles.value = styles
}
const goBack = () => {
  // 如果使用 Vue Router
  uni.navigateBack()
  // 如果使用 uniapp 的导航
  // uni.navigateBack();
}

// 聊天对象名称
const chatTargetName = ref('聊天对象')

// 输入框内容
const inputMessage = ref('')
const scrollViewHeight = ref(0) // scroll-view 的高度
const initScrollViewHeight = () => {
  const systemInfo = uni.getSystemInfoSync()
  scrollViewHeight.value = systemInfo.windowHeight - 100 // 根据实际情况调整
}

// 初始化
initScrollViewHeight()

const scrollItem = ref('')
// 聊天记录
const messages = ref([
  // {
  //   sender: 'other',
  //   nickname: 'TA',
  //   content: '你好！这是一条测试消息。',
  //   time: '10:00',
  // },
  // {
  //   sender: 'self',
  //   nickname: '我',
  //   content: '你好！这是我的回复。',
  //   time: '10:01',
  // },
])

// 滚动位置
const scrollTop = ref(0)

// 发送消息
const sendMessage = () => {
  if (inputMessage.value.trim() === '') return

  fetchData({ content: inputMessage.value })
  // 添加新消息
  messages.value.push({
    sender: 'self',
    nickname: '我',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString().slice(0, 5), // 获取当前时间（HH:MM）
  })

  // 清空输入框
  inputMessage.value = ''
}

// 动态更新item的值
watch(
  messages,
  (newval, oldval) => {
    // console.log('----newval----', newval.length)
    // 重新赋值item,延迟到dom更新之后进行，否则没效果
    nextTick(() => {
      scrollItem.value = 'item-' + (newval.length - 1)
      // console.log('----scrollItem----', scrollItem.value)
    })
  },
  {
    deep: true, // 深度监视
    immediate: true, // 初始化立即执行
  },
)
</script>

<style scoped>
/* 页面容器 */
.chat-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f1e5; /* 米黄色背景 */
}
/* 顶部导航栏 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6vh;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.back-icon {
  position: absolute;
  left: 20rpx;
  margin-right: 16px; /* 调整图标与标题的距离 */
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
/* 聊天区域 */
.chat-messages {
  position: relative;
  box-sizing: border-box;
  height: 85vh;
  padding: 10rpx 16rpx;
  overflow-y: auto;
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/* 樱花样式 */
.sakura {
  position: absolute;
  z-index: 1;
  width: 40px;
  height: 40px;
  overflow: hidden;
  background: none;
  border-radius: 50%;
  -webkit-animation: rotate 5s linear infinite;
  animation: rotate 5s linear infinite; /* 添加动画 */
}

.sakura::before {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 24px;
  color: #ff7575;
  content: '🌸';
  transform: translate(-50%, -50%);
}
/* 消息项 */
.message-item {
  position: relative;
  z-index: 222; /* 确保消息在樱花之上 */
  margin-bottom: 16px;
}
/* 对方消息 */
.message-other {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 15rpx; /* 增加左边距 */
}

.message-content-other {
  max-width: 70%;
  padding: 8px 12px;
  margin-top: 4px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}
/* 自己消息 */
.message-self {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 15rpx; /* 增加右边距 */
}

.message-content-self {
  max-width: 70%;
  padding: 8px 12px;
  margin-top: 4px;
  color: #fff; /* 白色文字 */
  background-color: #007aff; /* 蓝色背景 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}
/* 消息昵称和姓名 */
.message-nickname {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
/* 消息时间 */
.message-time {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}
/* 底部输入框 */
.chat-input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 9vh;

  padding: 0px 16px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  flex: 1;
  padding: 8px;
  margin-right: 8px;
  background-color: #f8f1e5; /* 米黄色背景 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.send-button {
  width: 120rpx;
}
</style>
