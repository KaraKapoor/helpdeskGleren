(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[25],{1578:function(e,t,n){"use strict";n.r(t);var a=n(9),i=n(4),o=n(5),r=n(31),c=n(791),s=n(544),l=n(72),d=n(1),p=n(815),m=(n(244),n(151)),u=n(2),b=n(14),x=n(17),j=n(181),h=n(1231),f=function(e){var t=e.height,n=e.color,a=void 0===n?[]:n,i=e.toDoTicketCount,o=e.inProgressTicketsCount,r=Object(j.a)(),c={legend:{show:!0,itemGap:20,icon:"circle",bottom:0,textStyle:{color:r.palette.text.secondary,fontSize:13,fontFamily:"roboto"}},tooltip:{show:!1,trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},xAxis:[{axisLine:{show:!1},splitLine:{show:!1}}],yAxis:[{axisLine:{show:!1},splitLine:{show:!1}}],series:[{name:"Tickets",type:"pie",radius:["45%","72.55%"],center:["50%","50%"],avoidLabelOverlap:!1,hoverOffset:5,stillShowZeroSum:!1,label:{normal:{show:!1,position:"center",textStyle:{color:r.palette.text.secondary,fontSize:13,fontFamily:"roboto"},formatter:"{a}"},emphasis:{show:!0,textStyle:{fontSize:"14",fontWeight:"normal"},formatter:"{b} \n{c} ({d}%)"}},labelLine:{normal:{show:!1}},data:[{value:i>0?i:100,name:"To-Do"},{value:o,name:"In-Progress"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};return Object(u.jsx)(h.a,{style:{height:t},option:Object(x.a)(Object(x.a)({},c),{},{color:Object(b.a)(a)})})},g=n(455),O=n(556),v=(n(786),n(552),n(440)),w=n(445),k=(n(1574),Object(o.a)(m.e)((function(e){var t=e.theme;return Object(i.a)({marginLeft:24,fontWeight:"500"},t.breakpoints.down("sm"),{marginLeft:4})})),Object(o.a)(g.a)((function(){return{marginLeft:0,boxShadow:"none",background:"#08ad6c !important",backgroundColor:"rgba(9, 182, 109, 1) !important"}})),Object(o.a)(g.a)((function(e){var t=e.theme;return{marginLeft:0,boxShadow:"none",color:"white !important",background:"".concat(t.palette.error.main," !important")}})),Object(o.a)(O.a)((function(){return{width:"32px !important",height:"32px !important"}})),n(545)),y=n(91),T=Object(o.a)(s.a)((function(e){var t=e.theme;return Object(i.a)({display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",padding:"24px !important",background:t.palette.background.paper},t.breakpoints.down("sm"),{padding:"16px !important"})})),S=Object(o.a)(p.a)((function(e){var t=e.theme;return{display:"flex",flexWrap:"wrap",alignItems:"center","& small":{color:t.palette.text.secondary},"& .icon":{opacity:.6,fontSize:"44px",color:t.palette.primary.main}}})),C=Object(o.a)("h6")((function(e){return{margin:0,marginTop:"4px",fontSize:"14px",fontWeight:"500",color:e.theme.palette.primary.main}})),z=function(e){var t=e.data,n=[{name:"Assigned Tickets",value:null===t||void 0===t?void 0:t.assignedTicketsCount,icon:"assignment"},{name:"Blocker/Critical Tickets Assigned",value:null===t||void 0===t?void 0:t.assignedBlockerTicketCount,icon:"block"},{name:"Tickets Resolved By Me",value:null===t||void 0===t?void 0:t.resolvedTicketCount,icon:"work"},{name:"Tickets Reviewed By Me",value:null===t||void 0===t?void 0:t.reviewedTicketCount,icon:"rate_review"},{name:"Tickets Tested By Me",value:null===t||void 0===t?void 0:t.testedTicketCount,icon:"bug_report"},{name:"Tickets Created By Me",value:null===t||void 0===t?void 0:t.totalTicketCreatedCount,icon:"create"}];return Object(u.jsx)(c.a,{container:!0,spacing:3,sx:{mb:"24px"},children:n.map((function(e,t){return Object(u.jsx)(c.a,{item:!0,xs:12,md:6,children:Object(u.jsxs)(T,{elevation:6,children:[Object(u.jsxs)(S,{children:[Object(u.jsx)(v.a,{className:"icon",children:e.icon}),Object(u.jsxs)(p.a,{ml:"12px",children:[Object(u.jsx)(m.d,{children:e.name}),Object(u.jsx)(C,{children:e.value})]})]}),Object(u.jsx)(y.b,{to:"/all-tickets",children:Object(u.jsx)(k.a,{title:"View Details",placement:"top",children:Object(u.jsx)(w.a,{children:Object(u.jsx)(v.a,{children:"arrow_right_alt"})})})})]})},t)}))})},L=(n(35),Object(o.a)("div")((function(){return{display:"flex",flexWrap:"wrap",alignItems:"center"}})),Object(o.a)(g.a)((function(){return{width:"44px !important",height:"44px !important",boxShadow:"none !important"}})),Object(o.a)("h3")((function(e){return{margin:0,color:e.textcolor,fontWeight:"500",marginLeft:"12px"}})),Object(o.a)("h1")((function(e){return{margin:0,flexGrow:1,color:e.theme.palette.text.secondary}})),Object(o.a)("span")((function(e){return{fontSize:"13px",color:e.textcolor,marginLeft:"4px"}})),Object(o.a)("div")((function(){return{width:16,height:16,color:"#fff",display:"flex",overflow:"hidden",borderRadius:"300px ",justifyContent:"center","& .icon":{fontSize:"14px"}}})),n(741)),B=(n(558),n(697),n(720),n(704),n(699),n(703),Object(o.a)(p.a)((function(){return{display:"flex",paddingLeft:"24px",paddingRight:"24px",marginBottom:"12px",alignItems:"center",justifyContent:"space-between"}})),Object(o.a)("span")((function(){return{fontSize:"1rem",fontWeight:"500",textTransform:"capitalize"}})),Object(o.a)(L.a)((function(){return{minWidth:400,whiteSpace:"pre","& small":{width:50,height:15,borderRadius:500,boxShadow:"0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"},"& td":{borderBottom:"none"},"& td:first-of-type":{paddingLeft:"16px !important"}}})),Object(o.a)("small")((function(e){return{width:50,height:15,color:"#fff",padding:"2px 8px",borderRadius:"4px",overflow:"hidden",background:e.bgcolor,boxShadow:"0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"}})),n(447)),W=n(366),I=Object(o.a)(s.a)((function(e){var t=e.theme;return Object(i.a)({marginBottom:"24px",padding:"24px !important"},t.breakpoints.down("sm"),{paddingLeft:"16px !important"})})),R=Object(o.a)(s.a)((function(e){var t=e.theme;return Object(i.a)({boxShadow:"none",textAlign:"center",position:"relative",padding:"24px !important",background:"rgb(".concat(Object(W.a)(t.palette.primary.main),", 0.15) !important")},t.breakpoints.down("sm"),{padding:"16px !important"})})),A=Object(o.a)("p")((function(e){return{margin:0,paddingTop:"24px",paddingBottom:"24px",color:e.theme.palette.text.secondary}})),F=function(){return Object(u.jsx)(I,{children:Object(u.jsxs)(R,{elevation:0,children:[Object(u.jsx)("img",{src:"/assets/images/illustrations/upgrade.svg",alt:"upgrade"}),Object(u.jsxs)(A,{children:["Upgrade to ",Object(u.jsx)("b",{children:"BASIC"})," OR ",Object(u.jsx)("b",{children:" PREMIUM Plan"}),"  for ",Object(u.jsx)("br",{})," more features and unlimited user access"]}),Object(u.jsx)(B.a,{size:"large",color:"primary",variant:"contained",sx:{textTransform:"uppercase"},children:"upgrade now"})]})})},M=Object(o.a)("div")((function(e){var t=e.theme;return Object(i.a)({margin:"30px"},t.breakpoints.down("sm"),{margin:"16px"})})),P=Object(o.a)("span")((function(){return{fontSize:"1rem",fontWeight:"500",marginRight:".5rem",textTransform:"capitalize"}}));Object(o.a)("span")((function(e){return{fontSize:"0.875rem",color:e.theme.palette.text.secondary}})),Object(o.a)("h4")((function(e){return{fontSize:"1rem",fontWeight:"500",marginBottom:"16px",textTransform:"capitalize",color:e.theme.palette.text.secondary}})),t.default=function(){var e=Object(r.a)().palette,t=Object(d.useState)(),n=Object(a.a)(t,2),i=n[0],o=n[1];Object(d.useEffect)((function(){p()}),[]);var p=function(){Object(l.f)({}).then((function(e){o(null===e||void 0===e?void 0:e.data)}))};return Object(u.jsx)(d.Fragment,{children:Object(u.jsx)(M,{className:"analytics",children:Object(u.jsxs)(c.a,{container:!0,spacing:3,children:[Object(u.jsx)(c.a,{item:!0,lg:8,md:8,sm:12,xs:12,children:Object(u.jsx)(z,{data:i})}),Object(u.jsxs)(c.a,{item:!0,lg:4,md:4,sm:12,xs:12,children:[Object(u.jsxs)(s.a,{sx:{px:3,py:2,mb:3},children:[Object(u.jsx)(P,{children:"Your Tickets Statistics "}),Object(u.jsx)(f,{height:"300px",color:[e.primary.dark,"#FFAF38"],toDoTicketCount:null===i||void 0===i?void 0:i.toDoTicketCount,inProgressTicketsCount:null===i||void 0===i?void 0:i.inProgressTicketsCount})]}),Object(u.jsx)(F,{})]})]})})})}}}]);
//# sourceMappingURL=25.23cd0634.chunk.js.map