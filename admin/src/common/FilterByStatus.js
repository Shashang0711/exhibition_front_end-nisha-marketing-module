import React from 'react'
import {
    CFormSelect
} from '@coreui/react';

const FilterByStatus = ({ setFilterByStatus }) => {
    return (
        <>
            <CFormSelect className='form-control' size="sm" aria-label="Small select example" onChange={(e) => setFilterByStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
            </CFormSelect>
        </>
    )
}

export default FilterByStatus;
