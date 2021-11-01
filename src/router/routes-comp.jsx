import React, { PureComponent } from 'react'

import { Switch, Route, Redirect } from 'react-router-dom'

import { ROOT_PATH, HOME_INDEX_ROOT, ERROR_PAGE_ROOT } from './routes-cnsts'

import HomeLayout from '~/layouts/home-layout'

import { ErrorLayout } from '~/error/error-layout'

export default class RoutesComp extends PureComponent {
  render() {
    return (
      <Switch>
        <Route
          path={ROOT_PATH}
          exact
          render={() => <Redirect to={HOME_INDEX_ROOT} />}
        ></Route>

        {/* <Route path={HOME_INDEX_ROOT} component={HomeLayout} /> */}
        <Route path={ROOT_PATH} component={HomeLayout} />
        {/* <Route path={HOME_SCAN_ROOT} exact component={ScanPage} /> */}

        {<Route path={ERROR_PAGE_ROOT} children={ErrorLayout}></Route>}

        <Route component={ErrorLayout} />

        {/* <Redirect to={ROOT_PATH} /> */}
      </Switch>
    )
  }
}
