<script setup>
import './jquery'
// KaTeX dependency
import katex from 'katex';
window.katex = katex;

import { QuillEditor, Quill } from '@vueup/vue-quill';


import '@edtr-io/mathquill/build/mathquill.js';
import '@edtr-io/mathquill/build/mathquill.css';

// mathquill4quill include
import mathquill4quill from 'mathquill4quill';
import 'mathquill4quill/mathquill4quill.css';

import { onMounted, ref } from 'vue';

const operators = [
  ['\\pm', '\\pm'],
  ['\\sqrt{x}', '\\sqrt'],
  ['\\sqrt[3]{x}', '\\sqrt[3]{}'],
  ['\\sqrt[n]{x}', '\\nthroot'],
  ['\\frac{x}{y}', '\\frac'],
  ['\\sum^{s}_{x}{d}', '\\sum'],
  ['\\prod^{s}_{x}{d}', '\\prod'],
  ['\\coprod^{s}_{x}{d}', '\\coprod'],
  ['\\int^{s}_{x}{d}', '\\int'],
  ['\\binom{n}{k}', '\\binom'],
];

const quill = ref();
const content = ref('');

onMounted(() => {

  // For this line, refer to the following issue comment:
  // https://github.com/c-w/mathquill4quill/issues/97#issuecomment-1740482856
  quill.value.container = quill.value.getEditor();

  const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });

  enableMathQuillFormulaAuthoring(quill.value, {
    operators,
  });
});

const textChange = (prop) => {
  console.log('textChange', content.value);
};
</script>

<template>
   <div class="wrapper">
    <QuillEditor
      id="quill-editor"
      v-model:content="content"
      theme="snow"
      placeholder="Type text here, or click on the formula button to enter math."
      ref="quill"
      :options="{
        modules: {
          formula: true,
          toolbar: [['bold', 'italic', 'underline'], ['formula']],
        },
      }"
      @editorChange="textChange"
    />
  </div>
</template>

<style scoped>
.wrapper {
  width: 80%;
  margin: 50px auto;
  height: 100%;
}
</style>