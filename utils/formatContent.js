const sanitizeHtml = require('sanitize-html');

module.exports = function formatContent(content) {
  const escaped = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape',
  });
  return escaped.replace(/#[^\s#]+/g, (tag) => {
    const word = tag.slice(1);
    return `<a href="/hashtag?hashtag=${encodeURIComponent(word)}">${tag}</a>`;
  });
};
