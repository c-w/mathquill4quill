/* eslint-env browser */

window.mathquill4quill = function(dependencies) {
  dependencies = dependencies || {};

  const Quill = dependencies.Quill || window.Quill;
  const MathQuill = dependencies.MathQuill || window.MathQuill;
  const katex = dependencies.katex || window.katex;
  const localStorage = dependencies.localStorage || window.localStorage;

  const defaultStyles = {
    mathquillInput:
      "border: 1px solid #ccc; " +
      "font-size: 13px; " +
      "min-height: 26px; " +
      "margin: 0px; " +
      "padding: 3px 5px; " +
      "width: 170px;",

    operatorButton:
      "margin: 5px; " +
      "width: 50px; " +
      "height: 50px; " +
      "background-color: #ffffff; " +
      "border-color: #000000; " +
      "border-radius: 7px; " +
      "border-width: 2px;",

    operatorContainer: "display: flex; align-items: center;",

    latexInput:
      "visibility: hidden; " +
      "padding: 0px; " +
      "border: 0px; " +
      "width: 0px;"
  };

  function setCacheItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }

  function getCacheItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return "";
    }
  }

  function removeCacheItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function enableMathQuillFormulaAuthoring(quill, options) {
    options = options || {};

    function areAllDependenciesMet() {
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

      if (!MutationObserver) {
        console.log("MutationObserver not defined"); // eslint-disable-line no-console
        return false;
      }

      return true;
    }

    function getTooltip() {
      return quill.container.getElementsByClassName("ql-tooltip")[0];
    }

    function getSaveButton() {
      const tooltip = getTooltip();
      return tooltip.getElementsByClassName("ql-action")[0];
    }

    function getLatexInput() {
      const tooltip = getTooltip();
      return tooltip.getElementsByTagName("input")[0];
    }

    function newMathquillInput() {
      const autofocus = options.autofocus == null ? true : options.autofocus;
      const cacheKey = options.cacheKey || "__mathquill4quill_cache__";
      const styles = options.styles || defaultStyles;

      let mqInput = null;
      let mqField = null;
      let latexInputStyle = null;

      function applyMathquillInputStyles(mqInput) {
        mqInput.style.cssText = styles.mathquillInput;
      }

      function applyLatexInputStyles(latexInput) {
        latexInput.setAttribute("style", styles.latexInput);
      }

      function syncMathquillToQuill(latexInput, saveButton) {
        const mqField = MathQuill.getInterface(2).MathField(mqInput, {
          handlers: {
            edit() {
              const latex = mqField.latex();
              latexInput.value = latex;
              setCacheItem(cacheKey, latex);
            },
            enter() {
              saveButton.click();
            }
          }
        });

        const cachedLatex = getCacheItem(cacheKey);
        if (cachedLatex) {
          mqField.latex(cachedLatex);
        }

        saveButton.addEventListener("click", () => removeCacheItem(cacheKey));

        return mqField;
      }

      function autofocusFormulaField(mqField) {
        if (!autofocus) {
          return;
        }

        window.setTimeout(() => mqField.focus(), 1);
      }

      return {
        render() {
          if (mqInput != null) {
            return;
          }

          const latexInput = getLatexInput();
          const saveButton = getSaveButton();

          mqInput = document.createElement("span");
          applyMathquillInputStyles(mqInput);

          latexInputStyle = latexInput.style.all;
          applyLatexInputStyles(latexInput);

          mqField = syncMathquillToQuill(latexInput, saveButton);
          autofocusFormulaField(mqField);

          insertAfter(mqInput, latexInput);
          return mqField;
        },
        destroy() {
          if (mqInput == null) {
            return;
          }

          const latexInput = getLatexInput();

          latexInput.setAttribute("style", latexInputStyle);

          mqInput.remove();
          mqInput = null;
        }
      };
    }

    function newOperatorButtons() {
      const operators = options.operators || [];
      const styles = options.styles || defaultStyles;
      let container = null;

      function applyOperatorButtonStyles(button) {
        button.style.cssText = styles.operatorButton;
      }

      function applyOperatorContainerStyles(container) {
        container.style.cssText = styles.operatorContainer;
      }

      function createOperatorButton(element, mqField) {
        const displayOperator = element[0];
        const operator = element[1];

        const button = document.createElement("button");
        button.setAttribute("type", "button");

        katex.render(displayOperator, button, {
          throwOnError: false
        });
        button.onclick = () => {
          mqField.cmd(operator);
          mqField.focus();
        };

        return button;
      }

      return {
        render(mqField) {
          if (container != null || operators.length === 0) {
            return;
          }

          const tooltip = getTooltip();

          container = document.createElement("div");
          applyOperatorContainerStyles(container);

          operators.forEach(element => {
            const button = createOperatorButton(element, mqField);
            applyOperatorButtonStyles(button);
            container.appendChild(button);
          });

          tooltip.appendChild(container);
        },
        destroy() {
          if (container == null) {
            return;
          }

          container.remove();
          container = null;
        }
      };
    }

    if (!areAllDependenciesMet()) {
      return;
    }

    const tooltip = getTooltip();

    const mqInput = newMathquillInput();
    const operatorButtons = newOperatorButtons();

    const observer = new MutationObserver(() => {
      const isFormulaTooltipActive =
        !tooltip.classList.contains("ql-hidden") &&
        tooltip.attributes["data-mode"] &&
        tooltip.attributes["data-mode"].value === "formula";

      if (isFormulaTooltipActive) {
        const mqField = mqInput.render();
        operatorButtons.render(mqField);
      } else {
        mqInput.destroy();
        operatorButtons.destroy();
      }
    });

    observer.observe(tooltip, {
      attributes: true,
      attributeFilter: ["class", "data-mode"]
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
