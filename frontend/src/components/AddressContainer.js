import newSellPostClasses from '../pages/NewSellPost.module.css';
import classes from './AddressContainer.module.css';

import AddressInput from './AddressInput';
import DropDownInput from './DropDownInput';


function AddressContainer({ addressData, setAddressData, dongName, setDongName }) {
	
	let addressTopEl, addressDongEl, addressDetailEl, dongNms;

	let hasAddressData = Object.keys(addressData).length > 0;

    if (hasAddressData) {
    	addressTopEl = (
	    	<>
		    	<div className={newSellPostClasses["input-title"]}></div>
				<input type="text" 
					className={classes["address-value"]} id='address-value' 
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
					<div className={newSellPostClasses["input-title"]}>동명칭</div>
					<DropDownInput
	                    localValue={dongName} setLocalValue={setDongName} 
	                    values={dongNms} 
	                    options={{
	                    	placeholder: "직접입력",
	                    	custumClass: classes['dong-input'],
	                    	// style: {width: `${dongNmMaxLen+5}rem`}
	                    }}
	                />
				</>
			);	
		}

		addressDetailEl = (
			<>
				<div className={newSellPostClasses["input-title"]}>상세주소</div>
				<input type="text" className={classes["address-detail"]} id="address-detail" placeholder="" />
			</>
		);
	}

	return (
		<div className={newSellPostClasses["input-grid"]}>
			<div className={newSellPostClasses["input-title"]}>주소</div>
			<AddressInput addressData={addressData} setAddressData={setAddressData} />

			{addressTopEl}
			{addressDongEl}
			{addressDetailEl}
		</div>
	)
}

export default AddressContainer;