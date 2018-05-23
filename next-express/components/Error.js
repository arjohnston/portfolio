import React from 'react'
import PropTypes from 'prop-types'
import Layout from './Layout'

export default class Error extends React.Component {
  render () {
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
  }
}

Error.propTypes = {
  logo: PropTypes.string,
  customerCompany: PropTypes.bool
}
