/*
    This is symple app for manage weekly food
    Copyright: marcin.ryzewskii@gmail.com 2024
*/

async function loadJSON(url) {
    try {
        const respone = await fetch(url);
        const data = await respone.json();
        return data;
    } catch (error){
        console.error('Error fetching data:', error)
    }
}

async function main() {
    console.log("CHUJ");
    var food_array = await loadJSON("./data/food.json");
    console.log(food_array);
}

main();


