

// Información general de la aplicación
// Información general de la aplicación - Adaptada para la Plataforma Social-Comercial Hackathon Salud
export const APP_Nombre = "Hackathon Salud";
export const App_Nombre1 = "Hackathon Salud";
export const App_Nombre2 = "Hackathon Salud";

export const InfoEmpresa = {
  nombreCompleto: "Hackathon Salud - Plataforma Social para Negocios y Profesionales",
  direccion: "Cra 9A # 7-03, Tunja - Boyacá, Colombia", // Dirección base para el equipo de desarrollo/hackathon
  iframeGoogleMaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.394594074716!2d-73.37225322535299!3d5.508293434128291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a7de1c1eac06f%3A0xcbfdc6875cf68173!2sCra.%209A%20%237-14%2C%20Tunja%2C%20Boyac%C3%A1!5e0!3m2!1ses!2sco!4v1732853148670!5m2!1ses!2sco", // Mapa de Tunja, adaptable a ubicaciones de negocios
  nombreCorto: {
    parte1: "Hackathon Salud",
    parte2: "Negocios Conectados" // Subtítulo para perfiles y headers
  },
  telefono: "313-239-0868", // Teléfono de soporte/contacto general
  email: "soporte@Hackathon Salud.co", // Email institucional
  website: "https://Hackathon Salud.co", // Dominio ficticio para producción; en hackathon, usa localhost o Vercel
  horarios: {
    lunes_viernes: "Plataforma 24/7 - Soporte: 8:00 - 18:00",
    sabados: "Plataforma 24/7 - Soporte: 9:00 - 15:00",
    domingos: "Plataforma 24/7 - Soporte cerrado"
  }, // Enfocado en disponibilidad digital, con soporte humano
  nit: "900.123.456-7", // NIT ficticio para simulación
  urlInstagram: "https://instagram.com/Hackathon Salud.co", // Placeholder para redes de la plataforma
  urlFacebook: "https://facebook.com/Hackathon Salud.co",
  urlTiktok: "https://tiktok.com/@Hackathon Salud.co",
  titulo: "Hackathon Salud – Plataforma Social-Comercial para Emprendedores y Profesionales Locales", // SEO optimizado: enfocado en hackathon y features clave
  descripcion: "Conecta tu negocio con clientes locales en Hackathon Salud. Crea perfiles profesionales, catálogos interactivos, reseñas multimedia y feeds sociales. Ideal para pequeños emprendimientos y profesionales independientes en Colombia. ¡Regístrate gratis y crece tu visibilidad digital!", // 150 caracteres aprox., con keywords del proyecto
  keywords: "plataforma social negocios, catálogo productos locales, reseñas multimedia, perfiles profesionales, emprendedores independientes, comercios Tunja, agenda citas servicios, feed publicaciones negocios, monetización freemium, QR perfiles negocios, WhatsApp contacto directo, hackathon plataforma digital, redes sociales emprendedores, vitrina interactiva negocios, testimonios productos, agenda profesionales Tunja, promociones locales, visibilidad digital pequeños negocios, reseñas videos productos, comunidad comercial Colombia", // Keywords adaptados: incluye términos del proyecto y locales para SEO
  imagenesPlaceholder: {
    domicilio: "/imgs/domicilio-negocio.webp", // Imagen de entrega/contacto para negocios
    emptyCart: "/imgs/catalogo-vacio.webp", // Placeholder para catálogos vacíos
    notfound: "/imgs/perfil-no-encontrado.webp", // Para perfiles o productos no encontrados
    imagenRepresentativa: "/imgs/logo-Hackathon Salud.png", // Logo principal de la plataforma
    loginPage: "/imgs/login-negocios.png", // Imagen de fondo para login de negocios
    logoEmpresa: "/imgs/logo-Hackathon Salud.png", // Logo para headers de perfiles
    noAutorizado: "/imgs/acceso-denegado-negocio.webp", // Para accesos restringidos en perfiles
    registerPage: "/imgs/registro-emprendedores.png", // Fondo para registro de negocios
    imagenCarroVacio: "/imgs/catalogo-vacio.webp", // Para grids de productos vacíos
    imagenTiendaContacto: "/imgs/contacto-negocios.webp" // Imagen para secciones de contacto
  },
  linkWebProduccion: "https://Hackathon Salud.co" // Enlace de producción; en desarrollo, apunta a tu repo de hackathon
};

// Barra de navegación principal e inferior
export const TopMenuConfig = {
  EnlacesNavegacionTopMenu : [{ section: "Productos", ruta: "/productos" },  { section: "Servicios", ruta: "/servicios" },{ section: "Magic Blogs", ruta: "/blog" }, ],
  widthLogo : 80,
  heightLogo : 80,
  //Mobile
  width_height_logo_topMenuMobile : 50,
  height_height_logo_topMenuMobile : 50,
  enlacePrincipalInferior : { nombre: "Productos", ruta: "/", icono: "" },
  Color_Circulo_Numero_Iconos_Mobile : "bg-red-600 text-[#f2f2f2]"
}


//Data para secciónes de Privacidad, 
export const companyInfo = {
  nombre: InfoEmpresa.nombreCompleto,
  direccion: InfoEmpresa.direccion,
  telefono: InfoEmpresa.telefono,
  email: InfoEmpresa.email,
  website: InfoEmpresa.linkWebProduccion,
  nit: InfoEmpresa.nit,
  politicaEnvio: "Realizamos envíos a todo el país con un tiempo de entrega de 3 a 7 días hábiles.",
  politicaDevolucion: "Puedes solicitar la devolución de productos en un plazo de 15 días hábiles.",
  garantia: "Ofrecemos garantía de 30 días en todos nuestros productos contra defectos de fábrica.",
  puntoDeVenta: "Punto físico y online",
  paisesOperacion: "Colombia"
};


export const termsAndConditionsForm = {
  empresa: {
    nombreLegal: companyInfo.nombre,  // Ej: Detalles y Sorpresas S.A.S
    direccion: companyInfo.direccion,  // Ej: Calle 123, Bogotá, Colombia
    nit: companyInfo.nit,  // Ej: 901234567-8
    emailContacto: companyInfo.email,  // Ej: contacto@detallesysorpresas.com
    telefonoContacto: companyInfo.telefono,  // Ej: +57 300 123 4567
    puntoDeVenta: companyInfo.puntoDeVenta,  // Ej: Punto físico y ventas online
    paisesOperacion: companyInfo.paisesOperacion,  // Ej: Colombia, Ecuador
    website: companyInfo.website,
  },

  ambitoAplicacion: {
    tipoProductos: "Detalles, regalos para ocasiones especiales, desayunos personalizado, detalles florales, chocolates, regalos para hombre, mujer, niño, servicios personalizados",  // Ej: Desayunos sorpresa, regalos personalizados, flores
    productosDigitales: false,  // true / false
    restriccionesEdad: "para mayores de edad productos que contengan alcohol",  // Ej: +18 para productos con alcohol
  },

  comprasPagos: {
    metodosPago: "Nequi, Daviplata, Bancolombia, transferencias y pago ",  // Ej: Tarjetas de crédito/débito, transferencias, contra entrega
    plataformaPagos: "PayU",  // Ej: PayU, MercadoPago, Stripe
    compraSinCuenta: true,  // true / false
    notificacionCompra: "Correo electrónico y mediante la aplicación",  // Ej: Correo electrónico con factura adjunta
  },

  enviosEntregas: {
    tiempoEntrega: "1-2 días calendario, dependiendo del producto y lo acordado con el cliente",  // Ej: 3-5 días hábiles
    servicioMensajeria: "propio y mediantes el uso de diferentes empresas de mensajería",  // Ej: Propio y servicios como Servientrega
    costoEnvio: "Se acuerda con el cliente",  // Ej: Gratis para compras mayores a $100.000 COP
    ausenteEntrega: "reprogramación sin costo adicional",  // Ej: Reprogramación sin costo adicional
  },

  cancelacionesDevoluciones: {
    aceptaCancelaciones: true,  // true / false
    devolucionCondiciones: "Producto dañado, error en el envío",  // Ej: Producto dañado, error en el envío
    plazoDevolucion: "dependiendo del tipo de producto, ya que hay productos como comidas que deben ser devueltos inmediatamente, mientras que productos como ",  // Ej: 15 días hábiles
    costoDevolucion: "el cliente asume el costo del envío de devolución",  // Ej: El cliente asume el costo del envío de devolución
  },

  garantias: {
    garantiaProductos: true,  // true / false
    tiempoGarantia: "1 mes, para ropa, accesorios y zapatos",  // Ej: 6 meses
    coberturaGarantia: "Defectos de fábrica, daño durante el envío",  // Ej: Defectos de fábrica, daño durante el envío
    garantiasExcluidas: "Productos personalizados, y productos que contengan alimentos",  // Ej: Productos personalizados
  },

  responsabilidadCliente: {
    verificacionDatos: "El cliente debe verificar dirección y datos de contacto",  // Ej: El cliente debe verificar dirección y datos de contacto
    advertencias: "Flores pueden causar alergias en ciertas personas, los alimentos de los productos pueden ocasionar alergías",  // Ej: Flores pueden causar alergias en ciertas personas
  },

  propiedadIntelectual: {
    derechosAutor: true,  // true / false
    usoContenido: "prohibido copiar imágenes sin autorización",  // Ej: Prohibido copiar imágenes sin autorización
  },

  seguridadPrivacidad: {
    medidasSeguridad: "Certificado SSL, encriptación de datos",  // Ej: Certificado SSL, encriptación de datos
    datosRecopilados: "Nombre, dirección, teléfono, email",  // Ej: Nombre, dirección, teléfono, email
    usoDatos: "se utiliza solo para efectos de facturación, y entrega de productos",  // Ej: Envío de productos y promociones
    comparteDatos: false,  // true / false
  },

  modificacionesTerminos: {
    actualizacionesFrecuentes: "Cada 6 meses",  // Ej: Cada 6 meses
    notificacionCambios: "sin notificar, solo mediante nuestra aplicación web",  // Ej: Notificación vía email
  },

  extras: {
    programaLealtad: false,  // true / false
    maxProductosPorCliente: "sin límite y de acuerdo a disponibilidad",  // Ej: Máximo 5 productos por pedido
    suscripciones: false,  // true / false
  }
};


export const privacyPolicyForm = {
  empresa: {
    nombre: companyInfo.nombre,  // Nombre de la empresa
    emailContacto: companyInfo.email,  // Correo de contacto
    website: companyInfo.website,  // URL del sitio web
    direccion: companyInfo.direccion,  // Dirección de la empresa
    telefono: companyInfo.telefono,  // Teléfono de contacto
  },

  informacionRecopilada: {
    datosPersonales: "Nombre, correo electrónico, dirección, teléfono y datos de pago",  // Ej: Nombre, email, dirección
    datosNavegacion: "Dirección IP, navegador, y comportamiento de navegación",  // Ej: IP, navegador
    cookies: true,  // Indica si se usan cookies
    serviciosTerceros: "Google Analytics, Facebook Pixel",  // Servicios de terceros utilizados
  },

  usoInformacion: {
    propositos: "Procesar pedidos, enviar promociones, mejorar el servicio y personalizar la experiencia",  // Finalidad del uso de datos
    marketing: true,  // Si se usan para marketing
    mejorasProducto: true,  // Si se utilizan para mejorar productos o servicios
    publicidadTerceros: false,  // Si comparten con terceros
  },

  seguridad: {
    medidas: "Certificado SSL, cifrado de datos y acceso restringido",  // Ej: SSL, cifrado de datos
    almacenamiento: "Servidores seguros con acceso restringido",  // Dónde se almacenan los datos
    retencion: "Los datos se conservan por 5 años o hasta que el cliente solicite su eliminación",  // Tiempo de retención
  },

  derechosUsuario: {
    acceso: true,  // Si los usuarios pueden acceder a sus datos
    rectificacion: true,  // Si los usuarios pueden modificar sus datos
    eliminacion: true,  // Si los usuarios pueden solicitar eliminar sus datos
    portabilidad: false,  // Si se permite transferir los datos a otra empresa
  },

  cookies: {
    usoCookies: true,  // Indica si se usan cookies
    tipoCookies: "Cookies esenciales y de seguimiento de comportamiento",  // Tipo de cookies
    desactivacion: "Los usuarios pueden desactivar cookies desde la configuración del navegador",  // Opciones de desactivación
  },

  cambiosPolitica: {
    actualizaciones: "Cada 6 meses",  // Frecuencia de actualización
    notificacion: "Se notificará en el sitio web",  // Cómo se notifican los cambios
  },

  contacto: {
    canalContacto: "Puedes contactarnos a través de nuestro correo electrónico o por llamada directa",  // Forma de contacto
  }
};


export const shippingPolicyForm = {
  empresa: {
    nombre: companyInfo.nombre,  // Nombre de la empresa
    emailContacto: companyInfo.email,  // Correo de contacto
    website: companyInfo.website,  // URL del sitio web
    direccion: companyInfo.direccion,  // Dirección de la empresa
    telefono: companyInfo.telefono,  // Teléfono de contacto
  },

  ambitoEnvio: {
    paisesCobertura: "Colombia",  // Ej: Colombia, Ecuador, México
    regionesRestringidas: "Zonas rurales de difícil acceso",  // Ej: Regiones apartadas o peligrosas
    internacional: false,  // true / false - ¿Realizan envíos internacionales?
  },

  costosEnvio: {
    envioGratis: true,  // true / false - ¿Ofrecen envío gratuito?
    umbralEnvioGratis: "Compras superiores a $150.000 COP",  // Condición para envío gratis
    tarifaBase: "$5.000 COP",  // Tarifa estándar de envío
    costosAdicionales: "Áreas rurales o de difícil acceso",  // ¿Hay costos adicionales?
  },

  tiemposEntrega: {
    tiempoLocal: "1-2 días hábiles",  // Tiempo de entrega en la misma ciudad
    tiempoNacional: "3-5 días hábiles",  // Entrega a nivel nacional
    tiempoInternacional: "No aplica",  // Tiempo para envíos internacionales
    entregasUrgentes: true,  // true / false - ¿Ofrecen envíos express?
    tiempoUrgente: "En el mismo día",  // Tiempo de entrega para pedidos urgentes
  },

  mensajeria: {
    servicioPropio: true,  // true / false - ¿Cuentan con servicio de mensajería propio?
    empresasAliadas: "Servientrega, Interrapidisimo",  // Empresas de mensajería aliadas
  },

  seguimiento: {
    trackingEnvios: false,  // true / false - ¿Ofrecen seguimiento de envíos?
    plataformaTracking: "Tracking desde el sitio web",  // ¿Dónde se puede rastrear el pedido?
    actualizacionesEmail: false,  // true / false - ¿Se notifica por email?
  },

  politicaAusente: {
    reintentosEntrega: 1,  // ¿Cuántos intentos de entrega se realizan?
    reprogramacionGratis: true,  // true / false - ¿Se permite reprogramar sin costo?
    costoReenvio: "$5.000 COP",  // Costo en caso de reenvío
    devolucionFalloEntrega: true,  // ¿Se devuelve el producto si falla la entrega?
  },

  cancelaciones: {
    cancelacionAntesEnvio: true,  // true / false - ¿Se pueden cancelar pedidos antes del envío?
    cancelacionDuranteEnvio: false,  // true / false - ¿Se pueden cancelar durante el envío?
    penalidadCancelacion: "10% del valor del pedido",  // Penalidad si aplica
  },

  condicionesEspeciales: {
    productosFragiles: "Embalaje especial para productos de vidrio",  // Ej: Cristalería, porcelana
    restriccionesAlimentos: "No enviamos alimentos fuera de la ciudad",  // Restricciones de envío
    condicionesClimaticas: "Retrasos por condiciones climáticas extremas",  // Ej: Retrasos por clima
  },

  devoluciones: {
    aceptanDevoluciones: true,  // true / false
    plazoDevolucion: "5 días hábiles para entregas de productos que no contengan alimentos",  // Tiempo para devolver el producto
    condicionesDevolucion: "Producto dañado o incorrecto",  // Condiciones para aceptar devoluciones
    costoDevolucion: "Cubierto por la empresa",  // ¿Quién cubre los costos de devolución?
  },

  extras: {
    seguroEnvio: false,  // true / false - ¿Ofrecen seguro de envío?
    valorSeguro: "2% del valor del pedido",  // Valor del seguro de envío
    opcionRecogida: true,  // true / false - ¿Permiten recoger pedidos en tienda?
    horarioRecogida: "De lunes a sábado de 9 am a 6 pm",  // Horario de recogida
  },
};




export const privacyPolicyFormVacio = {
  empresa: {
    nombre: InfoEmpresa.nombreCompleto,  // Nombre de la empresa
    emailContacto: InfoEmpresa.email,  // Correo de contacto
    website: InfoEmpresa.linkWebProduccion,  // URL del sitio web
    direccion: InfoEmpresa.direccion,  // Dirección de la empresa
    telefono: InfoEmpresa.telefono,  // Teléfono de contacto
  },

  informacionRecopilada: {
    datosPersonales: "Nombre, correo electrónico, dirección, teléfono y datos de pago",  // Ej: Nombre, email, dirección
    datosNavegacion: "Dirección IP, navegador, y comportamiento de navegación",  // Ej: IP, navegador
    cookies: true,  // Indica si se usan cookies
    serviciosTerceros: "Google Analytics, Facebook Pixel",  // Servicios de terceros utilizados
  },

  usoInformacion: {
    propositos: "Procesar pedidos, enviar promociones, mejorar el servicio y personalizar la experiencia",  // Finalidad del uso de datos
    marketing: true,  // Si se usan para marketing
    mejorasProducto: true,  // Si se utilizan para mejorar productos o servicios
    publicidadTerceros: false,  // Si comparten con terceros
  },

  seguridad: {
    medidas: "Certificado SSL, cifrado de datos y acceso restringido",  // Ej: SSL, cifrado de datos
    almacenamiento: "Servidores seguros con acceso restringido",  // Dónde se almacenan los datos
    retencion: "Los datos se conservan por 5 años o hasta que el cliente solicite su eliminación",  // Tiempo de retención
  },

  derechosUsuario: {
    acceso: true,  // Si los usuarios pueden acceder a sus datos
    rectificacion: true,  // Si los usuarios pueden modificar sus datos
    eliminacion: true,  // Si los usuarios pueden solicitar eliminar sus datos
    portabilidad: false,  // Si se permite transferir los datos a otra empresa
  },

  cookies: {
    usoCookies: true,  // Indica si se usan cookies
    tipoCookies: "Cookies esenciales y de seguimiento de comportamiento",  // Tipo de cookies
    desactivacion: "Los usuarios pueden desactivar cookies desde la configuración del navegador",  // Opciones de desactivación
  },

  cambiosPolitica: {
    actualizaciones: "Cada 6 meses",  // Frecuencia de actualización
    notificacion: "Se notificará por correo electrónico y en el sitio web",  // Cómo se notifican los cambios
  },

  contacto: {
    canalContacto: "Puedes contactarnos a través de nuestro correo electrónico o por llamada directa",  // Forma de contacto
  }
};



