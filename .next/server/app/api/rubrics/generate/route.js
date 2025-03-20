(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[580],{2067:e=>{"use strict";e.exports=require("node:async_hooks")},6195:e=>{"use strict";e.exports=require("node:buffer")},1132:(e,r,a)=>{"use strict";a.r(r),a.d(r,{ComponentMod:()=>P,default:()=>N});var s={};a.r(s),a.d(s,{POST:()=>m,runtime:()=>f});var t={};a.r(t),a.d(t,{headerHooks:()=>h,originalPathname:()=>b,patchFetch:()=>I,requestAsyncStorage:()=>v,routeModule:()=>E,serverHooks:()=>g,staticGenerationAsyncStorage:()=>w,staticGenerationBailout:()=>_});var i=a(7875),n=a(8381),o=a(2251),c=a(9845),d=a(3977),l=a(6035),u=a(4193),p=a(572);let f="edge";async function m(e){try{let r=await (0,d.I8)();if(!r?.user?.id)return new p.xk("Unauthorized",{status:401});let{title:a,grade:s,subject:t,criteria:i}=await e.json();if(!a||!s||!t||!i)return new p.xk("Missing required fields",{status:400});let n=i.map(e=>`${e.name}: ${e.description}`).join("\n"),o=`Por favor, genera una r\xfabrica de evaluaci\xf3n detallada para ${a} en el grado ${s} de primaria para la asignatura de ${t}.

Los criterios a evaluar son:
${n}

Para cada criterio, genera 4 niveles de desempe\xf1o:
- Destacado (4 puntos)
- Satisfactorio (3 puntos)
- En proceso (2 puntos)
- Inicial (1 punto)

Formato de respuesta:
{
  "rubric": {
    "criteria": [
      {
        "name": "Nombre del criterio",
        "levels": {
          "destacado": "Descripci\xf3n del nivel destacado",
          "satisfactorio": "Descripci\xf3n del nivel satisfactorio",
          "enProceso": "Descripci\xf3n del nivel en proceso",
          "inicial": "Descripci\xf3n del nivel inicial"
        }
      }
    ]
  }
}`,c=await l.f.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"Eres un experto en educaci\xf3n especializado en la creaci\xf3n de r\xfabricas de evaluaci\xf3n. Tus respuestas deben ser claras, espec\xedficas y adecuadas para el nivel educativo indicado."},{role:"user",content:o}],response_format:{type:"json_object"}}),f=c.choices[0]?.message?.content;if(!f)throw Error("No content received from OpenAI");try{JSON.parse(f)}catch(e){return console.error("[JSON_PARSE_ERROR]",e),new p.xk("Invalid response format",{status:500})}let m=await u.db.rubric.create({data:{userId:r.user.id,title:a,subject:t,grade:s,criteria:JSON.stringify(i),content:f}});return p.xk.json(m)}catch(e){return console.error("[RUBRIC_GENERATION_ERROR]",e),new p.xk("Internal Error",{status:500})}}let E=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/rubrics/generate/route",pathname:"/api/rubrics/generate",filename:"route",bundlePath:"app/api/rubrics/generate/route"},resolvedPagePath:"/Users/paulsilva/Documents/demo-02/src/app/api/rubrics/generate/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:v,staticGenerationAsyncStorage:w,serverHooks:g,headerHooks:h,staticGenerationBailout:_}=E,b="/api/rubrics/generate/route";function I(){return(0,c.XH)({serverHooks:g,staticGenerationAsyncStorage:w})}let P=t,N=i.a.wrap(E)},3977:(e,r,a)=>{"use strict";a.d(r,{I8:()=>u});var s=a(5503),t=a(4193),i=a(434),n=a.n(i),o=a(5326),c=a(3013),d=a(1017);let l={adapter:(0,s.N)(t.db),providers:[(0,c.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Invalid credentials");let r=e.email,a=e.password,s=await t.db.user.findUnique({where:{email:r}});if(!s||!s?.hashedPassword)throw Error("User not found");if(!await n().compare(a,s.hashedPassword))throw Error("Invalid password");return{id:s.id,name:s.name,email:s.email,image:s.image}}}),(0,d.Z)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET})],pages:{signIn:"/auth/login"},session:{strategy:"jwt"},callbacks:{jwt:async({token:e,user:r})=>(r&&(e.id=r.id),e),session:async({session:e,token:r})=>(e.user&&(e.user.id=r.id),e)},secret:process.env.NEXTAUTH_SECRET},{auth:u,handlers:{GET:p,POST:f},signIn:m,signOut:E}=(0,o.ZP)(l)},4193:(e,r,a)=>{"use strict";a.d(r,{db:()=>s});let s=new(a(1715)).PrismaClient},6035:(e,r,a)=>{"use strict";a.d(r,{f:()=>t});var s=a(5666);if(!process.env.OPENAI_API_KEY)throw Error("Missing OPENAI_API_KEY environment variable");let t=new s.ZP({apiKey:process.env.OPENAI_API_KEY})}},e=>{var r=r=>e(e.s=r);e.O(0,[569,372,666],()=>r(1132));var a=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/rubrics/generate/route"]=a}]);
//# sourceMappingURL=route.js.map