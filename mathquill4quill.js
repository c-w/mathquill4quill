/* eslint-env browser */

window.mathquill4quill = function(dependencies) {
  dependencies = dependencies || {};

  var Quill = dependencies.Quill || window.Quill;
  var MathQuill = dependencies.MathQuill || window.MathQuill;
  var katex = dependencies.katex || window.katex;

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function areAllDependenciesMet(quill) {
    if (!Quill) {
      console.log("Quill.js not loaded"); // eslint-disable-line no-console
      return false;
    }

    if (!MathQuill) {
      console.log("MathQuill.js not loaded"); // eslint-disable-line no-console
      return false;
    }

    if (!katex) {
      console.log("katex.js not loaded"); // eslint-disable-line no-console
      return false;
    }

    if (!quill.options.modules.formula) {
      console.log("Formula module not enabled"); // eslint-disable-line no-console
      return false;
    }

    return true;
  }

  function applyInputStyles(mqInput) {
    mqInput.style.border = "1px solid #ccc";
    mqInput.style.fontSize = "13px";
    mqInput.style.minHeight = "26px";
    mqInput.style.margin = "0px";
    mqInput.style.padding = "3px 5px";
    mqInput.style.width = "170px";
  }

  function applyOperatorButtonStyles(button) {
    button.style.margin = "5px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.backgroundColor = "#ffffff";
    button.style.borderColor = "#000000";
    button.style.borderRadius = "7px";
    button.style.borderWidth = "2px";
  }

  function createOperatorButton(displayOperator, operator, mathquill) {
    var button = document.createElement("button");
    katex.render(displayOperator, button, {
      throwOnError: false
    });
    button.onclick = function() {
      mathquill.cmd(operator);
      mathquill.focus();
    };
    applyOperatorButtonStyles(button);
    return button;
  }

  function enableMathQuillFormulaAuthoring(quill, options) {
    if (!areAllDependenciesMet(quill)) {
      return;
    }

    options = options || {};
    options.operators = options.operators || [];

    var tooltip = quill.container.getElementsByClassName("ql-tooltip")[0];
    var latexInput = tooltip.getElementsByTagName("input")[0];
    var saveButton = tooltip.getElementsByClassName("ql-action")[0];

    // replace LaTeX formula input with MathQuill input
    var mqInput = document.createElement("span");
    applyInputStyles(mqInput);
    insertAfter(mqInput, latexInput);
    latexInput.setAttribute(
      "style",
      "visibility:hidden;padding:0px;border:0px;width:0px;"
    );

    // synchronize MathQuill input and LaTeX formula input
    var mqField = MathQuill.getInterface(2).MathField(mqInput, {
      handlers: {
        edit: function() {
          latexInput.value = mqField.latex();
        }
      }
    });

    //set focus to formula editor when it is opened
    document.getElementsByClassName("ql-formula")[0].onclick = function() {
      window.setTimeout(function() {
        mqField.focus();
      }, 1);
    };

    if (options.operators.length > 0) {
      var container = document.createElement("div");
      container.setAttribute("style", "display:flex;align-items:center;");
      options.operators.forEach(function(element) {
        container.appendChild(
          createOperatorButton(element[0], element[1], mqField)
        );
      });
      tooltip.appendChild(container);
    }

    // don't show the old math when the tooltip gets opened next time
    saveButton.addEventListener("click", function() {
      mqField.latex("");
    });
  }

  return enableMathQuillFormulaAuthoring;
};

// for backwards compatibility with prototype-based API
if (window.Quill) {
  window.Quill.prototype.enableMathQuillFormulaAuthoring = function(options) {
    window.mathquill4quill()(this, options);
  };
}
