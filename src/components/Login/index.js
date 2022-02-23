import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  componentDidMount() {
    const {history} = this.props
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) history.replace('/login')
    else history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    const {history} = this.props

    this.setState({showErrorMsg: true, errorMsg})
    history.replace('/login')
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitForm = async e => {
    this.setState({errorMsg: ''})
    e.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) this.onSubmitSuccess(data.jwt_token)
    else this.onSubmitFailure(data.error_msg)
  }

  render() {
    const {showErrorMsg, errorMsg, username, password} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <div className="form-responsive">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
            <div className="input-container">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                className="input"
                id="username"
                placeholder="Username"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                className="input"
                id="password"
                placeholder="Password"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
