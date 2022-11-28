import React from 'react';
import { CButton, CFormLabel, CFormInput, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import "../../assets/styles/style.css"

const Attributes = (props) => {
  const { attributes, setAttributes } = props;

  // Attribute CRUD functions
  const addAttribute = () => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray.push({
      attributeName: '',
      attributeValue: ''
    });
    setAttributes(tempArray);
  }

  const updateAttributeName = (index, attributeName) => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray[index].attributeName = attributeName;
    setAttributes(tempArray);
  }

  const updateAttributeValue = (index, attributeValue) => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray[index].attributeValue = attributeValue;
    setAttributes(tempArray);
  }

  const removeAttribute = (index) => {
    const tempArray = JSON.parse(JSON.stringify(attributes));
    tempArray.splice(index, 1);
    setAttributes(tempArray);
  }

  return (
    <>
      <CFormLabel className='underlineStyle'>Attributes</CFormLabel>
      <br />
      {
        attributes &&
        attributes.length > 0 &&
        attributes.map((attribute, index) => {
          return (
            <div key={index}>
              &nbsp;
              <div className='mb-3'>
                <CRow>
                  <CCol sm={5}>
                    <CFormLabel htmlFor={`attrName${index}`}>Attribute Name</CFormLabel>
                    <CFormInput
                      type="text"
                      name={`attrName${index}`}
                      id={`attrName${index}`}
                      value={attribute.attributeName}
                      onChange={(e) => {
                        updateAttributeName(index, e.target.value)
                      }}
                      required
                    />
                  </CCol>
                  <CCol>
                    <CFormLabel htmlFor={`attrVal${index}`}>Attribute Value</CFormLabel>
                    <CFormInput
                      type="text"
                      name={`attrVal${index}`}
                      id={`attrVal${index}`}
                      value={attribute.attributeValue}
                      onChange={(e) => {
                        updateAttributeValue(index, e.target.value)
                      }}
                      required
                    />
                  </CCol>
                  <CCol sm={2}>
                    <CButton
                      title="Delete"
                      color="danger"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttribute(index)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </div>
          );
        })
      }
      <CButton
        type="button"
        color="warning"
        size="sm"
        variant="outline"
        onClick={addAttribute}
      >
        Add Attribute
      </CButton>
    </>
  );
}

export default Attributes;
