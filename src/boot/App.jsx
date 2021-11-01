import React, { PureComponent } from 'react'

import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { createBrowserHistory, createHashHistory } from 'history'

import configurationStore, { initialState } from '../store'

import Routes from '../router'

const isDevMode = process.env.NODE_ENV === 'development'

export const history = isDevMode ? createHashHistory() : createBrowserHistory()
const store = configurationStore(initialState, history)

class BootApp extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        {isDevMode ? (
          <HashRouter history={history} hashType='slash'>
            <Routes />
          </HashRouter>
        ) : (
          <BrowserRouter history={history}>
            <Routes />
          </BrowserRouter>
        )}
      </Provider>
    )
  }
}

export default BootApp
