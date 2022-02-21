import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header-container">
      <div className="navbar-responsive">
        <Link to="/" className="nav-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-logo"
          />
        </Link>
        <ul className="nav-menu-lg">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>

        <ul className="nav-menu-sm">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <AiFillHome className="nav-menu-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs" className="nav-link">
              <BsFillBriefcaseFill className="nav-menu-icon" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={onClickLogOut}>
              <FiLogOut className="nav-menu-icon" />
            </Link>
          </li>
        </ul>
        <Link to="/login" className="nav-btn-link" onClick={onClickLogOut}>
          <button type="submit" className="nav-btn">
            Logout
          </button>
        </Link>
      </div>
    </nav>
  )
}
export default withRouter(Header)
