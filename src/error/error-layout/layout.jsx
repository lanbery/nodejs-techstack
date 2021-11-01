/**
 * 21-10-21 22:22 Thursday
 * This file used define the module error/error-layout functions.
 */

import React from 'react'

import { Switch, Route } from 'react-router-dom'

import { useHistory } from 'react-router-dom'

import { UnfoundPage } from '../unfound-404'

import comboRoutes, {
  ERROR_PAGE_ROOT,
  ERROR_404_NESTED,
} from '~Router/routes-cnsts'

export default function Layout(props) {
  let history = useHistory()

  return (
    <div className='error-layout'>
      <Switch>
        <Route
          path={comboRoutes(ERROR_PAGE_ROOT, ERROR_404_NESTED)}
          component={UnfoundPage}
        />
        <Route component={UnfoundPage} />
      </Switch>
    </div>
  )
}
