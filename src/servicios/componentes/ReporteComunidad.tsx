"use client"
import { ServicioDashboardData } from "../actions/servicios";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Wordcloud } from "@visx/wordcloud";
import { scaleLog } from "@visx/scale";
import { Text } from "@visx/text";
import { ParentSize } from "@visx/responsive";
import { MessageSquare, Star, TrendingUp } from "lucide-react";
import { AspectoMejorar } from "@prisma/client";

// Tipo explícito para wordCloudData
interface WordCloudData {
    text: string;
    value: number;
}

// Props con tipado estricto
interface ReporteComunidadProps {
    reportes: ServicioDashboardData["reportes"];
}

// Función para procesar datos para gráficos
const processData = (reportes: ServicioDashboardData["reportes"]) => {
    // Datos para línea temporal (agrupar por mes)
    const monthlyReports = reportes.data.reduce((acc, r) => {
        const month = new Date(r.fecha).toLocaleString("default", { month: "short", year: "numeric" });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const lineData = Object.entries(monthlyReports).map(([month, count]) => ({ month, count }));

    // Datos para barras de aspectos
    const barData = reportes.topAspectos.map((asp: AspectoMejorar) => ({
        name: asp,
        value: reportes.data.filter((r) => r.aspectosMejorar.includes(asp)).length,
    }));

    // Nube de síntomas (frecuencia)
    const symptomsMap = new Map<string, number>();
    reportes.data.forEach((r) => {
        r.sintomas.forEach((s) => {
            symptomsMap.set(s, (symptomsMap.get(s) || 0) + 1);
        });
    });
    const wordCloudData: WordCloudData[] = Array.from(symptomsMap.entries()).map(([text, value]) => ({
        text,
        value,
    }));

    return { lineData, barData, wordCloudData };
};

export function ReporteComunidad({ reportes }: ReporteComunidadProps) {
    if (reportes.count === 0) {
        return (
            <div className="bg-gray-50 min-h-screen p-6 md:p-8 text-center text-gray-600">
                No hay reportes aprobados disponibles.
            </div>
        );
    }

    const { lineData, barData, wordCloudData } = processData(reportes);

    // Escala para tamaños de palabras
    const fontScale = scaleLog({
        domain: [
            Math.min(...wordCloudData.map((w) => w.value)),
            Math.max(...wordCloudData.map((w) => w.value)) || 1, // Evitar división por cero
        ],
        range: [12, 60],
    });

    return (
        <div className="bg-gray-50 min-h-screen p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Encabezado */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Feedback de la Comunidad
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        {reportes.count} reportes analizados | Promedio de satisfacción: {reportes.avgRating?.toFixed(1) || "N/A"}
                    </p>
                </div>

                {/* Grid de tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tarjeta de Ratings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <Star className="h-6 w-6 text-yellow-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Aspectos a Mejorar</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Tarjeta de Tendencias Temporales */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Reportes por Mes</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#10b981" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tarjeta de Nube de Síntomas */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-4">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Síntomas Frecuentes</h2>
                    </div>
                    <ParentSize>
                        {({ width }) => (
                            <Wordcloud<WordCloudData>
                                words={wordCloudData}
                                width={width}
                                height={250}
                                font="Inter"
                                fontWeight={600}
                                padding={2}
                                spiral="archimedean"
                                rotate={0}
                            >
                                {(cloudWords) =>
                                    cloudWords.map((w, i) => {
                                        const word = w as WordCloudData & typeof w; // 👈 unión entre lo que da visx y tu tipo
                                        return (
                                            <Text
                                                key={word.text}
                                                fill={["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"][i % 5]}
                                                textAnchor="middle"
                                                transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                                                fontSize={fontScale(word.value)}
                                                fontFamily="Inter"
                                                fontWeight={600}
                                            >
                                                {word.text}
                                            </Text>
                                        );
                                    })
                                }
                            </Wordcloud>
                        )}
                    </ParentSize>
                </div>
            </div>
        </div>
    );
}