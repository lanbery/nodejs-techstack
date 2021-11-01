import React, { Component } from 'react'

import { Switch, Route } from 'react-router-dom'

import {
  HOME_INDEX_ROOT,
  ERROR_404_NESTED,
  RESUME_PAGE_NESTED,
} from '~Router/routes-cnsts'

import HeadComponent from '~/head/home-head'

import MindPage from '~Views/index-mind'

import { UnfoundPage } from '~/error/unfound-404'

export default class LayoutComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // a: 1,
    }
  }

  componentDidMount() {
    // there regist something handle.
  }

  componentWillUnmount() {
    // there unregist something handle.
  }

  render() {
    // const { xxx } = this.props

    return (
      <div className='home-layout'>
        <HeadComponent />
        <Switch>
          <Route path={HOME_INDEX_ROOT} component={MindPage} exact />
          <Route path={RESUME_PAGE_NESTED} component={MindPage} exact />
          <Route path={ERROR_404_NESTED} component={UnfoundPage} />
        </Switch>
      </div>
    )
  }
}
