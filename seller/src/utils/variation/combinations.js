const getDataFromVariations = (index) => {
  if (combinations && combinations[index] && combinations[index].variant) {
    const parsedValues = combinations[index].variant;
    const values = Object.values(parsedValues);
    let tempString = "";
    if (values && values.length) {
      values.forEach((data) => {
        tempString = `${tempString}/${data}`;
      });
    }
    return <p>{tempString.slice(1)}</p>;
  } else {
    return <p></p>;
  }
};

// Function to make combinations of variantions
const createVariation = (varationArray, optArr, formattedOptions) => {
  if (optArr.length === 0) {
    return varationArray;
  }
  const keyName = optArr[0];
  const emptyVarriationArr = [];
  if (formattedOptions[keyName] && formattedOptions[keyName].length > 0) {
    for (const optionValue of formattedOptions[keyName]) {
      const fakeArr = [];
      for (let i = 0; i < varationArray.length; i++) {
        let tempObject = JSON.parse(JSON.stringify(varationArray[i]));
        tempObject.variant[keyName] = optionValue;
        fakeArr.push(tempObject);
      }
      emptyVarriationArr.push(...fakeArr);
    }
    varationArray = JSON.parse(JSON.stringify(emptyVarriationArr));
  }
  optArr.shift();
  return createVariation(varationArray, optArr, formattedOptions);
};

export { getDataFromVariations, createVariation };
