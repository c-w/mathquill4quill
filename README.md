# MathQuill 4 Quill

[![Build Status](https://clewolff.visualstudio.com/mathquill4quill/_apis/build/status/c-w.mathquill4quill?branchName=master)](https://clewolff.visualstudio.com/mathquill4quill/_build/latest?definitionId=5&branchName=master)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/c-w/mathquill4quill/blob/master/LICENSE.txt)

## What's this?

This module adds support for rich math authoring to the [Quill](http://quilljs.com/) editor.

<img src="./demos/demo.gif" width="450" alt="Basic demo of mathquill4quill">

[Live demo](https://c-w.github.io/mathquill4quill/)

## Usage example

### Plain Javascript

This module depends on [MathQuill](http://docs.mathquill.com/en/latest/Getting_Started/), [Quill](https://quilljs.com/docs/quickstart/) and [KaTeX](https://github.com/Khan/KaTeX#usage), so you'll need to add references to their JS and CSS files in addition to adding a reference to `mathquill4quill.js`. Official builds as well as minified assets can be found on the [releases page](https://github.com/c-w/mathquill4quill/releases).

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

### React

To integrate this module with [react-quill](https://github.com/zenoamaro/react-quill), add references to the JS and CSS files of MathQuill, KaTeX and mathquill4quill to your application. Next, you can enable the mathquill formula editor on your ReactQuill component:

```javascript
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
const { mathquill4quill } = window;

class App extends React.Component {
  reactQuill = React.createRef();

  componentDidMount() {
    const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill });
    enableMathQuillFormulaAuthoring(this.reactQuill.current.editor);
  }

  render() {
    return (
      <ReactQuill
        ref={this.reactQuill}
        modules={{
          formula: true,
          toolbar: [["formula", /* ... other toolbar items here ... */]]
        }}
        {/* ... other properties here ... */}
      />
    );
  }
}
```

## Optional features

### Custom operator buttons

You can also add in operator buttons (buttons that allow users not familiar with latex to add in operators/functions like square roots) to the editor by passing an `operators` variable to the `enableMathQuillFormulaAuthoring()` function. Example:

```javascript
enableMathQuillFormulaAuthoring(quill, {
  operators: [["\\sqrt[n]{x}", "\\nthroot"], ["\\frac{x}{y}","\\frac"]]
});
```

The operators variable is an array of arrays. The outside array contains all of the different arrays which describe the operator buttons. The arrays inside of the main array consist of two values. The first value is the latex that gets rendered as the value on the button, and the second value is the latex that gets inserted into the MathQuill editor.

<img src="./demos/demo-custom-operator-buttons.gif" width="450" alt="Demo of mathquill4quill with custom operator buttons">

## Development setup

First, install the development dependencies:

```bash
npm install
```

You can now start the development server using `npm start` and verify code style compliance using `npm run lint`.
