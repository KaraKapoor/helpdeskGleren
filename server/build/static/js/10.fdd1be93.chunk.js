(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[10],{1439:function(t,e,n){},1597:function(t,e,n){"use strict";n.r(e);var a,i,r,c=n(25),o=n(42),d=n(9),s=n(4),l=n(253),u=n(124),p=n(1),m=n.n(p),j=n(24),b=n(97),h=n(51),f=n(50),O=n.n(f),x=n(257),v=(n(1439),n(570)),g=n(456),C=n(716),S=n(717),w=n(755),y=n(835),D=n(159),N=n(747),E=n(176),k=n(489),z=n(2),B=function(t){var e=t.onClose,n=t.editDetails,c=m.a.useState(!1),o=Object(d.a)(c,2),s=(o[0],o[1]),l=m.a.useState(null===n||void 0===n||!n.is_active||n.is_active),p=Object(d.a)(l,2),b=p[0],f=p[1],B=Object(j.l)(),T=D.a.div(a||(a=Object(h.a)(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 1rem;\n    font-size: 1.5rem;\n"]))),L=D.a.div(i||(i=Object(h.a)(["\n    display: grid;\n    grid-template-columns: ",";\n    padding: 1rem 1rem 0 1rem;\n    gap: 1rem;\n"])),(function(t){return t.divide?"50% 48.4%":"100%"}));D.a.div(r||(r=Object(h.a)(["\n    color: red;\n    font-size: 13px;\n"])));m.a.useEffect((function(){n&&f(null===n||void 0===n?void 0:n.is_active)}),[]);var A=k.b().shape({departmentName:k.c().max(20,"Department Name can not be more than 20 characters long")}),_={departmentName:null!==n&&void 0!==n&&n.name?n.name:""},I=function(t){null!==t&&void 0!==t&&t.target.checked?f(!1):f(!0)};return Object(z.jsx)(z.Fragment,{children:Object(z.jsx)("div",{children:Object(z.jsxs)(v.a,{elevation:3,sx:{pt:0,mb:0,minHeight:"50vh"},children:[Object(z.jsxs)(T,{children:[Object(z.jsx)("div",{children:null!==n&&void 0!==n&&n.id?"Edit Department":"Add Department"}),Object(z.jsx)("div",{onClick:function(t){return!!e&&e(t)&&s(!1)},children:Object(z.jsx)(g.a,{sx:{color:"#59B691",fontSize:"35px !important",cursor:"pointer"},children:"cancelsharp"})})]}),Object(z.jsx)(C.a,{}),Object(z.jsx)(x.a,{onSubmit:function(t){var e={departmentName:t.departmentName,is_active:b};if(null!==n&&void 0!==n&&n.id)e.id=n.id;else if(!t.departmentName)return O.a.fire({icon:"warning",title:"Warning",text:E.a.DEPARTMENT_NAME_MANDATORY,showCloseButton:!0,showConfirmButton:!1,width:400});Object(u.a)(e).then((function(t){return!1===(null===t||void 0===t?void 0:t.status)?O.a.fire({icon:"error",title:"Error",text:t.error,showCloseButton:!0,showConfirmButton:!1,width:400}):(O.a.fire({icon:"success",title:"Success",text:null!==n&&void 0!==n&&n.id?E.a.UPDATED_SUCCESSFULLY:E.a.CREATED_SUCCESSFULLY,showCloseButton:!0,showConfirmButton:!1,width:400}),B("/departments"))}))},initialValues:_,validationSchema:A,children:function(t){var e=t.values,a=t.errors,i=t.touched,r=t.handleChange,c=t.handleBlur,o=t.handleSubmit;return Object(z.jsxs)("form",{onSubmit:o,children:[Object(z.jsxs)(L,{divide:!0,children:[Object(z.jsxs)("div",{children:[Object(z.jsx)(S.a,{fullWidth:!0,size:"large",name:"departmentName",type:"text",label:"Department Name",variant:"outlined",onBlur:c,value:e.departmentName,onChange:r,error:Boolean(a.departmentName&&i.departmentName),helperText:i.departmentName&&a.departmentName,sx:{mb:1.5}}),Object(z.jsx)("br",{})]}),Object(z.jsx)("div",{children:Object(z.jsx)(w.a,{control:Object(z.jsx)(y.a,{}),disabled:!(null!==n&&void 0!==n&&n.id),checked:!b,onChange:I,label:"Inactive"})})]}),Object(z.jsx)("div",{className:"d-flex justify-content-end",children:Object(z.jsx)(N.a,{type:"submit",color:"primary",variant:"contained",sx:{my:2,top:"100",marginRight:"10px",marginTop:"45vh"},children:"Submit"})})]})}})]})})})},T=n(17),L=n(5),A=n(790),_=n(866),I=n(471),R=n(840),P=n(327),U=n.n(P),W=(Object(L.a)(A.a)((function(){return{whiteSpace:"pre","& thead":{"& tr":{"& th":{paddingLeft:0,paddingRight:0}}},"& tbody":{"& tr":{"& td":{paddingLeft:0,textTransform:"capitalize"}}}}})),Object(L.a)(A.a)((function(){return{marginTop:"20px",whiteSpace:"pre","& small":{height:15,width:50,borderRadius:500,boxShadow:"0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"},"& td":{borderBottom:"none"},"& td:first-of-type":{paddingLeft:"16px !important"},"& th:first-of-type":{paddingLeft:"16px !important"},"& th:nth-of-type(3)":{width:"90px !important"},"& tfoot tr td div:nth-child(1)":{justifyContent:"center",alignItems:"center",flex:"initial",margin:"0.5rem 0"}}}))),F=function(t){var e=t.onEditClick,n=t.onCreateClick,a=(t.setCurrentView,Object(p.useState)([])),i=Object(d.a)(a,2),r=i[0],c=i[1],o=Object(p.useState)(0),s=Object(d.a)(o,2),l=s[0],m=s[1],j=Object(p.useState)(0),b=Object(d.a)(j,2),h=b[0],f=b[1],O=Object(p.useState)(10),x=Object(d.a)(O,2),v=x[0],C=(x[1],function(t,e){m(e)});Object(p.useEffect)((function(){S()}),[l]);var S=function(){Object(u.f)(l,v).then((function(t){var e,n;null===t||void 0===t||null===(e=t.data)||void 0===e||e.pagingData.map((function(t,e){Object.assign(t,{sno:v*l+e+1})})),c(null===t||void 0===t||null===(n=t.data)||void 0===n?void 0:n.pagingData),f(t.data.totalItems)}))};return Object(z.jsxs)(_.a,{width:"100%",overflow:"auto",children:[Object(z.jsx)(I.a,{size:"small",color:"secondary","aria-label":"Add",className:"button addBtn",onClick:function(t,e){n&&n(e)},children:Object(z.jsx)(g.a,{children:"add"})}),Object(z.jsx)(W,{children:Object(z.jsx)(U.a,{title:"Departments",columns:[{title:"Department Name",field:"departmentName"},{title:"Active",field:"status"}],data:r.map((function(t){return{departmentName:t.name,status:t.is_active,departmentId:t.id}})),actions:[{icon:"edit",tooltip:"Edit Department",onClick:function(t,n){e&&e(n.departmentId)}}],options:{actionsColumnIndex:-1,emptyRowsWhenPaging:!1,showTitle:!1,search:!1,toolbar:!1,pageSizeOptions:[],pageSize:v,tableLayout:"auto",maxBodyHeight:"400px",headerStyle:{fontSize:"14px",backgroundColor:"#222A45",color:"white",fontWeight:"700"}},components:{Pagination:function(t){return Object(z.jsx)(R.a,Object(T.a)(Object(T.a)({},t),{},{count:h,rowsPerPage:v,page:l,onPageChange:C,labelDisplayedRows:function(){return""}}))}}})})]})},M=Object(l.a)("div")((function(t){var e=t.theme;return Object(s.a)({margin:"30px"},e.breakpoints.down("sm"),{margin:"16px"})}));Object(l.a)("span")((function(){return{fontSize:"1rem",fontWeight:"500",textTransform:"capitalize"}})),Object(l.a)("span")((function(t){return{fontSize:"0.875rem",color:t.theme.palette.text.secondary}})),Object(l.a)("h4")((function(t){return{fontSize:"1rem",fontWeight:"500",marginBottom:"16px",textTransform:"capitalize",color:t.theme.palette.text.secondary}})),e.default=function(){var t=Object(p.useState)("Department"),e=Object(d.a)(t,2),n=e[0],a=e[1],i=Object(j.l)(),r=Object(b.d)(),s=Object(d.a)(r,1)[0],l=Object(p.useState)(),m=Object(d.a)(l,2),h=m[0],f=m[1];Object(p.useEffect)((function(){var t;"create-department"===s.get("type")?a("Create"):"edit-department"===(null===s||void 0===s||null===(t=s.get("type"))||void 0===t?void 0:t.split("/")[0])?O(s.get("type").split("/")[1]):(a("Department"),f())}),[s]);var O=function(){var t=Object(o.a)(Object(c.a)().mark((function t(e){return Object(c.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(u.l)({id:e}).then((function(t){f(t.data)}));case 2:a("Edit"),i({search:"?type=edit-department/".concat(e)});case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(z.jsx)(p.Fragment,{children:Object(z.jsxs)(M,{children:["Department"===n&&Object(z.jsx)(F,{onEditClick:O,onCreateClick:function(){a("Create"),i({search:"?type=create-department"})},setEditDetails:f,setCurrentView:a}),"Create"===n&&Object(z.jsx)(B,{onClose:function(){a("List"),i({search:""}),f()},editDetails:h}),"Edit"===n&&h&&Object(z.jsx)(B,{onClose:function(){a("List"),i({search:""}),f()},editDetails:h})]})})}}}]);
//# sourceMappingURL=10.fdd1be93.chunk.js.map