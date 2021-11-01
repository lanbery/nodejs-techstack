import { SET_APP_TITLE } from '../core-action-types'

export const setAppTitle = (title) => {
  return {
    type: SET_APP_TITLE,
    val: title,
  }
}
