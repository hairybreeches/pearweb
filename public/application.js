var our = (function () {
    var ret = {};

    var editors = [];

    var initialiseTabs = function () {
        $(".nav-tabs a").click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    };

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

    initialiseTabs();
    initialiseSyntaxHighlighting();
    initialiseTowTruck();


    var createElement = function (parentElement, tag, params) {
        var element = document.createElement(tag);
        $.extend(element, params);
        parentElement.appendChild(element);
    };

    var injectCssSrc = function (parentElement, source, callback) {
        createElement(parentElement, "link", {
            media: "all",
            rel: "stylesheet",
            type: "text/css",
            href: source,
            onload: callback
        });
    };

    var injectScriptSrc = function (parentElement, source, callback) {
        createElement(parentElement, "script", {
            type: "text/javascript",
            src: source,
            onload: callback
        });
    };

    var injectScriptText = function (parentElement, value) {
        createElement(parentElement, "script", {
            type: "text/javascript",
            text: value
        });
    };

    var injectEval = function (frameWindow, value, callback) {
        frameWindow.eval(value);
        callback();
    };

    Function.prototype.curry = function () {
        var slice = Array.prototype.slice,
            args = slice.apply(arguments),
            that = this;
        return function () {
            return that.apply(null, args.concat(slice.apply(arguments)));
        };
    };


    ret.onButtonClick = function () {


        var container = document.getElementById("executionContainer");

        var id = "executionFrame";

        var oldFrame = document.getElementById(id);
        if (oldFrame) {
            container.removeChild(oldFrame);
        }

        var newFrame = document.createElement("iframe");
        newFrame.id = id;
        newFrame.className = "full-size";

        newFrame.onload = function () {
            var text = $("#debug").prop("checked") ? "debugger;" : "";
            for (var i in editors)
            {
                text += '\n\n' + editors[i].getSession().getValue();
            }
            const runUnitTestsAndDisplayResultsCode = "(function () { var env = jasmine.getEnv(); env.addReporter(new jasmine.HtmlReporter()); env.execute(); })();";


            var frameWindow = newFrame.contentWindow;
            var body = frameWindow.document.body;
            injectCssSrc(body, "http://cdn.jsdelivr.net/jasmine/1.3.1/jasmine.css",
                injectScriptSrc.curry(body, "http://cdn.jsdelivr.net/jasmine/1.3.1/jasmine.js",
                    injectEval.curry(frameWindow, text,
                        injectScriptSrc.curry(body, "http://cdn.jsdelivr.net/jasmine/1.3.1/jasmine-html.js",
                            injectScriptText.curry(body, runUnitTestsAndDisplayResultsCode)
                        ))));
        };

        container.appendChild(newFrame);


    };


    return ret;
})();
