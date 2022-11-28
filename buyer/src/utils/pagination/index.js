import React from 'react';
import Pagination from '../../../src/common/pagination/Pagination'

const paginationFunction = (currPage, totalData, setCurrPage, noOfRecords) => {
    return (
        <React.Fragment>
            {totalData > 0 ? (
                <Pagination currPage={currPage} totalData={totalData} setPageNumber={setCurrPage} noOfRecords={noOfRecords} />
            ) : ''}
        </React.Fragment>
    );
}

export { paginationFunction }
