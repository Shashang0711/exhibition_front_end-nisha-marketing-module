import { Fragment, React, useEffect, useState } from "react";
import { CFormCheck } from '@coreui/react';
import SubscriptionCard from "../SubscriptionCard/SubscriptionCard";
import Invoice from "../Invoice/Invoice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SubPlanService } from 'src/services/subscriptionPlans';

const FormStep = (props) => {
  const { fields, nextTab, purchase, setPurchase, addList } = props;

  // First step -> Subscription
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const fetchSubscriptionPlans = async () => {
    const subscriptionPlans = await SubPlanService.getSubscriptionPlans();
    if (!subscriptionPlans) {
      return;
    }
    if (subscriptionPlans.status === 200 || subscriptionPlans.status === '200') {
      setSubscriptionPlans(subscriptionPlans.data.rows);
    }

  }

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  // Second step -> Add On
  // const add
  // Function to change state as addOn changes
  let addOnArray = [];
  const addOnChange = (e, index) => {
    const selectedAddOn = JSON.parse((e.target.value));
    let tempObject = JSON.parse(JSON.stringify(purchase));
    tempObject.addOn = addOnArray;
    const indexOfObject = addOnArray.findIndex(addOnObj => {
      return addOnObj.addOn.addOnId === selectedAddOn.addOnId;
    })
    if (indexOfObject === -1) {
      tempObject?.addOn.push({ addOn: selectedAddOn });
    } else {
      tempObject?.addOn.splice(indexOfObject, 1);
    }
    setPurchase(tempObject);
  }
  return (
    <Fragment>
      {
        fields.map((field, index) => {
          if (field.type === 'subscription') {
            return (
              // <Fragment key={index}>
              <div key={index}>
                <h5>{field.label}</h5>
                <br />
                <div className="row g-4">
                  {
                    subscriptionPlans && subscriptionPlans.map((plan) => {
                      return (
                        <Fragment key={plan.subscriptionPlanId}>
                          <SubscriptionCard key={plan.subscriptionPlanId} subscriptionDetails={plan} addList={addList} nextTab={nextTab} purchase={purchase} setPurchase={setPurchase} />
                        </Fragment>
                      );
                    })
                  }
                </div>
              </div>
              // </Fragment>
            );
          }
          if (field.type === 'addOns') {
            return (
              <div className="add-ons" key={index}>
                <h5>{field.label}</h5>
                <br />
                {addList && addList.map((addonItem) => {
                  let checkStatus = false;
                  if (purchase?.addOn) {
                    for (const element of purchase?.addOn) {
                      if (JSON.stringify(element?.addOn) === JSON.stringify(addonItem)) {
                        checkStatus = true;
                        break;
                      }
                    }
                  }
                  return (
                    <Fragment key={addonItem.addOnId}>
                      <CFormCheck
                        className=""
                        name="addOn"
                        id={addonItem?.addOnName}
                        label={addonItem?.addOnName + ' ' + addonItem?.price}
                        value={JSON.stringify(addonItem)}
                        onChange={(e) => addOnChange(e, addonItem?.addOnId)}
                        // defaultChecked={purchase?.addOn[0]?.liveSelling ? true : false}
                        defaultChecked={checkStatus}
                      />
                    </Fragment>
                  )
                })}

              </div>
            );
          }
          if (field.type === 'invoice') {
            return (
              <div key={index}>
                <div className="">
                  <Invoice purchase={purchase} setPurchase={setPurchase} addList={addList} />
                </div>
              </div>
            );
          }
        })
      }
    </Fragment>
  );
}

export default FormStep;
