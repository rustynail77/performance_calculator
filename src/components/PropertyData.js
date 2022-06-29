import React, {useState, useEffect, useContext} from 'react';
import {AppContext} from '../App';

const PropertyData = () => {

    const {propData, setPropData} = useContext(AppContext);
    const [propIds, setPropIds] = useState([]);
    const [currPropId, setCurrPropId] = useState('');
    const [currRevenue, setCurrRevenue] = useState('');
    
    useEffect(() =>{
        console.log('propData has:',propData.length);
        const distinctIds = findDistinctItems(propData, 'prop_id');
        setPropIds(distinctIds);
    },[]);

const findDistinctItems = (objArr, key) => {
    const distinctVals = [];
    for (let i = 0; i < objArr.length; i++)
        if (!distinctVals.includes(objArr[i][key]))
            distinctVals.push(objArr[i][key]);
    console.log('dist:',distinctVals);
    return distinctVals;
}

const handleSelectProp = (e) => {
    console.log('currPropId:', e.target.value);
    setCurrPropId(e.target.value);
}

const showMonthlyRevenue = () => {
    const year=document.getElementById('year').value;
    const month=document.getElementById('month').value;
    const data = propData.filter(prop=>prop.prop_id===currPropId)
                .filter(prop=>prop.year===year)
                .filter(prop=>prop.month===month)[0];
    const revenue = data.nightly_price * data.occupancy_rate * 30;
    console.log(data);
    setCurrRevenue(parseInt(revenue));
}

return (
    <>
        <h2>Property Datasheet</h2>
        Select property id: 
        <select onChange={handleSelectProp}>
            {
                (propIds.length===0)?<>No properties found</>:
                propIds.map(propId=>
                    <option key={propId} value={propId}>{propId}</option>)
            }
        </select>
        <br/>
        {
            (currPropId==='')?<></>:
            <>
                Select year:
                <select id='year'>
                    {
                        (findDistinctItems(propData,'year'))
                            .map(year=>
                            <option key={year} value={year}>{year}</option>)
                    }
                </select>
                Select month:
                <select id='month'>
                    {
                        (findDistinctItems(propData,'month'))
                            .map(month=>
                            <option key={month} value={month}>{month}</option>)
                    }
                </select>
                <button onClick={showMonthlyRevenue}>Show monthly revenue</button>
            </>
        }
        <h3>Monthly Revenue: {currRevenue}</h3>
    </>
)

}

export default PropertyData;