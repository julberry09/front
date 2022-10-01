import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
//const {Tmapv2} = window;
function addMarker(status, lon, lat, tag,map) {
  //출도착경유구분
  //이미지 파일 변경.
  var markerLayer;
  var imgURL;
  switch (status) {
      case "llStart":
          imgURL = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
          break;
      case "llPass":
          imgURL = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png';
          break;
      case "llEnd":
          imgURL = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
          break;
      default:
  };
  var marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat,lon),
      icon: imgURL,
      map: map
  });
  // 마커 드래그 설정
  marker.tag = tag;
  /*marker.addListener("dragend", function (evt) {
      markerListenerEvent(evt);
  });
  marker.addListener("drag", function (evt) {
      markerObject = markerList[tag];
  });*/
  markerList[tag] = marker;
  return marker;
}
function onClickMarker(e, map){
  // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
  removeMarkers();
  var result = '클릭한 위치의 좌표는' + e.latLng + '입니다.';
  var resultDiv = document.getElementById("resultDest");
  resultDiv.innerHTML = result;
  lonlat = e.latLng;
  //Marker 객체 생성.
  marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
      map: map //Marker가 표시될 Map 설정.
  });

  markers.push(marker);
}

// 모든 마커를 제거하는 함수입니다.
function removeMarkers() {
  for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
  }
  markers = [];
}

const TMapDest = () => {

  useEffect(() => {

    const script = document.createElement("script");
    script.innerHTML = `
        function initTmap2() {
            var map = new Tmapv2.Map("TMapDest", {
                center: new Tmapv2.LatLng(37.766481622437934,127.79502302169841),
                width: "100%",
                height: "100%",
                zoom:15
            });
        }

        initTmap2();
   `;
    script.type = "text/javascript";
    //script.async = "async";
    script.async = false;
    document.head.appendChild(script);

  }, []);

  return (
    <div
      id="TMapDest"
      style={{
        height: "100%",
        width: "100%",
        position: "fixed",
      }}

    />
  );
}

export default TMapDest;
