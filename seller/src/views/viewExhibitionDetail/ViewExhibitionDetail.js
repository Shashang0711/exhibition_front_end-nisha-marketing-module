import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { exhService } from 'src/services/exhibitions'
import { cilUser, cilEnvelopeClosed, cilGem, cilCalendar, cilShareAlt, cilToggleOn, cilCopy, cilDrop, cilPlus, cilHamburgerMenu } from '@coreui/icons'
import "./ViewExhibitionDetail.css"
import { toast } from 'react-toastify'
import { element } from 'prop-types'

const ViewExhibitionDetail = () => {
    const [viewExhibitionDetailList, setViewExhibitionDetailList] = useState([]);
    const { viweEx_Id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchExhibitionList();
    }, [])

    const fetchExhibitionList = async () => {
        const viewExDetailRes = await exhService.getExhibiton(viweEx_Id);
        if (!viewExDetailRes) {
            return;
        }
        if (viewExDetailRes.status === 200) {
            setViewExhibitionDetailList(viewExDetailRes.data)

        }
    }


    return (
        <>
            <CRow >
                <div className='app-table viewExhibitionDetail'>
                    <CCol xs={12}>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>{viewExhibitionDetailList?.exhibitionName}</strong>
                                <CButton color="secondary" onClick={() => {
                                    navigate("/inventory/exhibitions")
                                }}>Back</CButton>
                            </CCardHeader>
                            <CCardBody>
                                <CRow >
                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilUser} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className=''>
                                                        <CCardTitle>User Name</CCardTitle>
                                                        <CCardText>
                                                            {viewExhibitionDetailList?.user?.userName}
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>

                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilEnvelopeClosed} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className=''>
                                                        <CCardTitle>User Email</CCardTitle>
                                                        <CCardText>
                                                            {viewExhibitionDetailList?.user?.email}
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <br />
                                <CRow >
                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilGem} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className=''>
                                                        <CCardTitle>Subscription</CCardTitle>
                                                        <CCardText>
                                                            {viewExhibitionDetailList?.userSubscription?.subscriptionPlan?.subscriptionPlanName}
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>

                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilPlus} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className=''>
                                                        <CCardTitle>Add Ons Consumed</CCardTitle>
                                                        <CCardText>
                                                            {viewExhibitionDetailList && viewExhibitionDetailList?.exhibitionSellerAddOns && viewExhibitionDetailList?.exhibitionSellerAddOns.length > 0 ?
                                                                <>
                                                                    {viewExhibitionDetailList && viewExhibitionDetailList?.exhibitionSellerAddOns && viewExhibitionDetailList?.exhibitionSellerAddOns.map((element, index) => {
                                                                        if (index === viewExhibitionDetailList?.exhibitionSellerAddOns.length - 1) {
                                                                            return `${element?.sellerAddOn?.addOn?.addOnName}`
                                                                        } else {
                                                                            return `${element?.sellerAddOn?.addOn?.addOnName} , `;
                                                                        }
                                                                    })}
                                                                </>
                                                                : <>
                                                                    No add-ons applied
                                                                </>}
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <br />
                                <CRow >
                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilCalendar} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className=''>
                                                        <CCardTitle>Start Date</CCardTitle>
                                                        <CCardText>
                                                            {viewExhibitionDetailList?.exhibitionStartDate?.slice(0, 10)}
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>

                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilCalendar} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className=''>
                                                        <CCardTitle>End Date</CCardTitle>
                                                        <CCardText>
                                                            {viewExhibitionDetailList?.exhibitionEndDate?.slice(0, 10)}
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <br />
                                <CRow >
                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilHamburgerMenu} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className="flex-grow-1">
                                                        <CCardTitle>Exhibitions Category</CCardTitle>
                                                        <CCardText className='linkText'>
                                                            {viewExhibitionDetailList && viewExhibitionDetailList?.exhCategoryExhibitions && viewExhibitionDetailList?.exhCategoryExhibitions.length > 0 ?
                                                                <>
                                                                    {viewExhibitionDetailList && viewExhibitionDetailList?.exhCategoryExhibitions && viewExhibitionDetailList?.exhCategoryExhibitions.map((element, index) => {
                                                                        if (index === viewExhibitionDetailList?.exhCategoryExhibitions.length - 1) {
                                                                            return `${element?.exhCategory?.exhCategoryName}`
                                                                        } else {
                                                                            return `${element?.exhCategory?.exhCategoryName} , `;
                                                                        }
                                                                    })}
                                                                </>
                                                                : <>
                                                                    No add Exhibitions Category
                                                                </>}
                                                        </CCardText>

                                                    </div>


                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>

                                    <CCol sm={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilDrop} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className="flex-grow-1">
                                                        <CCardTitle>Product Details</CCardTitle>
                                                        <CCardText className='linkText'>
                                                            <Link to={`/inventory/exhibitions/exhibitionproducts/${viweEx_Id}`} >
                                                                View
                                                            </Link>
                                                        </CCardText>
                                                    </div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <br />
                                <CRow >
                                    <CCol md={6}>
                                        <CCard className="cardColor details-card">
                                            <CCardBody>
                                                <div className='d-flex'>
                                                    <div className='col-sm-1 cardIcon'> <CIcon icon={cilShareAlt} className="text-high-emphasis-inverse svg-img" /></div>
                                                    <div className="flex-grow-1">
                                                        <CCardTitle>Share Link</CCardTitle>
                                                        <CCardText className='linkText'>
                                                            {viewExhibitionDetailList?.shareLink}
                                                        </CCardText>

                                                    </div>

                                                    <div><CIcon icon={cilCopy} onClick={() => {
                                                        navigator.clipboard.writeText(viewExhibitionDetailList?.shareLink);
                                                        toast.success('Exhibition link copied');
                                                    }} className="svg-copy"></CIcon></div>
                                                </div>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>


                                </CRow>

                            </CCardBody>
                        </CCard>

                    </CCol>
                </div>
            </CRow>
        </>
    )
}

export default ViewExhibitionDetail