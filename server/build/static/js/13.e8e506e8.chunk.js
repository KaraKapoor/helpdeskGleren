(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[13],{1554:function(e,t,n){},1658:function(e,t,n){"use strict";n.r(t);var i=n(4),o=n(856),r=n(254),a=n(1),s=n.n(a),c=n(14),l=n(9),u=n(751),d=n(884),j=n(1359),h=n(721),b=n(574),f=n(571),m=n(459),p=n(124),x=n(24),O=n(50),g=n.n(O),v=n(258),w=n(58),y=n(206),C=(n(1554),n(2)),B=function(e){var t=Object(a.useState)(),n=Object(l.a)(t,2),i=n[0],o=n[1],r=Object(a.useState)([]),O=Object(l.a)(r,2),B=O[0],k=O[1],F=Object(a.useState)([]),D=Object(l.a)(F,2),I=D[0],S=D[1],N=s.a.useState(!1),P=Object(l.a)(N,2),E=P[0],J=P[1],_=Object(x.l)();console.log(I,"AttachmentsId");var z=function(e){var t,n;J(!0);var i=e.target.files[0];if(null===e||void 0===e||null===(t=e.target)||void 0===t||!t.files[0])return null;var o=new FormData;o.append("file",null===e||void 0===e||null===(n=e.target)||void 0===n?void 0:n.files[0]),Object(w.e)(o).then((function(e){return S((function(t){return[].concat(Object(c.a)(t),[e.data.id])})),!1===(null===e||void 0===e?void 0:e.status)?g.a.fire({icon:"error",title:"Error",text:e.error,showCloseButton:!0,showConfirmButton:!1,width:400}):i.size>1e7?(J(!1),g.a.fire({icon:"error",title:"Please upload a file smaller than 10 MB",text:e.error,showCloseButton:!0,showConfirmButton:!1,width:400})):"image/jpeg"!==(null===i||void 0===i?void 0:i.type)&&"image/jpg"!==(null===i||void 0===i?void 0:i.type)&&"image/png"!==(null===i||void 0===i?void 0:i.type)&&"application/pdf"!==i.type?(J(!1),g.a.fire({icon:"error",title:"Error",text:"File Format Not Supported. Please try with PDF or JPEG/JPG Format.",showCloseButton:!0,showConfirmButton:!1,width:400})):(console.log(e,"resp"),k((function(t){return[].concat(Object(c.a)(t),[e.data])})),void J(!1))}))},M=function(e){null===B||void 0===B||B.splice(e,1),k((function(e){return Object(c.a)(e)}))};return Object(a.useEffect)((function(){M()}),[]),Object(C.jsxs)(d.a,{width:"100%",overflow:"auto",children:[Object(C.jsx)("label",{className:"issueDescription",children:"Issue Description"}),Object(C.jsx)("br",{}),Object(C.jsx)(j.a,{type:"textarea",style:{width:"100%",outline:"none",borderRadius:"5px"},name:"issueDescription",placeholder:"Please tell us in some words which issue you are facing",id:"standard-basic",value:i,onChange:function(e){o(e.target.value)},minRows:20,label:"Issue Description (Min length 4, Max length 9)"}),Object(C.jsx)(v.a,{children:function(e){var t=e.handleBlur;return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)(h.a,{fullWidth:!0,size:"large",name:"files",type:"file",variant:"outlined",onBlur:t,onChange:z,sx:{mt:1,mb:2},value:"",className:"inputStyling"}),Object(C.jsxs)(b.a,{sx:{px:3,py:2,mb:3},children:[Object(C.jsx)(f.a,{children:"Attachments"}),E&&Object(C.jsx)("div",{style:{position:"fixed",backgroundColor:"#00000075",width:"100%",top:"0",left:"0",zIndex:"999",height:"100vh"},children:Object(C.jsx)(y.a,{})}),Object(C.jsx)(a.Fragment,{children:B.map((function(e,t){return Object(C.jsx)(C.Fragment,{children:Object(C.jsxs)("div",{children:[Object(C.jsx)("span",{className:e.original_name?"Datastyling":"",children:e.original_name}),e?Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)("span",{onClick:function(){M(t)},children:Object(C.jsx)(m.a,{className:"icon deleteIcon",children:"delete"})}),Object(C.jsx)("span",{onClick:function(t){var n={keyName:e.key};Object(w.d)(n).then((function(e){window.open(e.data,"_blank")}))},children:Object(C.jsx)(m.a,{className:"icon deleteIcon",children:"file_download"})})]}):""]})})}))})]})]})}}),Object(C.jsx)(u.a,{type:"submit",onClick:function(){if(!i)return g.a.fire({icon:"warning",title:"Warning",text:"Please enter your Issue Description",showCloseButton:!0,showConfirmButton:!1,width:400});try{var e={issueDescription:i,attachment:I};Object(p.r)(e).then((function(e){return!1===e.status?g.a.fire({icon:"error",title:"Error",text:e.error,showCloseButton:!0,showConfirmButton:!1,width:400}):(g.a.fire({icon:"success",title:"Success",text:"Bug Reported Successfully",showCloseButton:!0,showConfirmButton:!1,width:400}),_("/dashboard/default"),null)}))}catch(t){console.log(t)}},color:"primary",variant:"contained",sx:{mb:2,mt:3},children:"Submit"})]})},k=Object(r.a)("div")((function(e){var t=e.theme;return Object(i.a)({margin:"30px"},t.breakpoints.down("sm"),{margin:"16px"})}));t.default=function(){return Object(C.jsx)(a.Fragment,{children:Object(C.jsx)(k,{children:Object(C.jsx)(o.a,{container:!0,spacing:3,children:Object(C.jsx)(o.a,{item:!0,lg:12,md:12,sm:12,xs:12,children:Object(C.jsx)(B,{})})})})})}}}]);
//# sourceMappingURL=13.e8e506e8.chunk.js.map