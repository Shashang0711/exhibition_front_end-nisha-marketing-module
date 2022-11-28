import React from "react";

const Variants = (props) => {
  const changeHandler = (e) => {
    const payload = {
      property: e.target.parentElement.dataset.property,
      index: e.target.dataset.selector
    }
    props.selectorHandler(payload);
  };
  return props.variants.map((ele, index) => {
    return (
      <React.Fragment key={index}>
        <h5>Select {ele.optionName}</h5>
        <ul data-property={ele.optionName}>
          {ele.optionValue.map((optionList, index) => {
            return (
              <React.Fragment key={index}>
                <li
                  data-selector={index}
                  className={index === ele.optionSelector ? "active" : ""}
                  onClick={changeHandler}
                  >
                  {optionList}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </React.Fragment>
    );
  });
};

export default Variants;
