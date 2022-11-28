import React from 'react'
import filter from '../../assets/images/icon/filter.svg';
import search from '../../assets/images/icon/search.svg';
import  { DebounceInput } from 'react-debounce-input';
import { useDispatch } from 'react-redux';
import { searchQuery } from '../../redux/action/action';

const SearchBar = ({ searchVal, setSearchVal }) => {
    const dispatch = useDispatch();
    return (
        <>
            <form>
                <div className="input-group mb-3">
                    <DebounceInput
                        type="text"
                        className="form-control"
                        placeholder="What are you looking for ?"
                        value={searchVal}
                        debounceTimeout={500}
                        onChange={e => {
                            dispatch(searchQuery(e.target.value));
                            setSearchVal(e.target.value)
                        }} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2"><img
                        src={filter} alt="Submit" /></button>
                    <img className="search" src={search} alt="Icon" />
                </div>
            </form>
            {/* <input color="primary" type="text" size="sm" placeholder="Search" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} /> */}
        </>
    )
}

export default SearchBar