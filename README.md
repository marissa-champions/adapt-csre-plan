# CSRE Plan

This is a custom plugin for the [Adapt Learning](https://www.adaptlearning.org/) framework, developed and maintained by Champions School of Real Estate.

## About

The `adapt-csre-plan` plugin was originally based on the now-unavailable Walkgrove `actionplan` plugin. Over time, it has been significantly customized and extended to meet the specific needs of Champions School of Real Estate.

Because of these changes, this version is not intended as a drop-in replacement for the original `actionplan` plugin.

### Attributes

[**Core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be `csre-plan`.

**_items** (array): An array of questions, prompts, or labels. Each entry is used as a heading above a user-input text box. These labels also appear as titles or headings in the generated PDF based on user input.

**footerText** (string): Text displayed at the **footer** of the exported PDF. 

**pdf.image** (string): A file path (relative to the course) for an image that will be used as a **header** image in the generated PDF.

**title** (string): Title displayed at the top of the PDF page. Can be used to introduce the document or the collection of responses.

**subtitle** (string): Subtitle displayed below the main title in the PDF. Useful for providing additional context.

**contentTitle** (string): Optional section title that can be displayed within the PDF layout, typically above the user input areas.

---
