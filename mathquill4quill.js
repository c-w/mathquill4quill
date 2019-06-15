(function(Quill, MathQuill, katex) {
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function areAllDependenciesMet(quill) {
    if (!Quill) {
      console.log("Quill.js not loaded");
      return false;
    }

    if (!MathQuill) {
      console.log("MathQuill.js not loaded");
      return false;
    }

    if (!katex) {
      console.log("katex.js not loaded");
      return false;
    }

    if (!quill.options.modules.formula) {
      console.log("Formula module not enabled");
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

  Quill.prototype.enableMathQuillFormulaAuthoring = function(options) {
    if (!areAllDependenciesMet(this)) {
      return;
    }

    // replace LaTeX formula input with MathQuill input
    var latexInput = getTooltipLatexFormulaInput(this);
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

    if (options && options.operators) {
      latexInput.parentNode.appendChild(document.createElement("br"));
      options.operators.forEach(function(element) {
        latexInput.parentNode.appendChild(
          getOperatorButton(element[0], element[1], mqField)
        );
      });
    }

    // don't show the old math when the tooltip gets opened next time
    getTooltipSaveButton(this).addEventListener("click", function() {
      mqField.latex("");
    });
  };
})(window.Quill, window.MathQuill, window.katex);
