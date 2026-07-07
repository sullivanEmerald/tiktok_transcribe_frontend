import { HiArrowLongLeft } from 'react-icons/hi2';
import Link from 'next/link';
function GoHome() {
    return (
        <Link href="/" className='flex items-center gap-2 cursor-pointers'>
            <HiArrowLongLeft className="w-8 h-8 text-gray-700" />
            <span className='text-muted-foreground'>Back Home</span>
        </Link>
    )
}

export { GoHome }