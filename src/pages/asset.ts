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
            this.div.hidden = false;
            this.view( locationtool.getParam() );
        }
        close(): void
        {
            this.div.hidden = true;
        }
        view(assetid: string)
        {            
            this.div.innerHTML = pages.asset;
            WWW.api_getAllAssets().then((arr: Asset[]) =>
            {
                var asset = arr.find((value) =>
                {
                    return value.id == assetid;
                });

                if (asset.id == AssetEnum.NEO)
                {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (asset.id == AssetEnum.GAS)
                {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
                let name = asset.name.map((name) => { return name.name })
                asset.names = name.join("|");

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