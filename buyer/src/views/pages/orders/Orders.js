import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../../../assets/images/icon/back-arrow.svg';
import fiter from '../../../assets/images/icon/filter.svg';
import search from '../../../assets/images/icon/search.svg';
import { CheckoutService } from '../../../services/checkout';
import { imageUrl as imgHost } from '../../../constants/constants';
const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const orderData = async () => {
      const response = await CheckoutService.getOrders()
      if (response.status === 200 || response.status === '200') {
        console.log(response.data);
        setOrders(response.data);
      }
    }
    orderData();

  }, []);
  const dateString = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };
  return (
    <div className='app-sc order-list'>
      <div className='app-header'>
        <div className='back'>
          <span onClick={() => { navigate(-1) }}><img src={back} alt="Back" /></span>
        </div>
        <div className='title'>
          My Orders
        </div>
        <div className='wishlist mr-3'>
          &nbsp;
        </div>
      </div>
      <div className="app-search">
        <form>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="What are you looking for ?" />
            <button className="btn btn-outline-secondary" type="button" id="button-addon2">
              <img src={fiter} alt="Submit" /></button>
            <img className="search" src={search} alt="Icon" />
          </div>
        </form>
      </div>
      <div className='order-listing'>
        {orders.rows?.map((order, index) => (
          <>
            {
              order.orderCartItems.length
                ?
                <>
                  {order.orderCartItems.map((item, i) => (
                    <div key={i} className='my-order'>
                      <div className='item-image'>
                        <img src={imgHost + item.cartItem.exhibitionProduct.product.productImages[0].imagePath} alt={"Order product"} />
                      </div>
                      <div className='item-content'>
                        <div className='item-details'>
                          <h2>{item.cartItem.exhibitionProduct.product.productName}</h2>
                          <ul>
                            <li>Order id:  <span>{order.generatedOrderId}</span> </li>
                            <li>Quantity:  <span>{item.cartItem.quantity}</span> </li>
                            <li>Date:  <span>{dateString(item.createdAt)}</span> </li>
                          </ul>
                        </div>
                        <div className='price'>
                          <div className='status'>
                            <button className={`app-btn ${item.status.toLowerCase() !== 'ordered' ? item.status.toLowerCase() : ''}`}>
                              {item.status}
                            </button>
                          </div>
                          <div className='payment'>
                            ₹ {Math.round(item.cartItem.quantity * item.cartItem.variant.compareAtPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
                :
                ''
            }
          </>
        ))}

      </div>
    </div>
  );

  // return (
  //   <div>{orders.rows?.map(order => (
  //     <>
  //       {
  //         order.orderCartItems.length
  //         ? 
  //         <>
  //           {/* <pre>Order ID: {order.generatedOrderId}</pre>
  //           <pre>==========</pre> */}
  //           {
  //             order.orderCartItems.map(item => (
  //             <>
  //               <pre>----------</pre>
  //               <pre>Status: {item.status}</pre>
  //               <pre>Item quantity: {item.cartItem.quantity}</pre>
  //               <pre>Item name: {item.cartItem.exhibitionProduct.product.productName}</pre>
  //               <pre>Price: </pre>
  //               {/* {console.log(item.cartItem.quantity * item.cartItem.variant.compareAtPrice)} */}
  //               </>
  //             ))
  //           }
  //         </>  
  //         : 
  //         ''
  //       }
  //       {/* <pre>==========</pre> */}
  //     </>
  //   ))}</div>
  // )
}

export default Orders