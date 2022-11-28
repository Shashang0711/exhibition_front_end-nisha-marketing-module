import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';
import SettingsPanel from './components/shared/SettingsPanel';
import Footer from './components/shared/Footer';
import { withTranslation } from "react-i18next";
import './App.scss';

class App extends Component {
  state = {}
  componentDidMount() {
    this.onRouteChanged();
  }
  render() {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : '';
    let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';
    return (
      <div className="container-scroller">
        {navbarComponent}
        <div className="container-fluid page-body-wrapper">
          {sidebarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes />
              {SettingsPanelComponent}
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const { i18n } = this.props;
    const body = document.querySelector('body');
    if (this.props.location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
      i18n.changeLanguage('ar');
    }
    else {
      body.classList.remove('rtl')
      i18n.changeLanguage('en');
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/', '/signup', '/forgot-password', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    const resetPasswordLink = window.location.href;
    // Checking if route is for reset password, get full page layout
    if (resetPasswordLink.includes('/reset-password')) {
      this.setState({
        isFullPageLayout: true
      })
      document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
    } else {
      for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
        if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
          this.setState({
            isFullPageLayout: true
          })
          document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
          break;
        } else {
          this.setState({
            isFullPageLayout: false
          })
          document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
        }
      }
    }
  }

}

export default withTranslation()(withRouter(App));
