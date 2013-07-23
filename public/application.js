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
        var theFrame = document.getElementById("executionFrame").contentWindow; // alternatively: window.frames[0]
        theFrame.document.body.innerHTML = "<p>hello world</p>";
    };


    return ret;
})();
