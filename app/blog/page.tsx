import { getAllPosts } from '@/services/blogs';
import Link from 'next/link';
import { Metadata } from 'next';
import moment from "moment"
import Image from 'next/image';
import { User, Timer, Users } from 'lucide-react';


export const metadata: Metadata = {
    title: 'Blog — ClipScript',
    description: 'Transcription tips, creator tools, and platform guides.',
};


export const revalidate = 30;

export default async function BlogPage() {
    let posts = await getAllPosts();
    if (!posts?.length) {
        return (
            <div className='rounded-md bg-card p-4 text-foreground max-w-md mx-auto'>
                <p className="text-2xl font-bold text-foreground">
                    No blog posts found
                </p>
                <span className="text-muted-foreground max-w-md">
                    There are currently no published blog posts available.
                    Please check back later.
                </span>
            </div>
        )
    }

    return (
        <main className="mb-8 flex flex-col gap-8">
            <div className='bg-blog rounded-md p-4 text-center'>
                <h1 className="text-3xl text-foreground font-bold">Clip Script Blogs</h1>
                <p className="text-gray-500">
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
                            <div className="w-full relative h-56 overflow-hidden bg-gray-50">
                                <Image
                                    src={`https:${post.fields.coverImage.fields.file.url}`}
                                    alt={post.fields.title}
                                    fill
                                    // width={post.fields.coverImage.fields.file.details.image.width}
                                    // height={post.fields.coverImage.fields.file.details.image.height}
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ) : (
                            <div className="w-full relative h-56 overflow-hidden bg-gray-50">
                                <Image
                                    src={`/image/fallback.jpeg`}
                                    alt={`blog thumbnail`}
                                    fill
                                    // width={200}
                                    // height={200}
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                                <h2 className="text-2xl font-bold absolute top-20 text-black text-center">
                                    {post?.fields?.title}
                                </h2>
                            </div>
                        )}
                        <div className="p-5 flex flex-col flex-1 space-y-2 bg-card">
                            <div className="mt-2 flex items-center gap-3">
                                <div className='flex items-center justify-between w-full'>
                                    <div className='flex items-center gap-1'>
                                        {post.fields.author ? <User className='h-4 w-4' /> : <Users className='h-4 w-4' />}
                                        <p className="text-sm font-medium text-foreground/60">{post.fields.author || 'Clip Script Team'}</p>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Timer className='h-4 w-4' />
                                        <p className="text-xs text-gray-400">{post.fields.date ? moment(post.fields.date).fromNow() : moment(post.fields.date).fromNow()}</p>
                                    </div>

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