import React from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";

const Orders = () => {
  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span>{" "}
            Orders
          </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Sellers</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> Exhibition </th>
                        <th> Product </th>
                        <th> Buyer </th>
                        <th> Status </th>
                        <th> Transaction ID </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> Clothing Exhibition </td>
                        <td> T-Shirt </td>
                        <td>David Grey</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="btn btn-sm btn-gradient-primary"
                              id="dropdownMenuOutlineButton1"
                            >
                              Ordered
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Ordered</Dropdown.Item>
                              <Dropdown.Item>Shipped</Dropdown.Item>
                              <Dropdown.Item>Out for delivery</Dropdown.Item>
                              <Dropdown.Item>Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td> WD-12345 </td>
                      </tr>
                      <tr>
                        <td> Electronics and Accessories </td>
                        <td> Laptop Cover </td>
                        <td> Stella Johnson </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="btn btn-sm btn-gradient-primary"
                              id="dropdownMenuOutlineButton1"
                            >
                              Shipped
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Ordered</Dropdown.Item>
                              <Dropdown.Item>Shipped</Dropdown.Item>
                              <Dropdown.Item>Out for delivery</Dropdown.Item>
                              <Dropdown.Item>Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td> WD-12346 </td>
                      </tr>
                      <tr>
                        <td> Titan </td>
                        <td> Watch </td>
                        <td> Marina Michel </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="btn btn-sm btn-gradient-primary"
                              id="dropdownMenuOutlineButton1"
                            >
                              Out for delivery
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Ordered</Dropdown.Item>
                              <Dropdown.Item>Shipped</Dropdown.Item>
                              <Dropdown.Item>Out for delivery</Dropdown.Item>
                              <Dropdown.Item>Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td> WD-12347 </td>
                      </tr>
                      <tr>
                        <td> Electronics and Accessories </td>
                        <td> Mobile Cover </td>
                        <td> John Doe </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="btn btn-sm btn-gradient-primary"
                              id="dropdownMenuOutlineButton1"
                            >
                              Delivered
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Ordered</Dropdown.Item>
                              <Dropdown.Item>Shipped</Dropdown.Item>
                              <Dropdown.Item>Out for delivery</Dropdown.Item>
                              <Dropdown.Item>Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td> WD-12348 </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
