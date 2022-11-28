import React, { Component, Suspense, useEffect, useState } from 'react';
// import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './scss/style.scss';
import { sellerService } from './services/sellers';
import { useSelector } from 'react-redux';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDiamond,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilPlus,
  cilHouse,
  cilMoney,
  cilCloudUpload
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicRouting from './common/guarded/PublicRouting';
import SellerAdminLogin from './views/pages/sellerAdminLogin/SellerAdminLogin';
import { getUserFromRedux } from './utils/userFromredux/getUserFromRedux';
import { getMobileNo } from './utils/localstorage';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const OTP = React.lazy(() => import('./views/pages/otp/OTP'));
const ThankYou = React.lazy(() => import('./views/pages/greetings/ThankYou'));
// const BasicDetails = React.lazy(() => import('./views/basicDetails/BasicDetails'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

// forget password & reset password
const ForgetPassword = React.lazy(() => import('./views/pages/forgetPassword/ForgetPassword'));
const ResetPassword = React.lazy(() => import('./views/pages/resetPassword/ResetPassword'));
const TermsAndConditions = React.lazy(() => import('./views/pages/termsAndConditions/TermsAndConditions'));
const Policys = React.lazy(() => import('./views/pages/termsAndConditions/Policys'));

const App = () => {
  const [state, setState] = useState({ nav: [] });
  const userFromRedux = useSelector((state) => state.user)

  const getNavItems = () => {
    let _nav = [];
    const user = getUserFromRedux(userFromRedux)
    const userId = user.userId;

    sellerService.getSellerById(userId)
      .then((sellerResponse) => {
        if (sellerResponse?.status === 200 || sellerResponse.status === '200') {
          if (sellerResponse.data.isSubscribed && sellerResponse.data.isDocVerified) {
            _nav = [
              {
                component: CNavItem,
                name: 'Dashboard',
                to: '/dashboard',
                icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
              },

              {
                component: CNavItem,
                name: 'Store Details',
                to: '/store',
                icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
              },
              {
                component: CNavTitle,
                name: 'Purchase',
              },
              {
                component: CNavGroup,
                name: 'Subscriptions',
                to: '/purchase/subscriptions',
                icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
                items: [
                  {
                    component: CNavItem,
                    name: 'Active Plans',
                    to: '/purchase/ActiveSubcriptions',
                  },
                  {
                    component: CNavItem,
                    name: 'Buy Subscriptions',
                    to: 'purchase/subscriptions',
                  },
                ],
              },
              {
                component: CNavGroup,
                name: 'Get Add Ons',
                to: '/purchase/addOns',
                icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
                items: [
                  {
                    component: CNavItem,
                    name: 'Active AddOns',
                    to: 'purchase/addOnsList',
                  },
                  {
                    component: CNavItem,
                    name: 'Buy AddOns',
                    to: '/purchase/addOns',
                  },
                ],
              },
              {
                component: CNavItem,
                name: 'Purchase History',
                to: '/purchasehistory',
                icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
              },
              {
                component: CNavTitle,
                name: 'Inventory',
              },
              {
                component: CNavItem,
                name: 'Products',
                to: 'inventory/products',
                icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
              },
              {
                component: CNavItem,
                name: 'Exhibition',
                to: 'inventory/exhibitions',
                icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
              },
              {
                component: CNavTitle,
                name: 'Order',
              },
              {
                component: CNavItem,
                name: 'Order list',
                to: '/orderlist',
                icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
              },

            ]
          } else {
            _nav = [
              {
                component: CNavTitle,
                name: 'Purchase',
              },
              {
                component: CNavItem,
                name: 'Subscriptions',
                to: '/purchase/subscriptions',
                icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
              },

            ];
          }
          setState({ nav: _nav });
        }
      })
  }

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="/" element={<PublicRouting />} >
              <Route exact path="/" name="Login Page" element={<Login />} />
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path='/submit-otp' name="Enter OTP" element={<OTP />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/forgetPassword" name="ForgetPassword Page" element={<ForgetPassword />} />
              <Route exact path="/sellerloginbyadmin/:accessToken" name="Login seller Page" element={<SellerAdminLogin />} />
              <Route exact path='/termsandtonditions' element={<TermsAndConditions />} />
              <Route exact path='/policy' element={<Policys />} />
            </Route >
            <Route exact path="/reset-password/:token" name="Reset Password Page" element={<ResetPassword />} />
            <Route exact path="/thank-you" name="Thank You" element={<ThankYou />} />
            {/* <Route exact path="/404" name="Page 404" element={<Page404 />} /> */}
            {/* <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
            <Route path="*" name="Home" element={<DefaultLayout getNavItems={getNavItems} nav={state.nav} />} />
          </Routes >
        </Suspense >
      </BrowserRouter >

    </>
  );
}

export default App
