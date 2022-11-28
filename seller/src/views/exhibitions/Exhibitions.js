import React, { useState, useEffect } from "react";
import { CRow, CCol, CButton, CCard, CCardHeader, CCardBody } from '@coreui/react';
import ExhibitionCard from "./components/ExhibitionCard";
import ExhibitionAddEditModal from "./components/ExhibitionAddEditModal";
import { exhService } from "src/services/exhibitions";
import { storeService } from "src/services/store";
import LoadingSpinner from "src/common/loadingSpinner/LoadingSpinner";
import Pagination from "src/common/Pagination";
import NoOfRecords from "src/common/NoOfRecords";
import SearchBar from "src/common/SearchBar";
import CIcon from "@coreui/icons-react";
import { cilPencil } from '@coreui/icons'
import "./components/style.css"

const Exhibitions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [exhibitions, setExhibitions] = useState([]);
  const [storeData, setStoreData] = useState(null)

  // States for pagination
  const [totalData, setTotalData] = useState(0)
  const [currPage, setCurrPage] = useState(1)
  const [noOfRecords, setNoOfRecords] = useState(10)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    fetchExhibitions();
  }, [currPage, noOfRecords, searchVal]);
  const paginationFunction = () => {
    return (
      <React.Fragment>
        {totalData > 0 ? (
          <Pagination
            currPage={currPage}
            totalData={totalData}
            setPageNumber={setCurrPage}
            noOfRecords={noOfRecords} />
        ) : ''}
      </React.Fragment>
    );
  }

  const fetchExhibitions = async () => {
    setIsLoading(true);
    const getExhibitionResponse = await exhService.getExhibitons({
      search: searchVal,
      pageRecord: noOfRecords,
      pageNo: currPage
    });
    if (!getExhibitionResponse) {
      return;
    }
    if (getExhibitionResponse.status === 200) {
      setTotalData(getExhibitionResponse.data.count);
      setExhibitions(getExhibitionResponse.data.rows);
      setIsLoading(false);
    } else {
      setTotalData(0);
      setExhibitions([]);
    }
  }


  useEffect(() => {
    fetchstoreList()
  }, [])

  const fetchstoreList = async () => {
    const storeResponse = await storeService.getStore()
    if (!storeResponse) {
      return;
    }
    if (storeResponse.status === 200 || storeResponse.status === '200') {
      setStoreData(storeResponse.data)
    }

  }





  return (
    <>
      <div className='app-table'>
        {/* {isLoading ? <LoadingSpinner /> : fetchExhibitions()} */}
        <CCard className="mb-4 overflow-auto">
          <CCardHeader>
            <strong>My Exhibitions</strong>

            <ExhibitionAddEditModal operation='Add' fetchExhibitions={fetchExhibitions} storeData={storeData} />

          </CCardHeader>

          <CCardBody className="exhibition-card">
            <>
              <div className='table-header'>
                <NoOfRecords setNoOfRecords={setNoOfRecords} />
                <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
              </div>
              <br />
              {exhibitions.length <= 0 ?
                <>
                  <br />
                  <h4 className='no-data-found'>No Data Found</h4>
                </>
                : null}
              <div className="row">
                {exhibitions && exhibitions.length > 0 ?
                  exhibitions.map((exhibition, index) => (
                    <React.Fragment key={index}>
                      <div className="col-lg-4 col-xl-3 col-sm-6">
                        <div className="my-exhi-card">
                          <ExhibitionCard exhibition={exhibition} operation='Edit' fetchExhibitions={fetchExhibitions} />
                          {exhibition.exhibitionStatus === "pending" ?
                            <div className="edit-btn">
                              <ExhibitionAddEditModal operation='Edit' fetchExhibitions={fetchExhibitions} exhibition={exhibition} />
                            </div>
                            :
                            <></>
                          }
                        </div>
                      </div>



                    </React.Fragment>
                  ))
                  :
                  <></>
                }
              </div>
            </>
            <CCol sm={12} className="text-end">
              {paginationFunction()}
            </CCol>
          </CCardBody>
        </CCard>
      </div>
    </>
  );
}

export default Exhibitions;
