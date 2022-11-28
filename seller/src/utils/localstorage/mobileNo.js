const MOBILE_KEY = 'userMobileNo';

const getMobileNo = () => {
  const mobileNo = localStorage.getItem(MOBILE_KEY);
  if (!mobileNo) {
    localStorage.removeItem(MOBILE_KEY);
    return false;
  }
  return mobileNo;
};

const setMobileNo = (mobileValue) => {
    localStorage.setItem(MOBILE_KEY, mobileValue);
    return true;
};

const removeMobileNo = () => {
  localStorage.removeItem(MOBILE_KEY);
  return true;
}

export { getMobileNo, setMobileNo, removeMobileNo };