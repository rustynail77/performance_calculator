import MyChart from './MyChart';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../App';
import sortCurrMonth from '../controllers/sortCurrMonth';

const AnnualPerformance = (props) => {
    
    const [toggleDisplay, setToggleDisplay] = useState('Chart');
    const {chartInfo, predictions} = useContext(AppContext);
    const property = predictions[props.property];
    console.log('props.property:', property);


    const handleDisplay = () => {
        setToggleDisplay((toggleDisplay==='Chart')?'Table':'Chart');
    }

    
    return (
    <>
        <button onClick={handleDisplay}>Display {(toggleDisplay==='Chart')?'Table':'Chart'}</button>
        {
            (toggleDisplay==='Chart' && chartInfo)
            ? <MyChart />
            : <ul>
                {
                    sortCurrMonth(property.income).map(entry=>
                        <li key={entry[0]}>Month: {entry[0]} - income: {entry[1]} | expenses: {property.expenses[entry[0]]} | Total: {entry[1]+property.expenses[entry[0]]}</li>
                    )                    
                }
            </ul>
        }         
    </>
    )
}

export default AnnualPerformance;