<script setup>
import "./jquery";
// KaTeX dependency
import katex from "katex";
window.katex = katex;

import { QuillEditor, Quill } from "@vueup/vue-quill";

import "@edtr-io/mathquill/build/mathquill.js";
import "@edtr-io/mathquill/build/mathquill.css";

// mathquill4quill include
import mathquill4quill from "mathquill4quill";
import "mathquill4quill/mathquill4quill.css";

import { onMounted, ref } from "vue";

const operators = [
  ["\\pm", "\\pm"],
  ["\\sqrt{x}", "\\sqrt"],
  ["\\sqrt[3]{x}", "\\sqrt[3]{}"],
  ["\\sqrt[n]{x}", "\\nthroot"],
  ["\\frac{x}{y}", "\\frac"],
  ["\\sum^{s}_{x}{d}", "\\sum"],
  ["\\prod^{s}_{x}{d}", "\\prod"],
  ["\\coprod^{s}_{x}{d}", "\\coprod"],
  ["\\int^{s}_{x}{d}", "\\int"],
  ["\\binom{n}{k}", "\\binom"]
];

const quill = ref();
const content = ref("");

onMounted(() => {
  // For this line, refer to the following issue comment:
  // https://github.com/c-w/mathquill4quill/issues/97#issuecomment-1740482856
  quill.value.container = quill.value.getEditor();

  const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });

  enableMathQuillFormulaAuthoring(quill.value, {
    operators
  });
});
</script>

<template>
  <main class="demo-container">
    <QuillEditor
      id="quill-editor"
      v-model:content="content"
      theme="snow"
      placeholder="Type text here, or click on the formula button to enter math."
      ref="quill"
      :options="{
        modules: {
          formula: true,
          toolbar: [['bold', 'italic', 'underline'], ['formula']]
        }
      }"
    />

    <footer>
      <a href="https://github.com/c-w/mathquill4quill">
        <p>Fork me on Github</p>
        <img
          width="149"
          height="149"
          src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
          alt="Fork me on GitHub"
        />
      </a>
    </footer>
  </main>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #121621;
  text-align: center;
}

footer a {
  color: #fff;
  font-family: sans-serif;
}

footer p {
  margin: 0.5em;
}

footer img {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99999;
  display: none;
}

main {
  width: 100%;
  height: 200px;
}

@media (min-width: 500px) {
  main {
    max-width: 400px;
    margin: 50px auto;
  }

  footer p {
    display: none;
  }

  footer img {
    display: block;
  }
}

label {
  padding-top: 0.5em;
  display: block;
}
</style>
