import React, { useEffect, useState } from 'react';
import back_Arrow from '../../assets/images/icon/back-arrow.svg';
import heart from '../../assets/images/icon/heart.svg';
import cart from '../../assets/images/icon/cart.svg';
import fiter from '../../assets/images/icon/filter.svg';
import search from '../../assets/images/icon/search.svg';
import { CategoryService } from '../../services/category';
import { useNavigate, useParams } from 'react-router-dom';
import { imageUrl } from '../../constants/constants';
import { cartCount, loaderOverlay } from '../../redux/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { CartService } from '../../services/cart';
import Loader from '../loader/Loader';

const ExhibitionProduct = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading);
    const cartItems = useSelector(state => state.cartItems );
    const { exhid, cid } = useParams();
    const navigate = useNavigate()
    const [exhibitionProductList, setExhibitionProductList] = useState([]);
    useEffect(() => {
        dispatch(loaderOverlay(true));
        fetchexhibitionProduct()
        cartItemCount();
    }, [])

    const cartItemCount = async () => {
        const response = await CartService.getCartItems();
        if(response.status === 200 || response.status === '200') {
            const itemLength = response.data.filter(ele => !ele.isPurchased).length;
            dispatch(cartCount(itemLength));
            
        }
    }

    const fetchexhibitionProduct = async () => {
        const exhibitionProductRes = await CategoryService.getCatExhProduct({
            exhibitionId: exhid,
            categoryId: cid

        });
        if (!exhibitionProductRes) {
            return;
        }
        if (exhibitionProductRes.status === 200 || exhibitionProductRes.status === '200') {
            dispatch(loaderOverlay(false))
            setExhibitionProductList(exhibitionProductRes.data)
        }
    }
    const addToWishList = async(product) => {
        console.dir(product);

    }

    return (
        <React.Fragment>
        {
            loading &&
            <Loader />
        }
        <div className="app-sc product-sc">
            <div className="product">
                <div className="app-header">
                    <div className="back">
                        <a href="#!"><img src={back_Arrow} alt="Back" onClick={() => { navigate(-1) }}/></a>
                    </div>
                    <div className="title">{exhibitionProductList.name}</div>
                    <div className="d-flex">
                        <div className="cart">
                            <span onClick={() => {navigate('/shoppingcart');}} ><img src={cart} alt="Cart" /></span>
                            <span className="notification">{cartItems}</span>
                        </div>
                    </div>
                </div>
                <div className="app-search">
                    <form>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="What are you looking for ?" />
                            <button className="btn btn-outline-secondary" type="button" id="button-addon2"><img
                                src={fiter} alt="Submit" /></button>
                            <img className="search" src={search} alt="Icon" />
                        </div>
                    </form>
                </div>
                <div className="product-card-listing">
                    <div className="row product-row">
                        {exhibitionProductList && exhibitionProductList.categoryProducts && exhibitionProductList.categoryProducts.map((ele, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="product-col col-6 col-sm-4">
                                        <div className="product-card">
                                            <div className="img-wrapper" onClick={() => navigate(`/exhibition-single-product/${ele?.product?.exhibitionProducts[0]?.exhibitionProductId}`)}>
                                                <img src={imageUrl + ele?.product?.productImages[0]?.imagePath} alt="Image_pro" />
                                                <button className="add-whishlist" onClick={(e) => {e.stopPropagation();addToWishList(ele?.product)}}>
                                                    <img src={heart} alt="Wishlist" />
                                                </button>
                                            </div>
                                            <div className="content-wrapper">
                                                <div className="product-name">{ele?.product?.productName}</div>
                                                <div className="price">
                                                    <span className="main-price">₹ {ele?.product?.variants[0].price}</span>
                                                    <span className="pay-price">₹ {ele?.product?.variants[0].compareAtPrice}</span>
                                                    <span className="discount">{Math.round((ele?.product?.variants[0].price - ele?.product?.variants[0].compareAtPrice)/ele?.product?.variants[0].price*100)}% OFF</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })
                        }

                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    )
}

export default ExhibitionProduct