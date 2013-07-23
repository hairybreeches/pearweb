var our = (function () {
    var ret = {};

    var editor = ace.edit("editor");

    var initialiseSyntaxHighlighting = function () {
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
        script.text  = editor.getSession().getValue();

        var theFrame = document.getElementById("executionFrame").contentWindow; // alternatively: window.frames[0]
        theFrame.document.body.appendChild(script);
    };


    return ret;
})();
