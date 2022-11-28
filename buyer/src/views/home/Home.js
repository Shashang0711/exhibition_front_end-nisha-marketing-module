import React, { useEffect, useState } from 'react';
import { color, imageUrl } from '../../constants/constants';
import { exhCatService } from '../../services/exhibitionCategories';
import logo from '../../assets/images/icon/logo.svg';
import cart from '../../assets/images/icon/cart.svg';
import SearchBar from '../../common/pagination/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CartService } from '../../services/cart';
import { cartCount } from '../../redux/action/action';


const Home = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(state => state.cartItems);
    const [categories, setCategories] = useState([])
    useEffect(() => {
        fetchCategories();
        cartItemCount();
    }, [])
    const fetchCategories = async () => {
        const categoriesRes = await exhCatService.getExhibitonCategories()
        if (categoriesRes.status === 200 || categoriesRes === '200') {
            setCategories(categoriesRes.data)
        }
    }
    const cartItemCount = async () => {
        const response = await CartService.getCartItems();
        if(response.status === 200 || response.status === '200') {
            const itemLength = response.data.filter(ele => !ele.isPurchased).length;
            dispatch(cartCount(itemLength));
            
        }
    }
    return (
        <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                <div className="app-header">
                    <div className="landing-logo">
                        <a href="#!"><img src={logo} alt="Logo" /></a>
                    </div>
                    <div className="cart">
                        <span onClick={() => {navigate('/shoppingcart');}}><img src={cart} alt="Cart" /></span>
                        <span className="notification">{items}</span>
                    </div>
                </div>
                <div className="app-search">
                    <SearchBar />

                </div>
                <div className="landing-product">
                    {categories.filter(ele => ele.exhCategoryExhibitions.length !== 0).map((catElemet, index) => {
                        const colorLength = color.length;
                        const colorIndex = index % colorLength;
                        const classValue = `landing-product-card ${color[colorIndex]}`
                        return (<React.Fragment key={index}>
                            <div 
                                className={classValue}
                                onClick={() => {props.exhibition(catElemet.exhCategoryName)}}
                            >
                                <img src={imageUrl + catElemet.image} className="product-img" alt="Product Image" />
                                <div className="content-wrapper">
                                    <h2>{catElemet.exhCategoryName}</h2>
                                    <h3>{catElemet.exhCategoryExhibitions.length} Exhibition{catElemet.exhCategoryExhibitions.length === 1 ? '':'s'}</h3>
                                </div>
                            </div>
                        </React.Fragment>)
                    })

                    }
                </div>
            </div>
        </div>
    )
}

export default Home