import React from "react";
import { imageUrl } from "../../constants/constants";
import rightarrow from "../../assets/images/icon/right-arrow.svg";
import { useNavigate } from "react-router-dom";
// /exhibition-single-product/e795fd0f-7dac-49eb-ac9d-b10c8ec20b89
const CartItem = (props) => {
  const navigate = useNavigate();
  const { item } = props;
  const imgPath = item.exhibitionProduct.product.productImages[0].imagePath;
  const name = item.exhibitionProduct.product.productName;
  const { price, compareAtPrice, variant } = item.variant;
  const properties = [];
  const PRODUCT_URL = '/exhibition-single-product/' + item.exhibitionProductId;
  for(const key in variant) {
    properties.push({key, value:variant[key]});
  }
  const itemQuantityHandler = (operation) => {
    props.quantityHandler(item.cartItemId, operation)
  }
  const addQuantity = () => {
    itemQuantityHandler('inc');
  }
  const removeItem = () => {
    props.removeItem(item.cartItemId);
  }
  const removeQuantity = () => {
    if(item.quantity !== 1)
      itemQuantityHandler('dec')
    else
      removeItem();
  }
  return (
    <div className='cart-item'>
      <div className='product-img'>
        <img src={imageUrl + imgPath} alt='Home' />
      </div>
      <div className='product-details'>
        <h2>{name}</h2>
        <div className='price'>
          <span className='main-price'>₹ {price}</span>
          <span className='pay-price'>₹ {compareAtPrice}</span>
          <span className='discount'>{Math.round((price - compareAtPrice)/price * 100)} % OFF</span>
        </div>
        <div className='color-size' style={{ gap: "0.5rem" }}>
          {properties.map((item, index) => (
            <div key={index} className='size'>
            <ul>
              <li className='label'>{item.key}:</li>
              <li className='size-text'>{item.value}</li>
            </ul>
          </div>
          ))}
        </div>
        <div className='quantity'>
          <button className='minus' onClick={removeQuantity}>-</button>
          <div className='number'>{item.quantity}</div>
          <button className='plus' onClick={addQuantity}>+</button>
        </div>
      </div>
      <button className='last-btn' onClick={() => {navigate(PRODUCT_URL)}}>
        <img src={rightarrow} />
      </button>
    </div>
  );
};

export default CartItem;
