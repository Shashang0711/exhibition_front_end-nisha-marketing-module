import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import React, { useState } from 'react'
import ViewPurchaseAddons from './ViewPurchaseAddons'
import AlreadyusedAddons from './AlreadyUsedAddons'

const PurchaseAddonsTab = () => {
  const [activeKey, setActiveKey] = useState(1)
  return (
    <>
      <CNav className='ad-ons-tabs' variant="pills" layout="justified">
        <CNavItem>
          <CNavLink
            href="#!"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            Purchase Add Ons
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="#!"
            active={activeKey === 3}
            onClick={() => setActiveKey(3)}
          >
            Already Enjoying Add Ons
          </CNavLink>
        </CNavItem>
      </CNav>
      <br />
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
          <ViewPurchaseAddons />
        </CTabPane>

        <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
          <AlreadyusedAddons />
        </CTabPane>
      </CTabContent>
    </>
  )
}

export default PurchaseAddonsTab