import React from 'react'
import back from '../../assets/images/icon/back-arrow.svg'
import tickicon from '../../assets/images/icon/tick-icon.svg'

import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Loader from '../loader/Loader';

const Subscription = () => {
    return (

        <div className='app-sc subscription'>
            <Loader />
            <div className='subscription-section'>
                <div className='app-header'>
                    <div className='back'>
                        <a href="#!"><img src={back} alt="Back" /></a>  
                    </div>
                    <div className='title'>
                        Subscriptions
                    </div>
                    <div className='wishlist mr-3'>
                        &nbsp;
                    </div>
                </div>
                <Swiper
                    // install Swiper modules
                    modules={[Autoplay]}
                    spaceBetween= {10}
                    slidesPerView= {1.3}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false
                    }}
                    breakpoints={{
                        376: {
                            slidesPerView: 1.4,
                        },
                        401: {
                            slidesPerView: 1.5,
                        },
                        451: {
                            slidesPerView: 1.6,
                        },
                        481: {
                            slidesPerView: 1,
                        }
                    }}
                >
                    <SwiperSlide>
                        <div className='subsciption-card'>
                            <div className='title'>
                                <h6>MALL</h6>
                            </div>
                            <div className='subsciption-card-body'>
                                <div className='price'>
                                    <h3>₹ 0000</h3>
                                    <h4>10 Days</h4>
                                </div>
                                <ul>
                                    <li><img src={tickicon} alt="Tick" />0% Commission</li>
                                    <li><img src={tickicon} alt="Tick" />40 Listing Limit</li>
                                    <li><img src={tickicon} alt="Tick" />Inventory Management</li>
                                    <li><img src={tickicon} alt="Tick" />Custom Pricing</li>
                                    <li><img src={tickicon} alt="Tick" />Coupon Qenertion </li>
                                    <li><img src={tickicon} alt="Tick" />Home Delivery</li>
                                    <li><img src={tickicon} alt="Tick" />All Round Analytics</li>
                                    <li><img src={tickicon} alt="Tick" />Social Media Intresrtion</li>
                                    <li><img src={tickicon} alt="Tick" />24/7 Support</li>
                                </ul>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='subsciption-card'>
                            <div className='title'>
                                <h6>MALL</h6>
                            </div>
                            <div className='subsciption-card-body'>
                                <div className='price'>
                                    <h3>₹ 0000</h3>
                                    <h4>15 Days</h4>
                                </div>
                                <ul>
                                    <li><img src={tickicon} alt="Tick" />0% Commission</li>
                                    <li><img src={tickicon} alt="Tick" />40 Listing Limit</li>
                                    <li><img src={tickicon} alt="Tick" />Inventory Management</li>
                                    <li><img src={tickicon} alt="Tick" />Custom Pricing</li>
                                    <li><img src={tickicon} alt="Tick" />Coupon Qenertion </li>
                                    <li><img src={tickicon} alt="Tick" />Home Delivery</li>
                                    <li><img src={tickicon} alt="Tick" />All Round Analytics</li>
                                    <li><img src={tickicon} alt="Tick" />Social Media Intresrtion</li>
                                    <li><img src={tickicon} alt="Tick" />24/7 Support</li>
                                </ul>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='subsciption-card'>
                            <div className='title'>
                                <h6>MALL</h6>
                            </div>
                            <div className='subsciption-card-body'>
                                <div className='price'>
                                    <h3>₹ 0000</h3>
                                    <h4>30 Days</h4>
                                </div>
                                <ul>
                                    <li><img src={tickicon} alt="Tick" />0% Commission</li>
                                    <li><img src={tickicon} alt="Tick" />40 Listing Limit</li>
                                    <li><img src={tickicon} alt="Tick" />Inventory Management</li>
                                    <li><img src={tickicon} alt="Tick" />Custom Pricing</li>
                                    <li><img src={tickicon} alt="Tick" />Coupon Qenertion </li>
                                    <li><img src={tickicon} alt="Tick" />Home Delivery</li>
                                    <li><img src={tickicon} alt="Tick" />All Round Analytics</li>
                                    <li><img src={tickicon} alt="Tick" />Social Media Intresrtion</li>
                                    <li><img src={tickicon} alt="Tick" />24/7 Support</li>
                                </ul>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
                
                <div className='btm-checkbox'>
                    <div className='remember'>
                        <label className='custom-check-box'>Live Selling <input type="checkbox" name="terms" id="terms" /><span
                                className='checkmark'></span></label>
                    </div>
                    <div className='remember'>
                        <label className='custom-check-box'>Social Media Campaign <input type="checkbox" name="terms" id="terms" /><span
                                className='checkmark'></span></label>
                    </div>
                    <div className='remember'>
                        <label className='custom-check-box'>Data Entry <input type="checkbox" name="terms" id="terms" /><span
                                className='checkmark'></span></label>
                    </div>
                </div>
            </div>
            <div className='btn-wrapper'>
                <button className='app-btn w-100'>Let’s Talk</button>
            </div> 
        </div>
    )
}

export default Subscription