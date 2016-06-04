$(document).ready(function(){
   $('.modalDelete').click(function () {
     $('#modalDelete').openModal();
   });
   $('.modalLink').click(function () {
     $('#modalLink').openModal();
   });
   $('.modalAbout').click(function () {
     $('#modalAbout').openModal();
   })
 });

 function openModalPlace () {
   setTimeout(function () {$('#modal1').openModal()}, 500);
 };
 $('.lean-overlay').click(function () {
   alert('ddd');
 });
