import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userTabBack, loaderOverlay, searchQuery } from "../../redux/action/action";
import NavTabs from "../../layouts/navTabs/NavTabs";
import ExhibitionList from "../exhibitionList/ExhibitionList";
import Faq from "../faq/Faq";
import Home from "../home/Home";
import Profile from "../pages/profile/Profile";
import Loader from "../loader/Loader";
const DefaultLayout = () => {
  const userTabHistFromRedux = useSelector((state) => state.userTab);
  const loading = useSelector((state) => state.loading);
  const query = useSelector((state) => state.query);
  const dispatch = useDispatch();
  const homeRef = useRef();
  const exhibitionRef = useRef();
  const profileRef = useRef();
  const faqRef = useRef();

  const tabClicker = (tabName) => {
    const a = tabName.split('?');
    switch (a[0]) {
      case "home":
        homeRef.current.click();
        break;
      case "faq":
        faqRef.current.click();
        break;
      case "profile":
        profileRef.current.click();
        break;
      case "exhibition":
        if(a[1]) {
          const b = a[1].split("=");
          dispatch(searchQuery(b[1]));
        }
          // set query state in redux
        exhibitionRef.current.click();
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    
    dispatch(loaderOverlay(true))
    const topOfStack = userTabHistFromRedux.pop();
    console.log(topOfStack);
    tabClicker(topOfStack);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const backNavHandler = () => {
    //current tab
    const currLocation = userTabHistFromRedux.pop();
    console.log(currLocation);
    console.log(userTabHistFromRedux);
    dispatch(userTabBack(userTabHistFromRedux));
    // previous
    const prevLocation = `${userTabHistFromRedux.pop()}`;
    tabClicker(prevLocation);
  };
  const loaderClose = () => {
    dispatch(loaderOverlay(false));
  }
  const exhibitionHandle = (query) => {
    tabClicker(`exhibition?search=${query}`)
  }
  return (
    <React.Fragment>
      {
        loading &&
        <Loader />
      }
      <div className='app-sc landing-sc'>
        <NavTabs ref={{ homeRef, exhibitionRef, profileRef, faqRef }} />
        <div className='tab-content' id='nav-tabContent'>
          <Home exhibition={exhibitionHandle} backHandler={backNavHandler} />
          <Profile backHandler={backNavHandler} />
          <ExhibitionList query={query} backHandler={backNavHandler} />
          <Faq loaderClose={loaderClose} backHandler={backNavHandler} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DefaultLayout;
