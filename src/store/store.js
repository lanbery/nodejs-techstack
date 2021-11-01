import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import createRootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const loggerMiddleware = createLogger({ collapsed: true })

export default function configurationStore(preloadedState, history) {
  const middlewares = [thunkMiddleware, loggerMiddleware]

  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(...enhancers)
  )

  return store
}
