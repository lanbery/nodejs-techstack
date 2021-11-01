import { message } from 'antd'

export const baseToastOptions = {
  content: '',
  className: 'toast',
  duration: 3,
}

export function successToast(content = '', duration = 3) {
  const cfg = {
    ...baseToastOptions,
    content,
    duration,
  }

  return message.success(cfg)
}

export function errorToast(content = '', duration = 8) {
  const cfg = {
    ...baseToastOptions,
    content,
    duration,
  }

  return message.error(cfg)
}

export function infoToast(content = '', duration = 3) {
  const cfg = {
    ...baseToastOptions,
    content,
    duration,
  }

  return message.info(cfg)
}
