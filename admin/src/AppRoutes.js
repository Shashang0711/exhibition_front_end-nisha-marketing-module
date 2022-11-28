import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import Spinner from './components/shared/Spinner';

// import { tokenCheck } from './services/auth.service';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));

const Documents = lazy(() => import('./pages/Documents/Documents.view'));
const ExhibitionVerification = lazy(() => import('./pages/ExhibitionVerification/ExhibitionVerification.view'));
const ExhibitionDetails = lazy(() => import('./pages/ExhibitionDetails/ExhibitionDetails.view'));
const Sellers = lazy(() => import('./pages/Sellers/Sellers.view'));
const SellerDetails = lazy(() => import('./pages/Sellers/components/SellerDetails'));
const Categories = lazy(() => import('./pages/Categories/Categories.view'));
const ExhCategories = lazy(() => import('./pages/ExhCategories/ExhCategories.view'));
const Products = lazy(() => import('./pages/Products/Products.view'));
const AddEditProduct = lazy(() => import('./pages/Products/components/ProductAddEditModal'));

const Users = lazy(() => import('./pages/Users/Users.view'));
const Exhibitions = lazy(() => import('./pages/Exhibitions/Exhibitions.view'));
const ExhibitionProducts = lazy(() => import('./pages/ExhibitionProducts/ExhibitionProducts.view'));
const PaymentMethods = lazy(() => import('./pages/PaymentMethods/PaymentMethods.view'));
const Orders = lazy(() => import('./pages/Orders/Orders.view'));
const Subscription = lazy(() => import('./pages/Subscriptions/Subscriptions.view'));
const SubscriptionPayments = lazy(() => import('./pages/SubscriptionPayments/SubscriptionPayments.view'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ.view'));
const Role = lazy(() => import('./pages/Role/Role.View'));
const Employee = lazy(() => import('./pages/Employee/Employee.js'));
const DocumentVerification = lazy(() => import('./pages/UploadDocuments/DocumentVerification.js'));
const Module = lazy(() => import('./pages/Module/Module'));
const SellerRegister = lazy(() => import('./pages/SellerRegistration/AddEditSellerRegistration'));
// const Buttons = lazy(() => import('./components/basic-ui/Buttons'));
// const Dropdowns = lazy(() => import('./components/basic-ui/Dropdowns'));
// const Typography = lazy(() => import('./components/basic-ui/Typography'));


// const BasicElements = lazy(() => import('./components/form-elements/BasicElements'));

// const BasicTable = lazy(() => import('./components/tables/BasicTable'));



// const Mdi = lazy(() => import('./components/icons/Mdi'));


// const ChartJs = lazy(() => import('./components/charts/ChartJs'));

const Error404 = lazy(() => import('./components/error-pages/Error404'));
const Error500 = lazy(() => import('./components/error-pages/Error500'));

const Login = lazy(() => import('./pages/Login/Login.view'));
const Signup = lazy(() => import('./pages/Signup/Signup.view'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword.view'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword.view'));
const Lockscreen = lazy(() => import('./components/user-pages/Lockscreen'));

const BlankPage = lazy(() => import('./components/general-pages/BlankPage'));

const routes = [
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/documents',
    component: Documents
  },
  {
    path: '/exhibitionVerification',
    component: ExhibitionVerification
  },
  {
    path: '/exhibitionDetails/:exId',
    component: ExhibitionDetails
  },
  {
    path: '/sellers',
    component: Sellers
  },
  {
    path: '/sellerDetails/:sellerId',
    component: SellerDetails
  },
  {
    path: '/categories',
    component: Categories
  },
  {
    path: '/exhCategories',
    component: ExhCategories
  },
  {
    path: '/products',
    component: Products
  },
  {
    path: '/addEditProduct',
    component: AddEditProduct
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/exhibitions',
    component: Exhibitions
  },
  {
    path: '/exhibitionproducts/:user_id/:ex_id',
    component: ExhibitionProducts
  },
  {
    path: '/paymentMethods',
    component: PaymentMethods
  },
  {
    path: '/orders',
    component: Orders
  },
  {
    path: '/subscriptions',
    component: Subscription
  },
  {
    path: '/purchase-subscription',
    component: SubscriptionPayments
  },
  {
    path: '/faq',
    component: FAQ
  },
  {
    path: '/role',
    component: Role
  },
  {
    path: '/upload-documents',
    component: DocumentVerification
  },
  {
    path: '/employee',
    component: Employee
  },
  {
    path: '/module',
    component: Module
  },
  {
    path: '/sellerRegister',
    component: SellerRegister
  }


];

class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {/* Paths that do not require authentication */}
          {/* <PublicRoutes /> */}
          <PublicRoute exact path="/" component={Login} />
          <PublicRoute path="/signup" component={Signup} />
          <PublicRoute path="/forgot-password" component={ForgotPassword} />
          <PublicRoute path="/reset-password/:token" component={ResetPassword} />
          <PublicRoute path="/user-pages/lockscreen" component={Lockscreen} />

          {/* Paths that require authentication */}
          {/* <PrivateRoutes /> */}
          {
            routes.map(route => {
              return <PrivateRoute key={route.path} path={route.path} component={route.component} />
            })
          }

          {/* Theme modules */}
          {/* <Route path="/basic-ui/buttons" component={Buttons} />
          <Route path="/basic-ui/dropdowns" component={Dropdowns} />
          <Route path="/basic-ui/typography" component={Typography} />
          <Route path="/form-Elements/basic-elements" component={BasicElements} />
          <Route path="/tables/basic-table" component={BasicTable} />
          <Route path="/icons/mdi" component={Mdi} />
          <Route path="/charts/chart-js" component={ChartJs} /> */}

          <Route path="/error-pages/error-404" component={Error404} />
          <Route path="/error-pages/error-500" component={Error500} />
          <Route path="/general-pages/blank-page" component={BlankPage} />

          <Redirect to="/" />
        </Switch >
      </Suspense >
    );
  }
}

export default AppRoutes;