var our = (function () {
    var ret = {};

    var editor = ace.edit("editor");

    var initialiseSyntaxHighlighting = function () {
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
    };

    var initialiseTowTruck = function () {
        TowTruck();
    };

    initialiseSyntaxHighlighting();
    initialiseTowTruck();


    ret.onButtonClick = function () {


        var container = document.getElementById("executionContainer");

        var id = "executionFrame";

        var oldFrame = document.getElementById(id);
        if (oldFrame) {
            container.removeChild(oldFrame);
        }

        var newFrame = document.createElement("iframe");
        newFrame.id = id;

        newFrame.onload = function () {
            var text = 'debugger;\n\n' + editor.getSession().getValue();
            newFrame.contentWindow.eval(text);
        };

        container.appendChild(newFrame);


    };


    return ret;
})();
