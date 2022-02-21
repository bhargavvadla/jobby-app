import './index.css'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

const JobCard = props => {
  const {similarJob} = props

  const {
    title,
    jobDescription,
    location,
    rating,
    companyLogoUrl,
    employeeType,
  } = similarJob

  return (
    <>
      <li className="job-card job-container">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="similar job company logo"
          />
          <div className="job-header-content">
            <h1 className="job-header-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p className="job-rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="job-item-title">Description</h1>
        <p className="job-header-description">{jobDescription}</p>
        <div className="job-details">
          <div className="job-details-content">
            <div className="job-card-tag">
              <MdLocationOn className="job-details-icon" />
              <p>{location}</p>
            </div>
            <div className="job-card-tag">
              <BsFillBriefcaseFill className="job-details-icon" />
              <p>{employeeType}</p>
            </div>
          </div>
        </div>
      </li>
    </>
  )
}

export default JobCard
