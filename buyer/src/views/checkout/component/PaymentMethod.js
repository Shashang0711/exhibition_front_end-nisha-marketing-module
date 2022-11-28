import React from 'react'
import back from '../../../assets/images/icon/back-arrow.svg'
import close from '../../../assets/images/icon/close.svg'
import annas from '../../../assets/images/product/annas.png'
import info from '../../../assets/images/icon/info.svg'
import razor from '../../../assets/images/icon/razor.svg'
import phone from '../../../assets/images/icon/phone-input.svg'
import creditcard from '../../../assets/images/icon/credit-card-theme.svg'
import sbi from '../../../assets/images/icon/sbi.png'
import hdfc from '../../../assets/images/icon/hdfc.png'
import icici from '../../../assets/images/icon/icici.png'
import axis from '../../../assets/images/icon/axis.png'
import kotak from '../../../assets/images/icon/kotak.png'
import yes from '../../../assets/images/icon/yes.png'

const PaymentMethod = () =>{
    return(
        <div className='app-sc checkout-sc peyment-method'>
            <div className='address-section'>
                <div className='app-header'>
                    <div className='back'>
                        <a href="#!"><img src={back} alt="Back" /></a>  
                    </div>
                    <div className='close mr-3'>
                        <a href='#!'><img src={close} alt="Home" /></a>
                    </div>
                </div>
                <div className='product-details'>
                    <div className='icon'>
                        <img src={annas} alt="Product" />
                    </div>
                    <div className='content'>
                        <h4>Anna’s Fashion Store</h4>
                        <h5>2 Item</h5>
                        <h6>₹ 1,780</h6>
                    </div>
                </div>
                <div className='trust'>
                    <h2> <img src={razor}></img> Razorpay Trusted Business</h2>
                    <img className='info' src={info}></img>
                </div>
                <form>
                    <div className='form-group icon mobile-form'>
                        <input tye="text" className='app-input' placeholder="+91 000 000 1000" />
                        <div className='icon'><img src={phone} /></div>
                    </div>
                    <div className='main-title'>Cards, UPI & More</div>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <div className='icon'>
                                        <img src={creditcard} alt="Icon" />
                                    </div>
                                    <div className='content'>
                                        <h5>Card</h5>
                                        <h6>Visa, MasterCard, PuPay & More</h6>
                                    </div>
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <div className='row g-2'>
                                        <div className='form-group col-8'>
                                            <input tye="text" className='app-input' placeholder="Card Number" />
                                        </div>
                                        <div className='form-group col-4'>
                                            <input tye="text" className='app-input' placeholder="Expiry" />
                                        </div>
                                        <div className='form-group col-8'>
                                            <input tye="text" className='app-input' placeholder="Card Holder’s name" />
                                        </div>
                                        <div className='form-group col-4'>
                                            <input tye="text" className='app-input' placeholder="CVV" />
                                        </div>
                                        <div className='remember'>
                                            <label className="custom-check-box">Save card securely for future payments <a href='#!'>Know More</a> <input type="checkbox" name="terms" id="terms" /><span
                                                    className="checkmark"></span></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                    <div className='icon'>
                                        <img src={creditcard} alt="Icon" />
                                    </div>
                                    <div className='content'>
                                        <h5>UPI</h5>
                                        <h6>Pay with installed app, or use others</h6>
                                    </div>
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <div className='row g-2'>
                                        <label>
                                            <h5>UPI ID</h5>
                                            <h6>Google pay, BHIM, PhonePe & more</h6>
                                        </label>
                                        <div className='form-group col-12'>
                                            <input tye="text" className='app-input' placeholder="Enter your UPI ID" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                    <div className='icon'>
                                        <img src={creditcard} alt="Icon" />
                                    </div>
                                    <div className='content'>
                                        <h5>Netbanking</h5>
                                        <h6>All Indian Bank</h6>
                                    </div>
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <div className='bank-listing'>
                                        <div className='bank'>
                                            <img src={sbi} alt="Bank" />
                                            <h6>SBI</h6>
                                        </div>
                                        <div className='bank'>
                                            <img src={hdfc} alt="Bank" />
                                            <h6>HDFC</h6>
                                        </div>
                                        <div className='bank'>
                                            <img src={icici} alt="Bank" />
                                            <h6>ICICI</h6>
                                        </div>
                                        <div className='bank'>
                                            <img src={axis} alt="Bank" />
                                            <h6>AXIS</h6>
                                        </div>
                                        <div className='bank'>
                                            <img src={kotak} alt="Bank" />
                                            <h6>KOTAK</h6>
                                        </div>
                                        <div className='bank'>
                                            <img src={yes} alt="Bank" />
                                            <h6>YES</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className='btn-wrapper'>
                <button className='app-btn w-100'>Pay <span>₹ 251.75</span> </button>
            </div>
        </div>
    )
}

export default PaymentMethod