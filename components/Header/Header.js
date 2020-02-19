import React from 'react'

export default class Header extends React.Component {
  render () {
    return (
      <header>
        <div>
          <img src='/svg/logo.svg' alt='logo' />
        </div>
        <style jsx>{`
          header {
            width: 100%;
            background-color: #222831;
            height: 100px;
          }

          div {
            width: 200px;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #222831;
            border-radius: 50%;
            margin: auto;
          }

          img {
            width: 150px;
            display: block;
          }
        `}</style>
      </header>
    )
  }
}
