import React from 'react'
import home from '../../../assets/images/icon/home.svg'
import back from '../../../assets/images/icon/back-arrow.svg'
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { CheckoutService } from '../../../services/checkout';

const AddNewAddress = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
    } = useForm();
    const formHandler = async (e) => {
        const payload = {...e}
        const res = await CheckoutService.addNewAddress(payload);
        if(res.status === 200 || res.status === '200') {
            navigate(-1);
        }
    }
    return(
        <div className='app-sc checkout-sc new-address'>
            <div className='address-section'>
                <div className='app-header'>
                    <div className='back'>
                        <a href="#!"><img src={back} alt="Back" onClick={()=>{navigate(-1)}}/></a>  
                    </div>
                    <div className='title'>
                        Enter a shipping address
                    </div>
                    <div className='wishlist mr-3'>
                        <a href='#!'><img src={home} alt="Home" onClick={()=>{navigate('/home')}} /></a>
                    </div>
                </div>
                <h4 className='main-title'>Add a new address</h4>
                <form onSubmit={handleSubmit(formHandler)}>
                    <div className='form-group'>
                        <select className="app-input" placeholder="Select Groups" {...register("country", { required: "Country is required" })}>
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="Russia">Rassia</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Full Name</label>
                        <input type="text" className='app-input' placeholder="Enter Full Name" {...register("fullname", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>Mobile number</label>
                        <input type="text" className='app-input' placeholder="10-digit mobile number without prefixes" {...register("mobileNo", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>Pincode</label>
                        <input type="text" className='app-input' placeholder="6 digits [0-9] PIN code" {...register("pincode", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>Flat, House no., Building, Compnay, Apartment</label>
                        <input type="text" className='app-input' placeholder="Enter Address" {...register("houseNo", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>Area, Street, Sector, Village</label>
                        <input type="text" className='app-input' placeholder="Enter Area" {...register("area", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>Landmark</label>
                        <input type="text" className='app-input' placeholder="Enter Landmark" {...register("landmark", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>Town/City</label>
                        <input type="text" className='app-input' placeholder="Enter City" {...register("city", { required: true })}/>
                    </div>
                    <div className='form-group'>
                        <label>State</label>
                        <select className="app-input" placeholder="Select Groups" {...register("state", { required: true })}>
                            <option value="">Select</option>
                            <option value="Gujarat">Gujrat</option>
                            <option value="Pune">Pune</option>
                            <option value="Maharashtra">Maharashtra</option>
                        </select>
                    </div>
                    <div className='form-group mb-4'>
                        <label>Address Type</label>
                        <select className="app-input" placeholder="Select Groups" {...register("addressType", { required: true })}>
                            <option value="">Select an Address Type</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                        </select>
                    </div>
                    <div className='btn-wrapper'>
                        <button className='app-btn w-100' type="submit">Add address</button>
                    </div>
                </form>
            </div>
            
         </div>
    )
}

export default AddNewAddress
