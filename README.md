# MathQuill 4 Quill

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/c-w/mathquill4quill/blob/master/LICENSE.txt)

## What's this?

This module adds support for rich math authoring to the
[Quill](http://quilljs.com/) editor.

<img src="./demos/demo.gif" width="450" alt="Basic demo of mathquill4quill">

[Live demo](https://c-w.github.io/mathquill4quill/)

## Usage example

This module depends on
[MathQuill](http://docs.mathquill.com/en/latest/Getting_Started/),
[Quill](https://quilljs.com/docs/quickstart/) and
[KaTeX](https://github.com/Khan/KaTeX#usage),
so you'll need to add references to their JS and CSS files in addition to
adding a reference to [mathquill4quill.js](https://github.com/c-w/mathquill4quill/blob/master/mathquill4quill.js).

Next, initialize your Quill object and load the formula module:

```javascript
// setup quill with formula support

var quill = new Quill('#editor', {
  modules: {
    formula: true,
    toolbar: [['formula']]
  },
  theme: 'snow'
});
```

Last step: replace Quill's native formula authoring with MathQuill.

```javascript
// enable mathquill formula editor

quill.enableMathQuillFormulaAuthoring();
```

### Custom operator buttons

You can also add in operator buttons (buttons that allow users not familiar with latex to add in operators/functions like square roots) to the editor by passing an `operators` variable to the `enableMathQuillFormulaAuthoring()` function. Example:

```javascript
quill.enableMathQuillFormulaAuthoring({
    operators: [["\\sqrt[n]{x}", "\\nthroot"], ["\\frac{x}{y}","\\frac"]]
});
```

The operators variable is an array of arrays. The outside array contains all of the different arrays which describe the operator buttons. The arrays inside of the main array consist of two values. The first value is the latex that gets rendered as the value on the button, and the second value is the latex that gets inserted into the MathQuill editor.

<img src="./demos/demo-custom-operator-buttons.gif" width="450" alt="Demo of mathquill4quill with custom operator buttons">

### Generating minified javascript files

Generation of minified javascript for this project uses uglifyjs. To generate minified javascript, first make sure that uglifyjs is installed globally(you may have to run this command as root):

```
npm install uglify-js -g
```

When uglifyjs is installed, you can run `npm run build` which will generate a minified version of `mathquill4quill.js` called `mathquill4quill.min.js` that can be included in your webpage by substituting the minified file for the non-minified file directly.
