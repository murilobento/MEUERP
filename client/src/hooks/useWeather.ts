import { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';

export interface DailyForecast {
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    code: number;
}

interface WeatherData {
    temp: number;
    condition: string;
    city: string;
    loading: boolean;
    forecast: DailyForecast[];
}

// Mapeamento de códigos WMO para descrições em português
export const getWeatherDescription = (code: number): string => {
    if (code === 0) return 'Céu Limpo';
    if (code >= 1 && code <= 3) return 'Parcialmente Nublado';
    if (code >= 45 && code <= 48) return 'Nevoeiro';
    if (code >= 51 && code <= 55) return 'Chuvisco';
    if (code >= 61 && code <= 67) return 'Chuva';
    if (code >= 71 && code <= 77) return 'Neve';
    if (code >= 80 && code <= 82) return 'Pancadas de Chuva';
    if (code >= 85 && code <= 86) return 'Neve';
    if (code >= 95 && code <= 99) return 'Tempestade';
    return 'Desconhecido';
};

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData>({
        temp: 0,
        condition: '',
        city: 'Carregando...',
        loading: true,
        forecast: [],
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 1. Buscar cidade da empresa
                const settings = await companyService.getSettings();
                const city = settings.city || 'São Paulo';

                // 2. Buscar coordenadas da cidade (Geocoding API)
                const geoResponse = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
                );
                const geoData = await geoResponse.json();

                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('Cidade não encontrada');
                }

                const { latitude, longitude, name } = geoData.results[0];

                // 3. Buscar dados do clima (Weather API) - Incluindo forecast diário
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const weatherData = await weatherResponse.json();

                // Processar forecast (próximos 5 dias)
                const daily = weatherData.daily;
                const forecast: DailyForecast[] = [];

                // Pegar apenas os próximos 3 dias (excluindo hoje se quiser, ou incluindo)
                // Vamos pegar os próximos 3 dias a partir de amanhã
                for (let i = 1; i <= 3; i++) {
                    if (daily.time[i]) {
                        forecast.push({
                            date: new Date(daily.time[i]).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
                            maxTemp: Math.round(daily.temperature_2m_max[i]),
                            minTemp: Math.round(daily.temperature_2m_min[i]),
                            code: daily.weather_code[i],
                            condition: getWeatherDescription(daily.weather_code[i]),
                        });
                    }
                }

                setWeather({
                    temp: Math.round(weatherData.current.temperature_2m),
                    condition: getWeatherDescription(weatherData.current.weather_code),
                    city: name,
                    loading: false,
                    forecast,
                });

            } catch (error) {
                console.error('Erro ao carregar clima:', error);
                setWeather(prev => ({
                    ...prev,
                    city: 'Indisponível',
                    condition: '-',
                    temp: 0,
                    loading: false,
                    forecast: []
                }));
            }
        };

        fetchWeather();
    }, []);

    return weather;
};
