import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";

const AppUrlListener = () => {
    let navigate = useNavigate();
    useEffect(() => {
      App.addListener('appUrlOpen', (event) => {
        // Example url: https://io.hypestreet.app/tabs/tab2
        // slug = /tabs/tab2
        const slug = event.url.split('.app').pop();
        if (slug) {
          navigate(slug);
        }
      });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;