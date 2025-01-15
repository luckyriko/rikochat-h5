import { http } from '@/utils/http'

/** GET 请求 */
export const testAPI = () => {
  return http.get('/', {})
}

/** POST 请求 */
export const yaliyaAPI = (name) => {
  return http.post('/deepseek/yaliya', { name }, { name })
}

/** POST 请求 */
export const rikoAPI = (name) => {
  return http.post('/deepseek/riko', { name }, { name })
}

/** POST 请求 */
export const customAPI = (name) => {
  return http.post('/deepseek/custom', { name }, { name })
}

/** POST 请求 */
export const chatAPI = (name) => {
  return http.post('/deepseek/chat', { name }, { name })
}
