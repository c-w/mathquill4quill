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

  function applyOperatorContainerStyles(container) {
    container.style.display = "flex";
    container.style.alignItems = "center";
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

    if (options.operators.length > 0) {
      // create operator buttons
      var operatorButtons = document.createElement("div");
      options.operators.forEach(function(element) {
        operatorButtons.appendChild(
          createOperatorButton(element[0], element[1], mqField)
        );
      });
      tooltip.appendChild(operatorButtons);

      // hide operator buttons on non-formula tooltips
      var observer = new MutationObserver(function() {
        var mode = tooltip.attributes["data-mode"].value;
        if (mode === "formula") {
          applyOperatorContainerStyles(operatorButtons);
        } else {
          operatorButtons.style.display = "none";
        }
      });
      observer.observe(tooltip, {
        attributes: true,
        attributeFilter: ["data-mode"],
      });
    }

    document.getElementsByClassName("ql-formula")[0].onclick = function() {
      // set focus to formula editor when it is opened
      window.setTimeout(function() {
        mqField.focus();
      }, 1);
    };

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
