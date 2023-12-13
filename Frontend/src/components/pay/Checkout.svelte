<script>
  import { loadScript } from "@paypal/paypal-js";
  import { onMount } from "svelte";
  
  export let cartTotal = 0.01;
  const CLIENT_ID = import.meta.env.PAYPAL_CLIENTID; // change this to your own client id

  onMount(() => {
      loadScript({ 'client-id': CLIENT_ID }).then((paypal) => {
        paypal.Buttons({
            style: {
                color: 'blue',
                shape: 'pill'
            },
            createOrder: function (data, actions) {
                // Set up the transaction
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: amount
                            }
                        }
                    ]
                });
            },
            onApprove: async function (data, actions) {
                // Capture order after payment approved
                const details = await actions.order.capture();
                alert('Payment successful!');
            },
            onError: function (err) {
                // Log error if something goes wrong during approval
                alert('Something went wrong');
                console.log('Something went wrong', err);
            }
        }).render("#paypal-button-container");
    });
   });
</script>

<div id="paypal-button-container" />

<style>
  #paypal-button-container {
    margin: 30px 0;
  }
</style>