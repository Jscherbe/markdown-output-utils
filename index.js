/**
 * Title case a String
 * @param {String} string string to convert to title case
 * @returns {String}
 */
export function titleCase(string) {
  return string.replace(/\w\S*/g, string => {
    // Only capitolize strings that aren't all uppercase
    return string.trim().match(/^[A-Z]+$/) ? 
      string : 
      capitolize(string);
  });
}
/**
 * Capitolize a string
 * @param {String} string String to capitolize
 * @returns {String}
 */
export function capitolize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
/**
 * Takes any number of markup arrays and filters out empty markup and joins with newline
 * @param  {...any} arrays
 * @returns {String}
 */
/**
 * 
 * @param  {...any} arrays 
 * @returns 
 */
export function joinMarkup(...arrays) {
  return "\n" + [].concat(...arrays).filter(i => i).join("\n");
}
/**
 * Outut Markdown Headline
 * @param {String} text Headline text
 * @param {Number} level Headline level (ie. 1 = <h1>)
 * @returns {String} Markdown
 */
export function headline(text, level) {
  return `${ "#".repeat(level) } ${ text }`; 
}
/**
 * 
 * @param {Array} array Array of list items
 * @param {Function} callback Optional function to call to print list item text, default outputs array item as is
 * @returns {String} Markdown
 */
export function list(array, callback = i => i) {
  return array.map(item => `- ${ callback(item) }`).join("\n");
}
/**
 * Output an object as a list (title/value)
 * @param {Object} items Object key will be title value will be plain text after title
 * @returns {String} Markdown
 */
export function titledList(items) {
  const entries = Object.entries(items).filter(([,value]) => value);
  return entries.map(([title, value]) => `- **${ title }:** ${ value }`).join("\n");
}
/**
 * Output markdown link
 * @param {String} text Link text
 * @param {String} src Link URL
 * @returns {String} Markdown
 */
export function link(title, src) {
  return`[${ title }](${ src })`;
}
/**
 * Output a table from array of objects
 * @param {Array} array Array (rows) of objects (keys are headers)
 * @param {Object} options Posssible options include keys (array of strings matched to objects, default is all keys in objects in the order they occur, with 'name' and 'type' displaying first), formatHeader (function, default title case), formatCell (function, defualt output as is)
 * @returns {String} Markdown
 */
export function table(array, options) {
  if (!array || !array.length) return;
  const opts = Object.assign({}, {
    keys: null,
    formatHeader: titleCase,
    formatCell: (key, data) => data?.toString()
  }, options);
  const joinRow = cols => `|${ cols.join("|") }|`;
  const keys = opts.keys || propertyTableKeys(array);
  const $header = [ joinRow(keys.map(opts.formatHeader)) ];
  const $divider = [ joinRow(keys.map(() => ":--")) ];
  const $rows = array.map(obj => 
    joinRow(keys.map(key => opts.formatCell(key, obj[key])))
  );
  return joinMarkup($header, $divider, $rows);
}
function propertyTableKeys(array) {
  const set = new Set();
  array.forEach(o => Object.keys(o).forEach(k => set.add(k)));
  const keys = Array.from(set);
  const toFront = text => {
    const index = keys.findIndex(i => i === text);
    if (index !== -1) {
      keys.splice(index, 1);
      keys.unshift(text);
    } 
  }
  toFront("type");
  toFront("name");
  return keys;
}
/**
 * Ouptut inline code
 * @param {String} markup Code to output
 * @returns {String} Markdown
 */
export function code(markup) {
  return `\`${ markup }\``;
}
/**
 * Output code block
 * @param {String} markup Code to output
 * @param {String} type Type of code (ie. js, scss, ...)
 * @returns {String} Markdown
 */
export function codeBlock(markup, type) {
  return `
\`\`\` ${ type }
${ markup }
\`\`\`
  `;
}