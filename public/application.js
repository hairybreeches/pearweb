var our = (function () {
    var ret = {};

    var editors = [];
    var branch;

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

    var initialiseGitHub = function () {
        var gitHub = new Github({
            username: "DavidSimnerRG",
            password: "changeme"
        });
        var repo = gitHub.getRepo("red-gate", "davidsimner-downtoools");
        branch = repo.getDefaultBranch();
        branch.read('code.js', false).done(function (contents) {
            editors[0].getSession().setValue(contents.content);
        });
        branch.read('tests.js', false).done(function (contents) {
            editors[1].getSession().setValue(contents.content);
        });
    };

    var initialiseTowTruck = function () {
        var fromRemote = false;

        TowTruckConfig_on_ready = function () {
            $(".nav-tabs a").on('shown', function (e) {
                if (fromRemote) {
                    return;
                }

                var elementFinder = TowTruck.require("elementFinder");
                var location = elementFinder.elementLocation(e.target);
                TowTruck.send({type: "tabShown", element: location});
            });

            for (var i in editors)
            {
                (function (i) {
                    editors[i].getSession().on("changeScrollTop", function (value) {
                        if (fromRemote || !(!isNaN(parseFloat(value)) && isFinite(value))) {
                            return;
                        }

                        TowTruck.send({type: "scrollTop", editor: i, value: value});
                    });
                })(i);
            }
        };

        TowTruck.hub.on("tabShown", function (msg) {
            if (! msg.sameUrl) {
                return;
            }

            var elementFinder = TowTruck.require("elementFinder");
            var element = elementFinder.findElement(msg.element);
            fromRemote = true;
            try {
                $(element).tab('show');
            } finally {
                fromRemote = false;
            }
        });

        TowTruck.hub.on("scrollTop", function (msg) {
            if (! msg.sameUrl) {
                return;
            }

            fromRemote = true;
            try {
                editors[msg.editor].getSession().setScrollTop(msg.value);
            } finally {
                fromRemote = false;
            }
        });

        TowTruck();
    };

    initialiseTabs();
    initialiseSyntaxHighlighting();
    initialiseGitHub();
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

    ret.onSave = function (index) {
        branch.write(index == 0 ? 'code.js' : 'tests.js', editors[index].getSession().getValue(), "TODO: commit message", false);
    };

    ret.onGo = function () {


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
