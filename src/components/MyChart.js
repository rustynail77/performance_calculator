import React, {useState,useEffect, useContext} from 'react'
import { Chart } from 'react-charts'
import {AppContext} from '../App';

const MyChart = () => {
  const {chartInfo} = useContext(AppContext);

  console.log('chartInfo:',chartInfo);

  const [income, setIncome] = useState(chartInfo.income);
  const [expenses, setExpenses] = useState(chartInfo.expenses);
  const [performance, setPerformance] = useState(chartInfo.performance);

  console.log('datot:',income,expenses,performance);

  useEffect (()=>{
    setIncome(chartInfo.income);
    setExpenses(chartInfo.expenses);
    setPerformance(chartInfo.performance);
  })

  const dataTable = React.useMemo(
    () => [
      {
        label: 'Income',
        data: income
      },
      {
        label: 'Expenses',
        data: expenses
      },
      {
        label: 'Performance',
        data: performance
      }
    ],
    []
  )

  const series = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { position: 'left', type: 'linear', stacked: false }
    ],
    []
  )

  return (
    <div id="chart">
      <h3>Performance Chart</h3>
      <div
        style={{
          width: '80vw',
          height: '50vh'
        }}
      >
        <Chart data={dataTable} series={series} axes={axes} tooltip />
      </div>
    </div>
  )
}

export default MyChart;