import React, { useState, useEffect } from 'react'
import home from '../../assets/images/icon/home.svg'
import back from '../../assets/images/icon/back-arrow.svg'
import deleteicon from '../../assets/images/icon/delete.svg'
import { useNavigate } from 'react-router-dom'
import { CartService } from '../../services/cart';
import CartItem from './CartItem';
import  {vat, deliveryCharge} from '../../constants/constants'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const cartInitialState = {
    items:[],
    amount:0,
    isEmpty: true
}
const ShoppingCart = () => {
    const [cart, setCart] = useState(cartInitialState);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            const response = await CartService.getCartItems();
            if(response.status === 200 || response.status === '200') {
                const itemLength = response.data.length;
                if(!itemLength) {
                    return;
                }
                const items = response.data.filter(ele => !ele.isPurchased);
                const amount = priceAccumulator(items);
                const isEmpty = items.length === 0 ? true : false;
                setCart({ items, amount, isEmpty});
            }
        }
        fetchCart();
    }, []);
    useEffect(() => {
        // update component after every cart state change without infinite looping
    }, [cart]);
    const cartQuantity = cart.items.length;
    const deliveryCharges = deliveryCharge;
    const VAT = Number((cart.amount * vat).toFixed(2));
    const orderTotal = cart.amount - 0 + VAT + deliveryCharges;
    
    const removeItemHandler = async (id) => {
        const response = await CartService.removeItem(id);
        if(response.status === 200 || response.status === '200') {
            const items = cart.items.filter(item => item.cartItemId !== id);
            const amount = priceAccumulator(items);
            const isEmpty = items.length === 0 ? true : false;
            setCart({...cart, items, amount, isEmpty});
        }

    }
    const quantityHandler = async (id, operation) => {
        const payload = {
            cartItemId: id,
            operation 
        }
        const response = await CartService.itemQuantityChange(payload);
            if(response.status === 200 || response.status === '200') {
                const items = cart.items;
                const index = items.findIndex(ele => ele.cartItemId === id);
                items[index].quantity = response.data.quantity;
                const amount = priceAccumulator(items);
                setCart({...cart, items, amount});
            }

    }
    const priceAccumulator = (arr) => {
        return arr.reduce((prev, curr) => prev + curr.variant.compareAtPrice*curr.quantity ,0);
    }
    const emptyCartHandler = async () => {
        const response = await CartService.emptyCart();
        if(response.status === 200 || response.status === '200') {
            setCart(cartInitialState);
        }
    }
    const checkoutHandler = async() => {
        const stockRes = await CartService.checkStock()
        if(stockRes.status === 200 || stockRes.data === '200') {
            const {data: response} = stockRes;
            if(response.isError) {
                const itemId = response.failedItems[0];
                const itemName = cart.items.find(ele => ele.cartItemId === itemId).exhibitionProduct.product.productName;
                toast.error(`Cart Item "${itemName}" exceeds exhibition stock`);
                return;
            }
            navigate('/checkout');
        }
    }
    if(!cart.isEmpty) {
        return(
            <div className='app-sc shopping-cart-sc'>
                <div className='product'>
                    <div className='app-header'>
                        <div className='back'>
                            <a href="#!" onClick={() => { navigate(-1) }}><img src={back} alt="Back" /></a>  
                        </div>
                        <div className='title'>
                            Shopping Cart
                        </div>
                        <div className='wishlist mr-3'>
                            <a href='/home'><img src={home} alt="Home" /></a>
                        </div>
                    </div>
                    <div className='check-delete'>
                        <div className="remember">
                            <label className="custom-check-box">0/{cartQuantity} Items selected (₹ 0)<input type="checkbox" name="terms" id="terms" /><span
                                className="checkmark"></span></label>
                        </div>
                        <button className='delete-btn'><img src={deleteicon} alt='delete' onClick={emptyCartHandler} /></button>
                    </div>
                    <div className='cart-items-listing'>
                        {
                            cart.items.map((item,index) => <CartItem key={index} item={item} removeItem={removeItemHandler} quantityHandler={quantityHandler}/>)
                        }
                    </div>
                    <div className='coupon'>
                        <label>Add coupon code</label>
                        <div className='coupon-group'>
                            <input type='text' placeholder='Enter coupon code' />
                            <button>Apply</button>
                        </div>
                    </div>
                    <div className='order-total'>
                        <ul>
                            <li>
                                <label>Sub Total</label>
                                <h6>₹ {Math.round(cart.amount*100)/100}</h6>
                            </li>
                            <li>
                                <label>Value Added Tax (VAT)</label>
                                <h6>₹ {Math.round(VAT*100)/100}</h6>
                            </li>
                            <li>
                                <label>Delivery Charges</label>
                                <h6>₹ {Math.round(deliveryCharges*100)/100}</h6>
                            </li>
                            <li className='total'>
                                <label>Order Total</label>
                                <h6>₹ {Math.round(orderTotal*100)/100}</h6>
                            </li>
                        </ul>
                    </div>
                    <div className='btn-wrapper'>
                        <div className='total-items-payment'>
                            <h5>{cartQuantity} Items in cart</h5>
                            <h6>₹ {Math.round(orderTotal*100)/100} </h6>
                        </div>
                        <button className='app-btn' onClick={checkoutHandler} >Secure Checkout</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='app-sc shopping-cart-sc'>
                <div className='product'>
                    <div className='app-header'>
                        <div className='back'>
                            <a href="#!" onClick={() => { navigate(-1) }}><img src={back} alt="Back" /></a>  
                        </div>
                        <div className='title'>
                            Shopping Cart
                        </div>
                        <div className='wishlist mr-3'>
                            <a href='/home'><img src={home} alt="Home" /></a>
                        </div>
                    </div>
                    <div className='empty-message' style={{display: "grid", height: "80vh", placeItems: "center"}}>
                        <h3 style={{textAlign: "center", opacity: 0.75}}>No items added in cart</h3>
                    </div>
                </div>
            </div>
        )  
    }
    
}

export default ShoppingCart