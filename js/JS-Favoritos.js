$(document).ready(function()
{
  loadHeader();
});

function loadHeader()
{
  $("#header").load("components/html/header.html"); 
  $("#footer").load("footer.html"); 
}