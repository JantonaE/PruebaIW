
import UsuarioOutput from "../api/models/UsuarioOutput.ts";
import UsuarioInput from "../api/models/UsuarioInput.ts";
import ProductoOutput from "../api/models/ProductoOutput.ts";
import ProductoInput from "../api/models/ProductoInput.ts";

import * as utils from "./utils.ts"
let filterUrl = "";

export function convertirFormatoFecha(fechaString) {
  const [año, mes, dia] = fechaString.split("-");
  return `${dia}%2F${mes}%2F${año}`;
}

export async function deleteProduct(id: String){
  const apiUrl = 'http://127.0.0.1:8000/Productos/' + id;

  try{
    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      throw new Error(`Error deleting data: ${res.statusText}`);
    }
  } catch(error) {
    console.error("Error fetching data:", error);
  }

}


export async function fetchUserByUsername(USERNAME: String): UsuarioOutput {
  const apiUrl = `http://127.0.0.1:8000/Usuarios/Username/${USERNAME}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = await res.json() as UsuarioOutput;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


export async function fetchUserByUserId(ID_VENDOR: String): UsuarioOutput {
  const apiUrl = `http://127.0.0.1:8000/Usuarios/${ID_VENDOR}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = await res.json() as UsuarioOutput;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function createUser(EMAIL: String, NAME: String, LASTNAME: String, LASTNAME2: String): UsuarioOutput {
  const apiUrl = 'http://127.0.0.1:8000/Usuarios/';

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: EMAIL,
        nombre: NAME,
        apellido1: LASTNAME,
        apellido2: LASTNAME2,
        valoracion: 0,
        esAdmin: false
      }),
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = await res.json() as UsuarioOutput;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}



export async function filterProducts(params: URLSearchParams): ProductoOutput[] {
  let search, vendedor, fecha_cierre, precioMin, precioMax,edad;
  const errors = {
    fecha_cierre: "",
    precioMin: "",
    precioMax: "",
    edad: "",
    distanciaMin: "",
    distanciaMax: "",
  };
  search = params.get("search");
  vendedor = params.get("vendedor");
  fecha_cierre = params.get("fecha_cierre");
  precioMin = params.get("precioMin");
  precioMax = params.get("precioMax");
  edad = params.get("edad");

  if (typeof fecha_cierre !== "string") {
    errors.fecha_cierre += "Please enter a valid date. ";
  }
  if (typeof precioMin !== "number" || precioMin < 0) {
    errors.precioMin += "Min Price is not valid. ";
  } // Faltaria precioMin < precioMax y lo mismo con distancias
  if (typeof precioMax !== "number" || precioMax < 0) {
    errors.precioMax += "Max Price is not valid. ";
  }
  // /Products?search=...&distanciaMin=...&distanciaMax=...etc
  let apiUrl = "http://127.0.0.1:8000/Productos/?";
  try {
    if (search != null && search != "") {
      apiUrl += "&search=" + search;
    }
    if (vendedor != null && vendedor != "") {
      let vendorId = await fetchUserByUsername(vendedor);
      apiUrl += "&vendedor=" + vendorId.idUser;
    }
    if (fecha_cierre != null && fecha_cierre != "") {
      apiUrl += "&fechaCierreMax=" + convertirFormatoFecha(fecha_cierre);
    }
    if (precioMin != null && precioMin != "") {
      apiUrl += "&precioMin=" + precioMin;
    }
    if (precioMax != null && precioMax != "") {
      apiUrl += "&precioMax=" + precioMax;
    }
    if (edad != null && edad != "") {
      apiUrl += "&edad=" + edad;
    }

    filterUrl = apiUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  //console.log("URL: " + filterUrl);

  try {
    const res = await fetch(filterUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = await res.json() as UsuarioOutput[];

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function createProduct(
  VENDEDOR:String, TITULO:String, DESCRIPCION:String,EDAD:Number, PRECIO:Number, PESO:Number, FECHACIERRE:String, IMAGENES:String[]): ProductoOutput {
  const apiUrl = 'http://127.0.0.1:8000/Productos/';
  let latitud, longitud;

  try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      const { loc } = data;
      const [lat, lon] = loc.split(',');
  
      // Asignar valores a las variables dentro del bloque fetch
      latitud = lat;
      longitud = lon;
  
      // Aquí puedes usar las coordenadas por separado como desees
      console.log("Ubicación obtenida: Latitud: " + latitud + ", Longitud: " + longitud);
    } catch (error) {
      console.error(`Error obteniendo la ubicación: ${error.message}`);
  }

  
  try{
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // El mes comienza desde 0
    const yyyy = today.getFullYear();

    let DATE = `${dd}/${mm}/${yyyy}`;
    DATE = DATE.toString();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idProd: '',
        vendedor: VENDEDOR,
        titulo: TITULO,
        descripcion: DESCRIPCION,
        lat: latitud,
        long: longitud,
        direccion: '',
        edad: EDAD,
        precio: PRECIO,
        peso: PESO,
        fecha_publicacion: DATE,
        fecha_cierre: FECHACIERRE,
        pagado: false,
        valorado: true,
        imagenes: IMAGENES
      })
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }
    
    const data = await res.json() as ProductoOutput;
    console.log(data);
    return data;
  } catch(error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchProductByProductId(ID_PRODUCT: String): ProductoOutput {
  const apiUrl = `http://127.0.0.1:8000/Productos/${ID_PRODUCT}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const data = (await res.json()) as ProductoOutput;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function updateProduct(
  ID: String,
  VENDEDOR: String,
  TITULO: String,
  DESCRIPCION: String,
  LAT: Number,
  LONG: Number,
  EDAD: Number,
  PRECIO: Number,
  PESO: Number,
  FECHACIERRE: String,
  IMAGENES: String[]
): ProductoOutput {
  const apiUrl = `http://127.0.0.1:8000/Productos/${ID}`;
  console.log(ID);

  const today = new Date();

  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // El mes comienza desde 0
  const yyyy = today.getFullYear();

  const formattedDate = `${dd}/${mm}/${yyyy}`;

  const updatedProductData = {
    idProd: ID,
    vendedor: VENDEDOR,
    titulo: TITULO,
    descripcion: DESCRIPCION,
    lat: LAT,
    long: LONG,
    direccion: "",
    edad: EDAD,
    precio: PRECIO,
    peso: PESO,
    fecha_publicacion: formattedDate,
    fecha_cierre: FECHACIERRE,
    pagado: false,
    valorado: true,
    imagenes: IMAGENES,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProductData),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Error updating: ${response.status} - ${response.statusText}`);
    }

    const data = (await response.json()) as ProductoOutput;
    console.log(data);

    // Handle success, e.g., update the UI or perform additional actions
    console.log("Product has been updated successfully");

    return data; // Move the return statement here if you want to return the data

  } catch (error) {
    console.error("Error updating ", error);
    // Rethrow the error if you want it to propagate further
    throw error;
  }
}
