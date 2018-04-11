namespace WebBrowser
{
    //资产页面管理器
    export class Assets implements Page
    {
        div: HTMLDivElement = document.getElementById( "asset-page" ) as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
        }
        async start()
        {
            this.allAsset();
            this.div.hidden = false;
        }
        async allAsset()
        {
            var assets = await WWW.api_getAllAssets();
            let nep5Info: GetNep5Info = new GetNep5Info();
            let storutil: StorageUtil = new StorageUtil();
            let nep5asids: string[] = storutil.getStorage( "assetIds_nep5", "|" );
            let nep5s: Asset[] = new Array<Asset>();
            for ( let n = 0; n < nep5asids.length; n++ )
            {
                let res = await nep5Info.getInfo( nep5asids[n] );
                let assetnep5: Nep5as = new Nep5as();
                if ( !res.err )
                {
                    assetnep5.names = res.result["name"];
                    assetnep5.type = res.result["symbol"]
                    assetnep5.amount = res.result["totalsupply"];
                    assetnep5.id = nep5asids[n];
                } nep5s.push( assetnep5 );
            }
            this.loadView( assets, nep5s );   //调用loadView方法渲染页面
        }
        /**
         * loadView 页面展现
         */
        public loadView( assets: Asset[], nep5ass: Nep5as[] )
        {
            $( "#assets" ).empty();
            $( "#nep5ass" ).empty();
            assets.forEach( ( asset: Asset ) =>
            {
                let href = Url.href_asset( asset.id );
                let html = `
                <tr>
                <td> <a href="`+ href + `">` + CoinTool.assetID2name[asset.id] + `</a></td>
                <td>` + asset.type + `</td>
                <td>` + ( asset.amount <= 0 ? asset.available : asset.amount ) + `</td>
                <td>` + asset.precision + `</td>
                </tr>`;
                $( "#assets" ).append( html );
            } );
            nep5ass.forEach( ( asset: Asset ) =>
            {
                let html = `
                <tr>
                <td>` + asset.names + `</td>
                <td>`+ asset.type + `</td><td>` + asset.names + `</td>
                <td>` + ( asset.amount <= 0 ? asset.available : asset.amount ); + `</td>
                <td>` + asset.names + `</td></tr>`;
                $( "#nep5ass" ).append( html );
            } );
        }
    }
}