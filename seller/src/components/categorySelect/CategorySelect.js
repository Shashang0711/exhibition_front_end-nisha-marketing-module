import React from 'react'
import Select from 'react-select'

const CategorySelect = (props) => {
  const { categories, defaultValue, selectedOptions, setSelectedOptions } = props;

  const handleSelect = (data) => {
    setSelectedOptions(data)
  }

  return (
    <>
      <Select
        id="categoryIds"
        name="categoryIds"
        options={categories}
        placeholder="Select categories"
        defaultValue={defaultValue}
        value={selectedOptions}
        onChange={handleSelect}
        isSearchable={true}
        isMulti
      />
    </>
  );
}

export default CategorySelect
