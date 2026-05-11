// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard',        // private user pages
                    '/api/',             // API routes
                    '/admin/',           // admin pages if any
                    '/_next/',           // Next.js internals
                    '/profile/',         // user profile pages
                    '/settings/',        // user settings
                ],
            },
            {
                // Block AI scrapers from training on your content
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'CCBot',
                    'anthropic-ai',
                    'Claude-Web',
                ],
                disallow: '/',
            },
        ],
        sitemap: 'https://www.useclipscript.com/sitemap.xml',
        host: 'https://www.useclipscript.com',
    };
}