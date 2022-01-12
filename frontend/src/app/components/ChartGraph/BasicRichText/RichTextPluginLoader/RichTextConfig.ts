export const Formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'color',
  'tag',
  'calcfield',
  'mention',
  'image',
  'size',
  'background',
  'font',
  'align',
  'code-block',
];

export const MarkdownOptions = {
  ignoreTags: ['pre', 'strikethrough'], // @option - if you need to ignore some tags.
  tags: {
    blockquote: {
      pattern: /^(\|){1,6}\s/g,
    },
    bold: {
      pattern: /^(\|){1,6}\s/g,
    },
    italic: {
      pattern: /(\_){1}(.+?)(?:\1){1}/g,
    },
  },
};
