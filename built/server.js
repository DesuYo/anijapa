!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=8)}([function(e,t){e.exports=require("express")},function(e,t){e.exports=require("mongoose")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1);t.MongooseSchema=n.Schema,t.MongooseModel=n.Model;var o=r(16);t.ObjectID=o.ObjectID;var i=r(6);t.JsonWebTokenError=i.JsonWebTokenError,t.TokenExpiredError=i.TokenExpiredError},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(s,a)}u((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const o=r(6),i=r(5),s=r(18),a=r(4),u=r(2);t.possiblePermissions=["get:basic","post:basic","patch:basic","delete:basic","get:admin","post:admin","patch:admin","delete:admin"],t.googleAuthorize=(e=>(t,r,n)=>{try{const{path:o}=t,{GOOGLE_ID:i}=process.env;return r.redirect("https://accounts.google.com/o/oauth2/v2/auth"+`?client_id=${i}`+`&redirect_uri=https://${t.get("host")}${o}/callback`+`&scope=${e}`+"&response_type=code")}catch(e){n(e)}}),t.googleCallback=(()=>(e,t,r)=>n(this,void 0,void 0,function*(){try{const{path:n,query:i,db:a}=e,{GOOGLE_ID:u,GOOGLE_SECRET:c,GOOGLE_OVERLORD_PROFILE_ID:d,JWT_SECRET:l}=process.env,{access_token:f}=(yield s.post("https://www.googleapis.com/oauth2/v4/token").set("accept","application/json").set("content-type","application/x-www-form-urlencoded").send({client_id:u,client_secret:c,code:i.code,redirect_uri:`https://${e.get("host")}${n}`,grant_type:"authorization_code"})).body,p=(yield s.get("https://www.googleapis.com/oauth2/v1/userinfo").set("accept","application/json").query({access_token:f})).body;let m=yield a.users.findOne({googleID:p.id}).exec();if(m)return t.status(200).json({accessToken:o.sign({_id:m.toObject()._id},l,{expiresIn:"2d"}),tokenType:"Bearer"});const{id:h,given_name:y,family_name:v,picture:g}=p;return m=yield a.users.create({googleID:h,permission:h==d?["overlord"]:["get:basic","post:basic","patch:basic","delete:basic"],photo:g,firstName:y,lastName:v}),t.status(201).json({accessToken:o.sign({_id:m.toObject()._id},l,{expiresIn:"2d"}),tokenType:"Bearer"})}catch(e){return r(e)}})),t.default=((...e)=>(t,r,s)=>n(this,void 0,void 0,function*(){try{const{authorization:r}=t.headers;if(!r)return s(new u.JsonWebTokenError("Bearer token is required!"));const[n,c]=r.split(" ");if("Bearer"!==n)return s(new u.JsonWebTokenError("Bearer token is required!"));const{_id:d}=o.verify(c,process.env.JWT_SECRET||"難しい鍵"),l=yield i.default.findById(d,{__v:0}).exec();if(!l)return s(new u.JsonWebTokenError("User with this token does not exist"));const f=l.toObject();return(f.permissions||[]).some(t=>e.includes(t)||"overlord"===t)?(t.user=f,s()):s(new a.PermissionError)}catch(e){return s(e)}}))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(2);class o extends Error{constructor(e){super(e)}}t.NotFoundError=o;class i extends Error{constructor(){super("Permission denied for this action.")}}t.PermissionError=i,t.default=((e,t,r,s)=>{try{switch(!0){case e instanceof n.JsonWebTokenError||e instanceof n.TokenExpiredError:return r.status(401).json({error:e});case e instanceof i:return r.status(403).json({error:e.message});case e.isJoi:return r.status(400).json(e.details.map(e=>({key:e.context.key,message:e.message})));case"MongoError"===e.name&&11e3===e.code:return r.status(400).json({error:e.errmsg});case e instanceof o:return r.status(404).json({error:e.message});default:throw e}}catch(e){return r.status(500).json({error:e.message||e})}})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(1),o=r(2);t.default=n.model("user",new o.MongooseSchema({googleID:{type:String,unique:!0},permissions:[String],username:{type:String,sparse:!0},photo:String,firstName:String,lastName:String,birthDate:Date},{timestamps:!0}).pre("save",()=>{}))},function(e,t){e.exports=require("jsonwebtoken")},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(s,a)}u((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const o=r(21),i=e=>o.string().trim().max(e),s=e=>o.number().max(e),a=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;t.VARCHAR=((e,t)=>i(e).default(t)),t.$VARCHAR=(e=>i(e).required()),t.GUID=(e=>i(64).guid().default(e)),t.$GUID=(()=>i(64).guid().required()),t.ARRAY=((...e)=>o.array().items(e).default([])),t.$ARRAY=((...e)=>o.array().items(e).required()),t.ENUM=((...e)=>o.allow(e)),t.$ENUM=((...e)=>o.allow(e).required()),t.SLUG=((e,t)=>i(e).token().lowercase().default(t)),t.$SLUG=(e=>i(e).token().lowercase().required()),t.URI=((e,t)=>i(e).uri({allowRelative:!0}).default(t)),t.$URI=(e=>i(e).uri({allowRelative:!0}).required()),t.NAME=((e,t)=>i(e).regex(/^[a-zA-Z]$/).default(t)),t.$NAME=(e=>i(e).regex(/^[a-zA-Z]$/).required()),t.EMAIL=(e=>i(64).email().default(e)),t.$EMAIL=(()=>i(64).email().required()),t.PHONE=(e=>i(16).replace(/\(*\)*/g,"").regex(/^\+\d{11,12}$/).default(e)),t.$PHONE=(()=>i(16).replace(/\(*\)*/g,"").regex(/^\+\d{11,12}$/).required()),t.PASSWORD=((e,t)=>i(64).regex(a).min(e).default(t)),t.$PASSWORD=(e=>i(64).regex(a).min(e).required()),t.INT=((e=Math.pow(2,32),t)=>s(e).integer().default(t)),t.$INT=((e=Math.pow(2,32))=>s(e).integer().required()),t.UINT=((e=Math.pow(2,32),t)=>s(e).integer().positive().default(t)),t.$UINT=((e=Math.pow(2,32))=>s(e).integer().positive().required()),t.FLOAT=((e=Math.pow(2,32),t=3,r)=>s(e).precision(t).default(r)),t.$FLOAT=((e=Math.pow(2,32),t=3)=>s(e).precision(t).required()),t.UFLOAT=((e=Math.pow(2,32),t=3,r)=>s(e).precision(t).positive().default(r)),t.$UFLOAT=((e=Math.pow(2,32),t=3)=>s(e).precision(t).positive().required()),t.BOOL=(e=>o.boolean().default(e)),t.DATE=(e=>o.date().iso().default(e)),t.$DATE=(()=>o.date().iso().required()),t.validationHandler=(e=>(t,r,i)=>n(this,void 0,void 0,function*(){try{const{error:r,value:n}=o.compile(e).options({abortEarly:!1,allowUnknown:!0,stripUnknown:!0}).validate(t.body);return r&&i(r),t.body=n,i()}catch(e){i(e)}}))},function(e,t,r){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});const n=r(9),o=r(0),i=r(10),s=r(11),a=r(12),u=r(13),c=r(14),d=r(3),l=r(19),f=r(4);n.config();const{PORT:p=777}=process.env;t.default=o().use(a("dev")).use(s()).use(o.static(u.join(e,""))).use(i.json()).use(i.urlencoded({extended:!0})).use(c.default).get("/google",d.googleAuthorize("https://www.googleapis.com/auth/userinfo.profile")).all("/google/callback",d.googleCallback()).use("/api",l.default).use((e,t)=>t.status(200).sendFile("/index.html")).use(f.default).listen(p,()=>console.log("I'm gonna poop on the plate, bratok..."))}).call(this,"/")},function(e,t){e.exports=require("dotenv")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("cors")},function(e,t){e.exports=require("morgan")},function(e,t){e.exports=require("path")},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(s,a)}u((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const o=r(1),i=r(15);t.default=((e,t,r)=>n(this,void 0,void 0,function*(){try{const{DB_URI:t}=process.env;return yield o.connect(t,{useNewUrlParser:!0}),e.db=i.default,r()}catch(e){return r(e)}}))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(5),o=r(17);t.default={users:n.default,comments:o.default}},function(e,t){e.exports=require("bson")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(1),o=r(2),i=new o.MongooseSchema({text:String,userId:{type:o.ObjectID,ref:"User"},animeId:{type:o.ObjectID,ref:"Anime"},likes:[{type:o.ObjectID,ref:"User"}],replies:[{type:o.ObjectID,ref:"Comment"}]},{timestamps:!0});t.default=n.model("comment",i)},function(e,t){e.exports=require("superagent")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(0),o=r(20),i=r(22);t.default=n.Router().use("/",o.default).use("/anime/:animeId/comments",i.default)},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(s,a)}u((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const o=r(0),i=r(3),s=r(7),a=r(4);t.default=o.Router().get("/me",i.default("get:basic","get:admin"),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{user:n}=e;return t.status(200).json(n)}catch(e){r(e)}})).patch("/me",i.default("patch:basic","patch:admin"),s.validationHandler({username:s.SLUG(16),photo:s.URI(256),firstName:s.NAME(16),lastName:s.NAME(16)}),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,user:o,body:i}=e,s=yield n.users.updateOne({_id:o._id},{$set:i}).exec();return t.status(200).json({message:`Modified ${s.ok} document[s]`})}catch(e){r(e)}})).delete("/me",i.default("delete:basic","delete:admin"),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,user:o}=e;yield n.users.deleteOne({_id:o._id}).exec(),t.status(204).end()}catch(e){r(e)}})).get("/users",i.default("get:admin"),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,query:o}=e,i=yield n.users.find({username:new RegExp(`.*${o.username}.*`),firstName:new RegExp(`.*${o.firstName}.*`),lastName:new RegExp(`.*${o.lastName}.*`)}).exec();return t.status(200).json(i)}catch(e){r(e)}})).patch("/users/:id",i.default("patch:admin"),s.validationHandler({permissions:s.ARRAY(s.ENUM(i.possiblePermissions)),username:s.SLUG(16),photo:s.URI(256),firstName:s.NAME(16),lastName:s.NAME(16)}),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,params:o,body:i}=e,s=yield n.users.findById(o.id).exec();return s?s.toObject().permissions.some(e=>"overlord"===e)?r(new a.PermissionError):(yield s.update({$set:i}).exec(),t.status(204).end()):r(new a.NotFoundError("User not found"))}catch(e){r(e)}}))},function(e,t){e.exports=require("joi")},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(o,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){e.done?o(e.value):new r(function(t){t(e.value)}).then(s,a)}u((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const o=r(0),i=r(3),s=r(7);t.default=o.Router().patch("/:id/likes",i.default("member"),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,user:o,params:i}=e,s=(yield n.comments.findById(i.id).exec()).toObject().likes.includes(o._id)?"$pull":"$push",a=yield n.comments.findByIdAndUpdate(i.id,{[s]:{likes:o._id}},{new:!0}).exec();return t.status(200).json(a)}catch(e){r(e)}})).post("/",i.default("member"),s.validationHandler({text:s.$VARCHAR(300),animeId:s.$GUID(),replies:s.ARRAY(s.GUID()),likes:s.ARRAY(s.GUID())}),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{body:n,user:o,db:i}=e;return t.status(201).json(yield i.comments.create(Object.assign({},n,{userId:o._id})))}catch(e){r(e)}})).patch("/:id",i.default("member"),s.validationHandler({text:s.$VARCHAR(300)}),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,user:o,params:i,body:s}=e,a=yield n.comment.updateOne({_id:i.id,userId:o._id},{$set:{text:s.text}},{new:!0}).exec();return t.status(a.ok<1?400:200).json({result:a})}catch(e){r(e)}})).delete("/:id",i.default("member"),(e,t,r)=>n(this,void 0,void 0,function*(){try{const{db:n,user:o,params:i,body:s}=e,a=yield n.comment.deleteOne({_id:i.id,userId:o._id}).error();return t.status(200).json(a)}catch(e){r(e)}}))}]);