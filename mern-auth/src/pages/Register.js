import React, { Component } from 'react'
import axios from 'axios'

export default class extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: '',
      message: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange (e) {
    let state = { ...this.state }
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  onSubmit (e) {
    e.preventDefault()

    const { username, password } = this.state

    axios.post('/api/auth/register', { username, password })
      .then(() => {
        this.setState({ message: '' })
        this.props.history.push('/login')
      })
      .catch((error) => {
        this.setState({
          message: error.response.data.message
        })
      })
  }

  render () {
    const { username, password, message } = this.state

    return (
      <div className='container'>
        <form onSubmit={this.onSubmit}>
          <h1>Register</h1>

          {message !== '' &&
            <span>
              { message }
            </span>
          }

          <input
            type='email'
            name='username'
            placeholder='Email'
            value={username}
            onChange={this.onChange}
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={this.onChange}
            required
          />

          <button type='submit'>Register</button>
        </form>
      </div>
    )
  }
}
