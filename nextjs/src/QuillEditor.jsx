import $ from "jquery";
import katex from "katex";
import React from "react";
import ReactQuill, { Quill } from "react-quill";

if (typeof window !== "undefined") {
  window.katex = katex;
  window.jQuery = window.$ = $;
  window.mathquill4quill = require("mathquill4quill");
  require("@edtr-io/mathquill/build/mathquill.js");
}

class QuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.reactQuill = React.createRef();
    this.attachQuillRefs = this.attachQuillRefs.bind(this);
    this.didAttachQuillRefs = false;
  }

  componentDidMount() {
    if (!this.didAttachQuillRefs) {
      this.attachQuillRefs();
      this.didAttachQuillRefs = true;
    }
  }

  attachQuillRefs() {
    const enableMathQuillFormulaAuthoring = window.mathquill4quill({ Quill, katex });
    enableMathQuillFormulaAuthoring(
      this.reactQuill.current.editor,
      this.props.options
    );
  }

  render() {
    return (
      <ReactQuill
        ref={this.reactQuill}
        modules={{
          formula: true,
          toolbar: [["video", "bold", "italic", "underline", "formula"]]
        }}
        theme={"snow"}
        placeholder={"Compose an epic ..."}
        bounds={".quill"}
      />
    );
  }
}

export default QuillEditor;
