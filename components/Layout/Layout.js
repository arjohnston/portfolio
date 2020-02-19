import React from 'react'
import PropTypes from 'prop-types'
import Head from '../Head'
import Header from '../Header/Header'
import { initGA, logPageView } from '../../utils/analytics'
// import './style.css'

export default class Layout extends React.Component {
  componentDidMount () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          // console.log('service worker registration successful')
        })
        .catch(err => {
          console.warn('service worker registration failed', err.message)
        })
    }

    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  render () {
    return (
      <div>
        <Head
          pageTitle={this.props.pageTitle}
          pageDescription={this.props.pageDescription}
          themeColor={this.props.themeColor}
          openGraph={this.props.openGraph}
          canonical={this.props.canonical}
        />

        <Header />
        {this.props.children}
        <style jsx>{`
          div {
            font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto;
          }
        `}</style>
      </div>
    )
  }
}

Layout.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  themeColor: PropTypes.string,
  openGraph: PropTypes.string,
  canonical: PropTypes.string
}

Layout.defaultProps = {
  themeColor: '#AA244A'
}
