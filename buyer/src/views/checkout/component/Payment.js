import React from "react";
import creditcard from "../../../assets/images/icon/credit-card-theme.svg";
import sbi from "../../../assets/images/icon/sbi.png";
import hdfc from "../../../assets/images/icon/hdfc.png";
import icici from "../../../assets/images/icon/icici.png";
import axis from "../../../assets/images/icon/axis.png";
import kotak from "../../../assets/images/icon/kotak.png";
import yes from "../../../assets/images/icon/yes.png";

const banks = [
  {name: 'sbi', icon: sbi },
  {name: 'hdfc', icon: hdfc},
  {name: 'icici', icon: icici },
  {name: 'axis', icon: axis},
  {name: 'kotak', icon: kotak},
  {name: 'yes', icon: yes}];

const Payment = (props) => {
  
  // const items = 5;
  // const amount = "2000";
  const cardChangeHandler = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const selector = 'card';
    //
    const cardObj = {...props.paymentObject[selector]};
    const payObj = {...props.paymentObject};
    cardObj[field] = value;
    payObj[selector] = cardObj;
    props.changePayment(payObj);
  };
  const upiChangeHandler = (e) => {
    const value = e.target.value;
    const payObj = {...props.paymentObject};
    payObj.upi.vpa = value;
    props.changePayment(payObj);
  }
  const methodHandler = (e) => {
    const selector = e.currentTarget.id;
    const payObj = {...props.paymentObject, selected: selector}
    props.methodHandler(payObj);
  }
  const bankHandler = (e) => {
    const payObj = {...props.paymentObject};
    payObj.netbanking.bank = e.currentTarget.id.toUpperCase();
    props.changePayment(payObj);
  }
  return (
    <React.Fragment>
      <h4 className="main-title">Select a payment method</h4>
      <form>
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="card" onClick={methodHandler}>
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                <div className="icon">
                  <img src={creditcard} alt="Icon" />
                </div>
                <div className="content">
                  <h5>Add Debit/Credit/ATM Card</h5>
                  <h6>
                    You can save your card as per new RBI guidelines.{" "}
                    <a href="#!">Learn More</a>
                  </h6>
                </div>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className="row g-2">
                  <div className="form-group col-8">
                    <input type="text" name="card[number]" className="app-input" placeholder="Card Number" onChange={cardChangeHandler}/>
                  </div>
                  <div className="form-group col-4">
                    <input type="text" name="card[expiry]" className="app-input" placeholder="Expiry" onChange={cardChangeHandler}/>
                  </div>
                  <div className="form-group col-8">
                    <input type="text" name="card[name]" className="app-input" placeholder="Card Holder’s name" onChange={cardChangeHandler}/>
                  </div>
                  <div className="form-group col-4">
                    <input type="password" name="card[cvv]" className="app-input" placeholder="CVV" onChange={cardChangeHandler}/>
                  </div>
                  <div className="remember">
                    <label className="custom-check-box">
                      Save card securely for future payments{" "}
                      <a href="#!">Know More</a>{" "}
                      <input type="checkbox" name="terms" id="terms" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="upi" onClick={methodHandler}>
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <div className="icon">
                  <img src={creditcard} alt="Icon" />
                </div>
                <div className="content">
                  <h5>UPI</h5>
                  <h6>Pay with installed app, or use others</h6>
                </div>
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className="row g-2">
                  <label>
                    <h5>UPI ID</h5>
                    <h6>Google pay, BHIM, PhonePe & more</h6>
                  </label>
                  <div className="form-group col-12">
                    <input type="text" className="app-input" placeholder="Enter your UPI ID" onChange={upiChangeHandler} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="netbanking" onClick={methodHandler}>
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                <div className="icon">
                  <img src={creditcard} alt="Icon" />
                </div>
                <div className="content">
                  <h5>Netbanking</h5>
                  <h6>All Indian Bank</h6>
                </div>
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className="bank-listing">
                  {
                    banks.map(bank => {
                      return(
                        <div key={bank.name} id={bank.name} className={`bank ${bank.name.toUpperCase() === props.paymentObject.netbanking.bank ? 'selected' : ''}`} onClick={bankHandler}>
                          <img src={bank.icon} alt="Bank" />
                          <h6>{bank.name.toUpperCase()}</h6>
                        </div>      
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Payment;
