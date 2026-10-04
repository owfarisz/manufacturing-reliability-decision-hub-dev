import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'ROOTSYNC | Reliability Decision Platform',description:'R.O.O.T. reliability decisions for KO-3201 and HE-3301'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
