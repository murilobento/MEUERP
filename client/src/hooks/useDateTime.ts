import { useState, useEffect } from 'react';

export const useDateTime = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    });

    const formattedTime = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return { date, formattedDate, formattedTime };
};
