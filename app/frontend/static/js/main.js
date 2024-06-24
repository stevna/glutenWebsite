function add_ev_li_job_buttons(){
let show_acknowledged_button = document.getElementsByClassName("show_acknowledged")
//let acknowledged_div = document.getElementsByClassName("acknowledged")
for (let index = 0; index < show_acknowledged_button.length; index++) {
    show_acknowledged_button[index].addEventListener("click", async function() {
        let parent_div = this.parentElement
        let acknowledged_div = parent_div.nextElementSibling

        if (acknowledged_div.style.display === "block") {
            acknowledged_div.style.display = "none"
        } else {
            acknowledged_div.style.display = "block"
        }
    })
}

//alert("hello")
let ack_buttons = document.getElementsByClassName("ack_button")
for (let index = 0; index < ack_buttons.length; index++) {
    ack_buttons[index].addEventListener("click", async function() {

        let buttons_container = this.parentNode
        let job_id = this.dataset.job_id
        let job_source = this.dataset.job_source

        let corresponding_job_div = document.querySelector(`.job[data-job_id="${job_id}"]`);

        let ack_object = {
            job_id: job_id,
        };

        const response = await fetch('/acknowledge', {
            method: 'PUT',
            body: JSON.stringify(ack_object),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const responseText = await response.text();
        if (response.status !== 200) {
            alert("Es gab einen Fehler beim quittieren, bitte die Seite neu laden und erneut probieren.")
            return
        }
        console.log("responseText")

        //corresponding_job_div.style.display = "none"

        // add to to_acknowledge


        // hide acknowledge if empty
        console.log("CLASSLIST: ", this.classList)

        let to_acknowledge_div = document.querySelector(".to_acknowledge." + job_source)
        let acknowledged_div = document.querySelector(".acknowledged."+ job_source)
        console.log("acknowledged_div: ", acknowledged_div)
        console.log("acknowledged_div: ", acknowledged_div)
        if(this.classList.contains("unacknowledge")){

        this.classList.remove("unacknowledge")
        this.innerHTML = "Quittieren"
        to_acknowledge_div.appendChild(corresponding_job_div)
        if(acknowledged_div.children.length == 0){
            acknowledged_div.style.display = "none"
            acknowledged_div.previousElementSibling.style.display = "none"
        }

        }
        else{
        this.classList.add("unacknowledge")
        this.innerHTML = "Entquittieren"
        acknowledged_div.appendChild(corresponding_job_div)
        if(acknowledged_div.children.length == 1){
            acknowledged_div.style.display = "block"
            acknowledged_div.previousElementSibling.style.display = "block"
        }
        }
    });
}


let ai_recommendation_buttons = document.querySelectorAll(".button-container .ai_recommendation_button")
for (let index = 0; index < ai_recommendation_buttons.length; index++) {
    ai_recommendation_buttons[index].addEventListener("click", async function() {
            let job_url = this.dataset.job_url
            let job_id = this.dataset.job_id

            // fetch price
            let recommendation_price = await fetch_price_recommendation(job_url)
            if (!recommendation_price){
            return
        }
            let choice = confirm(`Dieser Abruf kostet ca. ${recommendation_price} Franken, weiter?`)
        if (!choice){
            return
        }
        load(true)
        let fetch_url = `/ai-recommendation?url=${job_url}&job_id=${job_id}`

        const response = await fetch(fetch_url, {
            method: 'GET'
        });
        let ai_recommendation = await response.text();
        if (response.status !== 200) {
            alert("There was an error changing the acknowledging, please reload and try again")
            load(false)
            return
        }
        let query_selector_string = `p[data-job_id="${job_id}"].ai_recommendation`
        ai_recommendation_text = document.querySelector(query_selector_string)
        let ai_recommendation_container = ai_recommendation_text.parentElement
        ai_recommendation_container.style.height = "auto"
        ai_recommendation_text.innerHTML = ai_recommendation
        let delete_recommendation_btn = ai_recommendation_text.nextElementSibling
        delete_recommendation_btn.style.display = "block"
        this.disabled = true
        load(false)
    });
}

let ai_application_buttons = document.querySelectorAll(".button-container .ai_application_button")
for (let index = 0; index < ai_application_buttons.length; index++) {
    ai_application_buttons[index].addEventListener("click", async function() {
            let job_url = this.dataset.job_url

            // fetch price
            let recommendation_price = await fetch_price_recommendation(job_url)
            let choice = confirm(`Dieser Abruf kostet ca. ${recommendation_price} Franken, weiter? \nBei Bestätigung wird ein text file heruntergeladen, der den entsprechenden Bewerbungsbrief enthält. Dieser kann das in ein Word kopiert werden.`)
        if (!choice){
            return
        }
        load(true)

        let fetch_url = `/create_application?url=${job_url}`

        const response = await fetch(fetch_url, {
            method: 'GET'
        });
        if (response.status !== 200) {
            alert("There was an error changing the acknowledging, please reload and try again")
            return
        }
        load(false)
        let text = await response.text();
        downloadTextFile("bewerbungsbrief.txt", text)
    });
}



let job_description_buttons = document.querySelectorAll(".button-container .open_job_description")
console.log("job_description_buttons: ", job_description_buttons )
for (let index = 0; index < job_description_buttons.length; index++) {
    job_description_buttons[index].addEventListener("click", async function() {

        let job_url = this.dataset.job_url
        let job_id = this.dataset.job_id
        console.log("job_url: ", job_url)

        window.open(job_url, '_blank').focus()

    });
}


let delete_recommendation_buttons = document.querySelectorAll(".job .delete-recommendation-btn")
for (let index = 0; index < delete_recommendation_buttons.length; index++) {
    delete_recommendation_buttons[index].addEventListener("click", async function() {

        let job_id = this.dataset.job_id
        console.log("job_id: ", job_id)
        let fetch_url = `/ai-recommendation?job_id=${job_id}`

        const response = await fetch(fetch_url, {
            method: 'DELETE'
        });
        let ai_recommendation = await response.text();
        if (response.status !== 200) {
            alert("There was an error deleting the recommendation, please reload and try again")
            return
        }

        let recommendation_text = this.previousElementSibling
        recommendation_text.innerHTML = ""
        let ai_recommendation_container = this.parentElement

        ai_recommendation_container.style.height = "0"
        this.style.display = "none"

        let corresponding_recommendation_button = document.querySelector(`.job .button-container .ai_recommendation_button[data-job_id="${job_id}"]`);
        corresponding_recommendation_button.disabled = false
    });
}
}



async function fetch_price_recommendation(job_url){
        load(true)
        let fetch_url = `/price/recommendation?url=${job_url}`

        const response = await fetch(fetch_url, {
            method: 'GET'
        });
        let recommendation_price = await response.text();
        if (response.status !== 200) {
            alert(response.text())
            return
        }

        console.log("price is: ", recommendation_price)
        load(false)
        return recommendation_price

}


// first puts the filter and then crawls for jobs with callback
function add_filter_and_crawl(button, crawl_for_jobs){
button.addEventListener("click", async function() {
    let all_inputs = document.querySelectorAll('input');
    let filter_object = {}
    for (let i = 0; i < all_inputs.length; i++) {
        let current = all_inputs[i]
        filter_object[current.name] = current.type == "checkbox" ? current.checked : current.value
    }
    let response = await fetch('/filters', {
        method: 'PUT',
        body: JSON.stringify(filter_object),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    let responseText = await response.text();
    if (response.status !== 200) {
        alert("There was an error changing the filter, please reload and try again")
    }
    console.log("responseText")
    crawl_for_jobs(this)
})}

async function crawl_for_jobs(button){
    load(true)
    let response = await fetch("crawljobs")
    let response_json = await response.json();
    alert(`Es gab ${response_json["new_jobs"]} neue Jobs`)
    load(false)
    if (response.status !== 200) {
        alert("There was error, please try again")
    } else {
        location.reload()
    }
}

function add_ev_li_to_sidebar(){
//let save_filter_button = document.getElementById("save-filter")
let crawl_button = document.getElementById("crawl-jobs")
add_filter_and_crawl(crawl_button, crawl_for_jobs)




//    let all_jobs_url = `/home?only_jobs=${true}`
//    response = await fetch(all_jobs_url, {
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

function hide_empty_acknowledged_divs(){
    let acknowledged_divs = document.querySelectorAll(".acknowledged")
    for (let i = 0; i < acknowledged_divs.length; i++) {
        let current_acknowledged_div = acknowledged_divs[i]

        console.log("acknowledged_div: ", current_acknowledged_div)
        console.log("acknowledged_div: ", current_acknowledged_div)
        if(current_acknowledged_div.children.length == 0){
            current_acknowledged_div.style.display = "none"
            current_acknowledged_div.previousElementSibling.style.display = "none"
        }
    }
}

function downloadTextFile(fileName, textContent) {
  const element = document.createElement('a');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(blob);
  element.download = fileName;
  element.click();
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
add_ev_li_job_buttons()
hide_empty_acknowledged_divs()
add_ev_li_to_sidebar()
}

main()