# MathQuill 4 Quill #

## What's this? ##

This module adds support for rich math authoring to the
[Quill](http://quilljs.com/) editor. [Live demo](https://c-w.github.io/mathquill4quill/)

## Usage example ##

This module depends on
[MathQuill](http://docs.mathquill.com/en/latest/Getting_Started/),
[Quill](https://quilljs.com/docs/quickstart/) and
[KaTeX](https://github.com/Khan/KaTeX#usage),
so you'll need to add references to their JS and CSS files in addition to
adding a reference to [mathquill4quill.js](https://github.com/c-w/mathquill4quill/blob/master/mathquill4quill.js).

Next, initialize your Quill object and load the formula module:

```js
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

```js
// enable mathquill formula editor

quill.enableMathQuillFormulaAuthoring();
```

