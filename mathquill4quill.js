/* eslint-env browser, commonjs */

window.mathquill4quill = function(dependencies) {
  dependencies = dependencies || {};

  const Quill = dependencies.Quill || window.Quill;
  const MathQuill = dependencies.MathQuill || window.MathQuill;
  const katex = dependencies.katex || window.katex;
  const localStorage = dependencies.localStorage || window.localStorage;

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

  function isOperatorCommand(operator) {
    return /^\\[A-Za-z]+$/.test(operator);
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

    function fetchHistoryList(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch (e) {
        return [];
      }
    }

    function addItemToHistoryList(key) {
      const item = getCacheItem(key);
      if (item && item.length > 0) {
        const index = historyList.indexOf(item);
        if (index != -1) {
          historyList.splice(index, 1);
        }
        historyList.unshift(item);
        if (historyList.length > historySize) historyList.pop();
        try {
          localStorage.setItem(historyCacheKey, JSON.stringify(historyList));
        } catch (e) {
          // eslint-disable-line no-empty
        }
      }
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
      const mathQuillConfig =
        options.mathQuillConfig != null ? options.mathQuillConfig : {};
      const cacheKey = options.cacheKey || "__mathquill4quill_cache__";
      let mqInput = null;
      let mqField = null;
      let latexInputStyle = null;

      function applyMathquillInputStyles(mqInput) {
        mqInput.setAttribute("class", "mathquill4quill-mathquill-input");
      }

      function applyLatexInputStyles(latexInput) {
        latexInput.setAttribute("class", "mathquill4quill-latex-input");
      }

      function syncMathquillToQuill(latexInput, saveButton) {
        const handlers =
          mathQuillConfig.handlers == null ? {} : mathQuillConfig.handlers;
        mathQuillConfig.handlers = {
          ...handlers,
          edit() {
            const latex = mqField.latex();
            latexInput.value = latex;
            setCacheItem(cacheKey, latex);
          },
          enter() {
            saveButton.click();
          }
        };
        const mqField = MathQuill.getInterface(2).MathField(
          mqInput,
          mathQuillConfig
        );

        const cachedLatex = getCacheItem(cacheKey);
        if (cachedLatex) {
          mqField.latex(cachedLatex);
        }

        saveButton.addEventListener("click", () => {
          addItemToHistoryList(cacheKey);
          removeCacheItem(cacheKey);
        });

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

          latexInputStyle = latexInput.className;
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

          latexInput.setAttribute("class", latexInputStyle);

          mqInput.remove();
          mqInput = null;
        }
      };
    }

    function newOperatorButtons() {
      const operators = options.operators || [];
      let container = null;

      function applyOperatorButtonStyles(button) {
        button.setAttribute("class", "mathquill4quill-operator-button");
      }

      function applyOperatorContainerStyles(container) {
        container.setAttribute("class", "mathquill4quill-operator-container");
      }

      function createOperatorButton(element, mqField) {
        const displayOperator = element[0];
        const operator = element[1];

        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("data-value", operator);

        katex.render(displayOperator, button, {
          throwOnError: false
        });
        button.onclick = () => {
          if (isOperatorCommand(operator)) {
            mqField.cmd(operator);
          } else {
            mqField.write(operator);
          }
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

    function newHistoryList() {
      const history = historyList || [];
      let historyDiv = null;

      function applyHistoryButtonStyles(button) {
        button.setAttribute("class", "mathquill4quill-history-button");
      }

      function applyHistoryContainerStyles(container) {
        container.setAttribute("class", "mathquill4quill-history-container");
      }

      function createHistoryButton(latex, mqField) {
        const button = document.createElement("button");
        button.setAttribute("type", "button");

        katex.render(latex, button, {
          throwOnError: false
        });
        button.onclick = () => {
          mqField.write(latex);
          mqField.focus();
        };

        return button;
      }

      return {
        render(mqField) {
          fixToolTipHeight();

          if (historyDiv != null || !displayHistory || history.length === 0) {
            return;
          }

          const tooltip = getTooltip();

          historyDiv = document.createElement("div");
          let container = document.createElement("div");
          applyHistoryContainerStyles(container);
          let header = document.createElement("p");
          header.innerHTML = "Past formulas (max " + historySize + ")";
          historyDiv.appendChild(header);

          history.forEach(element => {
            const button = createHistoryButton(element, mqField);
            applyHistoryButtonStyles(button);
            container.appendChild(button);
          });
          historyDiv.appendChild(container);
          tooltip.appendChild(historyDiv);
        },
        destroy() {
          if (historyDiv == null) {
            return;
          }

          historyDiv.remove();
          historyDiv = null;
        }
      };
    }

    // If tooltip hangs below Quill div, Quill will position tooltip in bad place if function is clicked twice
    // This addresses the position issue
    function fixToolTipHeight() {
      const tooltip = getTooltip();

      if (
        tooltip.getBoundingClientRect().top -
          quill.container.getBoundingClientRect().top <
        0
      ) {
        tooltip.style.top = "0px";
      }
    }

    if (!areAllDependenciesMet()) {
      return;
    }

    const tooltip = getTooltip();

    const historyCacheKey =
      options.historyCacheKey || "__mathquill4quill_historylist_cache__";
    let historyList = fetchHistoryList(historyCacheKey);
    const historySize = options.historySize || 10;
    const displayHistory = options.displayHistory || false;

    const mqInput = newMathquillInput();
    const operatorButtons = newOperatorButtons();
    const historyListButtons = newHistoryList();

    const observer = new MutationObserver(() => {
      const isFormulaTooltipActive =
        !tooltip.classList.contains("ql-hidden") &&
        tooltip.attributes["data-mode"] &&
        tooltip.attributes["data-mode"].value === "formula";

      if (isFormulaTooltipActive) {
        const mqField = mqInput.render();
        operatorButtons.render(mqField);
        historyListButtons.render(mqField);
      } else {
        mqInput.destroy();
        operatorButtons.destroy();
        historyListButtons.destroy();
      }
    });

    observer.observe(tooltip, {
      attributes: true,
      attributeFilter: ["class", "data-mode"]
    });
  }

  return enableMathQuillFormulaAuthoring;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = window.mathquill4quill;
}

// for backwards compatibility with prototype-based API
if (window.Quill) {
  window.Quill.prototype.enableMathQuillFormulaAuthoring = function(options) {
    window.mathquill4quill()(this, options);
  };
}
