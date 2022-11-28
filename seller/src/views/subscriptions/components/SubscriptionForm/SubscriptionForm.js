import React, { useEffect, useState } from 'react';
import { CForm, CButton } from '@coreui/react';
import FormStep from './FormStep';
import './SubscriptionForm.css';
const SubscriptionForm = ({ purchase, setPurchase, addList }) => {
  // States for tab number, tab content and selected subscription
  const [displayTab, setDisplayTab] = useState(0);
  const [currentTab, setCurrentTab] = useState(<></>);
  const [subscription, setSubscription] = useState();

  console.log("purchase", purchase)

  // Go to previous tab
  const prevTab = () => {
    if (displayTab !== 0) {
      setDisplayTab(displayTab - 1);

    }
    // else 0th index
  }

  // Go to next tab
  const nextTab = () => {
    if (displayTab !== navigationTabs.length - 1) {
      setDisplayTab(displayTab + 1);
    }
    // else at last index
  }

  const navigationTabs = [
    <FormStep
      id="1"
      title="Select Subscription"
      fields={[{ name: 'subscription', type: 'subscription' }]}
      nextTab={nextTab}
      purchase={purchase}
      setPurchase={setPurchase}
      addList={addList}
    />,
    <FormStep
      id="2"
      title="Select Add Ons"
      fields={[{ name: 'addOns', type: 'addOns' }]}
      purchase={purchase}
      setPurchase={setPurchase}
      addList={addList}
    />,
    <FormStep
      id="3"
      fields={[{ type: 'invoice' }]}
      purchase={purchase}
      setPurchase={setPurchase}
      addList={addList}
    />
  ];

  // Change tab content as per value of displayTab
  useEffect(() => {
    setCurrentTab(navigationTabs[displayTab]);
  }, [displayTab])

  // Add active class for current step
  const isActive = (value) => {
    return 'step ' + ((value === displayTab) ? 'active' : '');
  }

  return (
    <CForm action="">
      {/* <!-- Circles which indicates the steps of the form: --> */}
      <div className='app-step'>
        <div className={isActive(0)}><span>1</span>Select Subscription</div>
        <div className={isActive(1)}><span>2</span>Select Add Ons</div>
        <div className={isActive(2)}><span>3</span>Payment</div>
      </div>
      {currentTab}
      <div style={{ overflow: 'auto' }}>
        <div style={{ float: 'right' }}>
          {
            displayTab === 0 ?
              <></>
              :
              <CButton color="outline-secondary" id="prevBtn" onClick={prevTab} >Previous</CButton>
          }
          &nbsp;&nbsp;
          {
            displayTab === (navigationTabs.length - 1) || displayTab === 0 ?
              <></>
              :
              <CButton color="secondary" id="nextBtn" onClick={nextTab} >Next</CButton>
          }
        </div>
      </div>
    </CForm>
  );
}

export default SubscriptionForm;
