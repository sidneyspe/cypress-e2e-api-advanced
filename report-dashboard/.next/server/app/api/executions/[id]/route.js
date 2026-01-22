"use strict";(()=>{var e={};e.id=131,e.ids=[131],e.modules={5890:e=>{e.exports=require("better-sqlite3")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},4140:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>L,patchFetch:()=>f,requestAsyncStorage:()=>E,routeModule:()=>c,serverHooks:()=>N,staticGenerationAsyncStorage:()=>p});var i={};s.r(i),s.d(i,{DELETE:()=>T,GET:()=>l});var o=s(9303),d=s(8716),u=s(670),a=s(7070),r=s(510),n=s(7745);async function l(e,{params:t}){try{let e=parseInt(t.id),s=await r.db.select().from(r.f.executions).where((0,n.eq)(r.f.executions.id,e)).limit(1);if(!s.length)return a.NextResponse.json({success:!1,error:"Execution not found"},{status:404});let i=s[0],o=(await r.db.select().from(r.f.tests).where((0,n.eq)(r.f.tests.executionId,e))).map(e=>({id:e.id,testId:e.testId,uuid:e.uuid||void 0,title:e.title,fullTitle:e.fullTitle||void 0,suitePath:e.suitePath||void 0,file:e.file||void 0,status:e.status,duration:e.duration,speed:e.speed||void 0,errorMessage:e.errorMessage||void 0,errorStack:e.errorStack||void 0,code:e.code||void 0,squad:e.squad||void 0,executionType:e.executionType||void 0,product:e.product||void 0,module:e.module||void 0,functionality:e.functionality||void 0})),d={id:i.id,date:i.date,dateKey:i.dateKey,totalTests:i.totalTests,passed:i.passed,failed:i.failed,skipped:i.skipped,pending:i.pending,passRate:i.passRate,duration:i.duration,squad:i.squad||void 0,executionType:i.executionType||void 0,product:i.product||void 0,module:i.module||void 0,functionality:i.functionality||void 0,tests:o};return a.NextResponse.json({success:!0,data:d})}catch(e){return console.error("Error fetching execution:",e),a.NextResponse.json({success:!1,error:"Failed to fetch execution"},{status:500})}}async function T(e,{params:t}){try{let e=parseInt(t.id);return await r.db.delete(r.f.tests).where((0,n.eq)(r.f.tests.executionId,e)),await r.db.delete(r.f.executions).where((0,n.eq)(r.f.executions.id,e)),a.NextResponse.json({success:!0})}catch(e){return console.error("Error deleting execution:",e),a.NextResponse.json({success:!1,error:"Failed to delete execution"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:d.x.APP_ROUTE,page:"/api/executions/[id]/route",pathname:"/api/executions/[id]",filename:"route",bundlePath:"app/api/executions/[id]/route"},resolvedPagePath:"C:\\Users\\Sidney\\OneDrive\\Documents\\workspace\\cypress-2026\\report-dashboard\\src\\app\\api\\executions\\[id]\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:E,staticGenerationAsyncStorage:p,serverHooks:N}=c,L="/api/executions/[id]/route";function f(){return(0,u.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:p})}},510:(e,t,s)=>{s.d(t,{db:()=>I,f:()=>i});var i={};s.r(i),s.d(i,{executions:()=>T,tags:()=>E,tests:()=>c});var o=s(5890),d=s.n(o),u=s(8757),a=s(7106),r=s(5795),n=s(3586),l=s(4341);let T=(0,a.Px)("executions",{id:(0,r._L)("id").primaryKey({autoIncrement:!0}),date:(0,n.fL)("date").notNull(),dateKey:(0,n.fL)("date_key").notNull(),createdAt:(0,n.fL)("created_at").notNull(),totalTests:(0,r._L)("total_tests").notNull().default(0),passed:(0,r._L)("passed").notNull().default(0),failed:(0,r._L)("failed").notNull().default(0),skipped:(0,r._L)("skipped").notNull().default(0),pending:(0,r._L)("pending").notNull().default(0),passRate:(0,l.kw)("pass_rate").notNull().default(0),duration:(0,r._L)("duration").notNull().default(0),squad:(0,n.fL)("squad"),executionType:(0,n.fL)("execution_type"),product:(0,n.fL)("product"),module:(0,n.fL)("module"),functionality:(0,n.fL)("functionality")}),c=(0,a.Px)("tests",{id:(0,r._L)("id").primaryKey({autoIncrement:!0}),executionId:(0,r._L)("execution_id").notNull().references(()=>T.id,{onDelete:"cascade"}),testId:(0,n.fL)("test_id").notNull(),uuid:(0,n.fL)("uuid"),title:(0,n.fL)("title").notNull(),fullTitle:(0,n.fL)("full_title"),suitePath:(0,n.fL)("suite_path"),file:(0,n.fL)("file"),status:(0,n.fL)("status").notNull(),duration:(0,r._L)("duration").notNull().default(0),speed:(0,n.fL)("speed"),errorMessage:(0,n.fL)("error_message"),errorStack:(0,n.fL)("error_stack"),code:(0,n.fL)("code"),squad:(0,n.fL)("squad"),executionType:(0,n.fL)("execution_type"),product:(0,n.fL)("product"),module:(0,n.fL)("module"),functionality:(0,n.fL)("functionality")}),E=(0,a.Px)("tags",{id:(0,r._L)("id").primaryKey({autoIncrement:!0}),type:(0,n.fL)("type").notNull(),value:(0,n.fL)("value").notNull()});var p=s(5315),N=s.n(p),L=s(2048),f=s.n(L);let x=N().join(process.cwd(),"data");f().existsSync(x)||f().mkdirSync(x,{recursive:!0});let y=N().join(x,"cypress-reports.db"),_=new(d())(y);_.pragma("foreign_keys = ON");let I=(0,u.t)(_,{schema:i});_.exec(`
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
  `)}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[276,714],()=>s(4140));module.exports=i})();