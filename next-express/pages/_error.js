import React from 'react'
import Error from '../components/Error'
import Router from 'next/router'

export default class extends React.Component {
  static getInitialProps ({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null

    return { statusCode }
  }

  handleSubmit () {
    let value = document.getElementById('body-search-bar').value
    if (value.length > 0 && value !== ' ') {
      Router.push('/search?query=' + value)
    }
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') this.handleSubmit()
  }

  handleFocus (e) {
    e.target.select()
  }

  render () {
    if (this.props.statusCode === 404) {
      return (
        <div>
          <div className='search-bar'>
            <input
              type='search'
              placeholder='What are you looking for?'
              onKeyPress={this.handleKeyPress.bind(this)}
              id='body-search-bar'
              onClick={this.handleFocus.bind(this)}
            />
            <div
              className='button-wrapper'
              onClick={this.handleSubmit.bind(this)}
            >
              <div className='button-icon'>
                <svg viewBox='0 0 20 20'>
                  <path d='M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' />
                </svg>
              </div>
            </div>
            <style jsx>{`
              .search-bar {
                max-width: 800px;
                width: 100%;
                display: flex;
                box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
                position: absolute;
                top: calc(50%);
                margin: auto;
                left: 0;
                right: 0;
                padding: 0 6px;
              }

              .search-bar .button-wrapper {
                width: 60px;
                cursor: pointer;
                background: white;
              }

              .search-bar .button-icon svg * {
                fill: #000;
              }

              .search-bar input {
                width: 100%;
                height: 60px;
                padding: 12px;
                border: 0;
                border-radius: 0;
                background: white;
              }

              .search-bar input:focus {
                outline: none;
              }
            `}</style>
          </div>
          <Error />
        </div>
      )
    } else if (this.props.statusCode) {
      return <p>Something went wrong on the server {this.props.statusCode}</p>
    } else {
      return <p>Unknown Error: {this.props.statusCode}</p>
    }
  }
}
