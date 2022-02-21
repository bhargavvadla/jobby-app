import './index.css'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

const JobItem = props => {
  const {job} = props

  const {
    id,
    title,
    jobDescription,
    location,
    packagePerAnnum,
    companyLogoUrl,
    employmentType,
    rating,
  } = job

  return (
    <Link to={`/jobs/${id}`} className="item-link">
      <li className="job-container">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="job-header-content">
            <h1 className="job-header-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p className="job-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-details">
          <div className="job-details-content">
            <div className="job-card-tag">
              <MdLocationOn className="job-details-icon" />
              <p>{location}</p>
            </div>
            <div className="job-card-tag">
              <BsFillBriefcaseFill className="job-details-icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p className="job-package">{packagePerAnnum}</p>
        </div>
        <hr className="hr-divider" />
        <h1 className="job-item-title">Description</h1>
        <p className="job-header-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
