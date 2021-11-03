const range = document.getElementById("num-seats")
const bubble = document.getElementsByClassName("bubble")[0]
const submit_btn = document.getElementById("submit-btn")

// ******************************On Load********************************
window.onload = ()=>{
    range.value = 1;
    setBubble(range, bubble)
}

// ****************************Util Functions******************************
function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min;
    const max = range.max;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

     bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}


// ************************** Event Listners **************************
range.addEventListener("input", () => {
    setBubble(range, bubble);
});

submit_btn.addEventListener("click", ()=>{
    const all_input = Array.from(document.getElementsByTagName("input"))
    all_input.forEach(element => {
        // console.log(element.value)
        const error_message = document.querySelector(`small[data-validator="${element.id}"]`)
        if(!element.value){
            error_message.classList.remove("hidden")
        }
        else if(element.id === "email" && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(element.value)){
            error_message.classList.remove("hidden")
        }
        else if(element.id === "card-cvv" && !/^[0-9]{3}$/.test(element.value)){
            error_message.classList.remove("hidden")
        }
        else if(element.id === "card-num" && !/^[0-9]{16}$/.test(element.value)){
            error_message.classList.remove("hidden")
        }
        else if(element.id !== "num-seats"){
            error_message.classList.add("hidden")
        }
    });


})