"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { registerUser } from "../actions/registerUser";
import { login } from "../actions/login";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Container,
  Typography,
  Box,
  Fade,
} from "@mui/material";
import colombiaData from "@/config/colombia.json";

type FormInputs = {
  nombre: string;
  apellido: string;
  departamento: string;
  ciudad: string;
  email: string;
  password: string;
  fechaNacimiento: string;
};

interface ColombiaDepartment {
  id: number;
  departamento: string;
  ciudades: string[];
}

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      nombre: "",
      apellido: "",
      departamento: "",
      ciudad: "",
      email: "",
      password: "",
      fechaNacimiento: "",
    },
  });

  const selectedDepartamento = watch("departamento");

  // Actualizar ciudades cuando cambie el departamento
  useEffect(() => {
    if (selectedDepartamento) {
      const departmentData = (colombiaData as ColombiaDepartment[]).find(
        (dept) => dept.departamento === selectedDepartamento
      );
      setCities(departmentData ? departmentData.ciudades : []);
    } else {
      setCities([]);
    }
  }, [selectedDepartamento]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");
    setIsPending(true);

    const { nombre, apellido, email, password, departamento, ciudad, fechaNacimiento } = data;

    console.log({nombre, apellido, email, password, departamento, ciudad, fechaNacimiento});

    const response = await registerUser({
  nombre,
  apellido,
  departamento,
  ciudad,
  email,
  password,
  fechaNacimiento,
});


    if (!response.ok) {
      setErrorMessage(response.message);
      setIsPending(false);
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace("/");
  };

  const handleGoogleRegister = async () => {
    try {
      setIsPending(true);
      const response = await signIn("google", { redirect: true });
      if (response?.error) {
        setErrorMessage("No se pudo completar el inicio de sesión con Google");
        setIsPending(false);
      }
    } catch {
      setErrorMessage("No se pudo completar el inicio de sesión con Google");
      setIsPending(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Container maxWidth="sm" className="mt-8 mb-12">
        <Box className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <Typography
            variant="h4"
            className="text-center font-bold text-gray-900 mb-8"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Crear una cuenta
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Box>
              <TextField
                {...register("nombre", { required: "Nombre requerido" })}
                label="Nombre"
                fullWidth
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "gray.200" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
            </Box>

            <Box>
              <TextField
                {...register("apellido", { required: "Apellido requerido" })}
                label="Apellido"
                fullWidth
                variant="outlined"
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "gray.200" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
            </Box>

            <Box>
              <FormControl fullWidth variant="outlined" error={!!errors.departamento}>
                <InputLabel id="departamento-label">Departamento</InputLabel>
                <Controller
                  name="departamento"
                  control={control}
                  rules={{ required: "Departamento requerido" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="departamento-label"
                      label="Departamento"
                      sx={{
                        borderRadius: "12px",
                        bgcolor: "background.default",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.200" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                      }}
                    >
                      {(colombiaData as ColombiaDepartment[]).map((dept) => (
                        <MenuItem key={dept.id} value={dept.departamento}>
                          {dept.departamento}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.departamento && <FormHelperText>{errors.departamento.message}</FormHelperText>}
              </FormControl>
            </Box>

            <Box>
              <FormControl fullWidth variant="outlined" error={!!errors.ciudad} disabled={!selectedDepartamento}>
                <InputLabel id="ciudad-label">Ciudad</InputLabel>
                <Controller
                  name="ciudad"
                  control={control}
                  rules={{ required: "Ciudad requerida" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="ciudad-label"
                      label="Ciudad"
                      sx={{
                        borderRadius: "12px",
                        bgcolor: "background.default",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray.200" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                      }}
                    >
                      {cities.map((city, index) => (
                        <MenuItem key={index} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.ciudad && <FormHelperText>{errors.ciudad.message}</FormHelperText>}
              </FormControl>
            </Box>

            <Box>
              <TextField
                {...register("email", {
                  required: "Correo requerido",
                  pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
                })}
                label="Correo Electrónico"
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "gray.200" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
            </Box>

            <Box>
              <TextField
                {...register("password", {
                  required: "Contraseña requerida",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                label="Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "gray.200" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
            </Box>

            <Box>
              <TextField
                {...register("fechaNacimiento", { required: "Fecha de nacimiento requerida" })}
                label="Fecha de Nacimiento"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento?.message}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    "& fieldset": { borderColor: "gray.200" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />
            </Box>

            {errorMessage && (
              <Typography className="text-red-500 text-sm text-center">{errorMessage}</Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isPending}
              sx={{
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                transition: "all 0.2s ease",
              }}
            >
              {isPending ? "Cargando..." : "Crear cuenta"}
            </Button>
          </form>

          <Box className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <Typography className="mx-4 text-gray-500 text-sm">o</Typography>
            <div className="flex-grow h-px bg-gray-200"></div>
          </Box>

          <Button
            variant="outlined"
            fullWidth
            disabled={isPending}
            onClick={handleGoogleRegister}
            startIcon={<FaGoogle />}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              borderColor: "gray.300",
              color: "text.primary",
              "&:hover": { borderColor: "primary.main", bgcolor: "gray.50" },
              transition: "all 0.2s ease",
            }}
          >
            {isPending ? "Cargando..." : "Iniciar con Google"}
          </Button>

          <Typography className="text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-primary-600 hover:underline">
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Container>
    </Fade>
  );
};