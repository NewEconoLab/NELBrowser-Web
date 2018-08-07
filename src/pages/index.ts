/// <reference path="../app.ts"/>
namespace WebBrowser
{
    export class Index implements Page
    {
        close(): void
        {
            this.div.hidden = true;
        }
        div: HTMLDivElement = document.getElementById('index-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        viewtxlist: HTMLAnchorElement = document.getElementById( "viewtxlist" ) as HTMLAnchorElement;
        viewblocks: HTMLAnchorElement = document.getElementById( "viewblocks" ) as HTMLAnchorElement;
        alladdress: HTMLAnchorElement = document.getElementById( "alladdress" ) as HTMLAnchorElement;
        allblock: HTMLAnchorElement = document.getElementById( "allblock" ) as HTMLAnchorElement;
        alltxlist: HTMLAnchorElement = document.getElementById("alltxlist") as HTMLAnchorElement;
        cnbtn = document.getElementById("cn-btn");
        enbtn = document.getElementById("en-btn");
        constructor() {

            this.cnbtn.onclick = () => {
                $("#cn-btn").attr('href', '/zh/' + location.hash);
            }
            this.enbtn.onclick = () => {
                $("#en-btn").attr('href', '/' + location.hash);
            }
        }
        async start()
        {
            this.viewtxlist.href = Url.href_transactions();
            this.viewblocks.href = Url.href_blocks();
            this.alladdress.href = Url.href_addresses();
            this.allblock.href = Url.href_blocks();
            this.alltxlist.href = Url.href_transactions();
            this.div.hidden = false;
            //查询区块高度(区块数量-1)
            let blockHeight = await WWW.api_getHeight();
            //查询交易数量
            let txCount: number = await WWW.gettxcount("");
            //查询地址总数
            let addrCount: number = await WWW.getaddrcount();
            //分页查询区块数据
            let blocks: Block[] = await WWW.getblocks( 10, 1 );
            //分页查询交易记录
            let txs: Tx[] = await WWW.getrawtransactions( 10, 1,'');

            $( "#blockHeight" ).text( NumberTool.toThousands( blockHeight ) );//显示在页面

            $( "#txcount" ).text( NumberTool.toThousands( txCount ) );//显示在页面

            $( "#addrCount" ).text( NumberTool.toThousands( addrCount ) );

            $( "#index-page" ).find( "#blocks" ).children( "tbody" ).empty();
            $( "#index-page" ).find( "#transactions" ).children( "tbody" ).empty();

            let html_blocks = ``;
            let html_txs = ``;

            blocks.forEach( ( item, index, input ) =>
            {
                //var newDate = new Date();
                //newDate.setTime(item.time * 1000);
                let time = DateTool.getTime(item.time);
                //if (location.pathname == '/zh/') {
                //    let newDate = new Date();
                //    newDate.setTime(item.time * 1000);
                //    time = newDate.toLocaleString();
                //}
                html_blocks += `
                <tr><td>
                <a class="code" target="_self" href ='`+ Url.href_block( item.index ) + `' > 
                `+ item.index + `</a></td>
                <td>` + item.size + ` bytes</td>
                <td>` + time + `</td>
                <td>` + item.tx.length + `</td></tr>`;
            } );

            txs.forEach( ( tx ) =>
            {
                let txid: string = tx.txid;
                let txtype = tx.type.replace( "Transaction", "" );
                txid = txid.replace( '0x', '' );
                txid = txid.substring( 0, 4 ) + '...' + txid.substring( txid.length - 4 );
                html_txs += `
                <tr>
                <td><a class='code' target='_self'
                 href ='`+ Url.href_transaction( tx.txid ) + `' > ` + txid + ` </a>
                </td>
                <td>` + txtype + `
                </td>
                <td> `+ tx.blockindex + `
                </td>
                <td> `+ tx.size + ` bytes
                </td>
                </tr>`;
            } );

            $( "#index-page" ).find( "#blocks" ).children( "tbody" ).append( html_blocks );
            $("#index-page").find("#transactions").children("tbody").append(html_txs);



            this.footer.hidden = false;
        }
    }
}