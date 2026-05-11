import { getPostBySlug, getAllSlugs } from '@/services/blogs';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import moment from 'moment';

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

    return (
        <div className="min-h-screen rounded-xl max-w-4xl mx-auto border border-gray mb-6">

            {/* Cover Image — Full Width */}
            {post.fields.coverImage?.fields?.file?.url && (
                <div className="w-full overflow-hidden">
                    <img
                        src={`https:${post.fields.coverImage.fields.file.url}`}
                        alt={post.fields.title}
                        className="w-full h-auto object-cover rounded-tl-xl rounded-tr-xl group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="max-w-3xl px-4 py-12">
                <Link
                    href="/blog"
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors mb-8 inline-flex items-center gap-1"
                >
                    ← Back to Blog
                </Link>
                <div className="mt-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                        {post.fields.author?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{post.fields.author}</p>
                        <p className="text-xs text-gray-400">{moment(post.fields.date).fromNow()}</p>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4 leading-tight">
                    {post.fields.title}
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-500 mb-8 leading-relaxed border-l-4 border-red-500 pl-4">
                    {post.fields.description}
                </p>

                <hr className="mb-8 border-gray-100" />

                {/* Body */}
                <div className="prose prose-neutral prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-red-600 prose-strong:text-gray-900 max-w-none">
                    {documentToReactComponents(post.fields.body)}
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
    );
}