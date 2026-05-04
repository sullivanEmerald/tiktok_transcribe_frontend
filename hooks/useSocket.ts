import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(API_URL!, {
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,

            transports: ['websocket'],
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return socketRef;
}