// import { useEffect, useState } from 'react';

import AddressInput from '../components/AddressInput';
import DropDownInput from '../components/DropDownInput';


function AddressContainer({ addressData, setAddressData, dongName, setDongName }) {
	
	let addressTopEl, addressDongEl, addressDetailEl, dongNms;

	let hasAddressData = Object.keys(addressData).length > 0;

    if (hasAddressData) {
    	addressTopEl = (
	    	<>
		    	<div className={"input-title"}></div>
				<input type="text" 
					className={"address-value"} id='address-value' 
					placeholder={'직접입력'} 
					defaultValue={addressData.address}
					autoComplete="off"
				/>
			</>
		);

		dongNms = addressData.brTitle.map(item => item.dongNm.trim()).filter(name => name.length > 0);
		if (dongNms.length > 0) {
			dongNms.sort();
			let dongNmMaxLen = Math.max(...addressData.brTitle.map(item=>item.dongNm.length));
			dongNmMaxLen = Math.min(dongNmMaxLen, 10)
			
			addressDongEl = (
				<>
					<div className={"input-title"}>동명칭</div>
					<DropDownInput
	                    localValue={dongName} setLocalValue={setDongName} 
	                    values={dongNms} 
	                    options={{
	                    	placeholder: "직접입력",
	                    	custumClass: 'dong-input',
	                    	// style: {width: `${dongNmMaxLen+5}rem`}
	                    }}
	                />
				</>
			);	
		}

		addressDetailEl = (
			<>
				<div className={"input-title"}>상세주소</div>
				<input type="text" className={"address-detail"} id="address-detail" placeholder="" />
			</>
		);
	}

	return (
		<div className="input-grid">
			<div className="input-title">주소</div>
			<AddressInput addressData={addressData} setAddressData={setAddressData} />

			{addressTopEl}
			{addressDongEl}
			{addressDetailEl}
		</div>
	)
}

export default AddressContainer;