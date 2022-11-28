import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilAccountLogout,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import '../../assets/styles/style.css'
import { toInitials } from 'src/utils/avatar/avatar'
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux'

const AppHeaderDropdown = () => {
  const userFromRedux = useSelector((state) => state.user);
  const user = getUserFromRedux(userFromRedux)
  let avatar = '';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('persist:root');
    localStorage.removeItem('userMobileNo')
    dispatch({ type: 'user', user: null })
    dispatch({ type: 'userAddons', userAddons: null })
    dispatch({ type: 'userSubscriptionId', userSubscriptionId: null })
    navigate('/');
  }

  const fullName = user?.userName;
  if (fullName) {
    [fullName].forEach(w => {
      avatar = `${toInitials(w)}`
    });

  }


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 d-flex align-items-center" caret={false}>
        <div className='user-name me-2'>{user ? user?.userName.toUpperCase() : ""}</div>
        <CAvatar>
          {avatar ? avatar : user?.userName}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={() => navigate('/profile')}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={logOutUser}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
