import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserService } from 'src/services/user';
import { storeService } from 'src/services/store';
import { toast } from 'react-toastify';
import { filesFormats, imageUrl } from 'src/constants/constants';
import { getUserFromRedux } from 'src/utils/userFromredux/getUserFromRedux';
import CountryStateCityObj from '../../../src/constants/CountryStatecity'

const StoreAddEdit = () => {
    const userFromRedux = useSelector((state) => state.user);
    const user = getUserFromRedux(userFromRedux);
    const [storeList, setStoreList] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [data, setData] = useState();
    const [getCountry, setGetCountry] = useState();
    const [selectedState, setSelectedState] = useState();
    const [getState, setGetState] = useState([]);
    const [getCity, setGetCity] = useState([]);





    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue
    } = useForm();

    const handleFile = async (imagesFromClient) => {
        const formData = new FormData();
        const upload_file = imagesFromClient;
        const fileExtention = imagesFromClient.name.split('.')
        const fsize = upload_file.size;
        const file = Math.round((fsize / 1024));
        if (upload_file && filesFormats.includes(upload_file.type) || filesFormats.includes("." + fileExtention[1])) {
            if (file >= 10000) {
                toast.warning("File too Big, please select a file less than 10MB")
            } else {
                formData.append("logo", imagesFromClient);
                const imagesFromServer = await storeService.filePost(formData);
                return imagesFromServer;
            }
        } else {
            toast.warning("Only jpg and png files are allowed!")
        }

    };

    const addEditStoreDetails = async (e) => {
        // e.country = getCountry
        // e.state = selectedState
        // e.city = getCity[0].name
        let storeLogo = await handleFile(e.storeLogo[0]);
        if (!storeLogo) {
            return;
        }
        const payload = {
            storeId: storeList.storeId,
            storeName: e.storeName,
            storeLogo: storeLogo.data.filename,
            mobileNo: e.mobileNo,
            email: e.email,
            storeNo: e.storeNo,
            area: e.area,
            landmark: e.landmark,
            country: e.country,
            city: e.city,
            state: e.state,
            pincode: e.pincode,


        };
        console.log("payload", payload)
        if (storeList) {
            const storeUpdateRes = await storeService.updateStore(payload);
            if (!storeUpdateRes) {
                return;
            }
            if (storeUpdateRes.status === 200 || storeUpdateRes.status === '200') {
                toast.success(storeUpdateRes.data)
                fetchStore()
            } else {
                toast.error('Failed to update Store');
            }
            fetchStore()

        } else {
            const storeAddRespose = await storeService.addStore(payload);
            if (!storeAddRespose) {
                return;
            }
            if (storeAddRespose.status === 200 || storeAddRespose.status === '200') {
                toast.success('Store added successfully')
                fetchStore()
                navigate('/inventory/exhibitions')
            } else {
                toast.error('Failed to add Store');
            }

            fetchStore()
        }
    }



    useEffect(() => {
        if (storeList) {
            storeBind()
        }
    }, [storeList, data])


    const storeBind = () => {
        setValue("storeId", storeList.storeId)
        // setValue("userId",storeList.)
        setValue("storeName", storeList.storeName)
        setValue("storeLogo", storeList.storeLogo)
        setValue("mobileNo", storeList.mobileNo)
        setValue("email", storeList.email)
        setValue("storeNo", storeList.storeNo)
        setValue("area", storeList.area)
        setValue("landmark", storeList.landmark)
        setValue("country", storeList.country)
        setValue("state", storeList.state)
        setValue("city", storeList.city)
        setValue("pincode", storeList.pincode)
    }

    // fitering the Country state and city
    const getCountryStateCity = async () => {
        if (CountryStateCityObj && CountryStateCityObj.CountrtStateCity) {
            setData(CountryStateCityObj.CountrtStateCity)

        }
    }

    useEffect(() => {
        getCountryStateCity()
    }, [data, CountryStateCityObj.CountrtStateCity])


    const country = [...new Set(data && data.map(item => item.country))]
    country.sort()

    const handleCountry = (e) => {

        let states = data.filter(state => state.country === e.target.value)
        states = [...new Set(states.map(item => item.subcountry))]
        states.sort()
        setGetCountry(e.target.value)
        setGetState(states)
    }

    const handleState = (e) => {
        let cities = data.filter(city => city.subcountry === e.target.value)
        setSelectedState(e.target.value)
        setGetCity(cities)
    }


    useEffect(() => {
        fetchStore()
    }, [data])

    const fetchStore = async () => {
        const obj = CountryStateCityObj.CountrtStateCity
        const storesRespose = await storeService.getStore()
        if (!storesRespose) {
            return;
        }
        if (storesRespose.status === 200 || storesRespose.status === '200') {
            setStoreList(storesRespose.data)
            console.log("storesRespose.data", storesRespose.data)
            // set state while editing
            let states = data && data.filter(state => state.country === storesRespose.data.country)
            states = [...new Set(states && states.map(item => item.subcountry))]
            states.sort()
            setGetCountry(storesRespose.data.country)
            console.log("states", states)
            setGetState(states)

            // set city while editing
            let cities = data && data.filter(city => city.subcountry === storesRespose.data.state)
            setSelectedState(storesRespose.data.state)
            setGetCity(cities)

        }
    }







    return (
        <>
            <CRow>
                <div className='app-table'>
                    <CCol xs={12}>
                        <CCard className="mb-4 overflow-auto">
                            <CCardHeader>
                                <strong>Store Details</strong>
                                <CButton color="dark" variant="outline" onClick={() => navigate('/dashboard')}>Back</CButton>
                            </CCardHeader>
                            <CCardBody>
                                <br />
                                <CForm onSubmit={handleSubmit(addEditStoreDetails)}>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticStoreName" className="col-sm-2 col-form-label">Store Name</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticStoreName"
                                                defaultValue={storeList ? storeList.storeName : ""}
                                                {...register("storeName", {
                                                    required: "Store name is required",

                                                })}
                                                onKeyUp={() => {
                                                    trigger("storeName");
                                                }}
                                                placeholder="Enter store name"
                                            />
                                            {errors.storeName && (
                                                <span className='error-msg text-danger'>
                                                    {errors.storeName?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">Upload Store Logo</CFormLabel>
                                        <CCol sm={6}>
                                            <>

                                                <CFormInput
                                                    type="file"
                                                    id="storeLogo"
                                                    name="storeLogo"
                                                    multiple
                                                    accept="image/png"
                                                    {...register("storeLogo", {
                                                        required: "Store image is required"
                                                    })}
                                                />
                                                {errors.storeLogo && (
                                                    <small className="text-danger">
                                                        {errors.storeLogo.message}
                                                    </small>
                                                )}
                                                <div className='mt-2'>
                                                    {storeList ?
                                                        <img src={imageUrl + storeList?.storeLogo} alt="store" height="5%" width="10%" />
                                                        :
                                                        null
                                                    }

                                                </div>

                                            </>
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Phone Number</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.mobileNo : ""}
                                                {...register("mobileNo", {
                                                    required: "Mobile number is required",
                                                    pattern: {
                                                        value: /^(0|91)?[6-9][0-9]{9}$/,
                                                        message: "Invalid mobile number"
                                                    },
                                                })}
                                                onKeyUp={() => {
                                                    trigger("mobileNo");
                                                }}
                                                placeholder="Enter mobile number"
                                            />
                                            {errors.mobileNo && (
                                                <span className='error-msg text-danger'>
                                                    {errors.mobileNo?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Email</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.email : ""}
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address",
                                                    },
                                                })}
                                                onKeyUp={() => {
                                                    trigger("email");
                                                }}
                                                placeholder="Enter email"
                                            />
                                            {errors.email && (
                                                <span className='error-msg text-danger'>
                                                    {errors.email?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Store Number</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.storeNo : ""}
                                                {...register("storeNo", {
                                                    required: "Store number is required",

                                                })}
                                                onKeyUp={() => {
                                                    trigger("storeNo");
                                                }}
                                                placeholder="Enter store number"
                                            />
                                            {errors.storeNo && (
                                                <span className='error-msg text-danger'>
                                                    {errors.storeNo?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Area / street / village</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormTextarea
                                                id="exampleFormControlTextarea1"
                                                // label="Example textarea"
                                                rows="3"
                                                // text="Must be 8-20 words long."
                                                {...register("area", {
                                                    required: "Area / street / village is required",

                                                })}
                                                onKeyUp={() => {
                                                    trigger("area");
                                                }}
                                                defaultValue={storeList ? storeList.area : ""}
                                                placeholder="Enter Area / street / village"
                                            ></CFormTextarea>
                                            {errors.area && (
                                                <span className='error-msg text-danger'>
                                                    {errors.area?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Landmark</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.landmark : ""}
                                                {...register("landmark", {
                                                    required: "Landmark is required",

                                                })}
                                                onKeyUp={() => {
                                                    trigger("landmark");
                                                }}
                                                placeholder="Enter Landmark"
                                            />
                                            {errors.landmark && (
                                                <span className='error-msg text-danger'>
                                                    {errors.landmark?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>


                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Country</CFormLabel>
                                        <CCol sm={6}>

                                            <CFormSelect
                                                aria-label="select country"
                                                name='country'
                                                {...register('country', { required: 'Country is required' })}
                                                onKeyUp={() => {
                                                    trigger('country')
                                                }}
                                                //value={getCountry}
                                                onChange={(e) => handleCountry(e)}
                                            >
                                                <option hidden>select country</option>
                                                {country.map((items, index) =>
                                                    <option value={items} key={index}>{items}</option>
                                                )
                                                }


                                            </CFormSelect>
                                            {errors.country && (
                                                <span className="text-danger">
                                                    {errors.country.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">State</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormSelect
                                                aria-label="select state"
                                                name='state'
                                                {...register('state', { required: 'State is required' })}
                                                onKeyUp={() => {
                                                    trigger('state')
                                                }}
                                                onChange={(e) => handleState(e)}
                                            >
                                                <option hidden>select state</option>
                                                {getState.map((items, index) =>
                                                    <option value={items} key={index}>{items}</option>
                                                )
                                                }

                                            </CFormSelect>
                                            {errors.state && (
                                                <span className="text-danger">
                                                    {errors.state.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">City</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormSelect
                                                aria-label="select city"
                                                name='city'
                                                {...register('city', { required: 'City is required' })}
                                                onKeyUp={() => {
                                                    trigger('city')
                                                }}
                                            >
                                                <option hidden>select city</option>
                                                {getCity && getCity.map((items, index) =>
                                                    <option key={index} value={items.name}>{items.name}</option>
                                                )
                                                }
                                            </CFormSelect>
                                            {errors.city && (
                                                <span className="text-danger">
                                                    {errors.city.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>


                                    {/* <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Town/City</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.city : ""}
                                                {...register("city", {
                                                    required: "City is required",

                                                })}
                                                onKeyUp={() => {
                                                    trigger("city");
                                                }}
                                                placeholder="Enter city"
                                            />
                                            {errors.city && (
                                                <span className='error-msg text-danger'>
                                                    {errors.city?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">State</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.state : ""}
                                                {...register("state", {
                                                    required: "State is required",

                                                })}
                                                onKeyUp={() => {
                                                    trigger("state");
                                                }}
                                                placeholder="Enter state"
                                            />
                                            {errors.state && (
                                                <span className='error-msg text-danger'>
                                                    {errors.state?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow> */}

                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="staticNumber" className="col-sm-2 col-form-label">Pincode</CFormLabel>
                                        <CCol sm={6}>
                                            <CFormInput type="text" id="staticNumber"
                                                defaultValue={storeList ? storeList.pincode : ""}
                                                {...register("pincode", {
                                                    required: "Pincode is required",
                                                    // pattern: {
                                                    //     value: /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/i,
                                                    //     message: "Please enter valid Pinecode"
                                                    // }

                                                })}
                                                onKeyUp={() => {
                                                    trigger("pincode");
                                                }}
                                                placeholder="Enter pincode"
                                            />
                                            {errors.pincode && (
                                                <span className='error-msg text-danger'>
                                                    {errors.pincode?.message}
                                                </span>
                                            )}
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3">

                                        <CCol className="mb-3">
                                            {storeList ?
                                                <CButton color="primary" type='submit' variant="outline">Update Store</CButton> :

                                                <CButton color="primary" type='submit'>Add Store</CButton>
                                            }

                                        </CCol>

                                    </CRow>
                                </CForm>


                            </CCardBody>
                        </CCard>

                    </CCol>
                </div>
            </CRow>

        </>
    )
}

export default StoreAddEdit
