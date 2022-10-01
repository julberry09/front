import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
//const {Tmapv2} = window;
const TMapDepart = () => {

  useEffect(() => {

    const script = document.createElement("script");
    script.innerHTML = `
        function initTmap() {
            var map = new Tmapv2.Map("TMapDepart", {
                center: new Tmapv2.LatLng(37.666481622437934,126.88502302169841),
                width: "100%",
                height: "100%",
                zoom:15
            });
        }

        initTmap();
   `;
   script.type = "text/javascript";
   //script.async = "async";
   script.async = false;
   document.head.appendChild(script);

  }, []);

  return (
    <div
      id="TMapDepart"
      style={{
        height: "100%",
        width: "100%",
        position: "fixed",
      }}
    />
  );
}

export default TMapDepart;
