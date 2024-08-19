import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from "react-router-dom";

import { debounce } from '../utilities/methods';

import classes from './SearchContainer.module.css';

function ListItem({ value, text, onClick }) {
    return (
        <li value={value} onClick={onClick} >
            <button type='button' className={classes['dropdown-item']}>{text || value}</button>
        </li>
    );
}

function getSearchStr(regionData) {
    let sangkwonIdx = '';
	if (regionData.BD_NM_CNT > 1) {
		sangkwonIdx = ' 제' + regionData.BD_NM_IDX + '상권';
	} else if (regionData.BD_NM_CNT === 1) {
		sangkwonIdx = ' 상권';
	}
	return regionData.FULL_NM + sangkwonIdx;
}

function getDefaultSearchStr(location) {
	const defaultRegionData = JSON.parse(sessionStorage.getItem('regionData') || '{}');
	if (Object.keys(defaultRegionData).length === 0) return '';

	const currentPath = location.pathname;
	const pathParts = currentPath.split('/');
	const locIndex = pathParts.findIndex(x => x==='location');
	const locId = locIndex >= 0 ? pathParts[locIndex + 1]: '';
	
	if (!locId.startsWith(defaultRegionData.id)) return '';

	return getSearchStr(defaultRegionData);
}

function SearchContainer() {

	const location = useLocation();
	const navigate = useNavigate();
	
	const [regionsData, setRegionsData] = useState([]);
	// console.log('in search container. regionsData: ', regionsData);
	
	const { register, watch, handleSubmit, setValue } = useForm({
		defaultValues: { searchStr: getDefaultSearchStr(location) },
		mode: 'onChange',
	});

	// -------------------------------------------------------------------
	const onChange = async (data) => {
		let url = "http://localhost:8000/sell_posts/search_regions?";
		const res = await fetch(
			url + new URLSearchParams({ search_str: data.searchStr }).toString()
		);
		
		const recvData = await res.json();
		setRegionsData(recvData['regions']);
	}

	// handleSubmit validates search-string before submission.
	useEffect(() => {
		const subscription = watch(
			handleSubmit(debounce(onChange, 200))
		);
		return () => subscription.unsubscribe();
	}, [handleSubmit, watch]);

	// -------------------------------------------------------------------
	const onSubmit = () => {
		if (regionsData.length === 0) return;

		const regionData = regionsData[0]
		setValue('searchStr', getSearchStr(regionData));
        navigate('/posts/location/' + regionData.id + '_' + regionData.BD_NM_IDX)
        setDropdownOpen(false);
	}

	function dropdownClickHandler(e) {
		const optionEl = e.currentTarget;
        const v = optionEl.getAttribute('value');
        let regionData;
        if (v) {
        	regionData = regionsData.filter(item => item.id === v)[0];
        } else {
        	setDropdownOpen(false);
        	return;
        }

        setValue('searchStr', getSearchStr(regionData));
        navigate('/posts/location/' + regionData.id + '_' + regionData.BD_NM_IDX);
        setDropdownOpen(false);
	}

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const dropdownOpenClass = dropdownOpen ? '' : ' hidden';
	const dropdownItems = regionsData.map(item => {
		return <ListItem key={item.id}
			value={item.id} 
			text={getSearchStr(item)}
			onClick={dropdownClickHandler}
		/>
	});

	// -------------------------------------------------------------------
	return (
		<form className={classes['search-container'] + ' focusable'} onSubmit={handleSubmit(onSubmit)}>
            <input type="search" 
            	{...register('searchStr', {
	            	required: true, 
	            	minLength: 2,
	            	pattern: /^[\u{AC00}-\u{D7AF}a-zA-Z0-9 ]+$/u,
	            	onChange: (e) => { setDropdownOpen(regionsData.length > 0); }
            	})}
            	placeholder='지역명 또는 상권명 검색'
            />
            <div className={'backdrop' + dropdownOpenClass} onClick={dropdownClickHandler}></div>
            <div className={'positional-container'}>
                <ol className={classes['dropdown'] + dropdownOpenClass} tabIndex='-1'>
                    {dropdownItems}
                </ol>
            </div>
        </form>
    );
}

export default SearchContainer;