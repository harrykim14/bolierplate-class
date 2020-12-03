const Continents = [
    { "_id": 1, "name": 'Africa'},
    { "_id": 2, "name": 'Europe'},
    { "_id": 3, "name": 'Asia' },
    { "_id": 4, "name": 'North America' },
    { "_id": 5, "name": 'South America' },
    { "_id": 6, "name": 'Australia' },
    { "_id": 7, "name": 'Antarctica' }
]

const Prices = [
    {"_id": 0, "name" : 'Any', "array": []},
    {"_id": 1, "name" : '$0 to $5', "array": [0, 5]},
    {"_id": 2, "name" : '$5 to $9', "array": [5, 9]},
    {"_id": 3, "name" : '$9 to $12', "array": [9, 12]},
]

export {
    Continents,
    Prices
}