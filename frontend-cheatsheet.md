
<h1> Frontend Cheatsheet</h1>

Things about frontend coding
---
## References
### W3C
- [CORS: Cross-site HTTP request](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

### Library Doc
- [**jQuery** Quick API Reference](http://oscarotero.com/jquery/)
- [**jQuery 的 Deferred 对象详解 by ruanyifeng](http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html)
---
## Responsive Web
### HTML5 Viewport
```html
<meta name="viewport" content="width=device-width,
    user-scalable=no, initial-scale=1.0,
    maximum-scale=1.0, minimum-scale=1.0" />
```
### CSS3 Media
```css
// print version
@media print {}
// screen and size
// comment: iphone 6p width 414px, iphone 6 375px
@media only screen and (max-width: 414px){}
@media only screen and (min-width: 421px)
    and (max-width: 800px){}
// orientation
@media only screen and (orientation: portrait){}
@media only screen and (orientation: landscape){}
```
---
## Flexbox
tools: [flexbox.less](https://github.com/ProLoser/Flexbox.less), [Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
### For the Parent
```css
display:flex;
justify-content: flex-start | flex-end | center |
    space-between | space-around;
align-items: flex-start | flex-end | center |
    baseline | stretch;
align-content: flex-start | flex-end | center |
    space-between | space-around | stretch;

flex-direction: row | row-reverse |
    column | column-reverse;
flex-wrap: nowrap | wrap | wrap-reverse;
flex-flow: <‘flex-direction’> || <‘flex-wrap’>
```
### For the Children
```css
order: <integer>;
flex-grow: <number>; /* default 0 */
flex-shrink: <number>; /* default 1 */
flex-basis: <length> | auto; /* default auto */
flex: none | [ <'flex-grow'> <'flex-shrink'>? ||
    <'flex-basis'> ]; /* short hand for above */
align-self: auto | flex-start | flex-end |
    center | baseline | stretch;
```
