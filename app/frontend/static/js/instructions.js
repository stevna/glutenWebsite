const dialog_instructions = document.querySelector("dialog.instructions");
    console.log("dialog_instructions", dialog_instructions)
    const showButton_instructions = document.querySelector(".center .instructions");
    console.log("showButton_instructions", showButton_instructions)
    const closeButton_instructions = document.querySelector("dialog.instructions button.close");
    showButton_instructions.addEventListener("click", () => {
    dialog_instructions.showModal();
    })

    closeButton_instructions.addEventListener("click", () => {
    dialog_instructions.close();
    });


    let instructions_arrow_right = document.querySelector("dialog.instructions .arrow.right")
    let instructions_arrow_left = document.querySelector("dialog.instructions .arrow.left")
    let slides = document.querySelectorAll("dialog.instructions .content")

    instructions_arrow_right.addEventListener("click", () => {
    let active_slide = document.querySelector("dialog.instructions .content.active")
    let active_slide_number = active_slide.dataset.slide_number
    let slide_number_as_int = parseInt(active_slide_number, 10);
    let next_slide_number = (slide_number_as_int + 1).toString();
    next_slide = get_next_slide(next_slide_number, go_left=false)
    hide_active_show_next(active_slide, next_slide)
    })


    instructions_arrow_left.addEventListener("click", () => {
    let active_slide = document.querySelector("dialog.instructions .content.active")
    let active_slide_number = active_slide.dataset.slide_number
    let slide_number_as_int = parseInt(active_slide_number, 10);
    let next_slide_number = (slide_number_as_int - 1).toString();
    next_slide = get_next_slide(next_slide_number, go_left = true)
    hide_active_show_next(active_slide, next_slide)
    })


    function get_next_slide(next_slide_number, first_is_the_active){
    let next_slide = document.querySelector(`dialog.instructions .content[data-slide_number="${next_slide_number}"]`)
    if(!next_slide){
    // since the we go left, the last slide needs to be returend
    if(go_left){
    let all_slides = document.querySelectorAll(`dialog.instructions .content`)
    console.log("all_slides: ", all_slides)
    next_slide = all_slides[all_slides.length - 1];
    }
    else{
    next_slide = document.querySelector(`dialog.instructions .content[data-slide_number="1"]`)
    }
    }
    return next_slide
    }


    function hide_active_show_next(active_slide, next_slide){
    active_slide.classList.remove("active")
    active_slide.style.display = "none"
    next_slide.classList.add("active")
    next_slide.style.display = "block"
    }