import ReactGA from 'react-ga'
import api from '../config/keys'

const DEV = process.env.NODE_ENV !== 'production'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export const initGA = () => {
  if (!DEV) {
    ReactGA.initialize(api.google.analytics.TRACKING_ID, {
      // Re-enable for additional logging
      // debug: DEV
    })
  }
}

export const logPageView = (
  pageName = window.location.pathname + window.location.search
) => {
  if (!DEV) {
    ReactGA.set({ page: pageName })
    ReactGA.pageview(pageName)
  }
}
