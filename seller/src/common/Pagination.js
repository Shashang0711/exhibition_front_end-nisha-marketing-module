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
    <CButtonGroup role="group" aria-label="Basic outlined example">
      {pageArrayState.length > 0 && pageArrayState.map((page, index) =>
        <React.Fragment key={index}>
          {page.previous ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)} >
                  Previous
              </CButton>
              : ''}
          {page.button0 ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" disabled>
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.button7 ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.button1 ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.button2 ?
              <CButton color="primary" className="custom-pagination" size="sm" onClick={() => setPageAndState(page.pageNumber)} >
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.button3 ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.button4 ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" disabled>
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.button6 ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)}>
                  {page.pageNumber}
              </CButton>
              : ''}
          {page.next ?
              <CButton color="primary" className="custom-pagination" variant="outline" size="sm" onClick={() => setPageAndState(page.pageNumber)} >
                  Next
              </CButton>
              : ''}
        </React.Fragment>
      )}
    </CButtonGroup>
  )
}

export default Pagination;