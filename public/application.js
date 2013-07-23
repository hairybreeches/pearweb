var our = (function () {
    var ret = {};


    var initialiseSyntaxHighlighting = function () {
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
    };

    var initialiseTowTruck = function () {
        TowTruck();
    }

    initialiseSyntaxHighlighting();
    initialiseTowTruck();


    ret.onButtonClick = function () {

        var script   = document.createElement("script");
        script.type  = "text/javascript";
        script.text  = "alert('voila!');";

        var theFrame = document.getElementById("executionFrame").contentWindow; // alternatively: window.frames[0]
        theFrame.document.body.appendChild(script);
    };


    return ret;
})();
