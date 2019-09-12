import React from 'react'
import Layout from '../components/Layout/Layout'

export default class extends React.Component {
  static getInitialProps ({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null

    return { statusCode }
  }

  render () {
    if (this.props.statusCode === 404) {
      return (
        <Layout>
          <div className='error-wrapper'>
            <div className='error-message'>
              <span className='error-text'>Error 404</span>
              <span className='error-divide'>-</span>
              <p>oops, something went wrong</p>
            </div>
          </div>
          <style jsx>{`
            .error-wrapper {
              height: 100vh;
              min-height: 600px;
              width: 100%;
              background-color: #2b366b;
              background-image: url(/static/images/bldg.png);
              background-repeat: no-repeat;
              background-position: center;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .error-message {
              color: white;
              text-align: right;
              width: 100%;
              max-width: 400px;
              padding-right: 10px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              margin-top: -300px;
            }
            .error-message p {
              font-size: 20px;
              font-weight: 400;
              width: 200px;
            }
            .error-message span {
              display: block;
            }
            .error-text {
              font-size: 12px;
              font-weight: 100;
            }
            .error-divide {
              font-size: 20px;
              margin-top: -5px;
            }
          `}</style>
        </Layout>
      )
    } else if (this.props.statusCode) {
      return <p>Something went wrong on the server {this.props.statusCode}</p>
    } else {
      return <p>Unknown Error: {this.props.statusCode}</p>
    }
  }
}
