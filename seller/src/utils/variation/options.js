import { createVariation } from "./combinations";

const formatOptionFromAPI = (variants) => {
  const tempVariation = {};
  const allVariation = Object.keys(variants[0].variant);
  for (const varaintKey of allVariation) {
    tempVariation[varaintKey] = new Set();
  }

  for (const variantData of variants) {
    for (const varaintKey of allVariation) {
      tempVariation[varaintKey].add(variantData.variant[varaintKey]);
    }
  }

  const tempOptions = [];
  for (const [i, opt] of allVariation.entries()) {
    const tempOpt = {
      optionName: opt,
      optionValue: Array.from(tempVariation[opt]),
    };
    tempOptions.push(tempOpt);
  }
  setOptions(tempOptions);
};

const formatOptions = (optionsParam) => {
  const formattedOptions = {};
  optionsParam.map((option) => {
    formattedOptions[option.optionName] = option.optionValue;
  });
  const variationPriceArray = [];
  const optArr = Object.keys(formattedOptions);
  const firstElement = optArr.shift();
  if ((optArr && optArr.length > 0) || firstElement) {
    for (const optionValue of formattedOptions[firstElement]) {
      let tempObject = { variant: {}, price: 0, compareAtPrice: 0 };
      tempObject.variant[firstElement] = optionValue;
      variationPriceArray.push(tempObject);
    }
    const newData = createVariation(
      variationPriceArray,
      optArr,
      formattedOptions
    );
    setCombinations(newData);
  }
  if (optionsParam && optionsParam.length === 0) {
    setCombinations([]);
  }
};

export { formatOptionFromAPI, formatOptions };
