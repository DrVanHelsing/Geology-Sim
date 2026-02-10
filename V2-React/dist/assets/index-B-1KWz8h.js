(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();var yR=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function lg(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var cg={exports:{}},Ic={},ug={exports:{}},nt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ia=Symbol.for("react.element"),b_=Symbol.for("react.portal"),R_=Symbol.for("react.fragment"),P_=Symbol.for("react.strict_mode"),L_=Symbol.for("react.profiler"),D_=Symbol.for("react.provider"),N_=Symbol.for("react.context"),I_=Symbol.for("react.forward_ref"),U_=Symbol.for("react.suspense"),F_=Symbol.for("react.memo"),k_=Symbol.for("react.lazy"),$d=Symbol.iterator;function z_(n){return n===null||typeof n!="object"?null:(n=$d&&n[$d]||n["@@iterator"],typeof n=="function"?n:null)}var fg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},hg=Object.assign,dg={};function So(n,e,t){this.props=n,this.context=e,this.refs=dg,this.updater=t||fg}So.prototype.isReactComponent={};So.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};So.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function pg(){}pg.prototype=So.prototype;function Ih(n,e,t){this.props=n,this.context=e,this.refs=dg,this.updater=t||fg}var Uh=Ih.prototype=new pg;Uh.constructor=Ih;hg(Uh,So.prototype);Uh.isPureReactComponent=!0;var Kd=Array.isArray,mg=Object.prototype.hasOwnProperty,Fh={current:null},gg={key:!0,ref:!0,__self:!0,__source:!0};function vg(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)mg.call(e,i)&&!gg.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Ia,type:n,key:s,ref:o,props:r,_owner:Fh.current}}function O_(n,e){return{$$typeof:Ia,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function kh(n){return typeof n=="object"&&n!==null&&n.$$typeof===Ia}function B_(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var Zd=/\/+/g;function au(n,e){return typeof n=="object"&&n!==null&&n.key!=null?B_(""+n.key):e.toString(36)}function zl(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case Ia:case b_:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+au(o,0):i,Kd(r)?(t="",n!=null&&(t=n.replace(Zd,"$&/")+"/"),zl(r,e,t,"",function(c){return c})):r!=null&&(kh(r)&&(r=O_(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Zd,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Kd(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+au(s,a);o+=zl(s,e,t,l,r)}else if(l=z_(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+au(s,a++),o+=zl(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Va(n,e,t){if(n==null)return n;var i=[],r=0;return zl(n,i,"","",function(s){return e.call(t,s,r++)}),i}function G_(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var wn={current:null},Ol={transition:null},V_={ReactCurrentDispatcher:wn,ReactCurrentBatchConfig:Ol,ReactCurrentOwner:Fh};function xg(){throw Error("act(...) is not supported in production builds of React.")}nt.Children={map:Va,forEach:function(n,e,t){Va(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return Va(n,function(){e++}),e},toArray:function(n){return Va(n,function(e){return e})||[]},only:function(n){if(!kh(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};nt.Component=So;nt.Fragment=R_;nt.Profiler=L_;nt.PureComponent=Ih;nt.StrictMode=P_;nt.Suspense=U_;nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=V_;nt.act=xg;nt.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=hg({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Fh.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)mg.call(e,l)&&!gg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:Ia,type:n.type,key:r,ref:s,props:i,_owner:o}};nt.createContext=function(n){return n={$$typeof:N_,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:D_,_context:n},n.Consumer=n};nt.createElement=vg;nt.createFactory=function(n){var e=vg.bind(null,n);return e.type=n,e};nt.createRef=function(){return{current:null}};nt.forwardRef=function(n){return{$$typeof:I_,render:n}};nt.isValidElement=kh;nt.lazy=function(n){return{$$typeof:k_,_payload:{_status:-1,_result:n},_init:G_}};nt.memo=function(n,e){return{$$typeof:F_,type:n,compare:e===void 0?null:e}};nt.startTransition=function(n){var e=Ol.transition;Ol.transition={};try{n()}finally{Ol.transition=e}};nt.unstable_act=xg;nt.useCallback=function(n,e){return wn.current.useCallback(n,e)};nt.useContext=function(n){return wn.current.useContext(n)};nt.useDebugValue=function(){};nt.useDeferredValue=function(n){return wn.current.useDeferredValue(n)};nt.useEffect=function(n,e){return wn.current.useEffect(n,e)};nt.useId=function(){return wn.current.useId()};nt.useImperativeHandle=function(n,e,t){return wn.current.useImperativeHandle(n,e,t)};nt.useInsertionEffect=function(n,e){return wn.current.useInsertionEffect(n,e)};nt.useLayoutEffect=function(n,e){return wn.current.useLayoutEffect(n,e)};nt.useMemo=function(n,e){return wn.current.useMemo(n,e)};nt.useReducer=function(n,e,t){return wn.current.useReducer(n,e,t)};nt.useRef=function(n){return wn.current.useRef(n)};nt.useState=function(n){return wn.current.useState(n)};nt.useSyncExternalStore=function(n,e,t){return wn.current.useSyncExternalStore(n,e,t)};nt.useTransition=function(){return wn.current.useTransition()};nt.version="18.3.1";ug.exports=nt;var at=ug.exports;const H_=lg(at);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W_=at,j_=Symbol.for("react.element"),X_=Symbol.for("react.fragment"),Y_=Object.prototype.hasOwnProperty,q_=W_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,$_={key:!0,ref:!0,__self:!0,__source:!0};function _g(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Y_.call(e,i)&&!$_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:j_,type:n,key:s,ref:o,props:r,_owner:q_.current}}Ic.Fragment=X_;Ic.jsx=_g;Ic.jsxs=_g;cg.exports=Ic;var C=cg.exports,Ef={},yg={exports:{}},Xn={},Mg={exports:{}},Sg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(k,z){var B=k.length;k.push(z);e:for(;0<B;){var $=B-1>>>1,se=k[$];if(0<r(se,z))k[$]=z,k[B]=se,B=$;else break e}}function t(k){return k.length===0?null:k[0]}function i(k){if(k.length===0)return null;var z=k[0],B=k.pop();if(B!==z){k[0]=B;e:for(var $=0,se=k.length,Ce=se>>>1;$<Ce;){var G=2*($+1)-1,oe=k[G],ue=G+1,_e=k[ue];if(0>r(oe,B))ue<se&&0>r(_e,oe)?(k[$]=_e,k[ue]=B,$=ue):(k[$]=oe,k[G]=B,$=G);else if(ue<se&&0>r(_e,B))k[$]=_e,k[ue]=B,$=ue;else break e}}return z}function r(k,z){var B=k.sortIndex-z.sortIndex;return B!==0?B:k.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],c=[],u=1,f=null,h=3,p=!1,v=!1,_=!1,m=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,x=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(k){for(var z=t(c);z!==null;){if(z.callback===null)i(c);else if(z.startTime<=k)i(c),z.sortIndex=z.expirationTime,e(l,z);else break;z=t(c)}}function M(k){if(_=!1,g(k),!v)if(t(l)!==null)v=!0,H(T);else{var z=t(c);z!==null&&Q(M,z.startTime-k)}}function T(k,z){v=!1,_&&(_=!1,d(b),b=-1),p=!0;var B=h;try{for(g(z),f=t(l);f!==null&&(!(f.expirationTime>z)||k&&!A());){var $=f.callback;if(typeof $=="function"){f.callback=null,h=f.priorityLevel;var se=$(f.expirationTime<=z);z=n.unstable_now(),typeof se=="function"?f.callback=se:f===t(l)&&i(l),g(z)}else i(l);f=t(l)}if(f!==null)var Ce=!0;else{var G=t(c);G!==null&&Q(M,G.startTime-z),Ce=!1}return Ce}finally{f=null,h=B,p=!1}}var E=!1,S=null,b=-1,D=5,y=-1;function A(){return!(n.unstable_now()-y<D)}function j(){if(S!==null){var k=n.unstable_now();y=k;var z=!0;try{z=S(!0,k)}finally{z?J():(E=!1,S=null)}}else E=!1}var J;if(typeof x=="function")J=function(){x(j)};else if(typeof MessageChannel<"u"){var I=new MessageChannel,X=I.port2;I.port1.onmessage=j,J=function(){X.postMessage(null)}}else J=function(){m(j,0)};function H(k){S=k,E||(E=!0,J())}function Q(k,z){b=m(function(){k(n.unstable_now())},z)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(k){k.callback=null},n.unstable_continueExecution=function(){v||p||(v=!0,H(T))},n.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<k?Math.floor(1e3/k):5},n.unstable_getCurrentPriorityLevel=function(){return h},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(k){switch(h){case 1:case 2:case 3:var z=3;break;default:z=h}var B=h;h=z;try{return k()}finally{h=B}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(k,z){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var B=h;h=k;try{return z()}finally{h=B}},n.unstable_scheduleCallback=function(k,z,B){var $=n.unstable_now();switch(typeof B=="object"&&B!==null?(B=B.delay,B=typeof B=="number"&&0<B?$+B:$):B=$,k){case 1:var se=-1;break;case 2:se=250;break;case 5:se=1073741823;break;case 4:se=1e4;break;default:se=5e3}return se=B+se,k={id:u++,callback:z,priorityLevel:k,startTime:B,expirationTime:se,sortIndex:-1},B>$?(k.sortIndex=B,e(c,k),t(l)===null&&k===t(c)&&(_?(d(b),b=-1):_=!0,Q(M,B-$))):(k.sortIndex=se,e(l,k),v||p||(v=!0,H(T))),k},n.unstable_shouldYield=A,n.unstable_wrapCallback=function(k){var z=h;return function(){var B=h;h=z;try{return k.apply(this,arguments)}finally{h=B}}}})(Sg);Mg.exports=Sg;var K_=Mg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Z_=at,jn=K_;function de(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var wg=new Set,ha={};function us(n,e){lo(n,e),lo(n+"Capture",e)}function lo(n,e){for(ha[n]=e,n=0;n<e.length;n++)wg.add(e[n])}var qi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Tf=Object.prototype.hasOwnProperty,J_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Jd={},Qd={};function Q_(n){return Tf.call(Qd,n)?!0:Tf.call(Jd,n)?!1:J_.test(n)?Qd[n]=!0:(Jd[n]=!0,!1)}function ey(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function ty(n,e,t,i){if(e===null||typeof e>"u"||ey(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function En(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var sn={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){sn[n]=new En(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];sn[e]=new En(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){sn[n]=new En(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){sn[n]=new En(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){sn[n]=new En(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){sn[n]=new En(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){sn[n]=new En(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){sn[n]=new En(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){sn[n]=new En(n,5,!1,n.toLowerCase(),null,!1,!1)});var zh=/[\-:]([a-z])/g;function Oh(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(zh,Oh);sn[e]=new En(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(zh,Oh);sn[e]=new En(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(zh,Oh);sn[e]=new En(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){sn[n]=new En(n,1,!1,n.toLowerCase(),null,!1,!1)});sn.xlinkHref=new En("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){sn[n]=new En(n,1,!1,n.toLowerCase(),null,!0,!0)});function Bh(n,e,t,i){var r=sn.hasOwnProperty(e)?sn[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(ty(e,t,r,i)&&(t=null),i||r===null?Q_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Ji=Z_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ha=Symbol.for("react.element"),zs=Symbol.for("react.portal"),Os=Symbol.for("react.fragment"),Gh=Symbol.for("react.strict_mode"),Af=Symbol.for("react.profiler"),Eg=Symbol.for("react.provider"),Tg=Symbol.for("react.context"),Vh=Symbol.for("react.forward_ref"),Cf=Symbol.for("react.suspense"),bf=Symbol.for("react.suspense_list"),Hh=Symbol.for("react.memo"),or=Symbol.for("react.lazy"),Ag=Symbol.for("react.offscreen"),ep=Symbol.iterator;function Ro(n){return n===null||typeof n!="object"?null:(n=ep&&n[ep]||n["@@iterator"],typeof n=="function"?n:null)}var Lt=Object.assign,lu;function qo(n){if(lu===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);lu=e&&e[1]||""}return`
`+lu+n}var cu=!1;function uu(n,e){if(!n||cu)return"";cu=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{cu=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?qo(n):""}function ny(n){switch(n.tag){case 5:return qo(n.type);case 16:return qo("Lazy");case 13:return qo("Suspense");case 19:return qo("SuspenseList");case 0:case 2:case 15:return n=uu(n.type,!1),n;case 11:return n=uu(n.type.render,!1),n;case 1:return n=uu(n.type,!0),n;default:return""}}function Rf(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case Os:return"Fragment";case zs:return"Portal";case Af:return"Profiler";case Gh:return"StrictMode";case Cf:return"Suspense";case bf:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case Tg:return(n.displayName||"Context")+".Consumer";case Eg:return(n._context.displayName||"Context")+".Provider";case Vh:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Hh:return e=n.displayName||null,e!==null?e:Rf(n.type)||"Memo";case or:e=n._payload,n=n._init;try{return Rf(n(e))}catch{}}return null}function iy(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Rf(e);case 8:return e===Gh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Ar(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Cg(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function ry(n){var e=Cg(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function Wa(n){n._valueTracker||(n._valueTracker=ry(n))}function bg(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=Cg(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function ec(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Pf(n,e){var t=e.checked;return Lt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function tp(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=Ar(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Rg(n,e){e=e.checked,e!=null&&Bh(n,"checked",e,!1)}function Lf(n,e){Rg(n,e);var t=Ar(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Df(n,e.type,t):e.hasOwnProperty("defaultValue")&&Df(n,e.type,Ar(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function np(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Df(n,e,t){(e!=="number"||ec(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var $o=Array.isArray;function Qs(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+Ar(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function Nf(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(de(91));return Lt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function ip(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(de(92));if($o(t)){if(1<t.length)throw Error(de(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:Ar(t)}}function Pg(n,e){var t=Ar(e.value),i=Ar(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function rp(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function Lg(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function If(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?Lg(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var ja,Dg=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(ja=ja||document.createElement("div"),ja.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ja.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function da(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var Qo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},sy=["Webkit","ms","Moz","O"];Object.keys(Qo).forEach(function(n){sy.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),Qo[e]=Qo[n]})});function Ng(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||Qo.hasOwnProperty(n)&&Qo[n]?(""+e).trim():e+"px"}function Ig(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=Ng(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var oy=Lt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Uf(n,e){if(e){if(oy[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(de(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(de(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(de(61))}if(e.style!=null&&typeof e.style!="object")throw Error(de(62))}}function Ff(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var kf=null;function Wh(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var zf=null,eo=null,to=null;function sp(n){if(n=ka(n)){if(typeof zf!="function")throw Error(de(280));var e=n.stateNode;e&&(e=Oc(e),zf(n.stateNode,n.type,e))}}function Ug(n){eo?to?to.push(n):to=[n]:eo=n}function Fg(){if(eo){var n=eo,e=to;if(to=eo=null,sp(n),e)for(n=0;n<e.length;n++)sp(e[n])}}function kg(n,e){return n(e)}function zg(){}var fu=!1;function Og(n,e,t){if(fu)return n(e,t);fu=!0;try{return kg(n,e,t)}finally{fu=!1,(eo!==null||to!==null)&&(zg(),Fg())}}function pa(n,e){var t=n.stateNode;if(t===null)return null;var i=Oc(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(de(231,e,typeof t));return t}var Of=!1;if(qi)try{var Po={};Object.defineProperty(Po,"passive",{get:function(){Of=!0}}),window.addEventListener("test",Po,Po),window.removeEventListener("test",Po,Po)}catch{Of=!1}function ay(n,e,t,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(u){this.onError(u)}}var ea=!1,tc=null,nc=!1,Bf=null,ly={onError:function(n){ea=!0,tc=n}};function cy(n,e,t,i,r,s,o,a,l){ea=!1,tc=null,ay.apply(ly,arguments)}function uy(n,e,t,i,r,s,o,a,l){if(cy.apply(this,arguments),ea){if(ea){var c=tc;ea=!1,tc=null}else throw Error(de(198));nc||(nc=!0,Bf=c)}}function fs(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function Bg(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function op(n){if(fs(n)!==n)throw Error(de(188))}function fy(n){var e=n.alternate;if(!e){if(e=fs(n),e===null)throw Error(de(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return op(r),n;if(s===i)return op(r),e;s=s.sibling}throw Error(de(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(de(189))}}if(t.alternate!==i)throw Error(de(190))}if(t.tag!==3)throw Error(de(188));return t.stateNode.current===t?n:e}function Gg(n){return n=fy(n),n!==null?Vg(n):null}function Vg(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=Vg(n);if(e!==null)return e;n=n.sibling}return null}var Hg=jn.unstable_scheduleCallback,ap=jn.unstable_cancelCallback,hy=jn.unstable_shouldYield,dy=jn.unstable_requestPaint,Ft=jn.unstable_now,py=jn.unstable_getCurrentPriorityLevel,jh=jn.unstable_ImmediatePriority,Wg=jn.unstable_UserBlockingPriority,ic=jn.unstable_NormalPriority,my=jn.unstable_LowPriority,jg=jn.unstable_IdlePriority,Uc=null,Ai=null;function gy(n){if(Ai&&typeof Ai.onCommitFiberRoot=="function")try{Ai.onCommitFiberRoot(Uc,n,void 0,(n.current.flags&128)===128)}catch{}}var gi=Math.clz32?Math.clz32:_y,vy=Math.log,xy=Math.LN2;function _y(n){return n>>>=0,n===0?32:31-(vy(n)/xy|0)|0}var Xa=64,Ya=4194304;function Ko(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function rc(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=Ko(a):(s&=o,s!==0&&(i=Ko(s)))}else o=t&~r,o!==0?i=Ko(o):s!==0&&(i=Ko(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-gi(e),r=1<<t,i|=n[t],e&=~r;return i}function yy(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function My(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-gi(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=yy(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function Gf(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Xg(){var n=Xa;return Xa<<=1,!(Xa&4194240)&&(Xa=64),n}function hu(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function Ua(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-gi(e),n[e]=t}function Sy(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-gi(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function Xh(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-gi(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var ut=0;function Yg(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var qg,Yh,$g,Kg,Zg,Vf=!1,qa=[],gr=null,vr=null,xr=null,ma=new Map,ga=new Map,ur=[],wy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function lp(n,e){switch(n){case"focusin":case"focusout":gr=null;break;case"dragenter":case"dragleave":vr=null;break;case"mouseover":case"mouseout":xr=null;break;case"pointerover":case"pointerout":ma.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ga.delete(e.pointerId)}}function Lo(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=ka(e),e!==null&&Yh(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function Ey(n,e,t,i,r){switch(e){case"focusin":return gr=Lo(gr,n,e,t,i,r),!0;case"dragenter":return vr=Lo(vr,n,e,t,i,r),!0;case"mouseover":return xr=Lo(xr,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return ma.set(s,Lo(ma.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,ga.set(s,Lo(ga.get(s)||null,n,e,t,i,r)),!0}return!1}function Jg(n){var e=Kr(n.target);if(e!==null){var t=fs(e);if(t!==null){if(e=t.tag,e===13){if(e=Bg(t),e!==null){n.blockedOn=e,Zg(n.priority,function(){$g(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Bl(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Hf(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);kf=i,t.target.dispatchEvent(i),kf=null}else return e=ka(t),e!==null&&Yh(e),n.blockedOn=t,!1;e.shift()}return!0}function cp(n,e,t){Bl(n)&&t.delete(e)}function Ty(){Vf=!1,gr!==null&&Bl(gr)&&(gr=null),vr!==null&&Bl(vr)&&(vr=null),xr!==null&&Bl(xr)&&(xr=null),ma.forEach(cp),ga.forEach(cp)}function Do(n,e){n.blockedOn===e&&(n.blockedOn=null,Vf||(Vf=!0,jn.unstable_scheduleCallback(jn.unstable_NormalPriority,Ty)))}function va(n){function e(r){return Do(r,n)}if(0<qa.length){Do(qa[0],n);for(var t=1;t<qa.length;t++){var i=qa[t];i.blockedOn===n&&(i.blockedOn=null)}}for(gr!==null&&Do(gr,n),vr!==null&&Do(vr,n),xr!==null&&Do(xr,n),ma.forEach(e),ga.forEach(e),t=0;t<ur.length;t++)i=ur[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<ur.length&&(t=ur[0],t.blockedOn===null);)Jg(t),t.blockedOn===null&&ur.shift()}var no=Ji.ReactCurrentBatchConfig,sc=!0;function Ay(n,e,t,i){var r=ut,s=no.transition;no.transition=null;try{ut=1,qh(n,e,t,i)}finally{ut=r,no.transition=s}}function Cy(n,e,t,i){var r=ut,s=no.transition;no.transition=null;try{ut=4,qh(n,e,t,i)}finally{ut=r,no.transition=s}}function qh(n,e,t,i){if(sc){var r=Hf(n,e,t,i);if(r===null)Su(n,e,i,oc,t),lp(n,i);else if(Ey(r,n,e,t,i))i.stopPropagation();else if(lp(n,i),e&4&&-1<wy.indexOf(n)){for(;r!==null;){var s=ka(r);if(s!==null&&qg(s),s=Hf(n,e,t,i),s===null&&Su(n,e,i,oc,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else Su(n,e,i,null,t)}}var oc=null;function Hf(n,e,t,i){if(oc=null,n=Wh(i),n=Kr(n),n!==null)if(e=fs(n),e===null)n=null;else if(t=e.tag,t===13){if(n=Bg(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return oc=n,null}function Qg(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(py()){case jh:return 1;case Wg:return 4;case ic:case my:return 16;case jg:return 536870912;default:return 16}default:return 16}}var dr=null,$h=null,Gl=null;function ev(){if(Gl)return Gl;var n,e=$h,t=e.length,i,r="value"in dr?dr.value:dr.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return Gl=r.slice(n,1<i?1-i:void 0)}function Vl(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function $a(){return!0}function up(){return!1}function Yn(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?$a:up,this.isPropagationStopped=up,this}return Lt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=$a)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=$a)},persist:function(){},isPersistent:$a}),e}var wo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Kh=Yn(wo),Fa=Lt({},wo,{view:0,detail:0}),by=Yn(Fa),du,pu,No,Fc=Lt({},Fa,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Zh,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==No&&(No&&n.type==="mousemove"?(du=n.screenX-No.screenX,pu=n.screenY-No.screenY):pu=du=0,No=n),du)},movementY:function(n){return"movementY"in n?n.movementY:pu}}),fp=Yn(Fc),Ry=Lt({},Fc,{dataTransfer:0}),Py=Yn(Ry),Ly=Lt({},Fa,{relatedTarget:0}),mu=Yn(Ly),Dy=Lt({},wo,{animationName:0,elapsedTime:0,pseudoElement:0}),Ny=Yn(Dy),Iy=Lt({},wo,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Uy=Yn(Iy),Fy=Lt({},wo,{data:0}),hp=Yn(Fy),ky={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},zy={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Oy={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function By(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=Oy[n])?!!e[n]:!1}function Zh(){return By}var Gy=Lt({},Fa,{key:function(n){if(n.key){var e=ky[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=Vl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?zy[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Zh,charCode:function(n){return n.type==="keypress"?Vl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Vl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Vy=Yn(Gy),Hy=Lt({},Fc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),dp=Yn(Hy),Wy=Lt({},Fa,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Zh}),jy=Yn(Wy),Xy=Lt({},wo,{propertyName:0,elapsedTime:0,pseudoElement:0}),Yy=Yn(Xy),qy=Lt({},Fc,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),$y=Yn(qy),Ky=[9,13,27,32],Jh=qi&&"CompositionEvent"in window,ta=null;qi&&"documentMode"in document&&(ta=document.documentMode);var Zy=qi&&"TextEvent"in window&&!ta,tv=qi&&(!Jh||ta&&8<ta&&11>=ta),pp=" ",mp=!1;function nv(n,e){switch(n){case"keyup":return Ky.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function iv(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var Bs=!1;function Jy(n,e){switch(n){case"compositionend":return iv(e);case"keypress":return e.which!==32?null:(mp=!0,pp);case"textInput":return n=e.data,n===pp&&mp?null:n;default:return null}}function Qy(n,e){if(Bs)return n==="compositionend"||!Jh&&nv(n,e)?(n=ev(),Gl=$h=dr=null,Bs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return tv&&e.locale!=="ko"?null:e.data;default:return null}}var eM={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function gp(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!eM[n.type]:e==="textarea"}function rv(n,e,t,i){Ug(i),e=ac(e,"onChange"),0<e.length&&(t=new Kh("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var na=null,xa=null;function tM(n){mv(n,0)}function kc(n){var e=Hs(n);if(bg(e))return n}function nM(n,e){if(n==="change")return e}var sv=!1;if(qi){var gu;if(qi){var vu="oninput"in document;if(!vu){var vp=document.createElement("div");vp.setAttribute("oninput","return;"),vu=typeof vp.oninput=="function"}gu=vu}else gu=!1;sv=gu&&(!document.documentMode||9<document.documentMode)}function xp(){na&&(na.detachEvent("onpropertychange",ov),xa=na=null)}function ov(n){if(n.propertyName==="value"&&kc(xa)){var e=[];rv(e,xa,n,Wh(n)),Og(tM,e)}}function iM(n,e,t){n==="focusin"?(xp(),na=e,xa=t,na.attachEvent("onpropertychange",ov)):n==="focusout"&&xp()}function rM(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return kc(xa)}function sM(n,e){if(n==="click")return kc(e)}function oM(n,e){if(n==="input"||n==="change")return kc(e)}function aM(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var xi=typeof Object.is=="function"?Object.is:aM;function _a(n,e){if(xi(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!Tf.call(e,r)||!xi(n[r],e[r]))return!1}return!0}function _p(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function yp(n,e){var t=_p(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=_p(t)}}function av(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?av(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function lv(){for(var n=window,e=ec();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=ec(n.document)}return e}function Qh(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function lM(n){var e=lv(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&av(t.ownerDocument.documentElement,t)){if(i!==null&&Qh(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=yp(t,s);var o=yp(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var cM=qi&&"documentMode"in document&&11>=document.documentMode,Gs=null,Wf=null,ia=null,jf=!1;function Mp(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;jf||Gs==null||Gs!==ec(i)||(i=Gs,"selectionStart"in i&&Qh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ia&&_a(ia,i)||(ia=i,i=ac(Wf,"onSelect"),0<i.length&&(e=new Kh("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=Gs)))}function Ka(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var Vs={animationend:Ka("Animation","AnimationEnd"),animationiteration:Ka("Animation","AnimationIteration"),animationstart:Ka("Animation","AnimationStart"),transitionend:Ka("Transition","TransitionEnd")},xu={},cv={};qi&&(cv=document.createElement("div").style,"AnimationEvent"in window||(delete Vs.animationend.animation,delete Vs.animationiteration.animation,delete Vs.animationstart.animation),"TransitionEvent"in window||delete Vs.transitionend.transition);function zc(n){if(xu[n])return xu[n];if(!Vs[n])return n;var e=Vs[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in cv)return xu[n]=e[t];return n}var uv=zc("animationend"),fv=zc("animationiteration"),hv=zc("animationstart"),dv=zc("transitionend"),pv=new Map,Sp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Lr(n,e){pv.set(n,e),us(e,[n])}for(var _u=0;_u<Sp.length;_u++){var yu=Sp[_u],uM=yu.toLowerCase(),fM=yu[0].toUpperCase()+yu.slice(1);Lr(uM,"on"+fM)}Lr(uv,"onAnimationEnd");Lr(fv,"onAnimationIteration");Lr(hv,"onAnimationStart");Lr("dblclick","onDoubleClick");Lr("focusin","onFocus");Lr("focusout","onBlur");Lr(dv,"onTransitionEnd");lo("onMouseEnter",["mouseout","mouseover"]);lo("onMouseLeave",["mouseout","mouseover"]);lo("onPointerEnter",["pointerout","pointerover"]);lo("onPointerLeave",["pointerout","pointerover"]);us("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));us("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));us("onBeforeInput",["compositionend","keypress","textInput","paste"]);us("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));us("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));us("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),hM=new Set("cancel close invalid load scroll toggle".split(" ").concat(Zo));function wp(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,uy(i,e,void 0,n),n.currentTarget=null}function mv(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;wp(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;wp(r,a,c),s=l}}}if(nc)throw n=Bf,nc=!1,Bf=null,n}function Mt(n,e){var t=e[Kf];t===void 0&&(t=e[Kf]=new Set);var i=n+"__bubble";t.has(i)||(gv(e,n,2,!1),t.add(i))}function Mu(n,e,t){var i=0;e&&(i|=4),gv(t,n,i,e)}var Za="_reactListening"+Math.random().toString(36).slice(2);function ya(n){if(!n[Za]){n[Za]=!0,wg.forEach(function(t){t!=="selectionchange"&&(hM.has(t)||Mu(t,!1,n),Mu(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[Za]||(e[Za]=!0,Mu("selectionchange",!1,e))}}function gv(n,e,t,i){switch(Qg(e)){case 1:var r=Ay;break;case 4:r=Cy;break;default:r=qh}t=r.bind(null,e,t,n),r=void 0,!Of||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function Su(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Kr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}Og(function(){var c=s,u=Wh(t),f=[];e:{var h=pv.get(n);if(h!==void 0){var p=Kh,v=n;switch(n){case"keypress":if(Vl(t)===0)break e;case"keydown":case"keyup":p=Vy;break;case"focusin":v="focus",p=mu;break;case"focusout":v="blur",p=mu;break;case"beforeblur":case"afterblur":p=mu;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=fp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Py;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=jy;break;case uv:case fv:case hv:p=Ny;break;case dv:p=Yy;break;case"scroll":p=by;break;case"wheel":p=$y;break;case"copy":case"cut":case"paste":p=Uy;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=dp}var _=(e&4)!==0,m=!_&&n==="scroll",d=_?h!==null?h+"Capture":null:h;_=[];for(var x=c,g;x!==null;){g=x;var M=g.stateNode;if(g.tag===5&&M!==null&&(g=M,d!==null&&(M=pa(x,d),M!=null&&_.push(Ma(x,M,g)))),m)break;x=x.return}0<_.length&&(h=new p(h,v,null,t,u),f.push({event:h,listeners:_}))}}if(!(e&7)){e:{if(h=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",h&&t!==kf&&(v=t.relatedTarget||t.fromElement)&&(Kr(v)||v[$i]))break e;if((p||h)&&(h=u.window===u?u:(h=u.ownerDocument)?h.defaultView||h.parentWindow:window,p?(v=t.relatedTarget||t.toElement,p=c,v=v?Kr(v):null,v!==null&&(m=fs(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(_=fp,M="onMouseLeave",d="onMouseEnter",x="mouse",(n==="pointerout"||n==="pointerover")&&(_=dp,M="onPointerLeave",d="onPointerEnter",x="pointer"),m=p==null?h:Hs(p),g=v==null?h:Hs(v),h=new _(M,x+"leave",p,t,u),h.target=m,h.relatedTarget=g,M=null,Kr(u)===c&&(_=new _(d,x+"enter",v,t,u),_.target=g,_.relatedTarget=m,M=_),m=M,p&&v)t:{for(_=p,d=v,x=0,g=_;g;g=ms(g))x++;for(g=0,M=d;M;M=ms(M))g++;for(;0<x-g;)_=ms(_),x--;for(;0<g-x;)d=ms(d),g--;for(;x--;){if(_===d||d!==null&&_===d.alternate)break t;_=ms(_),d=ms(d)}_=null}else _=null;p!==null&&Ep(f,h,p,_,!1),v!==null&&m!==null&&Ep(f,m,v,_,!0)}}e:{if(h=c?Hs(c):window,p=h.nodeName&&h.nodeName.toLowerCase(),p==="select"||p==="input"&&h.type==="file")var T=nM;else if(gp(h))if(sv)T=oM;else{T=rM;var E=iM}else(p=h.nodeName)&&p.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(T=sM);if(T&&(T=T(n,c))){rv(f,T,t,u);break e}E&&E(n,h,c),n==="focusout"&&(E=h._wrapperState)&&E.controlled&&h.type==="number"&&Df(h,"number",h.value)}switch(E=c?Hs(c):window,n){case"focusin":(gp(E)||E.contentEditable==="true")&&(Gs=E,Wf=c,ia=null);break;case"focusout":ia=Wf=Gs=null;break;case"mousedown":jf=!0;break;case"contextmenu":case"mouseup":case"dragend":jf=!1,Mp(f,t,u);break;case"selectionchange":if(cM)break;case"keydown":case"keyup":Mp(f,t,u)}var S;if(Jh)e:{switch(n){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else Bs?nv(n,t)&&(b="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(b="onCompositionStart");b&&(tv&&t.locale!=="ko"&&(Bs||b!=="onCompositionStart"?b==="onCompositionEnd"&&Bs&&(S=ev()):(dr=u,$h="value"in dr?dr.value:dr.textContent,Bs=!0)),E=ac(c,b),0<E.length&&(b=new hp(b,n,null,t,u),f.push({event:b,listeners:E}),S?b.data=S:(S=iv(t),S!==null&&(b.data=S)))),(S=Zy?Jy(n,t):Qy(n,t))&&(c=ac(c,"onBeforeInput"),0<c.length&&(u=new hp("onBeforeInput","beforeinput",null,t,u),f.push({event:u,listeners:c}),u.data=S))}mv(f,e)})}function Ma(n,e,t){return{instance:n,listener:e,currentTarget:t}}function ac(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=pa(n,t),s!=null&&i.unshift(Ma(n,s,r)),s=pa(n,e),s!=null&&i.push(Ma(n,s,r))),n=n.return}return i}function ms(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Ep(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=pa(t,s),l!=null&&o.unshift(Ma(t,l,a))):r||(l=pa(t,s),l!=null&&o.push(Ma(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var dM=/\r\n?/g,pM=/\u0000|\uFFFD/g;function Tp(n){return(typeof n=="string"?n:""+n).replace(dM,`
`).replace(pM,"")}function Ja(n,e,t){if(e=Tp(e),Tp(n)!==e&&t)throw Error(de(425))}function lc(){}var Xf=null,Yf=null;function qf(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var $f=typeof setTimeout=="function"?setTimeout:void 0,mM=typeof clearTimeout=="function"?clearTimeout:void 0,Ap=typeof Promise=="function"?Promise:void 0,gM=typeof queueMicrotask=="function"?queueMicrotask:typeof Ap<"u"?function(n){return Ap.resolve(null).then(n).catch(vM)}:$f;function vM(n){setTimeout(function(){throw n})}function wu(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),va(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);va(e)}function _r(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function Cp(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Eo=Math.random().toString(36).slice(2),Si="__reactFiber$"+Eo,Sa="__reactProps$"+Eo,$i="__reactContainer$"+Eo,Kf="__reactEvents$"+Eo,xM="__reactListeners$"+Eo,_M="__reactHandles$"+Eo;function Kr(n){var e=n[Si];if(e)return e;for(var t=n.parentNode;t;){if(e=t[$i]||t[Si]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Cp(n);n!==null;){if(t=n[Si])return t;n=Cp(n)}return e}n=t,t=n.parentNode}return null}function ka(n){return n=n[Si]||n[$i],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Hs(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(de(33))}function Oc(n){return n[Sa]||null}var Zf=[],Ws=-1;function Dr(n){return{current:n}}function wt(n){0>Ws||(n.current=Zf[Ws],Zf[Ws]=null,Ws--)}function _t(n,e){Ws++,Zf[Ws]=n.current,n.current=e}var Cr={},gn=Dr(Cr),bn=Dr(!1),rs=Cr;function co(n,e){var t=n.type.contextTypes;if(!t)return Cr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function Rn(n){return n=n.childContextTypes,n!=null}function cc(){wt(bn),wt(gn)}function bp(n,e,t){if(gn.current!==Cr)throw Error(de(168));_t(gn,e),_t(bn,t)}function vv(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(de(108,iy(n)||"Unknown",r));return Lt({},t,i)}function uc(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Cr,rs=gn.current,_t(gn,n),_t(bn,bn.current),!0}function Rp(n,e,t){var i=n.stateNode;if(!i)throw Error(de(169));t?(n=vv(n,e,rs),i.__reactInternalMemoizedMergedChildContext=n,wt(bn),wt(gn),_t(gn,n)):wt(bn),_t(bn,t)}var Oi=null,Bc=!1,Eu=!1;function xv(n){Oi===null?Oi=[n]:Oi.push(n)}function yM(n){Bc=!0,xv(n)}function Nr(){if(!Eu&&Oi!==null){Eu=!0;var n=0,e=ut;try{var t=Oi;for(ut=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}Oi=null,Bc=!1}catch(r){throw Oi!==null&&(Oi=Oi.slice(n+1)),Hg(jh,Nr),r}finally{ut=e,Eu=!1}}return null}var js=[],Xs=0,fc=null,hc=0,Kn=[],Zn=0,ss=null,Vi=1,Hi="";function Wr(n,e){js[Xs++]=hc,js[Xs++]=fc,fc=n,hc=e}function _v(n,e,t){Kn[Zn++]=Vi,Kn[Zn++]=Hi,Kn[Zn++]=ss,ss=n;var i=Vi;n=Hi;var r=32-gi(i)-1;i&=~(1<<r),t+=1;var s=32-gi(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Vi=1<<32-gi(e)+r|t<<r|i,Hi=s+n}else Vi=1<<s|t<<r|i,Hi=n}function ed(n){n.return!==null&&(Wr(n,1),_v(n,1,0))}function td(n){for(;n===fc;)fc=js[--Xs],js[Xs]=null,hc=js[--Xs],js[Xs]=null;for(;n===ss;)ss=Kn[--Zn],Kn[Zn]=null,Hi=Kn[--Zn],Kn[Zn]=null,Vi=Kn[--Zn],Kn[Zn]=null}var Vn=null,zn=null,At=!1,di=null;function yv(n,e){var t=Qn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Pp(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,Vn=n,zn=_r(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,Vn=n,zn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=ss!==null?{id:Vi,overflow:Hi}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Qn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,Vn=n,zn=null,!0):!1;default:return!1}}function Jf(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Qf(n){if(At){var e=zn;if(e){var t=e;if(!Pp(n,e)){if(Jf(n))throw Error(de(418));e=_r(t.nextSibling);var i=Vn;e&&Pp(n,e)?yv(i,t):(n.flags=n.flags&-4097|2,At=!1,Vn=n)}}else{if(Jf(n))throw Error(de(418));n.flags=n.flags&-4097|2,At=!1,Vn=n}}}function Lp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Vn=n}function Qa(n){if(n!==Vn)return!1;if(!At)return Lp(n),At=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!qf(n.type,n.memoizedProps)),e&&(e=zn)){if(Jf(n))throw Mv(),Error(de(418));for(;e;)yv(n,e),e=_r(e.nextSibling)}if(Lp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(de(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){zn=_r(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}zn=null}}else zn=Vn?_r(n.stateNode.nextSibling):null;return!0}function Mv(){for(var n=zn;n;)n=_r(n.nextSibling)}function uo(){zn=Vn=null,At=!1}function nd(n){di===null?di=[n]:di.push(n)}var MM=Ji.ReactCurrentBatchConfig;function Io(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(de(309));var i=t.stateNode}if(!i)throw Error(de(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(de(284));if(!t._owner)throw Error(de(290,n))}return n}function el(n,e){throw n=Object.prototype.toString.call(e),Error(de(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function Dp(n){var e=n._init;return e(n._payload)}function Sv(n){function e(d,x){if(n){var g=d.deletions;g===null?(d.deletions=[x],d.flags|=16):g.push(x)}}function t(d,x){if(!n)return null;for(;x!==null;)e(d,x),x=x.sibling;return null}function i(d,x){for(d=new Map;x!==null;)x.key!==null?d.set(x.key,x):d.set(x.index,x),x=x.sibling;return d}function r(d,x){return d=wr(d,x),d.index=0,d.sibling=null,d}function s(d,x,g){return d.index=g,n?(g=d.alternate,g!==null?(g=g.index,g<x?(d.flags|=2,x):g):(d.flags|=2,x)):(d.flags|=1048576,x)}function o(d){return n&&d.alternate===null&&(d.flags|=2),d}function a(d,x,g,M){return x===null||x.tag!==6?(x=Lu(g,d.mode,M),x.return=d,x):(x=r(x,g),x.return=d,x)}function l(d,x,g,M){var T=g.type;return T===Os?u(d,x,g.props.children,M,g.key):x!==null&&(x.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===or&&Dp(T)===x.type)?(M=r(x,g.props),M.ref=Io(d,x,g),M.return=d,M):(M=$l(g.type,g.key,g.props,null,d.mode,M),M.ref=Io(d,x,g),M.return=d,M)}function c(d,x,g,M){return x===null||x.tag!==4||x.stateNode.containerInfo!==g.containerInfo||x.stateNode.implementation!==g.implementation?(x=Du(g,d.mode,M),x.return=d,x):(x=r(x,g.children||[]),x.return=d,x)}function u(d,x,g,M,T){return x===null||x.tag!==7?(x=es(g,d.mode,M,T),x.return=d,x):(x=r(x,g),x.return=d,x)}function f(d,x,g){if(typeof x=="string"&&x!==""||typeof x=="number")return x=Lu(""+x,d.mode,g),x.return=d,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case Ha:return g=$l(x.type,x.key,x.props,null,d.mode,g),g.ref=Io(d,null,x),g.return=d,g;case zs:return x=Du(x,d.mode,g),x.return=d,x;case or:var M=x._init;return f(d,M(x._payload),g)}if($o(x)||Ro(x))return x=es(x,d.mode,g,null),x.return=d,x;el(d,x)}return null}function h(d,x,g,M){var T=x!==null?x.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return T!==null?null:a(d,x,""+g,M);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Ha:return g.key===T?l(d,x,g,M):null;case zs:return g.key===T?c(d,x,g,M):null;case or:return T=g._init,h(d,x,T(g._payload),M)}if($o(g)||Ro(g))return T!==null?null:u(d,x,g,M,null);el(d,g)}return null}function p(d,x,g,M,T){if(typeof M=="string"&&M!==""||typeof M=="number")return d=d.get(g)||null,a(x,d,""+M,T);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Ha:return d=d.get(M.key===null?g:M.key)||null,l(x,d,M,T);case zs:return d=d.get(M.key===null?g:M.key)||null,c(x,d,M,T);case or:var E=M._init;return p(d,x,g,E(M._payload),T)}if($o(M)||Ro(M))return d=d.get(g)||null,u(x,d,M,T,null);el(x,M)}return null}function v(d,x,g,M){for(var T=null,E=null,S=x,b=x=0,D=null;S!==null&&b<g.length;b++){S.index>b?(D=S,S=null):D=S.sibling;var y=h(d,S,g[b],M);if(y===null){S===null&&(S=D);break}n&&S&&y.alternate===null&&e(d,S),x=s(y,x,b),E===null?T=y:E.sibling=y,E=y,S=D}if(b===g.length)return t(d,S),At&&Wr(d,b),T;if(S===null){for(;b<g.length;b++)S=f(d,g[b],M),S!==null&&(x=s(S,x,b),E===null?T=S:E.sibling=S,E=S);return At&&Wr(d,b),T}for(S=i(d,S);b<g.length;b++)D=p(S,d,b,g[b],M),D!==null&&(n&&D.alternate!==null&&S.delete(D.key===null?b:D.key),x=s(D,x,b),E===null?T=D:E.sibling=D,E=D);return n&&S.forEach(function(A){return e(d,A)}),At&&Wr(d,b),T}function _(d,x,g,M){var T=Ro(g);if(typeof T!="function")throw Error(de(150));if(g=T.call(g),g==null)throw Error(de(151));for(var E=T=null,S=x,b=x=0,D=null,y=g.next();S!==null&&!y.done;b++,y=g.next()){S.index>b?(D=S,S=null):D=S.sibling;var A=h(d,S,y.value,M);if(A===null){S===null&&(S=D);break}n&&S&&A.alternate===null&&e(d,S),x=s(A,x,b),E===null?T=A:E.sibling=A,E=A,S=D}if(y.done)return t(d,S),At&&Wr(d,b),T;if(S===null){for(;!y.done;b++,y=g.next())y=f(d,y.value,M),y!==null&&(x=s(y,x,b),E===null?T=y:E.sibling=y,E=y);return At&&Wr(d,b),T}for(S=i(d,S);!y.done;b++,y=g.next())y=p(S,d,b,y.value,M),y!==null&&(n&&y.alternate!==null&&S.delete(y.key===null?b:y.key),x=s(y,x,b),E===null?T=y:E.sibling=y,E=y);return n&&S.forEach(function(j){return e(d,j)}),At&&Wr(d,b),T}function m(d,x,g,M){if(typeof g=="object"&&g!==null&&g.type===Os&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case Ha:e:{for(var T=g.key,E=x;E!==null;){if(E.key===T){if(T=g.type,T===Os){if(E.tag===7){t(d,E.sibling),x=r(E,g.props.children),x.return=d,d=x;break e}}else if(E.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===or&&Dp(T)===E.type){t(d,E.sibling),x=r(E,g.props),x.ref=Io(d,E,g),x.return=d,d=x;break e}t(d,E);break}else e(d,E);E=E.sibling}g.type===Os?(x=es(g.props.children,d.mode,M,g.key),x.return=d,d=x):(M=$l(g.type,g.key,g.props,null,d.mode,M),M.ref=Io(d,x,g),M.return=d,d=M)}return o(d);case zs:e:{for(E=g.key;x!==null;){if(x.key===E)if(x.tag===4&&x.stateNode.containerInfo===g.containerInfo&&x.stateNode.implementation===g.implementation){t(d,x.sibling),x=r(x,g.children||[]),x.return=d,d=x;break e}else{t(d,x);break}else e(d,x);x=x.sibling}x=Du(g,d.mode,M),x.return=d,d=x}return o(d);case or:return E=g._init,m(d,x,E(g._payload),M)}if($o(g))return v(d,x,g,M);if(Ro(g))return _(d,x,g,M);el(d,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,x!==null&&x.tag===6?(t(d,x.sibling),x=r(x,g),x.return=d,d=x):(t(d,x),x=Lu(g,d.mode,M),x.return=d,d=x),o(d)):t(d,x)}return m}var fo=Sv(!0),wv=Sv(!1),dc=Dr(null),pc=null,Ys=null,id=null;function rd(){id=Ys=pc=null}function sd(n){var e=dc.current;wt(dc),n._currentValue=e}function eh(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function io(n,e){pc=n,id=Ys=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(Cn=!0),n.firstContext=null)}function ii(n){var e=n._currentValue;if(id!==n)if(n={context:n,memoizedValue:e,next:null},Ys===null){if(pc===null)throw Error(de(308));Ys=n,pc.dependencies={lanes:0,firstContext:n}}else Ys=Ys.next=n;return e}var Zr=null;function od(n){Zr===null?Zr=[n]:Zr.push(n)}function Ev(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,od(e)):(t.next=r.next,r.next=t),e.interleaved=t,Ki(n,i)}function Ki(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var ar=!1;function ad(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Tv(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Xi(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function yr(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,it&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ki(n,t)}return r=i.interleaved,r===null?(e.next=e,od(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ki(n,t)}function Hl(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Xh(n,t)}}function Np(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function mc(n,e,t,i){var r=n.updateQueue;ar=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var u=n.alternate;u!==null&&(u=u.updateQueue,a=u.lastBaseUpdate,a!==o&&(a===null?u.firstBaseUpdate=c:a.next=c,u.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;o=0,u=c=l=null,a=s;do{var h=a.lane,p=a.eventTime;if((i&h)===h){u!==null&&(u=u.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=n,_=a;switch(h=e,p=t,_.tag){case 1:if(v=_.payload,typeof v=="function"){f=v.call(p,f,h);break e}f=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=_.payload,h=typeof v=="function"?v.call(p,f,h):v,h==null)break e;f=Lt({},f,h);break e;case 2:ar=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,h=r.effects,h===null?r.effects=[a]:h.push(a))}else p={eventTime:p,lane:h,tag:a.tag,payload:a.payload,callback:a.callback,next:null},u===null?(c=u=p,l=f):u=u.next=p,o|=h;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;h=a,a=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(!0);if(u===null&&(l=f),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);as|=o,n.lanes=o,n.memoizedState=f}}function Ip(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(de(191,r));r.call(i)}}}var za={},Ci=Dr(za),wa=Dr(za),Ea=Dr(za);function Jr(n){if(n===za)throw Error(de(174));return n}function ld(n,e){switch(_t(Ea,e),_t(wa,n),_t(Ci,za),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:If(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=If(e,n)}wt(Ci),_t(Ci,e)}function ho(){wt(Ci),wt(wa),wt(Ea)}function Av(n){Jr(Ea.current);var e=Jr(Ci.current),t=If(e,n.type);e!==t&&(_t(wa,n),_t(Ci,t))}function cd(n){wa.current===n&&(wt(Ci),wt(wa))}var bt=Dr(0);function gc(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Tu=[];function ud(){for(var n=0;n<Tu.length;n++)Tu[n]._workInProgressVersionPrimary=null;Tu.length=0}var Wl=Ji.ReactCurrentDispatcher,Au=Ji.ReactCurrentBatchConfig,os=0,Pt=null,Gt=null,qt=null,vc=!1,ra=!1,Ta=0,SM=0;function ln(){throw Error(de(321))}function fd(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!xi(n[t],e[t]))return!1;return!0}function hd(n,e,t,i,r,s){if(os=s,Pt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Wl.current=n===null||n.memoizedState===null?AM:CM,n=t(i,r),ra){s=0;do{if(ra=!1,Ta=0,25<=s)throw Error(de(301));s+=1,qt=Gt=null,e.updateQueue=null,Wl.current=bM,n=t(i,r)}while(ra)}if(Wl.current=xc,e=Gt!==null&&Gt.next!==null,os=0,qt=Gt=Pt=null,vc=!1,e)throw Error(de(300));return n}function dd(){var n=Ta!==0;return Ta=0,n}function yi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return qt===null?Pt.memoizedState=qt=n:qt=qt.next=n,qt}function ri(){if(Gt===null){var n=Pt.alternate;n=n!==null?n.memoizedState:null}else n=Gt.next;var e=qt===null?Pt.memoizedState:qt.next;if(e!==null)qt=e,Gt=n;else{if(n===null)throw Error(de(310));Gt=n,n={memoizedState:Gt.memoizedState,baseState:Gt.baseState,baseQueue:Gt.baseQueue,queue:Gt.queue,next:null},qt===null?Pt.memoizedState=qt=n:qt=qt.next=n}return qt}function Aa(n,e){return typeof e=="function"?e(n):e}function Cu(n){var e=ri(),t=e.queue;if(t===null)throw Error(de(311));t.lastRenderedReducer=n;var i=Gt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var u=c.lane;if((os&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var f={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=f,o=i):l=l.next=f,Pt.lanes|=u,as|=u}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,xi(i,e.memoizedState)||(Cn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,Pt.lanes|=s,as|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function bu(n){var e=ri(),t=e.queue;if(t===null)throw Error(de(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);xi(s,e.memoizedState)||(Cn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function Cv(){}function bv(n,e){var t=Pt,i=ri(),r=e(),s=!xi(i.memoizedState,r);if(s&&(i.memoizedState=r,Cn=!0),i=i.queue,pd(Lv.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||qt!==null&&qt.memoizedState.tag&1){if(t.flags|=2048,Ca(9,Pv.bind(null,t,i,r,e),void 0,null),$t===null)throw Error(de(349));os&30||Rv(t,e,r)}return r}function Rv(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=Pt.updateQueue,e===null?(e={lastEffect:null,stores:null},Pt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function Pv(n,e,t,i){e.value=t,e.getSnapshot=i,Dv(e)&&Nv(n)}function Lv(n,e,t){return t(function(){Dv(e)&&Nv(n)})}function Dv(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!xi(n,t)}catch{return!0}}function Nv(n){var e=Ki(n,1);e!==null&&vi(e,n,1,-1)}function Up(n){var e=yi();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Aa,lastRenderedState:n},e.queue=n,n=n.dispatch=TM.bind(null,Pt,n),[e.memoizedState,n]}function Ca(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=Pt.updateQueue,e===null?(e={lastEffect:null,stores:null},Pt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function Iv(){return ri().memoizedState}function jl(n,e,t,i){var r=yi();Pt.flags|=n,r.memoizedState=Ca(1|e,t,void 0,i===void 0?null:i)}function Gc(n,e,t,i){var r=ri();i=i===void 0?null:i;var s=void 0;if(Gt!==null){var o=Gt.memoizedState;if(s=o.destroy,i!==null&&fd(i,o.deps)){r.memoizedState=Ca(e,t,s,i);return}}Pt.flags|=n,r.memoizedState=Ca(1|e,t,s,i)}function Fp(n,e){return jl(8390656,8,n,e)}function pd(n,e){return Gc(2048,8,n,e)}function Uv(n,e){return Gc(4,2,n,e)}function Fv(n,e){return Gc(4,4,n,e)}function kv(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function zv(n,e,t){return t=t!=null?t.concat([n]):null,Gc(4,4,kv.bind(null,e,n),t)}function md(){}function Ov(n,e){var t=ri();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&fd(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function Bv(n,e){var t=ri();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&fd(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function Gv(n,e,t){return os&21?(xi(t,e)||(t=Xg(),Pt.lanes|=t,as|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,Cn=!0),n.memoizedState=t)}function wM(n,e){var t=ut;ut=t!==0&&4>t?t:4,n(!0);var i=Au.transition;Au.transition={};try{n(!1),e()}finally{ut=t,Au.transition=i}}function Vv(){return ri().memoizedState}function EM(n,e,t){var i=Sr(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},Hv(n))Wv(e,t);else if(t=Ev(n,e,t,i),t!==null){var r=Mn();vi(t,n,i,r),jv(t,e,i)}}function TM(n,e,t){var i=Sr(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(Hv(n))Wv(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,xi(a,o)){var l=e.interleaved;l===null?(r.next=r,od(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=Ev(n,e,r,i),t!==null&&(r=Mn(),vi(t,n,i,r),jv(t,e,i))}}function Hv(n){var e=n.alternate;return n===Pt||e!==null&&e===Pt}function Wv(n,e){ra=vc=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function jv(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Xh(n,t)}}var xc={readContext:ii,useCallback:ln,useContext:ln,useEffect:ln,useImperativeHandle:ln,useInsertionEffect:ln,useLayoutEffect:ln,useMemo:ln,useReducer:ln,useRef:ln,useState:ln,useDebugValue:ln,useDeferredValue:ln,useTransition:ln,useMutableSource:ln,useSyncExternalStore:ln,useId:ln,unstable_isNewReconciler:!1},AM={readContext:ii,useCallback:function(n,e){return yi().memoizedState=[n,e===void 0?null:e],n},useContext:ii,useEffect:Fp,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,jl(4194308,4,kv.bind(null,e,n),t)},useLayoutEffect:function(n,e){return jl(4194308,4,n,e)},useInsertionEffect:function(n,e){return jl(4,2,n,e)},useMemo:function(n,e){var t=yi();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=yi();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=EM.bind(null,Pt,n),[i.memoizedState,n]},useRef:function(n){var e=yi();return n={current:n},e.memoizedState=n},useState:Up,useDebugValue:md,useDeferredValue:function(n){return yi().memoizedState=n},useTransition:function(){var n=Up(!1),e=n[0];return n=wM.bind(null,n[1]),yi().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=Pt,r=yi();if(At){if(t===void 0)throw Error(de(407));t=t()}else{if(t=e(),$t===null)throw Error(de(349));os&30||Rv(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,Fp(Lv.bind(null,i,s,n),[n]),i.flags|=2048,Ca(9,Pv.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=yi(),e=$t.identifierPrefix;if(At){var t=Hi,i=Vi;t=(i&~(1<<32-gi(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Ta++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=SM++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},CM={readContext:ii,useCallback:Ov,useContext:ii,useEffect:pd,useImperativeHandle:zv,useInsertionEffect:Uv,useLayoutEffect:Fv,useMemo:Bv,useReducer:Cu,useRef:Iv,useState:function(){return Cu(Aa)},useDebugValue:md,useDeferredValue:function(n){var e=ri();return Gv(e,Gt.memoizedState,n)},useTransition:function(){var n=Cu(Aa)[0],e=ri().memoizedState;return[n,e]},useMutableSource:Cv,useSyncExternalStore:bv,useId:Vv,unstable_isNewReconciler:!1},bM={readContext:ii,useCallback:Ov,useContext:ii,useEffect:pd,useImperativeHandle:zv,useInsertionEffect:Uv,useLayoutEffect:Fv,useMemo:Bv,useReducer:bu,useRef:Iv,useState:function(){return bu(Aa)},useDebugValue:md,useDeferredValue:function(n){var e=ri();return Gt===null?e.memoizedState=n:Gv(e,Gt.memoizedState,n)},useTransition:function(){var n=bu(Aa)[0],e=ri().memoizedState;return[n,e]},useMutableSource:Cv,useSyncExternalStore:bv,useId:Vv,unstable_isNewReconciler:!1};function ci(n,e){if(n&&n.defaultProps){e=Lt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function th(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:Lt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var Vc={isMounted:function(n){return(n=n._reactInternals)?fs(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=Mn(),r=Sr(n),s=Xi(i,r);s.payload=e,t!=null&&(s.callback=t),e=yr(n,s,r),e!==null&&(vi(e,n,r,i),Hl(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=Mn(),r=Sr(n),s=Xi(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=yr(n,s,r),e!==null&&(vi(e,n,r,i),Hl(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=Mn(),i=Sr(n),r=Xi(t,i);r.tag=2,e!=null&&(r.callback=e),e=yr(n,r,i),e!==null&&(vi(e,n,i,t),Hl(e,n,i))}};function kp(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!_a(t,i)||!_a(r,s):!0}function Xv(n,e,t){var i=!1,r=Cr,s=e.contextType;return typeof s=="object"&&s!==null?s=ii(s):(r=Rn(e)?rs:gn.current,i=e.contextTypes,s=(i=i!=null)?co(n,r):Cr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Vc,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function zp(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&Vc.enqueueReplaceState(e,e.state,null)}function nh(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},ad(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=ii(s):(s=Rn(e)?rs:gn.current,r.context=co(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(th(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Vc.enqueueReplaceState(r,r.state,null),mc(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function po(n,e){try{var t="",i=e;do t+=ny(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Ru(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function ih(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var RM=typeof WeakMap=="function"?WeakMap:Map;function Yv(n,e,t){t=Xi(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){yc||(yc=!0,dh=i),ih(n,e)},t}function qv(n,e,t){t=Xi(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){ih(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){ih(n,e),typeof i!="function"&&(Mr===null?Mr=new Set([this]):Mr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function Op(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new RM;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=HM.bind(null,n,e,t),e.then(n,n))}function Bp(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function Gp(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Xi(-1,1),e.tag=2,yr(t,e,1))),t.lanes|=1),n)}var PM=Ji.ReactCurrentOwner,Cn=!1;function yn(n,e,t,i){e.child=n===null?wv(e,null,t,i):fo(e,n.child,t,i)}function Vp(n,e,t,i,r){t=t.render;var s=e.ref;return io(e,r),i=hd(n,e,t,i,s,r),t=dd(),n!==null&&!Cn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Zi(n,e,r)):(At&&t&&ed(e),e.flags|=1,yn(n,e,i,r),e.child)}function Hp(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!wd(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,$v(n,e,s,i,r)):(n=$l(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:_a,t(o,i)&&n.ref===e.ref)return Zi(n,e,r)}return e.flags|=1,n=wr(s,i),n.ref=e.ref,n.return=e,e.child=n}function $v(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(_a(s,i)&&n.ref===e.ref)if(Cn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(Cn=!0);else return e.lanes=n.lanes,Zi(n,e,r)}return rh(n,e,t,i,r)}function Kv(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},_t($s,Un),Un|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,_t($s,Un),Un|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,_t($s,Un),Un|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,_t($s,Un),Un|=i;return yn(n,e,r,t),e.child}function Zv(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function rh(n,e,t,i,r){var s=Rn(t)?rs:gn.current;return s=co(e,s),io(e,r),t=hd(n,e,t,i,s,r),i=dd(),n!==null&&!Cn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Zi(n,e,r)):(At&&i&&ed(e),e.flags|=1,yn(n,e,t,r),e.child)}function Wp(n,e,t,i,r){if(Rn(t)){var s=!0;uc(e)}else s=!1;if(io(e,r),e.stateNode===null)Xl(n,e),Xv(e,t,i),nh(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=ii(c):(c=Rn(t)?rs:gn.current,c=co(e,c));var u=t.getDerivedStateFromProps,f=typeof u=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&zp(e,o,i,c),ar=!1;var h=e.memoizedState;o.state=h,mc(e,i,o,r),l=e.memoizedState,a!==i||h!==l||bn.current||ar?(typeof u=="function"&&(th(e,t,u,i),l=e.memoizedState),(a=ar||kp(e,t,a,i,h,l,c))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Tv(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:ci(e.type,a),o.props=c,f=e.pendingProps,h=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=ii(l):(l=Rn(t)?rs:gn.current,l=co(e,l));var p=t.getDerivedStateFromProps;(u=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||h!==l)&&zp(e,o,i,l),ar=!1,h=e.memoizedState,o.state=h,mc(e,i,o,r);var v=e.memoizedState;a!==f||h!==v||bn.current||ar?(typeof p=="function"&&(th(e,t,p,i),v=e.memoizedState),(c=ar||kp(e,t,c,i,h,v,l)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=1024),i=!1)}return sh(n,e,t,i,s,r)}function sh(n,e,t,i,r,s){Zv(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Rp(e,t,!1),Zi(n,e,s);i=e.stateNode,PM.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=fo(e,n.child,null,s),e.child=fo(e,null,a,s)):yn(n,e,a,s),e.memoizedState=i.state,r&&Rp(e,t,!0),e.child}function Jv(n){var e=n.stateNode;e.pendingContext?bp(n,e.pendingContext,e.pendingContext!==e.context):e.context&&bp(n,e.context,!1),ld(n,e.containerInfo)}function jp(n,e,t,i,r){return uo(),nd(r),e.flags|=256,yn(n,e,t,i),e.child}var oh={dehydrated:null,treeContext:null,retryLane:0};function ah(n){return{baseLanes:n,cachePool:null,transitions:null}}function Qv(n,e,t){var i=e.pendingProps,r=bt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),_t(bt,r&1),n===null)return Qf(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=jc(o,i,0,null),n=es(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=ah(t),e.memoizedState=oh,n):gd(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return LM(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=wr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=wr(a,s):(s=es(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?ah(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=oh,i}return s=n.child,n=s.sibling,i=wr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function gd(n,e){return e=jc({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function tl(n,e,t,i){return i!==null&&nd(i),fo(e,n.child,null,t),n=gd(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function LM(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Ru(Error(de(422))),tl(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=jc({mode:"visible",children:i.children},r,0,null),s=es(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&fo(e,n.child,null,o),e.child.memoizedState=ah(o),e.memoizedState=oh,s);if(!(e.mode&1))return tl(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(de(419)),i=Ru(s,i,void 0),tl(n,e,o,i)}if(a=(o&n.childLanes)!==0,Cn||a){if(i=$t,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ki(n,r),vi(i,n,r,-1))}return Sd(),i=Ru(Error(de(421))),tl(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=WM.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,zn=_r(r.nextSibling),Vn=e,At=!0,di=null,n!==null&&(Kn[Zn++]=Vi,Kn[Zn++]=Hi,Kn[Zn++]=ss,Vi=n.id,Hi=n.overflow,ss=e),e=gd(e,i.children),e.flags|=4096,e)}function Xp(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),eh(n.return,e,t)}function Pu(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function ex(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(yn(n,e,i.children,t),i=bt.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Xp(n,t,e);else if(n.tag===19)Xp(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(_t(bt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&gc(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Pu(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&gc(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Pu(e,!0,t,null,s);break;case"together":Pu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Xl(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Zi(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),as|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(de(153));if(e.child!==null){for(n=e.child,t=wr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=wr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function DM(n,e,t){switch(e.tag){case 3:Jv(e),uo();break;case 5:Av(e);break;case 1:Rn(e.type)&&uc(e);break;case 4:ld(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;_t(dc,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(_t(bt,bt.current&1),e.flags|=128,null):t&e.child.childLanes?Qv(n,e,t):(_t(bt,bt.current&1),n=Zi(n,e,t),n!==null?n.sibling:null);_t(bt,bt.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return ex(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),_t(bt,bt.current),i)break;return null;case 22:case 23:return e.lanes=0,Kv(n,e,t)}return Zi(n,e,t)}var tx,lh,nx,ix;tx=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};lh=function(){};nx=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Jr(Ci.current);var s=null;switch(t){case"input":r=Pf(n,r),i=Pf(n,i),s=[];break;case"select":r=Lt({},r,{value:void 0}),i=Lt({},i,{value:void 0}),s=[];break;case"textarea":r=Nf(n,r),i=Nf(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=lc)}Uf(t,i);var o;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(ha.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(ha.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&Mt("scroll",n),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};ix=function(n,e,t,i){t!==i&&(e.flags|=4)};function Uo(n,e){if(!At)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function cn(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function NM(n,e,t){var i=e.pendingProps;switch(td(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return cn(e),null;case 1:return Rn(e.type)&&cc(),cn(e),null;case 3:return i=e.stateNode,ho(),wt(bn),wt(gn),ud(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(Qa(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,di!==null&&(gh(di),di=null))),lh(n,e),cn(e),null;case 5:cd(e);var r=Jr(Ea.current);if(t=e.type,n!==null&&e.stateNode!=null)nx(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(de(166));return cn(e),null}if(n=Jr(Ci.current),Qa(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[Si]=e,i[Sa]=s,n=(e.mode&1)!==0,t){case"dialog":Mt("cancel",i),Mt("close",i);break;case"iframe":case"object":case"embed":Mt("load",i);break;case"video":case"audio":for(r=0;r<Zo.length;r++)Mt(Zo[r],i);break;case"source":Mt("error",i);break;case"img":case"image":case"link":Mt("error",i),Mt("load",i);break;case"details":Mt("toggle",i);break;case"input":tp(i,s),Mt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},Mt("invalid",i);break;case"textarea":ip(i,s),Mt("invalid",i)}Uf(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&Ja(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Ja(i.textContent,a,n),r=["children",""+a]):ha.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&Mt("scroll",i)}switch(t){case"input":Wa(i),np(i,s,!0);break;case"textarea":Wa(i),rp(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=lc)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Lg(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[Si]=e,n[Sa]=i,tx(n,e,!1,!1),e.stateNode=n;e:{switch(o=Ff(t,i),t){case"dialog":Mt("cancel",n),Mt("close",n),r=i;break;case"iframe":case"object":case"embed":Mt("load",n),r=i;break;case"video":case"audio":for(r=0;r<Zo.length;r++)Mt(Zo[r],n);r=i;break;case"source":Mt("error",n),r=i;break;case"img":case"image":case"link":Mt("error",n),Mt("load",n),r=i;break;case"details":Mt("toggle",n),r=i;break;case"input":tp(n,i),r=Pf(n,i),Mt("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=Lt({},i,{value:void 0}),Mt("invalid",n);break;case"textarea":ip(n,i),r=Nf(n,i),Mt("invalid",n);break;default:r=i}Uf(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Ig(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Dg(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&da(n,l):typeof l=="number"&&da(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ha.hasOwnProperty(s)?l!=null&&s==="onScroll"&&Mt("scroll",n):l!=null&&Bh(n,s,l,o))}switch(t){case"input":Wa(n),np(n,i,!1);break;case"textarea":Wa(n),rp(n);break;case"option":i.value!=null&&n.setAttribute("value",""+Ar(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?Qs(n,!!i.multiple,s,!1):i.defaultValue!=null&&Qs(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=lc)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return cn(e),null;case 6:if(n&&e.stateNode!=null)ix(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(de(166));if(t=Jr(Ea.current),Jr(Ci.current),Qa(e)){if(i=e.stateNode,t=e.memoizedProps,i[Si]=e,(s=i.nodeValue!==t)&&(n=Vn,n!==null))switch(n.tag){case 3:Ja(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Ja(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[Si]=e,e.stateNode=i}return cn(e),null;case 13:if(wt(bt),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(At&&zn!==null&&e.mode&1&&!(e.flags&128))Mv(),uo(),e.flags|=98560,s=!1;else if(s=Qa(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(de(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(de(317));s[Si]=e}else uo(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;cn(e),s=!1}else di!==null&&(gh(di),di=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||bt.current&1?Vt===0&&(Vt=3):Sd())),e.updateQueue!==null&&(e.flags|=4),cn(e),null);case 4:return ho(),lh(n,e),n===null&&ya(e.stateNode.containerInfo),cn(e),null;case 10:return sd(e.type._context),cn(e),null;case 17:return Rn(e.type)&&cc(),cn(e),null;case 19:if(wt(bt),s=e.memoizedState,s===null)return cn(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Uo(s,!1);else{if(Vt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=gc(n),o!==null){for(e.flags|=128,Uo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return _t(bt,bt.current&1|2),e.child}n=n.sibling}s.tail!==null&&Ft()>mo&&(e.flags|=128,i=!0,Uo(s,!1),e.lanes=4194304)}else{if(!i)if(n=gc(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),Uo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!At)return cn(e),null}else 2*Ft()-s.renderingStartTime>mo&&t!==1073741824&&(e.flags|=128,i=!0,Uo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Ft(),e.sibling=null,t=bt.current,_t(bt,i?t&1|2:t&1),e):(cn(e),null);case 22:case 23:return Md(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Un&1073741824&&(cn(e),e.subtreeFlags&6&&(e.flags|=8192)):cn(e),null;case 24:return null;case 25:return null}throw Error(de(156,e.tag))}function IM(n,e){switch(td(e),e.tag){case 1:return Rn(e.type)&&cc(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return ho(),wt(bn),wt(gn),ud(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return cd(e),null;case 13:if(wt(bt),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(de(340));uo()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return wt(bt),null;case 4:return ho(),null;case 10:return sd(e.type._context),null;case 22:case 23:return Md(),null;case 24:return null;default:return null}}var nl=!1,hn=!1,UM=typeof WeakSet=="function"?WeakSet:Set,be=null;function qs(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Nt(n,e,i)}else t.current=null}function ch(n,e,t){try{t()}catch(i){Nt(n,e,i)}}var Yp=!1;function FM(n,e){if(Xf=sc,n=lv(),Qh(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,u=0,f=n,h=null;t:for(;;){for(var p;f!==t||r!==0&&f.nodeType!==3||(a=o+r),f!==s||i!==0&&f.nodeType!==3||(l=o+i),f.nodeType===3&&(o+=f.nodeValue.length),(p=f.firstChild)!==null;)h=f,f=p;for(;;){if(f===n)break t;if(h===t&&++c===r&&(a=o),h===s&&++u===i&&(l=o),(p=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Yf={focusedElem:n,selectionRange:t},sc=!1,be=e;be!==null;)if(e=be,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,be=n;else for(;be!==null;){e=be;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var _=v.memoizedProps,m=v.memoizedState,d=e.stateNode,x=d.getSnapshotBeforeUpdate(e.elementType===e.type?_:ci(e.type,_),m);d.__reactInternalSnapshotBeforeUpdate=x}break;case 3:var g=e.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(de(163))}}catch(M){Nt(e,e.return,M)}if(n=e.sibling,n!==null){n.return=e.return,be=n;break}be=e.return}return v=Yp,Yp=!1,v}function sa(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&ch(e,t,s)}r=r.next}while(r!==i)}}function Hc(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function uh(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function rx(n){var e=n.alternate;e!==null&&(n.alternate=null,rx(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[Si],delete e[Sa],delete e[Kf],delete e[xM],delete e[_M])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function sx(n){return n.tag===5||n.tag===3||n.tag===4}function qp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||sx(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function fh(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=lc));else if(i!==4&&(n=n.child,n!==null))for(fh(n,e,t),n=n.sibling;n!==null;)fh(n,e,t),n=n.sibling}function hh(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(hh(n,e,t),n=n.sibling;n!==null;)hh(n,e,t),n=n.sibling}var Kt=null,fi=!1;function Qi(n,e,t){for(t=t.child;t!==null;)ox(n,e,t),t=t.sibling}function ox(n,e,t){if(Ai&&typeof Ai.onCommitFiberUnmount=="function")try{Ai.onCommitFiberUnmount(Uc,t)}catch{}switch(t.tag){case 5:hn||qs(t,e);case 6:var i=Kt,r=fi;Kt=null,Qi(n,e,t),Kt=i,fi=r,Kt!==null&&(fi?(n=Kt,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Kt.removeChild(t.stateNode));break;case 18:Kt!==null&&(fi?(n=Kt,t=t.stateNode,n.nodeType===8?wu(n.parentNode,t):n.nodeType===1&&wu(n,t),va(n)):wu(Kt,t.stateNode));break;case 4:i=Kt,r=fi,Kt=t.stateNode.containerInfo,fi=!0,Qi(n,e,t),Kt=i,fi=r;break;case 0:case 11:case 14:case 15:if(!hn&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&ch(t,e,o),r=r.next}while(r!==i)}Qi(n,e,t);break;case 1:if(!hn&&(qs(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){Nt(t,e,a)}Qi(n,e,t);break;case 21:Qi(n,e,t);break;case 22:t.mode&1?(hn=(i=hn)||t.memoizedState!==null,Qi(n,e,t),hn=i):Qi(n,e,t);break;default:Qi(n,e,t)}}function $p(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new UM),e.forEach(function(i){var r=jM.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function si(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Kt=a.stateNode,fi=!1;break e;case 3:Kt=a.stateNode.containerInfo,fi=!0;break e;case 4:Kt=a.stateNode.containerInfo,fi=!0;break e}a=a.return}if(Kt===null)throw Error(de(160));ox(s,o,r),Kt=null,fi=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Nt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)ax(e,n),e=e.sibling}function ax(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(si(e,n),_i(n),i&4){try{sa(3,n,n.return),Hc(3,n)}catch(_){Nt(n,n.return,_)}try{sa(5,n,n.return)}catch(_){Nt(n,n.return,_)}}break;case 1:si(e,n),_i(n),i&512&&t!==null&&qs(t,t.return);break;case 5:if(si(e,n),_i(n),i&512&&t!==null&&qs(t,t.return),n.flags&32){var r=n.stateNode;try{da(r,"")}catch(_){Nt(n,n.return,_)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Rg(r,s),Ff(a,o);var c=Ff(a,s);for(o=0;o<l.length;o+=2){var u=l[o],f=l[o+1];u==="style"?Ig(r,f):u==="dangerouslySetInnerHTML"?Dg(r,f):u==="children"?da(r,f):Bh(r,u,f,c)}switch(a){case"input":Lf(r,s);break;case"textarea":Pg(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Qs(r,!!s.multiple,p,!1):h!==!!s.multiple&&(s.defaultValue!=null?Qs(r,!!s.multiple,s.defaultValue,!0):Qs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Sa]=s}catch(_){Nt(n,n.return,_)}}break;case 6:if(si(e,n),_i(n),i&4){if(n.stateNode===null)throw Error(de(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(_){Nt(n,n.return,_)}}break;case 3:if(si(e,n),_i(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{va(e.containerInfo)}catch(_){Nt(n,n.return,_)}break;case 4:si(e,n),_i(n);break;case 13:si(e,n),_i(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(_d=Ft())),i&4&&$p(n);break;case 22:if(u=t!==null&&t.memoizedState!==null,n.mode&1?(hn=(c=hn)||u,si(e,n),hn=c):si(e,n),_i(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!u&&n.mode&1)for(be=n,u=n.child;u!==null;){for(f=be=u;be!==null;){switch(h=be,p=h.child,h.tag){case 0:case 11:case 14:case 15:sa(4,h,h.return);break;case 1:qs(h,h.return);var v=h.stateNode;if(typeof v.componentWillUnmount=="function"){i=h,t=h.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(_){Nt(i,t,_)}}break;case 5:qs(h,h.return);break;case 22:if(h.memoizedState!==null){Zp(f);continue}}p!==null?(p.return=h,be=p):Zp(f)}u=u.sibling}e:for(u=null,f=n;;){if(f.tag===5){if(u===null){u=f;try{r=f.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=f.stateNode,l=f.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Ng("display",o))}catch(_){Nt(n,n.return,_)}}}else if(f.tag===6){if(u===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(_){Nt(n,n.return,_)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===n)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===n)break e;for(;f.sibling===null;){if(f.return===null||f.return===n)break e;u===f&&(u=null),f=f.return}u===f&&(u=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:si(e,n),_i(n),i&4&&$p(n);break;case 21:break;default:si(e,n),_i(n)}}function _i(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(sx(t)){var i=t;break e}t=t.return}throw Error(de(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(da(r,""),i.flags&=-33);var s=qp(n);hh(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=qp(n);fh(n,a,o);break;default:throw Error(de(161))}}catch(l){Nt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function kM(n,e,t){be=n,lx(n)}function lx(n,e,t){for(var i=(n.mode&1)!==0;be!==null;){var r=be,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||nl;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||hn;a=nl;var c=hn;if(nl=o,(hn=l)&&!c)for(be=r;be!==null;)o=be,l=o.child,o.tag===22&&o.memoizedState!==null?Jp(r):l!==null?(l.return=o,be=l):Jp(r);for(;s!==null;)be=s,lx(s),s=s.sibling;be=r,nl=a,hn=c}Kp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,be=s):Kp(n)}}function Kp(n){for(;be!==null;){var e=be;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:hn||Hc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!hn)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:ci(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Ip(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Ip(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var f=u.dehydrated;f!==null&&va(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(de(163))}hn||e.flags&512&&uh(e)}catch(h){Nt(e,e.return,h)}}if(e===n){be=null;break}if(t=e.sibling,t!==null){t.return=e.return,be=t;break}be=e.return}}function Zp(n){for(;be!==null;){var e=be;if(e===n){be=null;break}var t=e.sibling;if(t!==null){t.return=e.return,be=t;break}be=e.return}}function Jp(n){for(;be!==null;){var e=be;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{Hc(4,e)}catch(l){Nt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Nt(e,r,l)}}var s=e.return;try{uh(e)}catch(l){Nt(e,s,l)}break;case 5:var o=e.return;try{uh(e)}catch(l){Nt(e,o,l)}}}catch(l){Nt(e,e.return,l)}if(e===n){be=null;break}var a=e.sibling;if(a!==null){a.return=e.return,be=a;break}be=e.return}}var zM=Math.ceil,_c=Ji.ReactCurrentDispatcher,vd=Ji.ReactCurrentOwner,ti=Ji.ReactCurrentBatchConfig,it=0,$t=null,Ot=null,rn=0,Un=0,$s=Dr(0),Vt=0,ba=null,as=0,Wc=0,xd=0,oa=null,Tn=null,_d=0,mo=1/0,zi=null,yc=!1,dh=null,Mr=null,il=!1,pr=null,Mc=0,aa=0,ph=null,Yl=-1,ql=0;function Mn(){return it&6?Ft():Yl!==-1?Yl:Yl=Ft()}function Sr(n){return n.mode&1?it&2&&rn!==0?rn&-rn:MM.transition!==null?(ql===0&&(ql=Xg()),ql):(n=ut,n!==0||(n=window.event,n=n===void 0?16:Qg(n.type)),n):1}function vi(n,e,t,i){if(50<aa)throw aa=0,ph=null,Error(de(185));Ua(n,t,i),(!(it&2)||n!==$t)&&(n===$t&&(!(it&2)&&(Wc|=t),Vt===4&&fr(n,rn)),Pn(n,i),t===1&&it===0&&!(e.mode&1)&&(mo=Ft()+500,Bc&&Nr()))}function Pn(n,e){var t=n.callbackNode;My(n,e);var i=rc(n,n===$t?rn:0);if(i===0)t!==null&&ap(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&ap(t),e===1)n.tag===0?yM(Qp.bind(null,n)):xv(Qp.bind(null,n)),gM(function(){!(it&6)&&Nr()}),t=null;else{switch(Yg(i)){case 1:t=jh;break;case 4:t=Wg;break;case 16:t=ic;break;case 536870912:t=jg;break;default:t=ic}t=gx(t,cx.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function cx(n,e){if(Yl=-1,ql=0,it&6)throw Error(de(327));var t=n.callbackNode;if(ro()&&n.callbackNode!==t)return null;var i=rc(n,n===$t?rn:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Sc(n,i);else{e=i;var r=it;it|=2;var s=fx();($t!==n||rn!==e)&&(zi=null,mo=Ft()+500,Qr(n,e));do try{GM();break}catch(a){ux(n,a)}while(!0);rd(),_c.current=s,it=r,Ot!==null?e=0:($t=null,rn=0,e=Vt)}if(e!==0){if(e===2&&(r=Gf(n),r!==0&&(i=r,e=mh(n,r))),e===1)throw t=ba,Qr(n,0),fr(n,i),Pn(n,Ft()),t;if(e===6)fr(n,i);else{if(r=n.current.alternate,!(i&30)&&!OM(r)&&(e=Sc(n,i),e===2&&(s=Gf(n),s!==0&&(i=s,e=mh(n,s))),e===1))throw t=ba,Qr(n,0),fr(n,i),Pn(n,Ft()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(de(345));case 2:jr(n,Tn,zi);break;case 3:if(fr(n,i),(i&130023424)===i&&(e=_d+500-Ft(),10<e)){if(rc(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){Mn(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=$f(jr.bind(null,n,Tn,zi),e);break}jr(n,Tn,zi);break;case 4:if(fr(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-gi(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Ft()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*zM(i/1960))-i,10<i){n.timeoutHandle=$f(jr.bind(null,n,Tn,zi),i);break}jr(n,Tn,zi);break;case 5:jr(n,Tn,zi);break;default:throw Error(de(329))}}}return Pn(n,Ft()),n.callbackNode===t?cx.bind(null,n):null}function mh(n,e){var t=oa;return n.current.memoizedState.isDehydrated&&(Qr(n,e).flags|=256),n=Sc(n,e),n!==2&&(e=Tn,Tn=t,e!==null&&gh(e)),n}function gh(n){Tn===null?Tn=n:Tn.push.apply(Tn,n)}function OM(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!xi(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function fr(n,e){for(e&=~xd,e&=~Wc,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-gi(e),i=1<<t;n[t]=-1,e&=~i}}function Qp(n){if(it&6)throw Error(de(327));ro();var e=rc(n,0);if(!(e&1))return Pn(n,Ft()),null;var t=Sc(n,e);if(n.tag!==0&&t===2){var i=Gf(n);i!==0&&(e=i,t=mh(n,i))}if(t===1)throw t=ba,Qr(n,0),fr(n,e),Pn(n,Ft()),t;if(t===6)throw Error(de(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,jr(n,Tn,zi),Pn(n,Ft()),null}function yd(n,e){var t=it;it|=1;try{return n(e)}finally{it=t,it===0&&(mo=Ft()+500,Bc&&Nr())}}function ls(n){pr!==null&&pr.tag===0&&!(it&6)&&ro();var e=it;it|=1;var t=ti.transition,i=ut;try{if(ti.transition=null,ut=1,n)return n()}finally{ut=i,ti.transition=t,it=e,!(it&6)&&Nr()}}function Md(){Un=$s.current,wt($s)}function Qr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,mM(t)),Ot!==null)for(t=Ot.return;t!==null;){var i=t;switch(td(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&cc();break;case 3:ho(),wt(bn),wt(gn),ud();break;case 5:cd(i);break;case 4:ho();break;case 13:wt(bt);break;case 19:wt(bt);break;case 10:sd(i.type._context);break;case 22:case 23:Md()}t=t.return}if($t=n,Ot=n=wr(n.current,null),rn=Un=e,Vt=0,ba=null,xd=Wc=as=0,Tn=oa=null,Zr!==null){for(e=0;e<Zr.length;e++)if(t=Zr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Zr=null}return n}function ux(n,e){do{var t=Ot;try{if(rd(),Wl.current=xc,vc){for(var i=Pt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}vc=!1}if(os=0,qt=Gt=Pt=null,ra=!1,Ta=0,vd.current=null,t===null||t.return===null){Vt=1,ba=e,Ot=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=rn,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=a,f=u.tag;if(!(u.mode&1)&&(f===0||f===11||f===15)){var h=u.alternate;h?(u.updateQueue=h.updateQueue,u.memoizedState=h.memoizedState,u.lanes=h.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=Bp(o);if(p!==null){p.flags&=-257,Gp(p,o,a,s,e),p.mode&1&&Op(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var _=new Set;_.add(l),e.updateQueue=_}else v.add(l);break e}else{if(!(e&1)){Op(s,c,e),Sd();break e}l=Error(de(426))}}else if(At&&a.mode&1){var m=Bp(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),Gp(m,o,a,s,e),nd(po(l,a));break e}}s=l=po(l,a),Vt!==4&&(Vt=2),oa===null?oa=[s]:oa.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=Yv(s,l,e);Np(s,d);break e;case 1:a=l;var x=s.type,g=s.stateNode;if(!(s.flags&128)&&(typeof x.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(Mr===null||!Mr.has(g)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=qv(s,a,e);Np(s,M);break e}}s=s.return}while(s!==null)}dx(t)}catch(T){e=T,Ot===t&&t!==null&&(Ot=t=t.return);continue}break}while(!0)}function fx(){var n=_c.current;return _c.current=xc,n===null?xc:n}function Sd(){(Vt===0||Vt===3||Vt===2)&&(Vt=4),$t===null||!(as&268435455)&&!(Wc&268435455)||fr($t,rn)}function Sc(n,e){var t=it;it|=2;var i=fx();($t!==n||rn!==e)&&(zi=null,Qr(n,e));do try{BM();break}catch(r){ux(n,r)}while(!0);if(rd(),it=t,_c.current=i,Ot!==null)throw Error(de(261));return $t=null,rn=0,Vt}function BM(){for(;Ot!==null;)hx(Ot)}function GM(){for(;Ot!==null&&!hy();)hx(Ot)}function hx(n){var e=mx(n.alternate,n,Un);n.memoizedProps=n.pendingProps,e===null?dx(n):Ot=e,vd.current=null}function dx(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=IM(t,e),t!==null){t.flags&=32767,Ot=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Vt=6,Ot=null;return}}else if(t=NM(t,e,Un),t!==null){Ot=t;return}if(e=e.sibling,e!==null){Ot=e;return}Ot=e=n}while(e!==null);Vt===0&&(Vt=5)}function jr(n,e,t){var i=ut,r=ti.transition;try{ti.transition=null,ut=1,VM(n,e,t,i)}finally{ti.transition=r,ut=i}return null}function VM(n,e,t,i){do ro();while(pr!==null);if(it&6)throw Error(de(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(de(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(Sy(n,s),n===$t&&(Ot=$t=null,rn=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||il||(il=!0,gx(ic,function(){return ro(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=ti.transition,ti.transition=null;var o=ut;ut=1;var a=it;it|=4,vd.current=null,FM(n,t),ax(t,n),lM(Yf),sc=!!Xf,Yf=Xf=null,n.current=t,kM(t),dy(),it=a,ut=o,ti.transition=s}else n.current=t;if(il&&(il=!1,pr=n,Mc=r),s=n.pendingLanes,s===0&&(Mr=null),gy(t.stateNode),Pn(n,Ft()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(yc)throw yc=!1,n=dh,dh=null,n;return Mc&1&&n.tag!==0&&ro(),s=n.pendingLanes,s&1?n===ph?aa++:(aa=0,ph=n):aa=0,Nr(),null}function ro(){if(pr!==null){var n=Yg(Mc),e=ti.transition,t=ut;try{if(ti.transition=null,ut=16>n?16:n,pr===null)var i=!1;else{if(n=pr,pr=null,Mc=0,it&6)throw Error(de(331));var r=it;for(it|=4,be=n.current;be!==null;){var s=be,o=s.child;if(be.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(be=c;be!==null;){var u=be;switch(u.tag){case 0:case 11:case 15:sa(8,u,s)}var f=u.child;if(f!==null)f.return=u,be=f;else for(;be!==null;){u=be;var h=u.sibling,p=u.return;if(rx(u),u===c){be=null;break}if(h!==null){h.return=p,be=h;break}be=p}}}var v=s.alternate;if(v!==null){var _=v.child;if(_!==null){v.child=null;do{var m=_.sibling;_.sibling=null,_=m}while(_!==null)}}be=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,be=o;else e:for(;be!==null;){if(s=be,s.flags&2048)switch(s.tag){case 0:case 11:case 15:sa(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,be=d;break e}be=s.return}}var x=n.current;for(be=x;be!==null;){o=be;var g=o.child;if(o.subtreeFlags&2064&&g!==null)g.return=o,be=g;else e:for(o=x;be!==null;){if(a=be,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Hc(9,a)}}catch(T){Nt(a,a.return,T)}if(a===o){be=null;break e}var M=a.sibling;if(M!==null){M.return=a.return,be=M;break e}be=a.return}}if(it=r,Nr(),Ai&&typeof Ai.onPostCommitFiberRoot=="function")try{Ai.onPostCommitFiberRoot(Uc,n)}catch{}i=!0}return i}finally{ut=t,ti.transition=e}}return!1}function em(n,e,t){e=po(t,e),e=Yv(n,e,1),n=yr(n,e,1),e=Mn(),n!==null&&(Ua(n,1,e),Pn(n,e))}function Nt(n,e,t){if(n.tag===3)em(n,n,t);else for(;e!==null;){if(e.tag===3){em(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Mr===null||!Mr.has(i))){n=po(t,n),n=qv(e,n,1),e=yr(e,n,1),n=Mn(),e!==null&&(Ua(e,1,n),Pn(e,n));break}}e=e.return}}function HM(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=Mn(),n.pingedLanes|=n.suspendedLanes&t,$t===n&&(rn&t)===t&&(Vt===4||Vt===3&&(rn&130023424)===rn&&500>Ft()-_d?Qr(n,0):xd|=t),Pn(n,e)}function px(n,e){e===0&&(n.mode&1?(e=Ya,Ya<<=1,!(Ya&130023424)&&(Ya=4194304)):e=1);var t=Mn();n=Ki(n,e),n!==null&&(Ua(n,e,t),Pn(n,t))}function WM(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),px(n,t)}function jM(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(de(314))}i!==null&&i.delete(e),px(n,t)}var mx;mx=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||bn.current)Cn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return Cn=!1,DM(n,e,t);Cn=!!(n.flags&131072)}else Cn=!1,At&&e.flags&1048576&&_v(e,hc,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Xl(n,e),n=e.pendingProps;var r=co(e,gn.current);io(e,t),r=hd(null,e,i,n,r,t);var s=dd();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Rn(i)?(s=!0,uc(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,ad(e),r.updater=Vc,e.stateNode=r,r._reactInternals=e,nh(e,i,n,t),e=sh(null,e,i,!0,s,t)):(e.tag=0,At&&s&&ed(e),yn(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(Xl(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=YM(i),n=ci(i,n),r){case 0:e=rh(null,e,i,n,t);break e;case 1:e=Wp(null,e,i,n,t);break e;case 11:e=Vp(null,e,i,n,t);break e;case 14:e=Hp(null,e,i,ci(i.type,n),t);break e}throw Error(de(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ci(i,r),rh(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ci(i,r),Wp(n,e,i,r,t);case 3:e:{if(Jv(e),n===null)throw Error(de(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Tv(n,e),mc(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=po(Error(de(423)),e),e=jp(n,e,i,t,r);break e}else if(i!==r){r=po(Error(de(424)),e),e=jp(n,e,i,t,r);break e}else for(zn=_r(e.stateNode.containerInfo.firstChild),Vn=e,At=!0,di=null,t=wv(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(uo(),i===r){e=Zi(n,e,t);break e}yn(n,e,i,t)}e=e.child}return e;case 5:return Av(e),n===null&&Qf(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,qf(i,r)?o=null:s!==null&&qf(i,s)&&(e.flags|=32),Zv(n,e),yn(n,e,o,t),e.child;case 6:return n===null&&Qf(e),null;case 13:return Qv(n,e,t);case 4:return ld(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=fo(e,null,i,t):yn(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ci(i,r),Vp(n,e,i,r,t);case 7:return yn(n,e,e.pendingProps,t),e.child;case 8:return yn(n,e,e.pendingProps.children,t),e.child;case 12:return yn(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,_t(dc,i._currentValue),i._currentValue=o,s!==null)if(xi(s.value,o)){if(s.children===r.children&&!bn.current){e=Zi(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Xi(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),eh(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(de(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),eh(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}yn(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,io(e,t),r=ii(r),i=i(r),e.flags|=1,yn(n,e,i,t),e.child;case 14:return i=e.type,r=ci(i,e.pendingProps),r=ci(i.type,r),Hp(n,e,i,r,t);case 15:return $v(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ci(i,r),Xl(n,e),e.tag=1,Rn(i)?(n=!0,uc(e)):n=!1,io(e,t),Xv(e,i,r),nh(e,i,r,t),sh(null,e,i,!0,n,t);case 19:return ex(n,e,t);case 22:return Kv(n,e,t)}throw Error(de(156,e.tag))};function gx(n,e){return Hg(n,e)}function XM(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Qn(n,e,t,i){return new XM(n,e,t,i)}function wd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function YM(n){if(typeof n=="function")return wd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Vh)return 11;if(n===Hh)return 14}return 2}function wr(n,e){var t=n.alternate;return t===null?(t=Qn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function $l(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")wd(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case Os:return es(t.children,r,s,e);case Gh:o=8,r|=8;break;case Af:return n=Qn(12,t,e,r|2),n.elementType=Af,n.lanes=s,n;case Cf:return n=Qn(13,t,e,r),n.elementType=Cf,n.lanes=s,n;case bf:return n=Qn(19,t,e,r),n.elementType=bf,n.lanes=s,n;case Ag:return jc(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case Eg:o=10;break e;case Tg:o=9;break e;case Vh:o=11;break e;case Hh:o=14;break e;case or:o=16,i=null;break e}throw Error(de(130,n==null?n:typeof n,""))}return e=Qn(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function es(n,e,t,i){return n=Qn(7,n,i,e),n.lanes=t,n}function jc(n,e,t,i){return n=Qn(22,n,i,e),n.elementType=Ag,n.lanes=t,n.stateNode={isHidden:!1},n}function Lu(n,e,t){return n=Qn(6,n,null,e),n.lanes=t,n}function Du(n,e,t){return e=Qn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function qM(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=hu(0),this.expirationTimes=hu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=hu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Ed(n,e,t,i,r,s,o,a,l){return n=new qM(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Qn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},ad(s),n}function $M(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:zs,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function vx(n){if(!n)return Cr;n=n._reactInternals;e:{if(fs(n)!==n||n.tag!==1)throw Error(de(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Rn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(de(171))}if(n.tag===1){var t=n.type;if(Rn(t))return vv(n,t,e)}return e}function xx(n,e,t,i,r,s,o,a,l){return n=Ed(t,i,!0,n,r,s,o,a,l),n.context=vx(null),t=n.current,i=Mn(),r=Sr(t),s=Xi(i,r),s.callback=e??null,yr(t,s,r),n.current.lanes=r,Ua(n,r,i),Pn(n,i),n}function Xc(n,e,t,i){var r=e.current,s=Mn(),o=Sr(r);return t=vx(t),e.context===null?e.context=t:e.pendingContext=t,e=Xi(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=yr(r,e,o),n!==null&&(vi(n,r,o,s),Hl(n,r,o)),o}function wc(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function tm(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function Td(n,e){tm(n,e),(n=n.alternate)&&tm(n,e)}function KM(){return null}var _x=typeof reportError=="function"?reportError:function(n){console.error(n)};function Ad(n){this._internalRoot=n}Yc.prototype.render=Ad.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(de(409));Xc(n,e,null,null)};Yc.prototype.unmount=Ad.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;ls(function(){Xc(null,n,null,null)}),e[$i]=null}};function Yc(n){this._internalRoot=n}Yc.prototype.unstable_scheduleHydration=function(n){if(n){var e=Kg();n={blockedOn:null,target:n,priority:e};for(var t=0;t<ur.length&&e!==0&&e<ur[t].priority;t++);ur.splice(t,0,n),t===0&&Jg(n)}};function Cd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function qc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function nm(){}function ZM(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=wc(o);s.call(c)}}var o=xx(e,i,n,0,null,!1,!1,"",nm);return n._reactRootContainer=o,n[$i]=o.current,ya(n.nodeType===8?n.parentNode:n),ls(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=wc(l);a.call(c)}}var l=Ed(n,0,!1,null,null,!1,!1,"",nm);return n._reactRootContainer=l,n[$i]=l.current,ya(n.nodeType===8?n.parentNode:n),ls(function(){Xc(e,l,t,i)}),l}function $c(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=wc(o);a.call(l)}}Xc(e,o,n,r)}else o=ZM(t,e,n,r,i);return wc(o)}qg=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=Ko(e.pendingLanes);t!==0&&(Xh(e,t|1),Pn(e,Ft()),!(it&6)&&(mo=Ft()+500,Nr()))}break;case 13:ls(function(){var i=Ki(n,1);if(i!==null){var r=Mn();vi(i,n,1,r)}}),Td(n,1)}};Yh=function(n){if(n.tag===13){var e=Ki(n,134217728);if(e!==null){var t=Mn();vi(e,n,134217728,t)}Td(n,134217728)}};$g=function(n){if(n.tag===13){var e=Sr(n),t=Ki(n,e);if(t!==null){var i=Mn();vi(t,n,e,i)}Td(n,e)}};Kg=function(){return ut};Zg=function(n,e){var t=ut;try{return ut=n,e()}finally{ut=t}};zf=function(n,e,t){switch(e){case"input":if(Lf(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=Oc(i);if(!r)throw Error(de(90));bg(i),Lf(i,r)}}}break;case"textarea":Pg(n,t);break;case"select":e=t.value,e!=null&&Qs(n,!!t.multiple,e,!1)}};kg=yd;zg=ls;var JM={usingClientEntryPoint:!1,Events:[ka,Hs,Oc,Ug,Fg,yd]},Fo={findFiberByHostInstance:Kr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},QM={bundleType:Fo.bundleType,version:Fo.version,rendererPackageName:Fo.rendererPackageName,rendererConfig:Fo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ji.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Gg(n),n===null?null:n.stateNode},findFiberByHostInstance:Fo.findFiberByHostInstance||KM,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var rl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!rl.isDisabled&&rl.supportsFiber)try{Uc=rl.inject(QM),Ai=rl}catch{}}Xn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=JM;Xn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Cd(e))throw Error(de(200));return $M(n,e,null,t)};Xn.createRoot=function(n,e){if(!Cd(n))throw Error(de(299));var t=!1,i="",r=_x;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Ed(n,1,!1,null,null,t,!1,i,r),n[$i]=e.current,ya(n.nodeType===8?n.parentNode:n),new Ad(e)};Xn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(de(188)):(n=Object.keys(n).join(","),Error(de(268,n)));return n=Gg(e),n=n===null?null:n.stateNode,n};Xn.flushSync=function(n){return ls(n)};Xn.hydrate=function(n,e,t){if(!qc(e))throw Error(de(200));return $c(null,n,e,!0,t)};Xn.hydrateRoot=function(n,e,t){if(!Cd(n))throw Error(de(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=_x;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=xx(e,null,n,1,t??null,r,!1,s,o),n[$i]=e.current,ya(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new Yc(e)};Xn.render=function(n,e,t){if(!qc(e))throw Error(de(200));return $c(null,n,e,!1,t)};Xn.unmountComponentAtNode=function(n){if(!qc(n))throw Error(de(40));return n._reactRootContainer?(ls(function(){$c(null,null,n,!1,function(){n._reactRootContainer=null,n[$i]=null})}),!0):!1};Xn.unstable_batchedUpdates=yd;Xn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!qc(t))throw Error(de(200));if(n==null||n._reactInternals===void 0)throw Error(de(38));return $c(n,e,t,!1,i)};Xn.version="18.3.1-next-f1338f8080-20240426";function yx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(yx)}catch(n){console.error(n)}}yx(),yg.exports=Xn;var e1=yg.exports,im=e1;Ef.createRoot=im.createRoot,Ef.hydrateRoot=im.hydrateRoot;const Mx=at.createContext(null);function t1({children:n,engineRef:e}){return C.jsx(Mx.Provider,{value:e,children:n})}function Kc(){return at.useContext(Mx)}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const bd="162",Bi={ROTATE:0,DOLLY:1,PAN:2},lr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},n1=0,rm=1,i1=2,Sx=1,wx=2,ki=3,br=0,pn=1,mt=2,Er=0,so=1,sm=2,om=3,am=4,r1=5,Yr=100,s1=101,o1=102,lm=103,cm=104,a1=200,l1=201,c1=202,u1=203,vh=204,xh=205,f1=206,h1=207,d1=208,p1=209,m1=210,g1=211,v1=212,x1=213,_1=214,y1=0,M1=1,S1=2,Ec=3,w1=4,E1=5,T1=6,A1=7,Ex=0,C1=1,b1=2,Tr=0,R1=1,P1=2,L1=3,Tx=4,D1=5,N1=6,I1=7,Ax=300,go=301,vo=302,_h=303,yh=304,Zc=306,Mh=1e3,Fn=1001,Sh=1002,Jt=1003,um=1004,ko=1005,Zt=1006,Nu=1007,mr=1008,bi=1009,U1=1010,F1=1011,Rd=1012,Cx=1013,Wi=1014,wi=1015,Ra=1016,bx=1017,Rx=1018,ts=1020,k1=1021,kn=1023,z1=1024,O1=1025,ns=1026,xo=1027,Px=1028,Lx=1029,B1=1030,Dx=1031,Nx=1033,Iu=33776,Uu=33777,Fu=33778,ku=33779,fm=35840,hm=35841,dm=35842,pm=35843,Ix=36196,mm=37492,gm=37496,vm=37808,xm=37809,_m=37810,ym=37811,Mm=37812,Sm=37813,wm=37814,Em=37815,Tm=37816,Am=37817,Cm=37818,bm=37819,Rm=37820,Pm=37821,zu=36492,Lm=36494,Dm=36495,G1=36283,Nm=36284,Im=36285,Um=36286,V1=3200,H1=3201,Ux=0,W1=1,hr="",hi="srgb",Ir="srgb-linear",Pd="display-p3",Jc="display-p3-linear",Tc="linear",St="srgb",Ac="rec709",Cc="p3",gs=7680,Fm=519,j1=512,X1=513,Y1=514,Fx=515,q1=516,$1=517,K1=518,Z1=519,wh=35044,km="300 es",Eh=1035,ji=2e3,bc=2001;class hs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Kl=Math.PI/180,Th=180/Math.PI;function Yi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]+"-"+un[e&255]+un[e>>8&255]+"-"+un[e>>16&15|64]+un[e>>24&255]+"-"+un[t&63|128]+un[t>>8&255]+"-"+un[t>>16&255]+un[t>>24&255]+un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]).toLowerCase()}function Qt(n,e,t){return Math.max(e,Math.min(t,n))}function J1(n,e){return(n%e+e)%e}function Ou(n,e,t){return(1-t)*n+t*e}function zm(n){return(n&n-1)===0&&n!==0}function Ah(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ei(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ht(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Q1={DEG2RAD:Kl};class le{constructor(e=0,t=0){le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,i,r,s,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],p=i[5],v=i[8],_=r[0],m=r[3],d=r[6],x=r[1],g=r[4],M=r[7],T=r[2],E=r[5],S=r[8];return s[0]=o*_+a*x+l*T,s[3]=o*m+a*g+l*E,s[6]=o*d+a*M+l*S,s[1]=c*_+u*x+f*T,s[4]=c*m+u*g+f*E,s[7]=c*d+u*M+f*S,s[2]=h*_+p*x+v*T,s[5]=h*m+p*g+v*E,s[8]=h*d+p*M+v*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,p=c*s-o*l,v=t*f+i*h+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return e[0]=f*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=h*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Bu.makeScale(e,t)),this}rotate(e){return this.premultiply(Bu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Bu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Bu=new Ke;function kx(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Rc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function eS(){const n=Rc("canvas");return n.style.display="block",n}const Om={};function zx(n){n in Om||(Om[n]=!0,console.warn(n))}const Bm=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Gm=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),sl={[Ir]:{transfer:Tc,primaries:Ac,toReference:n=>n,fromReference:n=>n},[hi]:{transfer:St,primaries:Ac,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Jc]:{transfer:Tc,primaries:Cc,toReference:n=>n.applyMatrix3(Gm),fromReference:n=>n.applyMatrix3(Bm)},[Pd]:{transfer:St,primaries:Cc,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Gm),fromReference:n=>n.applyMatrix3(Bm).convertLinearToSRGB()}},tS=new Set([Ir,Jc]),dt={enabled:!0,_workingColorSpace:Ir,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!tS.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=sl[e].toReference,r=sl[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return sl[n].primaries},getTransfer:function(n){return n===hr?Tc:sl[n].transfer}};function oo(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Gu(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vs;class Ox{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{vs===void 0&&(vs=Rc("canvas")),vs.width=e.width,vs.height=e.height;const i=vs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=vs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rc("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=oo(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(oo(t[i]/255)*255):t[i]=oo(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nS=0;class Bx{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nS++}),this.uuid=Yi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Vu(r[o].image)):s.push(Vu(r[o]))}else s=Vu(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Vu(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ox.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let iS=0;class mn extends hs{constructor(e=mn.DEFAULT_IMAGE,t=mn.DEFAULT_MAPPING,i=Fn,r=Fn,s=Zt,o=mr,a=kn,l=bi,c=mn.DEFAULT_ANISOTROPY,u=hr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iS++}),this.uuid=Yi(),this.name="",this.source=new Bx(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ax)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mh:e.x=e.x-Math.floor(e.x);break;case Fn:e.x=e.x<0?0:1;break;case Sh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mh:e.y=e.y-Math.floor(e.y);break;case Fn:e.y=e.y<0?0:1;break;case Sh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}}mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=Ax;mn.DEFAULT_ANISOTROPY=1;class Bt{constructor(e=0,t=0,i=0,r=1){Bt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],p=l[5],v=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(v-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const g=(c+1)/2,M=(p+1)/2,T=(d+1)/2,E=(u+h)/4,S=(f+_)/4,b=(v+m)/4;return g>M&&g>T?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=E/i,s=S/i):M>T?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=E/r,s=b/r):T<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),i=S/s,r=b/s),this.set(i,r,s,t),this}let x=Math.sqrt((m-v)*(m-v)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(x)<.001&&(x=1),this.x=(m-v)/x,this.y=(f-_)/x,this.z=(h-u)/x,this.w=Math.acos((c+p+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rS extends hs{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Bt(0,0,e,t),this.scissorTest=!1,this.viewport=new Bt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0,count:1},i);const s=new mn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Bx(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Rr extends rS{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Gx extends mn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sS extends mn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pr{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const h=s[o+0],p=s[o+1],v=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(a===1){e[t+0]=h,e[t+1]=p,e[t+2]=v,e[t+3]=_;return}if(f!==_||l!==h||c!==p||u!==v){let m=1-a;const d=l*h+c*p+u*v+f*_,x=d>=0?1:-1,g=1-d*d;if(g>Number.EPSILON){const T=Math.sqrt(g),E=Math.atan2(T,d*x);m=Math.sin(m*E)/T,a=Math.sin(a*E)/T}const M=a*x;if(l=l*m+h*M,c=c*m+p*M,u=u*m+v*M,f=f*m+_*M,m===1-a){const T=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=T,c*=T,u*=T,f*=T}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],p=s[o+2],v=s[o+3];return e[t]=a*v+u*f+l*p-c*h,e[t+1]=l*v+u*h+c*f-a*p,e[t+2]=c*v+u*p+a*h-l*f,e[t+3]=u*v-a*f-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*p*v,this._y=c*p*f-h*u*v,this._z=c*u*v+h*p*f,this._w=c*u*f-h*p*v;break;case"YXZ":this._x=h*u*f+c*p*v,this._y=c*p*f-h*u*v,this._z=c*u*v-h*p*f,this._w=c*u*f+h*p*v;break;case"ZXY":this._x=h*u*f-c*p*v,this._y=c*p*f+h*u*v,this._z=c*u*v+h*p*f,this._w=c*u*f-h*p*v;break;case"ZYX":this._x=h*u*f-c*p*v,this._y=c*p*f+h*u*v,this._z=c*u*v-h*p*f,this._w=c*u*f+h*p*v;break;case"YZX":this._x=h*u*f+c*p*v,this._y=c*p*f+h*u*v,this._z=c*u*v-h*p*f,this._w=c*u*f-h*p*v;break;case"XZY":this._x=h*u*f-c*p*v,this._y=c*p*f-h*u*v,this._z=c*u*v+h*p*f,this._w=c*u*f+h*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=i+a+f;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>f){const p=2*Math.sqrt(1+i-a-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>f){const p=2*Math.sqrt(1+a-i-f);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),f=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,i=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),f=2*(s*i-o*t);return this.x=t+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Hu.copy(this).projectOnVector(e),this.sub(Hu)}reflect(e){return this.sub(Hu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hu=new U,Vm=new Pr;class ds{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(oi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(oi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=oi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,oi):oi.fromBufferAttribute(s,o),oi.applyMatrix4(e.matrixWorld),this.expandByPoint(oi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ol.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ol.copy(i.boundingBox)),ol.applyMatrix4(e.matrixWorld),this.union(ol)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,oi),oi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(zo),al.subVectors(this.max,zo),xs.subVectors(e.a,zo),_s.subVectors(e.b,zo),ys.subVectors(e.c,zo),er.subVectors(_s,xs),tr.subVectors(ys,_s),zr.subVectors(xs,ys);let t=[0,-er.z,er.y,0,-tr.z,tr.y,0,-zr.z,zr.y,er.z,0,-er.x,tr.z,0,-tr.x,zr.z,0,-zr.x,-er.y,er.x,0,-tr.y,tr.x,0,-zr.y,zr.x,0];return!Wu(t,xs,_s,ys,al)||(t=[1,0,0,0,1,0,0,0,1],!Wu(t,xs,_s,ys,al))?!1:(ll.crossVectors(er,tr),t=[ll.x,ll.y,ll.z],Wu(t,xs,_s,ys,al))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,oi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(oi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Di),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Di=[new U,new U,new U,new U,new U,new U,new U,new U],oi=new U,ol=new ds,xs=new U,_s=new U,ys=new U,er=new U,tr=new U,zr=new U,zo=new U,al=new U,ll=new U,Or=new U;function Wu(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Or.fromArray(n,s);const a=r.x*Math.abs(Or.x)+r.y*Math.abs(Or.y)+r.z*Math.abs(Or.z),l=e.dot(Or),c=t.dot(Or),u=i.dot(Or);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const oS=new ds,Oo=new U,ju=new U;class To{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):oS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Oo.subVectors(e,this.center);const t=Oo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Oo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ju.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Oo.copy(e.center).add(ju)),this.expandByPoint(Oo.copy(e.center).sub(ju))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ni=new U,Xu=new U,cl=new U,nr=new U,Yu=new U,ul=new U,qu=new U;class Qc{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ni)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ni.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ni.copy(this.origin).addScaledVector(this.direction,t),Ni.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Xu.copy(e).add(t).multiplyScalar(.5),cl.copy(t).sub(e).normalize(),nr.copy(this.origin).sub(Xu);const s=e.distanceTo(t)*.5,o=-this.direction.dot(cl),a=nr.dot(this.direction),l=-nr.dot(cl),c=nr.lengthSq(),u=Math.abs(1-o*o);let f,h,p,v;if(u>0)if(f=o*l-a,h=o*a-l,v=s*u,f>=0)if(h>=-v)if(h<=v){const _=1/u;f*=_,h*=_,p=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h<=-v?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c):h<=v?(f=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Xu).addScaledVector(cl,h),p}intersectSphere(e,t){Ni.subVectors(e.center,this.origin);const i=Ni.dot(this.direction),r=Ni.dot(Ni)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Ni)!==null}intersectTriangle(e,t,i,r,s){Yu.subVectors(t,e),ul.subVectors(i,e),qu.crossVectors(Yu,ul);let o=this.direction.dot(qu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;nr.subVectors(this.origin,e);const l=a*this.direction.dot(ul.crossVectors(nr,ul));if(l<0)return null;const c=a*this.direction.dot(Yu.cross(nr));if(c<0||l+c>o)return null;const u=-a*nr.dot(qu);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ft{constructor(e,t,i,r,s,o,a,l,c,u,f,h,p,v,_,m){ft.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,f,h,p,v,_,m)}set(e,t,i,r,s,o,a,l,c,u,f,h,p,v,_,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=h,d[3]=p,d[7]=v,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ft().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Ms.setFromMatrixColumn(e,0).length(),s=1/Ms.setFromMatrixColumn(e,1).length(),o=1/Ms.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=o*u,p=o*f,v=a*u,_=a*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=p+v*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=v+p*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,p=l*f,v=c*u,_=c*f;t[0]=h+_*a,t[4]=v*a-p,t[8]=o*c,t[1]=o*f,t[5]=o*u,t[9]=-a,t[2]=p*a-v,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,p=l*f,v=c*u,_=c*f;t[0]=h-_*a,t[4]=-o*f,t[8]=v+p*a,t[1]=p+v*a,t[5]=o*u,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,p=o*f,v=a*u,_=a*f;t[0]=l*u,t[4]=v*c-p,t[8]=h*c+_,t[1]=l*f,t[5]=_*c+h,t[9]=p*c-v,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,v=a*l,_=a*c;t[0]=l*u,t[4]=_-h*f,t[8]=v*f+p,t[1]=f,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*f+v,t[10]=h-_*f}else if(e.order==="XZY"){const h=o*l,p=o*c,v=a*l,_=a*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+_,t[5]=o*u,t[9]=p*f-v,t[2]=v*f-p,t[6]=a*u,t[10]=_*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(aS,e,lS)}lookAt(e,t,i){const r=this.elements;return Nn.subVectors(e,t),Nn.lengthSq()===0&&(Nn.z=1),Nn.normalize(),ir.crossVectors(i,Nn),ir.lengthSq()===0&&(Math.abs(i.z)===1?Nn.x+=1e-4:Nn.z+=1e-4,Nn.normalize(),ir.crossVectors(i,Nn)),ir.normalize(),fl.crossVectors(Nn,ir),r[0]=ir.x,r[4]=fl.x,r[8]=Nn.x,r[1]=ir.y,r[5]=fl.y,r[9]=Nn.y,r[2]=ir.z,r[6]=fl.z,r[10]=Nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],p=i[13],v=i[2],_=i[6],m=i[10],d=i[14],x=i[3],g=i[7],M=i[11],T=i[15],E=r[0],S=r[4],b=r[8],D=r[12],y=r[1],A=r[5],j=r[9],J=r[13],I=r[2],X=r[6],H=r[10],Q=r[14],k=r[3],z=r[7],B=r[11],$=r[15];return s[0]=o*E+a*y+l*I+c*k,s[4]=o*S+a*A+l*X+c*z,s[8]=o*b+a*j+l*H+c*B,s[12]=o*D+a*J+l*Q+c*$,s[1]=u*E+f*y+h*I+p*k,s[5]=u*S+f*A+h*X+p*z,s[9]=u*b+f*j+h*H+p*B,s[13]=u*D+f*J+h*Q+p*$,s[2]=v*E+_*y+m*I+d*k,s[6]=v*S+_*A+m*X+d*z,s[10]=v*b+_*j+m*H+d*B,s[14]=v*D+_*J+m*Q+d*$,s[3]=x*E+g*y+M*I+T*k,s[7]=x*S+g*A+M*X+T*z,s[11]=x*b+g*j+M*H+T*B,s[15]=x*D+g*J+M*Q+T*$,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],p=e[14],v=e[3],_=e[7],m=e[11],d=e[15];return v*(+s*l*f-r*c*f-s*a*h+i*c*h+r*a*p-i*l*p)+_*(+t*l*p-t*c*h+s*o*h-r*o*p+r*c*u-s*l*u)+m*(+t*c*f-t*a*p-s*o*f+i*o*p+s*a*u-i*c*u)+d*(-r*a*u-t*l*f+t*a*h+r*o*f-i*o*h+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],p=e[11],v=e[12],_=e[13],m=e[14],d=e[15],x=f*m*c-_*h*c+_*l*p-a*m*p-f*l*d+a*h*d,g=v*h*c-u*m*c-v*l*p+o*m*p+u*l*d-o*h*d,M=u*_*c-v*f*c+v*a*p-o*_*p-u*a*d+o*f*d,T=v*f*l-u*_*l-v*a*h+o*_*h+u*a*m-o*f*m,E=t*x+i*g+r*M+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/E;return e[0]=x*S,e[1]=(_*h*s-f*m*s-_*r*p+i*m*p+f*r*d-i*h*d)*S,e[2]=(a*m*s-_*l*s+_*r*c-i*m*c-a*r*d+i*l*d)*S,e[3]=(f*l*s-a*h*s-f*r*c+i*h*c+a*r*p-i*l*p)*S,e[4]=g*S,e[5]=(u*m*s-v*h*s+v*r*p-t*m*p-u*r*d+t*h*d)*S,e[6]=(v*l*s-o*m*s-v*r*c+t*m*c+o*r*d-t*l*d)*S,e[7]=(o*h*s-u*l*s+u*r*c-t*h*c-o*r*p+t*l*p)*S,e[8]=M*S,e[9]=(v*f*s-u*_*s-v*i*p+t*_*p+u*i*d-t*f*d)*S,e[10]=(o*_*s-v*a*s+v*i*c-t*_*c-o*i*d+t*a*d)*S,e[11]=(u*a*s-o*f*s-u*i*c+t*f*c+o*i*p-t*a*p)*S,e[12]=T*S,e[13]=(u*_*r-v*f*r+v*i*h-t*_*h-u*i*m+t*f*m)*S,e[14]=(v*a*r-o*_*r-v*i*l+t*_*l+o*i*m-t*a*m)*S,e[15]=(o*f*r-u*a*r+u*i*l-t*f*l-o*i*h+t*a*h)*S,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,f=a+a,h=s*c,p=s*u,v=s*f,_=o*u,m=o*f,d=a*f,x=l*c,g=l*u,M=l*f,T=i.x,E=i.y,S=i.z;return r[0]=(1-(_+d))*T,r[1]=(p+M)*T,r[2]=(v-g)*T,r[3]=0,r[4]=(p-M)*E,r[5]=(1-(h+d))*E,r[6]=(m+x)*E,r[7]=0,r[8]=(v+g)*S,r[9]=(m-x)*S,r[10]=(1-(h+_))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Ms.set(r[0],r[1],r[2]).length();const o=Ms.set(r[4],r[5],r[6]).length(),a=Ms.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ai.copy(this);const c=1/s,u=1/o,f=1/a;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=u,ai.elements[5]*=u,ai.elements[6]*=u,ai.elements[8]*=f,ai.elements[9]*=f,ai.elements[10]*=f,t.setFromRotationMatrix(ai),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=ji){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),f=(t+e)/(t-e),h=(i+r)/(i-r);let p,v;if(a===ji)p=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===bc)p=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=ji){const l=this.elements,c=1/(t-e),u=1/(i-r),f=1/(o-s),h=(t+e)*c,p=(i+r)*u;let v,_;if(a===ji)v=(o+s)*f,_=-2*f;else if(a===bc)v=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ms=new U,ai=new ft,aS=new U(0,0,0),lS=new U(1,1,1),ir=new U,fl=new U,Nn=new U,Hm=new ft,Wm=new Pr;class Ri{constructor(e=0,t=0,i=0,r=Ri.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Qt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Hm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hm,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wm.setFromEuler(this),this.setFromQuaternion(Wm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ri.DEFAULT_ORDER="XYZ";class Ld{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let cS=0;const jm=new U,Ss=new Pr,Ii=new ft,hl=new U,Bo=new U,uS=new U,fS=new Pr,Xm=new U(1,0,0),Ym=new U(0,1,0),qm=new U(0,0,1),hS={type:"added"},dS={type:"removed"},$u={type:"childadded",child:null},Ku={type:"childremoved",child:null};class Ht extends hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cS++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new U,t=new Ri,i=new Pr,r=new U(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ft},normalMatrix:{value:new Ke}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ld,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ss.setFromAxisAngle(e,t),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(e,t){return Ss.setFromAxisAngle(e,t),this.quaternion.premultiply(Ss),this}rotateX(e){return this.rotateOnAxis(Xm,e)}rotateY(e){return this.rotateOnAxis(Ym,e)}rotateZ(e){return this.rotateOnAxis(qm,e)}translateOnAxis(e,t){return jm.copy(e).applyQuaternion(this.quaternion),this.position.add(jm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xm,e)}translateY(e){return this.translateOnAxis(Ym,e)}translateZ(e){return this.translateOnAxis(qm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ii.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?hl.copy(e):hl.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Bo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ii.lookAt(Bo,hl,this.up):Ii.lookAt(hl,Bo,this.up),this.quaternion.setFromRotationMatrix(Ii),r&&(Ii.extractRotation(r.matrixWorld),Ss.setFromRotationMatrix(Ii),this.quaternion.premultiply(Ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(hS),$u.child=e,this.dispatchEvent($u),$u.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dS),Ku.child=e,this.dispatchEvent(Ku),Ku.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ii.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ii.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ii),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bo,e,uS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bo,fS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ht.DEFAULT_UP=new U(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const li=new U,Ui=new U,Zu=new U,Fi=new U,ws=new U,Es=new U,$m=new U,Ju=new U,Qu=new U,ef=new U;class pi{constructor(e=new U,t=new U,i=new U){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),li.subVectors(e,t),r.cross(li);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){li.subVectors(r,t),Ui.subVectors(i,t),Zu.subVectors(e,t);const o=li.dot(li),a=li.dot(Ui),l=li.dot(Zu),c=Ui.dot(Ui),u=Ui.dot(Zu),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const h=1/f,p=(c*l-a*u)*h,v=(o*u-a*l)*h;return s.set(1-p-v,v,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Fi.x),l.addScaledVector(o,Fi.y),l.addScaledVector(a,Fi.z),l)}static isFrontFacing(e,t,i,r){return li.subVectors(i,t),Ui.subVectors(e,t),li.cross(Ui).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return li.subVectors(this.c,this.b),Ui.subVectors(this.a,this.b),li.cross(Ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return pi.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;ws.subVectors(r,i),Es.subVectors(s,i),Ju.subVectors(e,i);const l=ws.dot(Ju),c=Es.dot(Ju);if(l<=0&&c<=0)return t.copy(i);Qu.subVectors(e,r);const u=ws.dot(Qu),f=Es.dot(Qu);if(u>=0&&f<=u)return t.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(ws,o);ef.subVectors(e,s);const p=ws.dot(ef),v=Es.dot(ef);if(v>=0&&p<=v)return t.copy(s);const _=p*c-l*v;if(_<=0&&c>=0&&v<=0)return a=c/(c-v),t.copy(i).addScaledVector(Es,a);const m=u*v-p*f;if(m<=0&&f-u>=0&&p-v>=0)return $m.subVectors(s,r),a=(f-u)/(f-u+(p-v)),t.copy(r).addScaledVector($m,a);const d=1/(m+_+h);return o=_*d,a=h*d,t.copy(i).addScaledVector(ws,o).addScaledVector(Es,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Vx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rr={h:0,s:0,l:0},dl={h:0,s:0,l:0};function tf(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Me{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=dt.workingColorSpace){return this.r=e,this.g=t,this.b=i,dt.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=dt.workingColorSpace){if(e=J1(e,1),t=Qt(t,0,1),i=Qt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=tf(o,s,e+1/3),this.g=tf(o,s,e),this.b=tf(o,s,e-1/3)}return dt.toWorkingColorSpace(this,r),this}setStyle(e,t=hi){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hi){const i=Vx[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=oo(e.r),this.g=oo(e.g),this.b=oo(e.b),this}copyLinearToSRGB(e){return this.r=Gu(e.r),this.g=Gu(e.g),this.b=Gu(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hi){return dt.fromWorkingColorSpace(fn.copy(this),e),Math.round(Qt(fn.r*255,0,255))*65536+Math.round(Qt(fn.g*255,0,255))*256+Math.round(Qt(fn.b*255,0,255))}getHexString(e=hi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.fromWorkingColorSpace(fn.copy(this),t);const i=fn.r,r=fn.g,s=fn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=dt.workingColorSpace){return dt.fromWorkingColorSpace(fn.copy(this),t),e.r=fn.r,e.g=fn.g,e.b=fn.b,e}getStyle(e=hi){dt.fromWorkingColorSpace(fn.copy(this),e);const t=fn.r,i=fn.g,r=fn.b;return e!==hi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(rr),this.setHSL(rr.h+e,rr.s+t,rr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(rr),e.getHSL(dl);const i=Ou(rr.h,dl.h,t),r=Ou(rr.s,dl.s,t),s=Ou(rr.l,dl.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const fn=new Me;Me.NAMES=Vx;let pS=0;class ps extends hs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pS++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=so,this.side=br,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vh,this.blendDst=xh,this.blendEquation=Yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=Ec,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gs,this.stencilZFail=gs,this.stencilZPass=gs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==so&&(i.blending=this.blending),this.side!==br&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==vh&&(i.blendSrc=this.blendSrc),this.blendDst!==xh&&(i.blendDst=this.blendDst),this.blendEquation!==Yr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ec&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==gs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==gs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ui extends ps{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ri,this.combine=Ex,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const zt=new U,pl=new le;class Hn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=wh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return zx("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)pl.fromBufferAttribute(this,t),pl.applyMatrix3(e),this.setXY(t,pl.x,pl.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ei(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ht(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ei(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ei(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ei(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ei(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array),s=ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==wh&&(e.usage=this.usage),e}}class Hx extends Hn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Wx extends Hn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ot extends Hn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let mS=0;const $n=new ft,nf=new Ht,Ts=new U,In=new ds,Go=new ds,Yt=new U;class kt extends hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mS++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kx(e)?Wx:Hx)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $n.makeRotationFromQuaternion(e),this.applyMatrix4($n),this}rotateX(e){return $n.makeRotationX(e),this.applyMatrix4($n),this}rotateY(e){return $n.makeRotationY(e),this.applyMatrix4($n),this}rotateZ(e){return $n.makeRotationZ(e),this.applyMatrix4($n),this}translate(e,t,i){return $n.makeTranslation(e,t,i),this.applyMatrix4($n),this}scale(e,t,i){return $n.makeScale(e,t,i),this.applyMatrix4($n),this}lookAt(e){return nf.lookAt(e),nf.updateMatrix(),this.applyMatrix4(nf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ts).negate(),this.translate(Ts.x,Ts.y,Ts.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ot(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ds);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];In.setFromBufferAttribute(s),this.morphTargetsRelative?(Yt.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(Yt),Yt.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(Yt)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new To);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const i=this.boundingSphere.center;if(In.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Go.setFromBufferAttribute(a),this.morphTargetsRelative?(Yt.addVectors(In.min,Go.min),In.expandByPoint(Yt),Yt.addVectors(In.max,Go.max),In.expandByPoint(Yt)):(In.expandByPoint(Go.min),In.expandByPoint(Go.max))}In.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Yt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Yt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Yt.fromBufferAttribute(a,c),l&&(Ts.fromBufferAttribute(e,c),Yt.add(Ts)),r=Math.max(r,i.distanceToSquared(Yt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Hn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let b=0;b<i.count;b++)a[b]=new U,l[b]=new U;const c=new U,u=new U,f=new U,h=new le,p=new le,v=new le,_=new U,m=new U;function d(b,D,y){c.fromBufferAttribute(i,b),u.fromBufferAttribute(i,D),f.fromBufferAttribute(i,y),h.fromBufferAttribute(s,b),p.fromBufferAttribute(s,D),v.fromBufferAttribute(s,y),u.sub(c),f.sub(c),p.sub(h),v.sub(h);const A=1/(p.x*v.y-v.x*p.y);isFinite(A)&&(_.copy(u).multiplyScalar(v.y).addScaledVector(f,-p.y).multiplyScalar(A),m.copy(f).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(A),a[b].add(_),a[D].add(_),a[y].add(_),l[b].add(m),l[D].add(m),l[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let b=0,D=x.length;b<D;++b){const y=x[b],A=y.start,j=y.count;for(let J=A,I=A+j;J<I;J+=3)d(e.getX(J+0),e.getX(J+1),e.getX(J+2))}const g=new U,M=new U,T=new U,E=new U;function S(b){T.fromBufferAttribute(r,b),E.copy(T);const D=a[b];g.copy(D),g.sub(T.multiplyScalar(T.dot(D))).normalize(),M.crossVectors(E,D);const A=M.dot(l[b])<0?-1:1;o.setXYZW(b,g.x,g.y,g.z,A)}for(let b=0,D=x.length;b<D;++b){const y=x[b],A=y.start,j=y.count;for(let J=A,I=A+j;J<I;J+=3)S(e.getX(J+0)),S(e.getX(J+1)),S(e.getX(J+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Hn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const r=new U,s=new U,o=new U,a=new U,l=new U,c=new U,u=new U,f=new U;if(e)for(let h=0,p=e.count;h<p;h+=3){const v=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Yt.fromBufferAttribute(e,t),Yt.normalize(),e.setXYZ(t,Yt.x,Yt.y,Yt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u);let p=0,v=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let d=0;d<u;d++)h[v++]=c[p++]}return new Hn(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new kt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const h=c[u],p=e(h,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,p=f.length;h<p;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Km=new ft,Br=new Qc,ml=new To,Zm=new U,As=new U,Cs=new U,bs=new U,rf=new U,gl=new U,vl=new le,xl=new le,_l=new le,Jm=new U,Qm=new U,e0=new U,yl=new U,Ml=new U;class Ie extends Ht{constructor(e=new kt,t=new ui){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){gl.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(rf.fromBufferAttribute(f,e),o?gl.addScaledVector(rf,u):gl.addScaledVector(rf.sub(t),u))}t.add(gl)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ml.copy(i.boundingSphere),ml.applyMatrix4(s),Br.copy(e.ray).recast(e.near),!(ml.containsPoint(Br.origin)===!1&&(Br.intersectSphere(ml,Zm)===null||Br.origin.distanceToSquared(Zm)>(e.far-e.near)**2))&&(Km.copy(s).invert(),Br.copy(e.ray).applyMatrix4(Km),!(i.boundingBox!==null&&Br.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Br)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,_=h.length;v<_;v++){const m=h[v],d=o[m.materialIndex],x=Math.max(m.start,p.start),g=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,T=g;M<T;M+=3){const E=a.getX(M),S=a.getX(M+1),b=a.getX(M+2);r=Sl(this,d,e,i,c,u,f,E,S,b),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=v,d=_;m<d;m+=3){const x=a.getX(m),g=a.getX(m+1),M=a.getX(m+2);r=Sl(this,o,e,i,c,u,f,x,g,M),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,_=h.length;v<_;v++){const m=h[v],d=o[m.materialIndex],x=Math.max(m.start,p.start),g=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,T=g;M<T;M+=3){const E=M,S=M+1,b=M+2;r=Sl(this,d,e,i,c,u,f,E,S,b),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=v,d=_;m<d;m+=3){const x=m,g=m+1,M=m+2;r=Sl(this,o,e,i,c,u,f,x,g,M),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function gS(n,e,t,i,r,s,o,a){let l;if(e.side===pn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===br,a),l===null)return null;Ml.copy(a),Ml.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ml);return c<t.near||c>t.far?null:{distance:c,point:Ml.clone(),object:n}}function Sl(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,As),n.getVertexPosition(l,Cs),n.getVertexPosition(c,bs);const u=gS(n,e,t,i,As,Cs,bs,yl);if(u){r&&(vl.fromBufferAttribute(r,a),xl.fromBufferAttribute(r,l),_l.fromBufferAttribute(r,c),u.uv=pi.getInterpolation(yl,As,Cs,bs,vl,xl,_l,new le)),s&&(vl.fromBufferAttribute(s,a),xl.fromBufferAttribute(s,l),_l.fromBufferAttribute(s,c),u.uv1=pi.getInterpolation(yl,As,Cs,bs,vl,xl,_l,new le)),o&&(Jm.fromBufferAttribute(o,a),Qm.fromBufferAttribute(o,l),e0.fromBufferAttribute(o,c),u.normal=pi.getInterpolation(yl,As,Cs,bs,Jm,Qm,e0,new U),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new U,materialIndex:0};pi.getNormal(As,Cs,bs,f.normal),u.face=f}return u}class _n extends kt{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let h=0,p=0;v("z","y","x",-1,-1,i,t,e,o,s,0),v("z","y","x",1,-1,i,t,-e,o,s,1),v("x","z","y",1,1,e,i,t,r,o,2),v("x","z","y",1,-1,e,i,-t,r,o,3),v("x","y","z",1,-1,e,t,i,r,s,4),v("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(u,3)),this.setAttribute("uv",new ot(f,2));function v(_,m,d,x,g,M,T,E,S,b,D){const y=M/S,A=T/b,j=M/2,J=T/2,I=E/2,X=S+1,H=b+1;let Q=0,k=0;const z=new U;for(let B=0;B<H;B++){const $=B*A-J;for(let se=0;se<X;se++){const Ce=se*y-j;z[_]=Ce*x,z[m]=$*g,z[d]=I,c.push(z.x,z.y,z.z),z[_]=0,z[m]=0,z[d]=E>0?1:-1,u.push(z.x,z.y,z.z),f.push(se/S),f.push(1-B/b),Q+=1}}for(let B=0;B<b;B++)for(let $=0;$<S;$++){const se=h+$+X*B,Ce=h+$+X*(B+1),G=h+($+1)+X*(B+1),oe=h+($+1)+X*B;l.push(se,Ce,oe),l.push(Ce,G,oe),k+=6}a.addGroup(p,k,D),p+=k,h+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function _o(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function xn(n){const e={};for(let t=0;t<n.length;t++){const i=_o(n[t]);for(const r in i)e[r]=i[r]}return e}function vS(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function jx(n){return n.getRenderTarget()===null?n.outputColorSpace:dt.workingColorSpace}const xS={clone:_o,merge:xn};var _S=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sn extends ps{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_S,this.fragmentShader=yS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_o(e.uniforms),this.uniformsGroups=vS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Xx extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=ji}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const sr=new U,t0=new le,n0=new le;class Jn extends Xx{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Th*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Kl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Th*2*Math.atan(Math.tan(Kl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){sr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(sr.x,sr.y).multiplyScalar(-e/sr.z),sr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(sr.x,sr.y).multiplyScalar(-e/sr.z)}getViewSize(e,t){return this.getViewBounds(e,t0,n0),t.subVectors(n0,t0)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Kl*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Rs=-90,Ps=1;class MS extends Ht{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Jn(Rs,Ps,e,t);r.layers=this.layers,this.add(r);const s=new Jn(Rs,Ps,e,t);s.layers=this.layers,this.add(s);const o=new Jn(Rs,Ps,e,t);o.layers=this.layers,this.add(o);const a=new Jn(Rs,Ps,e,t);a.layers=this.layers,this.add(a);const l=new Jn(Rs,Ps,e,t);l.layers=this.layers,this.add(l);const c=new Jn(Rs,Ps,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===ji)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===bc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(f,h,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Yx extends mn{constructor(e,t,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:go,super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class SS extends Rr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Yx(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Zt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new _n(5,5,5),s=new Sn({name:"CubemapFromEquirect",uniforms:_o(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:pn,blending:Er});s.uniforms.tEquirect.value=t;const o=new Ie(r,s),a=t.minFilter;return t.minFilter===mr&&(t.minFilter=Zt),new MS(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const sf=new U,wS=new U,ES=new Ke;class cr{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=sf.subVectors(i,t).cross(wS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(sf),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||ES.getNormalMatrix(e),r=this.coplanarPoint(sf).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gr=new To,wl=new U;class Dd{constructor(e=new cr,t=new cr,i=new cr,r=new cr,s=new cr,o=new cr){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=ji){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],p=r[8],v=r[9],_=r[10],m=r[11],d=r[12],x=r[13],g=r[14],M=r[15];if(i[0].setComponents(l-s,h-c,m-p,M-d).normalize(),i[1].setComponents(l+s,h+c,m+p,M+d).normalize(),i[2].setComponents(l+o,h+u,m+v,M+x).normalize(),i[3].setComponents(l-o,h-u,m-v,M-x).normalize(),i[4].setComponents(l-a,h-f,m-_,M-g).normalize(),t===ji)i[5].setComponents(l+a,h+f,m+_,M+g).normalize();else if(t===bc)i[5].setComponents(a,f,_,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gr)}intersectsSprite(e){return Gr.center.set(0,0,0),Gr.radius=.7071067811865476,Gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(wl.x=r.normal.x>0?e.max.x:e.min.x,wl.y=r.normal.y>0?e.max.y:e.min.y,wl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(wl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function qx(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function TS(n,e){const t=e.isWebGL2,i=new WeakMap;function r(c,u){const f=c.array,h=c.usage,p=f.byteLength,v=n.createBuffer();n.bindBuffer(u,v),n.bufferData(u,f,h),c.onUploadCallback();let _;if(f instanceof Float32Array)_=n.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=n.UNSIGNED_SHORT;else if(f instanceof Int16Array)_=n.SHORT;else if(f instanceof Uint32Array)_=n.UNSIGNED_INT;else if(f instanceof Int32Array)_=n.INT;else if(f instanceof Int8Array)_=n.BYTE;else if(f instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:v,type:_,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:p}}function s(c,u,f){const h=u.array,p=u._updateRange,v=u.updateRanges;if(n.bindBuffer(f,c),p.count===-1&&v.length===0&&n.bufferSubData(f,0,h),v.length!==0){for(let _=0,m=v.length;_<m;_++){const d=v[_];t?n.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h,d.start,d.count):n.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h.subarray(d.start,d.start+d.count))}u.clearUpdateRanges()}p.count!==-1&&(t?n.bufferSubData(f,p.offset*h.BYTES_PER_ELEMENT,h,p.offset,p.count):n.bufferSubData(f,p.offset*h.BYTES_PER_ELEMENT,h.subarray(p.offset,p.offset+p.count)),p.count=-1),u.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(n.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const h=i.get(c);(!h||h.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=i.get(c);if(f===void 0)i.set(c,r(c,u));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(f.buffer,c,u),f.version=c.version}}return{get:o,remove:a,update:l}}class Wn extends kt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=t/l,p=[],v=[],_=[],m=[];for(let d=0;d<u;d++){const x=d*h-o;for(let g=0;g<c;g++){const M=g*f-s;v.push(M,-x,0),_.push(0,0,1),m.push(g/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<a;x++){const g=x+c*d,M=x+c*(d+1),T=x+1+c*(d+1),E=x+1+c*d;p.push(g,M,E),p.push(M,T,E)}this.setIndex(p),this.setAttribute("position",new ot(v,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wn(e.width,e.height,e.widthSegments,e.heightSegments)}}var AS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,CS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,bS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,RS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,PS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,LS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,DS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,NS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,IS=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,US=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,FS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,OS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,BS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,GS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,VS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,HS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,WS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,XS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,YS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,qS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,$S=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,KS=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ZS=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,JS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,QS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ew=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nw="gl_FragColor = linearToOutputTexel( gl_FragColor );",iw=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,rw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,sw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ow=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,aw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,cw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dw=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,pw=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,mw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vw=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xw=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,_w=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,yw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ww=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ew=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Tw=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Aw=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Cw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Rw=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pw=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lw=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Dw=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Nw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Iw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Uw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Fw=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ow=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Bw=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Vw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Hw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Ww=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,jw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Xw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$w=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Kw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,eE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,nE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,iE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,oE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,aE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,cE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,fE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,hE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,pE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_E=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	float startCompression = 0.8 - 0.04;
	float desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min(color.r, min(color.g, color.b));
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max(color.r, max(color.g, color.b));
	if (peak < startCompression) return color;
	float d = 1. - startCompression;
	float newPeak = 1. - d * d / (peak + d - startCompression);
	color *= newPeak / peak;
	float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);
	return mix(color, vec3(1, 1, 1), g);
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ME=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,SE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,EE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,TE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const AE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,CE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,RE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,NE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,IE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,UE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,FE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,OE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,BE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,GE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,jE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,YE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,qE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$E=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ZE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,t2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,r2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,s2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:AS,alphahash_pars_fragment:CS,alphamap_fragment:bS,alphamap_pars_fragment:RS,alphatest_fragment:PS,alphatest_pars_fragment:LS,aomap_fragment:DS,aomap_pars_fragment:NS,batching_pars_vertex:IS,batching_vertex:US,begin_vertex:FS,beginnormal_vertex:kS,bsdfs:zS,iridescence_fragment:OS,bumpmap_pars_fragment:BS,clipping_planes_fragment:GS,clipping_planes_pars_fragment:VS,clipping_planes_pars_vertex:HS,clipping_planes_vertex:WS,color_fragment:jS,color_pars_fragment:XS,color_pars_vertex:YS,color_vertex:qS,common:$S,cube_uv_reflection_fragment:KS,defaultnormal_vertex:ZS,displacementmap_pars_vertex:JS,displacementmap_vertex:QS,emissivemap_fragment:ew,emissivemap_pars_fragment:tw,colorspace_fragment:nw,colorspace_pars_fragment:iw,envmap_fragment:rw,envmap_common_pars_fragment:sw,envmap_pars_fragment:ow,envmap_pars_vertex:aw,envmap_physical_pars_fragment:_w,envmap_vertex:lw,fog_vertex:cw,fog_pars_vertex:uw,fog_fragment:fw,fog_pars_fragment:hw,gradientmap_pars_fragment:dw,lightmap_fragment:pw,lightmap_pars_fragment:mw,lights_lambert_fragment:gw,lights_lambert_pars_fragment:vw,lights_pars_begin:xw,lights_toon_fragment:yw,lights_toon_pars_fragment:Mw,lights_phong_fragment:Sw,lights_phong_pars_fragment:ww,lights_physical_fragment:Ew,lights_physical_pars_fragment:Tw,lights_fragment_begin:Aw,lights_fragment_maps:Cw,lights_fragment_end:bw,logdepthbuf_fragment:Rw,logdepthbuf_pars_fragment:Pw,logdepthbuf_pars_vertex:Lw,logdepthbuf_vertex:Dw,map_fragment:Nw,map_pars_fragment:Iw,map_particle_fragment:Uw,map_particle_pars_fragment:Fw,metalnessmap_fragment:kw,metalnessmap_pars_fragment:zw,morphinstance_vertex:Ow,morphcolor_vertex:Bw,morphnormal_vertex:Gw,morphtarget_pars_vertex:Vw,morphtarget_vertex:Hw,normal_fragment_begin:Ww,normal_fragment_maps:jw,normal_pars_fragment:Xw,normal_pars_vertex:Yw,normal_vertex:qw,normalmap_pars_fragment:$w,clearcoat_normal_fragment_begin:Kw,clearcoat_normal_fragment_maps:Zw,clearcoat_pars_fragment:Jw,iridescence_pars_fragment:Qw,opaque_fragment:eE,packing:tE,premultiplied_alpha_fragment:nE,project_vertex:iE,dithering_fragment:rE,dithering_pars_fragment:sE,roughnessmap_fragment:oE,roughnessmap_pars_fragment:aE,shadowmap_pars_fragment:lE,shadowmap_pars_vertex:cE,shadowmap_vertex:uE,shadowmask_pars_fragment:fE,skinbase_vertex:hE,skinning_pars_vertex:dE,skinning_vertex:pE,skinnormal_vertex:mE,specularmap_fragment:gE,specularmap_pars_fragment:vE,tonemapping_fragment:xE,tonemapping_pars_fragment:_E,transmission_fragment:yE,transmission_pars_fragment:ME,uv_pars_fragment:SE,uv_pars_vertex:wE,uv_vertex:EE,worldpos_vertex:TE,background_vert:AE,background_frag:CE,backgroundCube_vert:bE,backgroundCube_frag:RE,cube_vert:PE,cube_frag:LE,depth_vert:DE,depth_frag:NE,distanceRGBA_vert:IE,distanceRGBA_frag:UE,equirect_vert:FE,equirect_frag:kE,linedashed_vert:zE,linedashed_frag:OE,meshbasic_vert:BE,meshbasic_frag:GE,meshlambert_vert:VE,meshlambert_frag:HE,meshmatcap_vert:WE,meshmatcap_frag:jE,meshnormal_vert:XE,meshnormal_frag:YE,meshphong_vert:qE,meshphong_frag:$E,meshphysical_vert:KE,meshphysical_frag:ZE,meshtoon_vert:JE,meshtoon_frag:QE,points_vert:e2,points_frag:t2,shadow_vert:n2,shadow_frag:i2,sprite_vert:r2,sprite_frag:s2},ye={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},Mi={basic:{uniforms:xn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:xn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Me(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:xn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:xn([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:xn([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new Me(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:xn([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:xn([ye.points,ye.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:xn([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:xn([ye.common,ye.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:xn([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:xn([ye.sprite,ye.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:xn([ye.common,ye.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:xn([ye.lights,ye.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};Mi.physical={uniforms:xn([Mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const El={r:0,b:0,g:0},Vr=new Ri,o2=new ft;function a2(n,e,t,i,r,s,o){const a=new Me(0);let l=s===!0?0:1,c,u,f=null,h=0,p=null;function v(m,d){let x=!1,g=d.isScene===!0?d.background:null;g&&g.isTexture&&(g=(d.backgroundBlurriness>0?t:e).get(g)),g===null?_(a,l):g&&g.isColor&&(_(g,1),x=!0);const M=n.xr.getEnvironmentBlendMode();M==="additive"?i.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),g&&(g.isCubeTexture||g.mapping===Zc)?(u===void 0&&(u=new Ie(new _n(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:_o(Mi.backgroundCube.uniforms),vertexShader:Mi.backgroundCube.vertexShader,fragmentShader:Mi.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,E,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Vr.copy(d.backgroundRotation),Vr.x*=-1,Vr.y*=-1,Vr.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(Vr.y*=-1,Vr.z*=-1),u.material.uniforms.envMap.value=g,u.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(o2.makeRotationFromEuler(Vr)),u.material.toneMapped=dt.getTransfer(g.colorSpace)!==St,(f!==g||h!==g.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,f=g,h=g.version,p=n.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):g&&g.isTexture&&(c===void 0&&(c=new Ie(new Wn(2,2),new Sn({name:"BackgroundMaterial",uniforms:_o(Mi.background.uniforms),vertexShader:Mi.background.vertexShader,fragmentShader:Mi.background.fragmentShader,side:br,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=g,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=dt.getTransfer(g.colorSpace)!==St,g.matrixAutoUpdate===!0&&g.updateMatrix(),c.material.uniforms.uvTransform.value.copy(g.matrix),(f!==g||h!==g.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,f=g,h=g.version,p=n.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,d){m.getRGB(El,jx(n)),i.buffers.color.setClear(El.r,El.g,El.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(m,d=1){a.set(m),l=d,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(a,l)},render:v}}function l2(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=m(null);let c=l,u=!1;function f(I,X,H,Q,k){let z=!1;if(o){const B=_(Q,H,X);c!==B&&(c=B,p(c.object)),z=d(I,Q,H,k),z&&x(I,Q,H,k)}else{const B=X.wireframe===!0;(c.geometry!==Q.id||c.program!==H.id||c.wireframe!==B)&&(c.geometry=Q.id,c.program=H.id,c.wireframe=B,z=!0)}k!==null&&t.update(k,n.ELEMENT_ARRAY_BUFFER),(z||u)&&(u=!1,b(I,X,H,Q),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function h(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function p(I){return i.isWebGL2?n.bindVertexArray(I):s.bindVertexArrayOES(I)}function v(I){return i.isWebGL2?n.deleteVertexArray(I):s.deleteVertexArrayOES(I)}function _(I,X,H){const Q=H.wireframe===!0;let k=a[I.id];k===void 0&&(k={},a[I.id]=k);let z=k[X.id];z===void 0&&(z={},k[X.id]=z);let B=z[Q];return B===void 0&&(B=m(h()),z[Q]=B),B}function m(I){const X=[],H=[],Q=[];for(let k=0;k<r;k++)X[k]=0,H[k]=0,Q[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:X,enabledAttributes:H,attributeDivisors:Q,object:I,attributes:{},index:null}}function d(I,X,H,Q){const k=c.attributes,z=X.attributes;let B=0;const $=H.getAttributes();for(const se in $)if($[se].location>=0){const G=k[se];let oe=z[se];if(oe===void 0&&(se==="instanceMatrix"&&I.instanceMatrix&&(oe=I.instanceMatrix),se==="instanceColor"&&I.instanceColor&&(oe=I.instanceColor)),G===void 0||G.attribute!==oe||oe&&G.data!==oe.data)return!0;B++}return c.attributesNum!==B||c.index!==Q}function x(I,X,H,Q){const k={},z=X.attributes;let B=0;const $=H.getAttributes();for(const se in $)if($[se].location>=0){let G=z[se];G===void 0&&(se==="instanceMatrix"&&I.instanceMatrix&&(G=I.instanceMatrix),se==="instanceColor"&&I.instanceColor&&(G=I.instanceColor));const oe={};oe.attribute=G,G&&G.data&&(oe.data=G.data),k[se]=oe,B++}c.attributes=k,c.attributesNum=B,c.index=Q}function g(){const I=c.newAttributes;for(let X=0,H=I.length;X<H;X++)I[X]=0}function M(I){T(I,0)}function T(I,X){const H=c.newAttributes,Q=c.enabledAttributes,k=c.attributeDivisors;H[I]=1,Q[I]===0&&(n.enableVertexAttribArray(I),Q[I]=1),k[I]!==X&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,X),k[I]=X)}function E(){const I=c.newAttributes,X=c.enabledAttributes;for(let H=0,Q=X.length;H<Q;H++)X[H]!==I[H]&&(n.disableVertexAttribArray(H),X[H]=0)}function S(I,X,H,Q,k,z,B){B===!0?n.vertexAttribIPointer(I,X,H,k,z):n.vertexAttribPointer(I,X,H,Q,k,z)}function b(I,X,H,Q){if(i.isWebGL2===!1&&(I.isInstancedMesh||Q.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const k=Q.attributes,z=H.getAttributes(),B=X.defaultAttributeValues;for(const $ in z){const se=z[$];if(se.location>=0){let Ce=k[$];if(Ce===void 0&&($==="instanceMatrix"&&I.instanceMatrix&&(Ce=I.instanceMatrix),$==="instanceColor"&&I.instanceColor&&(Ce=I.instanceColor)),Ce!==void 0){const G=Ce.normalized,oe=Ce.itemSize,ue=t.get(Ce);if(ue===void 0)continue;const _e=ue.buffer,we=ue.type,Ee=ue.bytesPerElement,Oe=i.isWebGL2===!0&&(we===n.INT||we===n.UNSIGNED_INT||Ce.gpuType===Cx);if(Ce.isInterleavedBufferAttribute){const Re=Ce.data,N=Re.stride,W=Ce.offset;if(Re.isInstancedInterleavedBuffer){for(let O=0;O<se.locationSize;O++)T(se.location+O,Re.meshPerAttribute);I.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=Re.meshPerAttribute*Re.count)}else for(let O=0;O<se.locationSize;O++)M(se.location+O);n.bindBuffer(n.ARRAY_BUFFER,_e);for(let O=0;O<se.locationSize;O++)S(se.location+O,oe/se.locationSize,we,G,N*Ee,(W+oe/se.locationSize*O)*Ee,Oe)}else{if(Ce.isInstancedBufferAttribute){for(let Re=0;Re<se.locationSize;Re++)T(se.location+Re,Ce.meshPerAttribute);I.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=Ce.meshPerAttribute*Ce.count)}else for(let Re=0;Re<se.locationSize;Re++)M(se.location+Re);n.bindBuffer(n.ARRAY_BUFFER,_e);for(let Re=0;Re<se.locationSize;Re++)S(se.location+Re,oe/se.locationSize,we,G,oe*Ee,oe/se.locationSize*Re*Ee,Oe)}}else if(B!==void 0){const G=B[$];if(G!==void 0)switch(G.length){case 2:n.vertexAttrib2fv(se.location,G);break;case 3:n.vertexAttrib3fv(se.location,G);break;case 4:n.vertexAttrib4fv(se.location,G);break;default:n.vertexAttrib1fv(se.location,G)}}}}E()}function D(){j();for(const I in a){const X=a[I];for(const H in X){const Q=X[H];for(const k in Q)v(Q[k].object),delete Q[k];delete X[H]}delete a[I]}}function y(I){if(a[I.id]===void 0)return;const X=a[I.id];for(const H in X){const Q=X[H];for(const k in Q)v(Q[k].object),delete Q[k];delete X[H]}delete a[I.id]}function A(I){for(const X in a){const H=a[X];if(H[I.id]===void 0)continue;const Q=H[I.id];for(const k in Q)v(Q[k].object),delete Q[k];delete H[I.id]}}function j(){J(),u=!0,c!==l&&(c=l,p(c.object))}function J(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:j,resetDefaultState:J,dispose:D,releaseStatesOfGeometry:y,releaseStatesOfProgram:A,initAttributes:g,enableAttribute:M,disableUnusedAttributes:E}}function c2(n,e,t,i){const r=i.isWebGL2;let s;function o(u){s=u}function a(u,f){n.drawArrays(s,u,f),t.update(f,s,1)}function l(u,f,h){if(h===0)return;let p,v;if(r)p=n,v="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[v](s,u,f,h),t.update(f,s,h)}function c(u,f,h){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<h;v++)this.render(u[v],f[v]);else{p.multiDrawArraysWEBGL(s,u,0,f,0,h);let v=0;for(let _=0;_<h;_++)v+=f[_];t.update(v,s,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function u2(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const S=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),h=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),v=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),d=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),g=h>0,M=o||e.has("OES_texture_float"),T=g&&M,E=o?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:h,maxTextureSize:p,maxCubemapSize:v,maxAttributes:_,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:x,vertexTextures:g,floatFragmentTextures:M,floatVertexTextures:T,maxSamples:E}}function f2(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new cr,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const p=f.length!==0||h||i!==0||r;return r=h,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,p){const v=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,d=n.get(f);if(!r||v===null||v.length===0||s&&!m)s?u(null):c();else{const x=s?0:i,g=x*4;let M=d.clippingState||null;l.value=M,M=u(v,h,g,p);for(let T=0;T!==g;++T)M[T]=t[T];d.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,p,v){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,v!==!0||m===null){const d=p+_*4,x=h.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let g=0,M=p;g!==_;++g,M+=4)o.copy(f[g]).applyMatrix4(x,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function h2(n){let e=new WeakMap;function t(o,a){return a===_h?o.mapping=go:a===yh&&(o.mapping=vo),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===_h||a===yh)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new SS(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Nd extends Xx{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ks=4,i0=[.125,.215,.35,.446,.526,.582],qr=20,of=new Nd,r0=new Me;let af=null,lf=0,cf=0;const Xr=(1+Math.sqrt(5))/2,Ls=1/Xr,s0=[new U(1,1,1),new U(-1,1,1),new U(1,1,-1),new U(-1,1,-1),new U(0,Xr,Ls),new U(0,Xr,-Ls),new U(Ls,0,Xr),new U(-Ls,0,Xr),new U(Xr,Ls,0),new U(-Xr,Ls,0)];class o0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){af=this._renderer.getRenderTarget(),lf=this._renderer.getActiveCubeFace(),cf=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=c0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=l0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(af,lf,cf),e.scissorTest=!1,Tl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===go||e.mapping===vo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),af=this._renderer.getRenderTarget(),lf=this._renderer.getActiveCubeFace(),cf=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Zt,minFilter:Zt,generateMipmaps:!1,type:Ra,format:kn,colorSpace:Ir,depthBuffer:!1},r=a0(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=a0(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=d2(s)),this._blurMaterial=p2(s,e,t)}return r}_compileMaterial(e){const t=new Ie(this._lodPlanes[0],e);this._renderer.compile(t,of)}_sceneToCubeUV(e,t,i,r){const a=new Jn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(r0),u.toneMapping=Tr,u.autoClear=!1;const p=new ui({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),v=new Ie(new _n,p);let _=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(r0),_=!0);for(let d=0;d<6;d++){const x=d%3;x===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):x===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const g=this._cubeSize;Tl(r,x*g,d>2?g:0,g,g),u.setRenderTarget(r),_&&u.render(v,a),u.render(e,a)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=h,u.autoClear=f,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===go||e.mapping===vo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=c0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=l0());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Ie(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Tl(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,of)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=s0[(r-1)%s0.length];this._blur(e,r-1,r,s,o)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Ie(this._lodPlanes[r],c),h=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*qr-1),_=s/v,m=isFinite(s)?1+Math.floor(u*_):qr;m>qr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${qr}`);const d=[];let x=0;for(let S=0;S<qr;++S){const b=S/_,D=Math.exp(-b*b/2);d.push(D),S===0?x+=D:S<m&&(x+=2*D)}for(let S=0;S<d.length;S++)d[S]=d[S]/x;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=d,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:g}=this;h.dTheta.value=v,h.mipInt.value=g-i;const M=this._sizeLods[r],T=3*M*(r>g-Ks?r-g+Ks:0),E=4*(this._cubeSize-M);Tl(t,T,E,3*M,2*M),l.setRenderTarget(t),l.render(f,of)}}function d2(n){const e=[],t=[],i=[];let r=n;const s=n-Ks+1+i0.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-Ks?l=i0[o-n+Ks-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,v=6,_=3,m=2,d=1,x=new Float32Array(_*v*p),g=new Float32Array(m*v*p),M=new Float32Array(d*v*p);for(let E=0;E<p;E++){const S=E%3*2/3-1,b=E>2?0:-1,D=[S,b,0,S+2/3,b,0,S+2/3,b+1,0,S,b,0,S+2/3,b+1,0,S,b+1,0];x.set(D,_*v*E),g.set(h,m*v*E);const y=[E,E,E,E,E,E];M.set(y,d*v*E)}const T=new kt;T.setAttribute("position",new Hn(x,_)),T.setAttribute("uv",new Hn(g,m)),T.setAttribute("faceIndex",new Hn(M,d)),e.push(T),r>Ks&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function a0(n,e,t){const i=new Rr(n,e,t);return i.texture.mapping=Zc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Tl(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function p2(n,e,t){const i=new Float32Array(qr),r=new U(0,1,0);return new Sn({name:"SphericalGaussianBlur",defines:{n:qr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Id(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Er,depthTest:!1,depthWrite:!1})}function l0(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Id(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Er,depthTest:!1,depthWrite:!1})}function c0(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Id(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Er,depthTest:!1,depthWrite:!1})}function Id(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function m2(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===_h||l===yh,u=l===go||l===vo;if(c||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=e.get(a);return t===null&&(t=new o0(n)),f=c?t.fromEquirectangular(a,f):t.fromCubemap(a,f),e.set(a,f),f.texture}else{if(e.has(a))return e.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||u&&f&&r(f)){t===null&&(t=new o0(n));const h=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,h),a.addEventListener("dispose",s),h.texture}else return null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function g2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function v2(n,e,t,i){const r={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const v in h.attributes)e.remove(h.attributes[v]);for(const v in h.morphAttributes){const _=h.morphAttributes[v];for(let m=0,d=_.length;m<d;m++)e.remove(_[m])}h.removeEventListener("dispose",o),delete r[h.id];const p=s.get(h);p&&(e.remove(p),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const v in h)e.update(h[v],n.ARRAY_BUFFER);const p=f.morphAttributes;for(const v in p){const _=p[v];for(let m=0,d=_.length;m<d;m++)e.update(_[m],n.ARRAY_BUFFER)}}function c(f){const h=[],p=f.index,v=f.attributes.position;let _=0;if(p!==null){const x=p.array;_=p.version;for(let g=0,M=x.length;g<M;g+=3){const T=x[g+0],E=x[g+1],S=x[g+2];h.push(T,E,E,S,S,T)}}else if(v!==void 0){const x=v.array;_=v.version;for(let g=0,M=x.length/3-1;g<M;g+=3){const T=g+0,E=g+1,S=g+2;h.push(T,E,E,S,S,T)}}else return;const m=new(kx(h)?Wx:Hx)(h,1);m.version=_;const d=s.get(f);d&&e.remove(d),s.set(f,m)}function u(f){const h=s.get(f);if(h){const p=f.index;p!==null&&h.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function x2(n,e,t,i){const r=i.isWebGL2;let s;function o(p){s=p}let a,l;function c(p){a=p.type,l=p.bytesPerElement}function u(p,v){n.drawElements(s,v,a,p*l),t.update(v,s,1)}function f(p,v,_){if(_===0)return;let m,d;if(r)m=n,d="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](s,v,a,p*l,_),t.update(v,s,_)}function h(p,v,_){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<_;d++)this.render(p[d]/l,v[d]);else{m.multiDrawElementsWEBGL(s,v,0,a,p,0,_);let d=0;for(let x=0;x<_;x++)d+=v[x];t.update(d,s,1)}}this.setMode=o,this.setIndex=c,this.render=u,this.renderInstances=f,this.renderMultiDraw=h}function _2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function y2(n,e){return n[0]-e[0]}function M2(n,e){return Math.abs(e[1])-Math.abs(n[1])}function S2(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,o=new Bt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,u,f){const h=c.morphTargetInfluences;if(e.isWebGL2===!0){const p=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,v=p!==void 0?p.length:0;let _=s.get(u);if(_===void 0||_.count!==v){let j=function(){y.dispose(),s.delete(u),u.removeEventListener("dispose",j)};_!==void 0&&_.texture.dispose();const m=u.morphAttributes.position!==void 0,d=u.morphAttributes.normal!==void 0,x=u.morphAttributes.color!==void 0,g=u.morphAttributes.position||[],M=u.morphAttributes.normal||[],T=u.morphAttributes.color||[];let E=0;m===!0&&(E=1),d===!0&&(E=2),x===!0&&(E=3);let S=u.attributes.position.count*E,b=1;S>e.maxTextureSize&&(b=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const D=new Float32Array(S*b*4*v),y=new Gx(D,S,b,v);y.type=wi,y.needsUpdate=!0;const A=E*4;for(let J=0;J<v;J++){const I=g[J],X=M[J],H=T[J],Q=S*b*4*J;for(let k=0;k<I.count;k++){const z=k*A;m===!0&&(o.fromBufferAttribute(I,k),D[Q+z+0]=o.x,D[Q+z+1]=o.y,D[Q+z+2]=o.z,D[Q+z+3]=0),d===!0&&(o.fromBufferAttribute(X,k),D[Q+z+4]=o.x,D[Q+z+5]=o.y,D[Q+z+6]=o.z,D[Q+z+7]=0),x===!0&&(o.fromBufferAttribute(H,k),D[Q+z+8]=o.x,D[Q+z+9]=o.y,D[Q+z+10]=o.z,D[Q+z+11]=H.itemSize===4?o.w:1)}}_={count:v,texture:y,size:new le(S,b)},s.set(u,_),u.addEventListener("dispose",j)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)f.getUniforms().setValue(n,"morphTexture",c.morphTexture,t);else{let m=0;for(let x=0;x<h.length;x++)m+=h[x];const d=u.morphTargetsRelative?1:1-m;f.getUniforms().setValue(n,"morphTargetBaseInfluence",d),f.getUniforms().setValue(n,"morphTargetInfluences",h)}f.getUniforms().setValue(n,"morphTargetsTexture",_.texture,t),f.getUniforms().setValue(n,"morphTargetsTextureSize",_.size)}else{const p=h===void 0?0:h.length;let v=i[u.id];if(v===void 0||v.length!==p){v=[];for(let g=0;g<p;g++)v[g]=[g,0];i[u.id]=v}for(let g=0;g<p;g++){const M=v[g];M[0]=g,M[1]=h[g]}v.sort(M2);for(let g=0;g<8;g++)g<p&&v[g][1]?(a[g][0]=v[g][0],a[g][1]=v[g][1]):(a[g][0]=Number.MAX_SAFE_INTEGER,a[g][1]=0);a.sort(y2);const _=u.morphAttributes.position,m=u.morphAttributes.normal;let d=0;for(let g=0;g<8;g++){const M=a[g],T=M[0],E=M[1];T!==Number.MAX_SAFE_INTEGER&&E?(_&&u.getAttribute("morphTarget"+g)!==_[T]&&u.setAttribute("morphTarget"+g,_[T]),m&&u.getAttribute("morphNormal"+g)!==m[T]&&u.setAttribute("morphNormal"+g,m[T]),r[g]=E,d+=E):(_&&u.hasAttribute("morphTarget"+g)===!0&&u.deleteAttribute("morphTarget"+g),m&&u.hasAttribute("morphNormal"+g)===!0&&u.deleteAttribute("morphNormal"+g),r[g]=0)}const x=u.morphTargetsRelative?1:1-d;f.getUniforms().setValue(n,"morphTargetBaseInfluence",x),f.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:l}}function w2(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class Ud extends mn{constructor(e,t,i,r,s,o,a,l,c,u){if(u=u!==void 0?u:ns,u!==ns&&u!==xo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===ns&&(i=Wi),i===void 0&&u===xo&&(i=ts),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Jt,this.minFilter=l!==void 0?l:Jt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const $x=new mn,Kx=new Ud(1,1);Kx.compareFunction=Fx;const Zx=new Gx,Jx=new sS,Qx=new Yx,u0=[],f0=[],h0=new Float32Array(16),d0=new Float32Array(9),p0=new Float32Array(4);function Ao(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=u0[r];if(s===void 0&&(s=new Float32Array(r),u0[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Wt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function jt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function eu(n,e){let t=f0[e];t===void 0&&(t=new Int32Array(e),f0[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function E2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function T2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;n.uniform2fv(this.addr,e),jt(t,e)}}function A2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;n.uniform3fv(this.addr,e),jt(t,e)}}function C2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;n.uniform4fv(this.addr,e),jt(t,e)}}function b2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Wt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),jt(t,e)}else{if(Wt(t,i))return;p0.set(i),n.uniformMatrix2fv(this.addr,!1,p0),jt(t,i)}}function R2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Wt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),jt(t,e)}else{if(Wt(t,i))return;d0.set(i),n.uniformMatrix3fv(this.addr,!1,d0),jt(t,i)}}function P2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Wt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),jt(t,e)}else{if(Wt(t,i))return;h0.set(i),n.uniformMatrix4fv(this.addr,!1,h0),jt(t,i)}}function L2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function D2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;n.uniform2iv(this.addr,e),jt(t,e)}}function N2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;n.uniform3iv(this.addr,e),jt(t,e)}}function I2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;n.uniform4iv(this.addr,e),jt(t,e)}}function U2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function F2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;n.uniform2uiv(this.addr,e),jt(t,e)}}function k2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;n.uniform3uiv(this.addr,e),jt(t,e)}}function z2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;n.uniform4uiv(this.addr,e),jt(t,e)}}function O2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);const s=this.type===n.SAMPLER_2D_SHADOW?Kx:$x;t.setTexture2D(e||s,r)}function B2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Jx,r)}function G2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Qx,r)}function V2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Zx,r)}function H2(n){switch(n){case 5126:return E2;case 35664:return T2;case 35665:return A2;case 35666:return C2;case 35674:return b2;case 35675:return R2;case 35676:return P2;case 5124:case 35670:return L2;case 35667:case 35671:return D2;case 35668:case 35672:return N2;case 35669:case 35673:return I2;case 5125:return U2;case 36294:return F2;case 36295:return k2;case 36296:return z2;case 35678:case 36198:case 36298:case 36306:case 35682:return O2;case 35679:case 36299:case 36307:return B2;case 35680:case 36300:case 36308:case 36293:return G2;case 36289:case 36303:case 36311:case 36292:return V2}}function W2(n,e){n.uniform1fv(this.addr,e)}function j2(n,e){const t=Ao(e,this.size,2);n.uniform2fv(this.addr,t)}function X2(n,e){const t=Ao(e,this.size,3);n.uniform3fv(this.addr,t)}function Y2(n,e){const t=Ao(e,this.size,4);n.uniform4fv(this.addr,t)}function q2(n,e){const t=Ao(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function $2(n,e){const t=Ao(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function K2(n,e){const t=Ao(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Z2(n,e){n.uniform1iv(this.addr,e)}function J2(n,e){n.uniform2iv(this.addr,e)}function Q2(n,e){n.uniform3iv(this.addr,e)}function eT(n,e){n.uniform4iv(this.addr,e)}function tT(n,e){n.uniform1uiv(this.addr,e)}function nT(n,e){n.uniform2uiv(this.addr,e)}function iT(n,e){n.uniform3uiv(this.addr,e)}function rT(n,e){n.uniform4uiv(this.addr,e)}function sT(n,e,t){const i=this.cache,r=e.length,s=eu(t,r);Wt(i,s)||(n.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||$x,s[o])}function oT(n,e,t){const i=this.cache,r=e.length,s=eu(t,r);Wt(i,s)||(n.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Jx,s[o])}function aT(n,e,t){const i=this.cache,r=e.length,s=eu(t,r);Wt(i,s)||(n.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Qx,s[o])}function lT(n,e,t){const i=this.cache,r=e.length,s=eu(t,r);Wt(i,s)||(n.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Zx,s[o])}function cT(n){switch(n){case 5126:return W2;case 35664:return j2;case 35665:return X2;case 35666:return Y2;case 35674:return q2;case 35675:return $2;case 35676:return K2;case 5124:case 35670:return Z2;case 35667:case 35671:return J2;case 35668:case 35672:return Q2;case 35669:case 35673:return eT;case 5125:return tT;case 36294:return nT;case 36295:return iT;case 36296:return rT;case 35678:case 36198:case 36298:case 36306:case 35682:return sT;case 35679:case 36299:case 36307:return oT;case 35680:case 36300:case 36308:case 36293:return aT;case 36289:case 36303:case 36311:case 36292:return lT}}class uT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=H2(t.type)}}class fT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cT(t.type)}}class hT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const uf=/(\w+)(\])?(\[|\.)?/g;function m0(n,e){n.seq.push(e),n.map[e.id]=e}function dT(n,e,t){const i=n.name,r=i.length;for(uf.lastIndex=0;;){const s=uf.exec(i),o=uf.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){m0(t,c===void 0?new uT(a,n,e):new fT(a,n,e));break}else{let f=t.map[a];f===void 0&&(f=new hT(a),m0(t,f)),t=f}}}class Zl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);dT(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function g0(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const pT=37297;let mT=0;function gT(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function vT(n){const e=dt.getPrimaries(dt.workingColorSpace),t=dt.getPrimaries(n);let i;switch(e===t?i="":e===Cc&&t===Ac?i="LinearDisplayP3ToLinearSRGB":e===Ac&&t===Cc&&(i="LinearSRGBToLinearDisplayP3"),n){case Ir:case Jc:return[i,"LinearTransferOETF"];case hi:case Pd:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function v0(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+gT(n.getShaderSource(e),o)}else return r}function xT(n,e){const t=vT(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function _T(n,e){let t;switch(e){case R1:t="Linear";break;case P1:t="Reinhard";break;case L1:t="OptimizedCineon";break;case Tx:t="ACESFilmic";break;case N1:t="AgX";break;case I1:t="Neutral";break;case D1:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function yT(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.alphaToCoverage||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Zs).join(`
`)}function MT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zs).join(`
`)}function ST(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function wT(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Zs(n){return n!==""}function x0(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _0(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ET=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ch(n){return n.replace(ET,AT)}const TT=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function AT(n,e){let t=$e[e];if(t===void 0){const i=TT.get(e);if(i!==void 0)t=$e[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Ch(t)}const CT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function y0(n){return n.replace(CT,bT)}function bT(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function M0(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	`;return n.isWebGL2&&(e+=`precision ${n.precision} sampler3D;
		precision ${n.precision} sampler2DArray;
		precision ${n.precision} sampler2DShadow;
		precision ${n.precision} samplerCubeShadow;
		precision ${n.precision} sampler2DArrayShadow;
		precision ${n.precision} isampler2D;
		precision ${n.precision} isampler3D;
		precision ${n.precision} isamplerCube;
		precision ${n.precision} isampler2DArray;
		precision ${n.precision} usampler2D;
		precision ${n.precision} usampler3D;
		precision ${n.precision} usamplerCube;
		precision ${n.precision} usampler2DArray;
		`),n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function RT(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Sx?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===wx?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function PT(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case go:case vo:e="ENVMAP_TYPE_CUBE";break;case Zc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function LT(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case vo:e="ENVMAP_MODE_REFRACTION";break}return e}function DT(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Ex:e="ENVMAP_BLENDING_MULTIPLY";break;case C1:e="ENVMAP_BLENDING_MIX";break;case b1:e="ENVMAP_BLENDING_ADD";break}return e}function NT(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function IT(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=RT(t),c=PT(t),u=LT(t),f=DT(t),h=NT(t),p=t.isWebGL2?"":yT(t),v=MT(t),_=ST(s),m=r.createProgram();let d,x,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Zs).join(`
`),d.length>0&&(d+=`
`),x=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Zs).join(`
`),x.length>0&&(x+=`
`)):(d=[M0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zs).join(`
`),x=[p,M0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tr?"#define TONE_MAPPING":"",t.toneMapping!==Tr?$e.tonemapping_pars_fragment:"",t.toneMapping!==Tr?_T("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,xT("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zs).join(`
`)),o=Ch(o),o=x0(o,t),o=_0(o,t),a=Ch(a),a=x0(a,t),a=_0(a,t),o=y0(o),a=y0(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,d=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,x=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===km?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===km?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=g+d+o,T=g+x+a,E=g0(r,r.VERTEX_SHADER,M),S=g0(r,r.FRAGMENT_SHADER,T);r.attachShader(m,E),r.attachShader(m,S),t.index0AttributeName!==void 0?r.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(m,0,"position"),r.linkProgram(m);function b(j){if(n.debug.checkShaderErrors){const J=r.getProgramInfoLog(m).trim(),I=r.getShaderInfoLog(E).trim(),X=r.getShaderInfoLog(S).trim();let H=!0,Q=!0;if(r.getProgramParameter(m,r.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,m,E,S);else{const k=v0(r,E,"vertex"),z=v0(r,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(m,r.VALIDATE_STATUS)+`

Material Name: `+j.name+`
Material Type: `+j.type+`

Program Info Log: `+J+`
`+k+`
`+z)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(I===""||X==="")&&(Q=!1);Q&&(j.diagnostics={runnable:H,programLog:J,vertexShader:{log:I,prefix:d},fragmentShader:{log:X,prefix:x}})}r.deleteShader(E),r.deleteShader(S),D=new Zl(r,m),y=wT(r,m)}let D;this.getUniforms=function(){return D===void 0&&b(this),D};let y;this.getAttributes=function(){return y===void 0&&b(this),y};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=r.getProgramParameter(m,pT)),A},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=mT++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=E,this.fragmentShader=S,this}let UT=0;class FT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new kT(e),t.set(e,i)),i}}class kT{constructor(e){this.id=UT++,this.code=e,this.usedTimes=0}}function zT(n,e,t,i,r,s,o){const a=new Ld,l=new FT,c=new Set,u=[],f=r.isWebGL2,h=r.logarithmicDepthBuffer,p=r.vertexTextures;let v=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function d(y,A,j,J,I){const X=J.fog,H=I.geometry,Q=y.isMeshStandardMaterial?J.environment:null,k=(y.isMeshStandardMaterial?t:e).get(y.envMap||Q),z=k&&k.mapping===Zc?k.image.height:null,B=_[y.type];y.precision!==null&&(v=r.getMaxPrecision(y.precision),v!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",v,"instead."));const $=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,se=$!==void 0?$.length:0;let Ce=0;H.morphAttributes.position!==void 0&&(Ce=1),H.morphAttributes.normal!==void 0&&(Ce=2),H.morphAttributes.color!==void 0&&(Ce=3);let G,oe,ue,_e;if(B){const lt=Mi[B];G=lt.vertexShader,oe=lt.fragmentShader}else G=y.vertexShader,oe=y.fragmentShader,l.update(y),ue=l.getVertexShaderID(y),_e=l.getFragmentShaderID(y);const we=n.getRenderTarget(),Ee=I.isInstancedMesh===!0,Oe=I.isBatchedMesh===!0,Re=!!y.map,N=!!y.matcap,W=!!k,O=!!y.aoMap,ie=!!y.lightMap,ne=!!y.bumpMap,ge=!!y.normalMap,pe=!!y.displacementMap,Se=!!y.emissiveMap,ke=!!y.metalnessMap,P=!!y.roughnessMap,w=y.anisotropy>0,q=y.clearcoat>0,ee=y.iridescence>0,ce=y.sheen>0,re=y.transmission>0,Ne=w&&!!y.anisotropyMap,Pe=q&&!!y.clearcoatMap,fe=q&&!!y.clearcoatNormalMap,xe=q&&!!y.clearcoatRoughnessMap,Be=ee&&!!y.iridescenceMap,ve=ee&&!!y.iridescenceThicknessMap,Et=ce&&!!y.sheenColorMap,Xe=ce&&!!y.sheenRoughnessMap,ze=!!y.specularMap,Le=!!y.specularColorMap,Ue=!!y.specularIntensityMap,L=re&&!!y.transmissionMap,ae=re&&!!y.thicknessMap,De=!!y.gradientMap,F=!!y.alphaMap,me=y.alphaTest>0,Y=!!y.alphaHash,he=!!y.extensions;let Te=Tr;y.toneMapped&&(we===null||we.isXRRenderTarget===!0)&&(Te=n.toneMapping);const et={isWebGL2:f,shaderID:B,shaderType:y.type,shaderName:y.name,vertexShader:G,fragmentShader:oe,defines:y.defines,customVertexShaderID:ue,customFragmentShaderID:_e,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:v,batching:Oe,instancing:Ee,instancingColor:Ee&&I.instanceColor!==null,instancingMorph:Ee&&I.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:we===null?n.outputColorSpace:we.isXRRenderTarget===!0?we.texture.colorSpace:Ir,alphaToCoverage:!!y.alphaToCoverage,map:Re,matcap:N,envMap:W,envMapMode:W&&k.mapping,envMapCubeUVHeight:z,aoMap:O,lightMap:ie,bumpMap:ne,normalMap:ge,displacementMap:p&&pe,emissiveMap:Se,normalMapObjectSpace:ge&&y.normalMapType===W1,normalMapTangentSpace:ge&&y.normalMapType===Ux,metalnessMap:ke,roughnessMap:P,anisotropy:w,anisotropyMap:Ne,clearcoat:q,clearcoatMap:Pe,clearcoatNormalMap:fe,clearcoatRoughnessMap:xe,iridescence:ee,iridescenceMap:Be,iridescenceThicknessMap:ve,sheen:ce,sheenColorMap:Et,sheenRoughnessMap:Xe,specularMap:ze,specularColorMap:Le,specularIntensityMap:Ue,transmission:re,transmissionMap:L,thicknessMap:ae,gradientMap:De,opaque:y.transparent===!1&&y.blending===so&&y.alphaToCoverage===!1,alphaMap:F,alphaTest:me,alphaHash:Y,combine:y.combine,mapUv:Re&&m(y.map.channel),aoMapUv:O&&m(y.aoMap.channel),lightMapUv:ie&&m(y.lightMap.channel),bumpMapUv:ne&&m(y.bumpMap.channel),normalMapUv:ge&&m(y.normalMap.channel),displacementMapUv:pe&&m(y.displacementMap.channel),emissiveMapUv:Se&&m(y.emissiveMap.channel),metalnessMapUv:ke&&m(y.metalnessMap.channel),roughnessMapUv:P&&m(y.roughnessMap.channel),anisotropyMapUv:Ne&&m(y.anisotropyMap.channel),clearcoatMapUv:Pe&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:fe&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:Xe&&m(y.sheenRoughnessMap.channel),specularMapUv:ze&&m(y.specularMap.channel),specularColorMapUv:Le&&m(y.specularColorMap.channel),specularIntensityMapUv:Ue&&m(y.specularIntensityMap.channel),transmissionMapUv:L&&m(y.transmissionMap.channel),thicknessMapUv:ae&&m(y.thicknessMap.channel),alphaMapUv:F&&m(y.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ge||w),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!H.attributes.uv&&(Re||F),fog:!!X,useFog:y.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:I.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:Ce,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&j.length>0,shadowMapType:n.shadowMap.type,toneMapping:Te,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Re&&y.map.isVideoTexture===!0&&dt.getTransfer(y.map.colorSpace)===St,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===mt,flipSided:y.side===pn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:he&&y.extensions.derivatives===!0,extensionFragDepth:he&&y.extensions.fragDepth===!0,extensionDrawBuffers:he&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:he&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:he&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:he&&y.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionFragDepth:f||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:f||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:f||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return et.vertexUv1s=c.has(1),et.vertexUv2s=c.has(2),et.vertexUv3s=c.has(3),c.clear(),et}function x(y){const A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(const j in y.defines)A.push(j),A.push(y.defines[j]);return y.isRawShaderMaterial===!1&&(g(A,y),M(A,y),A.push(n.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function g(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function M(y,A){a.disableAll(),A.isWebGL2&&a.enable(0),A.supportsVertexTextures&&a.enable(1),A.instancing&&a.enable(2),A.instancingColor&&a.enable(3),A.instancingMorph&&a.enable(4),A.matcap&&a.enable(5),A.envMap&&a.enable(6),A.normalMapObjectSpace&&a.enable(7),A.normalMapTangentSpace&&a.enable(8),A.clearcoat&&a.enable(9),A.iridescence&&a.enable(10),A.alphaTest&&a.enable(11),A.vertexColors&&a.enable(12),A.vertexAlphas&&a.enable(13),A.vertexUv1s&&a.enable(14),A.vertexUv2s&&a.enable(15),A.vertexUv3s&&a.enable(16),A.vertexTangents&&a.enable(17),A.anisotropy&&a.enable(18),A.alphaHash&&a.enable(19),A.batching&&a.enable(20),y.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.skinning&&a.enable(4),A.morphTargets&&a.enable(5),A.morphNormals&&a.enable(6),A.morphColors&&a.enable(7),A.premultipliedAlpha&&a.enable(8),A.shadowMapEnabled&&a.enable(9),A.useLegacyLights&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.alphaToCoverage&&a.enable(20),y.push(a.mask)}function T(y){const A=_[y.type];let j;if(A){const J=Mi[A];j=xS.clone(J.uniforms)}else j=y.uniforms;return j}function E(y,A){let j;for(let J=0,I=u.length;J<I;J++){const X=u[J];if(X.cacheKey===A){j=X,++j.usedTimes;break}}return j===void 0&&(j=new IT(n,A,y,s),u.push(j)),j}function S(y){if(--y.usedTimes===0){const A=u.indexOf(y);u[A]=u[u.length-1],u.pop(),y.destroy()}}function b(y){l.remove(y)}function D(){l.dispose()}return{getParameters:d,getProgramCacheKey:x,getUniforms:T,acquireProgram:E,releaseProgram:S,releaseShaderCache:b,programs:u,dispose:D}}function OT(){let n=new WeakMap;function e(s){let o=n.get(s);return o===void 0&&(o={},n.set(s,o)),o}function t(s){n.delete(s)}function i(s,o,a){n.get(s)[o]=a}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function BT(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function S0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function w0(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f,h,p,v,_,m){let d=n[e];return d===void 0?(d={id:f.id,object:f,geometry:h,material:p,groupOrder:v,renderOrder:f.renderOrder,z:_,group:m},n[e]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=p,d.groupOrder=v,d.renderOrder=f.renderOrder,d.z=_,d.group=m),e++,d}function a(f,h,p,v,_,m){const d=o(f,h,p,v,_,m);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):t.push(d)}function l(f,h,p,v,_,m){const d=o(f,h,p,v,_,m);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):t.unshift(d)}function c(f,h){t.length>1&&t.sort(f||BT),i.length>1&&i.sort(h||S0),r.length>1&&r.sort(h||S0)}function u(){for(let f=e,h=n.length;f<h;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function GT(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new w0,n.set(i,[o])):r>=s.length?(o=new w0,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function VT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new Me};break;case"SpotLight":t={position:new U,direction:new U,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new U,halfWidth:new U,halfHeight:new U};break}return n[e.id]=t,t}}}function HT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let WT=0;function jT(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function XT(n,e){const t=new VT,i=HT(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)r.probe.push(new U);const s=new U,o=new ft,a=new ft;function l(u,f){let h=0,p=0,v=0;for(let j=0;j<9;j++)r.probe[j].set(0,0,0);let _=0,m=0,d=0,x=0,g=0,M=0,T=0,E=0,S=0,b=0,D=0;u.sort(jT);const y=f===!0?Math.PI:1;for(let j=0,J=u.length;j<J;j++){const I=u[j],X=I.color,H=I.intensity,Q=I.distance,k=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=X.r*H*y,p+=X.g*H*y,v+=X.b*H*y;else if(I.isLightProbe){for(let z=0;z<9;z++)r.probe[z].addScaledVector(I.sh.coefficients[z],H);D++}else if(I.isDirectionalLight){const z=t.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity*y),I.castShadow){const B=I.shadow,$=i.get(I);$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,r.directionalShadow[_]=$,r.directionalShadowMap[_]=k,r.directionalShadowMatrix[_]=I.shadow.matrix,M++}r.directional[_]=z,_++}else if(I.isSpotLight){const z=t.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(X).multiplyScalar(H*y),z.distance=Q,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,r.spot[d]=z;const B=I.shadow;if(I.map&&(r.spotLightMap[S]=I.map,S++,B.updateMatrices(I),I.castShadow&&b++),r.spotLightMatrix[d]=B.matrix,I.castShadow){const $=i.get(I);$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,r.spotShadow[d]=$,r.spotShadowMap[d]=k,E++}d++}else if(I.isRectAreaLight){const z=t.get(I);z.color.copy(X).multiplyScalar(H),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),r.rectArea[x]=z,x++}else if(I.isPointLight){const z=t.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity*y),z.distance=I.distance,z.decay=I.decay,I.castShadow){const B=I.shadow,$=i.get(I);$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,$.shadowCameraNear=B.camera.near,$.shadowCameraFar=B.camera.far,r.pointShadow[m]=$,r.pointShadowMap[m]=k,r.pointShadowMatrix[m]=I.shadow.matrix,T++}r.point[m]=z,m++}else if(I.isHemisphereLight){const z=t.get(I);z.skyColor.copy(I.color).multiplyScalar(H*y),z.groundColor.copy(I.groundColor).multiplyScalar(H*y),r.hemi[g]=z,g++}}x>0&&(e.isWebGL2?n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ye.LTC_FLOAT_1,r.rectAreaLTC2=ye.LTC_FLOAT_2):(r.rectAreaLTC1=ye.LTC_HALF_1,r.rectAreaLTC2=ye.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ye.LTC_FLOAT_1,r.rectAreaLTC2=ye.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=ye.LTC_HALF_1,r.rectAreaLTC2=ye.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=h,r.ambient[1]=p,r.ambient[2]=v;const A=r.hash;(A.directionalLength!==_||A.pointLength!==m||A.spotLength!==d||A.rectAreaLength!==x||A.hemiLength!==g||A.numDirectionalShadows!==M||A.numPointShadows!==T||A.numSpotShadows!==E||A.numSpotMaps!==S||A.numLightProbes!==D)&&(r.directional.length=_,r.spot.length=d,r.rectArea.length=x,r.point.length=m,r.hemi.length=g,r.directionalShadow.length=M,r.directionalShadowMap.length=M,r.pointShadow.length=T,r.pointShadowMap.length=T,r.spotShadow.length=E,r.spotShadowMap.length=E,r.directionalShadowMatrix.length=M,r.pointShadowMatrix.length=T,r.spotLightMatrix.length=E+S-b,r.spotLightMap.length=S,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=D,A.directionalLength=_,A.pointLength=m,A.spotLength=d,A.rectAreaLength=x,A.hemiLength=g,A.numDirectionalShadows=M,A.numPointShadows=T,A.numSpotShadows=E,A.numSpotMaps=S,A.numLightProbes=D,r.version=WT++)}function c(u,f){let h=0,p=0,v=0,_=0,m=0;const d=f.matrixWorldInverse;for(let x=0,g=u.length;x<g;x++){const M=u[x];if(M.isDirectionalLight){const T=r.directional[h];T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(d),h++}else if(M.isSpotLight){const T=r.spot[v];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(d),T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(d),v++}else if(M.isRectAreaLight){const T=r.rectArea[_];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(d),a.identity(),o.copy(M.matrixWorld),o.premultiply(d),a.extractRotation(o),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const T=r.point[p];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(d),p++}else if(M.isHemisphereLight){const T=r.hemi[m];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(d),m++}}}return{setup:l,setupView:c,state:r}}function E0(n,e){const t=new XT(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(f){i.push(f)}function a(f){r.push(f)}function l(f){t.setup(i,f)}function c(f){t.setupView(i,f)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function YT(n,e){let t=new WeakMap;function i(s,o=0){const a=t.get(s);let l;return a===void 0?(l=new E0(n,e),t.set(s,[l])):o>=a.length?(l=new E0(n,e),a.push(l)):l=a[o],l}function r(){t=new WeakMap}return{get:i,dispose:r}}class qT extends ps{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=V1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $T extends ps{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const KT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ZT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function JT(n,e,t){let i=new Dd;const r=new le,s=new le,o=new Bt,a=new qT({depthPacking:H1}),l=new $T,c={},u=t.maxTextureSize,f={[br]:pn,[pn]:br,[mt]:mt},h=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:KT,fragmentShader:ZT}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const v=new kt;v.setAttribute("position",new Hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ie(v,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sx;let d=this.type;this.render=function(E,S,b){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const D=n.getRenderTarget(),y=n.getActiveCubeFace(),A=n.getActiveMipmapLevel(),j=n.state;j.setBlending(Er),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const J=d!==ki&&this.type===ki,I=d===ki&&this.type!==ki;for(let X=0,H=E.length;X<H;X++){const Q=E[X],k=Q.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);const z=k.getFrameExtents();if(r.multiply(z),s.copy(k.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/z.x),r.x=s.x*z.x,k.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/z.y),r.y=s.y*z.y,k.mapSize.y=s.y)),k.map===null||J===!0||I===!0){const $=this.type!==ki?{minFilter:Jt,magFilter:Jt}:{};k.map!==null&&k.map.dispose(),k.map=new Rr(r.x,r.y,$),k.map.texture.name=Q.name+".shadowMap",k.camera.updateProjectionMatrix()}n.setRenderTarget(k.map),n.clear();const B=k.getViewportCount();for(let $=0;$<B;$++){const se=k.getViewport($);o.set(s.x*se.x,s.y*se.y,s.x*se.z,s.y*se.w),j.viewport(o),k.updateMatrices(Q,$),i=k.getFrustum(),M(S,b,k.camera,Q,this.type)}k.isPointLightShadow!==!0&&this.type===ki&&x(k,b),k.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(D,y,A)};function x(E,S){const b=e.update(_);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Rr(r.x,r.y)),h.uniforms.shadow_pass.value=E.map.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(S,null,b,h,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(S,null,b,p,_,null)}function g(E,S,b,D){let y=null;const A=b.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(A!==void 0)y=A;else if(y=b.isPointLight===!0?l:a,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const j=y.uuid,J=S.uuid;let I=c[j];I===void 0&&(I={},c[j]=I);let X=I[J];X===void 0&&(X=y.clone(),I[J]=X,S.addEventListener("dispose",T)),y=X}if(y.visible=S.visible,y.wireframe=S.wireframe,D===ki?y.side=S.shadowSide!==null?S.shadowSide:S.side:y.side=S.shadowSide!==null?S.shadowSide:f[S.side],y.alphaMap=S.alphaMap,y.alphaTest=S.alphaTest,y.map=S.map,y.clipShadows=S.clipShadows,y.clippingPlanes=S.clippingPlanes,y.clipIntersection=S.clipIntersection,y.displacementMap=S.displacementMap,y.displacementScale=S.displacementScale,y.displacementBias=S.displacementBias,y.wireframeLinewidth=S.wireframeLinewidth,y.linewidth=S.linewidth,b.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const j=n.properties.get(y);j.light=b}return y}function M(E,S,b,D,y){if(E.visible===!1)return;if(E.layers.test(S.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===ki)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,E.matrixWorld);const J=e.update(E),I=E.material;if(Array.isArray(I)){const X=J.groups;for(let H=0,Q=X.length;H<Q;H++){const k=X[H],z=I[k.materialIndex];if(z&&z.visible){const B=g(E,z,D,y);E.onBeforeShadow(n,E,S,b,J,B,k),n.renderBufferDirect(b,null,J,B,E,k),E.onAfterShadow(n,E,S,b,J,B,k)}}}else if(I.visible){const X=g(E,I,D,y);E.onBeforeShadow(n,E,S,b,J,X,null),n.renderBufferDirect(b,null,J,X,E,null),E.onAfterShadow(n,E,S,b,J,X,null)}}const j=E.children;for(let J=0,I=j.length;J<I;J++)M(j[J],S,b,D,y)}function T(E){E.target.removeEventListener("dispose",T);for(const b in c){const D=c[b],y=E.target.uuid;y in D&&(D[y].dispose(),delete D[y])}}}function QT(n,e,t){const i=t.isWebGL2;function r(){let F=!1;const me=new Bt;let Y=null;const he=new Bt(0,0,0,0);return{setMask:function(Te){Y!==Te&&!F&&(n.colorMask(Te,Te,Te,Te),Y=Te)},setLocked:function(Te){F=Te},setClear:function(Te,et,lt,pt,Dt){Dt===!0&&(Te*=pt,et*=pt,lt*=pt),me.set(Te,et,lt,pt),he.equals(me)===!1&&(n.clearColor(Te,et,lt,pt),he.copy(me))},reset:function(){F=!1,Y=null,he.set(-1,0,0,0)}}}function s(){let F=!1,me=null,Y=null,he=null;return{setTest:function(Te){Te?Ee(n.DEPTH_TEST):Oe(n.DEPTH_TEST)},setMask:function(Te){me!==Te&&!F&&(n.depthMask(Te),me=Te)},setFunc:function(Te){if(Y!==Te){switch(Te){case y1:n.depthFunc(n.NEVER);break;case M1:n.depthFunc(n.ALWAYS);break;case S1:n.depthFunc(n.LESS);break;case Ec:n.depthFunc(n.LEQUAL);break;case w1:n.depthFunc(n.EQUAL);break;case E1:n.depthFunc(n.GEQUAL);break;case T1:n.depthFunc(n.GREATER);break;case A1:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Y=Te}},setLocked:function(Te){F=Te},setClear:function(Te){he!==Te&&(n.clearDepth(Te),he=Te)},reset:function(){F=!1,me=null,Y=null,he=null}}}function o(){let F=!1,me=null,Y=null,he=null,Te=null,et=null,lt=null,pt=null,Dt=null;return{setTest:function(rt){F||(rt?Ee(n.STENCIL_TEST):Oe(n.STENCIL_TEST))},setMask:function(rt){me!==rt&&!F&&(n.stencilMask(rt),me=rt)},setFunc:function(rt,yt,on){(Y!==rt||he!==yt||Te!==on)&&(n.stencilFunc(rt,yt,on),Y=rt,he=yt,Te=on)},setOp:function(rt,yt,on){(et!==rt||lt!==yt||pt!==on)&&(n.stencilOp(rt,yt,on),et=rt,lt=yt,pt=on)},setLocked:function(rt){F=rt},setClear:function(rt){Dt!==rt&&(n.clearStencil(rt),Dt=rt)},reset:function(){F=!1,me=null,Y=null,he=null,Te=null,et=null,lt=null,pt=null,Dt=null}}}const a=new r,l=new s,c=new o,u=new WeakMap,f=new WeakMap;let h={},p={},v=new WeakMap,_=[],m=null,d=!1,x=null,g=null,M=null,T=null,E=null,S=null,b=null,D=new Me(0,0,0),y=0,A=!1,j=null,J=null,I=null,X=null,H=null;const Q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,z=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(B)[1]),k=z>=1):B.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),k=z>=2);let $=null,se={};const Ce=n.getParameter(n.SCISSOR_BOX),G=n.getParameter(n.VIEWPORT),oe=new Bt().fromArray(Ce),ue=new Bt().fromArray(G);function _e(F,me,Y,he){const Te=new Uint8Array(4),et=n.createTexture();n.bindTexture(F,et),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let lt=0;lt<Y;lt++)i&&(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)?n.texImage3D(me,0,n.RGBA,1,1,he,0,n.RGBA,n.UNSIGNED_BYTE,Te):n.texImage2D(me+lt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Te);return et}const we={};we[n.TEXTURE_2D]=_e(n.TEXTURE_2D,n.TEXTURE_2D,1),we[n.TEXTURE_CUBE_MAP]=_e(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(we[n.TEXTURE_2D_ARRAY]=_e(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),we[n.TEXTURE_3D]=_e(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ee(n.DEPTH_TEST),l.setFunc(Ec),pe(!1),Se(rm),Ee(n.CULL_FACE),ne(Er);function Ee(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Oe(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Re(F,me){return p[F]!==me?(n.bindFramebuffer(F,me),p[F]=me,i&&(F===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=me),F===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=me)),!0):!1}function N(F,me){let Y=_,he=!1;if(F){Y=v.get(me),Y===void 0&&(Y=[],v.set(me,Y));const Te=F.textures;if(Y.length!==Te.length||Y[0]!==n.COLOR_ATTACHMENT0){for(let et=0,lt=Te.length;et<lt;et++)Y[et]=n.COLOR_ATTACHMENT0+et;Y.length=Te.length,he=!0}}else Y[0]!==n.BACK&&(Y[0]=n.BACK,he=!0);if(he)if(t.isWebGL2)n.drawBuffers(Y);else if(e.has("WEBGL_draw_buffers")===!0)e.get("WEBGL_draw_buffers").drawBuffersWEBGL(Y);else throw new Error("THREE.WebGLState: Usage of gl.drawBuffers() require WebGL2 or WEBGL_draw_buffers extension")}function W(F){return m!==F?(n.useProgram(F),m=F,!0):!1}const O={[Yr]:n.FUNC_ADD,[s1]:n.FUNC_SUBTRACT,[o1]:n.FUNC_REVERSE_SUBTRACT};if(i)O[lm]=n.MIN,O[cm]=n.MAX;else{const F=e.get("EXT_blend_minmax");F!==null&&(O[lm]=F.MIN_EXT,O[cm]=F.MAX_EXT)}const ie={[a1]:n.ZERO,[l1]:n.ONE,[c1]:n.SRC_COLOR,[vh]:n.SRC_ALPHA,[m1]:n.SRC_ALPHA_SATURATE,[d1]:n.DST_COLOR,[f1]:n.DST_ALPHA,[u1]:n.ONE_MINUS_SRC_COLOR,[xh]:n.ONE_MINUS_SRC_ALPHA,[p1]:n.ONE_MINUS_DST_COLOR,[h1]:n.ONE_MINUS_DST_ALPHA,[g1]:n.CONSTANT_COLOR,[v1]:n.ONE_MINUS_CONSTANT_COLOR,[x1]:n.CONSTANT_ALPHA,[_1]:n.ONE_MINUS_CONSTANT_ALPHA};function ne(F,me,Y,he,Te,et,lt,pt,Dt,rt){if(F===Er){d===!0&&(Oe(n.BLEND),d=!1);return}if(d===!1&&(Ee(n.BLEND),d=!0),F!==r1){if(F!==x||rt!==A){if((g!==Yr||E!==Yr)&&(n.blendEquation(n.FUNC_ADD),g=Yr,E=Yr),rt)switch(F){case so:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case sm:n.blendFunc(n.ONE,n.ONE);break;case om:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case am:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case so:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case sm:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case om:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case am:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}M=null,T=null,S=null,b=null,D.set(0,0,0),y=0,x=F,A=rt}return}Te=Te||me,et=et||Y,lt=lt||he,(me!==g||Te!==E)&&(n.blendEquationSeparate(O[me],O[Te]),g=me,E=Te),(Y!==M||he!==T||et!==S||lt!==b)&&(n.blendFuncSeparate(ie[Y],ie[he],ie[et],ie[lt]),M=Y,T=he,S=et,b=lt),(pt.equals(D)===!1||Dt!==y)&&(n.blendColor(pt.r,pt.g,pt.b,Dt),D.copy(pt),y=Dt),x=F,A=!1}function ge(F,me){F.side===mt?Oe(n.CULL_FACE):Ee(n.CULL_FACE);let Y=F.side===pn;me&&(Y=!Y),pe(Y),F.blending===so&&F.transparent===!1?ne(Er):ne(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),l.setFunc(F.depthFunc),l.setTest(F.depthTest),l.setMask(F.depthWrite),a.setMask(F.colorWrite);const he=F.stencilWrite;c.setTest(he),he&&(c.setMask(F.stencilWriteMask),c.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),c.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),P(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Ee(n.SAMPLE_ALPHA_TO_COVERAGE):Oe(n.SAMPLE_ALPHA_TO_COVERAGE)}function pe(F){j!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),j=F)}function Se(F){F!==n1?(Ee(n.CULL_FACE),F!==J&&(F===rm?n.cullFace(n.BACK):F===i1?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Oe(n.CULL_FACE),J=F}function ke(F){F!==I&&(k&&n.lineWidth(F),I=F)}function P(F,me,Y){F?(Ee(n.POLYGON_OFFSET_FILL),(X!==me||H!==Y)&&(n.polygonOffset(me,Y),X=me,H=Y)):Oe(n.POLYGON_OFFSET_FILL)}function w(F){F?Ee(n.SCISSOR_TEST):Oe(n.SCISSOR_TEST)}function q(F){F===void 0&&(F=n.TEXTURE0+Q-1),$!==F&&(n.activeTexture(F),$=F)}function ee(F,me,Y){Y===void 0&&($===null?Y=n.TEXTURE0+Q-1:Y=$);let he=se[Y];he===void 0&&(he={type:void 0,texture:void 0},se[Y]=he),(he.type!==F||he.texture!==me)&&($!==Y&&(n.activeTexture(Y),$=Y),n.bindTexture(F,me||we[F]),he.type=F,he.texture=me)}function ce(){const F=se[$];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function re(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pe(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function fe(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function xe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Be(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ve(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Et(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Xe(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ze(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Le(F){oe.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),oe.copy(F))}function Ue(F){ue.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),ue.copy(F))}function L(F,me){let Y=f.get(me);Y===void 0&&(Y=new WeakMap,f.set(me,Y));let he=Y.get(F);he===void 0&&(he=n.getUniformBlockIndex(me,F.name),Y.set(F,he))}function ae(F,me){const he=f.get(me).get(F);u.get(me)!==he&&(n.uniformBlockBinding(me,he,F.__bindingPointIndex),u.set(me,he))}function De(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},$=null,se={},p={},v=new WeakMap,_=[],m=null,d=!1,x=null,g=null,M=null,T=null,E=null,S=null,b=null,D=new Me(0,0,0),y=0,A=!1,j=null,J=null,I=null,X=null,H=null,oe.set(0,0,n.canvas.width,n.canvas.height),ue.set(0,0,n.canvas.width,n.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Ee,disable:Oe,bindFramebuffer:Re,drawBuffers:N,useProgram:W,setBlending:ne,setMaterial:ge,setFlipSided:pe,setCullFace:Se,setLineWidth:ke,setPolygonOffset:P,setScissorTest:w,activeTexture:q,bindTexture:ee,unbindTexture:ce,compressedTexImage2D:re,compressedTexImage3D:Ne,texImage2D:Xe,texImage3D:ze,updateUBOMapping:L,uniformBlockBinding:ae,texStorage2D:ve,texStorage3D:Et,texSubImage2D:Pe,texSubImage3D:fe,compressedTexSubImage2D:xe,compressedTexSubImage3D:Be,scissor:Le,viewport:Ue,reset:De}}function eA(n,e,t,i,r,s,o){const a=r.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new le,f=new WeakMap;let h;const p=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,w){return v?new OffscreenCanvas(P,w):Rc("canvas")}function m(P,w,q,ee){let ce=1;const re=ke(P);if((re.width>ee||re.height>ee)&&(ce=ee/Math.max(re.width,re.height)),ce<1||w===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const Ne=w?Ah:Math.floor,Pe=Ne(ce*re.width),fe=Ne(ce*re.height);h===void 0&&(h=_(Pe,fe));const xe=q?_(Pe,fe):h;return xe.width=Pe,xe.height=fe,xe.getContext("2d").drawImage(P,0,0,Pe,fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+Pe+"x"+fe+")."),xe}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),P;return P}function d(P){const w=ke(P);return zm(w.width)&&zm(w.height)}function x(P){return a?!1:P.wrapS!==Fn||P.wrapT!==Fn||P.minFilter!==Jt&&P.minFilter!==Zt}function g(P,w){return P.generateMipmaps&&w&&P.minFilter!==Jt&&P.minFilter!==Zt}function M(P){n.generateMipmap(P)}function T(P,w,q,ee,ce=!1){if(a===!1)return w;if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let re=w;if(w===n.RED&&(q===n.FLOAT&&(re=n.R32F),q===n.HALF_FLOAT&&(re=n.R16F),q===n.UNSIGNED_BYTE&&(re=n.R8)),w===n.RED_INTEGER&&(q===n.UNSIGNED_BYTE&&(re=n.R8UI),q===n.UNSIGNED_SHORT&&(re=n.R16UI),q===n.UNSIGNED_INT&&(re=n.R32UI),q===n.BYTE&&(re=n.R8I),q===n.SHORT&&(re=n.R16I),q===n.INT&&(re=n.R32I)),w===n.RG&&(q===n.FLOAT&&(re=n.RG32F),q===n.HALF_FLOAT&&(re=n.RG16F),q===n.UNSIGNED_BYTE&&(re=n.RG8)),w===n.RG_INTEGER&&(q===n.UNSIGNED_BYTE&&(re=n.RG8UI),q===n.UNSIGNED_SHORT&&(re=n.RG16UI),q===n.UNSIGNED_INT&&(re=n.RG32UI),q===n.BYTE&&(re=n.RG8I),q===n.SHORT&&(re=n.RG16I),q===n.INT&&(re=n.RG32I)),w===n.RGBA){const Ne=ce?Tc:dt.getTransfer(ee);q===n.FLOAT&&(re=n.RGBA32F),q===n.HALF_FLOAT&&(re=n.RGBA16F),q===n.UNSIGNED_BYTE&&(re=Ne===St?n.SRGB8_ALPHA8:n.RGBA8),q===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),q===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function E(P,w,q){return g(P,q)===!0||P.isFramebufferTexture&&P.minFilter!==Jt&&P.minFilter!==Zt?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function S(P){return P===Jt||P===um||P===ko?n.NEAREST:n.LINEAR}function b(P){const w=P.target;w.removeEventListener("dispose",b),y(w),w.isVideoTexture&&f.delete(w)}function D(P){const w=P.target;w.removeEventListener("dispose",D),j(w)}function y(P){const w=i.get(P);if(w.__webglInit===void 0)return;const q=P.source,ee=p.get(q);if(ee){const ce=ee[w.__cacheKey];ce.usedTimes--,ce.usedTimes===0&&A(P),Object.keys(ee).length===0&&p.delete(q)}i.remove(P)}function A(P){const w=i.get(P);n.deleteTexture(w.__webglTexture);const q=P.source,ee=p.get(q);delete ee[w.__cacheKey],o.memory.textures--}function j(P){const w=i.get(P);if(P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(w.__webglFramebuffer[ee]))for(let ce=0;ce<w.__webglFramebuffer[ee].length;ce++)n.deleteFramebuffer(w.__webglFramebuffer[ee][ce]);else n.deleteFramebuffer(w.__webglFramebuffer[ee]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[ee])}else{if(Array.isArray(w.__webglFramebuffer))for(let ee=0;ee<w.__webglFramebuffer.length;ee++)n.deleteFramebuffer(w.__webglFramebuffer[ee]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ee=0;ee<w.__webglColorRenderbuffer.length;ee++)w.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[ee]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const q=P.textures;for(let ee=0,ce=q.length;ee<ce;ee++){const re=i.get(q[ee]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),o.memory.textures--),i.remove(q[ee])}i.remove(P)}let J=0;function I(){J=0}function X(){const P=J;return P>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+r.maxTextures),J+=1,P}function H(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function Q(P,w){const q=i.get(P);if(P.isVideoTexture&&pe(P),P.isRenderTargetTexture===!1&&P.version>0&&q.__version!==P.version){const ee=P.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ue(q,P,w);return}}t.bindTexture(n.TEXTURE_2D,q.__webglTexture,n.TEXTURE0+w)}function k(P,w){const q=i.get(P);if(P.version>0&&q.__version!==P.version){ue(q,P,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,q.__webglTexture,n.TEXTURE0+w)}function z(P,w){const q=i.get(P);if(P.version>0&&q.__version!==P.version){ue(q,P,w);return}t.bindTexture(n.TEXTURE_3D,q.__webglTexture,n.TEXTURE0+w)}function B(P,w){const q=i.get(P);if(P.version>0&&q.__version!==P.version){_e(q,P,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture,n.TEXTURE0+w)}const $={[Mh]:n.REPEAT,[Fn]:n.CLAMP_TO_EDGE,[Sh]:n.MIRRORED_REPEAT},se={[Jt]:n.NEAREST,[um]:n.NEAREST_MIPMAP_NEAREST,[ko]:n.NEAREST_MIPMAP_LINEAR,[Zt]:n.LINEAR,[Nu]:n.LINEAR_MIPMAP_NEAREST,[mr]:n.LINEAR_MIPMAP_LINEAR},Ce={[j1]:n.NEVER,[Z1]:n.ALWAYS,[X1]:n.LESS,[Fx]:n.LEQUAL,[Y1]:n.EQUAL,[K1]:n.GEQUAL,[q1]:n.GREATER,[$1]:n.NOTEQUAL};function G(P,w,q){if(w.type===wi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Zt||w.magFilter===Nu||w.magFilter===ko||w.magFilter===mr||w.minFilter===Zt||w.minFilter===Nu||w.minFilter===ko||w.minFilter===mr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),q?(n.texParameteri(P,n.TEXTURE_WRAP_S,$[w.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,$[w.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,$[w.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,se[w.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,se[w.minFilter])):(n.texParameteri(P,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(P,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(w.wrapS!==Fn||w.wrapT!==Fn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(P,n.TEXTURE_MAG_FILTER,S(w.magFilter)),n.texParameteri(P,n.TEXTURE_MIN_FILTER,S(w.minFilter)),w.minFilter!==Jt&&w.minFilter!==Zt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),w.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,Ce[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Jt||w.minFilter!==ko&&w.minFilter!==mr||w.type===wi&&e.has("OES_texture_float_linear")===!1||a===!1&&w.type===Ra&&e.has("OES_texture_half_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const ee=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function oe(P,w){let q=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",b));const ee=w.source;let ce=p.get(ee);ce===void 0&&(ce={},p.set(ee,ce));const re=H(w);if(re!==P.__cacheKey){ce[re]===void 0&&(ce[re]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,q=!0),ce[re].usedTimes++;const Ne=ce[P.__cacheKey];Ne!==void 0&&(ce[P.__cacheKey].usedTimes--,Ne.usedTimes===0&&A(w)),P.__cacheKey=re,P.__webglTexture=ce[re].texture}return q}function ue(P,w,q){let ee=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ee=n.TEXTURE_3D);const ce=oe(P,w),re=w.source;t.bindTexture(ee,P.__webglTexture,n.TEXTURE0+q);const Ne=i.get(re);if(re.version!==Ne.__version||ce===!0){t.activeTexture(n.TEXTURE0+q);const Pe=dt.getPrimaries(dt.workingColorSpace),fe=w.colorSpace===hr?null:dt.getPrimaries(w.colorSpace),xe=w.colorSpace===hr||Pe===fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Be=x(w)&&d(w.image)===!1;let ve=m(w.image,Be,!1,r.maxTextureSize);ve=Se(w,ve);const Et=d(ve)||a,Xe=s.convert(w.format,w.colorSpace);let ze=s.convert(w.type),Le=T(w.internalFormat,Xe,ze,w.colorSpace,w.isVideoTexture);G(ee,w,Et);let Ue;const L=w.mipmaps,ae=a&&w.isVideoTexture!==!0&&Le!==Ix,De=Ne.__version===void 0||ce===!0,F=re.dataReady,me=E(w,ve,Et);if(w.isDepthTexture)Le=n.DEPTH_COMPONENT,a?w.type===wi?Le=n.DEPTH_COMPONENT32F:w.type===Wi?Le=n.DEPTH_COMPONENT24:w.type===ts?Le=n.DEPTH24_STENCIL8:Le=n.DEPTH_COMPONENT16:w.type===wi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),w.format===ns&&Le===n.DEPTH_COMPONENT&&w.type!==Rd&&w.type!==Wi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),w.type=Wi,ze=s.convert(w.type)),w.format===xo&&Le===n.DEPTH_COMPONENT&&(Le=n.DEPTH_STENCIL,w.type!==ts&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),w.type=ts,ze=s.convert(w.type))),De&&(ae?t.texStorage2D(n.TEXTURE_2D,1,Le,ve.width,ve.height):t.texImage2D(n.TEXTURE_2D,0,Le,ve.width,ve.height,0,Xe,ze,null));else if(w.isDataTexture)if(L.length>0&&Et){ae&&De&&t.texStorage2D(n.TEXTURE_2D,me,Le,L[0].width,L[0].height);for(let Y=0,he=L.length;Y<he;Y++)Ue=L[Y],ae?F&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,Ue.width,Ue.height,Xe,ze,Ue.data):t.texImage2D(n.TEXTURE_2D,Y,Le,Ue.width,Ue.height,0,Xe,ze,Ue.data);w.generateMipmaps=!1}else ae?(De&&t.texStorage2D(n.TEXTURE_2D,me,Le,ve.width,ve.height),F&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ve.width,ve.height,Xe,ze,ve.data)):t.texImage2D(n.TEXTURE_2D,0,Le,ve.width,ve.height,0,Xe,ze,ve.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){ae&&De&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,Le,L[0].width,L[0].height,ve.depth);for(let Y=0,he=L.length;Y<he;Y++)Ue=L[Y],w.format!==kn?Xe!==null?ae?F&&t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,Ue.width,Ue.height,ve.depth,Xe,Ue.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Y,Le,Ue.width,Ue.height,ve.depth,0,Ue.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?F&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,Ue.width,Ue.height,ve.depth,Xe,ze,Ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Y,Le,Ue.width,Ue.height,ve.depth,0,Xe,ze,Ue.data)}else{ae&&De&&t.texStorage2D(n.TEXTURE_2D,me,Le,L[0].width,L[0].height);for(let Y=0,he=L.length;Y<he;Y++)Ue=L[Y],w.format!==kn?Xe!==null?ae?F&&t.compressedTexSubImage2D(n.TEXTURE_2D,Y,0,0,Ue.width,Ue.height,Xe,Ue.data):t.compressedTexImage2D(n.TEXTURE_2D,Y,Le,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?F&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,Ue.width,Ue.height,Xe,ze,Ue.data):t.texImage2D(n.TEXTURE_2D,Y,Le,Ue.width,Ue.height,0,Xe,ze,Ue.data)}else if(w.isDataArrayTexture)ae?(De&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,Le,ve.width,ve.height,ve.depth),F&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ve.width,ve.height,ve.depth,Xe,ze,ve.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,ve.width,ve.height,ve.depth,0,Xe,ze,ve.data);else if(w.isData3DTexture)ae?(De&&t.texStorage3D(n.TEXTURE_3D,me,Le,ve.width,ve.height,ve.depth),F&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ve.width,ve.height,ve.depth,Xe,ze,ve.data)):t.texImage3D(n.TEXTURE_3D,0,Le,ve.width,ve.height,ve.depth,0,Xe,ze,ve.data);else if(w.isFramebufferTexture){if(De)if(ae)t.texStorage2D(n.TEXTURE_2D,me,Le,ve.width,ve.height);else{let Y=ve.width,he=ve.height;for(let Te=0;Te<me;Te++)t.texImage2D(n.TEXTURE_2D,Te,Le,Y,he,0,Xe,ze,null),Y>>=1,he>>=1}}else if(L.length>0&&Et){if(ae&&De){const Y=ke(L[0]);t.texStorage2D(n.TEXTURE_2D,me,Le,Y.width,Y.height)}for(let Y=0,he=L.length;Y<he;Y++)Ue=L[Y],ae?F&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,Xe,ze,Ue):t.texImage2D(n.TEXTURE_2D,Y,Le,Xe,ze,Ue);w.generateMipmaps=!1}else if(ae){if(De){const Y=ke(ve);t.texStorage2D(n.TEXTURE_2D,me,Le,Y.width,Y.height)}F&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Xe,ze,ve)}else t.texImage2D(n.TEXTURE_2D,0,Le,Xe,ze,ve);g(w,Et)&&M(ee),Ne.__version=re.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function _e(P,w,q){if(w.image.length!==6)return;const ee=oe(P,w),ce=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+q);const re=i.get(ce);if(ce.version!==re.__version||ee===!0){t.activeTexture(n.TEXTURE0+q);const Ne=dt.getPrimaries(dt.workingColorSpace),Pe=w.colorSpace===hr?null:dt.getPrimaries(w.colorSpace),fe=w.colorSpace===hr||Ne===Pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const xe=w.isCompressedTexture||w.image[0].isCompressedTexture,Be=w.image[0]&&w.image[0].isDataTexture,ve=[];for(let Y=0;Y<6;Y++)!xe&&!Be?ve[Y]=m(w.image[Y],!1,!0,r.maxCubemapSize):ve[Y]=Be?w.image[Y].image:w.image[Y],ve[Y]=Se(w,ve[Y]);const Et=ve[0],Xe=d(Et)||a,ze=s.convert(w.format,w.colorSpace),Le=s.convert(w.type),Ue=T(w.internalFormat,ze,Le,w.colorSpace),L=a&&w.isVideoTexture!==!0,ae=re.__version===void 0||ee===!0,De=ce.dataReady;let F=E(w,Et,Xe);G(n.TEXTURE_CUBE_MAP,w,Xe);let me;if(xe){L&&ae&&t.texStorage2D(n.TEXTURE_CUBE_MAP,F,Ue,Et.width,Et.height);for(let Y=0;Y<6;Y++){me=ve[Y].mipmaps;for(let he=0;he<me.length;he++){const Te=me[he];w.format!==kn?ze!==null?L?De&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he,0,0,Te.width,Te.height,ze,Te.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he,Ue,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?De&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he,0,0,Te.width,Te.height,ze,Le,Te.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he,Ue,Te.width,Te.height,0,ze,Le,Te.data)}}}else{if(me=w.mipmaps,L&&ae){me.length>0&&F++;const Y=ke(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,F,Ue,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(Be){L?De&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ve[Y].width,ve[Y].height,ze,Le,ve[Y].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ue,ve[Y].width,ve[Y].height,0,ze,Le,ve[Y].data);for(let he=0;he<me.length;he++){const et=me[he].image[Y].image;L?De&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he+1,0,0,et.width,et.height,ze,Le,et.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he+1,Ue,et.width,et.height,0,ze,Le,et.data)}}else{L?De&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ze,Le,ve[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ue,ze,Le,ve[Y]);for(let he=0;he<me.length;he++){const Te=me[he];L?De&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he+1,0,0,ze,Le,Te.image[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,he+1,Ue,ze,Le,Te.image[Y])}}}g(w,Xe)&&M(n.TEXTURE_CUBE_MAP),re.__version=ce.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function we(P,w,q,ee,ce,re){const Ne=s.convert(q.format,q.colorSpace),Pe=s.convert(q.type),fe=T(q.internalFormat,Ne,Pe,q.colorSpace);if(!i.get(w).__hasExternalTextures){const Be=Math.max(1,w.width>>re),ve=Math.max(1,w.height>>re);ce===n.TEXTURE_3D||ce===n.TEXTURE_2D_ARRAY?t.texImage3D(ce,re,fe,Be,ve,w.depth,0,Ne,Pe,null):t.texImage2D(ce,re,fe,Be,ve,0,Ne,Pe,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),ge(w)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,ce,i.get(q).__webglTexture,0,ne(w)):(ce===n.TEXTURE_2D||ce>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ce<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,ce,i.get(q).__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ee(P,w,q){if(n.bindRenderbuffer(n.RENDERBUFFER,P),w.depthBuffer&&!w.stencilBuffer){let ee=a===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(q||ge(w)){const ce=w.depthTexture;ce&&ce.isDepthTexture&&(ce.type===wi?ee=n.DEPTH_COMPONENT32F:ce.type===Wi&&(ee=n.DEPTH_COMPONENT24));const re=ne(w);ge(w)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re,ee,w.width,w.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,re,ee,w.width,w.height)}else n.renderbufferStorage(n.RENDERBUFFER,ee,w.width,w.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,P)}else if(w.depthBuffer&&w.stencilBuffer){const ee=ne(w);q&&ge(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ee,n.DEPTH24_STENCIL8,w.width,w.height):ge(w)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ee,n.DEPTH24_STENCIL8,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,P)}else{const ee=w.textures;for(let ce=0;ce<ee.length;ce++){const re=ee[ce],Ne=s.convert(re.format,re.colorSpace),Pe=s.convert(re.type),fe=T(re.internalFormat,Ne,Pe,re.colorSpace),xe=ne(w);q&&ge(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,xe,fe,w.width,w.height):ge(w)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xe,fe,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,fe,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),Q(w.depthTexture,0);const ee=i.get(w.depthTexture).__webglTexture,ce=ne(w);if(w.depthTexture.format===ns)ge(w)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,ce):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(w.depthTexture.format===xo)ge(w)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,ce):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Re(P){const w=i.get(P),q=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");Oe(w.__webglFramebuffer,P)}else if(q){w.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[ee]),w.__webglDepthbuffer[ee]=n.createRenderbuffer(),Ee(w.__webglDepthbuffer[ee],P,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=n.createRenderbuffer(),Ee(w.__webglDepthbuffer,P,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function N(P,w,q){const ee=i.get(P);w!==void 0&&we(ee.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),q!==void 0&&Re(P)}function W(P){const w=P.texture,q=i.get(P),ee=i.get(w);P.addEventListener("dispose",D);const ce=P.textures,re=P.isWebGLCubeRenderTarget===!0,Ne=ce.length>1,Pe=d(P)||a;if(Ne||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=w.version,o.memory.textures++),re){q.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(a&&w.mipmaps&&w.mipmaps.length>0){q.__webglFramebuffer[fe]=[];for(let xe=0;xe<w.mipmaps.length;xe++)q.__webglFramebuffer[fe][xe]=n.createFramebuffer()}else q.__webglFramebuffer[fe]=n.createFramebuffer()}else{if(a&&w.mipmaps&&w.mipmaps.length>0){q.__webglFramebuffer=[];for(let fe=0;fe<w.mipmaps.length;fe++)q.__webglFramebuffer[fe]=n.createFramebuffer()}else q.__webglFramebuffer=n.createFramebuffer();if(Ne)if(r.drawBuffers)for(let fe=0,xe=ce.length;fe<xe;fe++){const Be=i.get(ce[fe]);Be.__webglTexture===void 0&&(Be.__webglTexture=n.createTexture(),o.memory.textures++)}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&P.samples>0&&ge(P)===!1){q.__webglMultisampledFramebuffer=n.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let fe=0;fe<ce.length;fe++){const xe=ce[fe];q.__webglColorRenderbuffer[fe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,q.__webglColorRenderbuffer[fe]);const Be=s.convert(xe.format,xe.colorSpace),ve=s.convert(xe.type),Et=T(xe.internalFormat,Be,ve,xe.colorSpace,P.isXRRenderTarget===!0),Xe=ne(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Xe,Et,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,q.__webglColorRenderbuffer[fe])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(q.__webglDepthRenderbuffer=n.createRenderbuffer(),Ee(q.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),G(n.TEXTURE_CUBE_MAP,w,Pe);for(let fe=0;fe<6;fe++)if(a&&w.mipmaps&&w.mipmaps.length>0)for(let xe=0;xe<w.mipmaps.length;xe++)we(q.__webglFramebuffer[fe][xe],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,xe);else we(q.__webglFramebuffer[fe],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);g(w,Pe)&&M(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let fe=0,xe=ce.length;fe<xe;fe++){const Be=ce[fe],ve=i.get(Be);t.bindTexture(n.TEXTURE_2D,ve.__webglTexture),G(n.TEXTURE_2D,Be,Pe),we(q.__webglFramebuffer,P,Be,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,0),g(Be,Pe)&&M(n.TEXTURE_2D)}t.unbindTexture()}else{let fe=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(a?fe=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(fe,ee.__webglTexture),G(fe,w,Pe),a&&w.mipmaps&&w.mipmaps.length>0)for(let xe=0;xe<w.mipmaps.length;xe++)we(q.__webglFramebuffer[xe],P,w,n.COLOR_ATTACHMENT0,fe,xe);else we(q.__webglFramebuffer,P,w,n.COLOR_ATTACHMENT0,fe,0);g(w,Pe)&&M(fe),t.unbindTexture()}P.depthBuffer&&Re(P)}function O(P){const w=d(P)||a,q=P.textures;for(let ee=0,ce=q.length;ee<ce;ee++){const re=q[ee];if(g(re,w)){const Ne=P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Pe=i.get(re).__webglTexture;t.bindTexture(Ne,Pe),M(Ne),t.unbindTexture()}}}function ie(P){if(a&&P.samples>0&&ge(P)===!1){const w=P.textures,q=P.width,ee=P.height;let ce=n.COLOR_BUFFER_BIT;const re=[],Ne=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(P),fe=w.length>1;if(fe)for(let xe=0;xe<w.length;xe++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let xe=0;xe<w.length;xe++){re.push(n.COLOR_ATTACHMENT0+xe),P.depthBuffer&&re.push(Ne);const Be=Pe.__ignoreDepthValues!==void 0?Pe.__ignoreDepthValues:!1;if(Be===!1&&(P.depthBuffer&&(ce|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&(ce|=n.STENCIL_BUFFER_BIT)),fe&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[xe]),Be===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[Ne]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[Ne])),fe){const ve=i.get(w[xe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ve,0)}n.blitFramebuffer(0,0,q,ee,0,0,q,ee,ce,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,re)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),fe)for(let xe=0;xe<w.length;xe++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[xe]);const Be=i.get(w[xe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,Be,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}}function ne(P){return Math.min(r.maxSamples,P.samples)}function ge(P){const w=i.get(P);return a&&P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function pe(P){const w=o.render.frame;f.get(P)!==w&&(f.set(P,w),P.update())}function Se(P,w){const q=P.colorSpace,ee=P.format,ce=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===Eh||q!==Ir&&q!==hr&&(dt.getTransfer(q)===St?a===!1?e.has("EXT_sRGB")===!0&&ee===kn?(P.format=Eh,P.minFilter=Zt,P.generateMipmaps=!1):w=Ox.sRGBToLinear(w):(ee!==kn||ce!==bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),w}function ke(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(u.width=P.naturalWidth||P.width,u.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(u.width=P.displayWidth,u.height=P.displayHeight):(u.width=P.width,u.height=P.height),u}this.allocateTextureUnit=X,this.resetTextureUnits=I,this.setTexture2D=Q,this.setTexture2DArray=k,this.setTexture3D=z,this.setTextureCube=B,this.rebindTextures=N,this.setupRenderTarget=W,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=Re,this.setupFrameBufferTexture=we,this.useMultisampledRTT=ge}function tA(n,e,t){const i=t.isWebGL2;function r(s,o=hr){let a;const l=dt.getTransfer(o);if(s===bi)return n.UNSIGNED_BYTE;if(s===bx)return n.UNSIGNED_SHORT_4_4_4_4;if(s===Rx)return n.UNSIGNED_SHORT_5_5_5_1;if(s===U1)return n.BYTE;if(s===F1)return n.SHORT;if(s===Rd)return n.UNSIGNED_SHORT;if(s===Cx)return n.INT;if(s===Wi)return n.UNSIGNED_INT;if(s===wi)return n.FLOAT;if(s===Ra)return i?n.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===k1)return n.ALPHA;if(s===kn)return n.RGBA;if(s===z1)return n.LUMINANCE;if(s===O1)return n.LUMINANCE_ALPHA;if(s===ns)return n.DEPTH_COMPONENT;if(s===xo)return n.DEPTH_STENCIL;if(s===Eh)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===Px)return n.RED;if(s===Lx)return n.RED_INTEGER;if(s===B1)return n.RG;if(s===Dx)return n.RG_INTEGER;if(s===Nx)return n.RGBA_INTEGER;if(s===Iu||s===Uu||s===Fu||s===ku)if(l===St)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===Iu)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Uu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Fu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===ku)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===Iu)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Uu)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Fu)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===ku)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===fm||s===hm||s===dm||s===pm)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===fm)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===hm)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===dm)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===pm)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Ix)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===mm||s===gm)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===mm)return l===St?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===gm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===vm||s===xm||s===_m||s===ym||s===Mm||s===Sm||s===wm||s===Em||s===Tm||s===Am||s===Cm||s===bm||s===Rm||s===Pm)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===vm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===xm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===_m)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===ym)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Mm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Sm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===wm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Em)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Tm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Am)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Cm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===bm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Rm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Pm)return l===St?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===zu||s===Lm||s===Dm)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===zu)return l===St?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Lm)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Dm)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===G1||s===Nm||s===Im||s===Um)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===zu)return a.COMPRESSED_RED_RGTC1_EXT;if(s===Nm)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Im)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Um)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===ts?i?n.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):n[s]!==void 0?n[s]:null}return{convert:r}}class nA extends Jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class An extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const iA={type:"move"};class ff{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new An,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new An,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new An,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),p=.02,v=.005;c.inputState.pinching&&h>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(iA)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new An;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const rA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class oA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new mn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}render(e,t){if(this.texture!==null){if(this.mesh===null){const i=t.cameras[0].viewport,r=new Sn({extensions:{fragDepth:!0},vertexShader:rA,fragmentShader:sA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Ie(new Wn(20,20),r)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class aA extends hs{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,p=null,v=null;const _=new oA,m=t.getContextAttributes();let d=null,x=null;const g=[],M=[],T=new le;let E=null;const S=new Jn;S.layers.enable(1),S.viewport=new Bt;const b=new Jn;b.layers.enable(2),b.viewport=new Bt;const D=[S,b],y=new nA;y.layers.enable(1),y.layers.enable(2);let A=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let oe=g[G];return oe===void 0&&(oe=new ff,g[G]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(G){let oe=g[G];return oe===void 0&&(oe=new ff,g[G]=oe),oe.getGripSpace()},this.getHand=function(G){let oe=g[G];return oe===void 0&&(oe=new ff,g[G]=oe),oe.getHandSpace()};function J(G){const oe=M.indexOf(G.inputSource);if(oe===-1)return;const ue=g[oe];ue!==void 0&&(ue.update(G.inputSource,G.frame,c||o),ue.dispatchEvent({type:G.type,data:G.inputSource}))}function I(){r.removeEventListener("select",J),r.removeEventListener("selectstart",J),r.removeEventListener("selectend",J),r.removeEventListener("squeeze",J),r.removeEventListener("squeezestart",J),r.removeEventListener("squeezeend",J),r.removeEventListener("end",I),r.removeEventListener("inputsourceschange",X);for(let G=0;G<g.length;G++){const oe=M[G];oe!==null&&(M[G]=null,g[G].disconnect(oe))}A=null,j=null,_.reset(),e.setRenderTarget(d),p=null,h=null,f=null,r=null,x=null,Ce.stop(),i.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(G){if(r=G,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",J),r.addEventListener("selectstart",J),r.addEventListener("selectend",J),r.addEventListener("squeeze",J),r.addEventListener("squeezestart",J),r.addEventListener("squeezeend",J),r.addEventListener("end",I),r.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const oe={antialias:r.renderState.layers===void 0?m.antialias:!0,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,oe),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Rr(p.framebufferWidth,p.framebufferHeight,{format:kn,type:bi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let oe=null,ue=null,_e=null;m.depth&&(_e=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=m.stencil?xo:ns,ue=m.stencil?ts:Wi);const we={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:s};f=new XRWebGLBinding(r,t),h=f.createProjectionLayer(we),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),x=new Rr(h.textureWidth,h.textureHeight,{format:kn,type:bi,depthTexture:new Ud(h.textureWidth,h.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0});const Ee=e.properties.get(x);Ee.__ignoreDepthValues=h.ignoreDepthValues}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ce.setContext(r),Ce.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function X(G){for(let oe=0;oe<G.removed.length;oe++){const ue=G.removed[oe],_e=M.indexOf(ue);_e>=0&&(M[_e]=null,g[_e].disconnect(ue))}for(let oe=0;oe<G.added.length;oe++){const ue=G.added[oe];let _e=M.indexOf(ue);if(_e===-1){for(let Ee=0;Ee<g.length;Ee++)if(Ee>=M.length){M.push(ue),_e=Ee;break}else if(M[Ee]===null){M[Ee]=ue,_e=Ee;break}if(_e===-1)break}const we=g[_e];we&&we.connect(ue)}}const H=new U,Q=new U;function k(G,oe,ue){H.setFromMatrixPosition(oe.matrixWorld),Q.setFromMatrixPosition(ue.matrixWorld);const _e=H.distanceTo(Q),we=oe.projectionMatrix.elements,Ee=ue.projectionMatrix.elements,Oe=we[14]/(we[10]-1),Re=we[14]/(we[10]+1),N=(we[9]+1)/we[5],W=(we[9]-1)/we[5],O=(we[8]-1)/we[0],ie=(Ee[8]+1)/Ee[0],ne=Oe*O,ge=Oe*ie,pe=_e/(-O+ie),Se=pe*-O;oe.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Se),G.translateZ(pe),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const ke=Oe+pe,P=Re+pe,w=ne-Se,q=ge+(_e-Se),ee=N*Re/P*ke,ce=W*Re/P*ke;G.projectionMatrix.makePerspective(w,q,ee,ce,ke,P),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function z(G,oe){oe===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(oe.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(r===null)return;_.texture!==null&&(G.near=_.depthNear,G.far=_.depthFar),y.near=b.near=S.near=G.near,y.far=b.far=S.far=G.far,(A!==y.near||j!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),A=y.near,j=y.far,S.near=A,S.far=j,b.near=A,b.far=j,S.updateProjectionMatrix(),b.updateProjectionMatrix(),G.updateProjectionMatrix());const oe=G.parent,ue=y.cameras;z(y,oe);for(let _e=0;_e<ue.length;_e++)z(ue[_e],oe);ue.length===2?k(y,S,b):y.projectionMatrix.copy(S.projectionMatrix),B(G,y,oe)};function B(G,oe,ue){ue===null?G.matrix.copy(oe.matrixWorld):(G.matrix.copy(ue.matrixWorld),G.matrix.invert(),G.matrix.multiply(oe.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(oe.projectionMatrix),G.projectionMatrixInverse.copy(oe.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Th*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(G){l=G,h!==null&&(h.fixedFoveation=G),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=G)},this.hasDepthSensing=function(){return _.texture!==null};let $=null;function se(G,oe){if(u=oe.getViewerPose(c||o),v=oe,u!==null){const ue=u.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let _e=!1;ue.length!==y.cameras.length&&(y.cameras.length=0,_e=!0);for(let Ee=0;Ee<ue.length;Ee++){const Oe=ue[Ee];let Re=null;if(p!==null)Re=p.getViewport(Oe);else{const W=f.getViewSubImage(h,Oe);Re=W.viewport,Ee===0&&(e.setRenderTargetTextures(x,W.colorTexture,h.ignoreDepthValues?void 0:W.depthStencilTexture),e.setRenderTarget(x))}let N=D[Ee];N===void 0&&(N=new Jn,N.layers.enable(Ee),N.viewport=new Bt,D[Ee]=N),N.matrix.fromArray(Oe.transform.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale),N.projectionMatrix.fromArray(Oe.projectionMatrix),N.projectionMatrixInverse.copy(N.projectionMatrix).invert(),N.viewport.set(Re.x,Re.y,Re.width,Re.height),Ee===0&&(y.matrix.copy(N.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),_e===!0&&y.cameras.push(N)}const we=r.enabledFeatures;if(we&&we.includes("depth-sensing")){const Ee=f.getDepthInformation(ue[0]);Ee&&Ee.isValid&&Ee.texture&&_.init(e,Ee,r.renderState)}}for(let ue=0;ue<g.length;ue++){const _e=M[ue],we=g[ue];_e!==null&&we!==void 0&&we.update(_e,oe,c||o)}_.render(e,y),$&&$(G,oe),oe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:oe}),v=null}const Ce=new qx;Ce.setAnimationLoop(se),this.setAnimationLoop=function(G){$=G},this.dispose=function(){}}}const Hr=new Ri,lA=new ft;function cA(n,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,jx(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,x,g,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),f(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),h(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(s(m,d),v(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),_(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,x,g):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===pn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===pn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const x=e.get(d),g=x.envMap,M=x.envMapRotation;if(g&&(m.envMap.value=g,Hr.copy(M),Hr.x*=-1,Hr.y*=-1,Hr.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(Hr.y*=-1,Hr.z*=-1),m.envMapRotation.value.setFromMatrix4(lA.makeRotationFromEuler(Hr)),m.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const T=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*T,t(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,x,g){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=g*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),e.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===pn&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const x=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function uA(n,e,t,i){let r={},s={},o=[];const a=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,g){const M=g.program;i.uniformBlockBinding(x,M)}function c(x,g){let M=r[x.id];M===void 0&&(v(x),M=u(x),r[x.id]=M,x.addEventListener("dispose",m));const T=g.program;i.updateUBOMapping(x,T);const E=e.render.frame;s[x.id]!==E&&(h(x),s[x.id]=E)}function u(x){const g=f();x.__bindingPointIndex=g;const M=n.createBuffer(),T=x.__size,E=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,T,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,g,M),M}function f(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const g=r[x.id],M=x.uniforms,T=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,g);for(let E=0,S=M.length;E<S;E++){const b=Array.isArray(M[E])?M[E]:[M[E]];for(let D=0,y=b.length;D<y;D++){const A=b[D];if(p(A,E,D,T)===!0){const j=A.__offset,J=Array.isArray(A.value)?A.value:[A.value];let I=0;for(let X=0;X<J.length;X++){const H=J[X],Q=_(H);typeof H=="number"||typeof H=="boolean"?(A.__data[0]=H,n.bufferSubData(n.UNIFORM_BUFFER,j+I,A.__data)):H.isMatrix3?(A.__data[0]=H.elements[0],A.__data[1]=H.elements[1],A.__data[2]=H.elements[2],A.__data[3]=0,A.__data[4]=H.elements[3],A.__data[5]=H.elements[4],A.__data[6]=H.elements[5],A.__data[7]=0,A.__data[8]=H.elements[6],A.__data[9]=H.elements[7],A.__data[10]=H.elements[8],A.__data[11]=0):(H.toArray(A.__data,I),I+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,j,A.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(x,g,M,T){const E=x.value,S=g+"_"+M;if(T[S]===void 0)return typeof E=="number"||typeof E=="boolean"?T[S]=E:T[S]=E.clone(),!0;{const b=T[S];if(typeof E=="number"||typeof E=="boolean"){if(b!==E)return T[S]=E,!0}else if(b.equals(E)===!1)return b.copy(E),!0}return!1}function v(x){const g=x.uniforms;let M=0;const T=16;for(let S=0,b=g.length;S<b;S++){const D=Array.isArray(g[S])?g[S]:[g[S]];for(let y=0,A=D.length;y<A;y++){const j=D[y],J=Array.isArray(j.value)?j.value:[j.value];for(let I=0,X=J.length;I<X;I++){const H=J[I],Q=_(H),k=M%T;k!==0&&T-k<Q.boundary&&(M+=T-k),j.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),j.__offset=M,M+=Q.storage}}}const E=M%T;return E>0&&(M+=T-E),x.__size=M,x.__cache={},this}function _(x){const g={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(g.boundary=4,g.storage=4):x.isVector2?(g.boundary=8,g.storage=8):x.isVector3||x.isColor?(g.boundary=16,g.storage=12):x.isVector4?(g.boundary=16,g.storage=16):x.isMatrix3?(g.boundary=48,g.storage=48):x.isMatrix4?(g.boundary=64,g.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),g}function m(x){const g=x.target;g.removeEventListener("dispose",m);const M=o.indexOf(g.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(r[g.id]),delete r[g.id],delete s[g.id]}function d(){for(const x in r)n.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}class e_{constructor(e={}){const{canvas:t=eS(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let h;i!==null?h=i.getContextAttributes().alpha:h=o;const p=new Uint32Array(4),v=new Int32Array(4);let _=null,m=null;const d=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hi,this._useLegacyLights=!1,this.toneMapping=Tr,this.toneMappingExposure=1;const g=this;let M=!1,T=0,E=0,S=null,b=-1,D=null;const y=new Bt,A=new Bt;let j=null;const J=new Me(0);let I=0,X=t.width,H=t.height,Q=1,k=null,z=null;const B=new Bt(0,0,X,H),$=new Bt(0,0,X,H);let se=!1;const Ce=new Dd;let G=!1,oe=!1,ue=null;const _e=new ft,we=new le,Ee=new U,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Re(){return S===null?Q:1}let N=i;function W(R,V){for(let Z=0;Z<R.length;Z++){const te=R[Z],K=t.getContext(te,V);if(K!==null)return K}return null}try{const R={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${bd}`),t.addEventListener("webglcontextlost",De,!1),t.addEventListener("webglcontextrestored",F,!1),t.addEventListener("webglcontextcreationerror",me,!1),N===null){const V=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&V.shift(),N=W(V,R),N===null)throw W(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&N instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),N.getShaderPrecisionFormat===void 0&&(N.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let O,ie,ne,ge,pe,Se,ke,P,w,q,ee,ce,re,Ne,Pe,fe,xe,Be,ve,Et,Xe,ze,Le,Ue;function L(){O=new g2(N),ie=new u2(N,O,e),O.init(ie),ze=new tA(N,O,ie),ne=new QT(N,O,ie),ge=new _2(N),pe=new OT,Se=new eA(N,O,ne,pe,ie,ze,ge),ke=new h2(g),P=new m2(g),w=new TS(N,ie),Le=new l2(N,O,w,ie),q=new v2(N,w,ge,Le),ee=new w2(N,q,w,ge),ve=new S2(N,ie,Se),fe=new f2(pe),ce=new zT(g,ke,P,O,ie,Le,fe),re=new cA(g,pe),Ne=new GT,Pe=new YT(O,ie),Be=new a2(g,ke,P,ne,ee,h,l),xe=new JT(g,ee,ie),Ue=new uA(N,ge,ie,ne),Et=new c2(N,O,ge,ie),Xe=new x2(N,O,ge,ie),ge.programs=ce.programs,g.capabilities=ie,g.extensions=O,g.properties=pe,g.renderLists=Ne,g.shadowMap=xe,g.state=ne,g.info=ge}L();const ae=new aA(g,N);this.xr=ae,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const R=O.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=O.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(R){R!==void 0&&(Q=R,this.setSize(X,H,!1))},this.getSize=function(R){return R.set(X,H)},this.setSize=function(R,V,Z=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=R,H=V,t.width=Math.floor(R*Q),t.height=Math.floor(V*Q),Z===!0&&(t.style.width=R+"px",t.style.height=V+"px"),this.setViewport(0,0,R,V)},this.getDrawingBufferSize=function(R){return R.set(X*Q,H*Q).floor()},this.setDrawingBufferSize=function(R,V,Z){X=R,H=V,Q=Z,t.width=Math.floor(R*Z),t.height=Math.floor(V*Z),this.setViewport(0,0,R,V)},this.getCurrentViewport=function(R){return R.copy(y)},this.getViewport=function(R){return R.copy(B)},this.setViewport=function(R,V,Z,te){R.isVector4?B.set(R.x,R.y,R.z,R.w):B.set(R,V,Z,te),ne.viewport(y.copy(B).multiplyScalar(Q).round())},this.getScissor=function(R){return R.copy($)},this.setScissor=function(R,V,Z,te){R.isVector4?$.set(R.x,R.y,R.z,R.w):$.set(R,V,Z,te),ne.scissor(A.copy($).multiplyScalar(Q).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(R){ne.setScissorTest(se=R)},this.setOpaqueSort=function(R){k=R},this.setTransparentSort=function(R){z=R},this.getClearColor=function(R){return R.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(R=!0,V=!0,Z=!0){let te=0;if(R){let K=!1;if(S!==null){const Ae=S.texture.format;K=Ae===Nx||Ae===Dx||Ae===Lx}if(K){const Ae=S.texture.type,Fe=Ae===bi||Ae===Wi||Ae===Rd||Ae===ts||Ae===bx||Ae===Rx,Ge=Be.getClearColor(),He=Be.getClearAlpha(),Qe=Ge.r,We=Ge.g,Ye=Ge.b;Fe?(p[0]=Qe,p[1]=We,p[2]=Ye,p[3]=He,N.clearBufferuiv(N.COLOR,0,p)):(v[0]=Qe,v[1]=We,v[2]=Ye,v[3]=He,N.clearBufferiv(N.COLOR,0,v))}else te|=N.COLOR_BUFFER_BIT}V&&(te|=N.DEPTH_BUFFER_BIT),Z&&(te|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",De,!1),t.removeEventListener("webglcontextrestored",F,!1),t.removeEventListener("webglcontextcreationerror",me,!1),Ne.dispose(),Pe.dispose(),pe.dispose(),ke.dispose(),P.dispose(),ee.dispose(),Le.dispose(),Ue.dispose(),ce.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Dt),ae.removeEventListener("sessionend",rt),ue&&(ue.dispose(),ue=null),yt.stop()};function De(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const R=ge.autoReset,V=xe.enabled,Z=xe.autoUpdate,te=xe.needsUpdate,K=xe.type;L(),ge.autoReset=R,xe.enabled=V,xe.autoUpdate=Z,xe.needsUpdate=te,xe.type=K}function me(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Y(R){const V=R.target;V.removeEventListener("dispose",Y),he(V)}function he(R){Te(R),pe.remove(R)}function Te(R){const V=pe.get(R).programs;V!==void 0&&(V.forEach(function(Z){ce.releaseProgram(Z)}),R.isShaderMaterial&&ce.releaseShaderCache(R))}this.renderBufferDirect=function(R,V,Z,te,K,Ae){V===null&&(V=Oe);const Fe=K.isMesh&&K.matrixWorld.determinant()<0,Ge=E_(R,V,Z,te,K);ne.setMaterial(te,Fe);let He=Z.index,Qe=1;if(te.wireframe===!0){if(He=q.getWireframeAttribute(Z),He===void 0)return;Qe=2}const We=Z.drawRange,Ye=Z.attributes.position;let Ut=We.start*Qe,Dn=(We.start+We.count)*Qe;Ae!==null&&(Ut=Math.max(Ut,Ae.start*Qe),Dn=Math.min(Dn,(Ae.start+Ae.count)*Qe)),He!==null?(Ut=Math.max(Ut,0),Dn=Math.min(Dn,He.count)):Ye!=null&&(Ut=Math.max(Ut,0),Dn=Math.min(Dn,Ye.count));const Xt=Dn-Ut;if(Xt<0||Xt===1/0)return;Le.setup(K,te,Ge,Z,He);let Li,Ct=Et;if(He!==null&&(Li=w.get(He),Ct=Xe,Ct.setIndex(Li)),K.isMesh)te.wireframe===!0?(ne.setLineWidth(te.wireframeLinewidth*Re()),Ct.setMode(N.LINES)):Ct.setMode(N.TRIANGLES);else if(K.isLine){let qe=te.linewidth;qe===void 0&&(qe=1),ne.setLineWidth(qe*Re()),K.isLineSegments?Ct.setMode(N.LINES):K.isLineLoop?Ct.setMode(N.LINE_LOOP):Ct.setMode(N.LINE_STRIP)}else K.isPoints?Ct.setMode(N.POINTS):K.isSprite&&Ct.setMode(N.TRIANGLES);if(K.isBatchedMesh)Ct.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else if(K.isInstancedMesh)Ct.renderInstances(Ut,Xt,K.count);else if(Z.isInstancedBufferGeometry){const qe=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,iu=Math.min(Z.instanceCount,qe);Ct.renderInstances(Ut,Xt,iu)}else Ct.render(Ut,Xt)};function et(R,V,Z){R.transparent===!0&&R.side===mt&&R.forceSinglePass===!1?(R.side=pn,R.needsUpdate=!0,Ga(R,V,Z),R.side=br,R.needsUpdate=!0,Ga(R,V,Z),R.side=mt):Ga(R,V,Z)}this.compile=function(R,V,Z=null){Z===null&&(Z=R),m=Pe.get(Z),m.init(),x.push(m),Z.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(m.pushLight(K),K.castShadow&&m.pushShadow(K))}),R!==Z&&R.traverseVisible(function(K){K.isLight&&K.layers.test(V.layers)&&(m.pushLight(K),K.castShadow&&m.pushShadow(K))}),m.setupLights(g._useLegacyLights);const te=new Set;return R.traverse(function(K){const Ae=K.material;if(Ae)if(Array.isArray(Ae))for(let Fe=0;Fe<Ae.length;Fe++){const Ge=Ae[Fe];et(Ge,Z,K),te.add(Ge)}else et(Ae,Z,K),te.add(Ae)}),x.pop(),m=null,te},this.compileAsync=function(R,V,Z=null){const te=this.compile(R,V,Z);return new Promise(K=>{function Ae(){if(te.forEach(function(Fe){pe.get(Fe).currentProgram.isReady()&&te.delete(Fe)}),te.size===0){K(R);return}setTimeout(Ae,10)}O.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let lt=null;function pt(R){lt&&lt(R)}function Dt(){yt.stop()}function rt(){yt.start()}const yt=new qx;yt.setAnimationLoop(pt),typeof self<"u"&&yt.setContext(self),this.setAnimationLoop=function(R){lt=R,ae.setAnimationLoop(R),R===null?yt.stop():yt.start()},ae.addEventListener("sessionstart",Dt),ae.addEventListener("sessionend",rt),this.render=function(R,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(V),V=ae.getCamera()),R.isScene===!0&&R.onBeforeRender(g,R,V,S),m=Pe.get(R,x.length),m.init(),x.push(m),_e.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Ce.setFromProjectionMatrix(_e),oe=this.localClippingEnabled,G=fe.init(this.clippingPlanes,oe),_=Ne.get(R,d.length),_.init(),d.push(_),on(R,V,0,g.sortObjects),_.finish(),g.sortObjects===!0&&_.sort(k,z),this.info.render.frame++,G===!0&&fe.beginShadows();const Z=m.state.shadowsArray;if(xe.render(Z,R,V),G===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1)&&Be.render(_,R),m.setupLights(g._useLegacyLights),V.isArrayCamera){const te=V.cameras;for(let K=0,Ae=te.length;K<Ae;K++){const Fe=te[K];Ur(_,R,Fe,Fe.viewport)}}else Ur(_,R,V);S!==null&&(Se.updateMultisampleRenderTarget(S),Se.updateRenderTargetMipmap(S)),R.isScene===!0&&R.onAfterRender(g,R,V),Le.resetDefaultState(),b=-1,D=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function on(R,V,Z,te){if(R.visible===!1)return;if(R.layers.test(V.layers)){if(R.isGroup)Z=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(V);else if(R.isLight)m.pushLight(R),R.castShadow&&m.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Ce.intersectsSprite(R)){te&&Ee.setFromMatrixPosition(R.matrixWorld).applyMatrix4(_e);const Fe=ee.update(R),Ge=R.material;Ge.visible&&_.push(R,Fe,Ge,Z,Ee.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Ce.intersectsObject(R))){const Fe=ee.update(R),Ge=R.material;if(te&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ee.copy(R.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Ee.copy(Fe.boundingSphere.center)),Ee.applyMatrix4(R.matrixWorld).applyMatrix4(_e)),Array.isArray(Ge)){const He=Fe.groups;for(let Qe=0,We=He.length;Qe<We;Qe++){const Ye=He[Qe],Ut=Ge[Ye.materialIndex];Ut&&Ut.visible&&_.push(R,Fe,Ut,Z,Ee.z,Ye)}}else Ge.visible&&_.push(R,Fe,Ge,Z,Ee.z,null)}}const Ae=R.children;for(let Fe=0,Ge=Ae.length;Fe<Ge;Fe++)on(Ae[Fe],V,Z,te)}function Ur(R,V,Z,te){const K=R.opaque,Ae=R.transmissive,Fe=R.transparent;m.setupLightsView(Z),G===!0&&fe.setGlobalState(g.clippingPlanes,Z),Ae.length>0&&Oa(K,Ae,V,Z),te&&ne.viewport(y.copy(te)),K.length>0&&Ba(K,V,Z),Ae.length>0&&Ba(Ae,V,Z),Fe.length>0&&Ba(Fe,V,Z),ne.buffers.depth.setTest(!0),ne.buffers.depth.setMask(!0),ne.buffers.color.setMask(!0),ne.setPolygonOffset(!1)}function Oa(R,V,Z,te){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;const Ae=ie.isWebGL2;ue===null&&(ue=new Rr(1,1,{generateMipmaps:!0,type:O.has("EXT_color_buffer_half_float")?Ra:bi,minFilter:mr,samples:Ae?4:0})),g.getDrawingBufferSize(we),Ae?ue.setSize(we.x,we.y):ue.setSize(Ah(we.x),Ah(we.y));const Fe=g.getRenderTarget();g.setRenderTarget(ue),g.getClearColor(J),I=g.getClearAlpha(),I<1&&g.setClearColor(16777215,.5),g.clear();const Ge=g.toneMapping;g.toneMapping=Tr,Ba(R,Z,te),Se.updateMultisampleRenderTarget(ue),Se.updateRenderTargetMipmap(ue);let He=!1;for(let Qe=0,We=V.length;Qe<We;Qe++){const Ye=V[Qe],Ut=Ye.object,Dn=Ye.geometry,Xt=Ye.material,Li=Ye.group;if(Xt.side===mt&&Ut.layers.test(te.layers)){const Ct=Xt.side;Xt.side=pn,Xt.needsUpdate=!0,Wd(Ut,Z,te,Dn,Xt,Li),Xt.side=Ct,Xt.needsUpdate=!0,He=!0}}He===!0&&(Se.updateMultisampleRenderTarget(ue),Se.updateRenderTargetMipmap(ue)),g.setRenderTarget(Fe),g.setClearColor(J,I),g.toneMapping=Ge}function Ba(R,V,Z){const te=V.isScene===!0?V.overrideMaterial:null;for(let K=0,Ae=R.length;K<Ae;K++){const Fe=R[K],Ge=Fe.object,He=Fe.geometry,Qe=te===null?Fe.material:te,We=Fe.group;Ge.layers.test(Z.layers)&&Wd(Ge,V,Z,He,Qe,We)}}function Wd(R,V,Z,te,K,Ae){R.onBeforeRender(g,V,Z,te,K,Ae),R.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),K.onBeforeRender(g,V,Z,te,R,Ae),K.transparent===!0&&K.side===mt&&K.forceSinglePass===!1?(K.side=pn,K.needsUpdate=!0,g.renderBufferDirect(Z,V,te,K,R,Ae),K.side=br,K.needsUpdate=!0,g.renderBufferDirect(Z,V,te,K,R,Ae),K.side=mt):g.renderBufferDirect(Z,V,te,K,R,Ae),R.onAfterRender(g,V,Z,te,K,Ae)}function Ga(R,V,Z){V.isScene!==!0&&(V=Oe);const te=pe.get(R),K=m.state.lights,Ae=m.state.shadowsArray,Fe=K.state.version,Ge=ce.getParameters(R,K.state,Ae,V,Z),He=ce.getProgramCacheKey(Ge);let Qe=te.programs;te.environment=R.isMeshStandardMaterial?V.environment:null,te.fog=V.fog,te.envMap=(R.isMeshStandardMaterial?P:ke).get(R.envMap||te.environment),te.envMapRotation=te.environment!==null&&R.envMap===null?V.environmentRotation:R.envMapRotation,Qe===void 0&&(R.addEventListener("dispose",Y),Qe=new Map,te.programs=Qe);let We=Qe.get(He);if(We!==void 0){if(te.currentProgram===We&&te.lightsStateVersion===Fe)return Xd(R,Ge),We}else Ge.uniforms=ce.getUniforms(R),R.onBuild(Z,Ge,g),R.onBeforeCompile(Ge,g),We=ce.acquireProgram(Ge,He),Qe.set(He,We),te.uniforms=Ge.uniforms;const Ye=te.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ye.clippingPlanes=fe.uniform),Xd(R,Ge),te.needsLights=A_(R),te.lightsStateVersion=Fe,te.needsLights&&(Ye.ambientLightColor.value=K.state.ambient,Ye.lightProbe.value=K.state.probe,Ye.directionalLights.value=K.state.directional,Ye.directionalLightShadows.value=K.state.directionalShadow,Ye.spotLights.value=K.state.spot,Ye.spotLightShadows.value=K.state.spotShadow,Ye.rectAreaLights.value=K.state.rectArea,Ye.ltc_1.value=K.state.rectAreaLTC1,Ye.ltc_2.value=K.state.rectAreaLTC2,Ye.pointLights.value=K.state.point,Ye.pointLightShadows.value=K.state.pointShadow,Ye.hemisphereLights.value=K.state.hemi,Ye.directionalShadowMap.value=K.state.directionalShadowMap,Ye.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Ye.spotShadowMap.value=K.state.spotShadowMap,Ye.spotLightMatrix.value=K.state.spotLightMatrix,Ye.spotLightMap.value=K.state.spotLightMap,Ye.pointShadowMap.value=K.state.pointShadowMap,Ye.pointShadowMatrix.value=K.state.pointShadowMatrix),te.currentProgram=We,te.uniformsList=null,We}function jd(R){if(R.uniformsList===null){const V=R.currentProgram.getUniforms();R.uniformsList=Zl.seqWithValue(V.seq,R.uniforms)}return R.uniformsList}function Xd(R,V){const Z=pe.get(R);Z.outputColorSpace=V.outputColorSpace,Z.batching=V.batching,Z.instancing=V.instancing,Z.instancingColor=V.instancingColor,Z.instancingMorph=V.instancingMorph,Z.skinning=V.skinning,Z.morphTargets=V.morphTargets,Z.morphNormals=V.morphNormals,Z.morphColors=V.morphColors,Z.morphTargetsCount=V.morphTargetsCount,Z.numClippingPlanes=V.numClippingPlanes,Z.numIntersection=V.numClipIntersection,Z.vertexAlphas=V.vertexAlphas,Z.vertexTangents=V.vertexTangents,Z.toneMapping=V.toneMapping}function E_(R,V,Z,te,K){V.isScene!==!0&&(V=Oe),Se.resetTextureUnits();const Ae=V.fog,Fe=te.isMeshStandardMaterial?V.environment:null,Ge=S===null?g.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Ir,He=(te.isMeshStandardMaterial?P:ke).get(te.envMap||Fe),Qe=te.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,We=!!Z.attributes.tangent&&(!!te.normalMap||te.anisotropy>0),Ye=!!Z.morphAttributes.position,Ut=!!Z.morphAttributes.normal,Dn=!!Z.morphAttributes.color;let Xt=Tr;te.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Xt=g.toneMapping);const Li=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ct=Li!==void 0?Li.length:0,qe=pe.get(te),iu=m.state.lights;if(G===!0&&(oe===!0||R!==D)){const qn=R===D&&te.id===b;fe.setState(te,R,qn)}let Tt=!1;te.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==iu.state.version||qe.outputColorSpace!==Ge||K.isBatchedMesh&&qe.batching===!1||!K.isBatchedMesh&&qe.batching===!0||K.isInstancedMesh&&qe.instancing===!1||!K.isInstancedMesh&&qe.instancing===!0||K.isSkinnedMesh&&qe.skinning===!1||!K.isSkinnedMesh&&qe.skinning===!0||K.isInstancedMesh&&qe.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&qe.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&qe.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&qe.instancingMorph===!1&&K.morphTexture!==null||qe.envMap!==He||te.fog===!0&&qe.fog!==Ae||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==fe.numPlanes||qe.numIntersection!==fe.numIntersection)||qe.vertexAlphas!==Qe||qe.vertexTangents!==We||qe.morphTargets!==Ye||qe.morphNormals!==Ut||qe.morphColors!==Dn||qe.toneMapping!==Xt||ie.isWebGL2===!0&&qe.morphTargetsCount!==Ct)&&(Tt=!0):(Tt=!0,qe.__version=te.version);let Fr=qe.currentProgram;Tt===!0&&(Fr=Ga(te,V,K));let Yd=!1,bo=!1,ru=!1;const an=Fr.getUniforms(),kr=qe.uniforms;if(ne.useProgram(Fr.program)&&(Yd=!0,bo=!0,ru=!0),te.id!==b&&(b=te.id,bo=!0),Yd||D!==R){an.setValue(N,"projectionMatrix",R.projectionMatrix),an.setValue(N,"viewMatrix",R.matrixWorldInverse);const qn=an.map.cameraPosition;qn!==void 0&&qn.setValue(N,Ee.setFromMatrixPosition(R.matrixWorld)),ie.logarithmicDepthBuffer&&an.setValue(N,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(te.isMeshPhongMaterial||te.isMeshToonMaterial||te.isMeshLambertMaterial||te.isMeshBasicMaterial||te.isMeshStandardMaterial||te.isShaderMaterial)&&an.setValue(N,"isOrthographic",R.isOrthographicCamera===!0),D!==R&&(D=R,bo=!0,ru=!0)}if(K.isSkinnedMesh){an.setOptional(N,K,"bindMatrix"),an.setOptional(N,K,"bindMatrixInverse");const qn=K.skeleton;qn&&(ie.floatVertexTextures?(qn.boneTexture===null&&qn.computeBoneTexture(),an.setValue(N,"boneTexture",qn.boneTexture,Se)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}K.isBatchedMesh&&(an.setOptional(N,K,"batchingTexture"),an.setValue(N,"batchingTexture",K._matricesTexture,Se));const su=Z.morphAttributes;if((su.position!==void 0||su.normal!==void 0||su.color!==void 0&&ie.isWebGL2===!0)&&ve.update(K,Z,Fr),(bo||qe.receiveShadow!==K.receiveShadow)&&(qe.receiveShadow=K.receiveShadow,an.setValue(N,"receiveShadow",K.receiveShadow)),te.isMeshGouraudMaterial&&te.envMap!==null&&(kr.envMap.value=He,kr.flipEnvMap.value=He.isCubeTexture&&He.isRenderTargetTexture===!1?-1:1),bo&&(an.setValue(N,"toneMappingExposure",g.toneMappingExposure),qe.needsLights&&T_(kr,ru),Ae&&te.fog===!0&&re.refreshFogUniforms(kr,Ae),re.refreshMaterialUniforms(kr,te,Q,H,ue),Zl.upload(N,jd(qe),kr,Se)),te.isShaderMaterial&&te.uniformsNeedUpdate===!0&&(Zl.upload(N,jd(qe),kr,Se),te.uniformsNeedUpdate=!1),te.isSpriteMaterial&&an.setValue(N,"center",K.center),an.setValue(N,"modelViewMatrix",K.modelViewMatrix),an.setValue(N,"normalMatrix",K.normalMatrix),an.setValue(N,"modelMatrix",K.matrixWorld),te.isShaderMaterial||te.isRawShaderMaterial){const qn=te.uniformsGroups;for(let ou=0,C_=qn.length;ou<C_;ou++)if(ie.isWebGL2){const qd=qn[ou];Ue.update(qd,Fr),Ue.bind(qd,Fr)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Fr}function T_(R,V){R.ambientLightColor.needsUpdate=V,R.lightProbe.needsUpdate=V,R.directionalLights.needsUpdate=V,R.directionalLightShadows.needsUpdate=V,R.pointLights.needsUpdate=V,R.pointLightShadows.needsUpdate=V,R.spotLights.needsUpdate=V,R.spotLightShadows.needsUpdate=V,R.rectAreaLights.needsUpdate=V,R.hemisphereLights.needsUpdate=V}function A_(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(R,V,Z){pe.get(R.texture).__webglTexture=V,pe.get(R.depthTexture).__webglTexture=Z;const te=pe.get(R);te.__hasExternalTextures=!0,te.__autoAllocateDepthBuffer=Z===void 0,te.__autoAllocateDepthBuffer||O.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),te.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,V){const Z=pe.get(R);Z.__webglFramebuffer=V,Z.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(R,V=0,Z=0){S=R,T=V,E=Z;let te=!0,K=null,Ae=!1,Fe=!1;if(R){const He=pe.get(R);He.__useDefaultFramebuffer!==void 0?(ne.bindFramebuffer(N.FRAMEBUFFER,null),te=!1):He.__webglFramebuffer===void 0?Se.setupRenderTarget(R):He.__hasExternalTextures&&Se.rebindTextures(R,pe.get(R.texture).__webglTexture,pe.get(R.depthTexture).__webglTexture);const Qe=R.texture;(Qe.isData3DTexture||Qe.isDataArrayTexture||Qe.isCompressedArrayTexture)&&(Fe=!0);const We=pe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(We[V])?K=We[V][Z]:K=We[V],Ae=!0):ie.isWebGL2&&R.samples>0&&Se.useMultisampledRTT(R)===!1?K=pe.get(R).__webglMultisampledFramebuffer:Array.isArray(We)?K=We[Z]:K=We,y.copy(R.viewport),A.copy(R.scissor),j=R.scissorTest}else y.copy(B).multiplyScalar(Q).floor(),A.copy($).multiplyScalar(Q).floor(),j=se;if(ne.bindFramebuffer(N.FRAMEBUFFER,K)&&ie.drawBuffers&&te&&ne.drawBuffers(R,K),ne.viewport(y),ne.scissor(A),ne.setScissorTest(j),Ae){const He=pe.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+V,He.__webglTexture,Z)}else if(Fe){const He=pe.get(R.texture),Qe=V||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,He.__webglTexture,Z||0,Qe)}b=-1},this.readRenderTargetPixels=function(R,V,Z,te,K,Ae,Fe){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ge=pe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ge=Ge[Fe]),Ge){ne.bindFramebuffer(N.FRAMEBUFFER,Ge);try{const He=R.texture,Qe=He.format,We=He.type;if(Qe!==kn&&ze.convert(Qe)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ye=We===Ra&&(O.has("EXT_color_buffer_half_float")||ie.isWebGL2&&O.has("EXT_color_buffer_float"));if(We!==bi&&ze.convert(We)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_TYPE)&&!(We===wi&&(ie.isWebGL2||O.has("OES_texture_float")||O.has("WEBGL_color_buffer_float")))&&!Ye){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=R.width-te&&Z>=0&&Z<=R.height-K&&N.readPixels(V,Z,te,K,ze.convert(Qe),ze.convert(We),Ae)}finally{const He=S!==null?pe.get(S).__webglFramebuffer:null;ne.bindFramebuffer(N.FRAMEBUFFER,He)}}},this.copyFramebufferToTexture=function(R,V,Z=0){const te=Math.pow(2,-Z),K=Math.floor(V.image.width*te),Ae=Math.floor(V.image.height*te);Se.setTexture2D(V,0),N.copyTexSubImage2D(N.TEXTURE_2D,Z,0,0,R.x,R.y,K,Ae),ne.unbindTexture()},this.copyTextureToTexture=function(R,V,Z,te=0){const K=V.image.width,Ae=V.image.height,Fe=ze.convert(Z.format),Ge=ze.convert(Z.type);Se.setTexture2D(Z,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,Z.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,Z.unpackAlignment),V.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,te,R.x,R.y,K,Ae,Fe,Ge,V.image.data):V.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,te,R.x,R.y,V.mipmaps[0].width,V.mipmaps[0].height,Fe,V.mipmaps[0].data):N.texSubImage2D(N.TEXTURE_2D,te,R.x,R.y,Fe,Ge,V.image),te===0&&Z.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),ne.unbindTexture()},this.copyTextureToTexture3D=function(R,V,Z,te,K=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ae=Math.round(R.max.x-R.min.x),Fe=Math.round(R.max.y-R.min.y),Ge=R.max.z-R.min.z+1,He=ze.convert(te.format),Qe=ze.convert(te.type);let We;if(te.isData3DTexture)Se.setTexture3D(te,0),We=N.TEXTURE_3D;else if(te.isDataArrayTexture||te.isCompressedArrayTexture)Se.setTexture2DArray(te,0),We=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,te.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,te.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,te.unpackAlignment);const Ye=N.getParameter(N.UNPACK_ROW_LENGTH),Ut=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Dn=N.getParameter(N.UNPACK_SKIP_PIXELS),Xt=N.getParameter(N.UNPACK_SKIP_ROWS),Li=N.getParameter(N.UNPACK_SKIP_IMAGES),Ct=Z.isCompressedTexture?Z.mipmaps[K]:Z.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,Ct.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ct.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,R.min.x),N.pixelStorei(N.UNPACK_SKIP_ROWS,R.min.y),N.pixelStorei(N.UNPACK_SKIP_IMAGES,R.min.z),Z.isDataTexture||Z.isData3DTexture?N.texSubImage3D(We,K,V.x,V.y,V.z,Ae,Fe,Ge,He,Qe,Ct.data):te.isCompressedArrayTexture?N.compressedTexSubImage3D(We,K,V.x,V.y,V.z,Ae,Fe,Ge,He,Ct.data):N.texSubImage3D(We,K,V.x,V.y,V.z,Ae,Fe,Ge,He,Qe,Ct),N.pixelStorei(N.UNPACK_ROW_LENGTH,Ye),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ut),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Dn),N.pixelStorei(N.UNPACK_SKIP_ROWS,Xt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Li),K===0&&te.generateMipmaps&&N.generateMipmap(We),ne.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?Se.setTextureCube(R,0):R.isData3DTexture?Se.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Se.setTexture2DArray(R,0):Se.setTexture2D(R,0),ne.unbindTexture()},this.resetState=function(){T=0,E=0,S=null,ne.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Pd?"display-p3":"srgb",t.unpackColorSpace=dt.workingColorSpace===Jc?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class fA extends e_{}fA.prototype.isWebGL1Renderer=!0;class Fd{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Me(e),this.density=t}clone(){return new Fd(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class t_ extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ri,this.environmentRotation=new Ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class hA{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=wh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Yi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return zx("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const vn=new U;class Pc{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)vn.fromBufferAttribute(this,t),vn.applyMatrix4(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)vn.fromBufferAttribute(this,t),vn.applyNormalMatrix(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)vn.fromBufferAttribute(this,t),vn.transformDirection(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Ei(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ht(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ei(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ei(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ei(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ei(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array),s=ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Hn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Pc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Jl extends ps{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ds;const Vo=new U,Ns=new U,Is=new U,Us=new le,Ho=new le,n_=new ft,Al=new U,Wo=new U,Cl=new U,T0=new le,hf=new le,A0=new le;class df extends Ht{constructor(e=new Jl){if(super(),this.isSprite=!0,this.type="Sprite",Ds===void 0){Ds=new kt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new hA(t,5);Ds.setIndex([0,1,2,0,2,3]),Ds.setAttribute("position",new Pc(i,3,0,!1)),Ds.setAttribute("uv",new Pc(i,2,3,!1))}this.geometry=Ds,this.material=e,this.center=new le(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ns.setFromMatrixScale(this.matrixWorld),n_.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Is.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ns.multiplyScalar(-Is.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const o=this.center;bl(Al.set(-.5,-.5,0),Is,o,Ns,r,s),bl(Wo.set(.5,-.5,0),Is,o,Ns,r,s),bl(Cl.set(.5,.5,0),Is,o,Ns,r,s),T0.set(0,0),hf.set(1,0),A0.set(1,1);let a=e.ray.intersectTriangle(Al,Wo,Cl,!1,Vo);if(a===null&&(bl(Wo.set(-.5,.5,0),Is,o,Ns,r,s),hf.set(0,1),a=e.ray.intersectTriangle(Al,Cl,Wo,!1,Vo),a===null))return;const l=e.ray.origin.distanceTo(Vo);l<e.near||l>e.far||t.push({distance:l,point:Vo.clone(),uv:pi.getInterpolation(Vo,Al,Wo,Cl,T0,hf,A0,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function bl(n,e,t,i,r,s){Us.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(Ho.x=s*Us.x-r*Us.y,Ho.y=r*Us.x+s*Us.y):Ho.copy(Us),n.copy(e),n.x+=Ho.x,n.y+=Ho.y,n.applyMatrix4(n_)}class i_ extends mn{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Jt,u=Jt,f,h){super(null,o,a,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class C0 extends Hn{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Fs=new ft,b0=new ft,Rl=[],R0=new ds,dA=new ft,jo=new Ie,Xo=new To;class dn extends Ie{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new C0(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,dA)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ds),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),R0.copy(e.boundingBox).applyMatrix4(Fs),this.boundingBox.union(R0)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new To),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),Xo.copy(e.boundingSphere).applyMatrix4(Fs),this.boundingSphere.union(Xo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(jo.geometry=this.geometry,jo.material=this.material,jo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xo.copy(this.boundingSphere),Xo.applyMatrix4(i),e.ray.intersectsSphere(Xo)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Fs),b0.multiplyMatrices(i,Fs),jo.matrixWorld=b0,jo.raycast(e,Rl);for(let o=0,a=Rl.length;o<a;o++){const l=Rl[o];l.instanceId=s,l.object=this,t.push(l)}Rl.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new C0(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new i_(new Float32Array(r*this.count),r,this.count,Px,wi));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Lc extends ps{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const P0=new U,L0=new U,D0=new ft,pf=new Qc,Pl=new To;class Ll extends Ht{constructor(e=new kt,t=new Lc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)P0.fromBufferAttribute(t,r-1),L0.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=P0.distanceTo(L0);e.setAttribute("lineDistance",new ot(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Pl.copy(i.boundingSphere),Pl.applyMatrix4(r),Pl.radius+=s,e.ray.intersectsSphere(Pl)===!1)return;D0.copy(r).invert(),pf.copy(e.ray).applyMatrix4(D0);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new U,u=new U,f=new U,h=new U,p=this.isLineSegments?2:1,v=i.index,m=i.attributes.position;if(v!==null){const d=Math.max(0,o.start),x=Math.min(v.count,o.start+o.count);for(let g=d,M=x-1;g<M;g+=p){const T=v.getX(g),E=v.getX(g+1);if(c.fromBufferAttribute(m,T),u.fromBufferAttribute(m,E),pf.distanceSqToSegment(c,u,h,f)>l)continue;h.applyMatrix4(this.matrixWorld);const b=e.ray.origin.distanceTo(h);b<e.near||b>e.far||t.push({distance:b,point:f.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,o.start),x=Math.min(m.count,o.start+o.count);for(let g=d,M=x-1;g<M;g+=p){if(c.fromBufferAttribute(m,g),u.fromBufferAttribute(m,g+1),pf.distanceSqToSegment(c,u,h,f)>l)continue;h.applyMatrix4(this.matrixWorld);const E=e.ray.origin.distanceTo(h);E<e.near||E>e.far||t.push({distance:E,point:f.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}class mf extends mn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Pi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const u=i[r],h=i[r+1]-u,p=(o-u)/h;return(r+p)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new le:new U);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new U,r=[],s=[],o=[],a=new U,l=new ft;for(let p=0;p<=e;p++){const v=p/e;r[p]=this.getTangentAt(v,new U)}s[0]=new U,o[0]=new U;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),h<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(r[p-1],r[p]),a.length()>Number.EPSILON){a.normalize();const v=Math.acos(Qt(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(a,v))}o[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos(Qt(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(p=-p);for(let v=1;v<=e;v++)s[v].applyMatrix4(l.makeRotationAxis(r[v],p*v)),o[v].crossVectors(r[v],s[v])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class kd extends Pi{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new le){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,p=c-this.aY;l=h*u-p*f+this.aX,c=h*f+p*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class pA extends kd{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function zd(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,f){let h=(o-s)/c-(a-s)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+f)+(l-a)/f;h*=u,p*=u,r(o,a,h,p)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const Dl=new U,gf=new zd,vf=new zd,xf=new zd;class mA extends Pi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new U){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(Dl.subVectors(r[0],r[1]).add(r[0]),c=Dl);const f=r[a%s],h=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Dl.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Dl),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let v=Math.pow(c.distanceToSquared(f),p),_=Math.pow(f.distanceToSquared(h),p),m=Math.pow(h.distanceToSquared(u),p);_<1e-4&&(_=1),v<1e-4&&(v=_),m<1e-4&&(m=_),gf.initNonuniformCatmullRom(c.x,f.x,h.x,u.x,v,_,m),vf.initNonuniformCatmullRom(c.y,f.y,h.y,u.y,v,_,m),xf.initNonuniformCatmullRom(c.z,f.z,h.z,u.z,v,_,m)}else this.curveType==="catmullrom"&&(gf.initCatmullRom(c.x,f.x,h.x,u.x,this.tension),vf.initCatmullRom(c.y,f.y,h.y,u.y,this.tension),xf.initCatmullRom(c.z,f.z,h.z,u.z,this.tension));return i.set(gf.calc(l),vf.calc(l),xf.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new U().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function N0(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function gA(n,e){const t=1-n;return t*t*e}function vA(n,e){return 2*(1-n)*n*e}function xA(n,e){return n*n*e}function la(n,e,t,i){return gA(n,e)+vA(n,t)+xA(n,i)}function _A(n,e){const t=1-n;return t*t*t*e}function yA(n,e){const t=1-n;return 3*t*t*n*e}function MA(n,e){return 3*(1-n)*n*n*e}function SA(n,e){return n*n*n*e}function ca(n,e,t,i,r){return _A(n,e)+yA(n,t)+MA(n,i)+SA(n,r)}class r_ extends Pi{constructor(e=new le,t=new le,i=new le,r=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new le){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(ca(e,r.x,s.x,o.x,a.x),ca(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class wA extends Pi{constructor(e=new U,t=new U,i=new U,r=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new U){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(ca(e,r.x,s.x,o.x,a.x),ca(e,r.y,s.y,o.y,a.y),ca(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class s_ extends Pi{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class EA extends Pi{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class o_ extends Pi{constructor(e=new le,t=new le,i=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new le){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(la(e,r.x,s.x,o.x),la(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class TA extends Pi{constructor(e=new U,t=new U,i=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new U){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(la(e,r.x,s.x,o.x),la(e,r.y,s.y,o.y),la(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class a_ extends Pi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],f=r[o>r.length-3?r.length-1:o+2];return i.set(N0(a,l.x,c.x,u.x,f.x),N0(a,l.y,c.y,u.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new le().fromArray(r))}return this}}var bh=Object.freeze({__proto__:null,ArcCurve:pA,CatmullRomCurve3:mA,CubicBezierCurve:r_,CubicBezierCurve3:wA,EllipseCurve:kd,LineCurve:s_,LineCurve3:EA,QuadraticBezierCurve:o_,QuadraticBezierCurve3:TA,SplineCurve:a_});class AA extends Pi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bh[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new bh[r.type]().fromJSON(r))}return this}}class I0 extends AA{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new s_(this.currentPoint.clone(),new le(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new o_(this.currentPoint.clone(),new le(e,t),new le(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new r_(this.currentPoint.clone(),new le(e,t),new le(i,r),new le(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new a_(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){const c=new kd(e,t,i,r,s,o,a,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ao extends kt{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],o=[],a=[],l=[],c=new U,u=new le;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let f=0,h=3;f<=t;f++,h+=3){const p=i+f/t*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[h]/e+1)/2,u.y=(o[h+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new ot(o,3)),this.setAttribute("normal",new ot(a,3)),this.setAttribute("uv",new ot(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ao(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class tn extends kt{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],h=[],p=[];let v=0;const _=[],m=i/2;let d=0;x(),o===!1&&(e>0&&g(!0),t>0&&g(!1)),this.setIndex(u),this.setAttribute("position",new ot(f,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(p,2));function x(){const M=new U,T=new U;let E=0;const S=(t-e)/i;for(let b=0;b<=s;b++){const D=[],y=b/s,A=y*(t-e)+e;for(let j=0;j<=r;j++){const J=j/r,I=J*l+a,X=Math.sin(I),H=Math.cos(I);T.x=A*X,T.y=-y*i+m,T.z=A*H,f.push(T.x,T.y,T.z),M.set(X,S,H).normalize(),h.push(M.x,M.y,M.z),p.push(J,1-y),D.push(v++)}_.push(D)}for(let b=0;b<r;b++)for(let D=0;D<s;D++){const y=_[D][b],A=_[D+1][b],j=_[D+1][b+1],J=_[D][b+1];u.push(y,A,J),u.push(A,j,J),E+=6}c.addGroup(d,E,0),d+=E}function g(M){const T=v,E=new le,S=new U;let b=0;const D=M===!0?e:t,y=M===!0?1:-1;for(let j=1;j<=r;j++)f.push(0,m*y,0),h.push(0,y,0),p.push(.5,.5),v++;const A=v;for(let j=0;j<=r;j++){const I=j/r*l+a,X=Math.cos(I),H=Math.sin(I);S.x=D*H,S.y=m*y,S.z=D*X,f.push(S.x,S.y,S.z),h.push(0,y,0),E.x=X*.5+.5,E.y=H*.5*y+.5,p.push(E.x,E.y),v++}for(let j=0;j<r;j++){const J=T+j,I=A+j;M===!0?u.push(I,I+1,J):u.push(I+1,I,J),b+=3}c.addGroup(d,b,M===!0?1:2),d+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class is extends tn{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new is(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Od extends kt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new ot(s,3)),this.setAttribute("normal",new ot(s.slice(),3)),this.setAttribute("uv",new ot(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const g=new U,M=new U,T=new U;for(let E=0;E<t.length;E+=3)p(t[E+0],g),p(t[E+1],M),p(t[E+2],T),l(g,M,T,x)}function l(x,g,M,T){const E=T+1,S=[];for(let b=0;b<=E;b++){S[b]=[];const D=x.clone().lerp(M,b/E),y=g.clone().lerp(M,b/E),A=E-b;for(let j=0;j<=A;j++)j===0&&b===E?S[b][j]=D:S[b][j]=D.clone().lerp(y,j/A)}for(let b=0;b<E;b++)for(let D=0;D<2*(E-b)-1;D++){const y=Math.floor(D/2);D%2===0?(h(S[b][y+1]),h(S[b+1][y]),h(S[b][y])):(h(S[b][y+1]),h(S[b+1][y+1]),h(S[b+1][y]))}}function c(x){const g=new U;for(let M=0;M<s.length;M+=3)g.x=s[M+0],g.y=s[M+1],g.z=s[M+2],g.normalize().multiplyScalar(x),s[M+0]=g.x,s[M+1]=g.y,s[M+2]=g.z}function u(){const x=new U;for(let g=0;g<s.length;g+=3){x.x=s[g+0],x.y=s[g+1],x.z=s[g+2];const M=m(x)/2/Math.PI+.5,T=d(x)/Math.PI+.5;o.push(M,1-T)}v(),f()}function f(){for(let x=0;x<o.length;x+=6){const g=o[x+0],M=o[x+2],T=o[x+4],E=Math.max(g,M,T),S=Math.min(g,M,T);E>.9&&S<.1&&(g<.2&&(o[x+0]+=1),M<.2&&(o[x+2]+=1),T<.2&&(o[x+4]+=1))}}function h(x){s.push(x.x,x.y,x.z)}function p(x,g){const M=x*3;g.x=e[M+0],g.y=e[M+1],g.z=e[M+2]}function v(){const x=new U,g=new U,M=new U,T=new U,E=new le,S=new le,b=new le;for(let D=0,y=0;D<s.length;D+=9,y+=6){x.set(s[D+0],s[D+1],s[D+2]),g.set(s[D+3],s[D+4],s[D+5]),M.set(s[D+6],s[D+7],s[D+8]),E.set(o[y+0],o[y+1]),S.set(o[y+2],o[y+3]),b.set(o[y+4],o[y+5]),T.copy(x).add(g).add(M).divideScalar(3);const A=m(T);_(E,y+0,x,A),_(S,y+2,g,A),_(b,y+4,M,A)}}function _(x,g,M,T){T<0&&x.x===1&&(o[g]=x.x-1),M.x===0&&M.z===0&&(o[g]=T/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Od(e.vertices,e.indices,e.radius,e.details)}}class Bd extends Od{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Bd(e.radius,e.detail)}}class l_ extends I0{constructor(e){super(e),this.uuid=Yi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new I0().fromJSON(r))}return this}}const CA={triangulate:function(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=c_(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,u,f,h,p;if(i&&(s=DA(n,e,s,t)),n.length>80*t){a=c=n[0],l=u=n[1];for(let v=t;v<r;v+=t)f=n[v],h=n[v+1],f<a&&(a=f),h<l&&(l=h),f>c&&(c=f),h>u&&(u=h);p=Math.max(c-a,u-l),p=p!==0?32767/p:0}return Pa(s,o,t,a,l,p,0),o}};function c_(n,e,t,i,r){let s,o;if(r===HA(n,e,t,i)>0)for(s=e;s<t;s+=i)o=U0(s,n[s],n[s+1],o);else for(s=t-i;s>=e;s-=i)o=U0(s,n[s],n[s+1],o);return o&&tu(o,o.next)&&(Da(o),o=o.next),o}function cs(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(tu(t,t.next)||Rt(t.prev,t,t.next)===0)){if(Da(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Pa(n,e,t,i,r,s,o){if(!n)return;!o&&s&&kA(n,i,r,s);let a=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?RA(n,i,r,s):bA(n)){e.push(l.i/t|0),e.push(n.i/t|0),e.push(c.i/t|0),Da(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=PA(cs(n),e,t),Pa(n,e,t,i,r,s,2)):o===2&&LA(n,e,t,i,r,s):Pa(cs(n),e,t,i,r,s,1);break}}}function bA(n){const e=n.prev,t=n,i=n.next;if(Rt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,u=r<s?r<o?r:o:s<o?s:o,f=a<l?a<c?a:c:l<c?l:c,h=r>s?r>o?r:o:s>o?s:o,p=a>l?a>c?a:c:l>c?l:c;let v=i.next;for(;v!==e;){if(v.x>=u&&v.x<=h&&v.y>=f&&v.y<=p&&Js(r,a,s,l,o,c,v.x,v.y)&&Rt(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function RA(n,e,t,i){const r=n.prev,s=n,o=n.next;if(Rt(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,f=s.y,h=o.y,p=a<l?a<c?a:c:l<c?l:c,v=u<f?u<h?u:h:f<h?f:h,_=a>l?a>c?a:c:l>c?l:c,m=u>f?u>h?u:h:f>h?f:h,d=Rh(p,v,e,t,i),x=Rh(_,m,e,t,i);let g=n.prevZ,M=n.nextZ;for(;g&&g.z>=d&&M&&M.z<=x;){if(g.x>=p&&g.x<=_&&g.y>=v&&g.y<=m&&g!==r&&g!==o&&Js(a,u,l,f,c,h,g.x,g.y)&&Rt(g.prev,g,g.next)>=0||(g=g.prevZ,M.x>=p&&M.x<=_&&M.y>=v&&M.y<=m&&M!==r&&M!==o&&Js(a,u,l,f,c,h,M.x,M.y)&&Rt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;g&&g.z>=d;){if(g.x>=p&&g.x<=_&&g.y>=v&&g.y<=m&&g!==r&&g!==o&&Js(a,u,l,f,c,h,g.x,g.y)&&Rt(g.prev,g,g.next)>=0)return!1;g=g.prevZ}for(;M&&M.z<=x;){if(M.x>=p&&M.x<=_&&M.y>=v&&M.y<=m&&M!==r&&M!==o&&Js(a,u,l,f,c,h,M.x,M.y)&&Rt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function PA(n,e,t){let i=n;do{const r=i.prev,s=i.next.next;!tu(r,s)&&u_(r,i,i.next,s)&&La(r,s)&&La(s,r)&&(e.push(r.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),Da(i),Da(i.next),i=n=s),i=i.next}while(i!==n);return cs(i)}function LA(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&BA(o,a)){let l=f_(o,a);o=cs(o,o.next),l=cs(l,l.next),Pa(o,e,t,i,r,s,0),Pa(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function DA(n,e,t,i){const r=[];let s,o,a,l,c;for(s=0,o=e.length;s<o;s++)a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=c_(n,a,l,i,!1),c===c.next&&(c.steiner=!0),r.push(OA(c));for(r.sort(NA),s=0;s<r.length;s++)t=IA(r[s],t);return t}function NA(n,e){return n.x-e.x}function IA(n,e){const t=UA(n,e);if(!t)return e;const i=f_(t,n);return cs(i,i.next),cs(t,t.next)}function UA(n,e){let t=e,i=-1/0,r;const s=n.x,o=n.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const h=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=s&&h>i&&(i=h,r=t.x<t.next.x?t:t.next,h===s))return r}t=t.next}while(t!==e);if(!r)return null;const a=r,l=r.x,c=r.y;let u=1/0,f;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&Js(o<c?s:i,o,l,c,o<c?i:s,o,t.x,t.y)&&(f=Math.abs(o-t.y)/(s-t.x),La(t,n)&&(f<u||f===u&&(t.x>r.x||t.x===r.x&&FA(r,t)))&&(r=t,u=f)),t=t.next;while(t!==a);return r}function FA(n,e){return Rt(n.prev,n,e.prev)<0&&Rt(e.next,n,n.next)<0}function kA(n,e,t,i){let r=n;do r.z===0&&(r.z=Rh(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,zA(r)}function zA(n){let e,t,i,r,s,o,a,l,c=1;do{for(t=n,n=null,s=null,o=0;t;){for(o++,i=t,a=0,e=0;e<c&&(a++,i=i.nextZ,!!i);e++);for(l=c;a>0||l>0&&i;)a!==0&&(l===0||!i||t.z<=i.z)?(r=t,t=t.nextZ,a--):(r=i,i=i.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;t=i}s.nextZ=null,c*=2}while(o>1);return n}function Rh(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function OA(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Js(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function BA(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!GA(n,e)&&(La(n,e)&&La(e,n)&&VA(n,e)&&(Rt(n.prev,n,e.prev)||Rt(n,e.prev,e))||tu(n,e)&&Rt(n.prev,n,n.next)>0&&Rt(e.prev,e,e.next)>0)}function Rt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function tu(n,e){return n.x===e.x&&n.y===e.y}function u_(n,e,t,i){const r=Il(Rt(n,e,t)),s=Il(Rt(n,e,i)),o=Il(Rt(t,i,n)),a=Il(Rt(t,i,e));return!!(r!==s&&o!==a||r===0&&Nl(n,t,e)||s===0&&Nl(n,i,e)||o===0&&Nl(t,n,i)||a===0&&Nl(t,e,i))}function Nl(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Il(n){return n>0?1:n<0?-1:0}function GA(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&u_(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function La(n,e){return Rt(n.prev,n,n.next)<0?Rt(n,e,n.next)>=0&&Rt(n,n.prev,e)>=0:Rt(n,e,n.prev)<0||Rt(n,n.next,e)<0}function VA(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function f_(n,e){const t=new Ph(n.i,n.x,n.y),i=new Ph(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function U0(n,e,t,i){const r=new Ph(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Da(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ph(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function HA(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class ua{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return ua.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];F0(e),k0(i,e);let o=e.length;t.forEach(F0);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,k0(i,t[l]);const a=CA.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function F0(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function k0(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Gd extends kt{constructor(e=new l_([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new ot(r,3)),this.setAttribute("uv",new ot(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,v=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const d=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:WA;let g,M=!1,T,E,S,b;d&&(g=d.getSpacedPoints(u),M=!0,h=!1,T=d.computeFrenetFrames(u,!1),E=new U,S=new U,b=new U),h||(m=0,p=0,v=0,_=0);const D=a.extractPoints(c);let y=D.shape;const A=D.holes;if(!ua.isClockWise(y)){y=y.reverse();for(let N=0,W=A.length;N<W;N++){const O=A[N];ua.isClockWise(O)&&(A[N]=O.reverse())}}const J=ua.triangulateShape(y,A),I=y;for(let N=0,W=A.length;N<W;N++){const O=A[N];y=y.concat(O)}function X(N,W,O){return W||console.error("THREE.ExtrudeGeometry: vec does not exist"),N.clone().addScaledVector(W,O)}const H=y.length,Q=J.length;function k(N,W,O){let ie,ne,ge;const pe=N.x-W.x,Se=N.y-W.y,ke=O.x-N.x,P=O.y-N.y,w=pe*pe+Se*Se,q=pe*P-Se*ke;if(Math.abs(q)>Number.EPSILON){const ee=Math.sqrt(w),ce=Math.sqrt(ke*ke+P*P),re=W.x-Se/ee,Ne=W.y+pe/ee,Pe=O.x-P/ce,fe=O.y+ke/ce,xe=((Pe-re)*P-(fe-Ne)*ke)/(pe*P-Se*ke);ie=re+pe*xe-N.x,ne=Ne+Se*xe-N.y;const Be=ie*ie+ne*ne;if(Be<=2)return new le(ie,ne);ge=Math.sqrt(Be/2)}else{let ee=!1;pe>Number.EPSILON?ke>Number.EPSILON&&(ee=!0):pe<-Number.EPSILON?ke<-Number.EPSILON&&(ee=!0):Math.sign(Se)===Math.sign(P)&&(ee=!0),ee?(ie=-Se,ne=pe,ge=Math.sqrt(w)):(ie=pe,ne=Se,ge=Math.sqrt(w/2))}return new le(ie/ge,ne/ge)}const z=[];for(let N=0,W=I.length,O=W-1,ie=N+1;N<W;N++,O++,ie++)O===W&&(O=0),ie===W&&(ie=0),z[N]=k(I[N],I[O],I[ie]);const B=[];let $,se=z.concat();for(let N=0,W=A.length;N<W;N++){const O=A[N];$=[];for(let ie=0,ne=O.length,ge=ne-1,pe=ie+1;ie<ne;ie++,ge++,pe++)ge===ne&&(ge=0),pe===ne&&(pe=0),$[ie]=k(O[ie],O[ge],O[pe]);B.push($),se=se.concat($)}for(let N=0;N<m;N++){const W=N/m,O=p*Math.cos(W*Math.PI/2),ie=v*Math.sin(W*Math.PI/2)+_;for(let ne=0,ge=I.length;ne<ge;ne++){const pe=X(I[ne],z[ne],ie);_e(pe.x,pe.y,-O)}for(let ne=0,ge=A.length;ne<ge;ne++){const pe=A[ne];$=B[ne];for(let Se=0,ke=pe.length;Se<ke;Se++){const P=X(pe[Se],$[Se],ie);_e(P.x,P.y,-O)}}}const Ce=v+_;for(let N=0;N<H;N++){const W=h?X(y[N],se[N],Ce):y[N];M?(S.copy(T.normals[0]).multiplyScalar(W.x),E.copy(T.binormals[0]).multiplyScalar(W.y),b.copy(g[0]).add(S).add(E),_e(b.x,b.y,b.z)):_e(W.x,W.y,0)}for(let N=1;N<=u;N++)for(let W=0;W<H;W++){const O=h?X(y[W],se[W],Ce):y[W];M?(S.copy(T.normals[N]).multiplyScalar(O.x),E.copy(T.binormals[N]).multiplyScalar(O.y),b.copy(g[N]).add(S).add(E),_e(b.x,b.y,b.z)):_e(O.x,O.y,f/u*N)}for(let N=m-1;N>=0;N--){const W=N/m,O=p*Math.cos(W*Math.PI/2),ie=v*Math.sin(W*Math.PI/2)+_;for(let ne=0,ge=I.length;ne<ge;ne++){const pe=X(I[ne],z[ne],ie);_e(pe.x,pe.y,f+O)}for(let ne=0,ge=A.length;ne<ge;ne++){const pe=A[ne];$=B[ne];for(let Se=0,ke=pe.length;Se<ke;Se++){const P=X(pe[Se],$[Se],ie);M?_e(P.x,P.y+g[u-1].y,g[u-1].x+O):_e(P.x,P.y,f+O)}}}G(),oe();function G(){const N=r.length/3;if(h){let W=0,O=H*W;for(let ie=0;ie<Q;ie++){const ne=J[ie];we(ne[2]+O,ne[1]+O,ne[0]+O)}W=u+m*2,O=H*W;for(let ie=0;ie<Q;ie++){const ne=J[ie];we(ne[0]+O,ne[1]+O,ne[2]+O)}}else{for(let W=0;W<Q;W++){const O=J[W];we(O[2],O[1],O[0])}for(let W=0;W<Q;W++){const O=J[W];we(O[0]+H*u,O[1]+H*u,O[2]+H*u)}}i.addGroup(N,r.length/3-N,0)}function oe(){const N=r.length/3;let W=0;ue(I,W),W+=I.length;for(let O=0,ie=A.length;O<ie;O++){const ne=A[O];ue(ne,W),W+=ne.length}i.addGroup(N,r.length/3-N,1)}function ue(N,W){let O=N.length;for(;--O>=0;){const ie=O;let ne=O-1;ne<0&&(ne=N.length-1);for(let ge=0,pe=u+m*2;ge<pe;ge++){const Se=H*ge,ke=H*(ge+1),P=W+ie+Se,w=W+ne+Se,q=W+ne+ke,ee=W+ie+ke;Ee(P,w,q,ee)}}}function _e(N,W,O){l.push(N),l.push(W),l.push(O)}function we(N,W,O){Oe(N),Oe(W),Oe(O);const ie=r.length/3,ne=x.generateTopUV(i,r,ie-3,ie-2,ie-1);Re(ne[0]),Re(ne[1]),Re(ne[2])}function Ee(N,W,O,ie){Oe(N),Oe(W),Oe(ie),Oe(W),Oe(O),Oe(ie);const ne=r.length/3,ge=x.generateSideWallUV(i,r,ne-6,ne-3,ne-2,ne-1);Re(ge[0]),Re(ge[1]),Re(ge[3]),Re(ge[1]),Re(ge[2]),Re(ge[3])}function Oe(N){r.push(l[N*3+0]),r.push(l[N*3+1]),r.push(l[N*3+2])}function Re(N){s.push(N.x),s.push(N.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return jA(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new bh[r.type]().fromJSON(r)),new Gd(i,e.options)}}const WA={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],u=e[r*3+1];return[new le(s,o),new le(a,l),new le(c,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],u=e[i*3+1],f=e[i*3+2],h=e[r*3],p=e[r*3+1],v=e[r*3+2],_=e[s*3],m=e[s*3+1],d=e[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new le(o,1-l),new le(c,1-f),new le(h,1-v),new le(_,1-d)]:[new le(a,1-l),new le(u,1-f),new le(p,1-v),new le(m,1-d)]}};function jA(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class $r extends kt{constructor(e=.5,t=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],l=[],c=[],u=[];let f=e;const h=(t-e)/r,p=new U,v=new le;for(let _=0;_<=r;_++){for(let m=0;m<=i;m++){const d=s+m/i*o;p.x=f*Math.cos(d),p.y=f*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),v.x=(p.x/t+1)/2,v.y=(p.y/t+1)/2,u.push(v.x,v.y)}f+=h}for(let _=0;_<r;_++){const m=_*(i+1);for(let d=0;d<i;d++){const x=d+m,g=x,M=x+i+1,T=x+i+2,E=x+1;a.push(g,M,E),a.push(M,T,E)}}this.setIndex(a),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(c,3)),this.setAttribute("uv",new ot(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class It extends kt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],f=new U,h=new U,p=[],v=[],_=[],m=[];for(let d=0;d<=i;d++){const x=[],g=d/i;let M=0;d===0&&o===0?M=.5/t:d===i&&l===Math.PI&&(M=-.5/t);for(let T=0;T<=t;T++){const E=T/t;f.x=-e*Math.cos(r+E*s)*Math.sin(o+g*a),f.y=e*Math.cos(o+g*a),f.z=e*Math.sin(r+E*s)*Math.sin(o+g*a),v.push(f.x,f.y,f.z),h.copy(f).normalize(),_.push(h.x,h.y,h.z),m.push(E+M,1-g),x.push(c++)}u.push(x)}for(let d=0;d<i;d++)for(let x=0;x<t;x++){const g=u[d][x+1],M=u[d][x],T=u[d+1][x],E=u[d+1][x+1];(d!==0||o>0)&&p.push(g,M,E),(d!==i-1||l<Math.PI)&&p.push(M,T,E)}this.setIndex(p),this.setAttribute("position",new ot(v,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new It(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ve extends ps{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ux,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class z0 extends Lc{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class h_ extends Ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class XA extends h_{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const _f=new ft,O0=new U,B0=new U;class YA{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Dd,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;O0.setFromMatrixPosition(e.matrixWorld),t.position.copy(O0),B0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(B0),t.updateMatrixWorld(),_f.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_f),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(_f)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class qA extends YA{constructor(){super(new Nd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class yf extends h_{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.target=new Ht,this.shadow=new qA}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class $A{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=G0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=G0();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function G0(){return(typeof performance>"u"?Date:performance).now()}const V0=new ft;class KA{constructor(e,t,i=0,r=1/0){this.ray=new Qc(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Ld,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return V0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(V0),this}intersectObject(e,t=!0,i=[]){return Lh(e,this,i,t),i.sort(H0),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Lh(e[r],this,i,t);return i.sort(H0),i}}function H0(n,e){return n.distance-e.distance}function Lh(n,e,t,i){if(n.layers.test(e.layers)&&n.raycast(e,t),i===!0){const r=n.children;for(let s=0,o=r.length;s<o;s++)Lh(r[s],e,t,!0)}}class W0{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Qt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bd);const j0={type:"change"},Mf={type:"start"},X0={type:"end"},Ul=new Qc,Y0=new cr,ZA=Math.cos(70*Q1.DEG2RAD);class JA extends hs{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Bi.ROTATE,MIDDLE:Bi.DOLLY,RIGHT:Bi.PAN},this.touches={ONE:lr.ROTATE,TWO:lr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",Pe),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pe),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(j0),i.update(),s=r.NONE},this.update=function(){const L=new U,ae=new Pr().setFromUnitVectors(e.up,new U(0,1,0)),De=ae.clone().invert(),F=new U,me=new Pr,Y=new U,he=2*Math.PI;return function(et=null){const lt=i.object.position;L.copy(lt).sub(i.target),L.applyQuaternion(ae),a.setFromVector3(L),i.autoRotate&&s===r.NONE&&j(y(et)),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let pt=i.minAzimuthAngle,Dt=i.maxAzimuthAngle;isFinite(pt)&&isFinite(Dt)&&(pt<-Math.PI?pt+=he:pt>Math.PI&&(pt-=he),Dt<-Math.PI?Dt+=he:Dt>Math.PI&&(Dt-=he),pt<=Dt?a.theta=Math.max(pt,Math.min(Dt,a.theta)):a.theta=a.theta>(pt+Dt)/2?Math.max(pt,a.theta):Math.min(Dt,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(u,i.dampingFactor):i.target.add(u),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor);let rt=!1;if(i.zoomToCursor&&E||i.object.isOrthographicCamera)a.radius=B(a.radius);else{const yt=a.radius;a.radius=B(a.radius*c),rt=yt!=a.radius}if(L.setFromSpherical(a),L.applyQuaternion(De),lt.copy(i.target).add(L),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,u.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),u.set(0,0,0)),i.zoomToCursor&&E){let yt=null;if(i.object.isPerspectiveCamera){const on=L.length();yt=B(on*c);const Ur=on-yt;i.object.position.addScaledVector(M,Ur),i.object.updateMatrixWorld(),rt=!!Ur}else if(i.object.isOrthographicCamera){const on=new U(T.x,T.y,0);on.unproject(i.object);const Ur=i.object.zoom;i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),rt=Ur!==i.object.zoom;const Oa=new U(T.x,T.y,0);Oa.unproject(i.object),i.object.position.sub(Oa).add(on),i.object.updateMatrixWorld(),yt=L.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;yt!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(yt).add(i.object.position):(Ul.origin.copy(i.object.position),Ul.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(Ul.direction))<ZA?e.lookAt(i.target):(Y0.setFromNormalAndCoplanarPoint(i.object.up,i.target),Ul.intersectPlane(Y0,i.target))))}else if(i.object.isOrthographicCamera){const yt=i.object.zoom;i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),yt!==i.object.zoom&&(i.object.updateProjectionMatrix(),rt=!0)}return c=1,E=!1,rt||F.distanceToSquared(i.object.position)>o||8*(1-me.dot(i.object.quaternion))>o||Y.distanceToSquared(i.target)>o?(i.dispatchEvent(j0),F.copy(i.object.position),me.copy(i.object.quaternion),Y.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",Be),i.domElement.removeEventListener("pointerdown",Se),i.domElement.removeEventListener("pointercancel",P),i.domElement.removeEventListener("wheel",ee),i.domElement.removeEventListener("pointermove",ke),i.domElement.removeEventListener("pointerup",P),i.domElement.getRootNode().removeEventListener("keydown",re,{capture:!0}),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",Pe),i._domElementKeyEvents=null)};const i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const o=1e-6,a=new W0,l=new W0;let c=1;const u=new U,f=new le,h=new le,p=new le,v=new le,_=new le,m=new le,d=new le,x=new le,g=new le,M=new U,T=new le;let E=!1;const S=[],b={};let D=!1;function y(L){return L!==null?2*Math.PI/60*i.autoRotateSpeed*L:2*Math.PI/60/60*i.autoRotateSpeed}function A(L){const ae=Math.abs(L*.01);return Math.pow(.95,i.zoomSpeed*ae)}function j(L){l.theta-=L}function J(L){l.phi-=L}const I=function(){const L=new U;return function(De,F){L.setFromMatrixColumn(F,0),L.multiplyScalar(-De),u.add(L)}}(),X=function(){const L=new U;return function(De,F){i.screenSpacePanning===!0?L.setFromMatrixColumn(F,1):(L.setFromMatrixColumn(F,0),L.crossVectors(i.object.up,L)),L.multiplyScalar(De),u.add(L)}}(),H=function(){const L=new U;return function(De,F){const me=i.domElement;if(i.object.isPerspectiveCamera){const Y=i.object.position;L.copy(Y).sub(i.target);let he=L.length();he*=Math.tan(i.object.fov/2*Math.PI/180),I(2*De*he/me.clientHeight,i.object.matrix),X(2*F*he/me.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(I(De*(i.object.right-i.object.left)/i.object.zoom/me.clientWidth,i.object.matrix),X(F*(i.object.top-i.object.bottom)/i.object.zoom/me.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function Q(L){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function k(L){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function z(L,ae){if(!i.zoomToCursor)return;E=!0;const De=i.domElement.getBoundingClientRect(),F=L-De.left,me=ae-De.top,Y=De.width,he=De.height;T.x=F/Y*2-1,T.y=-(me/he)*2+1,M.set(T.x,T.y,1).unproject(i.object).sub(i.object.position).normalize()}function B(L){return Math.max(i.minDistance,Math.min(i.maxDistance,L))}function $(L){f.set(L.clientX,L.clientY)}function se(L){z(L.clientX,L.clientX),d.set(L.clientX,L.clientY)}function Ce(L){v.set(L.clientX,L.clientY)}function G(L){h.set(L.clientX,L.clientY),p.subVectors(h,f).multiplyScalar(i.rotateSpeed);const ae=i.domElement;j(2*Math.PI*p.x/ae.clientHeight),J(2*Math.PI*p.y/ae.clientHeight),f.copy(h),i.update()}function oe(L){x.set(L.clientX,L.clientY),g.subVectors(x,d),g.y>0?Q(A(g.y)):g.y<0&&k(A(g.y)),d.copy(x),i.update()}function ue(L){_.set(L.clientX,L.clientY),m.subVectors(_,v).multiplyScalar(i.panSpeed),H(m.x,m.y),v.copy(_),i.update()}function _e(L){z(L.clientX,L.clientY),L.deltaY<0?k(A(L.deltaY)):L.deltaY>0&&Q(A(L.deltaY)),i.update()}function we(L){let ae=!1;switch(L.code){case i.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?J(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(0,i.keyPanSpeed),ae=!0;break;case i.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?J(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(0,-i.keyPanSpeed),ae=!0;break;case i.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?j(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(i.keyPanSpeed,0),ae=!0;break;case i.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?j(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(-i.keyPanSpeed,0),ae=!0;break}ae&&(L.preventDefault(),i.update())}function Ee(L){if(S.length===1)f.set(L.pageX,L.pageY);else{const ae=Le(L),De=.5*(L.pageX+ae.x),F=.5*(L.pageY+ae.y);f.set(De,F)}}function Oe(L){if(S.length===1)v.set(L.pageX,L.pageY);else{const ae=Le(L),De=.5*(L.pageX+ae.x),F=.5*(L.pageY+ae.y);v.set(De,F)}}function Re(L){const ae=Le(L),De=L.pageX-ae.x,F=L.pageY-ae.y,me=Math.sqrt(De*De+F*F);d.set(0,me)}function N(L){i.enableZoom&&Re(L),i.enablePan&&Oe(L)}function W(L){i.enableZoom&&Re(L),i.enableRotate&&Ee(L)}function O(L){if(S.length==1)h.set(L.pageX,L.pageY);else{const De=Le(L),F=.5*(L.pageX+De.x),me=.5*(L.pageY+De.y);h.set(F,me)}p.subVectors(h,f).multiplyScalar(i.rotateSpeed);const ae=i.domElement;j(2*Math.PI*p.x/ae.clientHeight),J(2*Math.PI*p.y/ae.clientHeight),f.copy(h)}function ie(L){if(S.length===1)_.set(L.pageX,L.pageY);else{const ae=Le(L),De=.5*(L.pageX+ae.x),F=.5*(L.pageY+ae.y);_.set(De,F)}m.subVectors(_,v).multiplyScalar(i.panSpeed),H(m.x,m.y),v.copy(_)}function ne(L){const ae=Le(L),De=L.pageX-ae.x,F=L.pageY-ae.y,me=Math.sqrt(De*De+F*F);x.set(0,me),g.set(0,Math.pow(x.y/d.y,i.zoomSpeed)),Q(g.y),d.copy(x);const Y=(L.pageX+ae.x)*.5,he=(L.pageY+ae.y)*.5;z(Y,he)}function ge(L){i.enableZoom&&ne(L),i.enablePan&&ie(L)}function pe(L){i.enableZoom&&ne(L),i.enableRotate&&O(L)}function Se(L){i.enabled!==!1&&(S.length===0&&(i.domElement.setPointerCapture(L.pointerId),i.domElement.addEventListener("pointermove",ke),i.domElement.addEventListener("pointerup",P)),!Xe(L)&&(ve(L),L.pointerType==="touch"?fe(L):w(L)))}function ke(L){i.enabled!==!1&&(L.pointerType==="touch"?xe(L):q(L))}function P(L){switch(Et(L),S.length){case 0:i.domElement.releasePointerCapture(L.pointerId),i.domElement.removeEventListener("pointermove",ke),i.domElement.removeEventListener("pointerup",P),i.dispatchEvent(X0),s=r.NONE;break;case 1:const ae=S[0],De=b[ae];fe({pointerId:ae,pageX:De.x,pageY:De.y});break}}function w(L){let ae;switch(L.button){case 0:ae=i.mouseButtons.LEFT;break;case 1:ae=i.mouseButtons.MIDDLE;break;case 2:ae=i.mouseButtons.RIGHT;break;default:ae=-1}switch(ae){case Bi.DOLLY:if(i.enableZoom===!1)return;se(L),s=r.DOLLY;break;case Bi.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(i.enablePan===!1)return;Ce(L),s=r.PAN}else{if(i.enableRotate===!1)return;$(L),s=r.ROTATE}break;case Bi.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(i.enableRotate===!1)return;$(L),s=r.ROTATE}else{if(i.enablePan===!1)return;Ce(L),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Mf)}function q(L){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;G(L);break;case r.DOLLY:if(i.enableZoom===!1)return;oe(L);break;case r.PAN:if(i.enablePan===!1)return;ue(L);break}}function ee(L){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(L.preventDefault(),i.dispatchEvent(Mf),_e(ce(L)),i.dispatchEvent(X0))}function ce(L){const ae=L.deltaMode,De={clientX:L.clientX,clientY:L.clientY,deltaY:L.deltaY};switch(ae){case 1:De.deltaY*=16;break;case 2:De.deltaY*=100;break}return L.ctrlKey&&!D&&(De.deltaY*=10),De}function re(L){L.key==="Control"&&(D=!0,i.domElement.getRootNode().addEventListener("keyup",Ne,{passive:!0,capture:!0}))}function Ne(L){L.key==="Control"&&(D=!1,i.domElement.getRootNode().removeEventListener("keyup",Ne,{passive:!0,capture:!0}))}function Pe(L){i.enabled===!1||i.enablePan===!1||we(L)}function fe(L){switch(ze(L),S.length){case 1:switch(i.touches.ONE){case lr.ROTATE:if(i.enableRotate===!1)return;Ee(L),s=r.TOUCH_ROTATE;break;case lr.PAN:if(i.enablePan===!1)return;Oe(L),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case lr.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;N(L),s=r.TOUCH_DOLLY_PAN;break;case lr.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;W(L),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Mf)}function xe(L){switch(ze(L),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;O(L),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;ie(L),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;ge(L),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;pe(L),i.update();break;default:s=r.NONE}}function Be(L){i.enabled!==!1&&L.preventDefault()}function ve(L){S.push(L.pointerId)}function Et(L){delete b[L.pointerId];for(let ae=0;ae<S.length;ae++)if(S[ae]==L.pointerId){S.splice(ae,1);return}}function Xe(L){for(let ae=0;ae<S.length;ae++)if(S[ae]==L.pointerId)return!0;return!1}function ze(L){let ae=b[L.pointerId];ae===void 0&&(ae=new le,b[L.pointerId]=ae),ae.set(L.pageX,L.pageY)}function Le(L){const ae=L.pointerId===S[0]?S[1]:S[0];return b[ae]}i.domElement.addEventListener("contextmenu",Be),i.domElement.addEventListener("pointerdown",Se),i.domElement.addEventListener("pointercancel",P),i.domElement.addEventListener("wheel",ee,{passive:!1}),i.domElement.getRootNode().addEventListener("keydown",re,{passive:!0,capture:!0}),this.update()}}function QA(n){const e=new Uint8Array(512),t=new Uint8Array(256);for(let r=0;r<256;r++)t[r]=r;let i=n|0||1;for(let r=255;r>0;r--){i=(i*16807+0)%2147483647;const s=i%(r+1);[t[r],t[s]]=[t[s],t[r]]}for(let r=0;r<256;r++)e[r]=e[r+256]=t[r];return e}const eC=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],tC=.5*(Math.sqrt(3)-1),Yo=(3-Math.sqrt(3))/6;function Na(n=42){const e=QA(n);return function(i,r){const s=(i+r)*tC,o=Math.floor(i+s),a=Math.floor(r+s),l=(o+a)*Yo,c=i-(o-l),u=r-(a-l),f=c>u?1:0,h=c>u?0:1,p=c-f+Yo,v=u-h+Yo,_=c-1+2*Yo,m=u-1+2*Yo,d=o&255,x=a&255,g=(y,A,j)=>{const J=eC[y%8];return J[0]*A+J[1]*j};let M=0,T=0,E=0,S=.5-c*c-u*u;S>=0&&(S*=S,M=S*S*g(e[d+e[x]],c,u));let b=.5-p*p-v*v;b>=0&&(b*=b,T=b*b*g(e[d+f+e[x+h]],p,v));let D=.5-_*_-m*m;return D>=0&&(D*=D,E=D*D*g(e[d+1+e[x+1]],_,m)),70*(M+T+E)}}function ks(n,e,t,i=6,r=2,s=.5){let o=0,a=1,l=1,c=0;for(let u=0;u<i;u++)o+=n(e*l,t*l)*a,c+=a,a*=s,l*=r;return o/c}function q0(n,e,t,i=4){let r=0,s=1,o=1;for(let a=0;a<i;a++){let l=n(e*o,t*o);l=1-Math.abs(l),l*=l,r+=l*s,s*=.5,o*=2}return r}const je=2e3,en=384,nn=38,mi=[{name:"Granite Gneiss",baseElevation:0,color:"#8B7D7B",hex:9141627,vegetationDensity:.05,minerals:["Quartz","K-Feldspar","Plagioclase","Biotite"],characteristics:"Coarse-grained metamorphic basement rock with gneissic banding",grainSize:"Coarse (2–5 mm)",texture:"Gneissic banding",fossils:"None",age:"Precambrian (~1.8 Ga)"},{name:"Dolomitic Limestone",baseElevation:40,color:"#C8B898",hex:13154456,vegetationDensity:.25,minerals:["Dolomite","Calcite","Minor Quartz"],characteristics:"Fine-grained carbonate rock with dolomite replacement textures",grainSize:"Fine (0.1–0.5 mm)",texture:"Crystalline, sucrosic",fossils:"Coral fragments, Stromatolites",age:"Cambrian (~510 Ma)"},{name:"Sandstone & Shale",baseElevation:75,color:"#B8A06E",hex:12099694,vegetationDensity:.75,minerals:["Quartz","Feldspar","Clay minerals","Mica"],characteristics:"Alternating sandstone and shale beds with cross-bedding",grainSize:"Fine to Medium",texture:"Clastic, laminated",fossils:"Trilobites, Brachiopods",age:"Ordovician (~470 Ma)"},{name:"Schist",baseElevation:130,color:"#607070",hex:6320240,vegetationDensity:.55,minerals:["Muscovite","Biotite","Garnet","Quartz"],characteristics:"Foliated metamorphic rock with visible mica flakes and garnet porphyroblasts",grainSize:"Medium to Coarse",texture:"Schistose foliation",fossils:"None (metamorphosed)",age:"Silurian (~430 Ma)"},{name:"Limestone",baseElevation:180,color:"#A09080",hex:10522752,vegetationDensity:.45,minerals:["Calcite","Aragonite","Minor Clay"],characteristics:"Fossiliferous limestone with well-preserved marine fauna",grainSize:"Fine to Medium",texture:"Bioclastic, micritic",fossils:"Ammonites, Crinoids, Brachiopods",age:"Devonian (~380 Ma)"},{name:"Alluvium & Topsoil",baseElevation:220,color:"#6D8B50",hex:7179088,vegetationDensity:1,minerals:["Clay","Quartz sand","Organic matter"],characteristics:"Unconsolidated surface material with vegetation cover",grainSize:"Variable",texture:"Unconsolidated",fossils:"Plant debris, recent",age:"Quaternary (<2 Ma)"}];function fa(n){for(let e=mi.length-1;e>=0;e--)if(n>=mi[e].baseElevation)return mi[e];return mi[0]}const Gi=en+1,$0=je/2,yo=[{cx:-320,cz:180,rx:160,rz:110,depth:24,name:"Mirror Lake"},{cx:260,cz:-280,rx:130,rz:150,depth:22,name:"Crystal Pond"},{cx:-140,cz:-420,rx:100,rz:80,depth:18,name:"Emerald Tarn"},{cx:550,cz:200,rx:140,rz:100,depth:20,name:"Sapphire Lake"},{cx:-560,cz:-120,rx:90,rz:110,depth:56,name:"Hidden Pool"}],Dc=[{name:"Serpent River",width:30,depth:16,points:[{x:-850,z:-650},{x:-620,z:-480},{x:-400,z:-300},{x:-220,z:-120},{x:-60,z:30},{x:80,z:130},{x:230,z:80},{x:380,z:10},{x:530,z:-100},{x:680,z:-180},{x:850,z:-140}]}],Ti={cx:380,cz:320,radius:160,elevation:95};function K0(n,e,t,i,r){const s=r*r,o=s*r;return .5*(2*e+(-n+t)*r+(2*n-5*e+4*t-i)*s+(-n+3*e-3*t+i)*o)}function nC(n,e=8){const t=[];for(let i=0;i<n.length-1;i++){const r=n[Math.max(0,i-1)],s=n[i],o=n[i+1],a=n[Math.min(n.length-1,i+2)];for(let l=0;l<e;l++){const c=l/e;t.push({x:K0(r.x,s.x,o.x,a.x,c),z:K0(r.z,s.z,o.z,a.z,c)})}}return t.push({x:n[n.length-1].x,z:n[n.length-1].z}),t}const Sf=new Map;function iC(n){if(Sf.has(n.name))return Sf.get(n.name);const e=nC(n.points,8);return Sf.set(n.name,e),e}function rC(n,e,t,i){const r=ks(n,t*45e-5,i*45e-5,6)*55,s=Math.max(0,1-((t+400)*(t+400)+(i+300)*(i+300))/(650*650)),o=q0(e,t*8e-4,i*8e-4,5)*120*s,a=Math.max(0,1-((t-500)*(t-500)+(i+400)*(i+400))/(500*500)),l=q0(n,t*.001+5,i*.001+5,4)*80*a,c=ks(e,t*.0012,i*.0012,4)*30,f=Math.abs(n(t*8e-4,i*8e-4))*25,h=ks(n,t*.004,i*.004,3)*8,p=ks(n,t*.012,i*.012,2)*2.5,v=Math.max(0,ks(e,t*25e-5,i*25e-5,3))*18,_=t/$0,m=i/$0,d=Math.max(Math.abs(_),Math.abs(m)),x=d>.85?(d-.85)/.15:0,g=x*x*60;let M=80+r+o+l+c+h+p+v-f-g;M=Math.max(M,18);{const T=(t-Ti.cx)/Ti.radius,E=(i-Ti.cz)/Ti.radius,S=T*T+E*E;if(S<2.5){const b=Math.sqrt(S),D=Math.max(0,1-b/1.4),y=D*D*(3-2*D),A=Ti.elevation+ks(e,t*.003,i*.003,2)*1.5;M=M*(1-y)+A*y}}for(const T of yo){const E=(t-T.cx)/T.rx,S=(i-T.cz)/T.rz,b=E*E+S*S;if(b<2.25){const D=Math.sqrt(b),y=Math.max(0,1-D/1.5),A=y*y*(3-2*y),j=Math.max(0,1-D*D)*T.depth;M-=A*(j+8)}}for(const T of Dc){const E=iC(T);let S=1/0;for(let y=0;y<E.length-1;y++){const A=E[y].x,j=E[y].z,J=E[y+1].x,I=E[y+1].z,X=J-A,H=I-j,Q=t-A,k=i-j,z=X*X+H*H,B=z>0?Math.max(0,Math.min(1,(Q*X+k*H)/z)):0,$=A+B*X,se=j+B*H,Ce=(t-$)**2+(i-se)**2;Ce<S&&(S=Ce)}const b=Math.sqrt(S),D=T.width;if(b<D*4.5){const y=Math.max(0,1-b/(D*3.5)),A=y*y*(3-2*y),j=T.depth*Math.max(0,1-b/D*(b/D));M-=A*(j+12)}}return M}function Vd(n,e,t){const i=Math.sin((e+t)*.004+n(e*.001,t*.001)*2)*12,r=n(e*3e-4,t*3e-4)*14,s=n(e*.001+50,t*.001+50)*6;return i+r+s}function Hd(n){return 1/(1+Math.exp(-(n-200)/10))*-28}function d_(n,e,t,i){const r=Vd(n,e,i)+Hd(e);return fa(t-r)}function sC(n,e,t,i){const r=Vd(n,e,i)+Hd(e),s=t-r,o=6;for(let a=mi.length-1;a>=0;a--)if(s>=mi[a].baseElevation){if(a<mi.length-1){const c=mi[a+1].baseElevation-s;if(c<o&&c>0)return a+(1-c/o)}return a}return 0}function oC(n,e){const t=new Float32Array(Gi*Gi);for(let i=0;i<Gi;i++)for(let r=0;r<Gi;r++){const s=(r/en-.5)*je,o=(i/en-.5)*je;t[i*Gi+r]=rC(n,e,s,o)}return t}function Jo(n,e,t){const i=(e+je/2)/je*en,r=(t+je/2)/je*en,s=Math.max(0,Math.min(en-1,i|0)),o=Math.max(0,Math.min(en-1,r|0)),a=Math.min(s+1,en),l=Math.min(o+1,en),c=i-s,u=r-o;return n[o*Gi+s]*(1-c)*(1-u)+n[o*Gi+a]*c*(1-u)+n[l*Gi+s]*(1-c)*u+n[l*Gi+a]*c*u}function aC(n,e){const t=new Wn(je,je,en,en);t.rotateX(-Math.PI/2);const i=t.attributes.position,r=new Float32Array(i.count*3),s=new Float32Array(i.count);for(let o=0;o<i.count;o++){const a=i.getX(o),l=i.getZ(o),c=Jo(e,a,l);i.setY(o,c),s[o]=sC(n,a,c,l);const u=d_(n,a,c,l),f=new Me(u.hex),h=n(a*.015,l*.015)*.08,p=n(a*.06+100,l*.06+100)*.04;f.offsetHSL(p*.1,h*.2,h+p),r[o*3]=f.r,r[o*3+1]=f.g,r[o*3+2]=f.b}return t.setAttribute("aVertColor",new ot(r,3)),t.setAttribute("aLayerIndex",new ot(s,1)),i.needsUpdate=!0,t.computeVertexNormals(),t}function lC(n,e,t=22e3){for(let h=0;h<t;h++){let p=Math.random()*(e-3)+1,v=Math.random()*(e-3)+1,_=0,m=0,d=1,x=1,g=0;for(let M=0;M<30;M++){const T=p|0,E=v|0,S=p-T,b=v-E,D=E*e+T,y=n[D],A=n[D+1],j=n[D+e],J=n[D+e+1],I=y*(1-S)*(1-b)+A*S*(1-b)+j*(1-S)*b+J*S*b,X=(A-y)*(1-b)+(J-j)*b,H=(j-y)*(1-S)+(J-A)*S;_=_*.05-X*(1-.05),m=m*.05-H*(1-.05);const Q=Math.sqrt(_*_+m*m);if(Q>1e-6&&(_/=Q,m/=Q),p+=_,v+=m,p<1||p>=e-2||v<1||v>=e-2)break;const k=p|0,z=v|0,B=p-k,$=v-z,se=z*e+k,G=n[se]*(1-B)*(1-$)+n[se+1]*B*(1-$)+n[se+e]*(1-B)*$+n[se+e+1]*B*$-I,oe=Math.max(-G*d*x*4,.01);if(g>oe||G>0){const ue=G>0?Math.min(G,g):(g-oe)*.3;g-=ue,n[D]+=ue*(1-S)*(1-b),n[D+1]+=ue*S*(1-b),n[D+e]+=ue*(1-S)*b,n[D+e+1]+=ue*S*b}else{const ue=Math.min((oe-g)*.3,-G);for(let _e=-3;_e<=3;_e++)for(let we=-3;we<=3;we++){const Ee=T+we,Oe=E+_e;if(Ee<0||Ee>=e||Oe<0||Oe>=e)continue;const Re=Math.sqrt(we*we+_e*_e);if(Re>3)continue;const N=Math.max(0,1-Re/3);n[Oe*e+Ee]-=ue*N*.1}g+=ue}d=Math.sqrt(Math.max(0,d*d+G*4)),x*=1-.012}}}const Ze=1024,tt=n=>Math.max(0,Math.min(255,n|0));function Co(){return{albedo:new Uint8ClampedArray(Ze*Ze*4),rmh:new Uint8ClampedArray(Ze*Ze*4)}}function cC(n,e){const{albedo:t,rmh:i}=Co();for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=(r*Ze+s)*4,a=n(s*.018,r*.018),l=e(s*.07,r*.07),c=n(s*.14+50,r*.14+50),u=r+n(s*.005,r*.008)*35,f=Math.sin(u*.045)*.5+.5;let h,p,v,_;c>.25?(h=190+a*25,p=185+a*20,v=180+a*18,_=.55):c>-.15?(h=195+a*18,p=165+a*14,v=160+a*12,_=.6):(h=65+a*22,p=58+a*16,v=52+a*14,_=.45);const m=f*.25;h=h*(1-m)+105*m,p=p*(1-m)+98*m,v=v*(1-m)+92*m,h+=l*14,p+=l*11,v+=l*9;const d=.85+l*.08+f*.07,x=.5+a*.2+l*.1;_+=l*.08,t[o]=tt(h),t[o+1]=tt(p),t[o+2]=tt(v),t[o+3]=255,i[o]=tt(_*255),i[o+1]=tt(d*255),i[o+2]=tt(x*255),i[o+3]=255}return{albedo:t,rmh:i}}function uC(n,e){const{albedo:t,rmh:i}=Co();for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=(r*Ze+s)*4,a=n(s*.012,r*.012),l=e(s*.06,r*.06),c=n(s*.25+100,r*.25+100);let u=200+a*20+c*8,f=186+a*18+c*7,h=155+a*16+c*6,p=.48,v=.9,_=.5+a*.15;Math.abs(n(s*.008+30,r*.008+30))<.06&&(u+=22,f+=18,h+=14,p-=.08),c>.6&&(u+=18,f+=16,h+=14,p-=.12),u+=l*10,f+=l*8,h+=l*6,v+=l*.05,t[o]=tt(u),t[o+1]=tt(f),t[o+2]=tt(h),t[o+3]=255,i[o]=tt(p*255),i[o+1]=tt(v*255),i[o+2]=tt(_*255),i[o+3]=255}return{albedo:t,rmh:i}}function fC(n,e){const{albedo:t,rmh:i}=Co();for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=(r*Ze+s)*4,a=n(s*.015,r*.015),l=e(s*.09,r*.09),c=s*Math.cos(.35)+r*Math.sin(.35),u=Math.sin(c*.055+n(s*.003,r*.003)*6)*.5+.5,f=u<.3;let h,p,v,_,m,d;f?(h=130+a*15,p=120+a*12,v=105+a*10,_=.72,m=.78,d=.35):(h=188+a*18+u*12,p=165+a*15+u*8,v=118+a*10+u*6,_=.65,m=.88,d=.55+u*.15),h+=l*10,p+=l*8,v+=l*6,_+=l*.05,t[o]=tt(h),t[o+1]=tt(p),t[o+2]=tt(v),t[o+3]=255,i[o]=tt(_*255),i[o+1]=tt(m*255),i[o+2]=tt(d*255),i[o+3]=255}return{albedo:t,rmh:i}}function hC(n,e){const{albedo:t,rmh:i}=Co();for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=(r*Ze+s)*4,a=n(s*.014,r*.014),l=e(s*.08,r*.08),c=r+n(s*.004,r*.006)*20,u=Math.sin(c*.09)*.5+.5;let f=100+a*18,h=115+a*16,p=117+a*16,v=.58,_=.82,m=.45+u*.15;const d=u>.7?(u-.7)*3.33:0;f+=d*35,h+=d*30,p+=d*25,v-=d*.25,n(s*.06+200,r*.06+200)>.65&&(f=140,h=40,p=45,v=.35),f+=l*8,h+=l*7,p+=l*6,_+=l*.06,t[o]=tt(f),t[o+1]=tt(h),t[o+2]=tt(p),t[o+3]=255,i[o]=tt(v*255),i[o+1]=tt(_*255),i[o+2]=tt(m*255),i[o+3]=255}return{albedo:t,rmh:i}}function dC(n,e){const{albedo:t,rmh:i}=Co();for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=(r*Ze+s)*4,a=n(s*.01,r*.01),l=e(s*.07,r*.07),c=n(s*.2+80,r*.2+80);let u=168+a*18,f=152+a*16,h=135+a*14,p=.52,v=.88,_=.5+a*.15;Math.abs(n(s*.006+50,r*.002+50))<.03&&(u-=35,f-=30,h-=25,v-=.15,_-=.1);const d=(s+50)%80-40,x=(r+30)%90-45,g=Math.sqrt(d*d+x*x);g>12&&g<16&&c>.1&&(u-=15,f-=12,h-=10),u+=l*8,f+=l*7,h+=l*6,t[o]=tt(u),t[o+1]=tt(f),t[o+2]=tt(h),t[o+3]=255,i[o]=tt(p*255),i[o+1]=tt(v*255),i[o+2]=tt(_*255),i[o+3]=255}return{albedo:t,rmh:i}}function pC(n,e){const{albedo:t,rmh:i}=Co();for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=(r*Ze+s)*4,a=n(s*.012,r*.012),l=e(s*.06,r*.06),c=n(s*.18+60,r*.18+60);let u=110+a*22,f=140+a*20,h=85+a*15,p=.82,v=.75,_=.4+a*.2;c>.4&&(u-=18,f-=8,h-=12,v-=.08),n(s*.04+40,r*.04+40)>.3&&(u-=12,f+=14,h-=8,p+=.05),Math.abs(n(s*.01+70,r*.003+70))<.02&&(u-=25,f-=15,h-=20,_-=.08),u+=l*8,f+=l*7,h+=l*5,t[o]=tt(u),t[o+1]=tt(f),t[o+2]=tt(h),t[o+3]=255,i[o]=tt(p*255),i[o+1]=tt(v*255),i[o+2]=tt(_*255),i[o+3]=255}return{albedo:t,rmh:i}}function mC(n){const e=new Uint8ClampedArray(Ze*Ze*4),t=(r,s)=>{const o=((s+Ze)%Ze*Ze+(r+Ze)%Ze)*4;return(n[o]+n[o+1]+n[o+2])/765},i=3.2;for(let r=0;r<Ze;r++)for(let s=0;s<Ze;s++){const o=t(s-1,r-1),a=t(s,r-1),l=t(s+1,r-1),c=t(s-1,r),u=t(s+1,r),f=t(s-1,r+1),h=t(s,r+1),p=t(s+1,r+1),v=l+2*u+p-(o+2*c+f),_=f+2*h+p-(o+2*a+l),m=(r*Ze+s)*4;e[m]=tt((-v*i*.5+.5)*255),e[m+1]=tt((_*i*.5+.5)*255),e[m+2]=255,e[m+3]=255}return e}function gC(){const n=Na(999),e=Na(1234),t=[cC,uC,fC,hC,dC,pC],i=t.length,r=Ze*i,s=Ze,o=new Uint8ClampedArray(r*s*4),a=new Uint8ClampedArray(r*s*4),l=new Uint8ClampedArray(r*s*4);t.forEach((u,f)=>{const{albedo:h,rmh:p}=u(n,e),v=mC(h);for(let _=0;_<Ze;_++){const m=_*Ze*4,d=(_*r+f*Ze)*4;o.set(h.subarray(m,m+Ze*4),d),a.set(v.subarray(m,m+Ze*4),d),l.set(p.subarray(m,m+Ze*4),d)}});const c=u=>{const f=new i_(u,r,s);return f.format=kn,f.type=bi,f.wrapS=Fn,f.wrapT=Fn,f.minFilter=mr,f.magFilter=Zt,f.generateMipmaps=!0,f.needsUpdate=!0,f};return{albedoAtlas:c(o),normalAtlas:c(a),rmhAtlas:c(l)}}const vC=`
  attribute float aLayerIndex;
  attribute vec3  aVertColor;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying vec3  vVertColor;
  varying float vLayerIndex;
  varying float vFogDepth;
  varying vec2  vDetailUV;
  varying vec2  vMicroUV;
  varying float vElevation;
  varying float vCamDist;

  void main() {
    vec4 wp    = modelMatrix * vec4(position, 1.0);
    vWorldPos  = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vVertColor   = aVertColor;
    vLayerIndex  = aLayerIndex;
    vElevation   = wp.y;

    // detail UV at higher frequency for close-up normals
    vDetailUV = wp.xz * 0.06;
    // micro detail UV for extreme close-up
    vMicroUV  = wp.xz * 0.25;

    vec4 mvp = modelViewMatrix * vec4(position, 1.0);
    vFogDepth = length(mvp.xyz);
    vCamDist  = length(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * mvp;
  }
`,xC=`
  #define PI 3.14159265359
  #define TILE_COUNT 6.0

  uniform sampler2D uAlbedoAtlas;
  uniform sampler2D uNormalAtlas;
  uniform sampler2D uRmhAtlas;     // R=roughness, G=AO, B=height
  uniform float uTexScale;
  uniform float uDetailScale;
  uniform float uDetailStrength;
  uniform vec3  uSunDir;
  uniform vec3  uSunColor;
  uniform vec3  uAmbientColor;
  uniform vec3  uFogColorNear;
  uniform vec3  uFogColorFar;
  uniform float uFogDensity;
  uniform float uWaterLevel;
  uniform float uTime;
  uniform vec3  uSkyColor;

  // Lake positions for wetness (max 8)
  #define MAX_LAKES 5
  uniform vec4 uLakes[MAX_LAKES]; // xy=cx,cz  zw=rx,rz
  uniform int uLakeCount;

  // River segments for wetness (max 12)
  #define MAX_RIVER_PTS 11
  uniform vec2 uRiverPts[MAX_RIVER_PTS];
  uniform float uRiverWidth;
  uniform int uRiverPtCount;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying vec3  vVertColor;
  varying float vLayerIndex;
  varying float vFogDepth;
  varying vec2  vDetailUV;
  varying vec2  vMicroUV;
  varying float vElevation;
  varying float vCamDist;

  /* ── Atlas UV helper ─────────────────────── */
  vec2 atlasUV(vec2 baseUV, float layer) {
    float l = clamp(floor(layer), 0.0, TILE_COUNT - 1.0);
    return vec2((fract(baseUV.x) + l) / TILE_COUNT, fract(baseUV.y));
  }

  /* ── Tri-planar sample ───────────────────── */
  vec4 triPlanar(sampler2D tex, vec3 pos, float sc, float layer) {
    vec3 bl = abs(normalize(vWorldNormal));
    bl = pow(bl, vec3(4.0));
    bl /= (bl.x + bl.y + bl.z);
    vec4 sx = texture2D(tex, atlasUV(pos.yz * sc, layer));
    vec4 sy = texture2D(tex, atlasUV(pos.xz * sc, layer));
    vec4 sz = texture2D(tex, atlasUV(pos.xy * sc, layer));
    return sx * bl.x + sy * bl.y + sz * bl.z;
  }

  /* ── Detail normal from height field ──── */
  vec3 computeDetailNormal(vec2 uv) {
    float eps = 0.002;
    // Use the normal atlas at high freq as a detail height source
    float hC = texture2D(uNormalAtlas, uv).r;
    float hR = texture2D(uNormalAtlas, uv + vec2(eps, 0.0)).r;
    float hU = texture2D(uNormalAtlas, uv + vec2(0.0, eps)).r;
    vec3 detN = normalize(vec3(hC - hR, hC - hU, eps * 4.0));
    return detN;
  }

  /* ── PBR: GGX normal distribution ──── */
  float distributionGGX(float NdotH, float roughness) {
    float a  = roughness * roughness;
    float a2 = a * a;
    float d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
    return a2 / (PI * d * d + 0.0001);
  }

  /* ── PBR: Schlick-GGX geometry ──── */
  float geometrySmith(float NdotV, float NdotL, float roughness) {
    float r = roughness + 1.0;
    float k = (r * r) / 8.0;
    float gV = NdotV / (NdotV * (1.0 - k) + k);
    float gL = NdotL / (NdotL * (1.0 - k) + k);
    return gV * gL;
  }

  /* ── PBR: Fresnel-Schlick ──── */
  vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
  }

  void main() {
    float lo = floor(vLayerIndex);
    float hi = min(lo + 1.0, TILE_COUNT - 1.0);
    float t  = smoothstep(0.0, 1.0, fract(vLayerIndex));

    /* ── Distance-based LOD for anti-tiling ── */
    float camDist = vCamDist;
    float distLOD = smoothstep(300.0, 1400.0, camDist);

    /* ── Close-up LOD tiers ── */
    float closeUp  = smoothstep(150.0, 30.0, camDist);   // 1.0 when very close
    float ultraClose = smoothstep(60.0, 10.0, camDist);  // 1.0 when extremely close

    /* ── Sample PBR textures (tri-planar, layer-blended) ── */
    vec3 albLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale, lo).rgb;
    vec3 albHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale, hi).rgb;
    vec3 texColor = mix(albLo, albHi, t);

    // High-frequency detail layer — visible when zoomed in
    vec3 detAlbLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 3.5, lo).rgb;
    vec3 detAlbHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 3.5, hi).rgb;
    vec3 detColor = mix(detAlbLo, detAlbHi, t);
    // Overlay detail: multiply-blend preserves base color, adds grain
    texColor = mix(texColor, texColor * detColor * 1.6, closeUp * 0.45);

    // Micro-detail layer — visible only when extremely close
    vec3 microLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 9.0, lo).rgb;
    vec3 microHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 9.0, hi).rgb;
    vec3 microColor = mix(microLo, microHi, t);
    texColor = mix(texColor, texColor * microColor * 1.5, ultraClose * 0.3);

    // Macro-scale texture: lower frequency sample that persists at distance
    vec3 macroLo = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 0.25, lo).rgb;
    vec3 macroHi = triPlanar(uAlbedoAtlas, vWorldPos, uTexScale * 0.25, hi).rgb;
    vec3 macroColor = mix(macroLo, macroHi, t);

    // At close range: use detail texture; at distance: blend to macro then vertex color
    vec3 blendedTex = mix(texColor, macroColor, smoothstep(0.0, 0.6, distLOD));
    vec3 albedo = mix(blendedTex * vVertColor, vVertColor * 0.95, distLOD * 0.2) * 1.35;

    vec3 nLo = triPlanar(uNormalAtlas, vWorldPos, uTexScale, lo).rgb;
    vec3 nHi = triPlanar(uNormalAtlas, vWorldPos, uTexScale, hi).rgb;
    vec3 texNormal = mix(nLo, nHi, t) * 2.0 - 1.0;

    vec4 rmhLo = triPlanar(uRmhAtlas, vWorldPos, uTexScale, lo);
    vec4 rmhHi = triPlanar(uRmhAtlas, vWorldPos, uTexScale, hi);
    vec4 rmhVal = mix(rmhLo, rmhHi, t);
    float roughness = rmhVal.r;
    float ao        = rmhVal.g;
    float heightVal = rmhVal.b;

    /* ── Detail normal blending (fades at distance, slower falloff) ── */
    vec3 detN = computeDetailNormal(vDetailUV);
    float detailFade = smoothstep(1.0, 0.0, distLOD * 0.7);
    texNormal = normalize(texNormal + detN * uDetailStrength * detailFade);

    /* ── Micro-detail normal (extreme close-up grain) ── */
    vec3 microN = computeDetailNormal(vMicroUV);
    texNormal = normalize(texNormal + microN * uDetailStrength * 0.6 * ultraClose);

    /* ── High-freq normal from PBR atlas at close range ── */
    vec3 hfNrmLo = triPlanar(uNormalAtlas, vWorldPos, uTexScale * 3.5, lo).rgb;
    vec3 hfNrmHi = triPlanar(uNormalAtlas, vWorldPos, uTexScale * 3.5, hi).rgb;
    vec3 hfNrm = mix(hfNrmLo, hfNrmHi, t) * 2.0 - 1.0;
    texNormal = normalize(texNormal + hfNrm * 0.25 * closeUp);

    /* ── Construct final world normal ── */
    vec3 N = normalize(vWorldNormal + texNormal * 0.35);

    /* ── Slope-based darkening + roughness boost ── */
    float slope = 1.0 - abs(N.y);
    albedo *= mix(1.0, 0.68, smoothstep(0.3, 0.8, slope));
    roughness = clamp(roughness + slope * 0.15, 0.05, 1.0);

    /* ── Wetness near water bodies ── */
    float wetness = 0.0;
    // Near global water level
    wetness = max(wetness, smoothstep(20.0, 0.0, vElevation - uWaterLevel));
    // Near lakes
    for (int i = 0; i < MAX_LAKES; i++) {
      if (i >= uLakeCount) break;
      vec2 lc = uLakes[i].xy;
      vec2 lr = uLakes[i].zw;
      float dx = (vWorldPos.x - lc.x) / (lr.x * 1.5);
      float dz = (vWorldPos.z - lc.y) / (lr.y * 1.5);
      float ld = sqrt(dx*dx + dz*dz);
      wetness = max(wetness, smoothstep(1.3, 0.5, ld));
    }
    // Near river
    for (int i = 0; i < MAX_RIVER_PTS - 1; i++) {
      if (i >= uRiverPtCount - 1) break;
      vec2 a = uRiverPts[i], b = uRiverPts[i+1];
      vec2 ab = b - a;
      vec2 ap = vWorldPos.xz - a;
      float t2 = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
      vec2 closest = a + t2 * ab;
      float rd = length(vWorldPos.xz - closest);
      wetness = max(wetness, smoothstep(uRiverWidth * 4.0, uRiverWidth * 0.5, rd));
    }
    wetness = clamp(wetness, 0.0, 0.85);

    /* ── Close-up roughness variation for mineral grain feel ── */
    float microRough = triPlanar(uRmhAtlas, vWorldPos, uTexScale * 5.0, lo).r;
    roughness = mix(roughness, microRough, closeUp * 0.35);

    // Wet terrain: darker albedo, lower roughness, higher F0
    albedo *= mix(1.0, 0.65, wetness);
    roughness = mix(roughness, 0.05, wetness * 0.9);
    float wetF0boost = wetness * 0.08;

    /* ── PBR Cook-Torrance ── */
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);
    vec3 H = normalize(V + L);

    float NdotV = max(dot(N, V), 0.001);
    float NdotL = max(dot(N, L), 0.0);
    float NdotH = max(dot(N, H), 0.0);
    float HdotV = max(dot(H, V), 0.0);

    // Non-metal rock: F0 ≈ 0.04 — boosted near water
    vec3 F0 = vec3(0.04 + wetF0boost);

    float D = distributionGGX(NdotH, roughness);
    float G = geometrySmith(NdotV, NdotL, roughness);
    vec3  F = fresnelSchlick(HdotV, F0);

    vec3 specular = (D * G * F) / (4.0 * NdotV * NdotL + 0.001);
    vec3 kD = (1.0 - F) * (1.0 - 0.0); // metalness = 0

    vec3 Lo = (kD * albedo / PI + specular) * uSunColor * NdotL;

    // Ambient lighting with AO
    vec3 ambient = uAmbientColor * albedo * ao * 1.1;

    // Indirect specular approx (environment reflection)
    vec3 envColor = mix(uSunColor * 0.22, uAmbientColor * 0.6, roughness);
    vec3 envSpec = fresnelSchlick(NdotV, F0) * envColor * ao * (0.35 + wetness * 0.5);

    // Grazing-angle reflection — adds rim highlights on terrain edges
    float rimFresnel = pow(1.0 - NdotV, 4.0) * 0.15 * (1.0 + wetness * 2.0);
    vec3 rimColor = mix(uSkyColor, uSunColor, 0.35) * rimFresnel;

    vec3 color = ambient + Lo + envSpec + rimColor;

    /* ── Height-based micro-shadow (cavity occlusion) ── */
    float cavity = smoothstep(0.2, 0.5, heightVal);
    color *= mix(0.82, 1.0, cavity);

    /* ── Aerial perspective fog ── */
    float fogT = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    fogT = clamp(fogT, 0.0, 1.0);
    // Blend between near-fog (warm) and far-fog (cool atmospheric)
    vec3 fogColor = mix(uFogColorNear, uFogColorFar, smoothstep(0.0, 0.6, fogT));
    color = mix(color, fogColor, fogT);

    gl_FragColor = vec4(color, 1.0);
  }
`;function _C(n,e,t,i={}){const r=i.lakes||[],s=[];for(let c=0;c<5;c++)c<r.length?s.push(new Bt(r[c].cx,r[c].cz,r[c].rx,r[c].rz)):s.push(new Bt(0,0,0,0));const o=i.rivers||[],a=[],l=o.length>0?o[0].points:[];for(let c=0;c<11;c++)c<l.length?a.push(new le(l[c].x,l[c].z)):a.push(new le(0,0));return new Sn({uniforms:{uAlbedoAtlas:{value:n},uNormalAtlas:{value:e},uRmhAtlas:{value:t},uTexScale:{value:i.texScale??.018},uDetailScale:{value:i.detailScale??.06},uDetailStrength:{value:i.detailStrength??.35},uSunDir:{value:i.sunDir??new U(.75,.4,.45).normalize()},uSunColor:{value:i.sunColor??new Me(1,.96,.88)},uSkyColor:{value:i.skyColor??new Me(.55,.72,.88)},uAmbientColor:{value:i.ambient??new Me(.35,.38,.45)},uFogColorNear:{value:i.fogColorNear??new Me(.82,.86,.92)},uFogColorFar:{value:i.fogColorFar??new Me(.72,.8,.9)},uFogDensity:{value:i.fogDensity??28e-5},uWaterLevel:{value:i.waterLevel??38},uTime:{value:0},uLakes:{value:s},uLakeCount:{value:r.length},uRiverPts:{value:a},uRiverWidth:{value:o.length>0?o[0].width:18},uRiverPtCount:{value:l.length}},vertexShader:vC,fragmentShader:xC,side:mt})}const yC=`
  uniform float uTime;
  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vUV;

  /* Gerstner wave helper */
  vec3 gerstner(vec3 p, float t, vec2 dir, float freq, float amp, float steep) {
    float phase = dot(dir, p.xz) * freq + t;
    float s = sin(phase), c = cos(phase);
    return vec3(
      steep * amp * dir.x * c,
      amp * s,
      steep * amp * dir.y * c
    );
  }

  void main() {
    vec3 pos = position;
    float t = uTime;

    // 6 Gerstner waves for rich, detailed ocean surface
    vec3 w1 = gerstner(pos, t*0.8, normalize(vec2(1.0, 0.3)), 0.015, 0.55, 0.6);
    vec3 w2 = gerstner(pos, t*0.6, normalize(vec2(-0.3, 1.0)), 0.022, 0.40, 0.5);
    vec3 w3 = gerstner(pos, t*1.1, normalize(vec2(0.7, 0.7)), 0.035, 0.22, 0.4);
    vec3 w4 = gerstner(pos, t*0.9, normalize(vec2(-0.5, -0.8)), 0.045, 0.12, 0.35);
    vec3 w5 = gerstner(pos, t*1.3, normalize(vec2(0.4, -0.6)), 0.065, 0.07, 0.3);
    vec3 w6 = gerstner(pos, t*1.5, normalize(vec2(-0.8, 0.2)), 0.09, 0.04, 0.25);
    pos += w1 + w2 + w3 + w4 + w5 + w6;

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vUV = pos.xz * 0.001;

    // Wave normal from finite differences
    float eps = 2.0;
    vec3 px = position + vec3(eps,0,0);
    vec3 pz = position + vec3(0,0,eps);
    px += gerstner(px,t*0.8,normalize(vec2(1,0.3)),0.015,0.55,0.6)
        + gerstner(px,t*0.6,normalize(vec2(-0.3,1)),0.022,0.40,0.5)
        + gerstner(px,t*1.1,normalize(vec2(0.7,0.7)),0.035,0.22,0.4)
        + gerstner(px,t*0.9,normalize(vec2(-0.5,-0.8)),0.045,0.12,0.35)
        + gerstner(px,t*1.3,normalize(vec2(0.4,-0.6)),0.065,0.07,0.3)
        + gerstner(px,t*1.5,normalize(vec2(-0.8,0.2)),0.09,0.04,0.25);
    pz += gerstner(pz,t*0.8,normalize(vec2(1,0.3)),0.015,0.55,0.6)
        + gerstner(pz,t*0.6,normalize(vec2(-0.3,1)),0.022,0.40,0.5)
        + gerstner(pz,t*1.1,normalize(vec2(0.7,0.7)),0.035,0.22,0.4)
        + gerstner(pz,t*0.9,normalize(vec2(-0.5,-0.8)),0.045,0.12,0.35)
        + gerstner(pz,t*1.3,normalize(vec2(0.4,-0.6)),0.065,0.07,0.3)
        + gerstner(pz,t*1.5,normalize(vec2(-0.8,0.2)),0.09,0.04,0.25);
    vec3 T = normalize(px - pos);
    vec3 B = normalize(pz - pos);
    vWorldNormal = normalize(cross(B, T));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFogDepth = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,MC=`
  uniform vec3  uSunDir;
  uniform vec3  uSkyColor;
  uniform vec3  uDeepColor;
  uniform vec3  uShallowColor;
  uniform vec3  uFogColor;
  uniform float uFogDensity;
  uniform float uSubmerged;
  uniform float uTime;

  varying vec3  vWorldPos;
  varying vec3  vWorldNormal;
  varying float vFogDepth;
  varying vec2  vUV;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float vnoise(vec2 p) {
    vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);

    // Fresnel (Schlick) — F0=0.02 for water
    float cosTheta = max(dot(N, V), 0.0);
    float fresnel = 0.02 + 0.98 * pow(1.0 - cosTheta, 5.0);

    // Reflection color (sky + sun reflection)
    vec3 R = reflect(-V, N);
    float skyBlend = max(R.y, 0.0);
    vec3 reflColor = mix(uSkyColor * 0.8, uSkyColor * 1.3, skyBlend);

    // Triple sun specular — core, bloom, wide glow
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float spec1 = pow(NdH, 1024.0) * 5.0;
    float spec2 = pow(NdH, 256.0) * 1.5;
    float spec3 = pow(NdH, 48.0) * 0.3;
    reflColor += vec3(1.0, 0.97, 0.88) * (spec1 + spec2 + spec3);

    // Depth-based color (shallow vs deep)
    float depthFactor = smoothstep(0.0, 1.0, cosTheta);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthFactor * 0.5);

    // Subsurface scattering hint
    float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.18;
    waterBody += vec3(0.0, 0.15, 0.12) * sss;

    // Multi-octave caustic shimmer
    float c1 = vnoise(vWorldPos.xz * 0.03 + uTime * 0.3) * 0.08;
    float c2 = vnoise(vWorldPos.xz * 0.08 + uTime * 0.45 + vec2(5.3, 2.1)) * 0.05;
    float caustic = c1 + c2;
    waterBody += vec3(caustic * 0.5, caustic * 0.8, caustic);

    // Sun-lit diffuse
    float diff = max(dot(N, L), 0.0) * 0.12;
    waterBody += waterBody * diff;

    // Final blend
    vec3 color = mix(waterBody, reflColor, fresnel);

    // Fog
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    color = mix(color, uFogColor, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, mix(0.82, 0.25, uSubmerged));
  }
`;function SC(n){const e=new Wn(je*1.5,je*1.5,300,300);e.rotateX(-Math.PI/2);const t=new Sn({uniforms:{uTime:{value:0},uSunDir:{value:n??new U(.75,.4,.45).normalize()},uSkyColor:{value:new Me(.55,.72,.88)},uDeepColor:{value:new Me(.04,.18,.32)},uShallowColor:{value:new Me(.12,.42,.55)},uFogColor:{value:new Me(.784,.847,.91)},uFogDensity:{value:28e-5},uSubmerged:{value:0}},vertexShader:yC,fragmentShader:MC,transparent:!0,side:mt,depthWrite:!1}),i=new Ie(e,t);return i.position.y=nn,i.receiveShadow=!0,i.renderOrder=10,{mesh:i,material:t}}function wC(n,e){n!=null&&n.material&&(n.material.uniforms.uTime.value=e)}function EC(n,e){const t=new An;for(const i of n){let r=1/0;for(let c=0;c<Math.PI*2;c+=Math.PI/16){const u=i.cx+Math.cos(c)*i.rx*.92,f=i.cz+Math.sin(c)*i.rz*.92,h=e(u,f);h<r&&(r=h)}for(let c=0;c<Math.PI*2;c+=Math.PI/8){const u=i.cx+Math.cos(c)*i.rx*.5,f=i.cz+Math.sin(c)*i.rz*.5;e(u,f)}const s=r+1.8,o=new ao(1,96);o.rotateX(-Math.PI/2);const a=new Sn({uniforms:{uTime:{value:0},uSunDir:{value:new U(.75,.4,.45).normalize()},uSkyColor:{value:new Me(.55,.72,.88)},uDeepColor:{value:new Me(.02,.1,.2)},uShallowColor:{value:new Me(.08,.3,.38)}},vertexShader:`
        uniform float uTime;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vUV;

        /* Gerstner wave for lakes — smaller amplitude than ocean */
        vec3 gerstner(vec3 p, float t, vec2 dir, float freq, float amp, float steep) {
          float phase = dot(dir, p.xz) * freq + t;
          float s = sin(phase), c = cos(phase);
          return vec3(steep * amp * dir.x * c, amp * s, steep * amp * dir.y * c);
        }

        void main() {
          vec3 pos = position;
          vUV = pos.xz * 0.5 + 0.5;
          float t = uTime;

          // 5 Gerstner wave components for detailed lake surface
          vec3 w1 = gerstner(pos, t*0.7, normalize(vec2(1.0, 0.3)), 3.5, 0.06, 0.5);
          vec3 w2 = gerstner(pos, t*0.5, normalize(vec2(-0.3, 1.0)), 5.0, 0.04, 0.4);
          vec3 w3 = gerstner(pos, t*1.1, normalize(vec2(0.7, 0.7)), 7.0, 0.025, 0.35);
          vec3 w4 = gerstner(pos, t*0.9, normalize(vec2(-0.6, -0.5)), 9.0, 0.015, 0.3);
          vec3 w5 = gerstner(pos, t*1.3, normalize(vec2(0.2, -0.9)), 12.0, 0.01, 0.25);
          pos += w1 + w2 + w3 + w4 + w5;

          vec4 wp = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wp.xyz;

          // Wave normals from finite differences
          float eps = 0.05;
          vec3 px = position + vec3(eps,0,0);
          vec3 pz = position + vec3(0,0,eps);
          px += gerstner(px,t*0.7,normalize(vec2(1,0.3)),3.5,0.06,0.5)
              + gerstner(px,t*0.5,normalize(vec2(-0.3,1)),5.0,0.04,0.4)
              + gerstner(px,t*1.1,normalize(vec2(0.7,0.7)),7.0,0.025,0.35)
              + gerstner(px,t*0.9,normalize(vec2(-0.6,-0.5)),9.0,0.015,0.3)
              + gerstner(px,t*1.3,normalize(vec2(0.2,-0.9)),12.0,0.01,0.25);
          pz += gerstner(pz,t*0.7,normalize(vec2(1,0.3)),3.5,0.06,0.5)
              + gerstner(pz,t*0.5,normalize(vec2(-0.3,1)),5.0,0.04,0.4)
              + gerstner(pz,t*1.1,normalize(vec2(0.7,0.7)),7.0,0.025,0.35)
              + gerstner(pz,t*0.9,normalize(vec2(-0.6,-0.5)),9.0,0.015,0.3)
              + gerstner(pz,t*1.3,normalize(vec2(0.2,-0.9)),12.0,0.01,0.25);
          vec3 T = normalize(px - pos);
          vec3 B = normalize(pz - pos);
          vNorm = normalize(mat3(modelMatrix) * normalize(cross(B, T)));

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vFogD = length(mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uSunDir;
        uniform vec3 uSkyColor;
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vUV;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float vnoise(vec2 p) {
          vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }

        void main() {
          vec3 N = normalize(vNorm);
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(uSunDir);

          // Fresnel-Schlick (F0 = 0.02 for water)
          float cosT = max(dot(N, V), 0.0);
          float fresnel = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);

          // Sky reflection with sun specular
          vec3 R = reflect(-V, N);
          float skyBlend = max(R.y, 0.0);
          vec3 reflCol = mix(uSkyColor * 0.75, uSkyColor * 1.3, skyBlend);

          // Triple sun specular for realistic sun glitter
          vec3 H = normalize(L + V);
          float NdH = max(dot(N, H), 0.0);
          float spec1 = pow(NdH, 1024.0) * 5.0;  // hard core
          float spec2 = pow(NdH, 256.0) * 1.5;    // bloom
          float spec3 = pow(NdH, 48.0) * 0.3;     // wide glow
          reflCol += vec3(1.0, 0.97, 0.90) * (spec1 + spec2 + spec3);

          // Depth-based tint
          float edgeDist = length(vUV - 0.5) * 2.0;
          float depthFactor = smoothstep(0.0, 1.0, cosT);
          vec3 waterBody = mix(uDeepColor, uShallowColor, edgeDist * 0.5 + depthFactor * 0.3);

          // Multi-octave caustics
          float c1 = vnoise(vWorldPos.xz * 0.06 + uTime * 0.2) * 0.10;
          float c2 = vnoise(vWorldPos.xz * 0.12 + uTime * 0.35 + vec2(3.7, 1.2)) * 0.06;
          float caustic = c1 + c2;
          waterBody += vec3(caustic * 0.4, caustic * 0.7, caustic * 0.9);

          // Subsurface scattering
          float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.18;
          waterBody += vec3(0.0, 0.15, 0.12) * sss;

          // Sun-lit diffuse contribution
          float diff = max(dot(N, L), 0.0) * 0.12;
          waterBody += waterBody * diff;

          vec3 col = mix(waterBody, reflCol, fresnel);

          // Fog
          float fog = 1.0 - exp(-0.00028 * 0.00028 * vFogD * vFogD);
          col = mix(col, vec3(0.78, 0.85, 0.91), clamp(fog, 0.0, 1.0));
          gl_FragColor = vec4(col, 0.90);
        }
      `,transparent:!0,side:mt,depthWrite:!1}),l=new Ie(o,a);l.position.set(i.cx,s,i.cz),l.scale.set(i.rx*.95,1,i.rz*.95),l.receiveShadow=!0,l.renderOrder=11,l.userData={isLakeWater:!0},t.add(l)}return t}function Z0(n,e,t,i,r){const s=r*r,o=s*r;return .5*(2*e+(-n+t)*r+(2*n-5*e+4*t-i)*s+(-n+3*e-3*t+i)*o)}function TC(n,e=8){const t=[];for(let i=0;i<n.length-1;i++){const r=n[Math.max(0,i-1)],s=n[i],o=n[i+1],a=n[Math.min(n.length-1,i+2)];for(let l=0;l<e;l++){const c=l/e;t.push({x:Z0(r.x,s.x,o.x,a.x,c),z:Z0(r.z,s.z,o.z,a.z,c)})}}return t.push({x:n[n.length-1].x,z:n[n.length-1].z}),t}function AC(n,e){const t=new An;for(const i of n){const r=TC(i.points,8),s=[],o=[],a=[];let l=0;for(let h=0;h<r.length;h++){h>0&&(l+=Math.sqrt((r[h].x-r[h-1].x)**2+(r[h].z-r[h-1].z)**2));let p,v;h===0?(p=r[1].x-r[0].x,v=r[1].z-r[0].z):h===r.length-1?(p=r[h].x-r[h-1].x,v=r[h].z-r[h-1].z):(p=r[h+1].x-r[h-1].x,v=r[h+1].z-r[h-1].z);const _=Math.sqrt(p*p+v*v)||1;p/=_,v/=_;const m=-v,d=p,x=i.width*(.8+.2*Math.sin(l*.005)),g=r[h].x,M=r[h].z,E=e(g,M)+6;s.push(g+m*x,E,M+d*x),s.push(g-m*x,E,M-d*x);const S=l*.005;if(o.push(0,S,1,S),h<r.length-1){const b=h*2;a.push(b,b+1,b+2,b+1,b+3,b+2)}}const c=new kt;c.setAttribute("position",new ot(s,3)),c.setAttribute("uv",new ot(o,2)),c.setIndex(a),c.computeVertexNormals();const u=new Sn({uniforms:{uTime:{value:0},uSunDir:{value:new U(.75,.4,.45).normalize()},uSkyColor:{value:new Me(.55,.72,.88)},uDeepColor:{value:new Me(.03,.14,.25)}},vertexShader:`
        uniform float uTime;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vRiverUV;
        void main() {
          vec3 pos = position;
          vRiverUV = uv;
          // Multi-component flowing ripples
          float wave = sin(uv.y * 12.0 - uTime * 2.0) * 0.15
                     + sin(uv.y * 8.0 - uTime * 1.4 + uv.x * 3.0) * 0.08
                     + sin(uv.y * 18.0 - uTime * 2.8 + uv.x * 5.0) * 0.04
                     + sin(uv.y * 25.0 - uTime * 3.5) * 0.02;
          pos.y += wave;
          vec4 wp = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wp.xyz;
          vNorm = normalize(mat3(modelMatrix) * normal);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vFogD = length(mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uSunDir;
        uniform vec3 uSkyColor;
        uniform vec3 uDeepColor;
        varying vec3 vWorldPos;
        varying vec3 vNorm;
        varying float vFogD;
        varying vec2 vRiverUV;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float vnoise(vec2 p) {
          vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }

        void main() {
          vec3 N = normalize(vNorm);
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(uSunDir);

          float cosT = max(dot(N, V), 0.0);
          float fresnel = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);

          // Reflection with sun specular
          vec3 R = reflect(-V, N);
          vec3 reflCol = mix(uSkyColor * 0.75, uSkyColor * 1.3, max(R.y, 0.0));
          vec3 H = normalize(L + V);
          float NdH = max(dot(N, H), 0.0);
          float spec1 = pow(NdH, 1024.0) * 4.0;
          float spec2 = pow(NdH, 128.0) * 1.0;
          float spec3 = pow(NdH, 32.0) * 0.25;
          reflCol += vec3(1.0, 0.97, 0.9) * (spec1 + spec2 + spec3);

          // River body color with edge depth gradient
          vec3 shallowCol = vec3(0.06, 0.25, 0.32);
          float edgeFade = smoothstep(0.0, 0.3, min(vRiverUV.x, 1.0 - vRiverUV.x));
          vec3 waterBody = mix(shallowCol, uDeepColor, edgeFade * 0.6);

          // Multi-octave flow caustics
          float flow1 = vnoise(vec2(vRiverUV.y * 6.0 - uTime * 0.6, vRiverUV.x * 3.0)) * 0.10;
          float flow2 = vnoise(vec2(vRiverUV.y * 12.0 - uTime * 0.9, vRiverUV.x * 5.0)) * 0.05;
          float flow = flow1 + flow2;
          waterBody += vec3(flow * 0.3, flow * 0.6, flow * 0.8);

          // SSS
          float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.12;
          waterBody += vec3(0.0, 0.12, 0.10) * sss;

          vec3 col = mix(waterBody, reflCol, fresnel);

          // Fog
          float fog = 1.0 - exp(-0.00028 * 0.00028 * vFogD * vFogD);
          col = mix(col, vec3(0.78, 0.85, 0.91), clamp(fog, 0.0, 1.0));
          gl_FragColor = vec4(col, 0.88);
        }
      `,transparent:!0,side:mt,depthWrite:!1}),f=new Ie(c,u);f.receiveShadow=!0,f.renderOrder=11,f.userData={isRiverWater:!0},t.add(f)}return t}function J0(n,e){n&&n.children.forEach(t=>{t.material&&t.material.uniforms&&(t.material.uniforms.uTime.value=e)})}const CC=`
  varying vec3 vWorldDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldDir = normalize(wp.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,bC=`
  #define PI 3.14159265359
  uniform vec3  uSunDir;
  uniform float uTime;
  varying vec3  vWorldDir;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a*vnoise(p); p *= 2.1; a *= 0.48; }
    return v;
  }

  float rayleighPhase(float c) { return 0.75*(1.0+c*c); }
  float hgPhase(float c, float g) {
    float g2=g*g;
    return (1.0-g2)/(4.0*PI*pow(1.0+g2-2.0*g*c,1.5));
  }

  void main() {
    vec3 dir = normalize(vWorldDir);
    vec3 sun = normalize(uSunDir);
    float h = max(dir.y, 0.0);
    float cosT = dot(dir, sun);

    // Rayleigh sky
    vec3 zenith = vec3(0.18,0.38,0.78);
    vec3 horizon = vec3(0.72,0.82,0.94);
    vec3 sky = mix(horizon, zenith, pow(h, 0.45));

    // Sunset tint
    float sunsetMask = smoothstep(0.0,0.15,h)*(1.0-smoothstep(0.15,0.45,h));
    sky += vec3(1.0,0.55,0.25)*max(cosT,0.0)*max(cosT,0.0)*0.5*sunsetMask;

    // Mie glow
    sky += vec3(1.0,0.92,0.75)*hgPhase(cosT,0.76)*0.012;

    // Sun disc
    float sd = max(dot(dir, sun), 0.0);
    sky += vec3(1.0,0.97,0.9)*pow(sd,512.0)*4.0;
    sky += vec3(1.0,0.85,0.6)*pow(sd,32.0)*0.35;
    sky += vec3(1.0,0.7,0.4)*pow(sd,6.0)*0.15;

    // Ground
    if (dir.y < 0.0) {
      sky = mix(sky, vec3(0.48,0.55,0.58), smoothstep(0.0,-0.08,dir.y));
    }

    // Haze bands
    if (h > 0.0 && h < 0.2) {
      vec2 huv = dir.xz/max(dir.y,0.01)*2500.0*0.0001 + uTime*0.003;
      float haze = smoothstep(0.35,0.65,fbm(huv*2.0))*0.2;
      float hf = smoothstep(0.0,0.1,h)*(1.0-smoothstep(0.1,0.2,h));
      sky = mix(sky, vec3(0.9,0.92,0.95), haze*hf);
    }

    // Clouds
    if (dir.y > 0.01) {
      vec2 cuv = dir.xz/dir.y*4500.0*0.00012 + uTime*0.005;
      float c1 = fbm(cuv*3.0)-0.35;
      float c2 = fbm(cuv*6.0+vec2(3.7,1.2))-0.45;
      float cloud = clamp(smoothstep(0.0,0.35,c1)+smoothstep(0.0,0.25,c2)*0.3,0.0,1.0);
      float cLight = 0.7+0.3*max(sun.y,0.0);
      vec3 cColor = mix(vec3(0.6,0.65,0.72), vec3(cLight), smoothstep(0.0,0.5,c1));
      sky = mix(sky, cColor, cloud*0.6*smoothstep(0.01,0.18,dir.y));
    }

    gl_FragColor = vec4(sky, 1.0);
  }
`;function RC(n){const e=n??new U(.75,.4,.45).normalize(),t=new It(8e3,48,48),i=new Sn({uniforms:{uSunDir:{value:e},uTime:{value:0}},vertexShader:CC,fragmentShader:bC,side:pn,depthWrite:!1}),r=new Ie(t,i);r.renderOrder=-1;const s=6e3,o=new It(120,32,32),a=new ui({color:16775914,fog:!1}),l=new Ie(o,a);l.position.copy(e).multiplyScalar(s),l.renderOrder=-.5;const c=new It(300,32,32),u=new Sn({uniforms:{uColor:{value:new Me(1,.95,.8)}},vertexShader:`
      varying vec3 vNorm;
      varying vec3 vWorldPos;
      void main() {
        vNorm = normalize(normalMatrix * normal);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      varying vec3 vNorm;
      varying vec3 vWorldPos;
      void main() {
        vec3 V = normalize(cameraPosition - vWorldPos);
        float rim = 1.0 - max(dot(V, normalize(vNorm)), 0.0);
        float glow = pow(rim, 2.0) * 0.6;
        float core = pow(1.0 - rim, 8.0) * 0.4;
        float alpha = clamp(glow + core, 0.0, 0.7);
        gl_FragColor = vec4(uColor, alpha);
      }
    `,transparent:!0,side:pn,depthWrite:!1,fog:!1}),f=new Ie(c,u);f.position.copy(l.position),f.renderOrder=-.6;const h=new An;return h.add(r),h.add(l),h.add(f),{mesh:h,material:i,sunMesh:l,glowMesh:f}}function PC(n,e){n!=null&&n.material&&(n.material.uniforms.uTime.value=e)}function Q0(n,e,t,i,r){const s=r*r,o=s*r;return .5*(2*e+(-n+t)*r+(2*n-5*e+4*t-i)*s+(-n+3*e-3*t+i)*o)}let Fl=null;function p_(){return Fl||(Fl=Dc.map(n=>{const e=n.points,t=[];for(let i=0;i<e.length-1;i++){const r=e[Math.max(0,i-1)],s=e[i],o=e[i+1],a=e[Math.min(e.length-1,i+2)];for(let l=0;l<8;l++){const c=l/8;t.push({x:Q0(r.x,s.x,o.x,a.x,c),z:Q0(r.z,s.z,o.z,a.z,c)})}}return t.push({x:e[e.length-1].x,z:e[e.length-1].z}),{...n,densePoints:t}}),Fl)}const ct=new ft,gt=new U,vt=new Pr,xt=new U,ei=new U(0,1,0);function LC(n){const e=en+1;return(t,i)=>{const r=(t+je/2)/je*en,s=(i+je/2)/je*en,o=Math.max(0,Math.min(en-1,r|0)),a=Math.max(0,Math.min(en-1,s|0)),l=r-o,c=s-a;return n[a*e+o]*(1-l)*(1-c)+n[a*e+o+1]*l*(1-c)+n[(a+1)*e+o]*(1-l)*c+n[(a+1)*e+o+1]*l*c}}function On(n,e,t){const r=n(e+4,t),s=n(e-4,t),o=n(e,t+4),a=n(e,t-4);return Math.sqrt(((r-s)/(2*4))**2+((o-a)/(2*4))**2)}function Bn(n,e,t=10){for(const i of yo){const r=(n-i.cx)/(i.rx+t),s=(e-i.cz)/(i.rz+t);if(r*r+s*s<1)return!0}return!1}function Gn(n,e,t=12){for(const i of p_()){const r=i.width/2+t,s=i.densePoints;for(let o=0;o<s.length-1;o++){const a=s[o].x,l=s[o].z,c=s[o+1].x,u=s[o+1].z,f=c-a,h=u-l,p=f*f+h*h;let v=p>0?((n-a)*f+(e-l)*h)/p:0;v=Math.max(0,Math.min(1,v));const _=a+v*f,m=l+v*h;if(Math.sqrt((n-_)**2+(e-m)**2)<r)return!0}}return!1}function ni(n,e,t=10){const i=n-Ti.cx,r=e-Ti.cz;return Math.sqrt(i*i+r*r)<Ti.radius+t}function Ql(n,e){const t=n.vegetationDensity??0,i=Math.max(0,1-e*1.5);return Math.random()<t*i}function kl(n,e,t=60){for(const i of yo){const r=(n-i.cx)/(i.rx+t),s=(e-i.cz)/(i.rz+t);if(r*r+s*s<1)return!0}for(const i of p_()){const r=i.width/2+t,s=i.densePoints;for(let o=0;o<s.length-1;o++){const a=s[o].x,l=s[o].z,c=s[o+1].x,u=s[o+1].z,f=c-a,h=u-l,p=f*f+h*h;let v=p>0?((n-a)*f+(e-l)*h)/p:0;v=Math.max(0,Math.min(1,v));const _=a+v*f,m=l+v*h;if(Math.sqrt((n-_)**2+(e-m)**2)<r)return!0}}return!1}function DC(n,e){const t=new An,i=Na(777),r=LC(n);return NC(t,r,e,i),IC(t,r,e,i),UC(t,r),FC(t,r),kC(t,r,e,i),zC(t,r),OC(t,r),t}function NC(n,e,t,i){const s=new tn(.3,.6,8,8),o=new Ve({color:4007962,roughness:.95,metalness:0}),a=new is(5,7,12);a.translate(0,10,0);const l=new is(4,6,12);l.translate(0,13,0);const c=new is(2.8,5,12);c.translate(0,15.5,0);const u=eg([a,l,c]),f=new Ve({color:1722906,roughness:.85,metalness:0}),h=new dn(s,o,600),p=new dn(u,f,600);h.castShadow=!0,p.castShadow=!0,p.receiveShadow=!0;let v=0;for(let z=0;z<600*8&&v<600;z++){const B=(Math.random()-.5)*je*.9,$=(Math.random()-.5)*je*.9,se=e(B,$);if(se<nn+4||Bn(B,$,20)||Gn(B,$,20)||ni(B,$,15))continue;const Ce=On(e,B,$);if(Ce>.55)continue;const G=fa(se);if(!Ql(G,Ce)||i(B*.006,$*.006)<-.1||se<110&&Math.random()>.2)continue;const ue=.6+Math.random()*.8;gt.set(B,se-.5,$),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(ue,ue*(.85+Math.random()*.3),ue),ct.compose(gt,vt,xt),h.setMatrixAt(v,ct),p.setMatrixAt(v,ct);const _e=.85+Math.random()*.3;p.setColorAt(v,new Me(.1*_e,.29*_e*(.8+Math.random()*.4),.1*_e)),v++}h.count=v,p.count=v,h.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0,p.instanceColor&&(p.instanceColor.needsUpdate=!0),n.add(h,p);const _=450,m=new tn(.5,.9,5,8),d=new Ve({color:4863270,roughness:.92}),x=new It(5,12,8);x.translate(0,9,0);const g=new It(3.5,10,7);g.translate(2.5,10.5,1);const M=new It(3,10,7);M.translate(-2,10,-1.5);const T=new It(2.5,8,6);T.translate(.5,11.5,2);const E=eg([x,g,M,T]),S=new Ve({color:2976538,roughness:.82}),b=new dn(m,d,_),D=new dn(E,S,_);b.castShadow=!0,D.castShadow=!0,D.receiveShadow=!0;let y=0;for(let z=0;z<_*8&&y<_;z++){const B=(Math.random()-.5)*je*.88,$=(Math.random()-.5)*je*.88,se=e(B,$);if(se<nn+3||Bn(B,$,25)||Gn(B,$,15)||ni(B,$,15))continue;const Ce=On(e,B,$);if(Ce>.4)continue;const G=fa(se);if(!Ql(G,Ce)||i(B*.008,$*.008)<0||se>170&&Math.random()>.2)continue;const ue=.5+Math.random()*.7;gt.set(B,se-.3,$),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(ue,ue*(.8+Math.random()*.4),ue),ct.compose(gt,vt,xt),b.setMatrixAt(y,ct),D.setMatrixAt(y,ct);const _e=.7+Math.random()*.6;D.setColorAt(y,new Me(.18*_e*(.7+Math.random()*.6),.42*_e,.1*_e)),y++}b.count=y,D.count=y,b.instanceMatrix.needsUpdate=!0,D.instanceMatrix.needsUpdate=!0,D.instanceColor&&(D.instanceColor.needsUpdate=!0),n.add(b,D);const A=250,j=new tn(.2,.35,9,8),J=new Ve({color:15260872,roughness:.6,metalness:0}),I=new It(3.5,10,8);I.translate(0,11,0),I.scale(.8,1.2,.8);const X=new Ve({color:5942069,roughness:.8,transparent:!0,opacity:.92}),H=new dn(j,J,A),Q=new dn(I,X,A);H.castShadow=!0,Q.castShadow=!0;let k=0;for(let z=0;z<A*8&&k<A;z++){const B=(Math.random()-.5)*je*.85,$=(Math.random()-.5)*je*.85,se=e(B,$);if(se<nn+5||Bn(B,$,18)||Gn(B,$,15)||ni(B,$,10))continue;const Ce=On(e,B,$);if(Ce>.35)continue;const G=fa(se);if(!Ql(G,Ce)||!yo.some(we=>{const Ee=(B-we.cx)/(we.rx*2),Oe=($-we.cz)/(we.rz*2);return Ee*Ee+Oe*Oe<1})&&Math.random()>.3)continue;const ue=.5+Math.random()*.5;gt.set(B,se-.3,$),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(ue,ue*(.9+Math.random()*.3),ue),ct.compose(gt,vt,xt),H.setMatrixAt(k,ct),Q.setMatrixAt(k,ct);const _e=.8+Math.random()*.4;Q.setColorAt(k,new Me(.35*_e,.67*_e,.2*_e)),k++}H.count=k,Q.count=k,H.instanceMatrix.needsUpdate=!0,Q.instanceMatrix.needsUpdate=!0,Q.instanceColor&&(Q.instanceColor.needsUpdate=!0),n.add(H,Q)}function IC(n,e,t,i){const s=new It(2,10,6);s.scale(1,.65,1);const o=new Ve({color:3042840,roughness:.9}),a=new dn(s,o,2500);a.castShadow=!0;let l=0;for(let c=0;c<2500*6&&l<2500;c++){const u=(Math.random()-.5)*je*.88,f=(Math.random()-.5)*je*.88,h=e(u,f);if(h<nn+2||Bn(u,f,8)||Gn(u,f,10)||ni(u,f,5))continue;const p=On(e,u,f),v=fa(h);if(!Ql(v,p)||i(u*.015,f*.015)<-.3)continue;const _=1.5+Math.random()*3;gt.set(u,h-.3,f),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(_,_*(.5+Math.random()*.5),_*(.8+Math.random()*.4)),ct.compose(gt,vt,xt),a.setMatrixAt(l,ct);const m=.6+Math.random()*.8;a.setColorAt(l,new Me(.18*m,.43*m,.12*m)),l++}a.count=l,a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),n.add(a)}function UC(n,e,t,i){const s=new Bd(1,1),o=new Ve({color:9077632,roughness:.92,metalness:.02}),a=new dn(s,o,500);a.castShadow=!0,a.receiveShadow=!0;let l=0;for(let c=0;c<500*6&&l<500;c++){const u=(Math.random()-.5)*je*.9,f=(Math.random()-.5)*je*.9,h=e(u,f);if(h<nn+1||Bn(u,f,5)||Gn(u,f,10)||ni(u,f,0)||On(e,u,f)<.15&&Math.random()>.12)continue;const v=1+Math.random()*4;gt.set(u,h-v*.3,f),vt.set(Math.random()-.5,Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),xt.set(v,v*(.4+Math.random()*.6),v*(.7+Math.random()*.6)),ct.compose(gt,vt,xt),a.setMatrixAt(l,ct);const _=.35+Math.random()*.3;a.setColorAt(l,new Me(_*.95,_*.93,_*.88)),l++}a.count=l,a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),n.add(a)}function FC(n,e){const t=Ti.cx,i=Ti.cz,r=Math.PI*.15,s=Math.cos(r),o=Math.sin(r);function a(W,O){return{x:t+W*s-O*o,z:i+W*o+O*s}}const l=new l_;l.moveTo(-.6,0),l.lineTo(0,.5),l.lineTo(.6,0),l.closePath();const c=new Gd(l,{depth:1.1,bevelEnabled:!1});c.translate(0,0,-.55);const u=[{lx:0,lz:0,w:14,d:11,h:7.5,wallCol:13943976,roofCol:8010542,chimney:!0,label:"Farmhouse"},{lx:-28,lz:18,w:9,d:7,h:5.5,wallCol:14734784,roofCol:5916218,chimney:!0,label:"Cottage A"},{lx:-28,lz:-8,w:8,d:6.5,h:4.8,wallCol:13156264,roofCol:6966846,chimney:!1,label:"Cottage B"},{lx:38,lz:0,w:24,d:15,h:10,wallCol:9127187,roofCol:4861984,chimney:!1,label:"Barn"},{lx:18,lz:32,w:10,d:7,h:4.2,wallCol:10522730,roofCol:6049856,chimney:!1,label:"Workshop"},{lx:-14,lz:-32,w:9,d:6,h:3.8,wallCol:10390894,roofCol:5918784,chimney:!1,label:"Storage"}],f=new Ve({color:8960989,roughness:.25,metalness:.15}),h=new Ve({color:4861984,roughness:.88});for(const W of u){const O=a(W.lx,W.lz),ie=e(O.x,O.z),ne=new _n(W.w,W.h,W.d),ge=new Ve({color:W.wallCol,roughness:.82}),pe=new Ie(ne,ge);pe.position.set(O.x,ie+W.h/2,O.z),pe.rotation.y=r,pe.castShadow=!0,pe.receiveShadow=!0,n.add(pe);const Se=new _n(W.w+.8,.6,W.d+.8),ke=new Ve({color:7039072,roughness:.9}),P=new Ie(Se,ke);P.position.set(O.x,ie+.3,O.z),P.rotation.y=r,P.receiveShadow=!0,n.add(P);const w=c.clone(),q=new Ve({color:W.roofCol,roughness:.75}),ee=new Ie(w,q);ee.position.set(O.x,ie+W.h,O.z),ee.rotation.y=r,ee.scale.set(W.w*1.15,W.h*.65,W.d*1.08),ee.castShadow=!0,n.add(ee);const ce=new _n(W.w*.14,W.h*.42,.2),re=new Ie(ce,h);re.position.set(O.x+s*W.d*.51,ie+W.h*.21,O.z+o*W.d*.51),re.rotation.y=r,n.add(re);for(let Ne=-1;Ne<=1;Ne+=2)for(let Pe=-1;Pe<=1;Pe+=2){const fe=new _n(W.w*.09,W.h*.18,.12),xe=new Ie(fe,f),Be=o*(W.w*.25*Ne),ve=-s*(W.w*.25*Ne),Et=s*(W.d*.51*Pe),Xe=o*(W.d*.51*Pe);xe.position.set(O.x+Be+Et*.3,ie+W.h*.62,O.z+ve+Xe*.3),xe.rotation.y=r+(Ne>0?Math.PI/2:-Math.PI/2),n.add(xe)}if(W.chimney){const Ne=new _n(1.1,3.2,1.1),Pe=new Ve({color:7035727,roughness:.88}),fe=new Ie(Ne,Pe);fe.position.set(O.x+s*W.w*.25-o*W.d*.2,ie+W.h+W.h*.3,O.z+o*W.w*.25+s*W.d*.2),fe.castShadow=!0,n.add(fe)}}for(let W=0;W<2;W++){const O=a(52+W*10,-8),ie=e(O.x,O.z),ne=new tn(3,3.5,13,16),ge=new Ve({color:11184276,roughness:.65,metalness:.12}),pe=new Ie(ne,ge);pe.position.set(O.x,ie+6.5,O.z),pe.castShadow=!0,n.add(pe);const Se=new It(3,16,8,0,Math.PI*2,0,Math.PI/2),ke=new Ve({color:8947840,roughness:.55,metalness:.18}),P=new Ie(Se,ke);P.position.set(O.x,ie+13,O.z),n.add(P)}const p=new Ve({color:13150280,roughness:.92}),v=new tn(1.8,1.8,2.5,12);v.rotateZ(Math.PI/2);const _=[{lx:30,lz:-22},{lx:34,lz:-24},{lx:32,lz:-18},{lx:28,lz:-26},{lx:36,lz:-20},{lx:38,lz:-26},{lx:26,lz:-22},{lx:40,lz:-22}];for(const W of _){const O=a(W.lx,W.lz),ie=e(O.x,O.z),ne=new Ie(v,p);ne.position.set(O.x,ie+1.3,O.z),ne.rotation.y=r+(Math.random()-.5)*.4,ne.castShadow=!0,n.add(ne)}const m=a(8,20),d=e(m.x,m.z),x=new _n(6,1.2,3),g=new Ve({color:5918789,roughness:.85}),M=new Ie(x,g);M.position.set(m.x,d+.6,m.z),M.rotation.y=r,n.add(M);const T=new _n(5.4,.3,2.4),E=new Ve({color:2775658,roughness:.05,metalness:.3,transparent:!0,opacity:.8}),S=new Ie(T,E);S.position.set(m.x,d+1,m.z),S.rotation.y=r,n.add(S);const b=15,D=-25,y=30,A=20,j=new tn(.12,.18,2.2,6),J=new Ve({color:7032880,roughness:.9}),I=new _n(1,.1,.08),X=[a(b-y/2,D-A/2),a(b+y/2,D-A/2),a(b+y/2,D+A/2),a(b-y/2,D+A/2)];for(let W=0;W<4;W++){const O=X[W],ie=X[(W+1)%4],ne=6;for(let w=0;w<=ne;w++){const q=w/ne,ee=O.x+(ie.x-O.x)*q,ce=O.z+(ie.z-O.z)*q,re=e(ee,ce),Ne=new Ie(j,J);Ne.position.set(ee,re+1.1,ce),Ne.castShadow=!0,n.add(Ne)}const ge=(O.x+ie.x)/2,pe=(O.z+ie.z)/2,Se=e(ge,pe),ke=Math.sqrt((ie.x-O.x)**2+(ie.z-O.z)**2),P=Math.atan2(ie.z-O.z,ie.x-O.x);for(let w=0;w<2;w++){const q=new Ie(I,J);q.scale.set(ke,1,1),q.position.set(ge,Se+.7+w*.7,pe),q.rotation.y=P,n.add(q)}}const H=new tn(.15,.2,2.5,6),Q=new Ve({color:7032880,roughness:.9}),k=new _n(1,.1,.08),z=80,B=40;for(let W=0;W<B;W++){const O=W/B*Math.PI*2,ie=(W+1)/B*Math.PI*2,ne=t+Math.cos(O)*z,ge=i+Math.sin(O)*z,pe=e(ne,ge),Se=new Ie(H,Q);Se.position.set(ne,pe+1.25,ge),Se.castShadow=!0,n.add(Se);const ke=t+Math.cos(ie)*z,P=i+Math.sin(ie)*z,w=e(ke,P),q=(ne+ke)/2,ee=(ge+P)/2,ce=(pe+w)/2,re=Math.sqrt((ke-ne)**2+(P-ge)**2),Ne=Math.atan2(P-ge,ke-ne);for(let Pe=0;Pe<2;Pe++){const fe=new Ie(k,Q);fe.scale.set(re,1,1),fe.position.set(q,ce+.8+Pe*.7,ee),fe.rotation.y=Ne,n.add(fe)}}const $=[{lx:-55,lz:-15,w:32,d:28,col:5934128},{lx:-55,lz:22,w:28,d:22,col:9083440},{lx:10,lz:-55,w:36,d:22,col:7052856},{lx:10,lz:52,w:30,d:18,col:10522682}];for(const W of $){const O=a(W.lx,W.lz),ie=e(O.x,O.z),ne=new Wn(W.w,W.d);ne.rotateX(-Math.PI/2);const ge=new Ve({color:W.col,roughness:.92,side:mt}),pe=new Ie(ne,ge);pe.position.set(O.x,ie+.12,O.z),pe.rotation.y=r,pe.receiveShadow=!0,n.add(pe);const Se=new Ve({color:new Me(W.col).multiplyScalar(.75),roughness:.88}),ke=new _n(W.w*.88,.6,.35),P=Math.floor(W.d/2.8);for(let w=0;w<P;w++){const q=W.lz-W.d/2+(w+.5)*(W.d/P),ee=a(W.lx,q),ce=e(ee.x,ee.z),re=new Ie(ke,Se);re.position.set(ee.x,ce+.42,ee.z),re.rotation.y=r,n.add(re)}}const se=new Ve({color:10522736,roughness:.95}),Ce=[{lx:0,lz:0,len:z*.95,dir:"forward"},{lx:0,lz:0,len:50,dir:"side"}];for(const W of Ce){const O=new Wn(3.5,W.len);O.rotateX(-Math.PI/2);const ie=a(W.lx,W.lz+W.len*.4),ne=e(ie.x,ie.z),ge=new Ie(O,se);ge.position.set(ie.x,ne+.06,ie.z),ge.rotation.y=r+(W.dir==="side"?0:Math.PI/2),ge.receiveShadow=!0,n.add(ge)}const G=a(-42,-30),oe=e(G.x,G.z),ue=new tn(1.5,2.5,16,8),_e=new Ve({color:13156528,roughness:.8}),we=new Ie(ue,_e);we.position.set(G.x,oe+8,G.z),we.castShadow=!0,n.add(we);const Ee=new is(2.2,3,8),Oe=new Ve({color:5917242,roughness:.85}),Re=new Ie(Ee,Oe);Re.position.set(G.x,oe+17.5,G.z),Re.castShadow=!0,n.add(Re);const N=new Ve({color:13682872,roughness:.7,side:mt});for(let W=0;W<4;W++){const O=new Wn(1.5,10),ie=new Ie(O,N),ne=W/4*Math.PI*2;ie.position.set(G.x+Math.cos(r)*.5,oe+16+Math.sin(ne)*5,G.z+Math.sin(r)*.5+Math.cos(ne)*5),ie.rotation.x=ne,ie.rotation.y=r,ie.castShadow=!0,n.add(ie)}}function kC(n,e,t,i){const s=new It(1,8,6);s.scale(1.2,.4,1);const o=new Ve({color:3825192,roughness:.92}),a=new dn(s,o,500);a.castShadow=!0;let l=0;for(let M=0;M<500*8&&l<500;M++){const T=(Math.random()-.5)*je*.88,E=(Math.random()-.5)*je*.88,S=e(T,E);if(S<130||S<nn+5||Bn(T,E,10)||Gn(T,E,10)||ni(T,E,10)||On(e,T,E)>.7||i(T*.01,E*.01)<-.1)continue;const y=.5+Math.random()*1.5;gt.set(T,S-.15,E),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(y,y*(.3+Math.random()*.4),y*(.8+Math.random()*.4)),ct.compose(gt,vt,xt),a.setMatrixAt(l,ct);const A=.5+Math.random()*.6;a.setColorAt(l,new Me(.22*A,.37*A,.15*A)),l++}a.count=l,a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),n.add(a);const c=400,u=new It(.3,6,4);u.scale(1,.6,1);const f=new Ve({color:16777215,roughness:.8}),h=new dn(u,f,c);let p=0;for(let M=0;M<c*8&&p<c;M++){const T=(Math.random()-.5)*je*.85,E=(Math.random()-.5)*je*.85,S=e(T,E);if(S<120||S<nn+5||Bn(T,E,8)||Gn(T,E,8)||ni(T,E,5)||On(e,T,E)>.5)continue;const D=.4+Math.random()*.8;gt.set(T,S+.1,E),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(D,D,D),ct.compose(gt,vt,xt),h.setMatrixAt(p,ct);const y=[new Me(.6,.3,.7),new Me(.9,.8,.2),new Me(.9,.9,.85),new Me(.8,.4,.5),new Me(.3,.5,.8)];h.setColorAt(p,y[Math.floor(Math.random()*y.length)]),p++}h.count=p,h.instanceMatrix.needsUpdate=!0,h.instanceColor&&(h.instanceColor.needsUpdate=!0),n.add(h);const v=800,_=new Wn(.5,1.2,1,2),m=_.attributes.position;for(let M=0;M<m.count;M++){const T=m.getY(M);T>.3&&(m.setZ(M,m.getZ(M)+.1),m.setY(M,T*.95))}_.translate(0,.6,0);const d=new Ve({color:5929536,roughness:.88,side:mt}),x=new dn(_,d,v);x.receiveShadow=!0;let g=0;for(let M=0;M<v*4&&g<v;M++){const T=(Math.random()-.5)*je*.88,E=(Math.random()-.5)*je*.88,S=e(T,E);if(S<125||S<nn+4||Bn(T,E,5)||Gn(T,E,8)||ni(T,E,5)||On(e,T,E)>.65)continue;const D=.5+Math.random()*1.4;gt.set(T,S,E),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(D*(.8+Math.random()*.4),D,D*(.8+Math.random()*.4)),ct.compose(gt,vt,xt),x.setMatrixAt(g,ct);const y=.4+Math.random()*.6;x.setColorAt(g,new Me(.35*y,.5*y,.25*y)),g++}x.count=g,x.instanceMatrix.needsUpdate=!0,x.instanceColor&&(x.instanceColor.needsUpdate=!0),n.add(x)}function zC(n,e,t,i){const s=new Wn(1.2,2.5,1,2),o=s.attributes.position;for(let D=0;D<o.count;D++){const y=o.getY(D);y>.5&&(o.setZ(D,o.getZ(D)+.2),o.setY(D,y*.9))}s.translate(0,1.25,0);const a=new Ve({color:4037423,roughness:.85,side:mt}),l=new dn(s,a,600);l.receiveShadow=!0;let c=0;for(let D=0;D<600*6&&c<600;D++){const y=(Math.random()-.5)*je*.88,A=(Math.random()-.5)*je*.88,j=e(y,A);if(j<nn+1.5||Bn(y,A,5)||Gn(y,A,8)||ni(y,A,5)||!kl(y,A,55)||On(e,y,A)>.4)continue;const I=.5+Math.random()*1.2;gt.set(y,j,A),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(I*(.8+Math.random()*.4),I,I*(.8+Math.random()*.4)),ct.compose(gt,vt,xt),l.setMatrixAt(c,ct);const X=.6+Math.random()*.5;l.setColorAt(c,new Me(.24*X,.61*X,.18*X)),c++}l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0),n.add(l);const u=500,f=new It(.25,6,4);f.scale(1,.5,1);const h=new Ve({color:16777215,roughness:.75}),p=new dn(f,h,u);let v=0;for(let D=0;D<u*6&&v<u;D++){const y=(Math.random()-.5)*je*.88,A=(Math.random()-.5)*je*.88,j=e(y,A);if(j<nn+2||Bn(y,A,8)||Gn(y,A,10)||ni(y,A,5)||!kl(y,A,45)||On(e,y,A)>.35)continue;const I=.3+Math.random()*.6;gt.set(y,j+.15,A),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(I,I,I),ct.compose(gt,vt,xt),p.setMatrixAt(v,ct);const X=[new Me(.85,.2,.3),new Me(.9,.75,.1),new Me(.95,.95,.9),new Me(.7,.3,.65),new Me(.3,.4,.85),new Me(.9,.5,.2)];p.setColorAt(v,X[Math.floor(Math.random()*X.length)]),v++}p.count=v,p.instanceMatrix.needsUpdate=!0,p.instanceColor&&(p.instanceColor.needsUpdate=!0),n.add(p);const _=300,m=new tn(.08,.12,3,4);m.translate(0,1.5,0);const d=new Ve({color:5929528,roughness:.9}),x=new dn(m,d,_);x.castShadow=!0;let g=0;for(let D=0;D<_*8&&g<_;D++){const y=(Math.random()-.5)*je*.88,A=(Math.random()-.5)*je*.88,j=e(y,A);if(j<nn+.5||Bn(y,A,0)||Gn(y,A,0)||!kl(y,A,18)||On(e,y,A)>.3)continue;const I=.6+Math.random()*.8;gt.set(y,j,A),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(I*.5,I,I*.5),ct.compose(gt,vt,xt),x.setMatrixAt(g,ct);const X=.6+Math.random()*.4;x.setColorAt(g,new Me(.35*X,.48*X,.22*X)),g++}x.count=g,x.instanceMatrix.needsUpdate=!0,x.instanceColor&&(x.instanceColor.needsUpdate=!0),n.add(x);const M=300,T=new It(1.3,8,6);T.scale(1,.7,1);const E=new Ve({color:3045918,roughness:.88}),S=new dn(T,E,M);S.castShadow=!0;let b=0;for(let D=0;D<M*6&&b<M;D++){const y=(Math.random()-.5)*je*.88,A=(Math.random()-.5)*je*.88,j=e(y,A);if(j<nn+2||Bn(y,A,10)||Gn(y,A,12)||ni(y,A,8)||!kl(y,A,50)||On(e,y,A)>.35)continue;const I=.6+Math.random()*1.8;gt.set(y,j-.2,A),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(I,I*(.5+Math.random()*.4),I*(.8+Math.random()*.4)),ct.compose(gt,vt,xt),S.setMatrixAt(b,ct);const X=.6+Math.random()*.5;S.setColorAt(b,new Me(.18*X,.49*X,.12*X)),b++}S.count=b,S.instanceMatrix.needsUpdate=!0,S.instanceColor&&(S.instanceColor.needsUpdate=!0),n.add(S)}function OC(n,e,t,i){const s=new Wn(.5,1.2,1,2),o=s.attributes.position;for(let u=0;u<o.count;u++){const f=o.getY(u);f>.3&&(o.setZ(u,o.getZ(u)+.1),o.setY(u,f*.95))}s.translate(0,.6,0);const a=new Ve({color:4883760,roughness:.88,side:mt}),l=new dn(s,a,9e3);l.receiveShadow=!0;let c=0;for(let u=0;u<9e3*4&&c<9e3;u++){const f=(Math.random()-.5)*je*.88,h=(Math.random()-.5)*je*.88,p=e(f,h);if(p<nn+2||Bn(f,h,5)||Gn(f,h,10)||ni(f,h,5)||On(e,f,h)>.6||p>240&&Math.random()>.3)continue;const _=.5+Math.random()*1.8;gt.set(f,p,h),vt.setFromAxisAngle(ei,Math.random()*Math.PI*2),xt.set(_*(.8+Math.random()*.4),_,_*(.8+Math.random()*.4)),ct.compose(gt,vt,xt),l.setMatrixAt(c,ct);const m=.35+Math.random()*.8;l.setColorAt(c,new Me(.28*m,.53*m,.18*m)),c++}l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0),n.add(l)}function eg(n){let e=0,t=0;for(const c of n)e+=c.attributes.position.count,t+=c.index?c.index.count:c.attributes.position.count;const i=new Float32Array(e*3),r=new Float32Array(e*3),s=new Uint32Array(t);let o=0,a=0;for(const c of n){c.computeVertexNormals();const u=c.attributes.position.array,f=c.attributes.normal.array;if(i.set(u,o*3),r.set(f,o*3),c.index){for(let h=0;h<c.index.count;h++)s[a+h]=c.index.array[h]+o;a+=c.index.count}else{for(let h=0;h<u.length/3;h++)s[a+h]=o+h;a+=u.length/3}o+=u.length/3}const l=new kt;return l.setAttribute("position",new ot(i,3)),l.setAttribute("normal",new ot(r,3)),l.setIndex(new Hn(s,1)),l}function BC(n){const e=new Wn(2,2),t=new Ie(e,n);return t.frustumCulled=!1,t}const GC=`
  varying vec2 vUV;
  void main() {
    vUV = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,VC=`
  uniform sampler2D tDepth;
  uniform sampler2D tColor;
  uniform vec2 uResolution;
  uniform float uRadius;
  uniform float uIntensity;
  uniform mat4  uProjectionInverse;
  uniform float uNear;
  uniform float uFar;

  varying vec2 vUV;

  float linearizeDepth(float d) {
    return uNear * uFar / (uFar - d * (uFar - uNear));
  }

  // Hash for kernel rotation
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec4 baseColor = texture2D(tColor, vUV);
    float depth = texture2D(tDepth, vUV).r;

    if (depth >= 1.0) {
      gl_FragColor = baseColor;
      return;
    }

    float linearD = linearizeDepth(depth);
    vec2 texelSize = 1.0 / uResolution;

    // Distance-adaptive radius
    float adaptiveRadius = uRadius / linearD;

    float occlusion = 0.0;
    float sampleCount = 0.0;

    // 12-tap rotated kernel
    float angle = hash(vUV * uResolution) * 6.283;
    float ca = cos(angle), sa = sin(angle);
    mat2 rot = mat2(ca, -sa, sa, ca);

    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      float r = (fi + 0.5) / 12.0;
      float theta = fi * 2.3998632; // golden angle
      vec2 offset = vec2(cos(theta), sin(theta)) * r;
      offset = rot * offset * adaptiveRadius * texelSize * 24.0;

      float sampleDepth = texture2D(tDepth, vUV + offset).r;
      float sampleLinear = linearizeDepth(sampleDepth);

      float diff = linearD - sampleLinear;
      float rangeFalloff = smoothstep(0.0, 1.0, uRadius * 2.0 / (abs(diff) + 0.001));
      occlusion += step(0.02, diff) * rangeFalloff;
      sampleCount += 1.0;
    }

    occlusion = 1.0 - (occlusion / sampleCount) * uIntensity;
    occlusion = clamp(occlusion, 0.0, 1.0);
    // Soft AO application
    occlusion = occlusion * 0.5 + 0.5;

    gl_FragColor = vec4(baseColor.rgb * occlusion, baseColor.a);
  }
`;function HC(n,e){const t=n.getSize(new le),i=t.x,r=t.y,s=new Rr(i,r,{minFilter:Zt,magFilter:Zt,format:kn,type:bi});s.depthTexture=new Ud(i,r),s.depthTexture.type=Wi;const o=new Sn({uniforms:{tColor:{value:s.texture},tDepth:{value:s.depthTexture},uResolution:{value:new le(i,r)},uRadius:{value:5},uIntensity:{value:.6},uProjectionInverse:{value:e.projectionMatrixInverse},uNear:{value:e.near},uFar:{value:e.far}},vertexShader:GC,fragmentShader:VC,depthTest:!1,depthWrite:!1}),a=new t_,l=new Nd(-1,1,1,-1,0,1);a.add(BC(o));function c(f,h){s.setSize(f,h),o.uniforms.uResolution.value.set(f,h),o.uniforms.uNear.value=e.near,o.uniforms.uFar.value=e.far}function u(f,h){n.setRenderTarget(s),n.render(f,e),o.uniforms.uProjectionInverse.value.copy(e.projectionMatrixInverse),n.setRenderTarget(null),n.render(a,l)}return{colorTarget:s,ssaoMaterial:o,resize:c,compose:u}}class WC{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.terrain=null,this.terrainMat=null,this.water=null,this.atmosphere=null,this.vegetation=null,this.heightMap=null,this.noise=null,this.noiseB=null,this.clock=new $A,this.raycaster=new KA,this.mouse=new le,this.markersGroup=new An,this.hoverMarker=null,this.sunLight=null,this._sunDir=new U(.75,.4,.45).normalize(),this._postFX=null,this.activeTool="navigate",this._measurePoints=[],this._measureMarkers=[],this._measureLine=null,this._crossSectionPoints=[],this._crossSectionMarkers=[],this._crossSectionLine=null,this._strikeDipMarkers=[],this._animatedMarkers=[],this._hoverCbs=[],this._clickCbs=[],this._markerClickCbs=[],this._animId=null,this._disposed=!1}init(e,t){this.renderer=new e_({antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=wx,this.renderer.toneMapping=Tx,this.renderer.toneMappingExposure=1.15,this.renderer.outputColorSpace=hi,e.appendChild(this.renderer.domElement),this.scene=new t_,this.scene.fog=new Fd(13162728,28e-5),this.camera=new Jn(60,e.clientWidth/e.clientHeight,1,2e4),this.camera.position.set(-400,350,700),this.controls=new JA(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.maxDistance=5e3,this.controls.minDistance=5,this.controls.maxPolarAngle=Math.PI*.95,this.controls.minPolarAngle=.05,this.controls.enablePan=!0,this.controls.panSpeed=1.2,this.controls.screenSpacePanning=!0,this.controls.keyPanSpeed=20,this.controls.mouseButtons={LEFT:Bi.ROTATE,MIDDLE:Bi.DOLLY,RIGHT:Bi.PAN},this.controls.touches={ONE:lr.ROTATE,TWO:lr.DOLLY_PAN},this.controls.target.set(0,80,0),t==null||t(5,"Setting up lighting…"),this._setupLighting(),t==null||t(10,"Generating PBR textures…");const{albedoAtlas:i,normalAtlas:r,rmhAtlas:s}=gC();t==null||t(20,"Creating atmosphere…"),this.atmosphere=RC(this._sunDir),this.scene.add(this.atmosphere.mesh),t==null||t(25,"Building heightmap…"),this.noise=Na(42),this.noiseB=Na(137),this.heightMap=oC(this.noise,this.noiseB),t==null||t(35,"Simulating erosion…"),lC(this.heightMap,en+1,38e3),t==null||t(50,"Constructing terrain…");const o=aC(this.noise,this.heightMap);this.terrainMat=_C(i,r,s,{sunDir:this._sunDir,fogColorNear:new Me(.82,.86,.92),fogColorFar:new Me(.72,.8,.9),fogDensity:28e-5,lakes:yo,rivers:Dc,waterLevel:nn}),this.terrain=new Ie(o,this.terrainMat),this.terrain.castShadow=!0,this.terrain.receiveShadow=!0,this.scene.add(this.terrain),t==null||t(65,"Creating water…"),this.water=SC(this._sunDir),this.scene.add(this.water.mesh),t==null||t(70,"Creating lake surfaces…");const a=(l,c)=>Jo(this.heightMap,l,c);this.lakeWater=EC(yo,a),this.scene.add(this.lakeWater),t==null||t(72,"Creating river…"),this.riverWater=AC(Dc,a),this.scene.add(this.riverWater),t==null||t(75,"Planting vegetation…"),this.vegetation=DC(this.heightMap,this.noise),this.scene.add(this.vegetation),t==null||t(80,"Setting up SSAO…");try{this._postFX=HC(this.renderer,this.camera)}catch(l){console.warn("SSAO not available, falling back to direct render:",l),this._postFX=null}t==null||t(85,"Preparing tools…"),this.scene.add(this.markersGroup),this._createHoverMarker(),this._setupDOMEvents(e),this._container=e,this._onResize=()=>{var u;const l=e.clientWidth,c=e.clientHeight;this.camera.aspect=l/c,this.camera.updateProjectionMatrix(),this.renderer.setSize(l,c),(u=this._postFX)==null||u.resize(l*Math.min(window.devicePixelRatio,2),c*Math.min(window.devicePixelRatio,2))},window.addEventListener("resize",this._onResize),t==null||t(95,"Starting renderer…"),this._animate(),t==null||t(100,"Ready!")}_setupLighting(){this.scene.add(new XA(8900331,5139260,.55)),this.sunLight=new yf(16774368,1.6),this.sunLight.position.copy(this._sunDir).multiplyScalar(1500),this.sunLight.castShadow=!0;const e=this.sunLight.shadow;e.mapSize.set(2048,2048),e.camera.near=1,e.camera.far=4e3,e.camera.left=-1400,e.camera.right=1400,e.camera.top=1400,e.camera.bottom=-1400,e.bias=-4e-4,e.normalBias=.02,this.scene.add(this.sunLight);const t=new yf(9419738,.35);t.position.set(-300,200,-400),this.scene.add(t);const i=new yf(16765088,.25);i.position.set(-200,100,500),this.scene.add(i)}_createHoverMarker(){const e=new An,t=new $r(5,7,32);t.rotateX(-Math.PI/2);const i=new ui({color:5809919,transparent:!0,opacity:.45,side:mt}),r=new Ie(t,i);e.add(r);const s=new $r(2,3.5,32);s.rotateX(-Math.PI/2);const o=new ui({color:8965375,transparent:!0,opacity:.35,side:mt}),a=new Ie(s,o);e.add(a);const l=new ao(1,16);l.rotateX(-Math.PI/2);const c=new ui({color:11197951,transparent:!0,opacity:.5,side:mt});e.add(new Ie(l,c)),e.visible=!1,e.userData={outer:r,inner:a,outerMat:i,innerMat:o},this.hoverMarker=e,this.scene.add(e)}_setupDOMEvents(e){const t=this.renderer.domElement,i={drill:16733491,measure:16739179,crossSection:5809919,strikeDip:16753920};t.addEventListener("mousemove",o=>{const a=t.getBoundingClientRect();this.mouse.x=(o.clientX-a.left)/a.width*2-1,this.mouse.y=-((o.clientY-a.top)/a.height)*2+1;const l=this._raycastTerrain();if(l){this.hoverMarker.position.set(l.point.x,l.point.y+.8,l.point.z),this.hoverMarker.visible=this.activeTool!=="navigate";const c=i[this.activeTool]??5809919;if(this.hoverMarker.userData.outerMat&&(this.hoverMarker.userData.outerMat.color.setHex(c),this.hoverMarker.userData.innerMat.color.setHex(c)),this._hoverCbs.forEach(u=>u(l.point)),this.activeTool==="navigate"){const u=this._raycastMarkers();t.style.cursor=u?"pointer":"grab"}}else this.hoverMarker.visible=!1});let r=0,s=0;t.addEventListener("mousedown",o=>{r=o.clientX,s=o.clientY}),t.addEventListener("click",o=>{const a=o.clientX-r,l=o.clientY-s;if(a*a+l*l>16)return;const c=t.getBoundingClientRect();if(this.mouse.x=(o.clientX-c.left)/c.width*2-1,this.mouse.y=-((o.clientY-c.top)/c.height)*2+1,this.activeTool==="navigate"){const f=this._raycastMarkers();f&&this._markerClickCbs.forEach(h=>h(f));return}const u=this._raycastTerrain();u&&this._clickCbs.forEach(f=>f(u.point))}),t.addEventListener("wheel",o=>{const a=o.deltaY<0,l=this._raycastTerrain();if(l){const c=this.controls.target,u=a?.15:.04;c.x+=(l.point.x-c.x)*u,c.y+=(l.point.y-c.y)*u,c.z+=(l.point.z-c.z)*u}},{passive:!0})}_raycastTerrain(){this.raycaster.setFromCamera(this.mouse,this.camera);const e=this.raycaster.intersectObject(this.terrain);return e.length>0?e[0]:null}_raycastMarkers(){var t,i;this.raycaster.setFromCamera(this.mouse,this.camera);const e=this.raycaster.intersectObjects(this.markersGroup.children,!0);for(const r of e){let s=r.object;for(;s&&!((t=s.userData)!=null&&t.markerId);)s=s.parent;if((i=s==null?void 0:s.userData)!=null&&i.markerId)return{type:s.userData.type,markerId:s.userData.markerId}}return null}_animate(){var i,r,s,o,a,l,c,u;if(this._disposed)return;this._animId=requestAnimationFrame(()=>this._animate());const e=this.clock.getElapsedTime();this.controls.update(),this._clampCameraToTerrain();const t=this.camera.position.y<nn;if((s=(r=(i=this.water)==null?void 0:i.material)==null?void 0:r.uniforms)!=null&&s.uSubmerged&&(this.water.material.uniforms.uSubmerged.value=t?1:0),t)this.scene.fog.density=12e-5;else{const f=((l=(a=(o=this.terrainMat)==null?void 0:o.uniforms)==null?void 0:a.uFogDensity)==null?void 0:l.value)??28e-5;this.scene.fog.density=f}wC(this.water,e),J0(this.lakeWater,e),J0(this.riverWater,e),(u=(c=this.terrainMat)==null?void 0:c.uniforms)!=null&&u.uTime&&(this.terrainMat.uniforms.uTime.value=e),PC(this.atmosphere,e),this._animateMarkers(e),this._postFX?this._postFX.compose(this.scene,this.camera):this.renderer.render(this.scene,this.camera)}_clampCameraToTerrain(){if(!this.heightMap)return;const e=this.camera.position,t=je/2,i=8;if(Math.abs(e.x)<t&&Math.abs(e.z)<t){const a=Math.max(-t+1,Math.min(t-1,e.x)),l=Math.max(-t+1,Math.min(t-1,e.z)),u=Jo(this.heightMap,a,l)+i;e.y<u&&(e.y=u)}else e.y<-20&&(e.y=-20);const s=this.controls.target;if(Math.abs(s.x)<t&&Math.abs(s.z)<t){const a=Math.max(-t+1,Math.min(t-1,s.x)),l=Math.max(-t+1,Math.min(t-1,s.z)),c=Jo(this.heightMap,a,l);s.y<c+2&&(s.y=c+2)}}_animateMarkers(e){var t;if((t=this.hoverMarker)!=null&&t.visible&&this.hoverMarker.userData.outer){const i=this.hoverMarker.userData,r=1+Math.sin(e*4)*.12;i.outer.scale.set(r,1,r),i.inner.scale.set(1/r,1,1/r),i.outerMat.opacity=.3+Math.sin(e*3)*.15,i.innerMat.opacity=.25+Math.sin(e*5)*.1}for(const i of this._animatedMarkers){const r=i.userData,s=(performance.now()-r.t0)/1e3;if(r.type==="drill")r.ring&&(r.ring.material.opacity=.35+Math.sin(s*3)*.2),r.disc&&(r.disc.material.opacity=.12+Math.sin(s*2)*.08),r.collar&&(r.collar.rotation.y=s*2),r.beacon&&(r.beacon.material.emissiveIntensity=.3+Math.sin(s*4)*.3);else if(r.type==="measure"){if(r.ring){const o=1+Math.sin(s*3)*.15;r.ring.scale.set(o,1,o),r.ring.material.opacity=.3+Math.sin(s*2.5)*.2}r.sphereMat&&(r.sphereMat.emissiveIntensity=.2+Math.sin(s*4)*.2)}else if(r.type==="crossSection"){if(r.beaconMat&&(r.beaconMat.emissiveIntensity=.3+Math.sin(s*3)*.3),r.ring){const o=1+Math.sin(s*2.5)*.12;r.ring.scale.set(o,1,o),r.ring.material.opacity=.3+Math.sin(s*3)*.15}r.pillarMat&&(r.pillarMat.opacity=.5+Math.sin(s*2)*.15)}else r.type==="strikeDip"&&(r.disc&&(r.disc.material.opacity=.12+Math.sin(s*2)*.08),r.centreMat&&(r.centreMat.emissiveIntensity=.2+Math.sin(s*3)*.2))}}setActiveTool(e){this.activeTool=e,e==="navigate"?(this.controls.enabled=!0,this.controls.enableRotate=!0,this.controls.enableZoom=!0,this.controls.enablePan=!0,this.renderer.domElement.style.cursor="grab"):(this.controls.enabled=!0,this.controls.enableRotate=!1,this.controls.enableZoom=!0,this.controls.enablePan=!0,this.renderer.domElement.style.cursor="crosshair")}onHover(e){return this._hoverCbs.push(e),()=>{this._hoverCbs=this._hoverCbs.filter(t=>t!==e)}}onClick(e){return this._clickCbs.push(e),()=>{this._clickCbs=this._clickCbs.filter(t=>t!==e)}}onMarkerClick(e){return this._markerClickCbs.push(e),()=>{this._markerClickCbs=this._markerClickCbs.filter(t=>t!==e)}}getCameraDirection(){const e=new U;return this.camera.getWorldDirection(e),e}getCameraPosition(){return this.camera.position.clone()}getControlsTarget(){return this.controls.target.clone()}getScaleData(){const e=this.camera.fov*Math.PI/180,t=this.camera.position.distanceTo(this.controls.target);return{worldPerPixel:2*Math.tan(e/2)*t/this.renderer.domElement.clientHeight}}getLayerAt(e,t,i){return d_(this.noise,e,t,i)}getTerrainHeightAt(e,t){return Jo(this.heightMap,e,t)}getBeddingAt(e,t){return Vd(this.noise,e,t)+Hd(e)}addDrillMarker(e,t){const i=new An;i.position.set(e.x,e.y,e.z);const r=new $r(2.5,4.5,32);r.rotateX(-Math.PI/2);const s=new ui({color:16733491,transparent:!0,opacity:.55,side:mt}),o=new Ie(r,s);o.position.y=.2,i.add(o);const a=new ao(2.5,32);a.rotateX(-Math.PI/2);const l=new ui({color:16746564,transparent:!0,opacity:.2,side:mt}),c=new Ie(a,l);c.position.y=.15,i.add(c);const u=new tn(.6,.6,18,12),f=new Ve({color:8949913,roughness:.25,metalness:.85}),h=new Ie(u,f);h.position.y=9,h.castShadow=!0,i.add(h);const p=new tn(1.4,1.2,2.5,12),v=new Ve({color:13382434,roughness:.35,metalness:.6}),_=new Ie(p,v);_.position.y=19.5,_.castShadow=!0,i.add(_);const m=new is(.9,2.5,8),d=new Ve({color:5595238,roughness:.2,metalness:.9}),x=new Ie(m,d);x.rotation.x=Math.PI,x.position.y=-1,i.add(x);const g=new It(1,12,8),M=new Ve({color:16729122,roughness:.3,emissive:6689024,emissiveIntensity:.5}),T=new Ie(g,M);T.position.y=21.5,i.add(T);for(let E=0;E<3;E++){const S=E/3*Math.PI*2,b=new tn(.2,.25,22,6),D=new Ve({color:6710903,roughness:.5,metalness:.6}),y=new Ie(b,D);y.position.set(Math.cos(S)*3.5,9,Math.sin(S)*3.5),y.rotation.z=Math.cos(S)*.18,y.rotation.x=Math.sin(S)*.18,y.castShadow=!0,i.add(y)}return i.userData={type:"drill",markerId:t,ring:o,disc:c,collar:_,beacon:T,t0:performance.now()},this._animatedMarkers.push(i),this.markersGroup.add(i),i}addMeasurePoint(e,t){this._measurePoints.push(e.clone());const i=new An;i.position.set(e.x,e.y,e.z);const r=new $r(3,4.5,32);r.rotateX(-Math.PI/2);const s=new ui({color:16739179,transparent:!0,opacity:.45,side:mt}),o=new Ie(r,s);o.position.y=.3,i.add(o);const a=new It(2.5,16,16),l=new Ve({color:16733525,roughness:.25,emissive:6689041,emissiveIntensity:.4}),c=new Ie(a,l);c.position.y=4,i.add(c);const u=new tn(.15,.15,4,6),f=new Ve({color:13386820,roughness:.3,metalness:.7}),h=new Ie(u,f);return h.position.y=2,i.add(h),i.userData={type:"measure",markerId:t,ring:o,sphere:c,sphereMat:l,t0:performance.now()},this._animatedMarkers.push(i),this.markersGroup.add(i),this._measureMarkers.push(i),this._measurePoints.length}getMeasurePoints(){return this._measurePoints}addMeasureLine(e,t,i){const r=[];for(let d=0;d<=40;d++){const x=d/40;r.push(new U(e.x+(t.x-e.x)*x,e.y+(t.y-e.y)*x+2+Math.sin(x*Math.PI)*3,e.z+(t.z-e.z)*x))}const o=new kt().setFromPoints(r),a=new z0({color:16739179,dashSize:3,gapSize:1.5}),l=new Ll(o,a);l.computeLineDistances(),this.markersGroup.add(l),this._measureLine=l,this._measureLine.userData={type:"measure",markerId:i};const c=e.distanceTo(t),u=Math.abs(e.y-t.y),f=document.createElement("canvas");f.width=256,f.height=80;const h=f.getContext("2d");h.fillStyle="rgba(20, 10, 10, 0.75)",h.fillRect(0,0,256,80),h.strokeStyle="#ff6b6b",h.lineWidth=2,h.strokeRect(2,2,252,76),h.fillStyle="#ff8888",h.font="bold 26px Arial",h.textAlign="center",h.fillText(`${c.toFixed(1)} m`,128,32),h.fillStyle="#ffaaaa",h.font="18px Arial",h.fillText(`Δelev: ${u.toFixed(1)} m`,128,60);const p=new mf(f),v=new Jl({map:p,transparent:!0}),_=new df(v),m=new U().addVectors(e,t).multiplyScalar(.5);_.position.set(m.x,Math.max(e.y,t.y)+14,m.z),_.scale.set(22,7,1),this.markersGroup.add(_),this._measureLine._sprite=_}clearMeasure(){var e,t,i;this._measureMarkers.forEach(r=>{this.markersGroup.remove(r),r.traverse(s=>{var o,a;(o=s.geometry)==null||o.dispose(),(a=s.material)==null||a.dispose()})}),this._measureLine&&(this.markersGroup.remove(this._measureLine),(e=this._measureLine.geometry)==null||e.dispose(),(t=this._measureLine.material)==null||t.dispose(),this._measureLine._sprite&&(this.markersGroup.remove(this._measureLine._sprite),(i=this._measureLine._sprite.material.map)==null||i.dispose(),this._measureLine._sprite.material.dispose())),this._animatedMarkers=this._animatedMarkers.filter(r=>!this._measureMarkers.includes(r)),this._measurePoints=[],this._measureMarkers=[],this._measureLine=null}addCrossSectionPoint(e){this._crossSectionPoints.push(e.clone());const t=new An;t.position.set(e.x,e.y,e.z);const i=new tn(1,1.5,16,12),r=new Ve({color:3377407,roughness:.3,emissive:1122901,emissiveIntensity:.3,transparent:!0,opacity:.65}),s=new Ie(i,r);s.position.y=8,t.add(s);const o=new It(1.5,12,8),a=new Ve({color:6728447,roughness:.2,emissive:2245802,emissiveIntensity:.5}),l=new Ie(o,a);l.position.y=17,t.add(l);const c=new $r(2,4,32);c.rotateX(-Math.PI/2);const u=new ui({color:5809919,transparent:!0,opacity:.45,side:mt}),f=new Ie(c,u);f.position.y=.3,t.add(f);const h=this._crossSectionPoints.length,p=document.createElement("canvas");p.width=64,p.height=64;const v=p.getContext("2d");v.fillStyle="rgba(10, 20, 50, 0.8)",v.fillRect(0,0,64,64),v.strokeStyle="#58a6ff",v.lineWidth=3,v.strokeRect(2,2,60,60),v.fillStyle="#88ccff",v.font="bold 36px Arial",v.textAlign="center",v.fillText(String(h),32,44);const _=new mf(p),m=new Jl({map:_,transparent:!0}),d=new df(m);return d.position.y=20,d.scale.set(5,5,1),t.add(d),t.userData={type:"crossSection",pillar:s,pillarMat:r,beacon:l,beaconMat:a,ring:f,t0:performance.now()},this._animatedMarkers.push(t),this.markersGroup.add(t),this._crossSectionMarkers.push(t),this._crossSectionPoints.length===2&&this._drawCrossSectionLine(),this._crossSectionPoints.length}_drawCrossSectionLine(){var l,c;this._crossSectionLine&&(this.markersGroup.remove(this._crossSectionLine),(l=this._crossSectionLine.geometry)==null||l.dispose(),(c=this._crossSectionLine.material)==null||c.dispose());const[e,t]=this._crossSectionPoints,i=[],r=60;for(let u=0;u<=r;u++){const f=u/r,h=e.x+(t.x-e.x)*f,p=e.z+(t.z-e.z)*f,v=this.getTerrainHeightAt(h,p);i.push(new U(h,v+1.5,p))}const s=new kt().setFromPoints(i),o=new z0({color:5809919,dashSize:4,gapSize:2}),a=new Ll(s,o);a.computeLineDistances(),this.markersGroup.add(a),this._crossSectionLine=a}getCrossSectionPoints(){return this._crossSectionPoints}clearCrossSection(){var e,t;this._crossSectionMarkers.forEach(i=>{this.markersGroup.remove(i),i.traverse(r=>{var s,o;(s=r.geometry)==null||s.dispose(),(o=r.material)==null||o.dispose()})}),this._crossSectionLine&&(this.markersGroup.remove(this._crossSectionLine),(e=this._crossSectionLine.geometry)==null||e.dispose(),(t=this._crossSectionLine.material)==null||t.dispose(),this._crossSectionLine=null),this._animatedMarkers=this._animatedMarkers.filter(i=>!this._crossSectionMarkers.includes(i)),this._crossSectionPoints=[],this._crossSectionMarkers=[]}addStrikeDipMarker(e,t,i){const r=new An;r.position.set(e.x,e.y+1.5,e.z);const s=(90-t)*Math.PI/180,o=new ao(9,32);o.rotateX(-Math.PI/2);const a=new ui({color:16753920,transparent:!0,opacity:.2,side:mt}),l=new Ie(o,a);l.position.y=.3,r.add(l);const c=14,u=[new U(-Math.cos(s)*c,0,Math.sin(s)*c),new U(Math.cos(s)*c,0,-Math.sin(s)*c)],f=new kt().setFromPoints(u);r.add(new Ll(f,new Lc({color:16755234,linewidth:2})));const h=new It(.7,8,6),p=new Ve({color:16755234,roughness:.3,emissive:5583616,emissiveIntensity:.3});for(const J of u){const I=new Ie(h,p);I.position.copy(J),r.add(I)}const v=s-Math.PI/2,_=9,m=new U(Math.cos(v)*_,0,-Math.sin(v)*_),d=[new U(0,0,0),m];r.add(new Ll(new kt().setFromPoints(d),new Lc({color:16737826,linewidth:2})));const x=new It(.55,8,6),g=new Ve({color:16737826,roughness:.3,emissive:4460800,emissiveIntensity:.3}),M=new Ie(x,g);M.position.copy(m),r.add(M);const T=new It(1.2,12,8),E=new Ve({color:16763972,roughness:.3,emissive:6702080,emissiveIntensity:.4}),S=new Ie(T,E);r.add(S);const b=document.createElement("canvas");b.width=128,b.height=64;const D=b.getContext("2d");D.fillStyle="rgba(30, 15, 0, 0.8)",D.fillRect(0,0,128,64),D.strokeStyle="#ffaa44",D.lineWidth=2,D.strokeRect(2,2,124,60),D.fillStyle="#ffcc66",D.font="bold 28px Arial",D.textAlign="center",D.fillText(`S: ${Math.round(t)}°`,64,42);const y=new mf(b),A=new Jl({map:y,transparent:!0}),j=new df(A);return j.position.y=7,j.scale.set(10,5,1),r.add(j),r.userData={type:"strikeDip",markerId:i,disc:l,centre:S,centreMat:E,t0:performance.now()},this._animatedMarkers.push(r),this.markersGroup.add(r),this._strikeDipMarkers.push(r),r}clearStrikeDip(){this._strikeDipMarkers.forEach(e=>{e.traverse(t=>{var i,r;(i=t.geometry)==null||i.dispose(),(r=t.material)==null||r.dispose()}),this.markersGroup.remove(e)}),this._animatedMarkers=this._animatedMarkers.filter(e=>!this._strikeDipMarkers.includes(e)),this._strikeDipMarkers=[]}removeMarkerById(e){var i,r,s,o,a,l;const t=[...this.markersGroup.children];for(const c of t)((i=c.userData)==null?void 0:i.markerId)===e&&(c.traverse(u=>{var f,h;(f=u.geometry)==null||f.dispose(),(h=u.material)==null||h.dispose()}),this.markersGroup.remove(c),this._animatedMarkers=this._animatedMarkers.filter(u=>u!==c),this._strikeDipMarkers=this._strikeDipMarkers.filter(u=>u!==c),this._measureMarkers=this._measureMarkers.filter(u=>u!==c),((s=(r=this._measureLine)==null?void 0:r.userData)==null?void 0:s.markerId)===e&&(this.markersGroup.remove(this._measureLine),(o=this._measureLine.geometry)==null||o.dispose(),(a=this._measureLine.material)==null||a.dispose(),this._measureLine._sprite&&(this.markersGroup.remove(this._measureLine._sprite),(l=this._measureLine._sprite.material.map)==null||l.dispose(),this._measureLine._sprite.material.dispose()),this._measureLine=null))}updateWaterLevel(e){this.water&&(this.water.mesh.position.y=e)}updateFogDensity(e){var t;this.scene.fog.density=e,this.terrainMat&&(this.terrainMat.uniforms.uFogDensity.value=e),(t=this.water)!=null&&t.material&&(this.water.material.uniforms.uFogDensity.value=e)}updateSunElevation(e){var s,o;const t=e*Math.PI/180,i=new U(750*Math.cos(t*.3),400*Math.sin(t),450*Math.cos(t*.5));this.sunLight.position.copy(i.clone().normalize().multiplyScalar(1500));const r=i.clone().normalize();this._sunDir.copy(r),this.terrainMat&&this.terrainMat.uniforms.uSunDir.value.copy(r),(s=this.water)!=null&&s.material&&this.water.material.uniforms.uSunDir.value.copy(r),(o=this.atmosphere)!=null&&o.material&&this.atmosphere.material.uniforms.uSunDir.value.copy(r)}dispose(){var e,t;this._disposed=!0,this._animId&&cancelAnimationFrame(this._animId),window.removeEventListener("resize",this._onResize),this.controls.dispose(),(t=(e=this._postFX)==null?void 0:e.colorTarget)==null||t.dispose(),this.renderer.dispose(),this.renderer.domElement.remove()}}let jC=1;function Nc(n){return`${n}-${jC++}`}function XC(n,e){return n.getLayerAt(e.x,e.y,e.z)}function YC(n,e){const t=e.y,i=[],r=.5;let s=0;const o=Nc("drill");for(;;){const a=t-s;if(a<0)break;const l=n.getLayerAt(e.x,a,e.z);i.length===0||i[i.length-1].layer.name!==l.name?i.push({layer:l,startDepth:s,endDepth:s}):i[i.length-1].endDepth=s,s+=r}return n.addDrillMarker(e,o),{id:o,results:i,position:{x:e.x,y:e.y,z:e.z},surfaceY:t,timestamp:Date.now()}}function qC(n,e){if(n.addMeasurePoint(e,Nc("mpt"))===2){const[i,r]=n.getMeasurePoints(),s=i.distanceTo(r),o=Math.sqrt((r.x-i.x)**2+(r.z-i.z)**2),a=r.y-i.y,l=(Math.atan2(r.x-i.x,r.z-i.z)*180/Math.PI+360)%360,c=Math.atan2(Math.abs(a),o)*180/Math.PI,u=Nc("measure");return n.addMeasureLine(i,r,u),n._measurePoints=[],{id:u,distance:s,horizDistance:o,elevChange:a,bearing:l,slope:c,pointA:{x:i.x,y:i.y,z:i.z},pointB:{x:r.x,y:r.y,z:r.z},timestamp:Date.now()}}return null}function m_(n){n.clearMeasure()}function $C(n,e){const i=n.getBeddingAt.bind(n),r=(i(e.x+5,e.z)-i(e.x-5,e.z))/(2*5),s=(i(e.x,e.z+5)-i(e.x,e.z-5))/(2*5),o=Math.sqrt(r*r+s*s),a=Math.atan(o)*180/Math.PI;let l=Math.atan2(-r,-s)*180/Math.PI;l=(l+360)%360;let c=(l+270)%360;const u=n.getLayerAt(e.x,e.y,e.z),f=Nc("sd");return n.addStrikeDipMarker(e,c,f),{id:f,strike:Math.round(c*10)/10,dip:Math.round(a*10)/10,dipDirection:Math.round(l*10)/10,position:{x:Math.round(e.x),y:Math.round(e.y),z:Math.round(e.z)},layerName:u.name}}function KC(n,e){if(n.addCrossSectionPoint(e)===2){const[i,r]=n.getCrossSectionPoints(),s=ZC(n,i,r);return n.clearCrossSection(),s}return null}function ZC(n,e,t,i=200){const r=Math.sqrt((t.x-e.x)**2+(t.z-e.z)**2),s=[];for(let o=0;o<=i;o++){const a=o/i,l=e.x+(t.x-e.x)*a,c=e.z+(t.z-e.z)*a,u=n.getTerrainHeightAt(l,c),f=a*r,h=[],p=.5;let v=null;for(let _=0;u-_>=0;_+=p){const m=u-_,d=n.getLayerAt(l,m,c);!v||v.name!==d.name?(v&&(v.bottomElevation=m),v={name:d.name,color:d.color,hex:d.hex,topElevation:m,bottomElevation:m},h.push(v)):v.bottomElevation=m}v&&(v.bottomElevation=0),s.push({distance:f,surfaceElevation:u,layers:h})}return{samples:s,totalDistance:r,bearing:(Math.atan2(t.x-e.x,t.z-e.z)*180/Math.PI+360)%360}}function JC(n){n.clearCrossSection()}const QC={},tg=n=>{let e;const t=new Set,i=(u,f)=>{const h=typeof u=="function"?u(e):u;if(!Object.is(h,e)){const p=e;e=f??(typeof h!="object"||h===null)?h:Object.assign({},e,h),t.forEach(v=>v(e,p))}},r=()=>e,l={setState:i,getState:r,getInitialState:()=>c,subscribe:u=>(t.add(u),()=>t.delete(u)),destroy:()=>{(QC?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),t.clear()}},c=e=n(i,r,l);return l},eb=n=>n?tg(n):tg;var g_={exports:{}},v_={},x_={exports:{}},__={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Mo=at;function tb(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var nb=typeof Object.is=="function"?Object.is:tb,ib=Mo.useState,rb=Mo.useEffect,sb=Mo.useLayoutEffect,ob=Mo.useDebugValue;function ab(n,e){var t=e(),i=ib({inst:{value:t,getSnapshot:e}}),r=i[0].inst,s=i[1];return sb(function(){r.value=t,r.getSnapshot=e,wf(r)&&s({inst:r})},[n,t,e]),rb(function(){return wf(r)&&s({inst:r}),n(function(){wf(r)&&s({inst:r})})},[n]),ob(t),t}function wf(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!nb(n,t)}catch{return!0}}function lb(n,e){return e()}var cb=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?lb:ab;__.useSyncExternalStore=Mo.useSyncExternalStore!==void 0?Mo.useSyncExternalStore:cb;x_.exports=__;var ub=x_.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nu=at,fb=ub;function hb(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var db=typeof Object.is=="function"?Object.is:hb,pb=fb.useSyncExternalStore,mb=nu.useRef,gb=nu.useEffect,vb=nu.useMemo,xb=nu.useDebugValue;v_.useSyncExternalStoreWithSelector=function(n,e,t,i,r){var s=mb(null);if(s.current===null){var o={hasValue:!1,value:null};s.current=o}else o=s.current;s=vb(function(){function l(p){if(!c){if(c=!0,u=p,p=i(p),r!==void 0&&o.hasValue){var v=o.value;if(r(v,p))return f=v}return f=p}if(v=f,db(u,p))return v;var _=i(p);return r!==void 0&&r(v,_)?(u=p,v):(u=p,f=_)}var c=!1,u,f,h=t===void 0?null:t;return[function(){return l(e())},h===null?void 0:function(){return l(h())}]},[e,t,i,r]);var a=pb(n,s[0],s[1]);return gb(function(){o.hasValue=!0,o.value=a},[a]),xb(a),a};g_.exports=v_;var _b=g_.exports;const yb=lg(_b),y_={},{useDebugValue:Mb}=H_,{useSyncExternalStoreWithSelector:Sb}=yb;let ng=!1;const wb=n=>n;function Eb(n,e=wb,t){(y_?"production":void 0)!=="production"&&t&&!ng&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),ng=!0);const i=Sb(n.subscribe,n.getState,n.getServerState||n.getInitialState,e,t);return Mb(i),i}const ig=n=>{(y_?"production":void 0)!=="production"&&typeof n!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof n=="function"?eb(n):n,t=(i,r)=>Eb(e,i,r);return Object.assign(t,e),t},Tb=n=>n?ig(n):ig,Ab=n=>(e,t,i)=>{const r=i.subscribe;return i.subscribe=(o,a,l)=>{let c=o;if(a){const u=(l==null?void 0:l.equalityFn)||Object.is;let f=o(i.getState());c=h=>{const p=o(h);if(!u(f,p)){const v=f;a(f=p,v)}},l!=null&&l.fireImmediately&&a(f,f)}return r(c)},n(e,t,i)},Cb=Ab,Je=Tb(Cb((n,e)=>({activeTool:"navigate",setActiveTool:t=>n({activeTool:t}),activePanel:null,panelPinned:!1,openPanel:t=>n({activePanel:t}),togglePanel:t=>n(i=>({activePanel:i.activePanel===t?null:t})),closePanel:()=>{const{panelPinned:t}=e();t||n({activePanel:null})},dismissPanel:()=>n({activePanel:null}),togglePanelPin:()=>n(t=>({panelPinned:!t.panelPinned})),layers:mi.map((t,i)=>({...t,id:i})),reorderLayer:(t,i)=>n(r=>{const s=[...r.layers],[o]=s.splice(t,1);return s.splice(i,0,o),{layers:s}}),addLayer:t=>n(i=>({layers:[...i.layers,{...t,id:Date.now()}]})),removeLayer:t=>n(i=>({layers:i.layers.filter(r=>r.id!==t)})),hoverInfo:null,setHoverInfo:t=>n({hoverInfo:t}),rockPopup:null,showRockPopup:t=>n({rockPopup:t}),hideRockPopup:()=>n({rockPopup:null}),drillResult:null,setDrillResult:t=>n({drillResult:t}),drillMarkers:[],addDrillMarker:t=>n(i=>({drillMarkers:[...i.drillMarkers,t]})),removeDrillMarker:t=>n(i=>({drillMarkers:i.drillMarkers.filter(r=>r.id!==t)})),clearDrillMarkers:()=>n({drillMarkers:[]}),measureResult:null,setMeasureResult:t=>n({measureResult:t}),measureMarkers:[],addMeasureMarker:t=>n(i=>({measureMarkers:[...i.measureMarkers,t]})),removeMeasureMarker:t=>n(i=>({measureMarkers:i.measureMarkers.filter(r=>r.id!==t)})),clearMeasureMarkers:()=>n({measureMarkers:[]}),strikeDipResults:[],addStrikeDip:t=>n(i=>({strikeDipResults:[...i.strikeDipResults,t]})),removeStrikeDip:t=>n(i=>({strikeDipResults:i.strikeDipResults.filter(r=>r.id!==t)})),clearStrikeDip:()=>n({strikeDipResults:[]}),crossSection:null,setCrossSection:t=>n({crossSection:t}),selectedMarker:null,selectMarker:t=>n({selectedMarker:t}),clearSelectedMarker:()=>n({selectedMarker:null}),loadingProgress:0,loadingMessage:"Initializing…",isLoaded:!1,setLoading:(t,i)=>n({loadingProgress:t,loadingMessage:i,isLoaded:t>=100}),settings:{waterLevel:42,fogDensity:28e-5,sunElevation:55},updateSettings:t=>n(i=>({settings:{...i.settings,...t}}))})));function bb(n){const e=at.useRef(null);return at.useEffect(()=>{if(!n.current||e.current)return;const t=new WC;e.current=t,t.init(n.current,(o,a)=>{Je.getState().setLoading(o,a)});let i=0;t.onHover(o=>{const a=performance.now();if(a-i<33)return;i=a;const l=t.getLayerAt(o.x,o.y,o.z);Je.getState().setHoverInfo({x:o.x,z:o.z,elevation:o.y,rockName:l.name})}),t.onClick(o=>{const a=Je.getState();switch(a.activeTool){case"identify":{const c=XC(t,o);a.showRockPopup(c);break}case"drill":{const c=YC(t,o);a.setDrillResult(c),a.addDrillMarker(c),a.openPanel("drill");break}case"measure":{const c=qC(t,o);c&&(a.setMeasureResult(c),a.addMeasureMarker(c),a.openPanel("measure"));break}case"strikedip":{const c=$C(t,o);a.addStrikeDip(c),a.openPanel("strikedip");break}case"crosssection":{const c=KC(t,o);c&&(a.setCrossSection(c),a.openPanel("crosssection"));break}}}),t.onMarkerClick(({type:o,markerId:a})=>{const l=Je.getState();let c=null,u=null;o==="drill"?(c=l.drillMarkers.find(f=>f.id===a),c&&(l.setDrillResult(c),u="drill")):o==="measure"?(c=l.measureMarkers.find(f=>f.id===a),c&&(l.setMeasureResult(c),u="measure")):o==="strikeDip"&&(c=l.strikeDipResults.find(f=>f.id===a),c&&(u="strikedip")),c&&(l.selectMarker({type:o,markerId:a,data:c}),u&&l.openPanel(u))});const r=Je.subscribe(o=>o.activeTool,o=>{t.setActiveTool(o),o!=="measure"&&m_(t),o!=="crosssection"&&JC(t)}),s=Je.subscribe(o=>o.settings,o=>{t.updateWaterLevel(o.waterLevel),t.updateFogDensity(o.fogDensity),t.updateSunElevation(o.sunElevation)});return()=>{r(),s(),t.dispose(),e.current=null}},[n]),e}function Rb(){at.useEffect(()=>{const n=e=>{if(e.target.tagName==="TEXTAREA"||e.target.tagName==="INPUT")return;const t=Je.getState();switch(e.key){case"1":t.setActiveTool("navigate");break;case"2":t.setActiveTool("identify");break;case"3":t.setActiveTool("drill");break;case"4":t.setActiveTool("measure");break;case"5":t.setActiveTool("strikedip");break;case"6":t.setActiveTool("crosssection");break;case"l":case"L":t.togglePanel("legend");break;case"n":case"N":t.togglePanel("notebook");break;case"Escape":t.hideRockPopup(),t.closePanel();break}};return document.addEventListener("keydown",n),()=>document.removeEventListener("keydown",n)},[])}const Pb=at.forwardRef(function(e,t){return C.jsx("div",{ref:t,id:"viewport"})}),Ln={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round"};function Lb({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-active":"",children:[C.jsx("path",{d:"M3 11l9-9 9 9"}),C.jsx("path",{d:"M12 2v14"}),C.jsx("path",{d:"M5 22h14"}),C.jsx("path",{d:"M5 19l3.5-3"}),C.jsx("path",{d:"M15.5 16L19 19"})]})}function Db({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-pulse":"",children:[C.jsx("circle",{cx:"10.5",cy:"10.5",r:"7.5"}),C.jsx("path",{d:"m21 21-5.2-5.2",strokeWidth:"2.2"}),C.jsx("circle",{cx:"8",cy:"8",r:"1",fill:"currentColor",stroke:"none",opacity:"0.5"}),C.jsx("circle",{cx:"13",cy:"9",r:"0.6",fill:"currentColor",stroke:"none",opacity:"0.35"})]})}function Dh({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-drill-spin":"",children:[C.jsx("path",{d:"M12 2v8",strokeWidth:"2.5"}),C.jsx("path",{d:"M9 10h6l-1 4H10l-1-4z",strokeWidth:"1.5"}),C.jsx("path",{d:"M10 14l2 8 2-8",strokeWidth:"1.5"}),C.jsx("path",{d:"M8.5 5a4 4 0 0 1 7 0",strokeWidth:"1",opacity:"0.4"}),C.jsx("path",{d:"M7.5 7.5a6 6 0 0 1 9 0",strokeWidth:"1",opacity:"0.25"})]})}function Nh({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-ruler-extend":"",children:[C.jsx("rect",{x:"2",y:"7",width:"20",height:"10",rx:"1.5",strokeWidth:"1.5"}),C.jsx("line",{x1:"6",y1:"7",x2:"6",y2:"11"}),C.jsx("line",{x1:"10",y1:"7",x2:"10",y2:"12",strokeWidth:"2"}),C.jsx("line",{x1:"14",y1:"7",x2:"14",y2:"11"}),C.jsx("line",{x1:"18",y1:"7",x2:"18",y2:"12",strokeWidth:"2"}),C.jsx("path",{d:"M3 20h18",strokeWidth:"1",opacity:"0.4"}),C.jsx("path",{d:"M3 19l2 1-2 1",fill:"currentColor",stroke:"none",opacity:"0.4"}),C.jsx("path",{d:"M21 19l-2 1 2 1",fill:"currentColor",stroke:"none",opacity:"0.4"})]})}function M_({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-active":"",children:[C.jsx("path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"}),C.jsx("path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"}),C.jsx("path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"})]})}function S_({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-active":"",children:[C.jsx("path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"}),C.jsx("line",{x1:"8",y1:"7",x2:"16",y2:"7",opacity:"0.4"}),C.jsx("line",{x1:"8",y1:"10",x2:"14",y2:"10",opacity:"0.3"})]})}function Nb({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-compass-needle":"",children:[C.jsx("circle",{cx:"12",cy:"12",r:"9.5",strokeWidth:"1.5"}),C.jsx("text",{x:"12",y:"6",fontSize:"5",fill:"currentColor",stroke:"none",textAnchor:"middle",fontWeight:"bold",children:"N"}),C.jsx("line",{x1:"5.5",y1:"14",x2:"18.5",y2:"14",strokeWidth:"2.2"}),C.jsx("line",{x1:"12",y1:"14",x2:"12",y2:"19",strokeWidth:"2"}),C.jsx("text",{x:"14",y:"19",fontSize:"5.5",fill:"currentColor",stroke:"none",fontFamily:"sans-serif",children:"δ"})]})}function Ib({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-active":"",children:[C.jsx("path",{d:"M2 16 Q5 6 8 10 Q11 14 14 7 Q17 2 22 8",strokeWidth:"2"}),C.jsx("path",{d:"M2 16 Q7 18 12 17 Q17 16 22 17",strokeWidth:"1",opacity:"0.4"}),C.jsx("path",{d:"M2 19 Q7 20 12 19.5 Q17 19 22 20",strokeWidth:"1",opacity:"0.3"}),C.jsx("line",{x1:"2",y1:"22",x2:"22",y2:"22",strokeWidth:"1.5",opacity:"0.5"})]})}function w_({active:n}){return C.jsxs("svg",{...Ln,className:n?"icon-spin-slow":"",children:[C.jsx("path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}),C.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}function Ub({pinned:n}){return C.jsx("svg",{...Ln,viewBox:"0 0 20 20",style:{width:14,height:14},children:n?C.jsxs(C.Fragment,{children:[C.jsx("path",{d:"M10 2v6",strokeWidth:"2"}),C.jsx("rect",{x:"5",y:"8",width:"10",height:"3",rx:"1"}),C.jsx("line",{x1:"10",y1:"11",x2:"10",y2:"18"}),C.jsx("circle",{cx:"10",cy:"18",r:"1",fill:"currentColor",stroke:"none"})]}):C.jsxs(C.Fragment,{children:[C.jsx("path",{d:"M10 2v6",strokeWidth:"2",opacity:"0.4"}),C.jsx("rect",{x:"5",y:"8",width:"10",height:"3",rx:"1",opacity:"0.4"}),C.jsx("line",{x1:"10",y1:"11",x2:"10",y2:"18",opacity:"0.4"}),C.jsx("line",{x1:"3",y1:"3",x2:"17",y2:"17",strokeWidth:"2"})]})})}function Fb(){return C.jsx("svg",{...Ln,viewBox:"0 0 16 16",style:{width:12,height:12},children:C.jsx("path",{d:"M4 10l4-4 4 4"})})}function kb(){return C.jsx("svg",{...Ln,viewBox:"0 0 16 16",style:{width:12,height:12},children:C.jsx("path",{d:"M4 6l4 4 4-4"})})}function zb(){return C.jsx("svg",{...Ln,viewBox:"0 0 16 16",style:{width:12,height:12},children:C.jsx("path",{d:"M8 3v10M3 8h10"})})}function Ob(){return C.jsx("svg",{...Ln,viewBox:"0 0 16 16",style:{width:12,height:12},children:C.jsx("path",{d:"M3 4h10M5.5 4V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1M6 7v5M10 7v5M4 4l.8 9a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9L12 4"})})}const Bb=[{id:"navigate",icon:Lb,tip:"Navigate (1)"},{id:"identify",icon:Db,tip:"Identify Rock (2)"},{id:"drill",icon:Dh,tip:"Drill Core (3)"},{id:"measure",icon:Nh,tip:"Measure (4)"},{id:"strikedip",icon:Nb,tip:"Strike & Dip (5)"},{id:"crosssection",icon:Ib,tip:"Cross-Section (6)"}],Gb=[{id:"legend",icon:M_,tip:"Layer Legend (L)"},{id:"notebook",icon:S_,tip:"Field Notebook (N)"}];function Vb(){const n=Je(r=>r.activeTool),e=Je(r=>r.setActiveTool),t=Je(r=>r.activePanel),i=Je(r=>r.togglePanel);return C.jsxs("nav",{id:"sidebar",children:[C.jsx("div",{className:"sb-section",children:Bb.map(r=>C.jsx("button",{className:`sb-btn${n===r.id?" active":""}`,"data-tooltip":r.tip,onClick:()=>e(r.id),children:C.jsx(r.icon,{})},r.id))}),C.jsx("div",{className:"sb-divider"}),C.jsx("div",{className:"sb-section",children:Gb.map(r=>C.jsx("button",{className:`sb-btn${t===r.id?" active":""}`,"data-tooltip":r.tip,onClick:()=>i(r.id),children:C.jsx(r.icon,{})},r.id))}),C.jsx("div",{className:"sb-spacer"}),C.jsx("div",{className:"sb-section",children:C.jsx("button",{className:`sb-btn${t==="settings"?" active":""}`,"data-tooltip":"Settings",onClick:()=>i("settings"),children:C.jsx(w_,{})})})]})}function Hb(){const n=Je(p=>p.layers),e=Je(p=>p.reorderLayer),t=Je(p=>p.addLayer),i=Je(p=>p.removeLayer),r=Je(p=>p.showRockPopup),[s,o]=at.useState(!1),[a,l]=at.useState(""),[c,u]=at.useState("#888888"),f=[...n].reverse(),h=()=>{a.trim()&&(t({name:a.trim(),baseElevation:0,color:c,hex:parseInt(c.slice(1),16),minerals:["Unknown"],characteristics:"Custom layer",grainSize:"Variable",texture:"Unknown",fossils:"None",age:"Unknown"}),l(""),o(!1))};return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(M_,{}),"Layer Manager"]}),C.jsx("div",{className:"layer-list",children:f.map((p,v)=>{const _=n.length-1-v;return C.jsxs("div",{className:"legend-item layer-item",children:[C.jsxs("div",{className:"layer-reorder",children:[C.jsx("button",{className:"layer-reorder-btn",disabled:v===0,onClick:m=>{m.stopPropagation(),e(_,_+1)},title:"Move up (toward surface)",children:C.jsx(Fb,{})}),C.jsx("button",{className:"layer-reorder-btn",disabled:v===f.length-1,onClick:m=>{m.stopPropagation(),e(_,_-1)},title:"Move down (toward depth)",children:C.jsx(kb,{})})]}),C.jsx("div",{className:"legend-swatch",style:{background:p.color}}),C.jsxs("div",{className:"legend-info",onClick:()=>r(p),style:{cursor:"pointer"},children:[C.jsx("div",{className:"legend-name",children:p.name}),C.jsxs("div",{className:"legend-elev",children:[p.baseElevation,"m+ · ",p.age]})]}),n.length>1&&C.jsx("button",{className:"layer-delete-btn",onClick:m=>{m.stopPropagation(),i(p.id)},title:"Remove layer",children:C.jsx(Ob,{})})]},p.id)})}),s?C.jsxs("div",{className:"layer-add-form",children:[C.jsx("input",{type:"text",placeholder:"Layer name…",value:a,onChange:p=>l(p.target.value),onKeyDown:p=>p.key==="Enter"&&h(),autoFocus:!0}),C.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center",marginTop:6},children:[C.jsx("input",{type:"color",value:c,onChange:p=>u(p.target.value),style:{width:32,height:28,border:"none",background:"none",cursor:"pointer"}}),C.jsx("button",{className:"btn btn-sm btn-primary",onClick:h,children:"Add"}),C.jsx("button",{className:"btn btn-sm btn-outline",onClick:()=>o(!1),children:"Cancel"})]})]}):C.jsxs("button",{className:"btn btn-sm btn-outline btn-block",style:{marginTop:10},onClick:()=>o(!0),children:[C.jsx(zb,{})," Add Layer"]})]})}const Wb="modulepreload",jb=function(n){return"/"+n},rg={},Xb=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));r=Promise.allSettled(t.map(l=>{if(l=jb(l),l in rg)return;rg[l]=!0;const c=l.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Wb,c||(f.as="script"),f.crossOrigin="",f.href=l,a&&f.setAttribute("nonce",a),document.head.appendChild(f),c)return new Promise((h,p)=>{f.addEventListener("load",h),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})};function Yb(){const n=Kc(),[e,t]=at.useState(""),i=()=>{const o=n==null?void 0:n.current;if(!o)return;const a=o.getCameraPosition(),l=o.getCameraDirection(),c=(Math.atan2(l.x,l.z)*180/Math.PI+360)%360,u=`
📍 [${a.x.toFixed(0)}, ${a.y.toFixed(0)}, ${a.z.toFixed(0)}] Bearing: ${c.toFixed(0)}°
`;t(f=>f+u)},r=()=>{t(o=>o+`
🕐 ${new Date().toLocaleString()}
`)},s=async()=>{if(!e.trim()){alert("Notebook is empty.");return}const{jsPDF:o}=await Xb(async()=>{const{jsPDF:c}=await import("./jspdf.es.min-BKWGyDTG.js").then(u=>u.j);return{jsPDF:c}},[]),a=new o;a.setFont("helvetica","bold"),a.setFontSize(16),a.text("Field Geology Notes",15,20),a.setFont("helvetica","normal"),a.setFontSize(10),a.text(new Date().toLocaleString(),15,28),a.setFontSize(11);const l=a.splitTextToSize(e,180);a.text(l,15,38),a.save(`FieldNotes_${Date.now()}.pdf`)};return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(S_,{}),"Field Notebook"]}),C.jsxs("div",{className:"field-group",children:[C.jsx("div",{className:"field-label",children:"Observations"}),C.jsx("textarea",{value:e,onChange:o=>t(o.target.value),placeholder:`Record your field observations here...

Tip: Click "Location Stamp" to record your current position.`})]}),C.jsxs("div",{style:{display:"flex",gap:8,marginBottom:10},children:[C.jsx("button",{className:"btn btn-outline btn-sm",style:{flex:1},onClick:i,children:"📍 Location Stamp"}),C.jsx("button",{className:"btn btn-outline btn-sm",style:{flex:1},onClick:r,children:"🕐 Timestamp"})]}),C.jsx("button",{className:"btn btn-success btn-block",onClick:s,children:"Export as PDF"})]})}function qb(){const n=Je(l=>l.drillResult),e=Je(l=>l.drillMarkers),t=Je(l=>l.setDrillResult),i=Je(l=>l.showRockPopup);if(!n)return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(Dh,{})," Drill Core"]}),C.jsxs("p",{style:{fontSize:13,color:"var(--text-2)"},children:["Select the ",C.jsx("strong",{children:"Drill"})," tool (3) and click on the terrain to extract a core."]}),e.length>0&&C.jsx(sg,{markers:e,onSelect:t})]});const{results:r,position:s,surfaceY:o}=n,a=r.length>0?r[r.length-1].endDepth:0;return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(Dh,{})," Drill Core Result"]}),C.jsxs("div",{style:{fontSize:12,color:"var(--text-2)",marginBottom:12},children:["Location: (",s.x.toFixed(0),", ",s.z.toFixed(0),") · Surface: ",o.toFixed(1),"m · Depth: ",a.toFixed(1),"m"]}),C.jsxs("div",{className:"core-wrapper",children:[C.jsxs("div",{className:"core-depth-axis",style:{height:Math.max(200,a*2)},children:[r.map((l,c)=>C.jsxs("div",{className:"core-depth-tick",style:{top:l.startDepth*2},children:[l.startDepth.toFixed(0),"m"]},c)),r.length>0&&C.jsxs("div",{className:"core-depth-tick",style:{top:a*2},children:[a.toFixed(0),"m"]})]}),C.jsx("div",{className:"core-column",children:r.map((l,c)=>C.jsx("div",{className:"core-segment",style:{height:Math.max(20,(l.endDepth-l.startDepth)*2),background:l.layer.color},title:l.layer.name,onClick:()=>i(l.layer)},c))}),C.jsx("div",{className:"core-log",children:r.map((l,c)=>{const u=l.endDepth-l.startDepth;return C.jsxs("div",{className:"core-log-entry",style:{borderColor:l.layer.color,minHeight:Math.max(20,u*2)},onClick:()=>i(l.layer),children:[C.jsx("div",{className:"core-log-name",children:l.layer.name}),C.jsxs("div",{className:"core-log-detail",children:[u.toFixed(1),"m · ",l.layer.grainSize,C.jsx("br",{}),l.layer.minerals.slice(0,3).join(", ")]})]},c)})})]}),e.length>1&&C.jsx(sg,{markers:e,activeId:n.id,onSelect:t})]})}function sg({markers:n,activeId:e,onSelect:t}){return C.jsxs("div",{style:{marginTop:14},children:[C.jsxs("div",{style:{fontSize:12,color:"var(--text-2)",fontWeight:600,marginBottom:6},children:["Saved Drill Cores (",n.length,")"]}),C.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:n.map(i=>{const r=i.id===e,s=i.results.length>0?i.results[i.results.length-1].endDepth:0;return C.jsxs("button",{onClick:()=>t(i),style:{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:4,border:"none",background:r?"rgba(255,85,51,0.15)":"rgba(255,255,255,0.04)",color:r?"#ff8866":"var(--text-2)",cursor:"pointer",fontSize:12,textAlign:"left",outline:r?"1px solid rgba(255,85,51,0.3)":"none"},children:[C.jsx("span",{style:{fontWeight:600},children:"⛏"}),C.jsxs("span",{children:["(",i.position.x.toFixed(0),", ",i.position.z.toFixed(0),")"]}),C.jsxs("span",{style:{marginLeft:"auto",opacity:.6},children:[s.toFixed(0),"m deep"]})]},i.id)})})]})}function $b(){const n=Je(u=>u.measureResult),e=Je(u=>u.setMeasureResult),t=Je(u=>u.measureMarkers),i=Kc(),r=()=>{i!=null&&i.current&&m_(i.current),e(null)};if(!n)return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(Nh,{})," Measurement"]}),C.jsxs("p",{style:{fontSize:13,color:"var(--text-2)"},children:["Select the ",C.jsx("strong",{children:"Measure"})," tool (4) and click two points on the terrain to measure distance, bearing, and elevation change."]}),t.length>0&&C.jsx(og,{markers:t,onSelect:e})]});const{distance:s,horizDistance:o,elevChange:a,bearing:l,slope:c}=n;return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(Nh,{})," Measurement"]}),C.jsxs("div",{className:"measure-result",children:[C.jsxs("div",{className:"measure-value",children:[s.toFixed(1)," m"]}),C.jsx("div",{className:"measure-label",children:"3D Distance"})]}),C.jsxs("div",{className:"measure-result",children:[C.jsxs("div",{className:"measure-value",children:[o.toFixed(1)," m"]}),C.jsx("div",{className:"measure-label",children:"Horizontal Distance"})]}),C.jsxs("div",{className:"measure-result",children:[C.jsxs("div",{className:"measure-value",children:[a>=0?"+":"",a.toFixed(1)," m"]}),C.jsx("div",{className:"measure-label",children:"Elevation Change"})]}),C.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},children:[C.jsxs("div",{className:"measure-result",children:[C.jsxs("div",{className:"measure-value",children:[l.toFixed(1),"°"]}),C.jsx("div",{className:"measure-label",children:"Bearing"})]}),C.jsxs("div",{className:"measure-result",children:[C.jsxs("div",{className:"measure-value",children:[c.toFixed(1),"°"]}),C.jsx("div",{className:"measure-label",children:"Slope"})]})]}),n.pointA&&C.jsxs("div",{style:{fontSize:11,color:"var(--text-2)",marginTop:8,opacity:.7},children:["A: (",n.pointA.x.toFixed(0),", ",n.pointA.z.toFixed(0),", ",n.pointA.y.toFixed(1),"m) → B: (",n.pointB.x.toFixed(0),", ",n.pointB.z.toFixed(0),", ",n.pointB.y.toFixed(1),"m)"]}),C.jsx("button",{className:"btn btn-outline btn-block btn-sm",style:{marginTop:12},onClick:r,children:"Clear Measurement"}),t.length>1&&C.jsx(og,{markers:t,activeId:n.id,onSelect:e})]})}function og({markers:n,activeId:e,onSelect:t}){return C.jsxs("div",{style:{marginTop:14},children:[C.jsxs("div",{style:{fontSize:12,color:"var(--text-2)",fontWeight:600,marginBottom:6},children:["Saved Measurements (",n.length,")"]}),C.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:n.map(i=>{const r=i.id===e;return C.jsxs("button",{onClick:()=>t(i),style:{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:4,border:"none",background:r?"rgba(255,107,107,0.15)":"rgba(255,255,255,0.04)",color:r?"#ff8888":"var(--text-2)",cursor:"pointer",fontSize:12,textAlign:"left",outline:r?"1px solid rgba(255,107,107,0.3)":"none"},children:[C.jsx("span",{style:{fontWeight:600},children:"📏"}),C.jsxs("span",{children:[i.distance.toFixed(1),"m"]}),C.jsxs("span",{style:{opacity:.6},children:[i.bearing.toFixed(0),"°"]}),C.jsxs("span",{style:{marginLeft:"auto",opacity:.6},children:["Δ",i.elevChange>=0?"+":"",i.elevChange.toFixed(1),"m"]})]},i.id)})})]})}function Kb(){const n=Je(r=>r.strikeDipResults),e=Je(r=>r.clearStrikeDip),t=Je(r=>r.selectedMarker),i=(t==null?void 0:t.type)==="strikeDip"?t.markerId:null;return C.jsxs("div",{className:"panel-content strikedip-panel",children:[C.jsx("h3",{style:{margin:"0 0 8px",fontSize:15},children:"Strike & Dip"}),n.length===0?C.jsx("p",{style:{color:"#8b949e",fontSize:13},children:"Click on the terrain to measure bedding orientation."}):C.jsxs(C.Fragment,{children:[C.jsx("button",{onClick:e,className:"btn btn-sm btn-outline",style:{marginBottom:10},children:"Clear All"}),n.length>1&&C.jsx("div",{className:"sd-stereonet-wrapper",children:C.jsxs("svg",{viewBox:"0 0 200 200",className:"sd-stereonet",children:[C.jsx(Jb,{}),n.map((r,s)=>C.jsx(Qb,{strike:r.strike,dip:r.dip,index:s},s))]})}),C.jsx("div",{className:"sd-results-list",children:n.map((r,s)=>C.jsxs("div",{className:"sd-result-card",style:r.id===i?{outline:"1px solid rgba(255,165,0,0.4)",background:"rgba(255,165,0,0.08)"}:{},children:[C.jsxs("div",{className:"sd-result-header",children:[C.jsxs("span",{className:"sd-result-num",children:["#",s+1]}),C.jsx("span",{className:"sd-result-layer",children:r.layerName})]}),C.jsxs("div",{className:"sd-result-body",children:[C.jsx("svg",{viewBox:"0 0 110 110",className:"sd-symbol-large",children:C.jsx(Zb,{strike:r.strike,dip:r.dip})}),C.jsxs("div",{className:"sd-result-data",children:[C.jsxs("div",{className:"sd-datum",children:[C.jsx("span",{className:"sd-datum-label",children:"Strike"}),C.jsxs("span",{className:"sd-datum-value",children:[r.strike,"°"]})]}),C.jsxs("div",{className:"sd-datum",children:[C.jsx("span",{className:"sd-datum-label",children:"Dip"}),C.jsxs("span",{className:"sd-datum-value",children:[r.dip,"°"]})]}),C.jsxs("div",{className:"sd-datum",children:[C.jsx("span",{className:"sd-datum-label",children:"Dip Dir"}),C.jsxs("span",{className:"sd-datum-value",children:[r.dipDirection,"°"]})]}),C.jsxs("div",{className:"sd-datum-coords",children:["(",r.position.x,", ",r.position.z,")"]})]})]})]},r.id||s))})]})]})}function Zb({strike:n,dip:e}){const s=(90-n)*Math.PI/180,o=Math.cos(s)*42,a=-Math.sin(s)*42,l=s-Math.PI/2,c=Math.cos(l)*42*.45,u=-Math.sin(l)*42*.45;return C.jsxs("g",{children:[C.jsx("circle",{cx:55,cy:55,r:46,fill:"none",stroke:"#21262d",strokeWidth:"1"}),C.jsx("circle",{cx:55,cy:55,r:43,fill:"none",stroke:"#30363d",strokeWidth:"0.5"}),C.jsx("text",{x:55,y:6,fill:"#58a6ff",fontSize:"9",textAnchor:"middle",fontWeight:"bold",children:"N"}),C.jsx("text",{x:105,y:58,fill:"#484f58",fontSize:"7",textAnchor:"middle",children:"E"}),C.jsx("text",{x:55,y:109,fill:"#484f58",fontSize:"7",textAnchor:"middle",children:"S"}),C.jsx("text",{x:5,y:58,fill:"#484f58",fontSize:"7",textAnchor:"middle",children:"W"}),[0,30,60,90,120,150,180,210,240,270,300,330].map(f=>{const h=f*Math.PI/180,p=55+Math.sin(h)*40,v=55-Math.cos(h)*40,_=55+Math.sin(h)*44,m=55-Math.cos(h)*44;return C.jsx("line",{x1:p,y1:v,x2:_,y2:m,stroke:"#30363d",strokeWidth:"0.8"},f)}),C.jsx("line",{x1:55-o,y1:55-a,x2:55+o,y2:55+a,stroke:"#ffa500",strokeWidth:"3",strokeLinecap:"round"}),C.jsx("line",{x1:55,y1:55,x2:55+c,y2:55+u,stroke:"#ffa500",strokeWidth:"2.5",strokeLinecap:"round"}),C.jsxs("text",{x:55+c*1.3,y:55+u*1.3+4,fill:"#e6edf3",fontSize:"10",fontWeight:"600",fontFamily:"sans-serif",children:[e,"°"]}),C.jsx("circle",{cx:55,cy:55,r:"2.5",fill:"#ffa500"})]})}function Jb(){return C.jsxs("g",{children:[C.jsx("circle",{cx:100,cy:100,r:85,fill:"#0d1117",stroke:"#30363d",strokeWidth:"1"}),C.jsx("line",{x1:100,y1:15,x2:100,y2:185,stroke:"#161b22",strokeWidth:"0.5"}),C.jsx("line",{x1:15,y1:100,x2:185,y2:100,stroke:"#161b22",strokeWidth:"0.5"}),C.jsx("text",{x:100,y:11,fill:"#58a6ff",fontSize:"8",textAnchor:"middle",children:"N"})]})}function Qb({strike:n,dip:e,index:t}){const o=(90-n)*Math.PI/180,a=85*.8,l=Math.cos(o)*a,c=-Math.sin(o)*a,u=["#ffa500","#58a6ff","#3fb950","#f85149","#d29922","#bc8cff"],f=u[t%u.length];return C.jsxs("g",{children:[C.jsx("line",{x1:100-l,y1:100-c,x2:100+l,y2:100+c,stroke:f,strokeWidth:"2",opacity:"0.8"}),C.jsx("circle",{cx:100,cy:100,r:"3",fill:f,opacity:"0.7"})]})}const st={top:28,right:24,bottom:44,left:56},eR=720,tR=420;function nR(){const n=Je(t=>t.crossSection),e=at.useRef(null);return at.useEffect(()=>{!n||!e.current||rR(e.current,n)},[n]),n?C.jsxs("div",{className:"panel-content crosssection-panel",children:[C.jsx("h3",{style:{margin:"0 0 6px",fontSize:15},children:"Cross-Section"}),C.jsxs("div",{className:"cs-meta",children:[C.jsxs("span",{children:["Bearing: ",C.jsxs("b",{children:[n.bearing.toFixed(1),"°"]})]}),C.jsxs("span",{children:["Length: ",C.jsxs("b",{children:[n.totalDistance.toFixed(0)," m"]})]}),C.jsxs("span",{children:["Samples: ",C.jsx("b",{children:n.samples.length})]})]}),C.jsx("div",{className:"cs-canvas-wrapper",children:C.jsx("canvas",{ref:e,width:eR,height:tR,className:"cs-canvas"})}),C.jsx("div",{className:"cs-legend",children:mi.map(t=>C.jsxs("span",{className:"cs-legend-item",children:[C.jsx("span",{className:"cs-legend-swatch",style:{background:t.color}}),t.name]},t.name))})]}):C.jsxs("div",{className:"panel-content crosssection-panel",children:[C.jsx("h3",{style:{margin:"0 0 8px",fontSize:15},children:"Cross-Section"}),C.jsx("p",{style:{color:"#8b949e",fontSize:13},children:"Click two points on the terrain to draw a cross-section line."})]})}function iR(n,e,t,i,r,s,o){switch(n.fillStyle=o,n.fillRect(t,i,r,s),n.save(),n.globalAlpha=.18,n.strokeStyle="#000",n.lineWidth=.6,e%6){case 0:for(let a=0;a<r*s*.004;a++){const l=t+Math.random()*r,c=i+Math.random()*s;n.fillStyle=Math.random()>.5?"#aaa":"#555",n.fillRect(l,c,1.5,1.5)}break;case 1:for(let a=i+4;a<i+s;a+=6){n.beginPath();for(let l=t;l<t+r;l+=3){const c=Math.sin(l*.05)*1.5;l===t?n.moveTo(l,a+c):n.lineTo(l,a+c)}n.stroke()}break;case 2:for(let a=0;a<r*s*.003;a++){const l=t+Math.random()*r,c=i+Math.random()*s;n.beginPath(),n.arc(l,c,.7,0,Math.PI*2),n.fill()}break;case 3:for(let a=i-r;a<i+s;a+=5)n.beginPath(),n.moveTo(t,a),n.lineTo(t+r,a+r),n.stroke();break;case 4:for(let a=i+6;a<i+s;a+=8){const l=Math.floor((a-i)/8)%2*10;n.beginPath(),n.moveTo(t,a),n.lineTo(t+r,a),n.stroke();for(let c=t+l;c<t+r;c+=20)n.beginPath(),n.moveTo(c,a),n.lineTo(c,a-8),n.stroke()}break;case 5:for(let a=0;a<r*s*.002;a++){const l=t+Math.random()*r,c=i+Math.random()*s;n.beginPath(),n.moveTo(l-2,c-2),n.lineTo(l,c+1),n.lineTo(l+2,c-2),n.stroke()}break}n.restore()}function rR(n,{samples:e,totalDistance:t}){const i=n.getContext("2d"),r=n.width,s=n.height;i.clearRect(0,0,r,s),i.fillStyle="#0d1117",i.fillRect(0,0,r,s);const o=r-st.left-st.right,a=s-st.top-st.bottom;let l=1/0,c=-1/0;for(const m of e){m.surfaceElevation>c&&(c=m.surfaceElevation);for(const d of m.layers)d.bottomElevation<l&&(l=d.bottomElevation)}l=Math.max(0,l-8),c+=15;const u=m=>st.left+m/t*o,f=m=>st.top+a-(m-l)/(c-l)*a;i.strokeStyle="#161b22",i.lineWidth=.5;const h=6;for(let m=0;m<=h;m++){const d=l+(c-l)/h*m,x=f(d);i.beginPath(),i.moveTo(st.left,x),i.lineTo(st.left+o,x),i.stroke()}const p=6;for(let m=0;m<=p;m++){const d=t/p*m,x=u(d);i.beginPath(),i.moveTo(x,st.top),i.lineTo(x,st.top+a),i.stroke()}const v=Math.max(2,o/e.length+.5);for(let m=0;m<e.length;m++){const d=e[m],x=u(d.distance)-v/2;for(const g of d.layers){const M=f(g.topElevation),T=f(g.bottomElevation),E=mi.findIndex(S=>S.name===g.name);iR(i,E>=0?E:0,x,M,v+1,T-M,g.color)}}const _=f(nn);_>st.top&&_<st.top+a&&(i.fillStyle="rgba(26,111,160,0.15)",i.fillRect(st.left,_,o,st.top+a-_),i.strokeStyle="rgba(88,166,255,0.6)",i.lineWidth=1.5,i.setLineDash([6,4]),i.beginPath(),i.moveTo(st.left,_),i.lineTo(st.left+o,_),i.stroke(),i.setLineDash([]),i.fillStyle="#58a6ff",i.font="bold 10px sans-serif",i.fillText("Water Level",st.left+4,_-5)),i.shadowColor="rgba(230,237,243,0.3)",i.shadowBlur=4,i.strokeStyle="#e6edf3",i.lineWidth=2,i.beginPath();for(let m=0;m<e.length;m++){const d=u(e[m].distance),x=f(e[m].surfaceElevation);m===0?i.moveTo(d,x):i.lineTo(d,x)}i.stroke(),i.shadowBlur=0,i.strokeStyle="#484f58",i.lineWidth=1.5,i.beginPath(),i.moveTo(st.left,st.top),i.lineTo(st.left,st.top+a),i.lineTo(st.left+o,st.top+a),i.stroke(),i.fillStyle="#8b949e",i.font="11px sans-serif",i.textAlign="center";for(let m=0;m<=p;m++){const d=t/p*m,x=u(d);i.fillText(`${d.toFixed(0)}m`,x,st.top+a+16),i.beginPath(),i.moveTo(x,st.top+a),i.lineTo(x,st.top+a+4),i.stroke()}i.textAlign="right";for(let m=0;m<=h;m++){const d=l+(c-l)/h*m,x=f(d);i.fillText(`${d.toFixed(0)}m`,st.left-6,x+4),i.beginPath(),i.moveTo(st.left-4,x),i.lineTo(st.left,x),i.stroke()}i.fillStyle="#58a6ff",i.textAlign="center",i.font="bold 11px sans-serif",i.fillText("Distance (m)",st.left+o/2,s-6),i.save(),i.translate(14,st.top+a/2),i.rotate(-Math.PI/2),i.fillText("Elevation (m)",0,0),i.restore()}function sR(){const n=Je(s=>s.settings),e=Je(s=>s.updateSettings),[t,i]=at.useState({...n}),r=()=>e(t);return C.jsxs(C.Fragment,{children:[C.jsxs("div",{className:"panel-header",children:[C.jsx(w_,{})," Settings"]}),C.jsxs("div",{className:"field-group",children:[C.jsx("div",{className:"field-label",children:"Water Level (m)"}),C.jsx("input",{type:"number",value:t.waterLevel,min:0,max:150,step:1,onChange:s=>i({...t,waterLevel:+s.target.value})})]}),C.jsxs("div",{className:"field-group",children:[C.jsx("div",{className:"field-label",children:"Fog Density"}),C.jsx("input",{type:"number",value:t.fogDensity,min:0,max:.005,step:5e-5,onChange:s=>i({...t,fogDensity:+s.target.value})})]}),C.jsxs("div",{className:"field-group",children:[C.jsx("div",{className:"field-label",children:"Sun Elevation (°)"}),C.jsx("input",{type:"number",value:t.sunElevation,min:5,max:90,step:5,onChange:s=>i({...t,sunElevation:+s.target.value})})]}),C.jsx("button",{className:"btn btn-primary btn-block",style:{marginTop:16},onClick:r,children:"Apply Settings"})]})}const oR={legend:Hb,notebook:Yb,drill:qb,measure:$b,strikedip:Kb,crosssection:nR,settings:sR},aR=new Set(["strikedip","crosssection"]);function lR(){const n=Je(l=>l.activePanel),e=Je(l=>l.panelPinned),t=Je(l=>l.togglePanelPin),i=Je(l=>l.closePanel),r=n!==null,s=n?oR[n]:null,o=n&&aR.has(n),a=at.useCallback(()=>{e||i()},[e,i]);return at.useEffect(()=>{const l=c=>{c.key==="Escape"&&r&&i()};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[r,i]),C.jsxs(C.Fragment,{children:[r&&!e&&C.jsx("div",{className:"panel-backdrop",onClick:a}),C.jsxs("div",{id:"panel",className:`${r?"open":""}${o?" wide":""}`,children:[r&&C.jsx("button",{className:`panel-pin-btn${e?" pinned":""}`,onClick:t,title:e?"Unpin panel":"Pin panel open",children:C.jsx(Ub,{pinned:e})}),s&&C.jsx("div",{className:"panel-page",children:C.jsx(s,{})})]})]})}function cR(){const n=Je(i=>i.hoverInfo),e=Je(i=>i.activeTool),t=e.charAt(0).toUpperCase()+e.slice(1);return C.jsxs("div",{id:"status-bar",children:[C.jsxs("div",{className:"status-group",children:[C.jsx("span",{className:"status-label",children:"X"}),C.jsx("span",{className:"status-value",children:n?n.x.toFixed(1)+"m":"--"})]}),C.jsxs("div",{className:"status-group",children:[C.jsx("span",{className:"status-label",children:"Z"}),C.jsx("span",{className:"status-value",children:n?n.z.toFixed(1)+"m":"--"})]}),C.jsx("div",{className:"status-sep"}),C.jsxs("div",{className:"status-group",children:[C.jsx("span",{className:"status-label",children:"Elev"}),C.jsx("span",{className:"status-value",children:n?n.elevation.toFixed(1)+"m":"--"})]}),C.jsx("div",{className:"status-sep"}),C.jsx("div",{className:"status-group",children:C.jsx("span",{className:"status-rock",children:n?n.rockName:"--"})}),C.jsx("div",{style:{flex:1}}),C.jsxs("div",{className:"status-group",children:[C.jsx("span",{className:"status-label",children:"Tool"}),C.jsx("span",{className:"status-value",style:{color:"var(--accent)"},children:t})]})]})}const uR=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];function fR(n){return uR[Math.round(n/22.5)%16]}const ag=[1,2,5,10,20,50,100,200,500,1e3,2e3,5e3];function hR(n){let e=ag[0];for(const t of ag)t<=n&&(e=t);return e}function dR(n){return n>=1e3?(n/1e3).toFixed(1)+" km":n+" m"}function pR(){const n=Kc(),e=at.useRef(null),t=at.useRef(null);return at.useEffect(()=>{let i;const r=()=>{i=requestAnimationFrame(r);const s=n==null?void 0:n.current,o=e.current;if(!s||!o)return;const a=s.getCameraDirection();let l=Math.atan2(a.x,a.z)*180/Math.PI;l=(l+360)%360,mR(o,l),t.current&&(t.current.textContent=`${Math.round(l)}° ${fR(l)}`)};return i=requestAnimationFrame(r),()=>cancelAnimationFrame(i)},[n]),C.jsxs("div",{id:"compass-container",children:[C.jsx("canvas",{ref:e,id:"compass-canvas",width:280,height:280}),C.jsx("div",{ref:t,id:"compass-bearing",children:"--"})]})}function mR(n,e){const t=n.getContext("2d"),i=n.width,r=n.height,s=i/2,o=r/2,a=s-16;t.clearRect(0,0,i,r),t.beginPath(),t.arc(s,o,a+8,0,Math.PI*2),t.fillStyle="rgba(13,17,23,0.88)",t.fill(),t.strokeStyle="rgba(88,166,255,0.2)",t.lineWidth=1,t.stroke(),t.beginPath(),t.arc(s,o,a,0,Math.PI*2),t.strokeStyle="rgba(255,255,255,0.15)",t.lineWidth=1,t.stroke(),t.save(),t.translate(s,o),t.rotate(-e*Math.PI/180);for(let c=0;c<360;c+=2){const u=(c-90)*Math.PI/180,f=c%90===0,h=c%30===0,p=c%10===0,v=f?a-18:h?a-12:p?a-8:a-5;t.beginPath(),t.moveTo(v*Math.cos(u),v*Math.sin(u)),t.lineTo((a-1)*Math.cos(u),(a-1)*Math.sin(u)),t.strokeStyle=f?"#fff":h?"rgba(255,255,255,0.5)":p?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.1)",t.lineWidth=f?2:1,t.stroke()}const l=[{l:"N",d:0,c:"#f85149"},{l:"E",d:90,c:"#e6edf3"},{l:"S",d:180,c:"#e6edf3"},{l:"W",d:270,c:"#e6edf3"}];t.font="bold 16px Inter, sans-serif",t.textAlign="center",t.textBaseline="middle",l.forEach(({l:c,d:u,c:f})=>{const h=(u-90)*Math.PI/180;t.fillStyle=f,t.fillText(c,(a-30)*Math.cos(h),(a-30)*Math.sin(h))}),t.font="10px JetBrains Mono, monospace",t.fillStyle="rgba(255,255,255,0.4)";for(let c=0;c<360;c+=30){if(c%90===0)continue;const u=(c-90)*Math.PI/180;t.fillText(c.toString(),(a-30)*Math.cos(u),(a-30)*Math.sin(u))}t.restore(),t.save(),t.translate(s,o),t.beginPath(),t.moveTo(0,-(a-42)),t.lineTo(-5,0),t.lineTo(5,0),t.closePath(),t.fillStyle="#f85149",t.fill(),t.beginPath(),t.moveTo(0,a-42),t.lineTo(-5,0),t.lineTo(5,0),t.closePath(),t.fillStyle="rgba(255,255,255,0.4)",t.fill(),t.beginPath(),t.arc(0,0,4,0,Math.PI*2),t.fillStyle="#58a6ff",t.fill(),t.restore()}function gR(){const n=Kc(),e=at.useRef(null),t=at.useRef(null);return at.useEffect(()=>{let i;const r=()=>{i=requestAnimationFrame(r);const s=n==null?void 0:n.current;if(!s||!e.current)return;const{worldPerPixel:o}=s.getScaleData(),l=o*120,c=hR(l),u=c/o;e.current.style.width=u+"px",t.current.textContent=dR(c)};return i=requestAnimationFrame(r),()=>cancelAnimationFrame(i)},[n]),C.jsxs(C.Fragment,{children:[C.jsx("div",{id:"crosshair"}),C.jsxs("div",{id:"scale-bar-container",children:[C.jsx("div",{ref:e,id:"scale-bar-line",style:{width:100}}),C.jsx("div",{ref:t,id:"scale-bar-label",children:"--"})]})]})}function vR(){const n=Je(i=>i.loadingProgress),e=Je(i=>i.loadingMessage),t=Je(i=>i.isLoaded);return C.jsxs("div",{id:"loading-screen",className:t?"done":"",children:[C.jsx("div",{className:"loading-title",children:"Structural Geology Simulator"}),C.jsx("div",{className:"loading-sub",children:e}),C.jsx("div",{className:"loading-bar",children:C.jsx("div",{className:"loading-fill",style:{width:`${n}%`}})})]})}function xR(){const n=Je(s=>s.rockPopup),e=Je(s=>s.hideRockPopup),t=at.useRef(null),i=at.useCallback(s=>{t.current&&!t.current.contains(s.target)&&e()},[e]);if(at.useEffect(()=>{if(n)return document.addEventListener("pointerdown",i),()=>document.removeEventListener("pointerdown",i)},[n,i]),!n)return null;const r=[["Minerals",n.minerals.join(", ")],["Grain Size",n.grainSize],["Texture",n.texture],["Fossils",n.fossils||"None"],["Age",n.age],["Characteristics",n.characteristics]];return C.jsxs("div",{id:"rock-popup",ref:t,children:[C.jsx("button",{className:"popup-close",onClick:e,children:"×"}),C.jsxs("div",{className:"popup-title",children:[C.jsx("div",{className:"popup-swatch",style:{background:n.color}}),C.jsx("span",{children:n.name})]}),C.jsx("div",{className:"popup-grid",children:r.map(([s,o])=>C.jsxs("div",{children:[C.jsx("div",{className:"popup-field-label",children:s}),C.jsx("div",{className:"popup-field-value",children:o})]},s))})]})}function _R(){const n=at.useRef(null),e=bb(n);return Rb(),C.jsxs(t1,{engineRef:e,children:[C.jsx(Pb,{ref:n}),C.jsx(vR,{}),C.jsx(Vb,{}),C.jsx(lR,{}),C.jsx(cR,{}),C.jsx(pR,{}),C.jsx(gR,{}),C.jsx(xR,{})]})}Ef.createRoot(document.getElementById("root")).render(C.jsx(_R,{}));export{Xb as _,yR as c,lg as g};
