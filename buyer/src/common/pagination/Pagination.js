import React, { useEffect, useState } from 'react'
import { CButton, CButtonGroup } from '@coreui/react'

/****************************************
.*                                       *
.*    Don't touch this code ever         *
.*                                       *
*****************************************/

const Pagination = ({ totalData, currPage, setPageNumber, noOfRecords }) => {
  let pageArray = [];
  const [pageArrayState, setPageArrayState] = useState(pageArray)
  const [tempState, setTempState] = useState(0)
  useEffect(() => {
      setPageArray();
  }, [])
  useEffect(() => {
      setPageArray();
  }, [tempState, totalData, noOfRecords])
  const setPageArray = () => {
    pageArray = [];
    let localtotalData = totalData;
    let localcurrPage = currPage;
    let localnoOfRecords = noOfRecords;
    const totalPages = Math.ceil(localtotalData / localnoOfRecords);
    if (localcurrPage > 1) {
      pageArray.push({
        pageNumber: localcurrPage - 1,
        previous: true,
        next: false,
        button1: false,
        button2: false,
        button3: false,
        button4: false,
        button5: false,
        button6: false,
        button7: false,
        button0: false,
      });
    }
    if (localcurrPage > 3) {
      pageArray.push({
        pageNumber: 1,
        previous: false,
        next: false,
        button1: false,
        button2: false,
        button3: false,
        button4: false,
        button5: false,
        button6: false,
        button7: true,
        button0: false,
      });
      pageArray.push({
        pageNumber: '...',
        previous: false,
        next: false,
        button1: false,
        button2: false,
        button3: false,
        button4: false,
        button5: false,
        button6: false,
        button7: false,
        button0: true,
      });
    }
    for (let i = 1; i <= totalPages; i++) {
      if (i === localcurrPage) {
        pageArray.push({
          pageNumber: i,
          previous: false,
          next: false,
          button1: false,
          button2: true,
          button3: false,
          button4: false,
          button5: false,
          button6: false,
          button7: false,
          button0: false,
        });
      } else if (i === localcurrPage - 1) {
        pageArray.push({
          pageNumber: i,
          previous: false,
          next: false,
          button1: true,
          button2: false,
          button3: false,
          button4: false,
          button5: false,
          button6: false,
          button7: false,
          button0: false,
        });
      } else if (i === localcurrPage + 1) {
        pageArray.push({
          pageNumber: i,
          previous: false,
          next: false,
          button1: false,
          button2: false,
          button3: true,
          button4: false,
          button5: false,
          button6: false,
          button7: false,
          button0: false,
        });
      } else if (i === localcurrPage + 2 && localcurrPage + 2 < totalPages) {
        pageArray.push({
          pageNumber: '...',
          previous: false,
          next: false,
          button1: false,
          button2: false,
          button3: false,
          button4: true,
          button5: false,
          button6: false,
          button7: false,
          button0: false,
        });
      } else if (i === totalPages - 1) {
        pageArray.push({
          pageNumber: i,
          previous: false,
          next: false,
          button1: false,
          button2: false,
          button3: false,
          button4: false,
          button5: true,
          button6: false,
          button7: false,
          button0: false,
        });
      } else if (i === totalPages) {
        pageArray.push({
          pageNumber: i,
          previous: false,
          next: false,
          button1: false,
          button2: false,
          button3: false,
          button4: false,
          button5: false,
          button6: true,
          button7: false,
          button0: false,
        });
      } else {
        pageArray.push({
          pageNumber: i,
          previous: false,
          next: false,
          button1: false,
          button2: false,
          button3: false,
          button4: false,
          button5: false,
          button6: false,
          button7: false,
          button0: false,
        });
      }
    }
    if (localcurrPage !== totalPages && pageArray.length > 0) {
      pageArray.push({
        pageNumber: localcurrPage + 1,
        previous: false,
        next: true,
        button1: false,
        button2: false,
        button3: false,
        button4: false,
        button5: false,
        button6: false,
        button7: false,
        button0: false,
      });
    }
    setPageArrayState(pageArray);
  }

  const setPageAndState = (page) => {
    setTempState(page)
    setPageNumber(page)
  }
  return (
    <button role="group" aria-label="Basic outlined example">
      {pageArrayState.length > 0 && pageArrayState.map((page, index) =>
        <React.Fragment key={index}>
          {page.previous ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)} >
                  Previous
              </button>
              : ''}
          {page.button0 ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" disabled>
                  {page.pageNumber}
              </button>
              : ''}
          {page.button7 ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </button>
              : ''}
          {page.button1 ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </button>
              : ''}
          {page.button2 ?
              <button color="primary" className="custom-pagination" size="sm" onClick={() => setPageAndState(page.pageNumber)} >
                  {page.pageNumber}
              </button>
              : ''}
          {page.button3 ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </button>
              : ''}
          {page.button4 ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" disabled>
                  {page.pageNumber}
              </button>
              : ''}
          {page.button6 ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </button>
              : ''}
          {page.next ?
              <button color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)} >
                  Next
              </button>
              : ''}
        </React.Fragment>
      )}
    </button>
  )
}

export default Pagination;