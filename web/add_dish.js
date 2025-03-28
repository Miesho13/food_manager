
var food_db = [];
var search_food = [];
var pick_food = [];

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

async function main() {
    food_db = await loadJSON("./data/food.json");
    search_food = food_db.dish;

    console.log(food_db);
    setup_event_listeners();
    update_ui_data();
}

function update_ui_data() {
}

function setup_event_listeners() {
    $('#product_search').on('input', handle_search_input);
}

function handle_search_input(event) {
    const inputVal = $(event.target).val().trim();

    if (inputVal.length > 0) {
        $("#context_product").show();
    } else {
        $("#context_product").hide();
    }
}

main();
