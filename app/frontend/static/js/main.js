
// first puts the filter and then crawls for jobs with callback
function add_filter_and_crawl(button, search_for_products){
button.addEventListener("click", async function() {
    search_for_products(this)
})}

async function search_for_products(button){
    let all_search_inputs = document.querySelectorAll(".inputs-container input")
    console.log("all_search_inputs: ", all_search_inputs)

    let serializedInputs = {};
            for (let i = 0; i < all_search_inputs.length; i++) {
              const input = all_search_inputs[i];
              if (input.type==="text"){
                serializedInputs[input.name] = input.value;

              }
              else{
              serializedInputs[input.name] = input.checked;
              }


              }
              const baseUrl = "/filter-products?";
              const urlParams = new URLSearchParams(serializedInputs); // Use URLSearchParams
              const finished_url = baseUrl + urlParams.toString();
              console.log("finished_url: ", finished_url)

              response = await fetch(finished_url, {
                method: 'GET',
    })
    responseText = await response.text();

    document.querySelector(".all-products-container").innerHTML = responseText



    //load(true)
//    let response = await fetch("crawljobs")
//    let response_json = await response.json();
//    alert(`Es gab ${response_json["new_jobs"]} neue Jobs`)
//    load(false)
//    if (response.status !== 200) {
//        alert("There was error, please try again")
//    } else {
//        location.reload()
//    }
}

function add_ev_li_to_sidebar(){
//let save_filter_button = document.getElementById("save-filter")
let search_products_button = document.getElementById("search-products")
add_filter_and_crawl(search_products_button, search_for_products)


//    let all_products_url = `/home?only_jobs=${true}`
//    response = await fetch(all_products_url, {
//        method: 'GET',
//    })
//    responseText = await response.text();
//
//    document.querySelector(".all_jobs").innerHTML = responseText
//    add_ev_li_job_buttons()
//})


let burger_menu_fold = document.querySelector(".burger-menu img")
let burger_menu_unfold = document.querySelector(".burger-menu.unfold")
let sidebar = document.querySelector(".pop-out.left")

burger_menu_fold.addEventListener("click", function() {
    sidebar.style.display = "none"
    burger_menu_unfold.style.display = "block"
})

burger_menu_unfold.addEventListener("click", function() {
    let sidebar = document.querySelector(".pop-out.left")
    sidebar.style.display = "block"
    burger_menu_unfold.style.display = "none"
})
}

function load(bool_val){
    if(bool_val){
    document.styleSheets[0].insertRule('* { cursor: wait !important; }', 0);
    }
    else{
    document.styleSheets[0].deleteRule(0);

    }
}



function main(){
add_ev_li_to_sidebar()
}

main()