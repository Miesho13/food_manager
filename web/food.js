/*
    This is symple app for manage weekly food
    Copyright: marcin.ryzewskii@gmail.com 2024
*/

var food_db = [];
var search_food = [];

var pick_food = [];

var chosen = "Poniedzialek";

async function main() {
    food_db = await loadJSON("./data/food.json");
    search_food = food_db.dish;
    console.log(food_db);
    setup_event_listeners();
    update_ui_data();
}

function update_ui_data() {
    $("#food_list").empty();
    search_food.forEach(item => {
        $('#food_list').append(`<li class="food_item">${item.name}</li>`);
    });
    
    $("#pick_list").empty();
    pick_food.forEach(item => {
        $('#pick_list').append(`<li class="food_item">${item.name}</li>`);
    });
    
    var kcal = 0;
    pick_food.forEach(itm => {
        kcal += itm.kcal;
    });

    $("#kcal_view").empty();
    $("#kcal_view").append(`<p class="kcal_view">${kcal}</p>`);
}

async function loadJSON(url) {
    try {
        const response = await fetch(url);
         if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error){
        console.error('Error fetching data:', error)
    }
}

function setup_event_listeners() {
    $('#food_list').on('click', 'li', handle_food_item_click);
    $('#pick_list').on('click', 'li', handle_pick_list_click);
    $('#search_box').on('input', handle_search_input);
    $('#get_list').on('click', handle_get_list);
}

function handle_get_list(event) {
    const header = "Hello, World!\n\nPicked Food Products with Quantities:\n";

    const productQuantities = new Map();

    pick_food.forEach(dish => {
        dish.product.forEach(prod => {
            if (productQuantities.has(prod.id)) {
                productQuantities.set(prod.id, productQuantities.get(prod.id) + prod.val);
            } else {
                productQuantities.set(prod.id, prod.val);
            }
        });
    });

    const productsInfo = Array.from(productQuantities.entries()).map(([id, totalVal]) => {
        const product = food_db.products.find(p => p.id === id);
        return `${product.name} (${product.unit}): ${totalVal}`;
    });

    const content = header + productsInfo.join('\n');

    const blob = new Blob([content], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'picked_food_products.txt'; 

    link.click();

    URL.revokeObjectURL(link.href);
}

function handle_food_item_click(event) {
    const clicked_item = $(event.target).text(); 
    console.log(`You clicked on: ${clicked_item}`);
    pick_food.push(search_food.find(i => i.name === clicked_item));
    update_ui_data();
}
 
function handle_pick_list_click(event) {
    const clicked_item = $(event.target).text(); 
    console.log(`You clicked on: ${clicked_item}`);
    pick_food = pick_food.filter(i => i.name != clicked_item);
    update_ui_data();
}

function handle_search_input(event) {
    const query = $(event.target).val().toLowerCase(); 
    search_food = food_db.dish.filter(item => item.name.toLowerCase().includes(query));
    update_ui_data();
}

main();


