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

  function applyButtonStyles(button) {
    button.style.margin = "5px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.backgroundColor = "#ffffff";
    button.style.borderColor = "#000000";
    button.style.borderRadius = "7px";
    button.style.borderWidth = "2px";
  }

  function getTooltipElement(quill) {
    return quill.container.getElementsByClassName("ql-tooltip")[0];
  }

  function getTooltipLatexFormulaInput(quill) {
    var tooltip = getTooltipElement(quill);
    return tooltip.getElementsByTagName("input")[0];
  }

  function getTooltipSaveButton(quill) {
    var tooltip = getTooltipElement(quill);
    return tooltip.getElementsByClassName("ql-action")[0];
  }

  function getOperatorButton(displayOperator, operator, mathquill) {
    var button = document.createElement("button");
    katex.render(displayOperator, button, {
      throwOnError: false
    });
    button.onclick = function() {
      mathquill.cmd(operator);
      mathquill.focus();
    };
    applyButtonStyles(button);
    return button;
  }

  function enableMathQuillFormulaAuthoring(quill, options) {
    if (!areAllDependenciesMet(quill)) {
      return;
    }

    // replace LaTeX formula input with MathQuill input
    var latexInput = getTooltipLatexFormulaInput(quill);
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

    if (options && options.operators) {
      latexInput.parentNode.appendChild(document.createElement("br"));
      var container = document.createElement("div");
      container.setAttribute("style", "display:flex;align-items:center;");
      options.operators.forEach(function(element) {
        container.appendChild(
          getOperatorButton(element[0], element[1], mqField)
        );
      });
      latexInput.parentNode.appendChild(container);
    }

    // don't show the old math when the tooltip gets opened next time
    getTooltipSaveButton(quill).addEventListener("click", function() {
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
