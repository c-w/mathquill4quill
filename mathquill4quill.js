/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-env browser, commonjs */
let show = null

window.mathquill4quill = function (dependencies) {
  dependencies = dependencies || {}

  const Quill = dependencies.Quill || window.Quill
  const MathQuill = dependencies.MathQuill || window.MathQuill
  const katex = dependencies.katex || window.katex
  const localStorage = dependencies.localStorage || window.localStorage

  function setCacheItem(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }

  function getCacheItem(key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return ''
    }
  }

  function removeCacheItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  function enableMathQuillFormulaAuthoring(quill, options) {
    options = options || {}
    function areAllDependenciesMet() {
      if (!Quill) {
        console.log('Quill.js not loaded') // eslint-disable-line no-console
        return false
      }

      if (!MathQuill) {
        console.log('MathQuill.js not loaded') // eslint-disable-line no-console
        return false
      }

      if (!katex) {
        console.log('katex.js not loaded') // eslint-disable-line no-console
        return false
      }

      if (!quill.options.modules.formula) {
        console.log('Formula module not enabled') // eslint-disable-line no-console
        return false
      }

      if (!MutationObserver) {
        console.log('MutationObserver not defined') // eslint-disable-line no-console
        return false
      }

      return true
    }

    function fetchHistoryList(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || []
      } catch (e) {
        return []
      }
    }

    function addItemToHistoryList(key) {
      const item = getCacheItem(key)
      if (item && item.length > 0) {
        const index = historyList.indexOf(item)
        if (index !== -1) {
          historyList.splice(index, 1)
        }
        historyList.unshift(item)
        if (historyList.length > historySize) historyList.pop()
        try {
          localStorage.setItem(historyCacheKey, JSON.stringify(historyList))
        } catch (e) {
          // eslint-disable-line no-empty
        }
      }
    }

    function getTooltip() {
      return quill.container.getElementsByClassName('ql-tooltip')[0]
    }

    function getSaveButton() {
      const tooltip = getTooltip()
      return tooltip.getElementsByClassName('ql-action')[0]
    }

    function getLatexInput() {
      const tooltip = getTooltip()
      return tooltip.getElementsByTagName('input')[0]
    }

    function newMathquillInput() {
      const autofocus = options.autofocus == null ? true : options.autofocus
      const mathQuillConfig =
        options.mathQuillConfig != null ? options.mathQuillConfig : {}
      const cacheKey = options.cacheKey || '__mathquill4quill_cache__'
      let mqInput = null
      let mqField = null
      let latexInputStyle = null

      function applyMathquillInputStyles(mqInput) {
        mqInput.setAttribute('class', 'mathquill4quill-mathquill-input')
      }

      function applyLatexInputStyles(latexInput) {
        latexInput.setAttribute('class', 'mathquill4quill-latex-input')
      }

      function syncMathquillToQuill(latexInput, saveButton) {
        const handlers =
          mathQuillConfig.handlers == null ? {} : mathQuillConfig.handlers
        mathQuillConfig.handlers = {
          ...handlers,
          edit() {
            const latex = mqField.latex()
            latexInput.value = latex
            setCacheItem(cacheKey, latex)
          },
          enter() {
            saveButton.click()
          },
        }
        const mqField = MathQuill.getInterface(2).MathField(
          mqInput,
          mathQuillConfig,
        )

        const cachedLatex = getCacheItem(cacheKey)
        if (cachedLatex) {
          mqField.latex(cachedLatex)
        }

        saveButton.addEventListener('click', () => {
          addItemToHistoryList(cacheKey)
          removeCacheItem(cacheKey)
        })

        return mqField
      }

      function autofocusFormulaField(mqField) {
        if (!autofocus) {
          return
        }

        window.setTimeout(() => mqField.focus(), 1)
      }

      return {
        render() {
          if (mqInput != null) {
            return
          }

          const latexInput = getLatexInput()
          const saveButton = getSaveButton()

          mqInput = document.createElement('span')
          applyMathquillInputStyles(mqInput)

          latexInputStyle = latexInput.className
          applyLatexInputStyles(latexInput)

          mqField = syncMathquillToQuill(latexInput, saveButton)
          autofocusFormulaField(mqField)

          insertAfter(mqInput, latexInput)
          return mqField
        },
        destroy() {
          if (mqInput == null) {
            return
          }

          const latexInput = getLatexInput()

          latexInput.setAttribute('class', latexInputStyle)

          mqInput.remove()
          mqInput = null
        },
      }
    }

    function newOperatorButtons() {
      const operators = [
        ['\\\\a{^2}', '^2'],
        ['\\lvert{x}\\rvert', '\\mid'],
        ['\\frac{dx}{dy}', '\\dfrac{dx}{dy}'],
        [
          '\\frac{\\partial{x}}{\\partial{y}}',
          '\\dfrac{\\partial{x}}{\\partial{y}}',
        ],

        ['\\\\a{^x}', '^'],
        ['\\int', '\\int'],
        ['\\oint', '\\oint'],
        ['\\sqrt{x}', '\\sqrt'],

        ['\\\\a{_x}', '_'],
        ['\\log{_x}', '\\log_'],
        ['\\lim{_x}', '\\lim_'],
        ['\\overleftarrow{AB}', '\\overleftarrow'],

        ['\\frac{x}{y}', '\\frac'],
        ['\\overline{xy}', '\\overline'],
        ['\\overrightarrow{AB}', '\\overrightarrow'],
        ['\\approx', '\\approx'],

        ['+', '+'],
        ['\\times', '\\times'],
        ['<', '<'],
        ['\\backsim', '\\backsim'],

        ['-', '-'],
        ['\\div', '\\div'],
        ['>', '>'],
        ['\\approx', '\\approx'],

        ['\\gtrapprox', '\\gtrapprox'],
        ['\\neq', '\\neq'],
        ['\\ge', '\\ge'],
        ['\\cong', '\\cong'],

        ['\\pm', '\\pm'],
        ['=', '='],
        ['\\le', '\\le'],
        ['\\approxeq', '\\approxeq'],
      ]
      const operators2 = [
        ['\\alpha', '\\alpha'],
        ['\\beta', '\\beta'],
        ['\\Gamma', '\\Gamma'],
        ['\\Delta', '\\Delta'],

        ['\\epsilon', '\\epsilon'],
        ['\\zeta', '\\zeta'],
        ['\\eta', '\\eta'],
        ['\\Theta', '\\Theta'],

        ['\\iota', '\\iota'],
        ['\\kappa', '\\kappa'],
        ['\\mu', '\\mu'],
        ['\\Pi', '\\Pi'],

        ['\\rho', '\\rho'],
        ['\\Sigma', '\\Sigma'],
        ['\\Upsilon', '\\Upsilon'],
        ['\\Phi', '\\Phi'],

        ['\\Psi', '\\Psi'],
        ['\\Omega', '\\Omega'],
        ['\\delta', '\\delta'],
        ['\\lambda', '\\lambda'],
      ]
      const operators3 = [
        ['\\sqrt[n]{x}', '\\nthroot'],
        ['\\coprod^{s}_{x}{d}', '\\coprod'],
        ['\\sum^{s}_{x}{d}', '\\sum'],
        ['\\degree', '\\degree'],

        ['\\binom{n}{k}', '\\binom'],
        ['\\prod^{s}_{x}{d}', '\\prod'],
        ['\\int^{s}_{x}{d}', '\\int'],
        ['+ c', '+ c'],

        ['\\subset', '\\subset'],
        ['\\land', '\\land'],
        ['\\exists', '\\exists'],
        ['\\in', '\\in'],

        ['\\supset', '\\supset'],
        ['\\lor', '\\lor'],
        ['\\nexists', '\\nexists'],
        ['\\notin', '\\notin'],

        // edit here
        ['\\subseteq', '\\subseteq'],

        ['\\because', '\\because'],

        ['\\therefore', '\\therefore'],
        ['\\forall', '\\forall'],
        ['\\supseteq', '\\supseteq'],
        ['\\to', '\\to'],
        ['\\gets', '\\gets'],

        ['\\implies', '\\implies'],
        ['\\impliedby', '\\impliedby'],
        ['\\iff', '\\iff'],
        ['\\leftrightarrow', '\\leftrightarrow'],

        ['\\uarr', '\\uarr'],
        ['\\Updownarrow', '\\Updownarrow'],
        ['\\updownarrow', '\\updownarrow'],
      ]
      const basicOperator2 = [
        ['\\\\a{^2}', '^2'],
        ['\\lvert{x}\\rvert', '\\mid'],
        ['\\frac{dx}{dy}', '\\dfrac{dx}{dy}'],
        [
          '\\frac{\\partial{x}}{\\partial{y}}',
          '\\dfrac{\\partial{x}}{\\partial{y}}',
        ],

        ['\\\\a{^x}', '^'],
        ['\\int', '\\int'],
        ['\\oint', '\\oint'],
        ['\\sqrt{x}', '\\sqrt'],

        ['\\\\a{_x}', '_'],
        ['\\log{_x}', '\\log_'],
        ['\\lim{_x}', '\\lim_'],
        ['\\overleftarrow{AB}', '\\overleftarrow'],

        ['\\frac{x}{y}', '\\frac'],
        ['\\overline{xy}', '\\overline'],
        ['\\overrightarrow{AB}', '\\overrightarrow'],
        ['\\approx', '\\approx'],

        ['+', '+'],
        ['\\times', '\\times'],
        ['<', '<'],
        ['\\backsim', '\\backsim'],

        ['-', '-'],
        ['\\div', '\\div'],
        ['>', '>'],
        ['\\approx', '\\approx'],

        ['\\gtrapprox', '\\gtrapprox'],
        ['\\neq', '\\neq'],
        ['\\ge', '\\ge'],
        ['\\cong', '\\cong'],

        ['\\pm', '\\pm'],
        ['=', '='],
        ['\\le', '\\le'],
        ['\\approxeq', '\\approxeq'],
      ]
      let mainContainer = null
      let headerContainer = null
      let footer = null
      let container = null
      let container2 = null
      let container3 = null
      function applyOperatorButtonStyles(button) {
        button.setAttribute('class', 'mathquill4quill-operator-button')
      }
      function applyOperatorButtonStyles2(button) {
        button.setAttribute('class', 'mathquill4quill-operator-button2')
      }
      function applyOperatorButtonStyles3(button) {
        button.setAttribute('class', 'mathquill4quill-operator-button3')
      }

      function applyOperatorContainerStyles(container) {
        container.setAttribute('class', 'mathquill4quill-operator-container')
        container.setAttribute('id', 'first')
      }
      function applyOperatorContainerStyles2(container) {
        container.setAttribute('class', 'mathquill4quill-operator-container2')
        container.setAttribute('id', 'second')
      }
      function applyOperatorContainerStyles3(container) {
        container.setAttribute('class', 'mathquill4quill-operator-container3')
        container.setAttribute('id', 'third')
      }
      function applyOperatorMainContainerStyles(container) {
        container.setAttribute(
          'class',
          'mathquill4quill-operator-main-container',
        )
      }
      function applyOperatorFooterStyles(container) {
        container.setAttribute('class', 'mathquill4quill-operator-footer')
      }
      function applyOperatorHeaderContainerStyles(container) {
        container.setAttribute(
          'class',
          'mathquill4quill-operator-header-container',
        )
      }
      function applyBasicOperator2ButtonStyles(container) {
        container.setAttribute(
          'class',
          'mathquill4quill-operator-basic-operator2',
        )
      }

      function createOperatorButton(element, mqField) {
        const displayOperator = element[0]
        const operator = element[1]

        const button = document.createElement('button')
        button.setAttribute('type', 'button')

        katex.render(displayOperator, button, {
          throwOnError: false,
        })
        button.onclick = () => {
          mqField.cmd(operator)
          mqField.focus()
        }

        return button
      }

      return {
        render(mqField) {
          if (container != null || operators.length === 0) {
            return
          }
          if (!show) return
          const tooltip = getTooltip()
          mainContainer = document.createElement('div')
          applyOperatorMainContainerStyles(mainContainer)

          // header goes headerContainer
          headerContainer = document.createElement('div')
          applyOperatorHeaderContainerStyles(headerContainer)
          mainContainer.appendChild(headerContainer)
          //create a nav
          const navContainer = document.createElement('nav')
          headerContainer.appendChild(navContainer)
          //inside nav create unordered list
          const navbar = document.createElement('ul')
          navContainer.appendChild(navbar)
          //inside ul create a three list item then append all anchor tags below
          const navlist = document.createElement('li')
          navbar.appendChild(navlist)

          const navlist2 = document.createElement('li')
          navbar.appendChild(navlist2)

          const navlist3 = document.createElement('li')
          navbar.appendChild(navlist3)

          // scrollables all to footer
          footer = document.createElement('div')
          applyOperatorFooterStyles(footer)
          mainContainer.appendChild(footer)

          // Basic tab
          const basicLink = document.createElement('a')
          const basicText = document.createTextNode('Basic')
          basicLink.setAttribute('href', '#first')
          basicLink.setAttribute('id', 'basicLink')
          basicLink.appendChild(basicText)
          navlist.appendChild(basicLink)

          // Greek tab
          const greekLink = document.createElement('a')
          const greekText = document.createTextNode('Greek')
          greekLink.setAttribute('href', '#second')
          greekLink.appendChild(greekText)
          navlist2.appendChild(greekLink)

          //third tab
          const advanceLink = document.createElement('a')
          const advanceText = document.createTextNode('Advanced')
          advanceLink.setAttribute('href', '#third')
          advanceLink.appendChild(advanceText)
          navlist3.appendChild(advanceLink)

          container = document.createElement('div')
          container2 = document.createElement('div')
          container3 = document.createElement('div')
          applyOperatorContainerStyles(container)
          applyOperatorContainerStyles2(container2)
          applyOperatorContainerStyles3(container3)
          // buttonContainer = document.createElement("div")
          // container.appendChild(buttonContainer)

          // buttonContainer2 = document.createElement("div")
          // container.appendChild(buttonContainer2)

          // buttonContainer3 = document.createElement("div")
          // container.appendChild(buttonContainer3)

          footer.appendChild(container)
          footer.appendChild(container2)
          footer.appendChild(container3)

          operators.forEach((element) => {
            const button = createOperatorButton(element, mqField)
            applyOperatorButtonStyles(button)
            container.appendChild(button)
          })
          operators2.forEach((element) => {
            const button2 = createOperatorButton(element, mqField)
            applyOperatorButtonStyles2(button2)
            container2.appendChild(button2)
          })
          operators3.forEach((element) => {
            const button3 = createOperatorButton(element, mqField)
            applyOperatorButtonStyles3(button3)
            container3.appendChild(button3)
          })

          basicOperator2.forEach((element) => {
            const basicOperator2Buttons = createOperatorButton(element, mqField)
            applyBasicOperator2ButtonStyles(basicOperator2Buttons)
          })
          tooltip.appendChild(mainContainer)
        },
        destroy() {
          if (container == null) {
            return
          }

          container.remove()
          container = null
          container2.remove()
          container2 = null
          container3.remove()
          container3 = null
          mainContainer.remove()
          mainContainer = null
        },
      }
    }

    function newHistoryList() {
      const history = historyList || []
      let historyDiv = null

      function applyHistoryButtonStyles(button) {
        button.setAttribute('class', 'mathquill4quill-history-button')
      }

      function applyHistoryContainerStyles(container) {
        container.setAttribute('class', 'mathquill4quill-history-container')
      }
      function fixToolTipHeight() {
        const tooltip = getTooltip()

        if (
          tooltip.getBoundingClientRect().top -
            quill.container.getBoundingClientRect().top <
          0
        ) {
          tooltip.style.top = '0px'
        }
      }
      function createHistoryButton(latex, mqField) {
        const button = document.createElement('button')
        button.setAttribute('type', 'button')

        katex.render(latex, button, {
          throwOnError: false,
        })
        button.onclick = () => {
          mqField.write(latex)
          mqField.focus()
        }

        return button
      }

      return {
        render(mqField) {
          fixToolTipHeight()

          if (historyDiv != null || !displayHistory || history.length === 0) {
            return
          }

          const tooltip = getTooltip()

          historyDiv = document.createElement('div')
          const container = document.createElement('div')
          applyHistoryContainerStyles(container)
          const header = document.createElement('p')
          header.innerHTML = 'Past formulas (max ' + historySize + ')'
          historyDiv.appendChild(header)

          history.forEach((element) => {
            const button = createHistoryButton(element, mqField)
            applyHistoryButtonStyles(button)
            container.appendChild(button)
          })
          historyDiv.appendChild(container)
          tooltip.appendChild(historyDiv)
        },
        destroy() {
          if (historyDiv == null) {
            return
          }

          historyDiv.remove()
          historyDiv = null
        },
      }
    }

    // If tooltip hangs below Quill div, Quill will position tooltip in bad place if function is clicked twice
    // This addresses the position issue

    if (!areAllDependenciesMet()) {
      return
    }

    const tooltip = getTooltip()

    const historyCacheKey =
      options.historyCacheKey || '__mathquill4quill_historylist_cache__'
    const historyList = fetchHistoryList(historyCacheKey)
    const historySize = options.historySize || 10
    const displayHistory = options.displayHistory || false

    const mqInput = newMathquillInput()
    const operatorButtons = newOperatorButtons()
    const historyListButtons = newHistoryList()

    const observer = new MutationObserver(() => {
      const isFormulaTooltipActive =
        !tooltip.classList.contains('ql-hidden') &&
        tooltip.attributes['data-mode'] &&
        tooltip.attributes['data-mode'].value === 'formula'

      if (isFormulaTooltipActive) {
        const mqField = mqInput.render()
        operatorButtons.render(mqField)
        historyListButtons.render(mqField)
        const initialSelect = document.getElementById('basicLink')
        initialSelect.classList.add('selected')
        document.addEventListener(
          'click',
          function (event) {
            // If the clicked element doesn't have the right selector, bail
            const el = document.getElementsByClassName('ql-tooltip')[0]
            if (el) {
              el.style = 'position: absolute; top: 0; z-index: 9999;'
            }

            if (!event.target.matches('a')) return
            const elems = document.querySelectorAll('a')
            for (let i = 0; i < elems.length; i++) {
              elems[i].classList.remove('selected')
            }
            event.target.classList.add('selected')
          },
          false,
        )
      } else {
        mqInput.destroy()
        operatorButtons.destroy()
        historyListButtons.destroy()
      }
    })

    observer.observe(tooltip, {
      attributes: true,
      attributeFilter: ['class', 'data-mode'],
    })
  }

  return enableMathQuillFormulaAuthoring
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.mathquill4quill
}
// eslint-disable-next-line no-unused-vars
document.addEventListener('click', (event) => {
  const toggle = document.getElementById('showOperators')
  show = toggle.checked
})
// for backwards compatibility with prototype-based API
if (window.Quill) {
  window.Quill.prototype.enableMathQuillFormulaAuthoring = function (options) {
    window.mathquill4quill()(this, options)
  }
}
