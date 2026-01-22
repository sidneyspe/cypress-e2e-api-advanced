const CHUNK_PUBLIC_PATH = "server/app/tests/page.js";
const runtime = require("../../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_055c66._.js");
runtime.loadChunk("server/chunks/ssr/[project]_report-dashboard_bc9eda._.js");
runtime.getOrInstantiateRuntimeModule("[project]/report-dashboard/.next-internal/server/app/tests/page/actions.js [app-rsc] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/report-dashboard/node_modules/next/dist/esm/build/templates/app-page.js?page=/tests/page { COMPONENT_0 => \"[project]/report-dashboard/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)\", COMPONENT_1 => \"[project]/report-dashboard/node_modules/next/dist/client/components/not-found-error.js [app-rsc] (ecmascript, Next.js server component)\", COMPONENT_2 => \"[project]/report-dashboard/src/app/tests/page.tsx [app-rsc] (ecmascript, Next.js server component)\" } [app-rsc] (ecmascript) <facade>", CHUNK_PUBLIC_PATH).exports;
