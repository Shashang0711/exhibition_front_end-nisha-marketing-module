import React, { useEffect, useState } from 'react'
import home from '../../assets/images/icon/home.svg'
import back from '../../assets/images/icon/back-arrow.svg'
import plus from '../../assets/images/icon/circle-plus.svg'
import { useNavigate } from 'react-router-dom'
import Addresses from './component/Addresses';
import Payment from './component/Payment';
import { CheckoutService } from '../../services/checkout';
import { CartService } from '../../services/cart';
import OrderPlaced from './component/OrderPlaced';
import { loadScript } from '../../utils/loadScript';
import { deliveryCharge, DEV, razorCheckoutUrl, vat } from '../../constants/constants';
import logo from '../../assets/images/icon/logo.svg';
import { getUser } from '../../utils/localstorage';
import { Checkout as CapCheckout } from 'capacitor-razorpay';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const paymentMethodInit = {
    card: {
        'card[name]': '',
        'card[number]': '',
        'card[expiry]': '',
        'card[cvv]': '',
    },
    upi: {
        vpa: '' 
    },
    netbanking: {
        bank: ''
    },
    selected: ''
}

const Checkout = () => {
    const navigate = useNavigate();
    //used throughout checkout page
    const [page, setPage] = useState(0);
    const [addressDetails, setAddressDetails] = useState([]);
    const [cartData, setCartData] = useState([]);
    // store the data of 1st step address 
    const [addressId, setAddressId] = useState('');
    // store data of 2nd step payment
    const [paymentMethod, setPaymentMethod] = useState(paymentMethodInit);
    const [btnDisable, setBtnDisable] = useState(true);
    const [orderCartItems, setOrderCartItems] = useState('');
    
    let amount = 0;
    if(cartData) {
        amount += cartData.filter(ele => !ele.isPurchased).reduce((prev, curr) => prev + curr.variant.compareAtPrice * curr.quantity, 0);
        amount += amount*vat + deliveryCharge;
    }

    const paymentChangeHandler = (newState) => {
        setPaymentMethod(newState);
        //check field status
    }
    const methodChangeHandler = (newState) => {
        setPaymentMethod(newState);
    }
    useEffect(()=>{
        const fetchAddressData = async () => {
            const res = await CheckoutService.getAddress();
            if(res.status === 200 || res.status === '200')  {
                const { data } = res;
                if(data.count !== 0)
                    setAddressDetails(data.rows);
                    handleAddress(data.rows[0].buyerDetails)
            }
        }
        const fetchCartData = async () => {
            const res = await CartService.getCartItems();
            if(res.status === 200 || res.status === '200')  {
                if(res.data.length === 0)
                    navigate(-1);
                setCartData(res.data);
            }
        }
        fetchAddressData();
        fetchCartData();
    },[]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            let flag = false;
            const method = paymentMethod[paymentMethod.selected];
            if(!method)
                flag = true;
            else {
                for(const key in method) {
                    if(method[key] === ''){
                        flag = true;
                        break;
                    }
                }
            }
            if(page === 1)
                setBtnDisable(flag);
        }, 500);
        
        return () => {
            clearTimeout(timer);
        }
    }, [paymentMethod])


    const nextPage = () => {
        if(page !== 2){
            if(page === 1) {
                placeOrder()
                return;
            }
            setPage(page => page + 1);
            setBtnDisable(true);
        }
        else {
            navigate('/home');
        }
    };
    const prevPage = ()=>{
        if(page !== 0){
            setPage(page => page - 1);
        }
        else {
            navigate(-1)
        };
    };
    const timelineTracker = (step) => {
        if(step === page)
            return 'active';
        else if(step > page)
            return '';
        else
            return 'setup'
    };
    const handleAddress = (id) => {
        setBtnDisable(false);
        setAddressId(id);
    }
    const placeOrder = async () => {
        // eslint-disable-next-line no-unused-vars
        const res = await loadScript(razorCheckoutUrl);
        // create order
        const payload = {
            amount: Math.round(amount*100)
        }
        const orderResponse = await CheckoutService.placeOrder(payload);
        try {
            if(orderResponse.status === 200 || orderResponse.status === '200') {
                console.log(orderResponse.data);
                //prefill payment and user details
                const paymentObj = {
                    method: paymentMethod.selected
                };
                const selectedMethod = paymentMethod[paymentMethod.selected];
                for (const key in selectedMethod) {
                    paymentObj[key] = selectedMethod[key]
                }
                const user = getUser();
                const prefillOptions = {
                    name: paymentObj["card[name]"] ?? '',
                    contact: user.mobileNo,
                    email: user.email,
                    ...paymentObj,
                }
                const options = {
                    key: DEV ? process.env.REACT_APP_RAZORPAY_KEY_ID : process.env.REACT_APP_RAZORPAY_KEY_ID,
                    currency: "INR",
                    amount: amount,
                    order_id: orderResponse.data.generatedOrderId,
                    name: 'hypestreet',
                    image: logo,
                    prefill: prefillOptions,
                    theme: {
                    hide_topbar: false,
                    color: "#292826",
                    },
                    send_sms_hash: true,
                }
                try {
                    const payRes = await CapCheckout.open(options);
                    razorpayHandler(orderResponse.data, payRes.response);
                } catch (error) {
                    toast.error(error.message);
                }

            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    const razorpayHandler = async function (orderResponse, response) {
        const requestPaymentPayload = {
            orderId: orderResponse.orderId,
            generatedOrderId: orderResponse.generatedOrderId,
            paymentId: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            cartItems: cartData.map(item => item.cartItemId)
        }
        const verifyPaymentRes = await CheckoutService.verifyPayment(requestPaymentPayload)
        if (!verifyPaymentRes) {
            return;
        }
        if (verifyPaymentRes.status === 200 || verifyPaymentRes.status === '200') {
            setOrderCartItems(verifyPaymentRes.data);
            setPage(page => page + 1);
        }
    }
    return(
        <React.Fragment>
            <style>
                {`
                    .app-btn:hover {
                        background: #292826;
                    }
                `}
            </style>
            <div className='app-sc checkout-sc payment-sc peyment-method order-placed'>
                <div className='address-section'>
                    {/* Header */}
                    <div className='app-header'>
                        <div className='back'>
                            {
                                page !== 2 ? <span><img src={back} alt="Back" onClick={prevPage}/></span> : ''  
                            }
                        </div>
                        <div className='title'>
                            Checkout ({page+1}/3)
                        </div>
                        <div className='wishlist mr-3'>
                            <span onClick={() => {navigate('/home')}}><img src={home} alt="Home" /></span>
                        </div>
                    </div>
                    <div className='time-line'>
                        <div className={`time-line-tab ${timelineTracker(0)}`}>
                            <div className='circle'></div>
                            <h6>Address</h6>
                        </div>
                        <div className={`time-line-tab ${timelineTracker(1)}`}>
                            <div className='circle'></div>
                            <h6>Payment</h6>
                        </div>
                        <div className={`time-line-tab ${timelineTracker(2)}`}>
                            <div className='circle'></div>
                            <h6>Order Placed</h6>
                        </div>
                    </div>
                    {/* Body */}
                    {page === 0 
                        && 
                        <React.Fragment>    
                            <h4 className='main-title'>Select delivery address</h4>
                            <button className='add-new-address' onClick={() => {navigate('/add-new-address')}}> <img src={plus} alt='Plus' /> Add New Address</button>
                            {
                                addressDetails.length !== 0 && <Addresses preserve={handleAddress} initialId={addressId} addresses={addressDetails} />
                            }
                        </React.Fragment>
                    }
      
                    {page === 1 && <Payment changePayment={paymentChangeHandler} methodHandler={methodChangeHandler} paymentObject={paymentMethod} cartDetails={cartData} /> }
                    {page === 2 && <OrderPlaced orderCartItems={orderCartItems} addressId={addressId} addresses={addressDetails} cartDetails={cartData} />}
                    {/* Body */}
                </div>
                {/* Footer */}
                <button
                    onClick={nextPage}
                    className='app-btn w-100 mb-3'
                    disabled={ btnDisable }
                >
                    {page === 1 ? `Pay INR ${Math.round(amount*100)/100}` : page === 2 ? 'Continue Shopping' : 'Next'}
                </button>
                
            </div>
        </React.Fragment>
    )
}

export default Checkout
