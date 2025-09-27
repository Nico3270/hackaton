"use client";

import React, { useState } from "react";
import { MotivoVisita, AspectoMejorar, ValoracionSatisfaccion, FrecuenciaSintomas } from "@prisma/client";
import { crearReporteComunidad } from "../actions/crearReporteComunidad";


interface CrearReporteComunidadProps {
  servicioId: string;
  usuarioId?: string;
}

const CrearReporteComunidad: React.FC<CrearReporteComunidadProps> = ({ servicioId, usuarioId }) => {
  const [motivoVisita, setMotivoVisita] = useState<MotivoVisita | "">("");
  const [ratingSatisfaccion, setRatingSatisfaccion] = useState<number | undefined>(undefined);
  const [recomendarServicio, setRecomendarServicio] = useState<boolean | undefined>(undefined);
  const [calidadAtencion, setCalidadAtencion] = useState<ValoracionSatisfaccion | undefined>(undefined);
  const [tiempoEspera, setTiempoEspera] = useState<number | undefined>(undefined);
  const [aspectosMejorar, setAspectosMejorar] = useState<AspectoMejorar[]>([]);
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [otroSintoma, setOtroSintoma] = useState("");
  const [frecuenciaSintomas, setFrecuenciaSintomas] = useState<FrecuenciaSintomas | undefined>(undefined);
  const [duracionSintomasDias, setDuracionSintomasDias] = useState<number | undefined>(undefined);
  const [descripcion, setDescripcion] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Lista predefinida de síntomas comunes
  const sintomasPredefinidos = [
    "Dolor de cabeza",
    "Fiebre",
    "Tos",
    "Dolor de garganta",
    "Fatiga",
    "Dolor muscular",
    "Dificultad para respirar",
    "Otro",
  ];

  // Mapeo de labels amigables
  const motivoVisitaLabels: Record<MotivoVisita, string> = {
    ReportarSintomas: "Reportar síntomas frecuentes",
    ReportarEnfermedad: "Reportar una enfermedad",
    CitaControl: "Cita de control médico",
    SolicitudCita: "Solicitar una cita",
    EvaluacionServicio: "Evaluar el servicio recibido",
    ReclamarMedicamentos: "Reclamar medicamentos o suministros",
  };

  const valoracionSatisfaccionLabels: Record<ValoracionSatisfaccion, string> = {
    MuyInsatisfecho: "Muy insatisfecho",
    Insatisfecho: "Insatisfecho",
    Neutral: "Neutral",
    Satisfecho: "Satisfecho",
    MuySatisfecho: "Muy satisfecho",
  };

  const frecuenciaSintomasLabels: Record<FrecuenciaSintomas, string> = {
    Raro: "Raro (menos de una vez por semana)",
    Ocasional: "Ocasional (1-3 veces por semana)",
    Frecuente: "Frecuente (4-6 veces por semana)",
    Constante: "Constante (todos los días)",
  };

  const aspectoMejorarLabels: Record<AspectoMejorar, string> = {
    TiempoEspera: "Tiempo de espera",
    AmabilidadPersonal: "Amabilidad del personal",
    DisponibilidadCitas: "Disponibilidad de citas",
    Infraestructura: "Infraestructura y instalaciones",
    CalidadDiagnostico: "Calidad del diagnóstico",
    Otros: "Otros",
  };

  // Manejo de síntomas (checkboxes)
  const handleSintomaChange = (sintoma: string, checked: boolean) => {
    if (checked) {
      setSintomas([...sintomas, sintoma]);
    } else {
      setSintomas(sintomas.filter((s) => s !== sintoma));
    }
  };

  // Manejo del síntoma "Otro"
  const handleOtroSintomaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setOtroSintoma(value);
    if (sintomas.includes("Otro")) {
      // Reemplazar "Otro" con el valor personalizado
      setSintomas([...sintomas.filter((s) => s !== "Otro"), value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMensaje("");

    // Validaciones
    if (!motivoVisita) {
      setError("Por favor, selecciona el motivo de tu visita.");
      setLoading(false);
      return;
    }
    if ((motivoVisita === "ReportarSintomas" || motivoVisita === "ReportarEnfermedad") && sintomas.length === 0) {
      setError("Por favor, selecciona al menos un síntoma.");
      setLoading(false);
      return;
    }
    if (ratingSatisfaccion && ![1, 2, 3, 4, 5].includes(ratingSatisfaccion)) {
      setError("El rating de satisfacción debe estar entre 1 y 5.");
      setLoading(false);
      return;
    }
    if (!usuarioId && !email) {
      setError("Proporciona un email si no estás registrado.");
      setLoading(false);
      return;
    }

    const data = {
      servicioId,
      motivoVisita: motivoVisita as MotivoVisita,
      ratingSatisfaccion,
      recomendarServicio,
      calidadAtencion,
      tiempoEspera,
      aspectosMejorar,
      sintomas: sintomas.filter((s) => s !== "Otro"), // Excluir "Otro" si hay síntoma personalizado
      frecuenciaSintomas,
      duracionSintomasDias,
      descripcion: descripcion || undefined,
      email: !usuarioId ? email : undefined,
    };

    const result = await crearReporteComunidad(data, usuarioId);

    if (result.ok) {
      setMensaje("¡Reporte enviado exitosamente! Gracias por tu feedback.");
      setMotivoVisita("");
      setRatingSatisfaccion(undefined);
      setRecomendarServicio(undefined);
      setCalidadAtencion(undefined);
      setTiempoEspera(undefined);
      setAspectosMejorar([]);
      setSintomas([]);
      setOtroSintoma("");
      setFrecuenciaSintomas(undefined);
      setDuracionSintomasDias(undefined);
      setDescripcion("");
      setEmail("");
    } else {
      setError(result.message || "Error al enviar el reporte.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl transition-all duration-300">
      <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">Crear Reporte de Visita</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Motivo de la Visita */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">¿Cuál es el motivo de tu visita?</label>
          <p className="text-sm text-gray-500 mb-4">Selecciona la opción que mejor describe tu razón para contactar o visitar el servicio.</p>
          <select
            value={motivoVisita}
            onChange={(e) => setMotivoVisita(e.target.value as MotivoVisita)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50 text-gray-800"
          >
            <option value="">Selecciona un motivo...</option>
            {Object.entries(motivoVisitaLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Síntomas (para ReportarSintomas o ReportarEnfermedad) */}
        {(motivoVisita === "ReportarSintomas" || motivoVisita === "ReportarEnfermedad") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Síntomas</label>
              <p className="text-sm text-gray-500 mb-4">Selecciona los síntomas que estás experimentando.</p>
              <div className="space-y-2">
                {sintomasPredefinidos.map((sintoma) => (
                  <label key={sintoma} className="flex items-center text-gray-800">
                    <input
                      type="checkbox"
                      checked={sintomas.includes(sintoma) || (sintoma === "Otro" && otroSintoma !== "")}
                      onChange={(e) => handleSintomaChange(sintoma, e.target.checked)}
                      className="w-5 h-5 mr-2 accent-gray-300"
                    />
                    {sintoma}
                  </label>
                ))}
              </div>
              {sintomas.includes("Otro") && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={otroSintoma}
                    onChange={handleOtroSintomaChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
                    placeholder="Especifica otro síntoma"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Frecuencia de los síntomas</label>
              <p className="text-sm text-gray-500 mb-4">Indica con qué frecuencia ocurren los síntomas.</p>
              <select
                value={frecuenciaSintomas || ""}
                onChange={(e) => setFrecuenciaSintomas(e.target.value as FrecuenciaSintomas || undefined)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
              >
                <option value="">Selecciona...</option>
                {Object.entries(frecuenciaSintomasLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-gray-700 mb-2">Duración de los síntomas (días)</label>
              <p className="text-sm text-gray-500 mb-4">¿Cuántos días han durado los síntomas?</p>
              <input
                type="number"
                value={duracionSintomasDias || ""}
                onChange={(e) => setDuracionSintomasDias(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
                min={0}
                placeholder="Ej. 3"
              />
            </div>
          </div>
        )}

        {/* Evaluación General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Satisfacción general (1-5 estrellas)</label>
            <p className="text-sm text-gray-500 mb-4">Califica tu experiencia general en una escala de 1 a 5.</p>
            <select
              value={ratingSatisfaccion || ""}
              onChange={(e) => setRatingSatisfaccion(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
            >
              <option value="">Selecciona...</option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} estrella{val > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">¿Recomendarías este servicio?</label>
            <p className="text-sm text-gray-500 mb-4">Indica si recomendarías el servicio a otros.</p>
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-800">
                <input
                  type="radio"
                  checked={recomendarServicio === true}
                  onChange={() => setRecomendarServicio(true)}
                  className="w-5 h-5 mr-2 accent-gray-300"
                />
                Sí
              </label>
              <label className="flex items-center text-gray-800">
                <input
                  type="radio"
                  checked={recomendarServicio === false}
                  onChange={() => setRecomendarServicio(false)}
                  className="w-5 h-5 mr-2 accent-gray-300"
                />
                No
              </label>
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Calidad de la atención</label>
            <p className="text-sm text-gray-500 mb-4">Califica la calidad de la atención recibida.</p>
            <select
              value={calidadAtencion || ""}
              onChange={(e) => setCalidadAtencion(e.target.value as ValoracionSatisfaccion || undefined)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
            >
              <option value="">Selecciona...</option>
              {Object.entries(valoracionSatisfaccionLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Tiempo de espera (minutos)</label>
            <p className="text-sm text-gray-500 mb-4">Indica el tiempo aproximado de espera.</p>
            <input
              type="number"
              value={tiempoEspera || ""}
              onChange={(e) => setTiempoEspera(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
              min={0}
              placeholder="Ej. 30"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">Aspectos a mejorar</label>
            <p className="text-sm text-gray-500 mb-4">Selecciona los aspectos que crees que podrían mejorar en el servicio.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(aspectoMejorarLabels).map(([key, label]) => (
                <label key={key} className="flex items-center text-gray-800">
                  <input
                    type="checkbox"
                    checked={aspectosMejorar.includes(key as AspectoMejorar)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAspectosMejorar([...aspectosMejorar, key as AspectoMejorar]);
                      } else {
                        setAspectosMejorar(aspectosMejorar.filter((a) => a !== key));
                      }
                    }}
                    className="w-5 h-5 mr-2 accent-gray-300"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Comentarios adicionales</label>
          <p className="text-sm text-gray-500 mb-4">Comparte cualquier comentario o detalle adicional sobre tu experiencia.</p>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50 resize-none"
            rows={4}
            placeholder="Escribe aquí tus comentarios..."
          />
        </div>

        {/* Email si no registrado */}
        {!usuarioId && (
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
            <p className="text-sm text-gray-500 mb-4">Proporciona tu email para seguimiento (opcional).</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition bg-gray-50"
              placeholder="tuemail@ejemplo.com"
            />
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition duration-200 disabled:opacity-50 font-medium text-lg flex items-center justify-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : null}
          {loading ? "Enviando..." : "Enviar Reporte"}
        </button>
      </form>

      {mensaje && <p className="mt-6 text-green-600 text-center text-lg font-medium">{mensaje}</p>}
      {error && <p className="mt-6 text-red-600 text-center text-lg font-medium">{error}</p>}
    </div>
  );
};

export default CrearReporteComunidad;