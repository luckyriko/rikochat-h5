/* eslint-disable no-param-reassign */
import { useUserStore } from '@/store'
import { platform } from '@/utils/platform'
import { getEnvBaseUrl } from '@/utils'

// 请求基准地址
const baseUrl = getEnvBaseUrl()

export default (options) => {
  return new Promise((resolve, reject) => {
    options.header = {
      platform,
      'Content-Type': 'application/json',
    }
    const userStore = useUserStore()
    const { token } = userStore.userInfo
    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }

    uni.request({
      ...options,
      url: baseUrl + options.url,
      success: (res) => resolve(res.data),
      fail: (err) => reject(err),
    })
  })
}
