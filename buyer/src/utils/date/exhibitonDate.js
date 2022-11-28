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

const getExhibitonEndDate = (subscriptionId, startDate) => {
  console.log("subscriptionId, startDate", subscriptionId, startDate)
  return SubPlanService.getSubscriptionById(subscriptionId)
    .then((res) => {
      const startDateObj = yymmddToDate(startDate); // converting start date in yymmddd to date object
      const subscriptionDays = res.data.days; // getting subscription days


      startDateObj.setDate(startDateObj.getDate() + subscriptionDays)

      let year = startDateObj.getFullYear();
      let month = startDateObj.getMonth() + 1; // the months are indexed starting with 0
      let date = startDateObj.getDate();

      // Converting date in two digits, if it is in single digit
      if (date.toString().length === 1) {
        date = `0${date}`
      }

      // Converting month in two digits, if it is in single digit
      if (month.toString().length === 1) {
        month = `0${month}`
      }

      let dateStr = `${year}-${month}-${date}`;
      console.log(dateStr)
      return dateStr;
    })
}

export default getExhibitonEndDate;

export {
  yymmddToDate,
  getMinExhibitonStartDate,
  getExhibitonEndDate
};
