import { CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'

const ViewOrderList = ({ orderList }) => {
    const [visible, setVisible] = useState(false);

    const formatOption = (variants) => {
        let str = '';
        let len = Object.keys(variants).length;
        let count = 0
        for (const key in variants) {
            if (variants.hasOwnProperty(key)) {
                if (len - 1 === count) {
                    str = str + variants[key];

                } else {
                    str = str + variants[key] + "/";

                }
                count++;
            }
        }
        return str;
    }




    return (
        <div>
            <CButton onClick={() => setVisible(true)}>View</CButton>
            <CModal className="viewOrderModal" alignment='center' visible={visible}>
                <CModalHeader>
                    <CModalTitle>View Order List</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {orderList?.orderCartItems.length <= 0 ?
                        <h4 className='no-data-found'>No Data Found</h4>
                        : <></>}
                    {orderList?.orderCartItems.length > 0 ?
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Varitant</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {
                                    orderList?.orderCartItems.map((ele, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                    <CTableDataCell>{ele?.cartItem?.exhibitionProduct?.product?.productName}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {
                                                            formatOption(ele?.cartItem?.variant?.variant)
                                                        }
                                                    </CTableDataCell>
                                                    <CTableDataCell>{ele?.cartItem?.variant?.price}</CTableDataCell>

                                                    <CTableDataCell>{ele?.cartItem?.quantity}</CTableDataCell>

                                                </CTableRow>
                                            </React.Fragment>
                                        )
                                    })


                                }



                            </CTableBody>
                        </CTable>
                        : <></>}
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => setVisible(false)}>Close</CButton>
                </CModalFooter>
            </CModal>

        </div>
    )
}

export default ViewOrderList