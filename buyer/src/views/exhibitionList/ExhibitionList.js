import React, { useEffect, useState } from 'react';
import SearchBar from '../../common/pagination/SearchBar';
import { exhCatService } from '../../services/exhibitionCategories';
import { imageUrl } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';

const ExhibitionList = (props) => {

    const [exhibitionsList, setExhibitionsList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [currPage, setCurrPage] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(10);
    const [searchVal, setSearchVal] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExhCatWise()
    }, [currPage, noOfRecords, searchVal])

    const fetchExhCatWise = async () => {
        const exhibitionsListRes = await exhCatService.getExhCatWiseExhibition({
            search: searchVal,
            pageRecord: noOfRecords,
            pageNo: currPage
        })
        if (!exhibitionsListRes) {
            return;
        }
        if (exhibitionsListRes.status === 200 || exhibitionsListRes.status === '200') {
            if (exhibitionsListRes.data.count > 0) {
                setExhibitionsList(exhibitionsListRes.data.rows);
                setTotalData(exhibitionsListRes.data.count);
            } else {
                setTotalData(0);
                setExhibitionsList([]);
            }
        }
    }
    useEffect(() => {
        fetchCategories()
    }, [])
    useEffect(() => {
        setSearchVal(props.query);
    }, [props.query])
    const fetchCategories = async () => {
        const categoriesRes = await exhCatService.getExhibitonCategories();
        if (!categoriesRes) {
            return;
        }
        if (categoriesRes.status === 200 || categoriesRes.status === '200') {
            setCategories(categoriesRes.data)
        }

    }
    const filterTab = (category) => {
        setSearchVal(category)
    }
    return (
        <div className="tab-pane fade" id="exhibitions" role="tabpanel" aria-labelledby="exhibitions-tab" tabIndex="0">
            <div className="exhibition-listing">
                <div className="app-search">
                    <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
                </div>
                <div className="exhibition-tabs">
                    <ul>
                        <li className="" onClick={() => {filterTab('')}}>
                            <span>All</span>
                        </li>
                        {categories.map((ele, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <li className="" onClick={() => {filterTab(ele.exhCategoryName)}}>
                                        <div className="icon">
                                            <img src={imageUrl + ele.image} alt="Icon" />
                                        </div>
                                        <span>{ele.exhCategoryName}</span>
                                    </li>
                                </React.Fragment>
                            )
                        })
                        }
                    </ul>
                </div>

                {exhibitionsList.map((element, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="exhibition-section">
                                <div className="title">
                                    <h2>{element.exhCategoryName}</h2>
                                </div>
                                <div className="row gy-3">
                                    {element?.exhCategoryExhibitions.map((ele, exhIndex) => {
                                        return (
                                            <React.Fragment key={exhIndex}>
                                                <div className="col-4 col-sm-3" onClick={() => navigate(`/exhibition/${ele?.exhibitionId}/${element?.exhCategoryId}`)}>
                                                    <div className="exhibition-card">
                                                        <div className="icon">
                                                            <img src={imageUrl + ele?.exhibition?.exhibitionImage} alt="Brand Name" />
                                                        </div>
                                                        <div className="content">
                                                            <h4>{ele?.exhibition?.exhibitionName}</h4>
                                                            <h5>{ele?.exhibition?.exhibitionProducts?.length} Item{ele?.exhibition?.exhibitionProducts?.length ? '' : 's'}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    )

                })}
            </div>
        </div>



    )
}

export default ExhibitionList