export const ROOT_PATH = '/'

export const HOME_INDEX_ROOT = '/index'

export const ERROR_PAGE_ROOT = '/err'
export const ERROR_404_NESTED = '/404'

// view page
export const RESUME_PAGE_NESTED = '/resume'

export const comboRoutes = (...routes) => {
  routes = routes
    .map((r) => {
      if (r.endsWith('/')) {
        return r.slice(0, r.length - 1)
      } else {
        return r
      }
    })
    .map((r, idx) => (!r.startsWith('/') && idx ? `/${r}` : r))
  return routes.join('')
}

export default comboRoutes
