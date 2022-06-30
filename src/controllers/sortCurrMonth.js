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

export default sortCurrMonth;