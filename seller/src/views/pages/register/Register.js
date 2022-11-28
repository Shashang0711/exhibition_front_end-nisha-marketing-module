import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CRow,
  CFormCheck,
} from '@coreui/react'
import Select from 'react-select';
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilPhone, cilStorage } from '@coreui/icons'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { AuthService } from 'src/services/auth';
import { CatService } from '../../../services/categories';
import { getMobileNo, removeMobileNo, setToken } from 'src/utils/localstorage';
import Page404 from '../page404/Page404';
// import "./style.css";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch
  } = useForm();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const getCategoriesResponse = await CatService.getCategories();
    if (!getCategoriesResponse) {
      return;
    }
    if (getCategoriesResponse.status === 200 || getCategoriesResponse.status === '200') {
      const allCategories = getCategoriesResponse.data;
      allCategories.forEach((category) => {
        setCategories((existingCategories) => [
          ...existingCategories,
          { value: category.categoryId, label: category.name },
        ]);
      });
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const [selectedOptions, setSelectedOptions] = useState();
  const handleSelect = (data) => {
    setSelectedOptions(data);
  }

  const handleRegister = async (e) => {
    e.mobileNo = getMobileNo();
    e.categoryIds = selectedOptions;
    const payload = {
      userName: e.userName,
      email: e.email,
      password: e.password,
      mobileNo: e.mobileNo,
      categoryIds: e.categoryIds
    }
    const registerSellerResponse = await AuthService.registerSeller(payload);
    if (!registerSellerResponse) {
      return;
    }
    if (registerSellerResponse.status === 201 || registerSellerResponse.status === '201') {
      const accessToken = registerSellerResponse.data.accessToken;
      const user = JSON.stringify(registerSellerResponse.data.user);
      setToken(accessToken);
      dispatch({ type: 'user', user: user }) // setting user in redux
      removeMobileNo();
      toast.success('You account has been created successfully');
      navigate('/purchase/subscriptions');
    }
  }

  return (
    <>
      {
        // Checking if user has entered mobile no, or redirect to error page
        getMobileNo() ?
          <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
              <CRow className="justify-content-center">
                <CCol md={9} lg={7} xl={6}>
                  <CCard className="mx-4">
                    <CCardBody className="p-4">
                      <CForm onSubmit={handleSubmit(handleRegister)}>
                        <h1>Enter you details</h1>
                        <p className="text-medium-emphasis">Finish Signing Up</p>
                        <div className="mb-3">
                          <CInputGroup>
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              id="userName"
                              name="userName"
                              placeholder="Enter fullname*"
                              // autoComplete="userName"
                              {...register('userName', {
                                required: 'Username is required',
                                minLength: {
                                  value: 3,
                                  message: 'Username must be at least 3 characters long',
                                },
                                maxLength: {
                                  value: 25,
                                  message: "Username must be not so characters long"
                                },
                                pattern: {
                                  value: /^[A-Za-z ]+$/i,
                                  message: "Please input alphabet characters only"
                                }
                              })}
                              onKeyUp={() => {
                                trigger('userName');
                              }}
                            />
                          </CInputGroup>
                          {errors.userName && (
                            <span className='error-msg'>
                              {errors.userName?.message}
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <CInputGroup>
                            <CInputGroupText>@</CInputGroupText>
                            <CFormInput
                              id="email"
                              name="email"
                              placeholder="Email*"
                              // autoComplete="email"
                              {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              onKeyUp={() => {
                                trigger('email');
                              }}
                            />
                          </CInputGroup>
                          {errors.email && (
                            <span className='error-msg'>
                              {errors.email?.message}
                            </span>
                          )}
                        </div>
                        <div className='mb-3'>
                          <CInputGroup>
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Password*"
                              // autoComplete="new-password"
                              {...register('password', {
                                required: 'Password is required',
                                pattern: {
                                  value: /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})+$/i,
                                  message: 'Password should include at least one uppercase, one numeric value and one special character'
                                },
                                minLength: {
                                  value: 6,
                                  message: 'Password must be at least 6 characters long',
                                },
                              })}
                              onKeyUp={() => {
                                trigger('password');
                              }}
                            />
                          </CInputGroup>
                          {errors.password && (
                            <span className='error-msg'>
                              {errors.password?.message}
                            </span>
                          )}
                        </div>
                        <div className='mb-3'>
                          <CInputGroup>
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                              type="password"
                              id='confirmPassword'
                              name='confirmPassword'
                              placeholder="Confirm password*"
                              // autoComplete="new-password"
                              {...register('confirmPassword', {
                                required: 'Confirm password is required',
                                validate: (val) => {
                                  if (watch('password') !== val) {
                                    return 'Your passwords do not match';
                                  }
                                },
                                pattern: {
                                  value: /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})+$/i,
                                  message: "Not allow whitespaces"
                                },
                              })}
                              onKeyUp={() => {
                                trigger('confirmPassword');
                              }}
                            />
                          </CInputGroup>
                          {errors.confirmPassword && (
                            <span className='error-msg'>
                              {errors.confirmPassword?.message}
                            </span>
                          )}
                        </div>
                        <div className='mb-3'>
                          <CInputGroup>
                            <CInputGroupText>
                              <CIcon icon={cilPhone} />
                            </CInputGroupText>
                            <CFormInput
                              type="text"
                              id="mobileNo"
                              name="mobileNo"
                              placeholder="Mobile Number*"
                              disabled
                              readOnly
                              defaultValue={getMobileNo()}
                              value={getMobileNo()}
                            />
                          </CInputGroup>
                        </div>
                        <div className='mb-3'>
                          <CInputGroup>
                            <CInputGroupText>
                              <CIcon icon={cilStorage} />
                            </CInputGroupText>
                            {/* <CFormSelect placeholder="Username" autoComplete="username" 
                            // required
                            {...register('category', { required: 'Select category' })}
                          >
                            <option value={``}>Select Category</option>
                            {categories.map((category) => {
                              return (
                                <React.Fragment key={category.categoryId}>
                                  <option value={category.categoryId}>{category.name}</option>
                                </React.Fragment>
                              );
                            })}
                          </CFormSelect> */}
                            <Select
                              id='categoryIds'
                              name='categoryIds'
                              options={categories}
                              placeholder='Select Categoires'
                              onChange={handleSelect}
                              isSearchable={true}
                              isMulti
                              style={{ width: '100%' }}
                              required
                            />
                          </CInputGroup>
                          {errors.category && (
                            <span className='error-msg'>
                              {errors.category?.message}
                            </span>
                          )}
                        </div>

                        <div className='mb-3'>
                          {/* <CFormCheck
                            // id="flexCheckDefault"
                            label="I agree to the Terms of Service and Privacy Policy"
                            {...register("privacy", {
                              required: "term condition is required",

                            })}
                            onKeyUp={() => {
                              trigger("privacy");
                            }}
                          /> */}
                          <label className="custom-check-box me-2"><input type="checkbox" className='w-auto me-2' name="terms"
                            {...register("privacy", {
                              required: "Term condition is required",

                            })}
                            onKeyUp={() => {
                              trigger("privacy");
                            }}
                          />I agree to the <span style={{ cursor: "pointer" }} onClick={() => navigate('/termsandtonditions')}><u>Terms of Service</u></span> and <span
                            style={{ cursor: "pointer" }} onClick={() => navigate('/policy')}><u>policy</u></span> <span className="checkmark"></span></label>
                          <br />
                          {errors.privacy && (
                            <span className='text-danger'>
                              {errors.privacy?.message}
                            </span>
                          )}
                        </div>

                        <div className="d-grid">
                          <CButton
                            color="primary"
                            type="submit"
                          // onClick={() => { navigate('/dashboard') }}
                          >
                            Create Account
                          </CButton>
                        </div>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CContainer>
          </div>
          :
          <Page404 />
      }
    </>
  )
}

export default Register
