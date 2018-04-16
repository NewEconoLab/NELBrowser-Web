/// <reference path="../app.ts"/>
namespace WebBrowser
{
    export class Nep5page implements Page
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
        view(nep5id: string)
        {            
            this.div.innerHTML = pages.asset;
            WWW.api_getnep5(nep5id).then((data) =>
            {
                var nep5 = data[0];
                $("#name").text(nep5.name);
                $("#type").text("Nep5");
                $("#id").text(nep5.assetid);
                $("#available").text(nep5.totalsupply);
                $("#precision").text(nep5.decimals);
                $("#admin").text("-");                
            })

        }
    }
}