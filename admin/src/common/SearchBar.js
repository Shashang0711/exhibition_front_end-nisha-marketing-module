import React from 'react'
import {
    CFormInput
} from '@coreui/react';

const SearchBar = ({ searchVal, setSearchVal }) => {
    return (
        <>
            <CFormInput color="primary" type="search" style={{ marginRight: "10px"}} placeholder="Search" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
        </>
    )
}

export default SearchBar