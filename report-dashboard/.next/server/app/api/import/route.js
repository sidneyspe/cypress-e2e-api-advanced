"use strict";(()=>{var e={};e.id=427,e.ids=[427],e.modules={5890:e=>{e.exports=require("better-sqlite3")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},2397:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>y,patchFetch:()=>g,requestAsyncStorage:()=>f,routeModule:()=>E,serverHooks:()=>L,staticGenerationAsyncStorage:()=>N});var r={};s.r(r),s.d(r,{POST:()=>p});var i=s(9303),a=s(8716),u=s(670),o=s(7070),n=s(510),l=s(2048),d=s.n(l),T=s(5315),c=s.n(T);async function p(e){try{let{data:t,tags:s}=await e.json();if(!t||!t.stats||!t.results)return o.NextResponse.json({success:!1,error:"Invalid Cypress result format"},{status:400});let r=t.stats,i=new Date,a=("string"==typeof i?new Date(i):i).toISOString().split("T")[0],u=function(e){let[t,s,r]=e.split("-");return`${r}/${s}/${t}`}(a),l=new Map,T=[];t.results.forEach(e=>{let t=e.file||e.fullFile||"";if(e.suites&&e.suites.length>0){let s=function(e,t=[],s="",r){let i=[],a=0,u=(e,t,s)=>{let o=e.title?[...t,e.title]:t,n=e.file||s,l=r.get(n.toLowerCase());if(!l){let e=function(e){try{let t=e.replace(/\\/g,"/"),s=[c().join(process.cwd(),"..",t),c().join(process.cwd(),"..","cypress","e2e",c().basename(c().dirname(t)),c().basename(t))],r="";for(let e of s)if(d().existsSync(e)){r=d().readFileSync(e,"utf8");break}if(!r)return null;let i=r.match(/tags:\s*\{([^}]+)\}/s);if(!i)return null;let a=i[1],u={};return[{key:"squad",regex:/squad:\s*['"]([^'"]+)['"]/},{key:"executionType",regex:/executionType:\s*['"]([^'"]+)['"]/},{key:"product",regex:/product:\s*['"]([^'"]+)['"]/},{key:"module",regex:/module:\s*['"]([^'"]+)['"]/},{key:"functionality",regex:/functionality:\s*['"]([^'"]+)['"]/}].forEach(({key:e,regex:t})=>{let s=a.match(t);s&&(u[e]=s[1])}),Object.keys(u).length>0?u:null}catch(t){return console.error(`Error extracting tags from ${e}:`,t),null}}(n);e&&(r.set(n.toLowerCase(),e),l=e)}return(e.tests||[]).forEach(e=>{let t=e.pass?"passed":e.fail?"failed":e.pending?"pending":"skipped";i.push({testId:`test-${a++}`,uuid:e.uuid,title:e.title,fullTitle:e.fullTitle||[...o,e.title].join(" > "),suitePath:o,file:n,status:t,duration:e.duration||0,speed:e.speed||"fast",code:e.code||"",errorMessage:e.err?.message,errorStack:e.err?.estack||e.err?.stack,tags:l||{}})}),(e.suites||[]).forEach(e=>{let t=u(e,o,n);i.push(...t)}),i};return e.forEach(e=>u(e,t,s)),i}(e.suites,[],t,l);T.push(...s)}});let p=T.filter(e=>"passed"===e.status).length,E=T.filter(e=>"failed"===e.status).length,f=T.filter(e=>"pending"===e.status).length,N=T.filter(e=>"skipped"===e.status).length,L=T.length,y=L>0?p/L*100:0,g=(await n.db.insert(n.f.executions).values({date:u,dateKey:a,createdAt:i.toISOString(),totalTests:L,passed:p,failed:E,skipped:N,pending:f,passRate:y,duration:r.duration||0,squad:s?.squad,executionType:s?.executionType,product:s?.product,module:s?.module,functionality:s?.functionality}).returning())[0].id;return T.length>0&&await n.db.insert(n.f.tests).values(T.map(e=>({executionId:g,testId:e.testId,uuid:e.uuid,title:e.title,fullTitle:e.fullTitle,suitePath:JSON.stringify(e.suitePath),file:e.file,status:e.status,duration:e.duration,speed:e.speed,errorMessage:e.errorMessage,errorStack:e.errorStack,code:e.code,squad:e.tags.squad,executionType:e.tags.executionType,product:e.tags.product,module:e.tags.module,functionality:e.tags.functionality}))),o.NextResponse.json({success:!0,data:{executionId:g,totalTests:L,passed:p,failed:E,pending:f,skipped:N,passRate:y.toFixed(1)}})}catch(e){return console.error("Error importing Cypress results:",e),o.NextResponse.json({success:!1,error:"Failed to import results"},{status:500})}}let E=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/import/route",pathname:"/api/import",filename:"route",bundlePath:"app/api/import/route"},resolvedPagePath:"C:\\Users\\Sidney\\OneDrive\\Documents\\workspace\\cypress-2026\\report-dashboard\\src\\app\\api\\import\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:f,staticGenerationAsyncStorage:N,serverHooks:L}=E,y="/api/import/route";function g(){return(0,u.patchFetch)({serverHooks:L,staticGenerationAsyncStorage:N})}},510:(e,t,s)=>{s.d(t,{db:()=>m,f:()=>r});var r={};s.r(r),s.d(r,{executions:()=>T,tags:()=>p,tests:()=>c});var i=s(5890),a=s.n(i),u=s(8757),o=s(7106),n=s(5795),l=s(3586),d=s(4341);let T=(0,o.Px)("executions",{id:(0,n._L)("id").primaryKey({autoIncrement:!0}),date:(0,l.fL)("date").notNull(),dateKey:(0,l.fL)("date_key").notNull(),createdAt:(0,l.fL)("created_at").notNull(),totalTests:(0,n._L)("total_tests").notNull().default(0),passed:(0,n._L)("passed").notNull().default(0),failed:(0,n._L)("failed").notNull().default(0),skipped:(0,n._L)("skipped").notNull().default(0),pending:(0,n._L)("pending").notNull().default(0),passRate:(0,d.kw)("pass_rate").notNull().default(0),duration:(0,n._L)("duration").notNull().default(0),squad:(0,l.fL)("squad"),executionType:(0,l.fL)("execution_type"),product:(0,l.fL)("product"),module:(0,l.fL)("module"),functionality:(0,l.fL)("functionality")}),c=(0,o.Px)("tests",{id:(0,n._L)("id").primaryKey({autoIncrement:!0}),executionId:(0,n._L)("execution_id").notNull().references(()=>T.id,{onDelete:"cascade"}),testId:(0,l.fL)("test_id").notNull(),uuid:(0,l.fL)("uuid"),title:(0,l.fL)("title").notNull(),fullTitle:(0,l.fL)("full_title"),suitePath:(0,l.fL)("suite_path"),file:(0,l.fL)("file"),status:(0,l.fL)("status").notNull(),duration:(0,n._L)("duration").notNull().default(0),speed:(0,l.fL)("speed"),errorMessage:(0,l.fL)("error_message"),errorStack:(0,l.fL)("error_stack"),code:(0,l.fL)("code"),squad:(0,l.fL)("squad"),executionType:(0,l.fL)("execution_type"),product:(0,l.fL)("product"),module:(0,l.fL)("module"),functionality:(0,l.fL)("functionality")}),p=(0,o.Px)("tags",{id:(0,n._L)("id").primaryKey({autoIncrement:!0}),type:(0,l.fL)("type").notNull(),value:(0,l.fL)("value").notNull()});var E=s(5315),f=s.n(E),N=s(2048),L=s.n(N);let y=f().join(process.cwd(),"data");L().existsSync(y)||L().mkdirSync(y,{recursive:!0});let g=f().join(y,"cypress-reports.db"),x=new(a())(g);x.pragma("foreign_keys = ON");let m=(0,u.t)(x,{schema:r});x.exec(`
    CREATE TABLE IF NOT EXISTS executions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      date_key TEXT NOT NULL,
      created_at TEXT NOT NULL,
      total_tests INTEGER NOT NULL DEFAULT 0,
      passed INTEGER NOT NULL DEFAULT 0,
      failed INTEGER NOT NULL DEFAULT 0,
      skipped INTEGER NOT NULL DEFAULT 0,
      pending INTEGER NOT NULL DEFAULT 0,
      pass_rate REAL NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      squad TEXT,
      execution_type TEXT,
      product TEXT,
      module TEXT,
      functionality TEXT
    );

    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      execution_id INTEGER NOT NULL,
      test_id TEXT NOT NULL,
      uuid TEXT,
      title TEXT NOT NULL,
      full_title TEXT,
      suite_path TEXT,
      file TEXT,
      status TEXT NOT NULL,
      duration INTEGER NOT NULL DEFAULT 0,
      speed TEXT,
      error_message TEXT,
      error_stack TEXT,
      code TEXT,
      squad TEXT,
      execution_type TEXT,
      product TEXT,
      module TEXT,
      functionality TEXT,
      FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      UNIQUE(type, value)
    );

    CREATE INDEX IF NOT EXISTS idx_executions_date_key ON executions(date_key);
    CREATE INDEX IF NOT EXISTS idx_tests_execution_id ON tests(execution_id);
    CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status);
    CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(type);
  `)}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[276,714],()=>s(2397));module.exports=r})();