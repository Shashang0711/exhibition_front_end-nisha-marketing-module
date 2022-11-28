import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { checkJSON } from '../../utils/localStorage';
import { isAdmin, isSeller, isAdminAsSeller } from '../../utils/user';

class Sidebar extends Component {

  state = {
    routes: []
  };

  user = localStorage.getItem('user');
  activeUser = checkJSON(this.user);

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/advanced-ui', state: 'advancedUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/maps', state: 'mapsMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
      { path: '/general-pages', state: 'generalPagesMenuOpen' },
      { path: '/ecommerce', state: 'ecommercePagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-profile">
            <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
              <div className="nav-profile-image">
                <img src={require("../../assets/images/faces/face1.jpg")} alt="profile" />
                <span className="login-status online"></span> {/* change to offline or busy as needed */}
              </div>
              <div className="nav-profile-text">
                <span className="font-weight-bold mb-2"><Trans>{this.activeUser ? this.activeUser.userName : null}</Trans></span>
                <span className="text-secondary text-small"><Trans>{this.activeUser ? this.activeUser.email : null}</Trans></span>
              </div>
              <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
            </a>
          </li>
          <li className={this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-title"><Trans>Dashboard</Trans></span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/role') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/role">
              <span className="menu-title"><Trans>Role</Trans></span>
              <i className="mdi mdi-file-document menu-icon"></i>
            </Link>
          </li>
          <li className={this.isPathActive('/module') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/module">
              <span className="menu-title"><Trans>Module</Trans></span>
              <i className="mdi mdi-file-document menu-icon"></i>
            </Link>
          </li>

          <li className={this.isPathActive('/sellerRegister') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/sellerRegister">
              <span className="menu-title"><Trans>Seller Register</Trans></span>
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            </Link>
          </li>


          <li className={this.isPathActive('/upload-documents') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/upload-documents">
              <span className="menu-title"><Trans>Upload documents</Trans></span>
              <i className="mdi mdi-file-document menu-icon"></i>
            </Link>
          </li>
          {/* {
            isAdmin() && !isAdminAsSeller() ? */}
          <li className={this.isPathActive('/sellers') ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to="/sellers">
              <span className="menu-title"><Trans>Sellers</Trans></span>
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            </Link>
          </li>
          {/* :
              null
          } */}

          {/* {
            isAdmin() && !isAdminAsSeller() ? */}
          <>
            <li className={this.isPathActive('/employee') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/employee">
                <span className="menu-title"><Trans>Employee</Trans></span>
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </Link>
            </li>
            <li className={this.isPathActive('/categories') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/categories">
                <span className="menu-title"><Trans>Categories</Trans></span>
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </Link>
            </li>

            <li className={this.isPathActive('/exhCategories') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/exhCategories">
                <span className="menu-title"><Trans>Exhibition Categories</Trans></span>
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </Link>
            </li>

            <li className={this.isPathActive('/paymentMethods') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/paymentMethods">
                <span className="menu-title"><Trans>Payment Methods</Trans></span>
                <i className="mdi mdi-cash-usd menu-icon"></i>
              </Link>
            </li>

            <li className={this.isPathActive('/documents') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/documents">
                <span className="menu-title"><Trans>Document Verification</Trans></span>
                <i className="mdi mdi-file-document menu-icon"></i>
              </Link>
            </li>
            <li className={this.isPathActive('/exhibitions') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/exhibitions">
                <span className="menu-title"><Trans>Update exhibitions</Trans></span>
                <i className="mdi mdi-file-document menu-icon"></i>
              </Link>
            </li>

            <li className={this.isPathActive('/exhibitionVerification') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/exhibitionVerification">
                <span className="menu-title"><Trans>Exhibition Requests</Trans></span>
                <i className="mdi mdi-file-document menu-icon"></i>
              </Link>
            </li>
            <li className={this.isPathActive('/faq') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/faq">
                <span className="menu-title"><Trans>FAQ</Trans></span>
                <i className="mdi mdi-file-document menu-icon"></i>
              </Link>
            </li>


          </>
          {/* :
              null
          } */}

          {/* {
            isSeller() || isAdminAsSeller() ? */}
          {/* <>
                <li className={this.isPathActive('/products') ? 'nav-item active' : 'nav-item'}>
                  <Link className="nav-link" to="/products">
                    <span className="menu-title"><Trans>Products</Trans></span>
                    <i className="mdi mdi-package-variant-closed menu-icon"></i>
                  </Link>
                </li>

            <li className={this.isPathActive('/exhibitions') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/exhibitions">
                <span className="menu-title"><Trans>Exhibitions</Trans></span>
                <i className="mdi mdi-theater menu-icon"></i>
              </Link>
            </li>

                <li className={this.isPathActive('/subscriptions') ? 'nav-item active' : 'nav-item'}>
                  <Link className="nav-link" to="/subscriptions">
                    <span className="menu-title"><Trans>Subscriptions</Trans></span>
                    <i className="mdi mdi-diamond menu-icon"></i>
                  </Link>
                </li>
              </> */}
          {/* :
              null
          } */}

        </ul>
        {
          localStorage.getItem('sellerId') ?
            <button
              className="btn btn-outline-primary ml-4"
              onClick={() => {
                localStorage.removeItem('sellerId');
                this.props.history.push('/dashboard');
              }}
            >
              Go back as admin
            </button>
            :
            null
        }
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);