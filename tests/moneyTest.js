import { formatCurrency } from "../scripts/utils/money.js";

//grouping of tests
console.log('test suite: format currency');

//giving test case a name
console.log('convert cents into dollars');
//Basic test case
if (formatCurrency(2095) === '20.95') {
    console.log('passed');
} else {
    console.log('failed');
}

console.log('works with zero');
//edge test cases
if (formatCurrency(0) === '0.00') {
    console.log('passed');
} else {
    console.log('failed');
}

console.log('rounds up to the nearest cent');
if (formatCurrency(2000.5) === '20.01') {
    console.log('passed');
} else {
    console.log('failed');
}