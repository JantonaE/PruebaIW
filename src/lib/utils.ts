/** */

import { errors, jwtVerify } from "jose";
import * as jose from "jose";

export const getFormattedDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

export function acortarTexto(texto: string, longitud: number) {
  if (texto.length > longitud) {
    return texto.slice(0, longitud) + '...';
  } else {
    return texto;
  }
}

export function compararFechas(fechaActual: Date, fechaCierre: Date) {
  if (fechaActual > fechaCierre ) {
    return 'Cerrado';
  } else {
    return 'Abierto';
  }
}

export function stringToDate(fecha: string) {
  var partesFecha = fecha.split("/");

  // Las partes de la fecha están en el formato [mes, día, año]
  var dia = parseInt(partesFecha[0], 10);
  var mes = parseInt(partesFecha[1], 10) - 1;
  var año = parseInt(partesFecha[2], 10);

  // Creamos un objeto Date utilizando las partes de la fecha
  return new Date(año, mes, dia);
}

export function dateToString(date: Date) {
  //console.log(date);
  const string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  //console.log(string);
  return string;
}

export function generarCoordenadasRandom() {
  // Rango de latitud y longitud (ajusta según tus necesidades)
  const rangoLatitud = { min: -90, max: 90 };
  const rangoLongitud = { min: -180, max: 180 };

  // Generar latitud y longitud aleatorias
  const latitud = Math.random() * (rangoLatitud.max - rangoLatitud.min) + rangoLatitud.min;
  const longitud = Math.random() * (rangoLongitud.max - rangoLongitud.min) + rangoLongitud.min;

  return { latitud, longitud };
}

const secret = new TextEncoder().encode(import.meta.env.AUTH0_SECRET);
const baseUrl = import.meta.env.AUTH0_DOMAIN;

export const verifyAuth = async (token: string | undefined) => {

  if (!token) {
    return {
      status: "unauthorized",
      msg: "please pass a request token",
    };
  }

  const JWKS = jose.createRemoteJWKSet(
    new URL(`${baseUrl}/.well-known/jwks.json`)
  );

  try{
    await jose.jwtVerify(token, JWKS);
    return {
      status: "authorized",
      msg: "thank you!",
    };
  }catch(err){
    return {
      status: "unauthorized",
      msg: "token could not be verified",
    };
  }
};