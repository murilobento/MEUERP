import { useState, useEffect } from 'react';

interface WeatherData {
    temp: number;
    condition: string;
    city: string;
    loading: boolean;
}

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData>({
        temp: 0,
        condition: 'Sunny',
        city: 'São Paulo',
        loading: true,
    });

    useEffect(() => {
        // Simulação de chamada de API
        // Em produção, substituir por chamada real à OpenWeatherMap ou similar
        const fetchWeather = async () => {
            try {
                // Simula delay de rede
                await new Promise(resolve => setTimeout(resolve, 1000));

                setWeather({
                    temp: 24,
                    condition: 'Partly Cloudy',
                    city: 'São Paulo',
                    loading: false,
                });
            } catch (error) {
                console.error('Erro ao carregar clima', error);
                setWeather(prev => ({ ...prev, loading: false }));
            }
        };

        fetchWeather();
    }, []);

    return weather;
};
