import React from 'react'


const NoOfRecords = ({ setNoOfRecords }) => {
    return (
        <>
            <select size="sm" aria-label="Small select example" onChange={(e) => setNoOfRecords(e.target.value)}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </>
    )
}

export default NoOfRecords