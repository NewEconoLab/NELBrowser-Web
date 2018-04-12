/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>

namespace WebBrowser
{
    /**
     * @class 交易记录
     */
    export class Transactions implements Page
    {
        close(): void
        {
            this.div.hidden = true;
        }
        div: HTMLDivElement = document.getElementById( "txlist-page" ) as HTMLDivElement;
        private pageUtil: PageUtil;
        private txlist: JQuery<HTMLElement>;
        constructor()
        {
            this.txlist = $( "#txlist-page" );
            //监听交易列表选择框
            $( "#TxType" ).change( () =>
            {
                this.updateTrasctions( this.pageUtil, <string>$( "#TxType" ).val() );
            } );

            this.txlist.find( "#next" ).click( () =>
            {
                if ( this.pageUtil.currentPage == this.pageUtil.totalPage )
                {
                    alert( '当前页已经是最后一页了' );
                    return;
                } else
                {
                    this.pageUtil.currentPage += 1;
                    this.updateTrasctions( this.pageUtil, <string>$( "#TxType" ).val() );
                }
            } );
            this.txlist.find( "#previous" ).click( () =>
            {
                if ( this.pageUtil.currentPage <= 1 )
                {
                    alert( '当前已经是第一页了' );
                    return;
                } else
                {
                    this.pageUtil.currentPage -= 1;
                    this.updateTrasctions( this.pageUtil, <string>$( "#TxType" ).val() );
                }
            } );

        }

        //更新交易记录
        public async updateTrasctions( pageUtil: PageUtil, txType: string )
        {
            this.txlist.find( "#transactions" ).empty();
            //分页查询交易记录
            let txs: Tx[] = await WWW.getrawtransactions( pageUtil.pageSize, pageUtil.currentPage, txType );
            this.txlist.find( "table" ).children( "tbody" ).empty();
            for ( var n = 0; n < pageUtil.pageSize; n++ )
            {
                let txid = txs[n].txid;
                let html: string = await this.getTxLine( txid, txs[n].type, txs[n].size.toString(), txs[n].blockindex.toString(), txs[n].vin, txs[n].vout );
                this.txlist.find( "#transactions" ).append( html );
            }
            pageCut( this.pageUtil );

        }
        /**
         * async start
         */
        public async start()
        {
            let txCount = await WWW.gettxcount();
            //初始化交易列表
            this.pageUtil = new PageUtil( txCount, 15 );
            this.updateTrasctions( this.pageUtil, <string>$( "#TxType" ).val() );
            this.div.hidden = false;
        }


        async getTxLine( txid: string, type: string, size: string, index: string, vins, vouts )
        {
            var id = txid.replace( '0x', '' );
            id = id.substring( 0, 6 ) + '...' + id.substring( id.length - 6 );
            return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" >` + id + `</a></span></div>
                    <div class="content-nel"><span>`+ type.replace( "Transaction", "" ) + `</span></div>
                    <div class="content-nel"><span>`+ size + ` bytes</span></div>
                    <div class="content-nel"><span><a href="`+ Url.href_block( parseInt( index) ) + `" >` + index + `</a></span></div>
                </div>
                <a onclick="txgeneral(this)" class="end" id="genbtn"><img src="../img/open.svg" /></a>
                <div class="transaction" style="width:100%;display: none;" vins='`+ JSON.stringify( vins ) + `' vouts='` + JSON.stringify( vouts ) + `'>
                </div>
            </div>
            `;
        }

        static async getTxgeneral( vins, vouts, div: HTMLDivElement )
        {
            vins = JSON.parse( vins );
            vouts = JSON.parse( vouts );
            var ajax: Ajax = new Ajax();
            let allAsset: Asset[] = await ajax.post( 'getallasset', [] );
            allAsset.map( ( asset ) =>
            {
                if ( asset.id == AssetEnum.NEO )
                {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if ( asset.id == AssetEnum.GAS )
                {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
            } );

            let arr = new Array<any>();
            for ( let index = 0; index < vins.length; index++ )
            {
                const vin = vins[index];
                try
                {
                    let txInfos: Tx[] = await ajax.post( 'getrawtransaction', [vin.txid] );
                    let vout = txInfos[0].vout[vin.vout]
                    let address: string = vout.address;
                    let value: string = vout.value;
                    let name = allAsset.find( val => val.id == vout.asset ).name.map( name => { return name.name } ).join( "|" );
                    arr.push( { vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value } );
                } catch ( error )
                {

                }
            }
            let arra = Transaction.groupByaddr( arr );
            let form = "";
            for ( let index = 0; index < arra.length; index++ )
            {
                const item = arra[index];
                let li = '';
                for ( let i = 0; i < item.data.length; i++ )
                {
                    const element = item.data[i];
                    li += `<li>` + element.amount + ` ` + element.name + `</li>`;
                }
                form +=
                    `
                <div class="item"><div class="address"><a>`+ item.addr + `</a></div><ul class="amount">` + li + `</ul></div>
                `;
            }

            let tostr = "";
            vouts.forEach( vout =>
            {
                let name = allAsset.find( val => val.id == vout.asset ).name.map( name => name.name ).join( "|" );
                let sign: string = "";
                if ( arra.find( item => item.addr == vout.address ) )
                {
                    sign = "(change)"
                }
                tostr +=
                    `
                <div class="item">
                    <div class="address"><a>`+ vout.address + `</a></div>
                    <ul class="amount"><li>`+ vout.value + ` ` + name + sign + `</li></ul>
                </div>
                `
            } );

            var res = `
            <div class="formaddr" style="width:41.3%">
                `+ form + `
            </div>
            <div class="turnto"><img src="../img/turnto.svg" /></div>
            <div class="toaddr" style="width:41.3%">
                `+ tostr + `
            </div>
            <div style="width:60px;"></div>
            `
            div.innerHTML = res;
        }
    }
}