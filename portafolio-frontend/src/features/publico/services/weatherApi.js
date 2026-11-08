
const descripcionClima = (codigo) => {
  if (codigo === 0) return "Cielo despejado";
  if ([1, 2].includes(codigo)) return "Parcialmente nublado";
  if (codigo === 3) return "Nublado";
  if ([45, 48].includes(codigo)) return "Niebla";
  if (codigo >= 51 && codigo <= 57) return "Llovizna";
  if (codigo >= 61 && codigo <= 67) return "Lluvia";
  if (codigo >= 71 && codigo <= 77) return "Nieve";
  if (codigo >= 80 && codigo <= 82) return "Chaparrones";
  if (codigo >= 85 && codigo <= 86) return "Nevadas";
  if (codigo >= 95 && codigo <= 99) return "Tormenta";

  return "Condiciones no especificadas";
};

export async function consultarClima(ciudad) {
  const busqueda = ciudad.trim();

  if (busqueda.length < 2 || busqueda.length > 100) {
    throw new Error(
      "Ingresá el nombre de una ciudad válido."
    );
  }

  // PASO 1: Buscar las coordenadas
  const parametrosGeo = new URLSearchParams({
    name: busqueda,
    count: "1",
    language: "es",
    format: "json",
  });

  const respuestaGeo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${parametrosGeo}`
  );

  if (!respuestaGeo.ok) {
    throw new Error(
      "No se pudo buscar la ciudad."
    );
  }

  const datosGeo = await respuestaGeo.json();
  const lugar = datosGeo.results?.[0];

  if (!lugar) {
    throw new Error(
      "No encontramos esa ciudad. Revisá el nombre."
    );
  }

  // PASO 2: Consultar las condiciones actuales
  const parametrosClima = new URLSearchParams({
    latitude: String(lugar.latitude),
    longitude: String(lugar.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto",
  });

  const respuestaClima = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parametrosClima}`
  );

  if (!respuestaClima.ok) {
    throw new Error(
      "No se pudo obtener la información meteorológica."
    );
  }

  const datosClima = await respuestaClima.json();

  if (!datosClima.current) {
    throw new Error(
      "No hay datos meteorológicos disponibles."
    );
  }

  const actual = datosClima.current;

  // Devolver solamente lo que necesita React
  return {
    ciudad: lugar.name,
    region: lugar.admin1 || "",
    pais: lugar.country || "",
    temperatura: actual.temperature_2m,
    sensacion: actual.apparent_temperature,
    humedad: actual.relative_humidity_2m,
    viento: actual.wind_speed_10m,
    descripcion: descripcionClima(actual.weather_code),
    fechaHora: actual.time,
  };
}
