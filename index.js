/* eslint-env browser */

(function($, Quill) {
  $(document).ready(() => {
    const quillOptions = {
      modules: {
        formula: true,
        toolbar: [["video", "bold", "italic", "underline", "formula"]]
      },
      placeholder:
        "Type text here, or click on the formula button to enter math.",
      theme: "snow"
    };

    const options = {};

    $("input[type='checkbox'].option").each((_, option) => {
      const $option = $(option);
      const name = $option.attr("data-name");
      const isOptionEnabled =
        window.location.href.indexOf(`&${name}=true`) !== -1;

      if (isOptionEnabled) {
        $option.prop("checked", true);
        options[name] = JSON.parse($option.attr("data-value"));
      }

      $option.change(event => {
        let url = window.location.href;
        const checked = event.target.checked;

        if (url.indexOf("?") === -1) {
          url += "?";
        }

        url = url.replace(`&${name}=${!checked}`, "");
        url += `&${name}=${checked}`;

        window.location.href = url;
      });
    });

    const enableMathQuillFormulaAuthoring = window.mathquill4quill();
    const quill = new Quill("#editor", quillOptions);
    enableMathQuillFormulaAuthoring(quill, options);
  });
})(window.jQuery, window.Quill);
