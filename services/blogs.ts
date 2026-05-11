
import client from '@/lib/contentful';
import { BlogPostEntry } from '@/types/blogs';

export async function getAllPosts(): Promise<BlogPostEntry[]> {
    const entries = await client.getEntries<any>({
        content_type: 'blogPost',
        order: ['-fields.date'],
        select: [
            'sys.id',
            'fields.title',
            'fields.slug',
            'fields.description',
            'fields.date',
            'fields.author',
            'fields.coverImage',
        ],
    });

    return entries.items as unknown as BlogPostEntry[];
}

// Fetch single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPostEntry | null> {
    const entries = await client.getEntries<any>({
        content_type: 'blogPost',
        'fields.slug': slug,
        limit: 1,
    });

    if (!entries.items.length) return null;

    return entries.items[0] as unknown as BlogPostEntry;
}

// Fetch all slugs for generateStaticParams
export async function getAllSlugs(): Promise<string[]> {
    const entries = await client.getEntries<any>({
        content_type: 'blogPost',
        select: ['fields.slug'],
    });

    return entries.items.map((item: any) => item.fields.slug);
}