import React from 'react'
import { CFooter } from '@coreui/react'
import '../assets/styles/style.css'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://www.hypestreet.com" target="_blank" rel="noopener noreferrer">
          HypeStreet
        </a>
        <span className="ms-1">&copy; 2022 HypeStreet.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.netizenstechnologies.com/" target="_blank" rel="noopener noreferrer">
          Netizens Technologies
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
