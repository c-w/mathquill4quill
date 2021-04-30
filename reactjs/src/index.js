import React, { useState } from "react";
import ReactDOM from "react-dom";
import Editor from "./Editor";
import "./index.css";

const CUSTOM_OPERATORS = [
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

function Index() {
  const [operators, setOperators] = useState([]);
  const [displayHistory, setDisplayHistory] = useState(false);

  const toggleDisplayHistory = event => {
    setDisplayHistory(event.target.checked);
  };

  const toggleOperators = event => {
    setOperators(event.target.checked ? CUSTOM_OPERATORS : []);
  };

  const options = { displayHistory, operators };

  return (
    <main className="demo-container">
      <Editor options={options} key={JSON.stringify(options)} />

      <label>
        Use custom operator buttons:
        <input type="checkbox" className="option" onChange={toggleOperators} />
      </label>

      <label>
        Display formula history:
        <input
          type="checkbox"
          className="option"
          onChange={toggleDisplayHistory}
        />
      </label>

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
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("root")
);
