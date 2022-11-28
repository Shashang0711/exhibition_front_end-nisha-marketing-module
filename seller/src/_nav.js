import React from 'react'
import CIcon from '@coreui/icons-react'
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
  cilPlus
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { UserSubscriptionService } from 'src/services/userSubscription'
import { useSelector } from 'react-redux'

const user = useSelector((state) => state.user)
const userId = JSON.parse(user).userId;
let _nav = [];

UserSubscriptionService.getUserSubscription(userId)
.then((subscriptionStatusResponse) => {
  if(subscriptionStatusResponse.status === 200 || subscriptionStatusResponse.status === '200') {
    if (subscriptionStatusResponse.data) {
      _nav = [
        {
          component: CNavItem,
          name: 'Dashboard',
          to: '/dashboard',
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Profile',
          to: '/profile',
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
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
  }
});


export default _nav
