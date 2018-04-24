namespace WebBrowser
{
    export class Block implements Page
    {
        div: HTMLDivElement = document.getElementById("block-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }

        start()
        {
            //this.div.innerHTML = pages.block;
            this.queryBlock( locationtool.getParam() as number );
            this.div.hidden = false;
            this.footer.hidden = false;
        }

        public async queryBlock( index: number )
        {
            let ajax: Ajax = new Ajax();
            //let newDate = new Date();
            let blocks: Block[] = await ajax.post( 'getblock', [index] );
            let block: Block = blocks[0];
            //newDate.setTime(block.time * 1000);
            let time = DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(block.time * 1000));
            $( "#hash" ).text( block.hash );
            $( "#size" ).text( block.size + ' byte' );
            $("#time").text(time);
            $( "#version" ).text( block.version );
            $( "#index" ).text( block.index );
            let txs: Tx[] = block.tx;
            $("#txs").empty();
            txs.forEach( tx =>
            {
                var id = tx.txid.replace( '0x', '' );
                id = id.substring( 0, 6 ) + '...' + id.substring( id.length - 6 );
                $( "#txs" ).append( `
                    <tr>
                        <td><a href="` + Url.href_transaction(tx.txid) + `" target="_self">` + id + `</a></td>
                        <td>` + tx.type + `</td>
                        <td>` + tx.size + ` bytes</td>
                        <td>` + tx.version + `</td>
                    </tr>` );
            } );

        }
    }
}