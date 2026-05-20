import { getPostBySlug, getAllSlugs } from '@/services/blogs';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import moment from 'moment';
import Image from 'next/image';
import { BLOCKS } from '@contentful/rich-text-types';

export const revalidate = 3600;

// Pre-generate all blog post pages at build time
export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Dynamic SEO metadata per post
export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    if (!post) return {};

    return {
        title: `${post.fields.title} — ClipScript`,
        description: post.fields.description,
        openGraph: {
            title: post.fields.title,
            description: post.fields.description,
            url: `https://www.useclipscript.com/blog/${post.fields.slug}`,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = await getPostBySlug(params.slug);

    if (!post) notFound();

    const options = {
        renderNode: {
            [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
                <p className="text-muted-foreground leading-8 mb-4">
                    {children}
                </p>
            ),

            [BLOCKS.HEADING_2]: (_node: any, children: any) => (
                <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                    {children}
                </h2>
            ),

            [BLOCKS.HR]: () => (
                <hr className="border-gray-500 my-4" />
            ),
        },
    };

    return (
        <div className='min-h-screen max-w-4xl mx-auto bg-card rounded-md'>
            {/* <h1 className='mb-4 font-bold text-primary truncate border-l-4 border-red-700 pl-2'>{post.fields.title}</h1> */}
            <div className="mb-8">
                {post.fields.coverImage?.fields?.file?.url && (
                    <div className="w-full overflow-hidden">
                        <Image
                            src={`https:${post.fields.coverImage.fields.file.url}`}
                            alt={post.fields.title}
                            width={post.fields.coverImage.fields.file.details.image.width}
                            height={post.fields.coverImage.fields.file.details.image.height}
                            className="w-full h-auto object-cover rounded-tl-xl rounded-tr-xl group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                <div className="w-full px-4 py-6">
                    <Link
                        href="/blog"
                        className="text-sm text-gray-400 hover:text-red-500 transition-colors mb-4 inline-flex items-center gap-1"
                    >
                        ← Back to Blog
                    </Link>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                            {post.fields.author?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">{post.fields.author}</p>
                            <p className="text-xs text-gray-400">{moment(post.fields.date).fromNow()}</p>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-foreground mt-6 mb-4 leading-tight">
                        {post.fields.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                        {post.fields.description}
                    </p>

                    <hr className="mb-8 border-gray-100" />

                    {/* Body */}
                    <div>
                        {documentToReactComponents(post.fields.body, options)}
                    </div>

                    <hr className="my-12 border-gray-100" />

                    {/* Footer CTA */}
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Ready to transcribe your videos?
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Turn TikTok, Reels & Shorts into clean transcripts instantly with ClipScript.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                        >
                            Try ClipScript Free →
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}