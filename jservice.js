const axios = require('axios');
const fs = require('fs');

const jserviceUrl = 'http://jservice.io/api/category?id=';

async function getCategoryFromJService(categoryNumber) {
    const response = await axios.get(jserviceUrl + categoryNumber);
    return response.data;
}

// const url = 'http://jservice.io/api/category?id=';
const categoriesArray = [67, 780, 277, 223, 184, 680, 21, 309, 582, 267, 136, 249, 105, 770, 508, 561, 420, 37, 1195, 25, 897];

const categoryPromises = categoriesArray.map(id => getCategoryFromJService(id))

async function writeToDisk() {
    await Promise.all(categoryPromises)
        .then(categories => {
            fs.writeFileSync('./info/categories.json', JSON.stringify(categories));}
    );
}

module.exports.writeToDisk = writeToDisk;