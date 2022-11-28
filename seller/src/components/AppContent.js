import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import PrivateRouting from 'src/common/guarded/PrivateRouting'
import Page404 from 'src/views/pages/page404/Page404'

const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route key={idx} path="/" element={<PrivateRouting />} >
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              </Route>
            )
          )
        })}
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="*" name="Home" element={<Page404 />} />
      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)
