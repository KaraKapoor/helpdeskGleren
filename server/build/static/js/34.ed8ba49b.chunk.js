(this.webpackJsonpUI=this.webpackJsonpUI||[]).push([[34],{1573:function(e,a,t){"use strict";t.r(a);var r=t(26),s=t(48),n=t(9),i=t(698),c=t(544),l=t(791),o=t(690),d=t(242),u=t(820),m=t(181),b=t(151),j=t(567),h=(t(566),t(246)),p=t(1),x=t(24),O=t(91),g=(t(47),t(1366)),f=t(2),w=Object(d.a)(u.a)((function(){return{display:"flex",alignItems:"center"}})),v=Object(d.a)(w)((function(){return{justifyContent:"center"}})),y=Object(d.a)(u.a)((function(){return{height:"100",padding:"32px",position:"relative",background:"rgba(0, 0, 0, 0.01)"}})),k=Object(d.a)(v)((function(e){e.imgUrl;return{background:"#1A2038",height:"100vh","& .card":{maxWidth:800,borderRadius:12,margin:"1rem"}}})),q={email:"",password:""},B=g.a().shape({password:g.b().min(6,"Password must be 6 character length").required("Password is required!"),email:g.b().email("Invalid Email address").required("Email is required!")});a.default=function(){var e=Object(m.a)(),a=Object(x.l)(),t=Object(p.useState)(!1),d=Object(n.a)(t,2),u=d[0],g=d[1],C=Object(j.a)().login,S=function(){var e=Object(s.a)(Object(r.a)().mark((function e(t){return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return g(!0),e.prev=1,e.next=4,C(t.email,t.password);case 4:g(!1),a("/"),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),g(!1);case 11:case"end":return e.stop()}}),e,null,[[1,8]])})));return function(a){return e.apply(this,arguments)}}();return Object(f.jsx)(k,{children:Object(f.jsx)(c.a,{className:"card",children:Object(f.jsxs)(l.a,{container:!0,children:[Object(f.jsx)(l.a,{item:!0,sm:6,xs:12,children:Object(f.jsx)(v,{p:4,height:"100%",sx:{minWidth:320},children:Object(f.jsx)("img",{src:"/assets/images/illustrations/dreamer.svg",width:"100%",alt:""})})}),Object(f.jsx)(l.a,{item:!0,sm:6,xs:12,children:Object(f.jsx)(y,{children:Object(f.jsx)(h.a,{onSubmit:S,initialValues:q,validationSchema:B,children:function(a){a.values;var t=a.errors,r=a.touched,s=a.handleChange,n=a.handleBlur,c=a.handleSubmit;return Object(f.jsxs)("form",{onSubmit:c,children:[Object(f.jsx)(o.a,{fullWidth:!0,label:"Email",size:"small",type:"email",name:"email",variant:"outlined",onBlur:n,onChange:s,helperText:r.email&&t.email,error:Boolean(t.email&&r.email),required:!0,sx:{mb:3}}),Object(f.jsx)(o.a,{fullWidth:!0,label:"Password",size:"small",name:"password",type:"password",variant:"outlined",onBlur:n,onChange:s,required:!0,helperText:r.password&&t.password,error:Boolean(t.password&&r.password),sx:{mb:1.5}}),Object(f.jsx)(w,{justifyContent:"space-between",children:Object(f.jsx)(O.c,{to:"/session/forgot-password",style:{color:e.palette.primary.main},children:"Forgot password?"})}),Object(f.jsx)(i.a,{type:"submit",color:"primary",loading:u,variant:"contained",sx:{my:2},children:"Login"}),Object(f.jsxs)(b.c,{children:["Don't have an account?",Object(f.jsx)(O.c,{to:"/session/signup",style:{color:e.palette.primary.main,marginLeft:5},children:"Register"})]})]})}})})})]})})})}}}]);
//# sourceMappingURL=34.ed8ba49b.chunk.js.map