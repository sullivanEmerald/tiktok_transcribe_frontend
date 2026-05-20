'use client';

import { useEffect } from 'react';

export default function DeviceInitializer() {
    useEffect(() => {
        let deviceId = localStorage.getItem('deviceId');

        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem('deviceId', deviceId);
        }
    }, []);

    return null;
}