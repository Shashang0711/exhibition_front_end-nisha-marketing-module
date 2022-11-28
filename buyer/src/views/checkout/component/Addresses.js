import React, {useEffect, useState} from 'react';
import home from '../../../assets/images/icon/home.svg'
import work from '../../../assets/images/icon/work.svg'
import filltick from '../../../assets/images/icon/fill-tick.svg'

const Addresses = (props) => {
  const [selectedAddressId, setSelectedAddressId] = useState(props.initialId || props.addresses[0]?.buyerDetailId);
  useEffect(()=>{
      selectAddress(selectedAddressId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.addresses.length]);
  const addressHandler = (e) => {
    const id = e.currentTarget.id;
    selectAddress(id);
  }
  const selectAddress = (id) => {
    const addressArray = Array.from(document.querySelectorAll('.address-listing > .address'));
    addressArray.forEach(element => element.classList.remove('selected'));
    const ele = document.getElementById(id);
    ele?.classList.add('selected')
    setSelectedAddressId(id);
    props.preserve(id);

  }
  return (
    <React.Fragment>
      <div className='address-listing'>
        {
          props.addresses.length !== 0
          &&
          <React.Fragment>
            {props.addresses.map((ele) => {
              const icon = ele.addressType === 'Home' ? home : work;
              return (
                <div key={ele.buyerDetailId} id={ele.buyerDetailId} className='address' onClick={addressHandler}>
                  <img className='select-tick' src={filltick} alt='Tick' />
                  <h5><img src={icon} alt={ele.addressType} />{ele.addressType}</h5>
                  <h6 className='name'>{ele.fullname}</h6>
                  <h6 className='mobile-number'>+91 {ele.mobileNo}</h6>
                  <p style={{whiteSpace: "pre-wrap"}}>
                    {`${ele.houseNo}, ${ele.area}\n${ele.city}, ${ele.state} - ${ele.country}`}
                  </p>
                </div>
              );
            })}
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  )
}

export default Addresses