const range = document.getElementById("num-seats")
const bubble = document.getElementsByClassName("bubble")[0]
const cost_label = document.getElementById("total-ticket-cost")
const select_month = document.getElementById("month-exp")
const select_year = document.getElementById("year-exp")
const submit_btn = document.getElementById("submit-btn")


// ******************************On Load********************************
window.onload = ()=>{
    // set range bubble value
    range.value = 1;
    setBubble(range, bubble)
    setPrice(range, cost_label)

    for(let i=2021; i<=2140; i++){
        select_year.innerHTML +=  generate_option(i);
    }

    for(let i=1; i<=12; i++){
        select_month.innerHTML += generate_option(i);
    }

}

// ****************************Util Functions******************************
function setBubble(range, bubble) {
    // changes the position of hover bubble for number of seats range input
    const val = range.value;
    const min = range.min;
    const max = range.max;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

     bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

function setPrice(range, cost_label){
    // sets price of the total cost of ticket section in the header
    cost_label.innerHTML = (range.value*price_per_ticket).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
}

function generate_option(num){
    // generates options for select year and month
    return `<option value="${num}">${num}</option>`
}

function isValidExpDate(select_month, select_year){
    // validates  expiry date (only checks if input present; for now)
    if(select_month.value==="none" || select_year.value==="none")
        return false
    else
        return true
}

function createRequestObject(){
    //creates the js object that needs to be shared to server side for booking info
    var RequestObject = {}
    
    const start_time = document.getElementById("bus-start-time")
    const stop_time = document.getElementById("bus-stop-time")
    const bus_start_name = document.getElementById("bus-start-name")
    const bus_stop_name = document.getElementById("bus-stop-name")
    const bus_code = document.getElementById("bus-code")
    const bus_date = document.getElementById("bus-date")

    const all_input = Array.from(document.getElementsByTagName("input"))        //all inputs

    RequestObject[start_time.id] = start_time.innerText
    RequestObject[stop_time.id] = stop_time.innerText
    RequestObject[bus_start_name.id] = bus_start_name.innerText
    RequestObject[bus_stop_name.id] = bus_stop_name.innerText
    RequestObject[bus_code.id] = bus_code.innerText
    RequestObject[bus_date.id] = bus_date.innerText


    const cost =  parseFloat(cost_label.innerHTML.substring(1).replace(/,/g,''))
    RequestObject[cost_label.id] = cost         // Golbal scoped

    all_input.forEach(element =>{
        RequestObject[element.id] = element.value
    })

    RequestObject[select_month.id] = select_month.value         // Global scoped
    RequestObject[select_year.id] = select_year.value           // Global scoped

    return RequestObject


}


// ************************** Event Listners **************************
range.addEventListener("input", () => {
    setBubble(range, bubble)
    setPrice(range, cost_label)
});

submit_btn.addEventListener("click", ()=>{
    let isValid = true
    const all_input = Array.from(document.getElementsByTagName("input"))
    const select_month = document.getElementById("month-exp")
    const select_year = document.getElementById("year-exp")

    all_input.forEach(element => {
        // console.log(element.value)
        const error_message = document.querySelector(`small[data-validator="${element.id}"]`)
        if(!element.value){
            error_message.classList.remove("hidden")
            isValid = false
        }
        else if(element.id === "email" && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(element.value)){
            error_message.classList.remove("hidden")
            isValid = false
        }
        else if(element.id === "card-cvv" && !/^[0-9]{3}$/.test(element.value)){
            error_message.classList.remove("hidden")
            isValid = false
        }
        else if(element.id === "card-num" && !/^[0-9]{16}$/.test(element.value)){
            error_message.classList.remove("hidden")
            isValid = false
        }
        else if(element.id !== "num-seats"){
            error_message.classList.add("hidden")
        }
    })

    
    if(!isValidExpDate(select_month, select_year)){
        document.querySelector(`small[data-validator="exp_date"]`).classList.remove("hidden")
        isValid = false
    }
    else{
        document.querySelector(`small[data-validator="exp_date"]`).classList.add("hidden")
    }

    

    if(isValid){
        var json_request = createRequestObject();
        // console.log(json_request)
        const loading_window = document.getElementsByClassName("loading-screen")[0]
        // console.log(loading_window)
        loading_window.classList.add("d-block")
        loading_window.classList.remove("d-none")
        loading_window.classList.remove("opacity-0")
        $.ajax({
            url : "http://demo9230605.mockable.io/"+"payment",          // url for request for booking
            type: "POST",
            dataType: "json",
            data: JSON.stringify(json_request),
            // response of the form {msg: "message form server" , isbooked: true/false }
            success: function(response) {
                loading_window.classList.remove("d-block")
                loading_window.classList.add("d-none")
                if(!response.isbooked)
                    toastr.error(response.msg, 'Booking failed')
                else                                                // TO DO: Check if redirect works automatically or needs to be implemented
                    toastr.success(response.msg, 'Sucess!')
            },
            error: function (error) {
                console.log(error)
            }
        });
    }


})