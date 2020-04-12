import React from 'react'
import axios from 'axios'
import Layout from '../components/Layout/Layout'

export default class extends React.Component {
  handleRegister () {
    const username = 'user'
    const password = 'StrongPassword$1'

    axios
      .post('/api/auth/register', { username, password })
      .then(() => {
        // this.setState({ message: '' })
        // this.props.history.push('/login')
        console.log('success')
      })
      .catch(error => {
        console.log(error)
        // this.setState({
        //   message: error.response.data.message
        // })
      })
  }

  render () {
    return (
      <div>
        <Layout canonical='/'>
          <section>
            <h1>Next-Express Boilerplate</h1>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
              veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
              vel eum iure reprehenderit qui in ea voluptate velit esse quam
              nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
              voluptas nulla pariatur?
            </p>

            <button onClick={this.handleRegister.bind(this)}>Register</button>
          </section>
          <style jsx>
            {`
              section {
                max-width: 800px;
                margin: 120px auto 0;
                padding: 12px;
              }
            `}
          </style>
        </Layout>
      </div>
    )
  }
}
