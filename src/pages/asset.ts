namespace WebBrowser
{
    export class AssetInfo implements Page
    {
        div: HTMLDivElement = document.getElementById( "asset-info" ) as HTMLDivElement;
        name: HTMLSpanElement;
        type: HTMLSpanElement;
        id: HTMLSpanElement;
        available: HTMLSpanElement;
        precision: HTMLSpanElement;
        admin: HTMLSpanElement;
        start()
        {
            this.view( locationtool.getParam() );
            this.div.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
        }
        view(assetid: string)
        {            
            //this.div.innerHTML = pages.asset;
            WWW.api_getasset(assetid).then((data) =>
            {
                var asset = data[0];
                
                asset.names = CoinTool.assetID2name[asset.id];
                $("#name").text(asset.names);
                $("#type").text(asset.type);
                $("#id").text(asset.id);
                $("#available").text(asset.available);
                $("#precision").text(asset.precision);
                $("#admin").text(asset.admin);                
            })

        }
    }
}