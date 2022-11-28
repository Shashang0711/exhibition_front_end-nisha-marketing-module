import React from 'react';
import { CPaginationItem, CPagination } from '@coreui/react';

const Pagination = () => {
    return (
        <>
            <CPagination align="end" aria-label="Page navigation example">
                <CPaginationItem disabled>Previous</CPaginationItem>
                <CPaginationItem>1</CPaginationItem>
                <CPaginationItem>2</CPaginationItem>
                <CPaginationItem>3</CPaginationItem>
                <CPaginationItem>Next</CPaginationItem>
            </CPagination>
        </>
    );
}

export default Pagination;