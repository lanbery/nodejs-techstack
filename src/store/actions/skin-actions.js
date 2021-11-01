import { SET_PAGE_HEADER_TITLE } from '../core-action-types'

export const setPageTitle = (title) => {
  return {
    type: SET_PAGE_HEADER_TITLE,
    val: title,
  }
}
