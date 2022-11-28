import { SubPlanService } from 'src/services/subscriptionPlans';

const yymmddToDate = (dateString) => {
  // const d = dateString.split('/');
  const dateObj = new Date(dateString);
  return dateObj;
}

const getMinExhibitonStartDate = () => {
  const nextWeek = new Date();
  nextWeek.setDate(new Date().getDate() + 7) // Getting next week as starting date

  let year = nextWeek.getFullYear();
  let month = nextWeek.getMonth() + 1; // the months are indexed starting with 0
  let date = nextWeek.getDate();

  // Converting date in two digits, if it is in single digit
  if (date.toString().length === 1) {
    date = `0${date}`
  }

  // Converting month in two digits, if it is in single digit
  if (month.toString().length === 1) {
    month = `0${month}`
  }

  let dateStr = `${year}-${month}-${date}`;

  return dateStr;
}

const getExhibitonEndDate = async (subscriptionId, startDate) => {

  const res = await SubPlanService.getSubscriptionById(subscriptionId);
  const startDateObj = yymmddToDate(startDate); // converting start date in yymmddd to date object
  const subscriptionDays = res.data.days; // getting subscription days
  startDateObj.setDate(startDateObj.getDate() + subscriptionDays);
  let year = startDateObj.getFullYear();
  let month = startDateObj.getMonth() + 1; // the months are indexed starting with 0
  let date_1 = startDateObj.getDate();
  // Converting date in two digits, if it is in single digit
  if (date_1.toString().length === 1) {
    date_1 = `0${date_1}`;
  }
  // Converting month in two digits, if it is in single digit
  if (month.toString().length === 1) {
    month = `0${month}`;
  }
  let dateStr = `${year}-${month}-${date_1}`;

  return dateStr;
}


const getMinExtendExhibitonEndDate = () => {
  const nextWeek = new Date();
  nextWeek.setDate(new Date().getDate() + 2) // Getting next week as starting date

  let year = nextWeek.getFullYear();
  let month = nextWeek.getMonth() + 1; // the months are indexed starting with 0
  let date = nextWeek.getDate();

  // Converting date in two digits, if it is in single digit
  if (date.toString().length === 1) {
    date = `0${date}`
  }

  // Converting month in two digits, if it is in single digit
  if (month.toString().length === 1) {
    month = `0${month}`
  }

  let dateStr = `${year}-${month}-${date}`;

  return dateStr;
}

const getExhibitonExtendEndDate = async (endDate) => {
  const endDateObj = yymmddToDate(endDate); // converting start date in yymmddd to date object
  const subscriptionDays = 2; // getting subscription days
  endDateObj.setDate(endDateObj.getDate() + subscriptionDays);
  let year = endDateObj.getFullYear();
  let month = endDateObj.getMonth() + 1; // the months are indexed starting with 0
  let date_1 = endDateObj.getDate();
  // Converting date in two digits, if it is in single digit
  if (date_1.toString().length === 1) {
    date_1 = `0${date_1}`;
  }
  // Converting month in two digits, if it is in single digit
  if (month.toString().length === 1) {
    month = `0${month}`;
  }
  let dateStr = `${year}-${month}-${date_1}`;
  return dateStr;
}

const getExtendOption = async (startDate, endDate) => {
  const endDateObj = yymmddToDate(endDate); // converting start date in yymmddd to date object
  const subscriptionDays = 2; // getting subscription days
  endDateObj.setDate(endDateObj.getDate() + subscriptionDays);
  let year = endDateObj.getFullYear();
  let month = endDateObj.getMonth() + 1; // the months are indexed starting with 0
  let date_1 = endDateObj.getDate();
  // Converting date in two digits, if it is in single digit
  if (date_1.toString().length === 1) {
    date_1 = `0${date_1}`;
  }
  // Converting month in two digits, if it is in single digit
  if (month.toString().length === 1) {
    month = `0${month}`;
  }
  let dateStr = `${year}-${month}-${date_1}`;
  return dateStr;
}


export {
  yymmddToDate,
  getMinExhibitonStartDate,
  getExhibitonEndDate,
  getExhibitonExtendEndDate,
  getMinExtendExhibitonEndDate,
  getExtendOption
};
