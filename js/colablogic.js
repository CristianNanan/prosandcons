    var arrayOfOptions = [
        "Battlefield 4",
        "Dark Souls 2",
        "Forza Motorsport 5",
        "inFamous: Second Son",
        "Mario Kart 8",
        "Tomb Raider 2013",
        "The Last of Us",
        "Titanfall",
        "Watch Dogs"
    ];

$(document).ready(function() {
    $("#input").autocomplete({source: arrayOfOptions});
});

var game;

/*$("#input").keyup(function(event){
    if(event.keyCode == 13){
	game = document.getElementById("input").value;
	alert(game);
	}
});*/

$("#input").autocomplete({
    select: function(event, ui) {
        if(ui.item){
            game = ui.item.value;
            document.getElementById("gameon").innerHTML="<a class='fg-white' href='review.html?"+game+"'>"+game+"</a>";
            window.name=game;
            document.getElementById("prosidex").innerHTML="";
            document.getElementById("considex").innerHTML="";
            document.getElementById("combox").style.display="";
			
			$.when(
			$.ajax({
  			url: '/getComment',
  			data: { game: game },
  			type: 'POST',
  			success: function(data) {notifier(data);}
			}),
			$.ajax({
  			url: '/getNotif',
  			data: { game: game },
  			type: 'POST',
			})
			).done(function( a1, a2 ) {votifier(a2[0]);});

            $(this).val(''); return false;
        }
    }
});

function notifier(thecomments){
	var comments = JSON.parse("[" + thecomments + "]");
	for (x = 0; x < comments[0].length; x++) {
		var colorize="";
		var argo = comments[0][x].agree;
		var diso = comments[0][x].disagree;

		if(comments[0][x].type=="Pro"){

if (argo / diso >=5){colorize="bg-emeraldxtr fg-yellow";}
else if (argo / diso <=0.5){colorize="bg-emerald fg-white";}
else{colorize="bg-emeraldxtr fg-white";}

document.getElementById("prosidex").innerHTML+='<div class="span16"><div class="panel"><div class="panel-header '+colorize+'">'+comments[0][x].title+'<span id="'+comments[0][x].id+'" style="float:right;"></span></div><div class="panel-content">'+comments[0][x].comment+'</div></div><div class="row" style="margin:0px;"><button id="'+comments[0][x].id+'" onclick="rateit(this,'+"'agree'"+')" class="span16">Agree <b>('+comments[0][x].agree+')</b></button><button id="'+comments[0][x].id+'" onclick="rateit(this,'+"'disagree'"+')" class="span16">Disagree <b>('+comments[0][x].disagree+')</b></button>';
		}
		else if(comments[0][x].type=="Con"){

if (argo / diso >=5){colorize="bg-redxtr fg-yellow";}
else if (argo / diso <=0.5){colorize="bg-red fg-white";}
else{colorize="bg-redxtr fg-white";}

document.getElementById("considex").innerHTML+='<div class="span16"><div class="panel"><div class="panel-header '+colorize+'">'+comments[0][x].title+'<span id="'+comments[0][x].id+'" style="float:right;"></span></div><div class="panel-content">'+comments[0][x].comment+'</div></div><div class="row" style="margin:0px;"><button id="'+comments[0][x].id+'" onclick="rateit(this,'+"'agree'"+')" class="span16">Agree <b>('+comments[0][x].agree+')</b></button><button id="'+comments[0][x].id+'" onclick="rateit(this,'+"'disagree'"+')" class="span16">Disagree <b>('+comments[0][x].disagree+')</b></button>';
		}
	}
	$('.span6').jScrollPane();
}

$(window).resize(function(){
	$('.span6').jScrollPane();
});

$(function(){
	$('.span6').jScrollPane();
});

/*if(location.search!= undefined){
game = location.search.split("?")[1].split("+").join(" ");}
alert(game);*/

$("#go").keyup(function() {
    var cs = $(this).val().length;
    $("#count").text(cs+"/140");
});

var goheading;
var gothetype;
function change(elem,cap){
	elem.innerHTML=cap;
	if (cap=="Con"){
		elem.style.backgroundColor="#e51400";
		gothetype=cap;}
	else if (cap=="Pro"){
		elem.style.backgroundColor="#008a00";
		gothetype=cap;}
	else{
		goheading=cap;}
	}

function sendItUp(){
	if(!goheading){
		document.getElementById("heading").style.borderColor="#fa6800";}
	else{
		document.getElementById("heading").style.borderColor="#4390df";}

	if(!gothetype){
		document.getElementById("thetype").style.borderColor="#fa6800";}
	else{
		document.getElementById("thetype").style.borderColor="#4390df";}

	if(!game){
		document.getElementById("gameon").className="fg-orange";}
	else{
		document.getElementById("gameon").className="fg-lightBlue";}

	if($("#go").val().trim().length<10 || $("#go").val().trim().length>140){
		document.getElementById("gobox").className="span9 input-control text warning-state";}
	else{
		document.getElementById("gobox").className="span9 input-control text info-state";}
	
	if(game && goheading && gothetype && $("#go").val().trim().length>=10 && $("#go").val().trim().length<=140){
	$.ajax({
    url: '/sendComment',
    data: { game: game, type: gothetype, title: goheading, comment: document.getElementById("go").value },
    type: 'POST',
    success: function(data) {
	if(data=="Comment submitted!"){
		document.getElementById(gothetype.toLowerCase()+"sidex").innerHTML+='<div class="span16"><div class="panel"><div class="panel-header">'+goheading+'<span style="float:right;">yours</span></div><div class="panel-content">'+document.getElementById("go").value+'</div></div><div class="row" style="margin:0px;"><button class="span16">Agree</button><button class="span16">Disagree</button>';
		$('.span6').jScrollPane();
		$("#go").attr("placeholder", "Comment submitted!").val("");
	}
		var not = $.Notify.show(data);}
		});
	}
}

function rateit(that,hmm){
	$.ajax({
    url: '/sendVote',
    data: { game: game, id: that.id, decision: hmm },
    type: 'POST',
    success: function(data) {
	if(data=="Vote registered!"){
	if(hmm=="agree"){
		document.getElementById(that.id).innerHTML="agree";}
	else if(hmm=="disagree"){
		document.getElementById(that.id).innerHTML="disagree";}}
var not = $.Notify.show(data);}
		});
}

function votifier(woop){

	var voted = JSON.parse("[" + woop + "]");
	for(var i=0; i<voted[0].length; i++) {
		if(document.getElementById(voted[0][i].id) == "[object HTMLSpanElement]" || document.getElementById(voted[0][i].id) == "[object HTMLElement]"){
			document.getElementById(voted[0][i].id).innerHTML=voted[0][i].decision;
		}
	}
}

for (var c=0; c < arrayOfOptions.length; c++){
if(location.search.split("?")[1].split("%20").join(" ")==arrayOfOptions[c]){
	game=location.search.split("?")[1].split("%20").join(" ");}
else if(window.name==arrayOfOptions[c]){
	game=window.name;
	break;}}

	if (game){
	document.getElementById("gameon").innerHTML="<a class='fg-white' href='review.html?"+game+"'>"+game+"</a>";
            document.getElementById("prosidex").innerHTML="";
            document.getElementById("considex").innerHTML="";
            document.getElementById("combox").style.display="";

			$.when(
			$.ajax({
  			url: '/getComment',
  			data: { game: game },
  			type: 'POST',
  			success: function(data) {notifier(data);}
			}),
			$.ajax({
  			url: '/getNotif',
  			data: { game: game },
  			type: 'POST',
			})
			).done(function( a1, a2 ) {votifier(a2[0]);});
	}