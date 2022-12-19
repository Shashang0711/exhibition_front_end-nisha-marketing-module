
import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicRouting from './common/guarded/PublicRouting';
import PrivateRouting from './common/guarded/PrivateRouting';
import AppUrlListener from './services/appUrlListener';

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
// const Register = React.lazy(() => import('./views/pages/register/Register'));
const OTP = React.lazy(() => import('./views/pages/otp/Otp'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const DefaultLayout = React.lazy(() => import('./views/defaultLayout/DefaultLayout'));
const ForgetPassword = React.lazy(() => import('./views/pages/forgetPassword/ForgetPassword'));
const ResetPassword = React.lazy(() => import('./views/pages/resetPassword/ResetPassword'));
const ProfileUpdate = React.lazy(() => import('./views/pages/profile/ProfilUpdate'));
const ShoppingCart = React.lazy(() => import('./views/shoppingCart/ShoppingCart'));
const Checkout = React.lazy(() => import('./views/checkout/Checkout'));
const AddNewAddress = React.lazy(() => import('./views/checkout/component/AddNewAddress'));
const Orders = React.lazy(() => import('./views/pages/orders/Orders'));
const Product = React.lazy(() => import('./views/exhibitionProduct/ExhibitionProduct'));
const ViewExhibition = React.lazy(() => import('./views/viewExhibition/ViewExhibition'));
const TrackOrder = React.lazy(() => import('./views/checkout/component/TrackOrder'));
const Subscription = React.lazy(() => import('./views/subscription/Subscription'));
const SignleProduct = React.lazy(() => import('./views/viewProduct/ViewProduct'));
const WishList = React.lazy(() => import('./views/pages/wishlist/WishList'));

function App() {

  return (
    <>
      <ToastContainer position="bottom-center" hideProgressBar={true} theme="dark" />
      <BrowserRouter>
        <AppUrlListener></AppUrlListener>
        <Suspense>
          <Routes>
            <Route path="/" element={<PublicRouting />} >
              <Route exact path="/" name="Login Page" element={<Login />} />
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path='/submit-otp' name="Enter OTP" element={<OTP />} />
              {/* <Route exact path="/register" name="Register Page" element={<Register />} /> */}
              <Route exact path="/forgetpassword" name="ForgetPassword Page" element={<ForgetPassword />} />
              <Route exact path="/reset-password/:token" name="resetPassword Page" element={<ResetPassword />} />
            </Route>
            <Route path="/" element={<PrivateRouting />} >

              <Route exact path="/home" name="Default Page" element={<DefaultLayout />} />
              <Route path="/profileupdate" name="Profile Page" element={<ProfileUpdate />} />
              <Route path="/exhibition/:exid/:excid" name="Exhibitions Page" element={<ViewExhibition />} />
              <Route path="/exhibition-product/:exhid/:cid" name="Product Page" element={<Product />} />
              <Route path="/exhibition-single-product/:proid" name="Single Product Page" element={<SignleProduct />} />
              <Route path="/shoppingcart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/add-new-address" element={<AddNewAddress />} />
              <Route path="/my-orders" element={<Orders />} />
              <Route path="/my-wishlist" element={<WishList />} />
              <Route path="/order-places/track-order" element={<TrackOrder />} />
              <Route path="/subscription" element={<Subscription />} />

            </Route>
            <Route path="*" name="Page Note found" element={<Page404 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

    </>
  );
}

export default App;

