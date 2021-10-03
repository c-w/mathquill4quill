import $ from "jquery";
import katex from "katex";
import React from "react";
import ReactQuill, { Quill } from "react-quill";

if (typeof window !== "undefined") {
  window.katex = katex;
  window.jQuery = window.$ = $;
  const mathquill4quill = require("mathquill4quill");
  require("mathquill/build/mathquill.js");
}

class QuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.reactQuill = React.createRef();
    this.attachQuillRefs = this.attachQuillRefs.bind(this);
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  attachQuillRefs() {
    const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });
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
