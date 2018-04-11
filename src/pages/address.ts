namespace WebBrowser
{
    export class Address implements Page
    {
        close(): void
        {
            this.div.hidden = false;
        }
        div: HTMLDivElement = document.getElementById( "address-info" ) as HTMLDivElement;
        async start()
        {
            this.div.innerHTML = pages.addres;
            var address = locationtool.getParam();
            var utxos = await WWW.api_getUTXO( address );
            var balances = await WWW.api_getbalances( address );
            this.loadView( address, balances, utxos );
            this.div.hidden = false;
        }

        loadView( address: string, balances: Balance[], utxos: Utxo[] )
        {
            //$("#balance").empty();
            $( "#utxos" ).empty();
            $( "#address" ).text( address );
            // console.log(this.balances);
            balances.forEach( ( balance: Balance ) =>
            {
                let html = '';
                var name = CoinTool.assetID2name[balance.asset];

                html += '<div class="line" > <div class="title-nel" > <span>' + name + ' </span></div >';
                html += '<div class="content-nel" > <span> ' + balance.balance + ' </span></div > </div>';
                $( "#balance" ).append( html );
            } );
            utxos.forEach( ( utxo: Utxo ) =>
            {
                let html = `
                <tr>
                <td class='code'>` + CoinTool.assetID2name[utxo.asset] + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_blank' href='`+ Url.href_transaction( utxo.txid ) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`
                $( "#utxos" ).append( html );
            } );
        }
    }
}