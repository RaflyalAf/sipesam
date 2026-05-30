import { useState, useEffect } from 'react';

export const useSyncData = <T>(key: string, initialValue: T) => {
    const [data, setData] = useState<T>(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const item = localStorage.getItem(key);
            if (item) setData(JSON.parse(item));
        }, 500); // Sinkronisasi setiap 0.5 detik
        return () => clearInterval(interval);
    }, [key]);

    const updateData = (newData: T) => {
        localStorage.setItem(key, JSON.stringify(newData));
        setData(newData);
    };

    return [data, updateData] as const;
};