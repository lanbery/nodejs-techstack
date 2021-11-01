import { combineReducers } from 'redux'

import { connectRouter } from 'connected-react-router'
import skinStateReducer from './skin'
import appStateReducer from './app'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    skinState: skinStateReducer,
    appState: appStateReducer,
  })

export default createRootReducer
