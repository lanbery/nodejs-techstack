import { useHistory, Redirect } from 'react-router-dom'

import { ROOT_PATH, HOME_INDEX_ROOT } from './routes-cnsts'

export { default } from './routes-comp'

export function goHome(history, location) {
  if (!history || !history.push) return
  if (!location || location.pathname !== HOME_INDEX_ROOT) {
    history.push(HOME_INDEX_ROOT)
  }
}

export const RouteFallRedirectRoot = (props = {}) => {
  const history = useHistory()
  let { location } = props
  if (!location && history.location) location = history.location

  return <Redirect to={{ pathname: ROOT_PATH, from: location }} />
}
