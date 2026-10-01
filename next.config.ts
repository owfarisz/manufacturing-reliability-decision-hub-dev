import type {NextConfig} from 'next';
const pagesBasePath=process.env.GITHUB_PAGES_BASE_PATH;
const nextConfig:NextConfig=pagesBasePath?{output:'export',trailingSlash:true,basePath:pagesBasePath,env:{NEXT_PUBLIC_BASE_PATH:pagesBasePath}}:{env:{NEXT_PUBLIC_BASE_PATH:''}};
export default nextConfig;
