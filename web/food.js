/*
    This is symple app for manage weekly food
    Copyright: marcin.ryzewskii@gmail.com 2024
*/

var food_db = [];
var search_food = [];
var pick_food = [];

function set_cookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Expiration in days
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=/`;
}

function get_cookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) {
            return JSON.parse(decodeURIComponent(value));
        }
    }
    return null; // Return null if cookie not found
}

async function main() {
    food_db = await loadJSON("./data/food.json");
    search_food = food_db.dish;
    var save_pick = get_cookie("pick_food");
    if (save_pick != null) {
        pick_food = save_pick;
    }

    console.log(food_db);
    setup_event_listeners();
    update_ui_data();
}

function update_ui_data() {
    set_cookie("pick_food", pick_food, 1);

    $("#food_list").empty();
    search_food.forEach(item => {
        $('#food_list').append(`<li class="food_item">${item.name}</li>`);
    });
    
    $("#pick_list").empty();
    pick_food.forEach(item => {
        $('#pick_list').append(`<li class="food_item">${item.name}</li>`);
    });
    update_macros();
}

function update_macros() {
    var kcal = 0;
    pick_food.forEach(itm => {
        kcal += itm.kcal;
    });
    $("#kcal_g").empty()
    $("#kcal_g").append(`kcal: ${kcal}`);

    var proteins = 0;
    pick_food.forEach(itm => {
        proteins += itm.proteins;
    });
    $("#protin_g").empty()
    $("#protin_g").append(`białko: ${proteins}`);

    var fat = 0;
    pick_food.forEach(itm => {
        fat += itm.proteins;
    });
    $("#fat_g").empty()
    $("#fat_g").append(`fat: ${fat}`);

    var carbon = 0;
    pick_food.forEach(itm => {
        carbon += itm.proteins;
    });
    $("#carbon_g").empty()
    $("#carbon_g").append(`carbon: ${carbon}`);
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


// HANDLE EVENT FUNCTION

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


