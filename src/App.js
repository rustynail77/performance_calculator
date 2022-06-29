import dataParser from './controllers/dataParser';
import React, {useState, useEffect, createContext} from 'react';
import './App.css';
import InputForm from './components/InputForm';

export const AppContext = createContext(null);

function App() {
  
  const [propData, setPropData] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [chartInfo, setChartInfo] = useState();
  
  useEffect (()=> {
    const getPropData = async () => {
      const data = await dataParser();
      const sortedData = data.sort();
      setPropData(sortedData);
    }
    getPropData();
  },[])
  
  return (
    <AppContext.Provider value={{
        propData, setPropData,
        predictions, setPredictions,
        chartInfo, setChartInfo
        }}>
      <div className="App">
        <header>
          <h1>Annual Performance Calculator</h1>
          by RustyNail77
        </header>
        {
          (propData.length===0)?<>Loading</>:
          <>
            <InputForm />
          </>
        }
      </div>
    </AppContext.Provider>
  );
}

export default App;
