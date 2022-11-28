import React from 'react'
import home from '../../../assets/images/icon/home.svg'
import back from '../../../assets/images/icon/back-arrow.svg'
import confirmorder from '../../../assets/images/icon/confirm-order.svg'
import shipped from '../../../assets/images/icon/shipped.svg'
import delivered from '../../../assets/images/icon/delivered.svg'

const TrackOrder  = () => {
    return (
        <div className='app-sc track-order'>
            <div className='track-order-section'>
                <div className='app-header'>
                    <div className='back'>
                        <a href="#!"><img src={back} alt="Back" /></a>  
                    </div>
                    <div className='title'>
                        Track Order
                    </div>
                    <div className='wishlist mr-3'>
                        <a href='#!'><img src={home} alt="Home" /></a>
                    </div>
                </div>
                <div className='order-details'>
                    <div className='row align-items-center'>
                        <div className='col-7'>
                            <div className='order-id'>
                                <h5>Order ID</h5>
                                <h6>NYK-665546656md</h6>
                            </div>
                            <div className='placed'>
                                <h5>Placed</h5>
                                <h6>Wed, 10 Nov</h6>
                            </div>
                        </div>
                        <div className='col-5'>
                            <div className='order-total'>
                                <h5>Order Total</h5>
                                <h6>₹ 251.75</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shipping-address'>
                    <h4>Shipping Address</h4>
                    <h5>John doe Browin 450, tenny Ave N, serarfill..</h5>
                    <h6>+91 000 000 2223</h6>
                </div>
                <div className='items-name'>
                    <h2>2 Item(s) Delivered</h2>
                    <h5>Package Delivered On</h5>
                    <h6>Sat, 13 Nov</h6>
                </div>
                <div className='order-tracker'>
                    <div className='order-tracker-inner'>
                        <div className='process'>

                        </div>
                        <div className='details'>
                            <img src={confirmorder} alt="icon" />
                            <div className='content'>
                                <h5>Order Confirmed</h5>
                                <h6>09:10 AM, 10 Nov 2022</h6>
                            </div>
                        </div>
                        <div className='date'>
                            Wed, 10 Nov
                        </div>
                    </div>
                    <div className='order-tracker-inner'>
                        <div className='process'>

                        </div>
                        <div className='details'>
                            <img src={shipped} alt="icon" />
                            <div className='content'>
                                <h5>Shipped</h5>
                                <h6>09:10 AM, 10 Nov 2022</h6>
                            </div>
                        </div>
                        <div className='date'>
                            Wed, 11 Nov
                        </div>
                    </div>
                    <div className='order-tracker-inner active'>
                        <div className='process'>

                        </div>
                        <div className='details'>
                            <img src={delivered} alt="icon" />
                            <div className='content'>
                                <h5>Delivered</h5>
                                <h6>09:10 AM, 10 Nov 2022</h6>
                            </div>
                        </div>
                        <div className='date'>
                            Wed, 12 Nov
                        </div>
                    </div>
                </div>
            </div>
            <div className='btn-wrapper'>
                <button className='app-btn outline'>Cancel Order</button>
                <button className='app-btn'>Return Order</button>
            </div>
        </div>
    )
}

export default  TrackOrder
