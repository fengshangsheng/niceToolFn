!function(){"use strict";var t={16:function(t,e,o){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const a=n(o(974)),r=n(o(673)),i=o(272),s=o(230);e.default=class{constructor(t,e={}){this.content=t,this.propsOption=e,this.init()}init(){this.targetContentNode=this.verifyParameter(),this.setDomFlag(this.targetContentNode,"modal"),this.setDomFlag(s.Mask,"mask"),this.render(),setTimeout((()=>{this.playAnimate(!0)}))}verifyParameter(){if(void 0===this.targetContentNode){const t=document.createElement("div");return document.body.appendChild(t),t}return this.targetContentNode}setDomFlag(t,e){(0,i.isDomEle)(t)?t.setAttribute(`data-nicetoolfn-${e}`,Date.now()):t.attrs=[...t.attrs,{[`data-nicetoolfn-${e}`]:String(Date.now())}]}playAnimate(t,e){if(t){const t=Array.from(document.querySelectorAll("[data-nicetoolfn-mask]")).reverse();t[0].style.opacity="1",t[1]&&(t[1].style.opacity="0");const e=Array.from(document.querySelectorAll("[data-nicetoolfn-mask] + *")).reverse()[0];e.style.opacity="1",e.style.transform="translate(-50%, -50%) scale(1, 1)"}else{const t=Array.from(document.querySelectorAll("[data-nicetoolfn-mask]")).reverse();t[0].style.opacity="0",t[1]&&(t[1].style.opacity="1");const e=Array.from(document.querySelectorAll("[data-nicetoolfn-mask] + *")).reverse()[0];e.style.opacity="0",e.style.transform="translate(-50%, -50%) scale(1.1, 1.1)"}e&&e()}closeModal(){this.playAnimate(!1,(()=>setTimeout((()=>{const t=this.targetContentNode.getAttribute("data-nicetoolfn-modal"),e=document.querySelector(`[data-nicetoolfn-modal="${t}"]`);r.default.unmountComponentAtNode(this.targetContentNode),null!==e&&e.parentNode.removeChild(e)}),150)))}render(){const t=this.content;r.default.render(a.default.createElement(s.Component,null,a.default.createElement(s.Mask,null),"object"==typeof t&&t,"function"==typeof t&&a.default.createElement(t,Object.assign({},this.propsOption))),this.targetContentNode)}}},230:function(t,e,o){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.Mask=e.Component=void 0;const a=n(o(476)),r=a.default.div`
  width: 50%;

  & > [data-nicetoolfn-mask] {
  }

  & > [data-nicetoolfn-mask] + * {
    z-index: 999;
    position: fixed;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.15, 1.15);
    transition: transform 150ms, opacity 150ms;
  }
`;e.Component=r;const i=a.default.div`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 150ms;
`;e.Mask=i},629:function(t,e,o){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.Utils=e.Modal=void 0;const a=n(o(16));e.Modal=a.default;const r=n(o(272));e.Utils=r.default,e.default={Modal:a.default,Utils:r.default}},272:function(t,e){function o(t){return"object"==typeof HTMLElement?t instanceof HTMLElement:t&&"object"==typeof t&&1===t.nodeType&&"string"==typeof t.nodeName}Object.defineProperty(e,"__esModule",{value:!0}),e.isDomEle=void 0,e.isDomEle=o,e.default={isDomEle:o}},974:function(t){t.exports=require("react")},673:function(t){t.exports=require("react-dom")},476:function(t){t.exports=require("styled-components")}},e={},o=function o(n){var a=e[n];if(void 0!==a)return a.exports;var r=e[n]={exports:{}};return t[n].call(r.exports,r,r.exports,o),r.exports}(629);module.exports=o.default}();