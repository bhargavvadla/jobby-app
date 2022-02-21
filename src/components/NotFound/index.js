import './index.css'
import {Component} from 'react'
import Header from '../Header'

class NotFound extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="not-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
            alt="not found"
            className="not-found-image"
          />
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-description">
            we're sorry, the page you requested could not be found
          </p>
        </div>
      </>
    )
  }
}

export default NotFound
