# MathQuill 4 Quill

[![Build Status](https://github.com/c-w/mathquill4quill/workflows/CI/badge.svg)](https://github.com/c-w/mathquill4quill/actions?query=workflow%3Aci)
[![Version](https://img.shields.io/npm/v/mathquill4quill.svg)](https://www.npmjs.com/package/mathquill4quill)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/c-w/mathquill4quill/blob/master/LICENSE.txt)

## What's this?

This module adds support for rich math authoring to the [Quill](http://quilljs.com/) editor.

<img src="https://user-images.githubusercontent.com/1086421/60978795-afb8e100-a2ff-11e9-8a4a-6f77e24001c9.gif" width="450" alt="Basic demo of mathquill4quill">

[Live demo](https://c-w.github.io/mathquill4quill/)

## Usage example

### Plain Javascript

This module depends on [MathQuill](https://docs.mathquill.com/en/latest/Getting_Started/#download-and-load), [Quill](https://quilljs.com/docs/quickstart/) and [KaTeX](https://katex.org/docs/browser.html#starter-template), so you'll need to add references to their JS and CSS files in addition to adding a reference to `mathquill4quill.js` and `mathquill4quill.css`. Official builds as well as minified assets can be found on the [releases page](https://github.com/c-w/mathquill4quill/releases).

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

var enableMathQuillFormulaAuthoring = mathquill4quill();
enableMathQuillFormulaAuthoring(quill);
```

A working demo application can be found [here](./index.html) ([live](https://justamouse.com/mathquill4quill)).

### React

A demo application integrating this module with [react-quill](https://github.com/zenoamaro/react-quill) can be found [here](./reactjs) ([live](https://justamouse.com/mathquill4quill/reactjs)). A demo for [NextJS](https://nextjs.org/) can be found [here](./nextjs).

## Optional features

### Custom operator buttons

You can also add in operator buttons (buttons that allow users not familiar with latex to add in operators/functions like square roots) to the editor by passing the `operators` option to the `enableMathQuillFormulaAuthoring()` function. Example:

```javascript
enableMathQuillFormulaAuthoring(quill, {
  operators: [["\\sqrt[n]{x}", "\\nthroot"], ["\\frac{x}{y}","\\frac"]]
});
```

The operators variable is an array of arrays. The outside array contains all of the different arrays which describe the operator buttons. The arrays inside of the main array consist of two values. The first value is the latex that gets rendered as the value on the button, and the second value is the latex that gets inserted into the MathQuill editor.

<img src="https://user-images.githubusercontent.com/1086421/60978823-b8a9b280-a2ff-11e9-990a-ffba2b4ff394.gif" width="450" alt="Demo of mathquill4quill with custom operator buttons">

### List of previous formulas

Previous formulas can be saved and re-used. The available related configurations are:

```javascript
enableMathQuillFormulaAuthoring(quill, {
  displayHistory: true, // defaults to false
  historyCacheKey: '__my_app_math_history_cachekey_', // optional
  historySize: 20 // optional (defaults to 10)
});
```

This works by saving formula to a list (and local storage by default) everytime a new formula is used. Then displaying this list when a user opens the formula tooltip.

<img src="https://user-images.githubusercontent.com/31671215/75315157-c96b5200-5816-11ea-99c2-f5414ee8e241.gif" width="450" alt="Demo of mathquill4quill with formula history">

### Autofocus

For user convenience, mathquill4quill defaults to focusing the math input field when the formula button is pressed. You can disable this behavior via the `autofocus` option in the `enableMathQuillFormulaAuthoring()` function. Example:

```javascript
enableMathQuillFormulaAuthoring(quill, {
  autofocus: false
});
```

## Development setup

First, install the development dependencies:

```bash
npm install
```

You can now start the development server using `npm start`, verify code style compliance with `npm run lint` and run the tests with `npm test`.
