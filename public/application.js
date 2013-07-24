var our = (function () {
    var ret = {};

    var editors = [];

    var initialiseSyntaxHighlighting = function () {
        $(".editor").each(function () {
            var editor = ace.edit(this);
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editors.push(editor);
        });
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
            var text = 'debugger;';
            for (var i in editors)
            {
                text += '\n\n' + editors[i].getSession().getValue();
            }
            newFrame.contentWindow.eval(text);
        };

        container.appendChild(newFrame);


    };


    return ret;
})();
