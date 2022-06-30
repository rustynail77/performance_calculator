import React, {useState, useEffect, useContext} from 'react';
import {AppContext} from '../App';
import AnnualPerformance from './AnnualPerformance';
import sortCurrMonth from '../controllers/sortCurrMonth';

const InputForm = () => {

    const {propData} = useContext(AppContext);
    const [propIds, setPropIds] = useState([]);
    const [currPropId, setCurrPropId] = useState('2096999');
    const [loanType, setLoanType] = useState('normal');
    const { chartInfo, setChartInfo,
            predictions, setPredictions} = useContext(AppContext);
    const currMonth = new Date().getMonth()+1;
    
    useEffect(() =>{
        const distinctIds = findDistinctItems(propData, 'prop_id');
        setPropIds(distinctIds);
    },[]);

    const findDistinctItems = (objArr, key) => {
        const distinctVals = [];
        for (let i=0; i<objArr.length; i++)
            if (!distinctVals.includes(objArr[i][key]))
                distinctVals.push(objArr[i][key]);
        return distinctVals;
    }
    
    const handleSelectProp = (e) => {
        setCurrPropId(e.target.value);
    }

    const returnMonthlyRevenue = (element) => {    
        return parseInt(element.nightly_price * element.occupancy_rate * 30);
    }

    const returnMonthlyExpenses = (loan_type , loan_rate=0, loan_amount, loan_duration) => {
        if (loan_rate === 0 || loan_type==='normal')
            return -(loan_amount)/loan_duration;

        let pvif = Math.pow(1 + loan_rate/100, loan_duration);
        let pmt = parseInt(- loan_rate/100 * (loan_amount * pvif) / (pvif - 1));
        return pmt;
    }

    const createPrediction = (monthlyExp = 0, loan_start = 0, loan_duration = 0, multiply_perf = 0) => {

        if (loan_duration>12) loan_duration=12;

        const relevData = propData.filter(prop=>prop.prop_id===currPropId);
        const income = {};
        const expenses = {};
        const multiplier = (multiply_perf===0)? 1 : 1+multiply_perf/100;
        
        let y = currMonth;
        for (let i=1; i<13; i++) {
            
            const monthly = relevData.filter(single=>Number(single.month)===i);
            let sum=0;
            monthly.forEach(element =>sum+=returnMonthlyRevenue(element));
            const monthlyAvg = sum/Number(monthly.length);
            income[i] = parseInt(monthlyAvg*multiplier);
            
            
            let expense = (i>loan_start && i<loan_start+loan_duration) ? parseInt(monthlyExp*multiplier) : 0;
            expenses[y] = expense;
            y++;
            if (y===13) y=1;
        }
        let tempPreds = {...predictions};
        const property = {income : income, expenses : expenses};
        tempPreds[currPropId] = property;
        setPredictions(tempPreds);

        const chartIncome = [];
        const chartExpenses = [];
        const chartPerformance = [];
        const base = sortCurrMonth(property.income);

        for (let i=0; i<base.length; i++) {
            let theMonth = Number(base[i][0]);
            let monthIncome = base[i][1];
            let monthExpenses = property.expenses[theMonth];
            let monthPerformance = monthIncome + monthExpenses;
            chartIncome.push([theMonth,monthIncome]);
            chartExpenses.push([theMonth, monthExpenses]);
            chartPerformance.push([theMonth, monthPerformance]);
        }
        const result = {income:chartIncome, expenses:chartExpenses,performance:chartPerformance};
        
        console.log('created chartInfo:', result);
        
        setChartInfo({...result});

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = e.target;
        const rate = (myForm.loan_rate) ? myForm.loan_rate.value : 0;
        let monthlyExpenses = returnMonthlyExpenses(myForm.loan_type.value, rate, myForm.loan_amount.value, myForm.loan_duration.value) || 0;
        createPrediction(monthlyExpenses, Number(myForm.loan_start.value), Number(myForm.loan_duration.value), Number(myForm.multiply_perf.value));
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            Select property id: 
            <select onChange={handleSelectProp}>
                {
                    (propIds.length===0)?<>No properties found</>:
                    propIds.map(propId=>
                        <option key={propId} value={propId}>{propId}</option>)
                }
            </select>
        <br/>
            <h3>Add Loan Info</h3>
            Type 
            <select name="loan_type" onChange={(e)=>setLoanType(e.target.value)}>
                    <option value='normal'>Normal</option>
                    <option value='spitzer'>Spitzer</option>
            </select>
            {
                (loanType==='spitzer')?<>Rate (%)
                <input type='number' name='loan_rate'/></>:<></>
            }
            
            Amount
            <input type='number' name='loan_amount'/>
            Duration (months)
            <input type='number' name='loan_duration'/>
            <br/>
            Start within (0-11 months)
            <input type='number' name='loan_start'/>
            <br/>
            Multiply performance by (%)
            <input type='number' name='multiply_perf'/>
            <button type='submit'>Calculate prediction</button>
        </form>
        {
            (!predictions[currPropId])
            ?<>
            <br/><br/>
            Waiting for user input
            </>
            :<>
                <AnnualPerformance property={currPropId}/>
            </>
        }
        </>
    )
}

export default InputForm;