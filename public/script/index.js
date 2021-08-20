const items = document.querySelectorAll('.anchor-tag')
const modal = document.querySelector('.modal')
const modalContent =document.querySelector('.modal-content')
const closeTab = document.querySelector('.close')

const ITEM_OPTIONS = document.querySelectorAll('.item-options')
const ITEM_TITLE  = document.querySelector('.item-option-main-title')
const MAIN_IMG_TAG = document.querySelectorAll('.main-image')

//EventListeners
for (let i = 0; i < items.length; i++){
    let item = items[i]
    
    item.addEventListener('click', async (e) => {
        e.preventDefault(e)
        openModal()
        getProductOptions(item)
        
    })
}

modal.addEventListener('click', (e)=> {
    closeModal(e)
})

function openModal(e) {
modal.classList.toggle('active')
modalContent.classList.toggle('active')

}

function closeModal(e) {
    if (pathcheckForClass(e.composedPath(), 'close', 'modal')){
    modal.classList.toggle('active')
    modalContent.classList.toggle('active')
    removeAddedContents()
    }else{
        return
    }
}

function pathcheckForClass(path, selector, selector2) {
    for (let i = 0; i < path.length; i++){
        if (path[i].classList && path[i].classList.contains(selector) ||
        path[i].classList.contains(selector2)
        ){
            return true
        }
        return false
    }
}

function removeAddedContents() {
    const child = document.querySelector('.options-contents')
    const parent = child.parentElement
    parent.removeChild(child)
}

function openNewWindow (url) {
    window.open(url)
}

async function getProductOptions (item) {
    const res = await axios.get(item.href)
    const data = res.data
    modalContent.innerHTML = data
}



