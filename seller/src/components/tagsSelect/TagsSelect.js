import React from 'react'
import Creatable from 'react-select/creatable'

const TagsSelect = (props) => {
  const { tags, defaultValue, addedTags, setAddedTags } = props;

  function handleTags(data) {
    setAddedTags(data);
  }

  return (
    <>
      <Creatable
        id="tagIds"
        name="tagIds"
        options={tags}
        placeholder="Add Tags"
        defaultValue={defaultValue}
        value={addedTags}
        onChange={handleTags}
        isSearchable={true}
        isMulti
      />
    </>
  );
}

export default TagsSelect;
