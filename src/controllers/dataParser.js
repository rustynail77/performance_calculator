import Papa from 'papaparse';

const dataParser = async () => {
    const response = await fetch('/data/data.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    const results = Papa.parse(csv, { header: true });
    const rows = results.data;
    const filteredRows = rows.filter(row=>row.prop_id!=='').sort();
    
    return filteredRows;
}

export default dataParser;