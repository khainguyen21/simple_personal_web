// //Menu
// const menu = document.querySelector(".navbar__links");
// const menuButton = document.querySelector(".navbar__icons");
// const overlay = document.querySelector("#overlay");

// menuButton.addEventListener('click', ()=>{
//     menu.classList.toggle("navbar__open"); 
//     menuButton.classList.toggle("open"); 
//     overlay.classList.toggle("show");

// }); 


// overlay.addEventListener('click', ()=>{
//     menu.classList.remove("navbar__open"); 
//     menuButton.classList.remove("open"); 
//     overlay.classList.toggle("show");

// });

// gsap.from('header', {duration: 1 , opacity: 0, delay: 2, stagger: .5})
// gsap.from('section', {duration: 1 , opacity: 0, x: '-100%', delay: 3, stagger: .5}); 


// //Flip Card
// const cards = document.querySelectorAll('.card');

// cards.forEach(card => {
//     card.addEventListener('click', function(){
//         card.classList.toggle('card__flip');
//     });
// });

// $(document).ready(function(){
//     $('a').on('click', function(e){
//         e.preventDefault();
//         var target = $(this).attr('href');
//         $('html, body').animate({
//             scrollTop: $(target).offset().top
//         }, 1000);

//     });
    
// });