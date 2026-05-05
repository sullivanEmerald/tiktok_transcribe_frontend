// import { io, Socket } from 'socket.io-client';

// const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;
// const socketRegistry = new Map<string, Socket>();

// export function getSocket(jobId: string): Socket {
//     const existing = socketRegistry.get(jobId);
//     if (existing?.connected) return existing;

//     // stale disconnected socket — remove it
//     if (existing) {
//         existing.removeAllListeners();
//         socketRegistry.delete(jobId);
//     }

//     const socket = io(`${API_URL}/jobs`, {
//         query: { jobId },
//         transports: ['websocket'],
//         reconnectionAttempts: 3,    // ✅ give up after 3, don't hang forever
//         reconnectionDelay: 1000,
//         timeout: 10000,             // ✅ 10s connect timeout
//     });

//     socketRegistry.set(jobId, socket);
//     return socket;
// }

// export function destroySocket(jobId: string): void {
//     const socket = socketRegistry.get(jobId);
//     if (socket) {
//         socket.removeAllListeners();
//         socket.disconnect();
//         socketRegistry.delete(jobId);
//     }
// }