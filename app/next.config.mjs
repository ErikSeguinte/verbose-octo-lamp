import * as NextMdx from '@next/mdx'
import remarkGfm from 'remark-gfm'

export const withMDX = NextMdx.default({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [remarkGfm], // ESM ✅
    },
  });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}
 

export default withMDX(nextConfig)