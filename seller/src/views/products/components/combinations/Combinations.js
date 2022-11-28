import React from 'react';
import { CCol, CFormInput } from '@coreui/react';

const Combinations = (props) => {
  const { combinations, getDataFromVariations, product, register } = props;
  
  return (
    <>
      {combinations && combinations.length > 0 ? (
        <CCol sm={12}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Variants</h4>
              <p className="card-description">
                {`Enter price for different variants`}
              </p>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Variants</th>
                      <th>Price</th>
                      <th>Compare at price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinations &&
                      combinations.map((combination, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td>
                                {combinations &&
                                  combinations.length > 0 &&
                                  getDataFromVariations(index)}
                              </td>
                              <td>
                                <CFormInput
                                  type="number"
                                  defaultValue={
                                    product &&
                                    product.variants &&
                                    product.variants[index] &&
                                    product.variants[index].price
                                      ? product.variants[index].price
                                      : 0
                                  }
                                  onChange={(e) => {
                                    combination["price"] =
                                      e.target.value;
                                  }}
                                  {...register(`priceIndex${index}`, {
                                    required: "Price is required",
                                  })}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="number"
                                  defaultValue={
                                    product &&
                                    product.variants &&
                                    product.variants[index] &&
                                    product.variants[index].compareAtPrice
                                      ? product.variants[index].compareAtPrice
                                      : 0
                                  }
                                  onChange={(e) => {
                                    combination["compareAtPrice"] =
                                      e.target.value;
                                  }}
                                  {...register(`comparePriceIndex${index}`, {
                                    required: "Compare at price is required",
                                  })}
                                />
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CCol>
      ) : null}
    </>
  );
}

export default Combinations;
