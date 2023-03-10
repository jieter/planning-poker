function jsonScriptContents(id) {
    let element = document.getElementById(id);
    if (element) {
        return JSON.parse(element.textContent);
    }
    return undefined;
}
/* Encodes key/values from object to url escaped key=value pairs separated by &.
 * urlEncode({foo: 'bar', 'bar': 'baz'}) gives 'foo=bar&bar=baz'.
 * urlEncode({foo: ['bar', 'baz']}) gives 'foo=bar&foo=baz'
 */
function urlEncode(obj) {
    return obj
        ? Object.keys(obj)
              .map(function (key) {
                  if (typeof obj[key] === 'object') {
                      return obj[key]
                          .map(function (val) {
                              return encodeURIComponent(key) + '=' + encodeURIComponent(val);
                          })
                          .join('&');
                  } else {
                      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
                  }
              })
              .join('&')
        : '';
}

export { jsonScriptContents, urlEncode };
