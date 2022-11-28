import React from 'react';
import { CRow, CCol, CFormLabel, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPlus } from '@coreui/icons';
import {
  formatOptionFromAPI,
  formatOptions,
  getDataFromVariations,
  createVariation
} from 'src/utils/variation';
import "../../../../assets/styles/style.css"

const Variants = (props) => {
  const { options, setOptions, formatOptions } = props;

  const addOptionValue = (index) => {
    console.log("index", index)
    const newOption = JSON.parse(JSON.stringify(options));
    newOption[index].optionValue.push("");
    setOptions(newOption);
    formatOptions(newOption);
  };
  const addOption = () => {
    const newTempArr = JSON.parse(JSON.stringify(options));
    newTempArr.push({
      optionName: "",
      optionValue: [""],
    });
    setOptions(newTempArr);
    formatOptions(newTempArr);
  };

  const updateOptionName = (optionIndex, value) => {
    const newOption = JSON.parse(JSON.stringify(options));
    newOption[optionIndex].optionName = value || "";
    setOptions(newOption);
    formatOptions(newOption);
  };

  const updateOptionValue = (optionIndex, optionValueIndex, value) => {
    const newOption = JSON.parse(JSON.stringify(options));
    newOption[optionIndex].optionValue[optionValueIndex] = value;
    setOptions(newOption);
    formatOptions(newOption);
  };

  const removeOption = (optionIndex) => {
    const tempOption = JSON.parse(JSON.stringify(options));
    tempOption.splice(optionIndex, 1);
    setOptions(tempOption);
    formatOptions(tempOption);
  };

  const removeOptionValue = (optionIndex, optionValueIndex) => {
    console.log("optionIndex", optionIndex)
    console.log("optionValueIndex", optionValueIndex)
    const tempOption = JSON.parse(JSON.stringify(options));
    tempOption[optionIndex].optionValue.splice(optionValueIndex, 1);
    setOptions(tempOption);
    formatOptions(tempOption);
  };

  return (
    <>
      <CFormLabel className='underlineStyle'>Options</CFormLabel>
      <br />
      {options &&
        options.length > 0 &&
        options.map((opt, optIndex) => {

          return (
            <div key={optIndex}>
              <CFormLabel htmlFor={`${optIndex}`}>
                Option Name
              </CFormLabel>
              <CRow>
                <CCol sm={11}>
                  <CFormInput
                    type="text"
                    name={optIndex}
                    defaultValue={opt.optionName}
                    onChange={(e) =>
                      updateOptionName(optIndex, e.target.value)
                    }
                    required
                  />
                </CCol>
                {
                  // Deletion disabled for first option (at least one option(variant) is required)
                  (optIndex !== 0) ?
                    <CCol sm={1}>
                      <CButton
                        title="Delete Option"
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(optIndex)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CCol>
                    :
                    null
                }
              </CRow>
              {options[optIndex] &&
                options[optIndex].optionValue &&
                options[optIndex].optionValue.map(
                  (optvalue, optvalueIndex) => {
                    return (
                      <React.Fragment key={optvalueIndex}>
                        <CFormLabel htmlFor={`${optvalueIndex}`}>
                          Enter value
                        </CFormLabel>
                        <CRow>
                          <CCol sm={11}>
                            <CFormInput
                              type="text"
                              name={optvalueIndex}
                              defaultValue={optvalue}
                              onChange={(e) =>
                                updateOptionValue(
                                  optIndex,
                                  optvalueIndex,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </CCol>
                          <CCol sm={1}>
                            {optvalueIndex !== 0 ? (
                              <CButton
                                title="Delete Value"
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeOptionValue(
                                    optIndex,
                                    optvalueIndex
                                  )
                                }
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            ) : null}
                          </CCol>
                        </CRow>
                      </React.Fragment>
                    );
                  }
                )}
              <br />
              <CButton
                title="Add Value"
                color="secondary"
                variant="outline"
                size="sm"
                shape="rounded-pill"
                onClick={() => addOptionValue(optIndex)}
              >
                <CIcon icon={cilPlus} />
              </CButton>
              <hr />
            </div>
          );
        })
      }

      <CButton
        type="button"
        color="primary"
        size="sm"
        variant="outline"
        onClick={addOption}
      >
        Add Option
      </CButton>
    </>
  );
}

export default Variants;
