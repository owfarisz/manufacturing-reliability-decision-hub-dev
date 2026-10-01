import type {NextConfig} from 'next';
const pagesBasePath=process.env.GITHUB_PAGES_BASE_PATH;
const nextConfig:NextConfig=pagesBasePath?{output:'export',trailingSlash:true,basePath:pagesBasePath}:{};
export default nextConfig;
