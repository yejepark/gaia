import filtersClasses from './Filters.module.css';
import classes from './AddressInput.module.css';

let { daum, kakao } = window;

const geocoder = new kakao.maps.services.Geocoder();

function foldDaumPostcode() {
    document.getElementById('postcodeWrap').style.display = 'none';
}

async function postAddressData(data) {
    let res = await fetch(
        "http://localhost:8000/sell_posts/address_data/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            mode: "cors"
        }
    );
    // console.log('in postAddressData', JSON.stringify(data));

    let recvData = await res.json();
    console.log('in postAddressData', recvData)

    return recvData;
}

const addressSearch = address => {
    return new Promise((resolve, reject) => {
        geocoder.addressSearch(address, function(result, status) {
            // console.log(address, result)
            if (status === kakao.maps.services.Status.OK) {
                resolve({ "lat": result[0].y, "lng": result[0].x });
            } else {
                reject(status);
            }
        });
    });
};

function AddressInput({ addressData, setAddressData }) {

    let hasAddressData = Object.keys(addressData).length > 0;    
    let zonecodeEl;
    if (hasAddressData) {
        let zonecodeValue = '우편번호: ' + addressData.zonecode;
        zonecodeEl = <div id="zonecode">{zonecodeValue}</div>
    }

    function execDaumPostcode() {
        var element_wrap = document.getElementById('postcodeWrap');
        // 현재 scroll 위치를 저장해놓는다.
        // var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        new daum.Postcode({
            oncomplete: async function(data) {
                let newData = {
                    jibunAddress: data.jibunAddress.length > 0 ? data.jibunAddress : data.autoJibunAddress,
                    roadAddress: data.roadAddress.length > 0 ? data.roadAddress : data.autoRoadAddress,

                    sido: data.sido,
                    sigungu: data.sigungu,
                    sigunguCode: data.sigunguCode,

                    zonecode: data.zonecode,

                    // bname: data.bname1.length > 0 ? data.bname1 + ' ' + data.bname2 : data.bname2,
                    bcode: data.bcode,

                    roadname: data.roadname,
                    roadnameCode: data.roadnameCode,

                    buildingName: data.buildingName,
                    buildingCode: data.buildingCode
                }

                let selectedAddress = data.userSelectedType === 'R' ? newData.roadAddress : newData.jibunAddress;

                try {
                    let { lat, lng } = await addressSearch(newData.roadAddress);
                    newData['latlng'] = [lat, lng];
                } catch (error) {
                    console.log(error);
                }

                // console.log('in execDaumPostcode', data);
                console.log('in execDaumPostcode', newData);

                let totData = await postAddressData(newData)
                totData['userSelectedType'] = data.userSelectedType;

                setAddressData(totData);

                element_wrap.style.display = 'none';

                // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                // document.body.scrollTop = currentScroll;

                let addressValueEl = document.getElementById('address-value');
                if (addressValueEl) {
                    addressValueEl.value = selectedAddress;    
                }

                // 커서를 상세주소 필드로 이동한다.
                let addressDetailEl = document.getElementById('address-detail');
                if (addressDetailEl) {
                    addressDetailEl.focus();    
                }
            },

            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
            onresize: function(size) {
                element_wrap.style.height = size.height + 'px';
            },

            width: '100%',
            height: '100%'
        }).embed(element_wrap);

        // iframe을 넣은 element를 보이게 한다.
        element_wrap.style.display = 'block';
    }

    return (
        <div>
            <div className={classes["address-container"]}>
                <div className={classes["address-subcontainer"]}> 
                    <input type="button" onClick={execDaumPostcode} value="주소입력하기"></input>
                </div>
                {zonecodeEl}
            </div>
            <div className={filtersClasses["positional-container"]}>
                <div id="postcodeWrap" className={classes.postcodeWrap}>
                    <div className={classes["btnFoldWrap"]} onClick={foldDaumPostcode} alt="접기 버튼"></div>
                </div>
            </div>
        </div>
    )
}

export default AddressInput