const removeBtns = document.querySelectorAll('.btn-remove-cart-item')
const INPUTELEMENTS = document.querySelectorAll('input')
const btnSubmit = document.querySelector('.btn-submit')

removeBtns.forEach(btn => {
  btn.addEventListener('click',async (e) => {
    e.preventDefault()
    const id = btn.dataset.id
    if(window.confirm('Do you want to remove from the cart?')){
      await fetchReq(`/cart/${id}`, 'DELETE', null)   
      return window.open('/cart', '_self')
    } 
  })
})

if(btnSubmit){console.log('btnsubmit exists')
  btnSubmit.addEventListener('click',async (e) => {
    e.target.disabled = true
    
    console.log('Submited')
    const productId = document.querySelector('.product-id').value
    const inputValues = getInputValues(INPUTELEMENTS)
    const fetchUrl = btnSubmit.dataset.url
    const data = await fetchReq(`/${fetchUrl}`, "POST", inputValues)
    console.log(data)
    window.open(`/cart/register/${productId}`, '_self')
    e.target.disabled = false
  })
}

const fetchReq = async (url, method, body) => {
  const res = await fetch(url, {
    headers: {"Content-Type": "application/json"},
    method,
    body
  })
  const data = await res
  return data
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

