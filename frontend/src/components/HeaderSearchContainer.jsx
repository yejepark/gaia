import classes from './Filters.module.css';

function SearchContainer() {
	
	return (
	<>
		<div className={classes['search-container'] + ' focusable'}>
            <input type="search" placeholder="지역을 입력해 주세요" name="region-search"/>
    	</div>
    </>
    );
}

export default SearchContainer;