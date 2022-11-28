import React, { useEffect, useState } from 'react';
import backarrow from '../../assets/images/icon/back-arrow.svg';
import whiteShare from '../../assets/images/icon/white-share.svg';
import reviews from '../../assets/images/icon/reviews.svg';
import chat from '../../assets/images/icon/chat.svg';
import heart from '../../assets/images/icon/heart.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { exhService } from '../../services/exhibition';
import { CategoryService } from '../../services/category';
import { exhCatService } from '../../services/exhibitionCategories';
import { imageUrl } from '../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { loaderOverlay } from '../../redux/action/action';
import Loader from '../loader/Loader';

const ViewExhibition = () => {
    const dispatch = useDispatch();
    const { exid, excid } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState({});
    const [exhibitions, setExhibitions] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [exhCatList, setExhCatList] = useState([]);
    const loading = useSelector((state) => state.loading);


    //selcted exhibition listing
    useEffect(() => {
        dispatch(loaderOverlay(true));
        fetchexhibition()
    }, [])

    const fetchexhibition = async () => {
        const exhibitionRes = await exhService.getExhibiton(exid)
        if (!exhibitionRes) {
            return;
        }
        if (exhibitionRes.status === 200 || exhibitionRes === '200') {
            dispatch(loaderOverlay(false));
            await fetchStore(exhibitionRes.data.userId);
            setExhibitions(exhibitionRes.data);
        }

    }
    const fetchStore = async (id) => {
        const storeRes = await exhService.getStore(id)
        if (!storeRes) {
            return;
        }
        if (storeRes.status === 200 || storeRes === '200') {
            setStore(storeRes.data);
        }

    }

    //exh cat listing name
    useEffect(() => {
        if(excid)
            fetchexhibitionCat()
    }, [])

    const fetchexhibitionCat = async () => {
        const exhibitionCatRes = await exhCatService.getExhibitonByCategory(excid);
        if (!exhibitionCatRes) {
            return;
        }
        if (exhibitionCatRes.status === 200 || exhibitionCatRes.status === '200') {
            setExhCatList(exhibitionCatRes.data);
        }
    }


    useEffect(() => {
            fetchExhCategory()
    }, [])

    const fetchExhCategory = async () => {
        const exhCategoryRes = await CategoryService.getExhProductCat(exid)
        if (!exhCategoryRes) {
            return;
        }

        if (exhCategoryRes.status === 200 || exhCategoryRes.status === '200') {
            setCategoryList(exhCategoryRes.data)
        }
    }

    return (
        <React.Fragment>
        {
            loading &&
            <Loader />
        }
        <div className="app-sc category-sc">
            <div className="category-header">
                <div className="back">
                    <button><img src={backarrow} alt="Back" onClick={() => { navigate(-1) }}/></button>
                </div>
                <div className="title">{exhCatList.exhCategoryName}</div>
                <div>&nbsp;</div>
            </div>
            <div className="store-infor">
                <div className="icon">
                    <img src={`${imageUrl}${exhibitions.exhibitionImage}`} alt="Logo" />
                </div>
                <div className="content">
                    <div className="store-name">
                        <h3>{exhibitions.exhibitionName}</h3>
                        <h4>Store: <span>{store.storeName}</span></h4>
                        <h4>Shop No: <span>{store.storeNo}</span></h4>
                        <ul className="review">
                            <li className="active star"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.38664 1.73171C5.85577 0.0978928 3.54436 0.0978928 3.0135 1.73171C2.85742 2.21207 2.40978 2.5373 1.90469 2.5373C0.186794 2.5373 -0.527474 4.73559 0.862336 5.74535C1.27096 6.04223 1.44194 6.56846 1.28586 7.04883C0.755001 8.68265 2.62498 10.0413 4.01479 9.03151C4.42341 8.73463 4.97672 8.73463 5.38534 9.03151C6.77516 10.0413 8.64513 8.68265 8.11427 7.04883C7.95819 6.56846 8.12918 6.04223 8.5378 5.74535C9.92761 4.73559 9.21334 2.5373 7.49544 2.5373C6.99036 2.5373 6.54272 2.21207 6.38664 1.73171Z"
                                    fill="#1F1A1C" />
                            </svg>
                            </li>
                            <li className="active star"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.38664 1.73171C5.85577 0.0978928 3.54436 0.0978928 3.0135 1.73171C2.85742 2.21207 2.40978 2.5373 1.90469 2.5373C0.186794 2.5373 -0.527474 4.73559 0.862336 5.74535C1.27096 6.04223 1.44194 6.56846 1.28586 7.04883C0.755001 8.68265 2.62498 10.0413 4.01479 9.03151C4.42341 8.73463 4.97672 8.73463 5.38534 9.03151C6.77516 10.0413 8.64513 8.68265 8.11427 7.04883C7.95819 6.56846 8.12918 6.04223 8.5378 5.74535C9.92761 4.73559 9.21334 2.5373 7.49544 2.5373C6.99036 2.5373 6.54272 2.21207 6.38664 1.73171Z"
                                    fill="#1F1A1C" />
                            </svg>
                            </li>
                            <li className="active star"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.38664 1.73171C5.85577 0.0978928 3.54436 0.0978928 3.0135 1.73171C2.85742 2.21207 2.40978 2.5373 1.90469 2.5373C0.186794 2.5373 -0.527474 4.73559 0.862336 5.74535C1.27096 6.04223 1.44194 6.56846 1.28586 7.04883C0.755001 8.68265 2.62498 10.0413 4.01479 9.03151C4.42341 8.73463 4.97672 8.73463 5.38534 9.03151C6.77516 10.0413 8.64513 8.68265 8.11427 7.04883C7.95819 6.56846 8.12918 6.04223 8.5378 5.74535C9.92761 4.73559 9.21334 2.5373 7.49544 2.5373C6.99036 2.5373 6.54272 2.21207 6.38664 1.73171Z"
                                    fill="#1F1A1C" />
                            </svg>
                            </li>
                            <li className="active star"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.38664 1.73171C5.85577 0.0978928 3.54436 0.0978928 3.0135 1.73171C2.85742 2.21207 2.40978 2.5373 1.90469 2.5373C0.186794 2.5373 -0.527474 4.73559 0.862336 5.74535C1.27096 6.04223 1.44194 6.56846 1.28586 7.04883C0.755001 8.68265 2.62498 10.0413 4.01479 9.03151C4.42341 8.73463 4.97672 8.73463 5.38534 9.03151C6.77516 10.0413 8.64513 8.68265 8.11427 7.04883C7.95819 6.56846 8.12918 6.04223 8.5378 5.74535C9.92761 4.73559 9.21334 2.5373 7.49544 2.5373C6.99036 2.5373 6.54272 2.21207 6.38664 1.73171Z"
                                    fill="#1F1A1C" />
                            </svg>
                            </li>
                            <li className="star"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.38664 1.73171C5.85577 0.0978928 3.54436 0.0978928 3.0135 1.73171C2.85742 2.21207 2.40978 2.5373 1.90469 2.5373C0.186794 2.5373 -0.527474 4.73559 0.862336 5.74535C1.27096 6.04223 1.44194 6.56846 1.28586 7.04883C0.755001 8.68265 2.62498 10.0413 4.01479 9.03151C4.42341 8.73463 4.97672 8.73463 5.38534 9.03151C6.77516 10.0413 8.64513 8.68265 8.11427 7.04883C7.95819 6.56846 8.12918 6.04223 8.5378 5.74535C9.92761 4.73559 9.21334 2.5373 7.49544 2.5373C6.99036 2.5373 6.54272 2.21207 6.38664 1.73171Z"
                                    fill="#1F1A1C" />
                            </svg>
                            </li>
                            <li className="rating">4.0</li>
                        </ul>
                    </div>
                    <button><img src={heart} alt="Like" /></button>
                </div>
            </div>
            <div className="review-panel">
                <button className="share" onClick={() => {
                    navigator.clipboard.writeText(exhibitions?.shareLink);

                }}><img src={whiteShare} alt="Share" /></button>
                <button className="reviews"><img src={reviews} alt="Icon" />Reviews</button>
                <button className="chat"><img src={chat} alt="Chat" /></button>
            </div>

            <div className="product-category-listing">
                {categoryList.map((eleCategory, catIndex) => {
                    return (
                        <React.Fragment key={catIndex}>
                            <div className="category" onClick={() => navigate(`/exhibition-product/${exid}/${eleCategory?.categoryId}`)}>
                                <img src={imageUrl + eleCategory.image} alt="images" />
                                <div className="title">
                                    <h2>{eleCategory.name}</h2>
                                    <h3>{eleCategory.name}</h3>
                                </div>
                            </div>

                        </React.Fragment>
                    )
                })
                }
            </div>

        </div>
        </React.Fragment>
    )
}

export default ViewExhibition