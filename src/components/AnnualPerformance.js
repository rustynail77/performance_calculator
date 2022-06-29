import MyChart from './MyChart';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../App';

const AnnualPerformance = (props) => {
    
    const [toggleDisplay, setToggleDisplay] = useState('Chart');
    const {chartInfo, setChartInfo, predictions} = useContext(AppContext);
    const property = predictions[props.property];
    console.log('props.property:', property);

    const sortCurrMonth = (arr) => {
        const annualEntries = Object.entries(arr);
        const currMonth = new Date().getMonth();
        const result = [];

        for (let i=0; i<12; i++) {
            if (i+currMonth>=12) result.push(annualEntries[i+currMonth-12])
            else result.push(annualEntries[i+currMonth]);
        }
        return result;
    }
    

    const handleDisplay = () => {
        setToggleDisplay((toggleDisplay==='Chart')?'Table':'Chart');
    }


    const createChartInfo = () => {
        const income = [];
        const expenses = [];
        const performance = [];
        const base = sortCurrMonth(property.income);

        for (let i=0; i<base.length; i++) {
            let theMonth = Number(base[i][0]);
            let monthIncome = base[i][1];
            let monthExpenses = property.expenses[theMonth];
            let monthPerformance = monthIncome + monthExpenses;
            income.push([theMonth,monthIncome]);
            expenses.push([theMonth, monthExpenses]);
            performance.push([theMonth, monthPerformance]);
        }
        const result = {income:income, expenses:expenses,performance:performance};
        
        console.log('created chartInfo:', result);
        
        setChartInfo({...result});
        return result;
    }


    useEffect (()=>{
        
        const theInfo = createChartInfo();
        
        console.log('setting chart info in useEffect',theInfo);
        
        setChartInfo({...theInfo});
    },[])
    
    
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