/** */

import type { Puja, Mensaje, UsuarioOutput, ProductoOutput } from "api";

export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

export function acortarTexto(texto, longitud) {
  if (texto.length > longitud) {
    return texto.slice(0, longitud) + '...';
  } else {
    return texto;
  }
}

export function compararFechas(fechaActual, fechaCierre) {
  if (fechaActual > fechaCierre ) {
    return 'Cerrado';
  } else {
    return 'Abierto';
  }
}

export function stringToDate(fecha) {
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

export function estadoProducto(fecha: String) {
  let closed = false;

  const closeDate = stringToDate(fecha);
  const current = new Date();

  //console.log("FechaCierre: " + closeDate);
  //console.log("FechaActual: " + current);

  if (closeDate < current) {
    closed = true;
    //console.log("Estado Producto: Cerrado");
  } else {
    //console.log("Estado producto: Abierto");
  }

  return closed;
}

export function setCurrentBid(bids: Puja[], precio: number) {
  let highest = 0;
  for (let i = 0; i < bids.length; i++) {
    //console.log(bids[i]);
    if (bids[i].cantidad > highest) {
      highest = bids[i].cantidad;
    }
  }
  //console.log(highest);

  // Get the current price of the product by comparing the highest bid with the product's price
  const currentPrice = Math.max(precio, highest);

  return currentPrice;
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

export function productOwner(user: UsuarioOutput, product: ProductoOutput) {
  return user.idUser == product.vendedor;
}

export function getChatUser(messages: Mensaje[], owner: String) {

  let userList: String[] = [];

  messages.forEach(mensaje => {
    const emisor = mensaje.emisor
    if (!userList.includes(emisor) && emisor != owner) {
      userList.push(emisor);
    }
  })

  return userList;
}

export function messagePerUser(messages, chatUser) {
  let mensajePerUser: any[][] = [];

  //console.log(messages);
  //console.log(chatUser);

  chatUser.forEach(user => {
    let userMessage: any[] = []
    let mensajes: any[] = [];
    userMessage.push(user);
    messages.forEach(mensaje => {
      if (mensaje.emisor == user || mensaje.receptor == user) {
        mensajes.push(mensaje);
      }
    });
    userMessage.push(mensajes)
    mensajePerUser.push(userMessage);
  })

  /*mensajePerUser.forEach(data =>{
    console.log(data[0])
    data[1].forEach(mensaje =>{
      console.log(mensaje)
    })
  })*/

  return mensajePerUser;
}