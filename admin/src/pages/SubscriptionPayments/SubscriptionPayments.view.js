import React, { useState, useEffect } from 'react';
import { Accordion, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { subscriptionAddOns } from '../../constants/constants';

const SubscriptionPayments = (props) => {
    // Style for required asterisk
    const requiredStyle = {
        color: 'red'
    };

    // State for subscription
    const [subscription, setSubscription] = useState({});

    // State for add ons
    const [addOns, setAddOns] = useState(subscriptionAddOns);

    // Handle addOns
    const handleAddOns = (id) => {
        const clickedAddOns = addOns.map((addOn) => {
            if (addOn.id === id) {
                return { ...addOn, checked: !addOn.checked }
            }
            return addOn;
        });
        setAddOns(clickedAddOns);
    }

    // State for total amount
    const [totalAmount, setTotalAmount] = useState();

    // Execute getTotalAmount every time change in subscription or addOn is made
    useEffect(() => {
        setTotalAmount(getTotalAmount());
    }, [subscription, addOns]);


    // Function to get total amount
    const getTotalAmount = () => {
        var selectedAddOns = addOns.filter((addOn) => addOn.checked === true);
        const addOnTotal = selectedAddOns.reduce((prevVal, currAddOn) => {
            return prevVal + currAddOn.amount;
        }, 0);
        if (subscription.title && subscription.amount) {
            return subscription.amount + addOnTotal;
        }
    }


    return (
        <>
            <div>
                <div className="page-header">
                    <h3 className="page-title"> Purchase Subscription </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/subscriptions">Subscription</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Purchase Subscription</li>
                        </ol>
                    </nav>
                </div>
                <div>
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                Type of Subscriptions
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Form.Group>
                                                <div className="form-check">
                                                    <label className="form-check-label">
                                                        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1"
                                                            onClick={() => setSubscription({ title: 'Weekly Subscription', amount: 1000 })}
                                                        />
                                                        <i className="input-helper"></i>
                                                        <span className='mt-0'>Weekly Subscription</span>
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <label className="form-check-label">
                                                        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2"
                                                            onClick={() => setSubscription({ title: 'Biweekly Subscription', amount: 1800 })}
                                                        />
                                                        <i className="input-helper"></i>
                                                        Biweekly Subscription
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <label className="form-check-label">
                                                        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios3" value="option3"
                                                            onClick={() => setSubscription({ title: 'Monthly Subscription', amount: 3000 })}
                                                        />
                                                        <i className="input-helper"></i>
                                                        Monthly Subscription
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                Add-ons
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Form.Group>
                                                {
                                                    addOns.map(addOn => {
                                                        return (
                                                            <div key={addOn.id} className="form-check">
                                                                <label className="form-check-label">
                                                                    <input type="checkbox" onClick={() => handleAddOns(addOn.id)} className="form-check-input" />
                                                                    <i className="input-helper"></i>
                                                                    {`${addOn.title} (Rs. ${addOn.amount})`}
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Form.Group>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                                Seller Details
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    <div className='row'>
                                        <div className="col-md-12 grid-margin">
                                            <form onSubmit={(e) => e.preventDefault()} className="forms-sample">
                                                <Form.Group>
                                                    <label htmlFor="GSTIN">GST Number<span style={requiredStyle}> * </span></label>
                                                    <Form.Control type="text" className="form-control" id="GSTIN" placeholder="GST Number" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <label htmlFor="PANNumber">PAN Card Number<span style={requiredStyle}> * </span></label>
                                                    <Form.Control type="text" className="form-control" id="PANNumber" placeholder="PAN Card Number" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <label htmlFor="AadharCard">Aadhar Card Number<span style={requiredStyle}> * </span></label>
                                                    <Form.Control type="text" className="form-control" id="AadharCard" placeholder="Aadhar Card Number" />
                                                </Form.Group>
                                                <button type="submit" className="btn btn-gradient-primary mr-2">Submit</button>
                                                <button type="reset" className="btn btn-light">Cancel</button>
                                            </form>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="3">
                                Bill Details & Payment
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>
                                    {
                                        subscription.title && subscription.amount ?
                                            <div className='d-flex justify-content-between'>
                                                <p>{subscription.title}</p>
                                                <span className='text-muted'>{`Rs ${subscription.amount}`}</span>
                                            </div>
                                            : null
                                    }
                                    {
                                        addOns.length > 0 ?
                                            addOns.map(addOn => {
                                                if (addOn.checked === true) {
                                                    return (
                                                        <div key={addOn.title} className='d-flex justify-content-between'>
                                                            <p>{addOn.title}</p>
                                                            <span className='text-muted'>{`Rs ${addOn.amount}`}</span>
                                                        </div>
                                                    )
                                                }
                                                return null;
                                            })

                                            : null
                                    }
                                    {
                                        subscription.title && subscription.amount ?
                                            <>
                                                <hr />
                                                <div className='d-flex justify-content-between'>
                                                    <p>Total Amount</p>
                                                    <span className='text-muted'>{`Rs ${totalAmount}`}</span>
                                                </div>
                                                <div className='d-flex justify-content-start'>
                                                    <button type="button" className="btn btn-gradient-primary">Pay Now</button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div>
                                                    Select subscription to proceed to pay
                                                </div>
                                            </>
                                    }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
        </>
    )
}

export default SubscriptionPayments;