function drawGraph() {
    id("graphw").style.display = "block";
    id("graphw").style.background = "rgba(0,0,0,0.8)";
}

function closeGraph() {
    id("graphw").style.background = "transparent";
    setTimeout(function() {
         id("graphw").style.display = "none";
    }, 1000);
}