import React from 'react'
import { useNavigate } from 'react-router-dom'
import orderplaced from '../../../assets/images/order-placed.svg'
import annas from '../../../assets/images/product/annas.png'
import { deliveryCharge, vat } from '../../../constants/constants'

const OrderPlaced = (props) => {
    const navigate = useNavigate();
    const detail = props.addresses.find(ele => ele.buyerDetailId === props.addressId);
    const cartItems = props.orderCartItems.map(orderItem => { return props.cartDetails.find(cartItem => cartItem.cartItemId === orderItem.cartItemId)});
    console.log(detail);
    const amount = cartItems.reduce((prev,curr) => prev + curr.variant.compareAtPrice * curr.quantity, 0);
    // const amount = 500;
    return(
        <React.Fragment>
            <div className='img-wrapper'>
                <img src={orderplaced} alt="Success"/>
            </div>
            <div className='heading'>
                <h2>Order placed successfully!</h2>
                <p>Congraulations! Your Order has been placed. You can track your order number #1545562</p>
            </div>
            <div className='order-box'>
                <div className='order-id'>
                        Order <span>#123-142560089-21454415</span>
                </div>
                <div className='order-body'>
                    <div className='row align-items-center'>
                        <div className='col-6'>
                            <div className='left'>
                                <img src={annas} alt="product"></img>
                                <h5>Arriving:</h5>
                                <h6>Thusday, August 28, 2022</h6>
                                <button className='app-btn' onClick={() => navigate('/my-orders')}>View or manage order</button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='right'>
                                <h5>Ship to:</h5>
                                <h6>{`${detail?.fullname}`}</h6>
                                <h6>{`${[detail?.houseNo,detail?.area, detail?.city,detail?.state].join(', ').slice(0,42)}...`}</h6>
                                <div className='price-table'>
                                    <div className='price'>
                                        <span>Total Before Tax:</span>
                                        <span>₹{Math.round(amount*100)/100}</span>
                                    </div>
                                    <div className='price'>
                                        <span>Estamted Tax:</span>
                                        <span>₹{Math.round((amount*vat+deliveryCharge)*100)/100}</span>
                                    </div>
                                    <div className='price total'>
                                        <span>Order Total:</span>
                                        <span>₹{Math.round((amount+amount*vat+deliveryCharge)*100)/100}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    ) 
}  

export default OrderPlaced