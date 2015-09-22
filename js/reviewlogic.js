$(window).resize(function(){
	$('.span6').jScrollPane();
});

$(function(){
	$('.span6').jScrollPane();
});

if (location.search!= undefined){
game = location.search.split("?")[1].split("%20").join(" ");}
document.getElementById("reviewtitle").innerHTML=game+" Colaborative Review | <a href=/?"+encodeURI(game)+">ProsAndCons</a>";

$.ajax({
url: '/getReview',
data: { game: game },
type: 'POST',
success: function(data) {reviewifier(data);}
});

function reviewifier(thecomments){
	var good = "0";
	var overall = "0";
	var comments = JSON.parse("[" + thecomments + "]");
	for (x = 0; x < comments[0].length; x++) {
	if(comments[0][x].agree / comments[0][x].disagree >= 1.8){
		document.getElementById(comments[0][x].title+comments[0][x].type).innerHTML+=comments[0][x].comment+" ";}
	if(comments[0][x].type=="Pro"){
		good = +good + +comments[0][x].agree;
		overall = +overall + +comments[0][x].disagree;}
	else if (comments[0][x].type=="Con"){
		good = +good + +comments[0][x].disagree;
		overall = +overall + +comments[0][x].agree;} 
	}
	document.getElementById("thescore").innerHTML+=(good / (+good + +overall)) * 100;
}

function boom(){
window.location.pathname="?"+game;}