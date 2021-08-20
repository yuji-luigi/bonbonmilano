const msgBoard = document.querySelector('.message')
const btnSubmit = document.querySelector('.btn-submit')
let product_id
const INPUTELEMENTS = document.querySelectorAll('input')
const numberInputs = document.querySelectorAll('.input-number')
const btnCancel = document.querySelector('.btn-cancel')


const modal = document.querySelector('.modal')
const modalContent =document.querySelector('.modal-content')

if(btnSubmit){ 
  product_id = btnSubmit.dataset.product_id
}

INPUTELEMENTS.forEach(input => {
  input.addEventListener('blur', () => {
    formValidate(input)
  })
  
  input.addEventListener('input', ()=> {
    clearInputError(input)
  })
})

numberInputs.forEach(input => {
  input.addEventListener('blur', () => {
  checkForNumbers(input)
  })
})


let reqPath, reqMethod, reqBody, reqHeaders, ajaxData, data
if(btnSubmit){
  btnSubmit.addEventListener('click',async (e) => {
    e.preventDefault()
    btnSubmit.disabled = true
    getPath()
    reqBody = getInputValues(INPUTELEMENTS)
    try{
      const res =  await fetchReq( reqPath, "POST", { "Content-Type": "application/json" }, reqBody)
      data = await res.json()
      if(checkIfError(data) === true) return btnSubmit.disabled = false
      if( await isRegisterRoute() === true){
        const res = await fetchReq('/auth/register/confirm', 'POST', { "Content-type": "application/json" }, JSON.stringify(data))
        ajaxData = await res.text()
        return showConfirmation()
      }
      if( await isCartRoute() === true) return showConfirmation()
      if(isPurchaseRoute(e) === true){ 
        console.log(`purchase route, data: ${data}`)
        if(checkIfError(data) === true) return btnSubmit.disabled = false
      const res = await fetchReq('/auth/guest/register/confirm', 'POST', { "Content-type": "application/json" }, JSON.stringify(data))
      ajaxData = await res.text()
      return showConfirmation()
      }
      window.open('/', '_self')
    } catch(e) { console.log(e)}  
  })  
}  

const checkIfError = (data, e)=> {
  if(data.error){
    btnSubmit.disabled = false 
    msgBoard.textContent = data.message
    return true
   } else{
     return false
   }
}

if(btnCancel){
  btnCancel.addEventListener('click', async () => {
  await fetchReq('/auth/register/cancel', 'DELETE')  
  window.history.back()
  })
}  

const formValidate = (input) => {
  if(!input.value.length > 0) {
    setInputError(input, 'this field is required')
  }  
}  

const checkForNumbers = (input) => {
  if(isNaN(input.value)){
    setInputError(input, 'This field must be numbers')
  }  
}  

const setFormMessage= (formElement, type, message) => {
  const messageElement = formElement.querySelector(".form__message");
  messageElement.textContent = message;
  messageElement.classList.remove("form__message--success", "form__message--error");
  messageElement.classList.add(`form__message--${type}`);
}  

const setInputError = (inputElement, message) => {
  inputElement.classList.add("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}  


const clearInputError = (inputElement) => {
  inputElement.classList.remove("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}  

const getPath = () => {
  // todo refactor here ) name variable loc.pathname => use switch
  if(window.location.pathname.includes('/cart/register/')) {
    reqPath = `/cart/register/${product_id}`
    return
  }  
  if(window.location.pathname === '/auth/register'){
    reqPath = '/auth/register'
    return 
  }  
  if(window.location.pathname === '/auth/guest/register'){
    reqPath = '/auth/guest/register'
    return 
  }  
  reqPath = '/auth/login'
  return
}  

const getInputValues = (inputs) => {
  let obj = {}
  inputs.forEach(input => {
    const inputName = input.name
    obj[inputName] = input.value
  })  
  obj = JSON.stringify(obj)
  return obj
}  

const fetchReq = async (url, method, headers, body) => {
  const res = await fetch(url, {method , headers, body} )  
  return res
}  

const isRegisterRoute = async (data) => {
  if(window.location.pathname === ('/auth/register')){
     btnSubmit.disabled = false
     return true
    }  
  }  
  
const showConfirmation = async () => {
  try{
  openModal()
  modalContent.innerHTML = ajaxData

  const btnConfirm = document.getElementsByClassName('btn-confirm')[0]
  const closeBtn = document.querySelector('.close')

  btnConfirm.addEventListener('click',async (e)=> {
    e.preventDefault(e)
    btnConfirm.disabled = true
    if( await isRegisterRoute() === true) {
      const res = await fetchReq('/auth/register/confirm/send_email', "POST", {"Content-Type": "application/json"}, reqBody)
      const data = await res.json()
      if(checkIfError(data, e) === true) {
        btnConfirm.disabled = false
        return closeModal()
      }
      return window.open('/auth/register/confirm/send_email/completed', '_self')
    }
    if( await isCartRoute() === true ) {
      window.open('/cart/confirm/ok', '_self')
      if(checkIfError(data, e) === true) {
        btnConfirm.disabled = false
        return closeModal()
    }
    }
    if( isPurchaseRoute() === true) {
      const res = await fetchReq('/auth/guest/register/confirm/send_email', "POST", {"Content-Type": "application/json"}, reqBody)
      const data = await res.json()
      if(checkIfError(data, e) === true) {
        btnConfirm.disabled = false
        return closeModal()
      }
      return window.open('/auth/guest/register/confirm/send_email/completed', '_self')
    }
  }
  )
  closeBtn.addEventListener('click', async ()=> {
  closeBtn.disabled = true
  if( await isCartRoute() !== true){
    await cancelRegister()
  } 
  btnSubmit.disabled = false 
  closeModal()
  closeBtn.disabled = false
  })
} catch(e){console.log(e)}
}  
const openModal = () => {
  modal.classList.toggle('active')
  modalContent.classList.toggle('active')
}  

const cancelRegister = async () => {
  
  const emailInput = document.getElementById('email-input')
    let email = {email: emailInput.value}
    email = JSON.stringify(email)
    try{
       await fetchReq('/auth/register/cancel', "DELETE", {"Content-Type": "application/json"}, email)
    } catch(e) {console.log(e)}  
}    

const closeModal = () => {
  modal.classList.toggle('active')
  modalContent.classList.toggle('active')
  removeAddedContents()
}  



const removeAddedContents = () => {
  const contents = document.getElementsByClassName('contents')[0]
  contents.remove()
}  

const isCartRoute = async () => {
  if(window.location.pathname.includes('cart')){
    const res = await fetchReq(`/cart/confirm_address_data/${product_id}`, 'GET')
    ajaxData = await res.text()
    btnSubmit.disabled = false
    return true
  }  

}  
const isPurchaseRoute = (e) => {
  if(window.location.pathname === ('/auth/guest/register')){
    btnSubmit.disabled = false
    return true
  }  
}  

