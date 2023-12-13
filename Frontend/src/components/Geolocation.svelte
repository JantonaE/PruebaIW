<!-- GeolocationExample.svelte -->

<script>
  import { setUserCoords } from '../lib/geoloc.ts';

  let errorMessage = null;

  export let coords = [];

  // Function to get geolocation
  export const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coords = [position.coords.latitude, position.coords.longitude];
          setUserCoords(coords);
        },
        (error) => {
          errorMessage = `Error: ${error.message}`;
        }
      );
    } else {
      errorMessage = 'Geolocation is not supported by this browser.';
    }
  };

  // Call the function when the component is mounted
  import { onMount } from 'svelte';

  onMount(() => {
    getLocation();
  });
</script>

<p>Geolocation: {coords}</p>
