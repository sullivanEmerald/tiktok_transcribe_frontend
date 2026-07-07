import React from 'react';
import { ShieldCheck, UserPlus, LogIn, KeyRound, MessageCircle } from 'lucide-react';
import Logo from '../genreral/logo';

export default function AuthInformations() {
    return (
        <div className="min-h-[calc(100vh-4rem)] fixed w-[45%] flex flex-col md:flex-row p-6 rounded-2xl">
            <aside className="hidden md:flex relative overflow-hidden bg-[url('/image/authBackground.png')] bg-cover bg-no-repeat w-full text-white flex-col justify-center items-center relative rounded-2xl">
                <div className="absolute inset-0 bg-gray-900/95" />
                <div className="max-w-md w-full flex flex-col gap-4 items-center relative">
                    <div className="flex flex-col items-center gap-2">
                        <Logo />
                        <h2 className="text-3xl font-bold text-white-700 text-center">Welcome to Clip Script</h2>
                        <p className="text-lg text-center opacity-90 text-muted-foreground px-4">
                            Turn TikTok, Reels & Shorts into clean transcripts instantly.
                        </p>
                    </div>
                    <div className="flex flex-col gap-6 mt-8 w-full lg:px-6">
                        <div className="flex items-center gap-4">
                            <div className='rounded-full p-2 bg-primary/70'>
                                <UserPlus className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">Users benefit from our advanced features</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className='rounded-full p-2 bg-primary/70'>
                                <LogIn className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">Users have access to more transcriptions per day</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className='rounded-full p-2 bg-primary/70'>
                                <KeyRound className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">Users Data and Privacy Protection</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className='rounded-full p-2 bg-primary/70'>
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">Instant platform support</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-2 left-0 w-full text-center text-xs opacity-60">
                    &copy; {new Date().getFullYear()} Clip Script. All rights reserved.
                </div>
            </aside>
        </div>
    );
}
