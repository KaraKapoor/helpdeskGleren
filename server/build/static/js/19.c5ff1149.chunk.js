(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[19],{1614:function(e,t,a){},1772:function(e,t,a){"use strict";a.r(t);var i,n,r,c,l=a(5),s=a(3),d=a(298),o=a(146),u=a(0),j=a.n(u),m=a(45),b=a(105),h=a(34),v=a(60),f=a.n(v),p=a(147),O=a.n(p),x=a(302),g=(a(1614),a(669)),S=a(546),C=a(824),y=a(960),w=a(825),N=a(663),T=a(664),_=a(686),A=a(857),D=a(864),E=a(956),k=a(138),B=a(858),L=a(206),z=a(580),I=a(1),U=function(e){var t=e.onClose,a=e.editDetails,s=j.a.useState(!1),d=Object(l.a)(s,2),u=(d[0],d[1]),b=j.a.useState(null===a||void 0===a||!a.is_active||a.is_active),v=Object(l.a)(b,2),p=v[0],O=v[1],U=j.a.useState(),W=Object(l.a)(U,2),q=(W[0],W[1],j.a.useState()),P=Object(l.a)(q,2),R=P[0],V=P[1],F=j.a.useState(),M=Object(l.a)(F,2),H=M[0],J=M[1],Y=j.a.useState([]),G=Object(l.a)(Y,2),K=G[0],Q=G[1],X=j.a.useState([]),Z=Object(l.a)(X,2),$=Z[0],ee=Z[1],te=j.a.useState([]),ae=Object(l.a)(te,2),ie=ae[0],ne=ae[1],re=j.a.useState(),ce=Object(l.a)(re,2),le=ce[0],se=ce[1],de=j.a.useState(),oe=Object(l.a)(de,2),ue=oe[0],je=oe[1],me=j.a.useState(),be=Object(l.a)(me,2),he=be[0],ve=be[1],fe=j.a.useState(),pe=Object(l.a)(fe,2),Oe=pe[0],xe=pe[1],ge=Object(m.f)(),Se=k.a.div(i||(i=Object(h.a)(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 1rem;\n    font-size: 1.5rem;\n"]))),Ce=k.a.div(n||(n=Object(h.a)(["\n    display: grid;\n    grid-template-columns: ",";\n    padding: 1rem 1rem 0 1rem;\n    gap: 1rem;\n"])),(function(e){return e.divide?"50% 48.4%":"100%"})),ye=(k.a.div(r||(r=Object(h.a)(["\n    color: red;\n    font-size: 13px;\n"]))),k.a.div(c||(c=Object(h.a)(["\n  width:15px;\n  height:15px;\n  border:5px solid red;\n  background-color:red;\n  color:white;\n  border-radius:50%;\n  text-align:center;\n"]))));j.a.useEffect((function(){a&&O(null===a||void 0===a?void 0:a.is_active),Object(o.s)().then((function(e){if(!1===(null===e||void 0===e?void 0:e.status))return f.a.fire({icon:"error",title:"Error",text:e.error,showCloseButton:!0,showConfirmButton:!1,width:400});var t,i,n,r;se(null===e||void 0===e||null===(t=e.data)||void 0===t?void 0:t.departments),je(null===e||void 0===e||null===(i=e.data)||void 0===i?void 0:i.projects),ve(null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.users),xe(null===e||void 0===e||null===(r=e.data)||void 0===r?void 0:r.agents),V(null===a||void 0===a?void 0:a.department_id),J(null===a||void 0===a?void 0:a.project_id),Q(null!==a&&void 0!==a&&a.agents?a.agents:[]),ne(null!==a&&void 0!==a&&a.users?a.users:[]),ee(null!==a&&void 0!==a&&a.leads?a.leads:[])}))}),[]);var we={teamName:null!==a&&void 0!==a&&a.name?a.name:""},Ne=function(e){null!==e&&void 0!==e&&e.target.checked?O(!1):O(!0)},Te=function(e){V(e.target.value)},_e=function(e){J(e.target.value)},Ae=function(e){var t=e.target.value;ne("string"===typeof t?t.split(","):t)},De=function(e){var t=e.target.value;ee("string"===typeof t?t.split(","):t)},Ee=function(e){var t=e.target.value;Q("string"===typeof t?t.split(","):t)},ke=z.b().shape({teamName:z.c().max(20,"Team Name can not be more than 20 characters long")});return Object(I.jsx)(I.Fragment,{children:Object(I.jsx)("div",{children:Object(I.jsxs)(g.a,{elevation:3,sx:{pt:0,mb:0,minHeight:"50vh"},children:[Object(I.jsxs)(Se,{children:[Object(I.jsx)("div",{children:null!==a&&void 0!==a&&a.id?"Edit Team":"Add Team"}),Object(I.jsx)("div",{onClick:function(e){return!!t&&t(e)&&u(!1)},children:Object(I.jsx)(S.a,{sx:{color:"#59B691",fontSize:"35px !important",cursor:"pointer"},children:"cancelsharp"})})]}),Object(I.jsx)(C.a,{}),Object(I.jsx)(x.a,{onSubmit:function(e){var t={teamName:e.teamName,departmentId:R,projectId:H,users:ie,leads:$,active:p,agents:K};null!==a&&void 0!==a&&a.id&&(t.id=a.id),Object(o.f)(t).then((function(e){return!1===(null===e||void 0===e?void 0:e.status)?f.a.fire({icon:"error",title:"Error",text:e.error,showCloseButton:!0,showConfirmButton:!1,width:400}):(f.a.fire({icon:"success",title:"Success",text:null!==a&&void 0!==a&&a.id?L.a.UPDATED_SUCCESSFULLY:L.a.CREATED_SUCCESSFULLY,showCloseButton:!0,showConfirmButton:!1,width:400}),ge("/teams"))}))},initialValues:we,validationSchema:ke,children:function(e){var t=e.values,i=e.errors,n=e.touched,r=e.handleChange,c=e.handleBlur,l=e.handleSubmit;return Object(I.jsxs)("form",{onSubmit:l,children:[Object(I.jsx)(Ce,{children:Object(I.jsxs)(y.a,{container:!0,spacing:2,children:[Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsx)(w.a,{fullWidth:!0,size:"large",required:!0,name:"teamName",type:"text",label:"Team Name",variant:"outlined",onBlur:c,value:t.teamName,onChange:r,sx:{mb:1.5},error:Boolean(i.teamName&&n.teamName),helperText:n.teamName&&i.teamName})}),Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsxs)(N.a,{fullWidth:!0,children:[Object(I.jsx)(T.a,{required:!0,id:"department",children:"Department"}),Object(I.jsx)(_.a,{labelId:"department",id:"department",required:!0,value:R,label:"Department",onChange:Te,defaultValue:R,className:"isactiveDivStyle",children:null===le||void 0===le?void 0:le.map((function(e,t){return Object(I.jsxs)(A.a,{value:e.id,className:"isactive-error",children:[e.name," ",e.is_active?"":Object(I.jsx)(ye,{})]},t)}))})]})}),Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsxs)(N.a,{fullWidth:!0,children:[Object(I.jsx)(T.a,{required:!0,id:"project",children:"Project"}),Object(I.jsx)(_.a,{labelId:"project",id:"project",required:!0,value:H,label:"Project",onChange:_e,defaultValue:H,className:"isactiveDivStyle",children:null===ue||void 0===ue?void 0:ue.map((function(e,t){return Object(I.jsxs)(A.a,{value:e.id,className:"isactive-error",children:[e.name," ",!1===e.is_active?Object(I.jsx)(ye,{}):""]},t)}))})]})}),Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsxs)(N.a,{fullWidth:!0,children:[Object(I.jsx)(T.a,{id:"user",children:"Users"}),Object(I.jsx)(_.a,{labelId:"user",id:"user",multiple:!0,value:ie,label:"Users",onChange:Ae,defaultValue:ie,className:"isactiveDivStyle",children:null===he||void 0===he?void 0:he.map((function(e,t){return Object(I.jsxs)(A.a,{value:e.id,className:"isactive-error",children:[e.first_name," ",e.last_name," ",!1===e.is_active?Object(I.jsx)(ye,{}):""]},t)}))})]})}),Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsxs)(N.a,{fullWidth:!0,children:[Object(I.jsx)(T.a,{required:!0,id:"leadId",children:"Team Lead"}),Object(I.jsx)(_.a,{labelId:"teamLead",id:"teamLead",required:!0,multiple:!0,value:$,label:"Team Lead",onChange:De,defaultValue:$,className:"isactiveDivStyle",children:null===Oe||void 0===Oe?void 0:Oe.map((function(e,t){return Object(I.jsxs)(A.a,{value:e.id,className:"isactive-error",children:[e.first_name," ",e.last_name," ",!1===e.is_active?Object(I.jsx)(ye,{}):""]},t)}))})]})}),Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsxs)(N.a,{fullWidth:!0,children:[Object(I.jsx)(T.a,{required:!0,id:"agent",children:"Agents"}),Object(I.jsx)(_.a,{labelId:"agents",id:"agents",multiple:!0,required:!0,value:K,label:"Agents",onChange:Ee,defaultValue:K,className:"isactiveDivStyle",children:null===Oe||void 0===Oe?void 0:Oe.map((function(e,t){return Object(I.jsxs)(A.a,{value:e.id,className:"isactive-error",children:[e.first_name," ",e.last_name," ",!1===e.is_active?Object(I.jsx)(ye,{}):""]},t)}))})]})}),Object(I.jsx)(y.a,{item:!0,lg:6,md:6,sm:12,xs:12,children:Object(I.jsx)(D.a,{control:Object(I.jsx)(E.a,{}),disabled:!(null!==a&&void 0!==a&&a.id),checked:!p,onChange:Ne,label:"Inactive"})})]})}),Object(I.jsx)("div",{className:"d-flex justify-content-end",children:Object(I.jsx)(B.a,{type:"submit",color:"primary",variant:"contained",sx:{my:2,top:"50",marginRight:"10px",marginTop:"15vh"},children:"Submit"})})]})}})]})})})},W=a(17),q=a(7),P=a(898),R=a(987),V=a(567),F=a(961),M=a(394),H=a.n(M),J=(Object(q.a)(P.a)((function(){return{whiteSpace:"pre","& thead":{"& tr":{"& th":{paddingLeft:0,paddingRight:0}}},"& tbody":{"& tr":{"& td":{paddingLeft:0,textTransform:"capitalize"}}}}})),Object(q.a)(P.a)((function(){return{marginTop:"20px",whiteSpace:"pre",thead:{backgroundColor:"rgb(34, 42, 69)"},"thead > tr":{backgroundColor:"rgb(34, 42, 69)"},"& small":{height:15,width:50,borderRadius:500,boxShadow:"0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"},"& td":{borderBottom:"1px solid rgba(224, 224, 224, 1)"},"& td:first-of-type":{paddingLeft:"16px !important"},"& th:first-of-type":{paddingLeft:"16px !important"},"& th:nth-of-type(5)":{width:"90px !important"},"& tfoot tr td div:nth-child(1)":{justifyContent:"center",alignItems:"center",flex:"initial",margin:"0.5rem 0"}}}))),Y=function(e){var t=e.onEditClick,a=e.onCreateClick,i=(e.setCurrentView,Object(u.useState)([])),n=Object(l.a)(i,2),r=n[0],c=n[1],s=Object(u.useState)(0),d=Object(l.a)(s,2),j=d[0],m=d[1],b=Object(u.useState)(0),h=Object(l.a)(b,2),v=h[0],f=h[1],p=Object(u.useState)(10),x=Object(l.a)(p,2),g=x[0],C=(x[1],function(e,t){m(t)});Object(u.useEffect)((function(){y()}),[j]);var y=function(){Object(o.l)(j,g).then((function(e){var t,a;null===e||void 0===e||null===(t=e.data)||void 0===t||t.pagingData.map((function(e,t){Object.assign(e,{sno:g*j+t+1})})),c(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.pagingData),f(e.data.totalItems)}))};return Object(I.jsxs)(R.a,{width:"100%",overflow:"auto",children:[Object(I.jsx)(V.a,{size:"small",color:"secondary","aria-label":"Add",className:"button addBtn",onClick:function(e,t){a&&a(t)},children:Object(I.jsx)(S.a,{children:"add"})}),Object(I.jsx)(J,{children:Object(I.jsx)(H.a,{title:"Teams",columns:[{title:"Team Name",field:"name"},{title:"Active",field:"status"},{title:"Created At ",field:"createdAt"},{title:"Modified At",field:"modifiedAt"}],data:r.map((function(e){return{name:e.name,status:e.is_active,createdBy:e.name,modifiedBy:e.name,createdAt:O()(e.createdAt).format(L.a.DATE_FORMAT),modifiedAt:O()(e.updatedAt).format(L.a.DATE_FORMAT),id:e.id}})),actions:[{icon:"edit",tooltip:"Edit User",onClick:function(e,a){t&&t(a.id)}}],options:{actionsColumnIndex:-1,emptyRowsWhenPaging:!1,showTitle:!1,search:!1,toolbar:!1,pageSizeOptions:[],pageSize:g,tableLayout:"auto",maxBodyHeight:"400px",headerStyle:{fontSize:"14px",backgroundColor:"#222A45",color:"white",fontWeight:"700"}},components:{Pagination:function(e){return Object(I.jsx)(F.a,Object(W.a)(Object(W.a)({},e),{},{count:v,rowsPerPage:g,page:j,onPageChange:C,labelDisplayedRows:function(){return""}}))}}})})]})},G=Object(d.a)("div")((function(e){var t=e.theme;return Object(s.a)({margin:"30px"},t.breakpoints.down("sm"),{margin:"16px"})}));Object(d.a)("span")((function(){return{fontSize:"1rem",fontWeight:"500",textTransform:"capitalize"}})),Object(d.a)("span")((function(e){return{fontSize:"0.875rem",color:e.theme.palette.text.secondary}})),Object(d.a)("h4")((function(e){return{fontSize:"1rem",fontWeight:"500",marginBottom:"16px",textTransform:"capitalize",color:e.theme.palette.text.secondary}})),t.default=function(){var e=Object(u.useState)("Teams"),t=Object(l.a)(e,2),a=t[0],i=t[1],n=Object(m.f)(),r=Object(b.d)(),c=Object(l.a)(r,1)[0],s=Object(u.useState)(),d=Object(l.a)(s,2),j=d[0],h=d[1];Object(u.useEffect)((function(){var e;"create-team"===c.get("type")?i("Create"):"edit-team"===(null===c||void 0===c||null===(e=c.get("type"))||void 0===e?void 0:e.split("/")[0])?v(c.get("type").split("/")[1]):(i("Teams"),h())}),[c]);var v=function(e){Object(o.u)({id:e}).then((function(e){h(e.data)})),i("Edit"),n({search:"?type=edit-team/".concat(e)})};return Object(I.jsx)(u.Fragment,{children:Object(I.jsxs)(G,{children:["Teams"===a&&Object(I.jsx)(Y,{onEditClick:v,onCreateClick:function(){i("Create"),n({search:"?type=create-team"})},setEditDetails:h,setCurrentView:i}),"Create"===a&&Object(I.jsx)(U,{onClose:function(){i("List"),n({search:""}),h()},editDetails:j}),"Edit"===a&&j&&Object(I.jsx)(U,{onClose:function(){i("List"),n({search:""}),h()},editDetails:j})]})})}}}]);
//# sourceMappingURL=19.c5ff1149.chunk.js.map