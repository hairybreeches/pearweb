(function () {
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

})();
