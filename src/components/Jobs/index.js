import './index.css'
import {AiOutlineSearch} from 'react-icons/ai'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profile: {},
    profileApiStatus: apiStatusConstants.initial,

    jobsList: [],
    jobsApiStatus: apiStatusConstants.initial,
    employmentType: [],
    salaryRange: 0,
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfileData()
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#fff" height="80" width="80" />
    </div>
  )

  //   getUrl = () => {
  //       return jobsApiUrl
  //         url = this.getUrl()
  //     }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {employmentType, salaryRange, searchInput} = this.state

    const jobsSearchTypes = employmentType.join(',')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${jobsSearchTypes}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const {jobs} = data
      const jobsData = jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        rating: eachJob.rating,
      }))

      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: jobsData,
      })
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const profile = data.profile_details
      const profileData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }

      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profile: profileData,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  onSearchChange = e => {
    this.setState({searchInput: e.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) return this.renderNoJobsView()
    return (
      <ul className="all-jobs-container">
        {jobsList.map(eachJob => (
          <JobItem key={eachJob.id} job={eachJob} />
        ))}
      </ul>
    )
  }

  onEmploymentTypeChange = e => {
    const {employmentType} = this.state

    if (employmentType.includes(e.target.value)) {
      const updatedEmploymentTypeList = employmentType.filter(
        eachEmploymentType =>
          eachEmploymentType !== e.target.value && eachEmploymentType,
      )

      this.setState(
        {
          employmentType: updatedEmploymentTypeList,
        },
        this.getJobs,
      )
    } else {
      const uniqueEmploymentTypes = employmentType.filter(
        eachEmploymentType => eachEmploymentType !== e.target.value,
      )

      this.setState(
        {employmentType: [...uniqueEmploymentTypes, e.target.value]},
        this.getJobs,
      )
    }
  }

  onSalaryRangeChange = e => {
    const selectedSalary = parseInt(e.target.value)

    this.setState({salaryRange: selectedSalary}, this.getJobs)
  }

  renderProfileSuccessView = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile

    return (
      <>
        <div className="profile-container">
          <img
            className="profile-image"
            src={profileImageUrl}
            alt="profile img"
          />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-short-bio">{shortBio}</p>
        </div>
        <hr className="hr-divider" />
      </>
    )
  }

  renderTypeOfEmployment = () => (
    <>
      <div className="filter-container">
        <h1 className="filter-title">Type of Employment</h1>
        {employmentTypesList.map(eachEmploymentType => (
          <div
            className="filter-option-container"
            key={eachEmploymentType.employmentTypeId}
          >
            <input
              className="filter-input"
              type="checkbox"
              value={eachEmploymentType.employmentTypeId}
              onClick={this.onEmploymentTypeChange}
            />
            <label htmlFor={eachEmploymentType.employmentTypeId}>
              {eachEmploymentType.label}
            </label>
          </div>
        ))}
        <hr className="hr-divider" />
      </div>
    </>
  )

  renderSalaryRangeView = () => (
    <>
      <div className="filter-container">
        <h1 className="filter-title">Salary Range</h1>
        {salaryRangesList.map(eachSalaryRange => (
          <div
            className="filter-option-container"
            key={eachSalaryRange.salaryRangeId}
          >
            <input
              className="filter-input"
              type="radio"
              name="salary-range"
              value={parseInt(eachSalaryRange.salaryRangeId)}
              onClick={this.onSalaryRangeChange}
            />
            <label htmlFor={eachSalaryRange.salaryRangeId}>
              {eachSalaryRange.label}
            </label>
          </div>
        ))}
        <hr className="hr-divider" />
      </div>
    </>
  )

  renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button className="retry-btn" type="button" onClick={this.getProfileData}>
        Retry
      </button>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="failure-image"
          alt="failure view"
        />
        <h1 className="failure-title">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for
        </p>
        <button className="retry-btn" type="button" onClick={this.getJobs}>
          Retry
        </button>
      </div>
    </div>
  )

  renderNoJobsView = () => (
    <>
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="failure-image"
          alt="no jobs"
        />
        <h1 className="failure-title">No Jobs Found</h1>
        <p className="failure-description">
          We could not find any jobs, Try other filters
        </p>
      </div>
    </>
  )

  renderJobsView = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileView = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-responsive">
            <div className="jobs-sidebar">
              {this.renderProfileView()}
              {this.renderTypeOfEmployment()}
              {this.renderSalaryRangeView()}
            </div>
            <div className="jobs">
              <div className="search-container">
                <input
                  className="search-input"
                  placeholder="Search"
                  type="search"
                  value={searchInput}
                  onChange={this.onSearchChange}
                />
                <button
                  className="search-icon-btn"
                  type="button"
                  testid="searchButton"
                  onClick={this.onClickSearch}
                >
                  <AiOutlineSearch className="search-icon" />
                </button>
              </div>
              {this.renderJobsView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
