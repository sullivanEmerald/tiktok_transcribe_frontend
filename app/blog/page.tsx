import { getAllPosts } from '@/services/blogs';
import Link from 'next/link';
import { Metadata } from 'next';
import moment from "moment"
import Image from 'next/image';


export const metadata: Metadata = {
    title: 'Blog — ClipScript',
    description: 'Transcription tips, creator tools, and platform guides.',
};


export const revalidate = 60;

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (

        <main className="mb-8 ">
            <div className='bg-card rounded-md p-2 text-center mb-3'>
                <h1 className="text-3xl text-foreground font-bold">Clip Script Blogs</h1>
                <p className="text-text-primary/70">
                    Stay up to date with the latest transcription tips, creator tools & platform guides
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.sys.id}
                        href={`/blog/${post.fields.slug}`}
                        className="group rounded-2xl overflow-hidden shadow-sm shadow-card hover:shadow-lg transition-shadow duration-300 bg-background flex flex-col hover:shadow-md"
                    >
                        {/* Cover Image */}
                        {post.fields.coverImage?.fields?.file?.url ? (
                            <div className="w-full overflow-hidden bg-gray-50">
                                <Image
                                    src={`https:${post.fields.coverImage.fields.file.url}`}
                                    alt={post.fields.title}
                                    width={post.fields.coverImage.fields.file.details.image.width}
                                    height={post.fields.coverImage.fields.file.details.image.height}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">ClipScript</span>
                            </div>
                        )}
                        <div className="p-5 flex flex-col flex-1 space-y-2 bg-card">
                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                                    {post.fields.author?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary/70">{post.fields.author}</p>
                                    <p className="text-xs text-gray-400">{moment(post.fields.date).fromNow()}</p>
                                </div>
                            </div>


                            <h2 className="text-lg font-bold text-foreground mt-6 mb-4 leading-tight truncate">
                                {post.fields.title}
                            </h2>

                            <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2">
                                {post.fields.description}
                            </p>

                            <div className='flex items-center justify-between mt-4'>
                                <span className="text-sm font-medium text-red-600 cursor-pointer">
                                    Read more →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}