import { post, get } from '../utils/request'
export function login(data) {
  return post({
    url: '/auth/login/noValidation',
    data
  })
}