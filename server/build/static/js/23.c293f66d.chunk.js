(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[23],{1321:function(e,t,n){"use strict";n.r(t);var a=n(1353),i=n(1354),c=n(252),r=n(870),o=n(189),s=n(254),l=n(158),d=n(374),b=n(1),j=n.n(b),h=n(595),u=n.n(h),x=n(24),m=n(749),p=n(774),O=n(176),f=n(157),g=n(2),y=Object(c.a)(m.a)((function(){return{display:"flex",alignItems:"center",minHeight:d.c,"@media (max-width: 499px)":{display:"table",width:"100%",minHeight:"auto",padding:"1rem 0","& .container":{flexDirection:"column !important","& a":{margin:"0 0 16px !important"}}}}})),v=Object(c.a)("div")((function(){return{width:"100%",display:"flex",alignItems:"center",padding:"0px 1rem",maxWidth:"1170px",margin:"0 auto"}})),w=function(){var e=Object(o.a)(),t=Object(l.a)().settings,n=t.themes[t.footer.theme]||e;return Object(g.jsx)(i.a,{theme:n,children:Object(g.jsx)(p.a,{color:"primary",position:"static",sx:{zIndex:96},children:Object(g.jsx)(y,{children:Object(g.jsxs)(v,{children:[Object(g.jsxs)(f.c,{sx:{m:0},children:["Version: ",O.a.VERSION]}),Object(g.jsx)(f.e,{sx:{m:"auto"}}),Object(g.jsx)(f.c,{children:"Gleren Technologies Pvt Ltd"})]})})})})},S=n(32),k=function(e){var t=e.children,n=Object(S.a)(),a=Object(l.a)().settings,c=a.themes[a.layout1Settings.leftSidebar.theme]||n;return Object(g.jsx)(i.a,{theme:c,children:t})},I=function(e){var t=e.theme,n=(e.classes,e.children);e.open;return Object(g.jsx)(i.a,{theme:t,children:n})},C=n(460),z=n(456),L=n(17),D=n(9),R=n(5),T=n(571),N=n(116),B=n(866),P=n(570),_=n(462),H=n(845),W=n(328),G=n(834),E=Object(R.a)(G.a)((function(){return{top:"0",right:"0",height:"32px",width:"32px",borderRadius:"50%"}})),F=Object(R.a)(f.e)((function(e){var t=e.theme;return{fontWeight:700,fontSize:"1rem",cursor:"pointer",borderRadius:"4px",marginBottom:"2.5rem",letterSpacing:"1.5px",padding:".25rem .5rem",transform:"rotate(90deg)",color:t.palette.secondary.main,backgroundColor:t.palette.primary.dark,"&:hover, &.open":{backgroundColor:t.palette.secondary.main,color:t.palette.secondary.contrastText}}})),M=Object(R.a)("div")((function(e){var t=e.theme;return{top:0,right:0,zIndex:50,width:320,display:"flex",height:"100vh",position:"fixed",paddingBottom:"32px",flexDirection:"column",boxShadow:W.b[12],background:t.palette.background.default,"& .helpText":{margin:"0px .5rem 1rem"}}})),U=Object(R.a)(E)((function(){return{width:"100%",height:"152px !important",cursor:"pointer",marginTop:"12px",marginBottom:"12px","& .layout-name":{display:"none"},"&:hover .layout-name":{zIndex:12,width:"100%",height:"100%",display:"flex",alignItems:"center",position:"absolute",justifyContent:"center",background:"rgba(0,0,0,0.3)"}}})),A=Object(R.a)("div")((function(){return{minHeight:58,display:"flex",alignItems:"center",marginBottom:"16px",padding:"14px 20px",boxShadow:W.b[6],justifyContent:"space-between"}})),X=Object(R.a)("img")((function(){return{width:"100%"}})),J=Object(R.a)(u.a)((function(){return{paddingLeft:"16px",paddingRight:"16px"}})),V=[{isPro:!1,name:"Light Sidebar",thumbnail:"/assets/images/screenshots/layout1-customizer.png",options:{activeTheme:"blue",activeLayout:"layout1",layout1Settings:{topbar:{theme:"blueDark",fixed:!0},leftSidebar:{mode:"full",theme:"whiteBlue",bgOpacity:.98}},footer:{theme:"slateDark1"}}},{isPro:!1,name:"Compact Sidebar",thumbnail:"/assets/images/screenshots/layout5-customizer.png",options:{activeTheme:"blue",activeLayout:"layout1",layout1Settings:{topbar:{theme:"whiteBlue",fixed:!0},leftSidebar:{mode:"compact",theme:"slateDark1",bgOpacity:.92}}}},{isPro:!1,name:"Dark Sidebar",thumbnail:"/assets/images/screenshots/layout1-blue-customizer.png",options:{activeTheme:"blue",activeLayout:"layout1",layout1Settings:{topbar:{theme:"blueDark",fixed:!0},leftSidebar:{mode:"full",theme:"slateDark1",bgOpacity:.92}}}}],$=function(){var e=Object(S.a)(),t=Object(b.useState)(!1),n=Object(D.a)(t,2),a=n[0],c=n[1],r=Object(b.useState)(0),o=Object(D.a)(r,2),s=o[0],d=(o[1],Object(l.a)()),j=d.settings,h=d.updateSettings,u=e.palette.text.secondary,x=function(){return c(!a)},m=Object(L.a)({},j.themes[j.activeTheme]);return Object(g.jsxs)(b.Fragment,{children:[Object(g.jsx)(T.a,{title:"Theme Settings",placement:"left",children:Object(g.jsx)(F,{className:"open",onClick:x,children:"DEMOS"})}),Object(g.jsx)(i.a,{theme:m,children:Object(g.jsx)(N.a,{open:a,anchor:"right",variant:"temporary",onClose:x,ModalProps:{keepMounted:!0},children:Object(g.jsxs)(M,{children:[Object(g.jsxs)(A,{children:[Object(g.jsxs)(B.a,{display:"flex",children:[Object(g.jsx)(z.a,{className:"icon",color:"primary",children:"settings"}),Object(g.jsx)(f.a,{sx:{ml:1,fontSize:"1rem"},children:"Theme Settings"})]}),Object(g.jsx)(C.a,{onClick:x,children:Object(g.jsx)(z.a,{className:"icon",children:"close"})})]}),Object(g.jsxs)(J,{options:{suppressScrollX:!0},children:[0===s&&Object(g.jsxs)(B.a,{sx:{mb:4,mx:3},children:[Object(g.jsx)(B.a,{sx:{color:u},children:"Layouts"}),Object(g.jsx)(B.a,{display:"flex",flexDirection:"column",children:V.map((function(e){return Object(g.jsx)(U,{color:"secondary",badgeContent:"Pro",invisible:!e.isPro,children:Object(g.jsxs)(P.a,{elevation:4,sx:{position:"relative"},onClick:function(){return h(e.options)},children:[Object(g.jsx)(B.a,{sx:{overflow:"hidden"},className:"layout-name",children:Object(g.jsx)(_.a,{variant:"contained",color:"secondary",children:e.name})}),Object(g.jsx)(X,{src:e.thumbnail,alt:e.name})]})},e.name)}))})]}),1===s&&Object(g.jsx)("div",{children:Object(g.jsxs)("div",{className:"helpText",children:["We used React context API to control layout. Check out the"," ",Object(g.jsx)(H.a,{href:"http://demos.ui-lib.com/matx-react-doc/layout.html",target:"_blank",children:"Documentation"})]})})]})]})})})]})},Y=n(594),q=n(197),K=n(314),Q=Object(c.a)(C.a)((function(e){var t=e.theme;return{"& span":{color:t.palette.text.primary},"& #disable":{color:t.palette.text.disabled}}})),Z=Object(c.a)("div")((function(e){e.theme;return{height:"100%",display:"flex",flexDirection:"column",width:d.a}})),ee=Object(c.a)("div")((function(){return{padding:"4px",paddingLeft:"16px",display:"flex",alignItems:"center",boxShadow:W.b[6],height:d.c,"& h5":{marginTop:0,marginBottom:0,marginLeft:"16px",fontWeight:"500"}}})),te=Object(c.a)("div")((function(){return{display:"flex",alignItems:"center",padding:"8px 8px",transition:"background 300ms ease","&:hover":{background:"rgba(0,0,0,0.01)"}}})),ne=Object(c.a)("img")((function(){return{width:48}})),ae=Object(c.a)("div")((function(){return{marginRight:"8",textAlign:"center",flexGrow:1,display:"flex",flexDirection:"column","& h6":{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"block",width:120,marginBottom:"4px"}}})),ie=!1;var ce=function(e){var t=e.container,n=Object(b.useState)(0),a=Object(D.a)(n,2),c=a[0],s=a[1],d=Object(b.useState)(!1),j=Object(D.a)(d,2),h=j[0],u=j[1],m=Object(K.c)(),p=Object(x.l)(),O=Object(Y.a)().user,y=Object(K.d)((function(e){return e.ecommerce})).cartList,v=Object(l.a)().settings,w=Object(o.a)().palette.text.secondary;ie||(m(Object(q.j)(O.id)),ie=!0);var S=function(){u(!h)};Object(b.useEffect)((function(){var e=0;y.forEach((function(t){e+=t.price*t.amount})),s(e)}),[y]);var k=Object(o.a)().palette.text.primary;return Object(g.jsxs)(b.Fragment,{children:[Object(g.jsx)(C.a,{onClick:S,children:Object(g.jsx)(G.a,{color:"secondary",badgeContent:y.length,children:Object(g.jsx)(z.a,{sx:{color:k},children:"shopping_cart"})})}),Object(g.jsx)(i.a,{theme:v.themes[v.activeTheme],children:Object(g.jsx)(N.a,{container:t,variant:"temporary",anchor:"right",open:h,onClose:S,ModalProps:{keepMounted:!0},children:Object(g.jsxs)(Z,{children:[Object(g.jsxs)(ee,{children:[Object(g.jsx)(z.a,{color:"primary",children:"shopping_cart"}),Object(g.jsx)("h5",{children:"Cart"})]}),Object(g.jsx)(r.a,{flexGrow:1,overflow:"auto",children:y.map((function(e){return Object(g.jsxs)(te,{children:[Object(g.jsxs)(r.a,{mr:"4px",display:"flex",flexDirection:"column",children:[Object(g.jsx)(Q,{size:"small",onClick:function(){return m(Object(q.k)(O.id,e.id,e.amount+1))},children:Object(g.jsx)(z.a,{sx:{cursor:"pinter"},children:"keyboard_arrow_up"})}),Object(g.jsx)(Q,{disabled:!(e.amount-1),size:"small",onClick:function(){return m(Object(q.k)(O.id,e.id,e.amount-1))},children:Object(g.jsx)(z.a,{id:!(e.amount-1)&&"disable",children:"keyboard_arrow_down"})})]}),Object(g.jsx)(r.a,{mr:1,children:Object(g.jsx)(ne,{src:e.imgUrl,alt:e.title})}),Object(g.jsxs)(ae,{children:[Object(g.jsx)(f.b,{children:e.title}),Object(g.jsxs)(f.d,{sx:{color:w},children:["$",e.price," x ",e.amount]})]}),Object(g.jsx)(Q,{size:"small",onClick:function(){return m(Object(q.i)(O.userId,e.id))},children:Object(g.jsx)(z.a,{fontSize:"small",children:"clear"})})]},e.id)}))}),Object(g.jsxs)(_.a,{sx:{width:"100%",borderRadius:0},variant:"contained",color:"primary",onClick:function(){c>0&&(p("/ecommerce/checkout"),u(!1))},children:["Checkout ($",c.toFixed(2),")"]})]})})})]})},re=Object(c.a)("div")((function(e){var t=e.theme;return{position:"fixed",height:"100vh",width:e.width,right:0,bottom:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:t.shadows[8],backgroundColor:t.palette.primary.main,zIndex:98,transition:"all 0.15s ease",color:t.palette.text.primary,"@global":{"@media screen and (min-width: 767px)":{".content-wrap, .layout2.layout-contained, .layout2.layout-full":{marginRight:function(e){return e.width}},".matx-customizer":{right:function(e){return e.width}}},"@media screen and (max-width: 959px)":{".toolbar-menu-wrap .menu-area":{width:function(e){return"calc(100% - ".concat(e.width,")")}}}}}})),oe=function(){var e=Object(o.a)().palette.primary.contrastText;return Object(g.jsxs)(re,{width:"50px",className:"secondary-sidebar",children:[Object(g.jsx)(f.e,{sx:{m:"auto"}}),Object(g.jsx)($,{}),Object(g.jsx)(ce,{}),Object(g.jsx)(s.c,{icon:Object(g.jsx)(C.a,{sx:{my:"12px",color:e},size:"small",children:Object(g.jsx)(z.a,{children:"comments"})}),children:Object(g.jsx)(s.d,{})}),Object(g.jsx)(f.e,{sx:{m:"auto"}})]})},se=n(471),le=n(8),de=Object(c.a)("div")((function(){return{position:"fixed",right:"30px",bottom:"50px",zIndex:99,transition:"all 0.15s ease","&.open":{right:"10px"}}})),be=function(){var e=Object(l.a)(),t=e.settings,n=e.updateSettings,a=function(){n({secondarySidebar:{open:!t.secondarySidebar.open}})},i=Object(o.a)().palette.primary.contrastText;return Object(g.jsxs)(de,{className:Object(le.a)({open:t.secondarySidebar.open}),children:[t.secondarySidebar.open&&Object(g.jsx)(C.a,{onClick:a,size:"small","aria-label":"toggle",children:Object(g.jsx)(z.a,{sx:{color:i},children:"close"})}),!t.secondarySidebar.open&&Object(g.jsx)(se.a,{color:"primary","aria-label":"expand",onClick:a,sx:{display:"none"},children:Object(g.jsx)(z.a,{sx:{color:"textColor"},children:"settings"})})]})},je=function(){var e=Object(l.a)().settings,t=e.themes[e.secondarySidebar.theme];return Object(g.jsxs)(I,{theme:t,children:[e.secondarySidebar.open&&Object(g.jsx)(oe,{}),Object(g.jsx)(be,{})]})},he=n(578),ue=n(788),xe=n(329),me="HelpDesk",pe=Object(R.a)(B.a)((function(){return{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 18px 20px 29px"}})),Oe=Object(R.a)(f.e)((function(e){return{fontSize:18,marginLeft:".5rem",display:"compact"===e.mode?"none":"block"}})),fe=Object(R.a)("img")((function(){return{width:"100%",height:"auto"}})),ge=function(e){var t=e.children,n=Object(l.a)().settings.layout1Settings.leftSidebar.mode;return Object(g.jsxs)(pe,{children:[Object(g.jsxs)(B.a,{display:"flex",alignItems:"center",children:[Object(g.jsx)(fe,{src:"/assets/modified/logo_bg.png",alt:"",className:"mx-auto"}),Object(g.jsx)(Oe,{mode:n,className:"sidenavHoverShow",children:me})]}),Object(g.jsx)(B.a,{className:"sidenavHoverShow",sx:{display:"compact"===n?"none":"block"},children:t||null})]})},ye=n(4),ve=n(724),we=Object(c.a)(u.a)((function(){return{paddingLeft:"1rem",paddingRight:"1rem",position:"relative"}})),Se=Object(c.a)("div")((function(e){var t=e.theme;return Object(ye.a)({position:"fixed",top:0,left:0,bottom:0,right:0,width:"100vw",background:"rgba(0, 0, 0, 0.54)",zIndex:-1},t.breakpoints.up("lg"),{display:"none"})})),ke=function(e){var t=e.children,n=Object(l.a)(),a=n.settings,i=n.updateSettings;return Object(g.jsxs)(b.Fragment,{children:[Object(g.jsxs)(we,{options:{suppressScrollX:!0},children:[t,Object(g.jsx)(s.j,{items:ve.a})]}),Object(g.jsx)(Se,{onClick:function(){return function(e){var t=a.activeLayout+"Settings",n=a[t];i(Object(L.a)(Object(L.a)({},a),{},Object(ye.a)({},t,Object(L.a)(Object(L.a)({},n),{},{leftSidebar:Object(L.a)(Object(L.a)({},n.leftSidebar),e)}))))}({mode:"close"})}})]})},Ie=Object(c.a)(r.a)((function(e){var t=e.theme,n=e.width,a=e.primaryBg,i=e.bgImgURL;return{position:"fixed",top:0,left:0,height:"100vh",width:n,boxShadow:W.b[8],backgroundRepeat:"no-repeat",backgroundPosition:"top",backgroundSize:"cover",zIndex:111,overflow:"hidden",color:t.palette.text.primary,transition:"all 250ms ease-in-out",backgroundImage:"linear-gradient(to bottom, rgba(".concat(a,", 0.96), rgba(").concat(a,", 0.96)), url(").concat(i,")"),"&:hover":{width:d.a,"& .sidenavHoverShow":{display:"block"},"& .compactNavItem":{width:"100%",maxWidth:"100%","& .nav-bullet":{display:"block"},"& .nav-bullet-text":{display:"none"}}}}})),Ce=Object(c.a)(r.a)((function(){return{height:"100%",display:"flex",flexDirection:"column"}})),ze=function(){var e=Object(o.a)(),t=Object(l.a)(),n=t.settings,a=t.updateSettings,i=n.layout1Settings.leftSidebar,c=i.mode,r=i.bgImgURL,s=Object(xe.a)(e.palette.primary.main);return Object(g.jsx)(Ie,{bgImgURL:r,primaryBg:s,width:"compact"===c?d.b:d.a,children:Object(g.jsxs)(Ce,{children:[Object(g.jsx)(ge,{children:Object(g.jsx)(he.a,{smDown:!0,children:Object(g.jsx)(ue.a,{onChange:function(){var e;e={mode:"compact"===c?"full":"compact"},a({layout1Settings:{leftSidebar:Object(L.a)({},e)}})},checked:"full"!==i.mode,color:"secondary",size:"small"})})}),Object(g.jsx)(ke,{})]})})},Le=j.a.memo(ze),De=n(746),Re=n(582),Te=(n(25),n(44),n(67),n(97)),Ne=(Object(c.a)("div")((function(){return{padding:"16px",marginBottom:"16px",display:"flex",alignItems:"center",height:d.c,boxShadow:W.b[6],"& h5":{marginLeft:"8px",marginTop:0,marginBottom:0,fontWeight:"500"}}})),Object(c.a)(r.a)((function(e){return{position:"relative","&:hover":{"& .messageTime":{display:"none"},"& .deleteButton":{opacity:"1"}},"& .messageTime":{color:e.theme.palette.text.secondary},"& .icon":{fontSize:"1.25rem"}}})),Object(c.a)(C.a)((function(e){e.theme;return{opacity:"0",position:"absolute",right:5,marginTop:9,marginRight:"24px",background:"rgba(0, 0, 0, 0.01)"}})),Object(c.a)("div")((function(e){return{padding:"12px 8px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0, 0, 0, 0.01)","& small":{fontWeight:"500",marginLeft:"16px",color:e.theme.palette.text.secondary}}})),Object(c.a)("span")((function(e){return{fontWeight:"500",marginLeft:"16px",color:e.theme.palette.text.secondary}})),n(77),n(50),n(593)),Be=Object(c.a)(C.a)((function(e){return{color:e.theme.palette.text.primary}})),Pe=Object(c.a)("div")((function(e){e.theme;return{top:0,zIndex:96,transition:"all 0.3s ease",boxShadow:W.b[8],height:d.c}})),_e=Object(c.a)(r.a)((function(e){var t,n=e.theme;return t={padding:"8px",paddingLeft:18,paddingRight:20,height:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:n.palette.primary.main},Object(ye.a)(t,n.breakpoints.down("sm"),{paddingLeft:16,paddingRight:16}),Object(ye.a)(t,n.breakpoints.down("xs"),{paddingLeft:14,paddingRight:16}),t})),He=Object(c.a)(r.a)((function(){return{display:"flex",alignItems:"center",cursor:"pointer",borderRadius:24,padding:4,"& span":{margin:"0 8px"}}})),We=Object(c.a)(De.a)((function(e){return{display:"flex",alignItems:"center",minWidth:185,"& a":{width:"100%",display:"flex",alignItems:"center",textDecoration:"none"},"& span":{marginRight:"10px",color:e.theme.palette.text.primary}}})),Ge=Object(c.a)("div")((function(e){var t=e.theme;return Object(ye.a)({display:"inherit"},t.breakpoints.down("md"),{display:"none !important"})})),Ee=function(){var e=Object(o.a)(),t=Object(l.a)(),n=t.settings,i=t.updateSettings,d=Object(Y.a)(),j=d.logout,h=d.user,u=Object(a.a)(e.breakpoints.down("md")),x=Object(b.useState)({avatar:"",raw:""}),m=Object(D.a)(x,2),p=m[0],O=m[1],y=Object(Te.d)();Object(D.a)(y,1)[0].get("updated");Object(b.useEffect)((function(){Object(Ne.f)().then((function(e){O(Object(L.a)(Object(L.a)({},p),{},{avatar:null===e||void 0===e?void 0:e.data}))})).catch((function(e){console.log(e)}))}),[]);Object(c.a)("img")((function(){return{width:"100%",height:"auto"}}));var v=Object(c.a)("div")((function(){return{width:"260px",height:"40px"}}));return Object(g.jsx)(Pe,{children:Object(g.jsxs)(_e,{children:[Object(g.jsxs)(r.a,{display:"flex",children:[Object(g.jsx)(Be,{onClick:function(){var e,t,a=n.layout1Settings;e=u?"close"===a.leftSidebar.mode?"mobile":"close":"full"===a.leftSidebar.mode?"close":"full",t={mode:e},i({layout1Settings:{leftSidebar:Object(L.a)({},t)}})},children:Object(g.jsx)(z.a,{children:"menu"})}),Object(g.jsx)(Ge,{children:Object(g.jsx)(Be,{children:Object(g.jsx)(Te.b,{to:"/create-ticket",children:Object(g.jsx)(se.a,{size:"small",color:"secondary","aria-label":"Add",className:"button",children:Object(g.jsx)(z.a,{children:"add"})})})})})]}),Object(g.jsx)(v,{}),Object(g.jsx)(r.a,{display:"flex",alignItems:"center",children:Object(g.jsxs)(s.f,{menuButton:Object(g.jsxs)(He,{children:[Object(g.jsx)(he.a,{xsDown:!0,children:Object(g.jsxs)(f.e,{children:["Hi,",Object(g.jsxs)("strong",{children:[h.firstName," ",h.lastName]})]})}),Object(g.jsx)("div",{children:Object(g.jsx)("label",{htmlFor:"upload-button",children:p.avatar?Object(g.jsx)("img",{src:p.avatar,alt:"dummy",width:"40",height:"40",style:{borderRadius:"50%"}}):Object(g.jsx)(g.Fragment,{children:Object(g.jsx)(Re.a,{src:h.avatar,sx:{cursor:"pointer"}})})})})]}),children:[Object(g.jsx)(We,{children:Object(g.jsxs)(Te.b,{to:"/",children:[Object(g.jsx)(z.a,{children:" home "}),Object(g.jsx)(f.e,{children:" Home "})]})}),Object(g.jsx)(We,{children:Object(g.jsxs)(Te.b,{to:"/user-profile",children:[Object(g.jsx)(z.a,{children:" person "}),Object(g.jsx)(f.e,{children:" Profile "})]})}),Object(g.jsxs)(We,{onClick:j,children:[Object(g.jsx)(z.a,{children:" power_settings_new "}),Object(g.jsx)(f.e,{children:" Logout "})]})]})})]})})},Fe=j.a.memo(Ee),Me=Object(c.a)(r.a)((function(e){return{display:"flex",background:e.theme.palette.background.default}})),Ue=Object(c.a)(r.a)((function(){return{height:"100%",display:"flex",overflowY:"auto",overflowX:"hidden",flexDirection:"column",justifyContent:"space-between"}})),Ae=Object(c.a)(u.a)((function(){return{height:"100%",position:"relative",display:"flex",flexGrow:"1",flexDirection:"column"}})),Xe=Object(c.a)(r.a)((function(e){return{height:"100vh",display:"flex",flexGrow:"1",flexDirection:"column",verticalAlign:"top",marginLeft:e.width,position:"relative",overflow:"hidden",transition:"all 0.3s ease",marginRight:e.secondarySidebar.open?50:0}})),Je=function(){var e=Object(l.a)(),t=e.settings,n=e.updateSettings,c=t.layout1Settings,j=t.secondarySidebar,h=t.themes[c.topbar.theme],u=c.leftSidebar,m=u.mode,p=u.show,O=function(){switch(m){case"full":return d.a;case"compact":return d.b;default:return"0px"}}(),f=Object(o.a)(),y=Object(a.a)(f.breakpoints.down("md")),v=Object(b.useRef)({isMdScreen:y,settings:t}),S="theme-".concat(f.palette.type);return Object(b.useEffect)((function(){var e=v.current.settings,t=e.layout1Settings.leftSidebar.mode;e.layout1Settings.leftSidebar.show&&n({layout1Settings:{leftSidebar:{mode:y?"close":t}}})}),[y]),Object(g.jsxs)(Me,{className:S,children:[p&&"close"!==m&&Object(g.jsx)(k,{children:Object(g.jsx)(Le,{})}),Object(g.jsxs)(Xe,{width:O,secondarySidebar:j,children:[c.topbar.show&&c.topbar.fixed&&Object(g.jsx)(i.a,{theme:h,children:Object(g.jsx)(Fe,{fixed:!0,className:"elevation-z8"})}),t.perfectScrollbar&&Object(g.jsxs)(Ae,{children:[c.topbar.show&&!c.topbar.fixed&&Object(g.jsx)(i.a,{theme:h,children:Object(g.jsx)(Fe,{})}),Object(g.jsx)(r.a,{flexGrow:1,position:"relative",children:Object(g.jsx)(s.h,{children:Object(g.jsx)(x.b,{})})}),t.footer.show&&!t.footer.fixed&&Object(g.jsx)(w,{})]}),!t.perfectScrollbar&&Object(g.jsxs)(Ue,{children:[c.topbar.show&&!c.topbar.fixed&&Object(g.jsx)(i.a,{theme:h,children:Object(g.jsx)(Fe,{})}),Object(g.jsx)(r.a,{flexGrow:1,position:"relative",children:Object(g.jsx)(s.h,{children:Object(g.jsx)(x.b,{})})}),t.footer.show&&!t.footer.fixed&&Object(g.jsx)(w,{})]}),t.footer.show&&t.footer.fixed&&Object(g.jsx)(w,{})]}),t.secondarySidebar.show&&Object(g.jsx)(je,{})]})};t.default=j.a.memo(Je)}}]);
//# sourceMappingURL=23.c293f66d.chunk.js.map