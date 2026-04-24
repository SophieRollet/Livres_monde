const fs = require('fs');

const path = 'c:/Users/Utilisateur/OneDrive/Documents/Coding/Livres_monde/books_data.js';
let content = fs.readFileSync(path, 'utf8');

function sortCsvString(csvString) {
    let lines = csvString.trim().split('\n');
    let header = lines[0];
    let dataLines = lines.slice(1);
    dataLines.sort((a, b) => {
        let getPays = (line) => {
           let parts = line.split(',');
           return parts[0].replace(/^"|"$/g, '').trim().toLowerCase();
        };
        let pA = getPays(a);
        let pB = getPays(b);
        return pA.localeCompare(pB, 'fr', {sensitivity: 'base', ignorePunctuation: true});
    });
    return [header, ...dataLines].join('\n');
}

let regexRead = /(const rawCsvDataRead = `)([\s\S]*?)(`;)/;
let matchRead = content.match(regexRead);
if (matchRead) {
    let sortedRead = sortCsvString(matchRead[2]);
    content = content.replace(regexRead, `$1${sortedRead}$3`);
}

let regexToRead = /(const rawCsvDataToRead = `)([\s\S]*?)(`;)/;
let matchToRead = content.match(regexToRead);
if (matchToRead) {
    let sortedToRead = sortCsvString(matchToRead[2]);
    content = content.replace(regexToRead, `$1${sortedToRead}$3`);
}

let regexCovers = /(const rawCsvDataCovers = `)([\s\S]*?)(`;)/;
let matchCovers = content.match(regexCovers);
if(matchCovers) {
    let sortedCovers = matchCovers[2].trim().split('\n');
    let headerC = sortedCovers[0];
    let dataC = sortedCovers.slice(1);
    dataC.sort((a,b) => {
        let pA = a.split(',')[0].replace(/^"|"$/g, '').trim().toLowerCase();
        let pB = b.split(',')[0].replace(/^"|"$/g, '').trim().toLowerCase();
        return pA.localeCompare(pB, 'fr', {sensitivity: 'base', ignorePunctuation: true});
    });
    content = content.replace(regexCovers, `$1${[headerC, ...dataC].join('\n')}$3`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Sorting complete!');
