(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[15],{1440:function(t,e,n){},1592:function(t,e,n){"use strict";n.r(e);var i,a,c,o=n(26),r=n(46),s=n(9),d=n(4),l=n(252),u=n(21),j=n(31),p=j.general.baseUrl,b=n(1),h=n.n(b),f=n(24),m=n(97),O=n(51),x=n(50),v=n.n(x),g=(n(125),n(256)),C=(n(1440),n(570)),S=n(456),w=n(716),y=n(717),E=n(755),P=n(835),z=n(163),k=n(747),B=n(176),N=n(2),T=function(t){var e=t.onClose,n=t.editDetails,o=h.a.useState(!1),r=Object(s.a)(o,2),d=(r[0],r[1]),l=h.a.useState(null===n||void 0===n||!n.is_active||n.is_active),b=Object(s.a)(l,2),m=b[0],x=b[1],T=Object(f.l)(),D=z.a.div(i||(i=Object(O.a)(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 1rem;\n    font-size: 1.5rem;\n"]))),L=z.a.div(a||(a=Object(O.a)(["\n    display: grid;\n    grid-template-columns: ",";\n    padding: 1rem 1rem 0 1rem;\n    gap: 1rem;\n"])),(function(t){return t.divide?"50% 48.4%":"100%"}));z.a.div(c||(c=Object(O.a)(["\n    color: red;\n    font-size: 13px;\n"])));h.a.useEffect((function(){n&&x(null===n||void 0===n?void 0:n.is_active)}),[]);var A={projectName:null!==n&&void 0!==n&&n.name?n.name:""},I=function(t){null!==t&&void 0!==t&&t.target.checked?x(!1):x(!0)};return Object(N.jsx)(N.Fragment,{children:Object(N.jsx)("div",{children:Object(N.jsxs)(C.a,{elevation:3,sx:{pt:0,mb:0,minHeight:"50vh"},children:[Object(N.jsxs)(D,{children:[Object(N.jsx)("div",{children:null!==n&&void 0!==n&&n.id?"Edit Project":"Add Project"}),Object(N.jsx)("div",{onClick:function(t){return!!e&&e(t)&&d(!1)},children:Object(N.jsx)(S.a,{sx:{color:"#59B691",fontSize:"35px !important",cursor:"pointer"},children:"cancelsharp"})})]}),Object(N.jsx)(w.a,{}),Object(N.jsx)(g.a,{onSubmit:function(t){var e,i={projectName:t.projectName,is_active:m};if(null!==n&&void 0!==n&&n.id)i.id=n.id;else if(!t.projectName)return v.a.fire({icon:"warning",title:"Warning",text:B.a.PROJECT_NAME_MANDATORY,showCloseButton:!0,showConfirmButton:!1,width:400});(e=i,Object(u.b)({method:u.a.POST,url:p+j.project.create,data:e})).then((function(t){return!1===(null===t||void 0===t?void 0:t.status)?v.a.fire({icon:"error",title:"Error",text:t.error,showCloseButton:!0,showConfirmButton:!1,width:400}):(v.a.fire({icon:"success",title:"Success",text:null!==n&&void 0!==n&&n.id?B.a.UPDATED_SUCCESSFULLY:B.a.CREATED_SUCCESSFULLY,showCloseButton:!0,showConfirmButton:!1,width:400}),T("/project"))}))},initialValues:A,children:function(t){var e=t.values,i=(t.errors,t.touched,t.handleChange),a=t.handleBlur,c=t.handleSubmit;return Object(N.jsxs)("form",{onSubmit:c,children:[Object(N.jsxs)(L,{divide:!0,children:[Object(N.jsxs)("div",{children:[Object(N.jsx)(y.a,{fullWidth:!0,size:"large",name:"projectName",type:"text",label:"Project Name",variant:"outlined",onBlur:a,value:e.projectName,onChange:i,sx:{mb:1.5}}),Object(N.jsx)("br",{})]}),Object(N.jsx)("div",{children:Object(N.jsx)(E.a,{control:Object(N.jsx)(P.a,{}),disabled:!(null!==n&&void 0!==n&&n.id),checked:!m,onChange:I,label:"Inactive"})})]}),Object(N.jsx)("div",{className:"d-flex justify-content-end",children:Object(N.jsx)(k.a,{type:"submit",color:"primary",variant:"contained",sx:{my:2,top:"100",marginRight:"10px",marginTop:"45vh"},children:"Submit"})})]})}})]})})})},D=n(17),L=n(5),A=n(790),I=n(866),_=n(471),R=n(840),U=n(326),W=n.n(U),F=(Object(L.a)(A.a)((function(){return{whiteSpace:"pre","& thead":{"& tr":{"& th":{paddingLeft:0,paddingRight:0}}},"& tbody":{"& tr":{"& td":{paddingLeft:0,textTransform:"capitalize"}}}}})),Object(L.a)(A.a)((function(){return{marginTop:"20px",whiteSpace:"pre","& small":{height:15,width:50,borderRadius:500,boxShadow:"0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"},"& td":{borderBottom:"none"},"& td:first-of-type":{paddingLeft:"16px !important"},"& th:nth-of-type(3)":{width:"90px !important"},"& th:first-of-type":{paddingLeft:"16px !important"},"& tfoot tr td div:nth-child(1)":{justifyContent:"center",alignItems:"center",flex:"initial",margin:"0.5rem 0"}}}))),J=function(t){var e=t.onEditClick,n=t.onCreateClick,i=(t.setCurrentView,Object(b.useState)([])),a=Object(s.a)(i,2),c=a[0],o=a[1],r=Object(b.useState)(0),d=Object(s.a)(r,2),l=d[0],h=d[1],f=Object(b.useState)(0),m=Object(s.a)(f,2),O=m[0],x=m[1],v=Object(b.useState)(10),g=Object(s.a)(v,2),C=g[0],w=(g[1],function(t,e){h(e)});Object(b.useEffect)((function(){y()}),[l]);var y=function(){(function(t,e){return Object(u.b)({method:u.a.GET,url:p+j.project.getAllProjects+"?page=".concat(t,"&size=").concat(e)})})(l,C).then((function(t){var e,n;null===t||void 0===t||null===(e=t.data)||void 0===e||e.pagingData.map((function(t,e){Object.assign(t,{sno:C*l+e+1})})),o(null===t||void 0===t||null===(n=t.data)||void 0===n?void 0:n.pagingData),x(t.data.totalItems)}))};return Object(N.jsxs)(I.a,{width:"100%",overflow:"auto",children:[Object(N.jsx)(_.a,{size:"small",color:"secondary","aria-label":"Add",className:"button addBtn",onClick:function(t,e){n&&n(e)},children:Object(N.jsx)(S.a,{children:"add"})}),Object(N.jsx)(F,{children:Object(N.jsx)(W.a,{title:"Projects",columns:[{title:"Project Name",field:"projectName"},{title:"Active",field:"status"}],data:c.map((function(t){return{projectName:t.name,status:t.is_active,projectId:t.id}})),actions:[{icon:"edit",tooltip:"Edit Project",onClick:function(t,n){e&&e(n.projectId)}}],options:{actionsColumnIndex:-1,emptyRowsWhenPaging:!1,showTitle:!1,search:!1,toolbar:!1,pageSizeOptions:[],pageSize:C,tableLayout:"auto",maxBodyHeight:"400px",headerStyle:{fontSize:"14px",backgroundColor:"#222A45",color:"white",fontWeight:"700"}},components:{Pagination:function(t){return Object(N.jsx)(R.a,Object(D.a)(Object(D.a)({},t),{},{count:O,rowsPerPage:C,page:l,onPageChange:w,labelDisplayedRows:function(){return""}}))}}})})]})},V=Object(l.a)("div")((function(t){var e=t.theme;return Object(d.a)({margin:"30px"},e.breakpoints.down("sm"),{margin:"16px"})}));Object(l.a)("span")((function(){return{fontSize:"1rem",fontWeight:"500",textTransform:"capitalize"}})),Object(l.a)("span")((function(t){return{fontSize:"0.875rem",color:t.theme.palette.text.secondary}})),Object(l.a)("h4")((function(t){return{fontSize:"1rem",fontWeight:"500",marginBottom:"16px",textTransform:"capitalize",color:t.theme.palette.text.secondary}})),e.default=function(){var t=Object(b.useState)("Project"),e=Object(s.a)(t,2),n=e[0],i=e[1],a=Object(f.l)(),c=Object(m.d)(),d=Object(s.a)(c,1)[0],l=Object(b.useState)(),h=Object(s.a)(l,2),O=h[0],x=h[1];Object(b.useEffect)((function(){var t;"create-project"===d.get("type")?i("Create"):"edit-project"===(null===d||void 0===d||null===(t=d.get("type"))||void 0===t?void 0:t.split("/")[0])?v(d.get("type").split("/")[1]):(i("Project"),x())}),[d]);var v=function(){var t=Object(r.a)(Object(o.a)().mark((function t(e){return Object(o.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(n={id:e},Object(u.b)({method:u.a.POST,url:p+j.project.getById,data:n})).then((function(t){x(t.data)}));case 2:i("Edit"),a({search:"?type=edit-project/".concat(e)});case 4:case"end":return t.stop()}var n}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(N.jsx)(b.Fragment,{children:Object(N.jsxs)(V,{children:["Project"===n&&Object(N.jsx)(J,{onEditClick:v,onCreateClick:function(){i("Create"),a({search:"?type=create-project"})},setEditDetails:x,setCurrentView:i}),"Create"===n&&Object(N.jsx)(T,{onClose:function(){i("List"),a({search:""}),x()},editDetails:O}),"Edit"===n&&O&&Object(N.jsx)(T,{onClose:function(){i("List"),a({search:""}),x()},editDetails:O})]})})}}}]);
//# sourceMappingURL=15.f9d8d63a.chunk.js.map