"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { createRegistroDemanda } from "../actions/registroDemanda";

// Definimos el tipo para factorEstacional
type FactorEstacional =
  | "Normal"
  | "Lluvias"
  | "Sequia"
  | "Epidemia"
  | "Festividades"
  | "InviernoFrio"
  | "CalorExtremo"
  | "EventosAgricolas"
  | "EmergenciasNaturales";

// Interfaz para los datos del formulario
interface FormData {
  servicioId: string;
  fecha: string;
  atenciones: number;
  demandaEstimada?: number;
  factorEstacional: FactorEstacional;
  tiposDemanda: string[];
  notas?: string;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  borderRadius: 12,
  boxShadow: 24,
  p: 4,
  textAlign: "center",
} as const;


export default function CreateRegistroDemandaForm({ servicioId }: { servicioId: string }) {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      servicioId,
      tiposDemanda: [],
      factorEstacional: "Normal",
      fecha: new Date().toISOString().split("T")[0], // Default to today's date
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tiposDemandaInput, setTiposDemandaInput] = useState("");
  const tiposDemanda = watch("tiposDemanda", []);
  const factorEstacional = watch("factorEstacional");
  const router = useRouter();

  const MotionBox = motion(Box);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setModalOpen(true);

    // Send fecha as YYYY-MM-DD
    const localDate = new Date(data.fecha);
    const formattedDate = localDate.toISOString().split("T")[0];

    const result = await createRegistroDemanda({
      servicioId,
      fecha: formattedDate,
      atenciones: data.atenciones,
      demandaEstimada: data.demandaEstimada,
      factorEstacional: data.factorEstacional,
      tiposDemanda: data.tiposDemanda,
      notas: data.notas,
    });

    setIsLoading(false);
    setModalMessage(result.message);
    setIsSuccess(result.ok);
  };

  const addTipoDemanda = () => {
    if (tiposDemandaInput.trim()) {
      setValue("tiposDemanda", [...tiposDemanda, tiposDemandaInput.trim()]);
      setTiposDemandaInput("");
    }
  };

  const removeTipoDemanda = (index: number) => {
    setValue("tiposDemanda", tiposDemanda.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage(null);
    if (isSuccess) {
      router.push("/dashboardService");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 4,
        bgcolor: "white",
        borderRadius: 4,
        boxShadow: 8,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <FormLabel sx={{ color: "text.primary", fontWeight: "medium" }}>Fecha</FormLabel>
            <TextField
              id="fecha"
              type="date"
              fullWidth
              variant="outlined"
              {...register("fecha", { required: true })}
              sx={{ mt: 1, borderRadius: 2 }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
            />
          </Box>
          <Box>
            <FormLabel sx={{ color: "text.primary", fontWeight: "medium" }}>
              Número de personas atendidas en el día
            </FormLabel>
            <TextField
              id="atenciones"
              type="number"
              fullWidth
              variant="outlined"
              inputProps={{ min: 0 }}
              {...register("atenciones", { required: true, valueAsNumber: true })}
              sx={{ mt: 1, borderRadius: 2 }}
            />
          </Box>
          <Box>
            <FormLabel sx={{ color: "text.primary", fontWeight: "medium" }}>Demanda estimada (opcional)</FormLabel>
            <TextField
              id="demandaEstimada"
              type="number"
              fullWidth
              variant="outlined"
              inputProps={{ step: 0.01 }}
              {...register("demandaEstimada", { valueAsNumber: true })}
              sx={{ mt: 1, borderRadius: 2 }}
            />
          </Box>
          <FormControl fullWidth>
            <InputLabel id="factorEstacional-label">Factor estacional</InputLabel>
            <Select
              labelId="factorEstacional-label"
              id="factorEstacional"
              label="Factor estacional"
              variant="outlined"
              value={factorEstacional}
              onChange={(e) => setValue("factorEstacional", e.target.value as FactorEstacional)}
              sx={{ borderRadius: 2 }}
            >
              {[
                "Normal",
                "Lluvias",
                "Sequia",
                "Epidemia",
                "Festividades",
                "InviernoFrio",
                "CalorExtremo",
                "EventosAgricolas",
                "EmergenciasNaturales",
              ].map((factor) => (
                <MenuItem key={factor} value={factor}>
                  {factor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <FormLabel sx={{ color: "text.primary", fontWeight: "medium" }}>Tipos de demanda</FormLabel>
            <Box sx={{ display: "flex", mt: 1 }}>
              <TextField
                value={tiposDemandaInput}
                onChange={(e) => setTiposDemandaInput(e.target.value)}
                placeholder="Ej: Vacunación"
                fullWidth
                variant="outlined"
                sx={{ borderRadius: 2, mr: 1 }}
              />
              <Button variant="contained" onClick={addTipoDemanda} sx={{ borderRadius: 2, textTransform: "none" }}>
                Agregar
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {tiposDemanda.map((tipo, index) => (
                <Chip
                  key={index}
                  label={tipo}
                  onDelete={() => removeTipoDemanda(index)}
                  sx={{ borderRadius: 16 }}
                />
              ))}
            </Box>
          </Box>
          <Box>
            <FormLabel sx={{ color: "text.primary", fontWeight: "medium" }}>Notas (opcional)</FormLabel>
            <TextField
              id="notas"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              {...register("notas")}
              sx={{ mt: 1, borderRadius: 2 }}
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5, borderRadius: 2, textTransform: "none" }}>
            Crear Registro
          </Button>
        </Box>
      </form>

      <AnimatePresence>
        {modalOpen && (
          <Modal open={modalOpen} onClose={closeModal}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              sx={modalStyle}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "primary.main" }} />
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {modalMessage}
                  </Typography>
                  <Button variant="contained" onClick={closeModal} sx={{ borderRadius: 2, textTransform: "none" }}>
                    Cerrar
                  </Button>
                </>
              )}
            </MotionBox>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}