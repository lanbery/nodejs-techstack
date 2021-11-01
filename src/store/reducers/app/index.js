import { isMobile, isBrowser } from 'react-device-detect'
import { SET_APP_TITLE } from '~/store/core-action-types'
import { isWxbs } from '~Lib/utils'

export default function reduceApp(state = {}, { type, val }) {
  const appState = {
    appName: '',
    isMobile: isMobile || false,
    isBrowser,
    isWxCli: isWxbs(),
    ...state,
  }

  switch (type) {
    case SET_APP_TITLE: {
      appState.appName = val
      return appState
    }
    default:
      return appState
  }
}
