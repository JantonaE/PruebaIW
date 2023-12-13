<script>
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css"; //Don't forget to declare leaflet css
  import { LeafletMap, TileLayer, Marker, Popup } from "svelte-leafletjs";
  import { acortarTexto, compararFechas } from "@lib/utils.ts";

  export let prods = [];

  const mapOptions = {
    center: [36.72, -4.4],
    zoom: 11,
  };
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: "© OpenStreetMap contributors",
  };

  let prodCoords = prods.map((item) => {
    return [item.lat, item.long];
  });

  let screenWidth;

  function cssVariables(node, variables) {
    setCssVariables(node, variables);

    return {
      update(variables) {
        setCssVariables(node, variables);
      },
    };
  }
  function setCssVariables(node, variables) {
    for (const name in variables) {
      node.style.setProperty(`--${name}`, variables[name]);
    }
  }

  console.log(prods);
  const estado = new Map();

  prods.forEach((el) => {
    const now = new Date();
    var partesFecha = el.fecha_cierre.split("/");
    // Las partes de la fecha están en el formato [mes, día, año]
    var dia = parseInt(partesFecha[0], 10) + 1;
    var mes = parseInt(partesFecha[1], 10) - 1;
    var año = parseInt(partesFecha[2], 10);

    // Creamos un objeto Date utilizando las partes de la fecha
    var closeDate = new Date(año, mes, dia);
    closeDate.setDate(closeDate.getDate() - 1);
    estado.set(
      el.idProd,
      el.pagado ? "Pagado" : compararFechas(now, closeDate),
    );
  });
  let leafletMap;

  onMount(() => {
    leafletMap.getMap().fitBounds(prodCoords);
  });
</script>

<svelte:window bind:outerWidth={screenWidth} />

<!-- <Geolocation getPosition bind:coords /> -->

{#if prods.length >= 0}
  <div class>
    <div class="map" use:cssVariables={{ screenWidth }}>
      <!-- center: changeCoords(coords), -->
      <LeafletMap bind:this={leafletMap} options={mapOptions}>
        <TileLayer url={tileUrl} options={tileLayerOptions} />
        
        {#each [...prods] as item}
          
          <Marker latLng={[item.lat, item.long]}>
            <Popup>
              <div class="flex">
                <a href={"/producto/" + item.idProd}><b>{item.titulo}</b></a>
                <div class="ms-3 font-bold text-white dark:text-white">
                  <span
                    class={`rounded-md p-1 ${
                      estado.get(item.idProd) === "Abierto"
                        ? "bg-green-400 text-green-900"
                        : item.pagado
                          ? "bg-violet-400 text-violet-900"
                          : "bg-red-400 text-red-900"
                    }`}>
                    {estado.get(item.idProd)}
                  </span>
                </div>
              </div>

              <div class="mt-2 text-black">Edad: {item.edad}</div>
              <div class="mt-2 text-black">Descripción: {acortarTexto(item.descripcion, 100)}</div>
            </Popup>
          </Marker>
        {/each}
      </LeafletMap>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <div
      style="border-top-color:transparent"
      class="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin">
    </div>
    <p class="ml-2">No products found.</p>
  </div>
{/if}

<style>
  .map {
    height: 800px;
    width: var(--screenWidth) px;
    z-index: 0;
    position: relative;
  }
</style>
