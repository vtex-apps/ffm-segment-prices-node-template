# External Price App

A reference IO app to fetch segmented prices from main account.

## Using VTEX Pricing as price provider

If you wish to use the VTEX Pricing as the source of your prices the app already handle that based on the priceTables configured in the user profile. You will also need to ask our support team to enable and configure the pricing hub feature.

For mor information visit: [Pricing Hub documentation](https://developers.vtex.com/vtex-rest-api/docs/pricing-hub) and [Configuring price tables for specific users](https://help.vtex.com/tutorial/setting-up-price-tables-for-specific-users--5S9oDOMHNmY4K0kAewAiWY)

## Implementation using external price provider

1. Fork this app.
2. In the `manifest.json` file:
    * Change the `vendor` field to the name of the account you are using.
    * Change the `name` field to one of your choosing.
    * Add your service host (e.g. `myhost.com`) in an `outbound-access` policy.
3. In the `node/env.ts` file, add your service endpoint as follows:

    ```
    const ENV = {
      SERVICE_ENDPOINT: 'http://myservice.com',
    }
    
    export default ENV
    ```
    
4. Change the ` node/clients/externalPrice.ts` file to parse data received by the external pricing app and return it in a way that Pricing Hub can understand. See more details on the specification of this format in the [Pricing Hub documentation](https://developers.vtex.com/vtex-rest-api/docs/pricing-hub).


> ⛔ Do not change the `"routes"` in `node/service.json` nor the files in `node/typings/`, since they were created to reflect Pricing Hub behavior.

