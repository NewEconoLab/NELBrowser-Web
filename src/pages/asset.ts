namespace WebBrowser
{
    export class AssetInfo implements Page
    {
        div: HTMLDivElement = document.getElementById("asset-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        name: HTMLSpanElement;
        type: HTMLSpanElement;
        id: HTMLSpanElement;
        available: HTMLSpanElement;
        precision: HTMLSpanElement;
        admin: HTMLSpanElement;
        start()
        {
            
            var assetid = locationtool.getParam();
            let href = locationtool.getUrl() + "/assets";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all assets</a>';
            $("#goallasset").empty();
            $("#goallasset").append(html);

            this.loadAssetInfoView(assetid);

            var assetType = locationtool.getType();
            if (assetType == 'nep5') {
                $(".asset-nep5-warp").show();
                $(".asset-tran-warp").show();
            } else {
                $(".asset-nep5-warp").hide();
                $(".asset-tran-warp").hide();
            }

            this.div.hidden = false;
            this.footer.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        loadAssetInfoView(assetid: string)
        {            
            //this.div.innerHTML = pages.asset;
            WWW.api_getasset(assetid).then((data) =>
            {
                var asset = data[0];
                
                asset.names = CoinTool.assetID2name[asset.id];
                $("#name").text(asset.names);
                $("#asset-info-type").text(asset.type);
                $("#id").text(asset.id);
                $("#available").text(asset.available);
                $("#precision").text(asset.precision);
                $("#admin").text(asset.admin);                
            })
        }
    }
}