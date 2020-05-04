const deepCopyFunction = inObject => {
  let outObject, value, key;

  if (typeof inObject !== 'object' || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopyFunction(value);
  }

  return outObject;
};

const getUpdatedMenu = (restaurantDetails) => {
  let updatedMenu = restaurantDetails.menu.categories.map((category) => {
    category.items = category.items.map((item) => {
      item.count = 0;
      return item;
    })
    if (category.has_subcategory) {
      category.subcategories = category.subcategories.map((subCategory) => {
        subCategory.items = subCategory.items.map((item) => {
          item.count = 0
          return item
        })
        subCategory.count = 0
        return subCategory
      })
    }
    return category
  })
  return updatedMenu
}

export { deepCopyFunction, getUpdatedMenu }
