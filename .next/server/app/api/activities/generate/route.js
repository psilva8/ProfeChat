(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[850],{2067:e=>{"use strict";e.exports=require("node:async_hooks")},6195:e=>{"use strict";e.exports=require("node:buffer")},1239:(e,a,t)=>{"use strict";t.r(a),t.d(a,{ComponentMod:()=>I,default:()=>b});var r={};t.r(r),t.d(r,{POST:()=>g,dynamic:()=>f,runtime:()=>v});var i={};t.r(i),t.d(i,{headerHooks:()=>w,originalPathname:()=>P,patchFetch:()=>_,requestAsyncStorage:()=>E,routeModule:()=>m,serverHooks:()=>x,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>y});var s=t(7875),n=t(8381),o=t(2251),d=t(9845),c=t(572),u=t(3977),l=t(6035),p=t(4193);let v="edge",f="force-dynamic";async function g(e){try{let a=await (0,u.I8)();if(!a?.user)return c.xk.json({error:"Unauthorized"},{status:401});let{title:t,grade:r,subject:i,type:s,duration:n,objectives:o,materials:d}=await e.json();if(!t||!r||!i||!s||!n||!o||!d)return c.xk.json({error:"Missing required fields"},{status:400});let v=`Por favor, genera una actividad educativa detallada con las siguientes caracter\xedsticas:

T\xedtulo: ${t}
Grado: ${r}\xb0 de primaria
Asignatura: ${i}
Tipo de actividad: ${s}
Duraci\xf3n: ${n} minutos
Objetivos de aprendizaje: ${o}
Materiales necesarios: ${d.join(", ")}

La actividad debe incluir:
1. Descripci\xf3n general
2. Paso a paso detallado
3. Sugerencias de adaptaci\xf3n
4. Criterios de evaluaci\xf3n
5. Extensiones o variaciones

Formato de respuesta:
{
  "activity": {
    "description": "Descripci\xf3n general de la actividad",
    "steps": [
      {
        "order": 1,
        "description": "Descripci\xf3n del paso"
      }
    ],
    "adaptations": [
      "Sugerencia de adaptaci\xf3n 1",
      "Sugerencia de adaptaci\xf3n 2"
    ],
    "evaluationCriteria": [
      "Criterio de evaluaci\xf3n 1",
      "Criterio de evaluaci\xf3n 2"
    ],
    "variations": [
      "Variaci\xf3n o extensi\xf3n 1",
      "Variaci\xf3n o extensi\xf3n 2"
    ]
  }
}`,f=await l.f.chat.completions.create({model:"gpt-3.5-turbo",messages:[{role:"system",content:"You are a helpful assistant that generates educational activities."},{role:"user",content:v}]});if(!f.choices[0].message?.content)return c.xk.json({error:"Failed to generate activity"},{status:500});let g=await p.db.activity.create({data:{userId:a.user.id,title:t,subject:i,grade:r,type:s,duration:n,objectives:o,content:f.choices[0].message.content||"",materials:JSON.stringify(d)}});return c.xk.json(g)}catch(e){return console.error("Error generating activity:",e),c.xk.json({error:"Internal Server Error"},{status:500})}}let m=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/activities/generate/route",pathname:"/api/activities/generate",filename:"route",bundlePath:"app/api/activities/generate/route"},resolvedPagePath:"/Users/paulsilva/Documents/demo-02/src/app/api/activities/generate/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:E,staticGenerationAsyncStorage:h,serverHooks:x,headerHooks:w,staticGenerationBailout:y}=m,P="/api/activities/generate/route";function _(){return(0,d.XH)({serverHooks:x,staticGenerationAsyncStorage:h})}let I=i,b=s.a.wrap(m)},3977:(e,a,t)=>{"use strict";t.d(a,{I8:()=>l});var r=t(5503),i=t(4193),s=t(434),n=t.n(s),o=t(5326),d=t(3013),c=t(1017);let u={adapter:(0,r.N)(i.db),providers:[(0,d.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Invalid credentials");let a=e.email,t=e.password,r=await i.db.user.findUnique({where:{email:a}});if(!r||!r?.hashedPassword)throw Error("User not found");if(!await n().compare(t,r.hashedPassword))throw Error("Invalid password");return{id:r.id,name:r.name,email:r.email,image:r.image}}}),(0,c.Z)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET})],pages:{signIn:"/auth/login"},session:{strategy:"jwt"},callbacks:{jwt:async({token:e,user:a})=>(a&&(e.id=a.id),e),session:async({session:e,token:a})=>(e.user&&(e.user.id=a.id),e)},secret:process.env.NEXTAUTH_SECRET},{auth:l,handlers:{GET:p,POST:v},signIn:f,signOut:g}=(0,o.ZP)(u)},4193:(e,a,t)=>{"use strict";t.d(a,{db:()=>r});let r=new(t(1715)).PrismaClient},6035:(e,a,t)=>{"use strict";t.d(a,{f:()=>i});var r=t(5666);if(!process.env.OPENAI_API_KEY)throw Error("Missing OPENAI_API_KEY environment variable");let i=new r.ZP({apiKey:process.env.OPENAI_API_KEY})}},e=>{var a=a=>e(e.s=a);e.O(0,[569,372,666],()=>a(1239));var t=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/activities/generate/route"]=t}]);
//# sourceMappingURL=route.js.map