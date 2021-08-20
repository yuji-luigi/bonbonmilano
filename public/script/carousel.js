
const carouselSlide = document.querySelector('.carousel-slide')
const carouselImages = document.querySelectorAll('.carousel-slide img')
const slidePreview = document.querySelector('.slide-preview')
const imagesHtml = document.querySelectorAll('.carousel-slide img')


const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')

//counter
let counter = 1
const size = carouselImages[0].clientWidth

function getImagePosition(){
   carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)'
}
getImagePosition()

// document.addEventListener('loaded',()=>{
//     setTimeout(getImagePosition(),5000)
// })

for(let i = 1; i < imagesHtml.length - 1; i++){
   

    const imgSrc = imagesHtml[i].src
    const preimg = new Image()
    preimg.src = imgSrc
    slidePreview.append(preimg)

    preimg.addEventListener('click', () => {
    slideSelected(preimg, i)
    })
}


nextBtn.addEventListener('click', () => {
   if(counter > carouselImages.length - 2) counter = 0
   nextBtnClicked()
})

prevBtn.addEventListener('click', () => {
   if(counter <= 0)  counter = 1
   prevBtnClicked()
    
})


function nextBtnClicked (){
    carouselSlide.style.transition = "transform 0.4s ease-in-out"
        counter++
        carouselSlide.style.transform = 'translateX(' + (-calcSize() * counter) + 'px)'
        checkSlideEnd()
}

function prevBtnClicked() {
    carouselSlide.style.transition = "transform 0.4s ease-in-out"
    counter--
    carouselSlide.style.transform = 'translateX(' + (-calcSize() * counter) + 'px)'
    checkSlideEnd()
}
    /*
'WebkitTransition' :'webkitTransitionEnd',
    'MozTransition'    :'transitionend',
    'MSTransition'     :'msTransitionEnd',
    'OTransition'      :'oTransitionEnd',
    'transition'       :'transitionEnd'
    */

function checkSlideEnd(){
    carouselSlide.addEventListener('webkitTransitionEnd', () => {
    if(carouselImages[counter].className === 'last-image'){
        carouselSlide.style.transition ='none'
        counter = carouselImages.length - 2
        carouselSlide.style.transform = 'translateX(' + (-calcSize() * counter) + 'px)'
    }
    if(carouselImages[counter].className === 'first-image'){
        carouselSlide.style.transition ='none'
        counter = carouselImages.length - counter
        carouselSlide.style.transform = 'translateX(' + (-calcSize() * counter) + 'px)'


    }
})
}





window.addEventListener('resize', () => {
    adjustSize()
})
function adjustSize() {
    carouselSlide.style.transition = "none"
    if(window.innerWidth > 720 || window.innerWidth <= 720){ 
    carouselSlide.style.transform = 'translateX(' + (-calcSize() * counter) + 'px)'
    carouselSlide.style.transition = "transform 0.4s ease-in-out"  
}
}

function calcSize (){
    const SIZE = []
    if(window.innerWidth > 720 || window.innerWidth <= 720){
    const size = carouselImages[0].clientWidth
    SIZE.push(size)
}
    return SIZE
}

function slideSelected(image, i) {
counter = i - 1
nextBtnClicked()

}


