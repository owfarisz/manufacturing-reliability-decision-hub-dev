// Single place for base-path handling. next/link and the router prefix basePath
// automatically, so route() stays base-free and asset() is only for raw URLs
// such as <img src>.
const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
export const routes={home:'/',dashboard:'/dashboard',ko:'/assets/ko-3201',he:'/assets/he-3301',actions:'/actions'} as const;
export type RouteKey=keyof typeof routes;
export function asset(path:string){return `${basePath}${path.startsWith('/')?path:`/${path}`}`}
