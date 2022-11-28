import React from 'react'
import {
    CFormSelect
} from '@coreui/react';

const NoOfRecords = ({ setNoOfRecords }) => {
    return (
        <>
            <CFormSelect className='form-control' style={{width: "80px", marginRight: "10px"}} aria-label="Small select example" onChange={(e) => setNoOfRecords(e.target.value)}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </CFormSelect>
        </>
    )
}

export default NoOfRecords