

var markerList = [];
var pointArray = [];
var marker;
	var lonlat;
	var markers = [];

const MapApis = {

    initTemp : (req) => {
        console.log('initTemp req :',req);
        const data = {
            name : req.id,
            type : req.type
        }
        console.log('initTemp data :', data.name);

        const map = new Tmapv2.Map(data.name,
            {
                center: new Tmapv2.LatLng(37.566481622437934,126.98502302169841),
                width: "100%",
                height: "100%",
                zoom:15
            }
        );
        // // 출발
        // addMarker("llStart",126.98502302169841,37.566481622437934,1,map);
        // // 도착
        // addMarker("llEnd",126.98502302169841,37.49288934463672,2,map);
        map.addListener("click",  (e)=> onClickMarker(e,map)); // 이벤트의 종류와 해당 이벤트 발생 시 실행할 함수를 리스너를 통해 등록합니다
       // map.addListener("click", onClick); // 이벤트의 종류와 해당 이벤트 발생 시 실행할 함수를 리스너를 통해 등록합니다
		// map.addListener("zoom_changed", onChanged); // 지도의 줌 변경시, 이벤트 리스너 등록.
		// map.addListener("drag", onDrag); // 지도 드래그시, 이벤트 리스너 등록.
		// map.addListener("dragstart", onDragstart); // 지도 드래그 시작시, 이벤트 리스너 등록.
		// map.addListener("dragend", onDragend); // 지도 드래그 끝났을 때, 이벤트 리스너 등록.
		// map.addListener("contextmenu", onContextmenu); // 지도 우클릭시, 이벤트 리스너 등록.
		// map.addListener("touchstart", onTouchstart); // 모바일에서 지도 터치 시작시, 이벤트 리스너 등록.
		// map.addListener("touchend", onTouchend); // 모바일에서 지도 터치 터치가 끝났을때, 이벤트 리스너 등록.

        addSearchBtn();
        return map;
    }

    // marker : async (maps) => {
    //     return new Tmapv2.Marker({
    //         position: new Tmapv2.LatLng(37.566481622437934,126.98502302169841),
    //         map: maps
    //     });
    // }
}
/*
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
    /*
    markerList[tag] = marker;
    return marker;
}*/
// 모든 마커를 제거하는 함수입니다.
function removeMarkers() {
    console.log('Markers:');
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        console.log(markers[i]);
    }
    markers = [];
}
function onClickMarker(e, map){
    // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
    removeMarkers();
    var result = '클릭한 위치의 좌표는' + e.latLng + '입니다.';
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = result;
    lonlat = e.latLng;
    //Marker 객체 생성.
    marker = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
        map: map //Marker가 표시될 Map 설정.
    });

    markers.push(marker);
}


function addSearchBtn() {
    console.log('search!');
    var resultDiv = document.getElementById("search");
    resultDiv.addEventListener("click",(e)=> loadGetAddressFromLonLat())
}
	// 지도를 클릭했을때 발생하는 이벤트 함수입니다.
	function onClick(e) {
        console.log('click data :', data);
		var result = '클릭한 위치의 좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}

	function onChanged(e) {
		var result = '현재 zoom : ' + e.zoom+ '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}
	function onDrag(e) {
		var result = '드래그한 위치의 좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}
	function onDragstart(e) {
		var result = '드래그를 시작한 위치의 좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}
	function onDragend(e) {
		var result = '드래그가 끝난 위치의 중앙좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}
	function onContextmenu(e) {
		var result = '우클릭한 위치의 좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}
	function onTouchstart(e) {
		var result = '모바일에서 터치가 시작된 위치의 좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}

	function onTouchend(e) {
		var result = '모바일에서 터치가 끝난 위치의 좌표는' + e.latLng + '입니다.';
		var resultDiv = document.getElementById("result");
		resultDiv.innerHTML = result;
	}
	function loadGetAddressFromLonLat() {
		// TData 객체 생성
		var tData = new Tmapv2.extension.TData();

		var optionObj = {
			coordType: "WGS84GEO"       //응답좌표 타입 옵션 설정 입니다.
		};

		var params = {
			onComplete:onComplete,      //데이터 로드가 성공적으로 완료 되었을때 실행하는 함수 입니다.
			onProgress:onProgress,      //데이터 로드 중에 실행하는 함수 입니다.
			onError:onError             //데이터 로드가 실패했을때 실행하는 함수 입니다.
		};

		// TData 객체의 지오코딩 함수
		tData.getGeoFromAddressJson("서울","은평","갈현","397", optionObj, params);
	}

	//지오코딩
	function onComplete() {
		console.log(this._responseData); //json으로 데이터를 받은 정보들을 콘솔창에서 확인할 수 있습니다.

		var lon = this._responseData.coordinateInfo.lon;//json으로 데이터를 받은 정보에서 경도정보를 추출합니다.
		var lat = this._responseData.coordinateInfo.lat;//json으로 데이터를 받은 정보에서 위도정보를 추출합니다.

		var marker = new Tmapv2.Marker({
			position : new Tmapv2.LatLng(lat, lon)
		});

		marker.setMap(map);
		map.setCenter(new Tmapv2.LatLng(lat, lon));
	}

	//데이터 로드중 실행하는 함수입니다.
    function onProgress(){

    }

  	//데이터 로드 중 에러가 발생시 실행하는 함수입니다.
    function onError(){
        alert("onError");
    }
export default MapApis;
