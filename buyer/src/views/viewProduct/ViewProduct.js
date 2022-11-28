import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heart from '../../assets/images/icon/heart.svg';
import cart from '../../assets/images/icon/cart.svg';
import backArrow from '../../assets/images/icon/back-arrow.svg';
import white_share from '../../assets/images/icon/white-share.svg'
import { useParams } from 'react-router-dom';
import { ExhSingleProService } from '../../services/exhibitionProduct';
import Parser from "html-react-parser"
import { imageUrl } from '../../constants/constants';
import { CartService } from '../../services/cart';
import { useDispatch, useSelector } from 'react-redux';
import { cartCount, loaderOverlay } from '../../redux/action/action';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Variants from './Variants';
import Loader from '../loader/Loader';
const ViewProduct = () => {
  const navigate = useNavigate();
  const loading = useSelector(state => state.loading);
  const cartItems = useSelector(state => state.cartItems );
  const dispatch = useDispatch();

  const { proid } = useParams();
  const [singleProduct, setSingleProduct] = useState([]);
  const [exhibitionProductId, setExhibitionProductId] = useState('');
  const [variantTable, setVariantTable] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [variantId, setVariantId] = useState(null);
  const [prices, setPrices] = useState({});
  const [inCart, setInCart] = useState(false);


  useEffect(() => {
    dispatch(loaderOverlay(true));
    const stateInit = async () => {
      const singleProduct = await fetchSingleProduct()
      cartItemCount();
      setSingleProduct(singleProduct);
      setExhibitionProductId(singleProduct.exhibitionProductId)
      const variantsArray = formatVariants(singleProduct.product.variants);
      const variantTable = singleProduct.product.variants.map(ele => {
        const {variantId, variant, price, compareAtPrice} = ele;
        return {variantId, variant, price, compareAtPrice}
      });
      const selectedVariant = lookup(variantTable, variantsArray);
      setSelectedVariant(selectedVariant);
      setVariantTable(variantTable)
      setVariants(variantsArray);
    }
    stateInit();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if(!selectedVariant.variantId)
      return;  
    setVariantId(selectedVariant.variantId);
    const payload = {
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice
    }
    setPrices(payload)
  }, [selectedVariant]);
  useEffect(() => {
    if(variantId)
      cartCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantId])
  
  const fetchSingleProduct = async () => {
    const singleProductRes = await ExhSingleProService.getExhProduct(proid)
    if (!singleProductRes) {
      return;
    }
    if (singleProductRes.status === 200 || singleProductRes.status === '200') {

    dispatch(loaderOverlay(false));
      return singleProductRes.data;
    }

  }
  const formatVariants = (arr) => {
    const tempVariation = {};
    const allVariation = Object.keys(arr[0].variant);
    for (const varaintKey of allVariation) {
      tempVariation[varaintKey] = new Set();
    }
    
    for (const variantData of arr) {
      for (const varaintKey of allVariation) {
        tempVariation[varaintKey].add(variantData.variant[varaintKey]);
      }
    }

    const tempOptions = [];
    // eslint-disable-next-line no-unused-vars
    for (const [i, opt] of allVariation.entries()) {
      const tempOpt = {
        optionName: opt,
        optionValue: Array.from(tempVariation[opt]),
        optionSelector: 0
      };
      tempOptions.push(tempOpt);
    }
    return tempOptions;
  }
  const selectorChange = (payload) => {
    const tempVariants = [...variants];
    const index = tempVariants.findIndex((ele) => ele.optionName === payload.property);
    tempVariants[index].optionSelector = Number(payload.index);
    setVariants(variants);
    const selectedVariant = lookup(variantTable, variants);
    setSelectedVariant(selectedVariant);
  }
  const lookup = (table, variantState) => {
    const payload = lookupPayload(variantState)
    let variant = {};
    table.forEach(vari => {
      if (compareObject(payload, vari.variant))
        variant = vari;
    })
    return variant;
  }
  const compareObject = (a, b) => {
    for (const property in a) {
      if(!b[property])
        return false;
      if(b[property] !== a[property])
        return false;
    }
    return true;
  }
  const lookupPayload = (variantState) => {
    const obj = {}
    variantState.forEach(ele => {
      obj[ele.optionName] = ele.optionValue[ele.optionSelector]
    })
    return obj
  }
  const cartHandler = async () => {
    const { variantId } = selectedVariant;
    const quantity = 1;
    const cartResponse = await CartService.addProductToCart({
      exhibitionProductId,
      quantity,
      variantId
    });
    if(!cartResponse)
      return;
    if(cartResponse.status === 200 || cartResponse.status === '200') {
      cartItemCount();
      cartCheck();
      toast.success('Item added in cart');
    }
  }
  const cartCheck = async () => {
    const payload = {
      exhibitionProductId,
      variantId
    }
    const cartResponse = await CartService.checkInCart(payload);
    if(cartResponse.status === 200 || cartResponse.status === '200') {
      const { isInCart } = cartResponse.data;
      setInCart(isInCart);
    }
  }
  const cartItemCount = async () => {
    const response = await CartService.getCartItems();
    if(response.status === 200 || response.status === '200') {
        const itemLength = response.data.filter(ele => !ele.isPurchased).length;
        dispatch(cartCount(itemLength));
        
    }
  }
  const buyNowHandler = async () => {
    const { variantId } = selectedVariant;
    const quantity = 1;
    const cartResponse = await CartService.addProductToCart({
      exhibitionProductId,
      quantity,
      variantId
    });
    if(!cartResponse)
      return;
    if(cartResponse.status === 200 || cartResponse.status === '200') {
      navigate('/shoppingcart');
    }
  }
  return (
    <React.Fragment>
    {
      loading &&
      <Loader />
    }
    <div className="app-sc product-details-sc">
      <div className="product">
        <div className="app-header">
          <div className="back">
            <a href="#!"><img src={backArrow} alt="Back" onClick={()=>{navigate(-1)}}/></a>
          </div>
          <div className="d-flex">
            <div className="wishlist me-3">
              <a href="#!"><img src={heart} alt="Cart" /></a>
            </div>
            <div className="cart">
              <span onClick={() => {navigate('/shoppingcart');}}><img src={cart} alt="Cart" /></span>
              <span className="notification">{cartItems}</span>
            </div>
          </div>
        </div>
        <div className="product-details-section">
          {/* images slider here */}
          <div className="product-image">
          <Swiper
            modules={[Thumbs, Pagination]}
            spaceBetween= {10}
            slidesPerView= {1}
            centeredSlides={true}
            loop={true}
            pagination={{
              clickable: true,
            }}
          >
            {singleProduct?.product?.productImages.map((image,index) => {
              return (
                <SwiperSlide key={index}>
                  <img src={imageUrl + image.imagePath} alt="ProductImage" />
                </SwiperSlide>  
              );
            })}
          </Swiper>
          </div>
          <div className="product-details">
            <div className="top-icon">
              <button><img src={white_share} alt="Share" /></button>
              <button><img src={heart} alt="Add wishlist" /></button>
            </div>
            <div className="product-title">
              <h2>{singleProduct?.product?.productName}</h2>
              {/* <p></p> */}
              <p
                dangerouslySetInnerHTML={{
                  __html: Parser(`${singleProduct?.product?.productDescription}`)
                }}
              >

              </p>
            </div>
            {
              singleProduct.totalQuantity
              ?
              <div className="price">
                {
                  prices.compareAtPrice !== prices.price
                  &&
                  <span className="main-price">₹ {prices.price}</span>
                }
                  <span className="pay-price">₹ {prices.compareAtPrice}</span>
                {
                  prices.compareAtPrice !== prices.price
                  &&
                  <span className="discount">
                    {Math.round((prices.price - prices.compareAtPrice)/prices.price*100)}% OFF
                  </span>
                }
              </div>
              :
              <div className="price">
                <span className="stock-out">
                  Item out of stock
                </span>
              </div>
            }
            <div className="note">inclusive of all taxes and delivery charge</div>
            <div className="sizes">
            {
              variants && <Variants variants={variants} selectorHandler={selectorChange}/>
            }
            </div>
            <div className="rating-wrapper">
              <div className="heading">
                <h2>Product Rating & Reviews</h2>
                <button>View All</button>
              </div>
              <div className="rating-review">
                <div className="stars">
                  <h3>3.5 <svg width="15" height="14" viewBox="0 0 15 14" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.0054 2.06977C9.21702 -0.356589 5.78437 -0.356589 4.996 2.06977C4.76421 2.78315 4.09942 3.26614 3.34933 3.26614C0.798111 3.26614 -0.262635 6.53078 1.80135 8.03035C2.40818 8.47124 2.66211 9.25274 2.43032 9.96612C1.64195 12.3925 4.41902 14.4101 6.483 12.9106C7.08983 12.4697 7.91155 12.4697 8.51839 12.9106C10.5824 14.4101 13.3594 12.3925 12.5711 9.96612C12.3393 9.25274 12.5932 8.47124 13.2 8.03035C15.264 6.53078 14.2033 3.26614 11.6521 3.26614C10.902 3.26614 10.2372 2.78315 10.0054 2.06977Z"
                      fill="#F9C337" />
                  </svg>
                  </h3>
                  <h6>993 Ratings, <br />
                    281 Reviews</h6>
                </div>
                <div className="feedback">
                  <ul>
                    <li className="excellent"><span className="option">Excellent</span>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-label="Basic example"
                          style={{ width: "60%" }}
                          aria-valuenow="60" aria-valuemin="0"
                          aria-valuemax="100"></div>
                      </div>
                      <span className="per">60%</span>
                    </li>
                    <li className="very-good"><span className="option">Very Good</span>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-label="Basic example"
                          style={{ width: "40%" }}
                          aria-valuenow="40" aria-valuemin="0"
                          aria-valuemax="100"></div>
                      </div>
                      <span className="per">40%</span>
                    </li>
                    <li className="good"><span className="option">Good</span>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-label="Basic example"
                          style={{ width: "30%" }}
                          aria-valuenow="30" aria-valuemin="0"
                          aria-valuemax="100"></div>
                      </div>
                      <span className="per">30%</span>
                    </li>
                    <li className="average"><span className="option">Average</span>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-label="Basic example"
                          style={{ width: "20%" }}
                          aria-valuenow="20" aria-valuemin="0"
                          aria-valuemax="100"></div>
                      </div>
                      <span className="per">20%</span>
                    </li>
                    <li className="poor"><span className="option">Poor</span>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-label="Basic example"
                          style={{ width: "40%" }}
                          aria-valuenow="40" aria-valuemin="0"
                          aria-valuemax="100"></div>
                      </div>
                      <span className="per">40%</span>
                    </li>
                  </ul>
                </div>
              </div>
              {
                singleProduct.totalQuantity
                ?
                <div className="btn-wrapper">
                  {
                    inCart
                    ?
                    <button className="app-btn" onClick={() => {navigate('/shoppingcart')}}>View in Cart</button>
                    :
                    <button className="app-btn" onClick={cartHandler}>Add To Cart</button>
                  }
                  <button className="app-btn outline" onClick={buyNowHandler}>Buy Now</button>
                </div>
                :
                ''
              }
            </div>
          </div>
        </div>
      </div >
    </div >
    </React.Fragment>
  )
}

export default ViewProduct