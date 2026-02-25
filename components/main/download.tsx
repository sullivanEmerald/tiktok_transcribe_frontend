import Image from 'next/image';

export default function Download() {
    return (
        <>
            <div className="flex flex-col items-center">
                <h2 className="text-lg font-bold bg-primary text-white rounded-3xl px-4 py-2">Extra Offer</h2>
                <p className="text-muted-foreground text-center mt-1">
                    With just one click, you can save your videos hassle-free and enjoy them anytime, anywhere.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-[55%] flex flex-col items-start justify-between gap-4">
                    <div className='flex flex-col gap-6'>
                        <h2 className="text-[32px] font-bold text-primary">Download Your Video Instantly</h2>
                        <p className="text-lg text-gray-700">
                            Once your transcription is complete, you can effortlessly download the original video directly to your device. Enjoy seamless access to your content—no extra steps, no hassle. Our platform makes it easy to save your videos for offline viewing, sharing, or archiving, all in just one click.
                        </p>
                    </div>
                    <div className="w-full flex-shrink-0">
                        <Image
                            src="/image/icons.png"
                            alt="Download Image"
                            width={400}
                            height={400}
                            quality={100}
                            priority
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="w-full md:w-[40%] flex-shrink-0">
                    <Image
                        src="/image/download.png"
                        alt="Download Image"
                        width={400}
                        height={400}
                        quality={100}
                        priority
                        className="rounded-2xl shadow-md w-full h-auto object-contain"
                    />
                </div>

            </div>
        </>
    );
}