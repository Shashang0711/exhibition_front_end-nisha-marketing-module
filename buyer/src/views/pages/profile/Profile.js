import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import back_arrow from '../../../assets/images/icon/back-arrow.svg';
import avatar from '../../../assets/images/icon/avatar.png';
import edit from '../../../assets/images/icon/edit.svg';
import help_Chenter from '../../../assets/images/icon/help-center.svg';
import my_bank from '../../../assets/images/icon/my-bank.svg';
import share from '../../../assets/images/icon/share.svg';
import payments from '../../../assets/images/icon/payments.svg';
import seller from '../../../assets/images/icon/seller.svg';
import heart from '../../../assets/images/icon/heart.svg';
import { userAuth, clearTabHistory } from '../../../redux/action/action';

const Profile = (props) => {
  const userFromRedux = useSelector((state) => state.user);
  const user = JSON.parse(JSON.stringify(userFromRedux));
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const logOutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('persist:root');
    dispatch(userAuth(''));
    dispatch(clearTabHistory());
  }
  return (
    <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
      <div className="profile">
        <div className="profile-header">
          <div className="title">
            <div className="back">
              <button><img src={back_arrow} alt="Back" onClick={props.backHandler} /></button>
            </div>
            <div className="heading">
              <h2>Profile</h2>
            </div>
            <div className="edit">
              <button onClick={() => navigate('/profileupdate')}><img src={edit} alt="Edit" /></button>
            </div>
          </div>
          <div className="user-details">
            <div className="avatar">
              <img src={avatar} alt="Image_avatar" />
            </div>
            <div className="details">
              <div className="name">{user.userName}</div>
              <div className="mobile">{user.mobileNo}</div>
            </div>
          </div>
        </div>
        <div className="profile-services">
          <ul>
            <li>
              <a href="#!"><img src={help_Chenter} alt="Icon" />
                Help Number</a>
            </li>
            <li>
              <a href="#!"><img src={my_bank} alt="Icon" />My
                Bank & UPI Details</a>
            </li>
            <li>
              <a href='#!' onClick={(e) => { e.preventDefault(); navigate('/my-orders') }}><img src={seller} alt="Icon" />My
                Orders</a>
            </li>

            <li>
              <a href='#!' onClick={(e) => { e.preventDefault(); navigate('/my-wishlist') }}><img src={heart} alt="Icon" />My
                WishList</a>
            </li>
            <li>
              <a href="#!"><img src={share} alt="Icon" />My
                Shared Products</a>
            </li>
            <li>
              <a href="#!"><img src={payments} alt="Icon" />My
                payments</a>
            </li>
            <li>
              <a href="#!"><img src={seller} alt="Icon" />
                Become A Seller</a>
            </li>

            <li onClick={logOutUser}>
              <a href="#!"><img src={seller} alt="Icon" />
                Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile