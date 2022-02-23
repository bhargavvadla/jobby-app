import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCard from '../JobCard'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: [],
    jobItemDetailsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobItemDetailsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`

    const response = await fetch(jobDetailsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const job = data.job_details

      const formattedJobData = {
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        title: job.title,
        id: job.id,
        jobDescription: job.job_description,
        skills: job.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),

        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
      }

      const similarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employeeType: eachJob.employment_type,
        id: eachJob.id,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        jobDescription: eachJob.job_description,
      }))

      this.setState({
        jobData: {job: formattedJobData, similarJobs},
        jobItemDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobItemDetailsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobsItemDetailsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        className="jobs-failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="jobs-failure-title">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader
        testid="loader"
        type="ThreeDots"
        color="#fff"
        height="80"
        width="80"
      />
    </div>
  )

  renderJobItemView = () => {
    const {jobItemDetailsApiStatus} = this.state

    switch (jobItemDetailsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSimilarJobsView = () => {
    const {jobData} = this.state
    const {similarJobs} = jobData

    return (
      <ul className="similar-jobs-container">
        {similarJobs.map(eachSimilarJob => (
          <JobCard key={eachSimilarJob.id} similarJob={eachSimilarJob} />
        ))}
      </ul>
    )
  }

  renderJobsItemDetailsSuccessView = () => {
    const {jobData} = this.state
    const {job} = jobData

    const {
      companyLogoUrl,
      employmentType,
      location,
      rating,
      title,
      skills,
      companyWebsiteUrl,
      packagePerAnnum,
      jobDescription,
      lifeAtCompany,
    } = job

    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job-item-container-responsive">
        <div className="job-item">
          <ul className="job-item-responsive">
            <li className="job-header">
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
            </li>
            <li className="job-details">
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
            </li>
            <hr className="job-divider" />
            <li className="title-url-container">
              <h1 className="job-item-title">Description</h1>
              <div className="visit-link-container">
                <a
                  rel="icon"
                  href={companyWebsiteUrl}
                  className="website-visit-link"
                >
                  Visit
                </a>
                <FiExternalLink className="external-link-icon" />
              </div>
            </li>
            <p className="job-item-description">{jobDescription}</p>
            <h1 className="job-item-title">Skills</h1>
            <ul className="skills-container">
              {skills.map(eachSkill => (
                <li className="skill">
                  <img
                    src={eachSkill.imageUrl}
                    className="skill-image"
                    alt={eachSkill.name}
                  />
                  {eachSkill.name}
                </li>
              ))}
            </ul>
            <h1 className="job-item-title">Life at Company</h1>
            <div className="life-company-container">
              <p className="job-company-description">{description}</p>
              <img
                src={imageUrl}
                className="life-company-image"
                alt="life at company img"
              />
            </div>
          </ul>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        {this.renderSimilarJobsView()}
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">{this.renderJobItemView()}</div>
      </>
    )
  }
}
export default JobItemDetails
