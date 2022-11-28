import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = ({ getNavItems, nav }) => {
  const userFromRedux = useSelector((state) => state.user);
  useEffect(() => {
    if (userFromRedux) {
      getNavItems();
    }
  }, []);
  return (
    <div>
      {nav && nav.length > 0 ?
        <AppSidebar items={nav} />
        :
        <></>
      }


      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        {nav && nav.length > 0 ?
          <AppHeader />
          :
          <></>
        }
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
