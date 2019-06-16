let csvToJson = require('convert-csv-to-json');
 
let fileInputName = '../cnes.csv'; 
let fileOutputName = '../cnes.json';
 
csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);