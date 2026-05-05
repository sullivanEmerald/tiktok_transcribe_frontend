// import { useEffect, useState, useRef } from 'react';
// import type { TranscriptData } from '@/types/transcribe';
// import { showToaster } from '@/lib/utils';

// export type JobStatus = 'idle' | 'processing' | 'completed' | 'error';

// export function useJobSocket(jobId: string | null) {
//     const [status, setStatus] = useState<JobStatus>('idle');
//     const [transcript, setTranscript] = useState<TranscriptData | null>(null);
//     const prevJobId = useRef<string | null>(null);

//     useEffect(() => {
//         if (!jobId) return;

//         if (prevJobId.current && prevJobId.current !== jobId) {
//             destroySocket(prevJobId.current);
//         }
//         prevJobId.current = jobId;

//         setStatus('processing');
//         const socket = getSocket(jobId);

//         const onCompleted = (data: TranscriptData) => {
//             setTranscript(data);
//             setStatus('completed');
//             destroySocket(jobId);
//         };

//         const onError = ({ message }: { message: string }) => {
//             showToaster(message, 'error');
//             setStatus('error');
//             destroySocket(jobId);
//         };

//         const onDisconnect = (reason: string) => {
//             // ✅ transport closed before job completed = failed
//             if (reason === 'transport close' || reason === 'transport error') {
//                 setStatus('error');
//                 showToaster('Connection lost. Please try again.', 'error');
//                 destroySocket(jobId);
//             }
//             // 'io server disconnect' = intentional, ignore
//         };

//         const onConnectError = () => {
//             // ✅ never connected at all — unblock UI immediately
//             setStatus('error');
//             showToaster('Could not connect. Please try again.', 'error');
//             destroySocket(jobId);
//         };

//         const onReconnectFailed = () => {
//             // ✅ exhausted all reconnection attempts
//             setStatus('error');
//             showToaster('Connection failed. Please try again.', 'error');
//             destroySocket(jobId);
//         };

//         socket.on('completed-transcribe', onCompleted);
//         socket.on('error-transcribe', onError);
//         socket.on('disconnect', onDisconnect);
//         socket.on('connect_error', onConnectError);
//         socket.io.on('reconnect_failed', onReconnectFailed);

//         return () => {
//             socket.off('completed-transcribe', onCompleted);
//             socket.off('error-transcribe', onError);
//             socket.off('disconnect', onDisconnect);
//             socket.off('connect_error', onConnectError);
//             socket.io.off('reconnect_failed', onReconnectFailed);
//         };
//     }, [jobId]);

//     return { status, transcript, setTranscript };
// }