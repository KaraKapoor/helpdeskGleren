(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[10],{1486:function(e,t,n){"use strict";var a=n(47);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=a(n(156)),i=n(2),r=(0,c.default)((0,i.jsx)("path",{d:"M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"}),"Send");t.default=r},1487:function(e,t,n){"use strict";var a=n(47);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=a(n(156)),i=n(2),r=(0,c.default)((0,i.jsx)("path",{d:"M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13 3.74 7.84 12 3l8.26 4.84L12 13z"}),"Drafts");t.default=r},1488:function(e,t,n){"use strict";var a=n(47);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=a(n(156)),i=n(2),r=(0,c.default)((0,i.jsx)("path",{d:"M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm-3-5h-2V7h-4v3H8l4 4 4-4z"}),"MoveToInbox");t.default=r},1590:function(e,t,n){"use strict";n.r(t);var a=n(4),c=n(1358),i=n(253),r=n(870),o=n(255),l=n(9),s=n(1487),u=n.n(s),j=n(1488),d=n.n(j),b=n(1486),h=n.n(b),m=n(462),O=n(782),p=n(767),x=n(448),f=n(746),v=n(1),k=n.n(v),g=n(2),C=Object(i.a)(f.a)((function(e){var t=e.theme;return{"&:focus":{backgroundColor:t.palette.primary.main,"& .MuiListItemIcon-root, & .MuiListItemText-primary":{color:t.palette.common.white}}}}));var M=function(){var e=k.a.useState(null),t=Object(l.a)(e,2),n=t[0],a=t[1];return Object(g.jsxs)("div",{children:[Object(g.jsx)(m.a,{color:"primary",variant:"contained","aria-haspopup":"true",onClick:function(e){a(e.currentTarget)},"aria-owns":n?"simple-menu":void 0,children:"Open Menu"}),Object(g.jsxs)(x.a,{elevation:0,id:"simple-menu",anchorEl:n,onClose:function(){a(null)},open:Boolean(n),getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"},sx:{border:"1px solid #d3d4d5"},children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(O.a,{children:Object(g.jsx)(h.a,{})}),Object(g.jsx)(p.a,{primary:"Sent mail"})]}),Object(g.jsxs)(C,{children:[Object(g.jsx)(O.a,{children:Object(g.jsx)(u.a,{})}),Object(g.jsx)(p.a,{primary:"Drafts"})]}),Object(g.jsxs)(C,{children:[Object(g.jsx)(O.a,{children:Object(g.jsx)(d.a,{})}),Object(g.jsx)(p.a,{primary:"Inbox"})]})]})]})},y=n(866),w=n(460),S=n(456),z=["None","Atria","Callisto","Dione","Ganymede","Hangouts Call","Luna","Oberon","Phobos","Pyxis","Sedna","Titania","Triton","Umbriel"];var H=function(){var e=k.a.useState(null),t=Object(l.a)(e,2),n=t[0],a=t[1],c=Boolean(n);function i(){a(null)}return Object(g.jsxs)(y.a,{children:[Object(g.jsx)(w.a,{"aria-label":"More","aria-owns":c?"long-menu":void 0,"aria-haspopup":"true",onClick:function(e){a(e.currentTarget)},children:Object(g.jsx)(S.a,{children:"more_vert"})}),Object(g.jsx)(x.a,{open:c,id:"long-menu",anchorEl:n,onClose:i,PaperProps:{style:{maxHeight:216,width:200}},children:z.map((function(e){return Object(g.jsx)(f.a,{selected:"Pyxis"===e,onClick:i,children:e},e)}))})]})},P=n(718),I=n(779),T=Object(i.a)("div")((function(e){return{width:"100%",maxWidth:360,backgroundColor:e.theme.palette.background.paper}})),L=["Show some love to Material-UI","Show all notification content","Hide sensitive notification content","Hide all notification content"];function _(){var e=k.a.useState(null),t=Object(l.a)(e,2),n=t[0],a=t[1],c=k.a.useState(1),i=Object(l.a)(c,2),r=i[0],o=i[1];return Object(g.jsxs)(T,{children:[Object(g.jsx)(P.a,{component:"nav","aria-label":"Device settings",children:Object(g.jsx)(I.a,{button:!0,"aria-haspopup":"true","aria-controls":"lock-menu","aria-label":"When device is locked",onClick:function(e){a(e.currentTarget)},children:Object(g.jsx)(p.a,{primary:"When device is locked",secondary:L[r]})})}),Object(g.jsx)(x.a,{id:"lock-menu",anchorEl:n,keepMounted:!0,open:Boolean(n),onClose:function(){a(null)},children:L.map((function(e,t){return Object(g.jsx)(f.a,{disabled:0===t,selected:t===r,onClick:function(e){return function(e,t){o(t),a(null)}(0,t)},children:e},e)}))})]})}var B=function(){var e=k.a.useState(null),t=Object(l.a)(e,2),n=t[0],a=t[1];function c(){a(null)}return Object(g.jsxs)(y.a,{children:[Object(g.jsx)(m.a,{variant:"outlined","aria-haspopup":"true",onClick:function(e){a(e.currentTarget)},"aria-owns":n?"simple-menu":void 0,children:"Open Menu"}),Object(g.jsxs)(x.a,{id:"simple-menu",anchorEl:n,open:Boolean(n),onClose:c,children:[Object(g.jsx)(f.a,{onClick:c,children:"Profile"}),Object(g.jsx)(f.a,{onClick:c,children:"My account"}),Object(g.jsx)(f.a,{onClick:c,children:"Logout"})]})]})},E=Object(i.a)("div")((function(e){var t,n=e.theme;return t={margin:"30px"},Object(a.a)(t,n.breakpoints.down("sm"),{margin:16}),Object(a.a)(t,"& .breadcrumb",Object(a.a)({marginBottom:"30px"},n.breakpoints.down("sm"),{marginBottom:16})),t}));t.default=function(){return Object(g.jsxs)(E,{children:[Object(g.jsx)(r.a,{className:"breadcrumb",children:Object(g.jsx)(o.a,{routeSegments:[{name:"Material",path:"/material"},{name:"Menu"}]})}),Object(g.jsxs)(c.a,{spacing:3,children:[Object(g.jsx)(o.k,{title:"simple menu",children:Object(g.jsx)(B,{})}),Object(g.jsx)(o.k,{title:"selected menu",children:Object(g.jsx)(_,{})}),Object(g.jsx)(o.k,{title:"customized menu",children:Object(g.jsx)(M,{})}),Object(g.jsx)(o.k,{title:"max height menu",children:Object(g.jsx)(H,{})})]})]})}}}]);
//# sourceMappingURL=10.731960b4.chunk.js.map