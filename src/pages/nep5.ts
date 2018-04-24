/// <reference path="../app.ts"/>
namespace WebBrowser
{
    export class Nep5page implements Page
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
            var nep5id = locationtool.getParam();
            let href = locationtool.getUrl() + "/assets";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all assets</a>';
            $("#goallasset").empty();
            $("#goallasset").append(html);

            this.loadNep5InfoView(nep5id);

            var assetType = locationtool.getType();
            if (assetType == 'nep5') {
                $(".asset-nep5-warp").show();
                this.loadAssetBalanceView(nep5id);
                this.loadAssetTranView(nep5id);
            } else {
                $(".asset-nep5-warp").hide();
            }
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        loadNep5InfoView(nep5id: string)
        {            
            //this.div.innerHTML = pages.asset;
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
        async loadAssetTranView(nep5id: string)
        {
            let tranList: TransOfAsset[] = await WWW.api_getnep5transfersbyasset(nep5id);
            console.log(tranList);
            $("#assets-tran-list").empty();
            if (tranList) {
                tranList.forEach((item) => {
                    console.log(item);
                    if (!item.from) {
                        item.from = '-'
                    }
                    if (!item.to) {
                        item.to = '-'
                    }
                    let html = `
                    <tr>
                    <td><a class="code omit" href="`+ Url.href_transaction(item.txid) + `" target="_self">` + item.txid + `
                    </a></td>
                    <td>` + item.from + `
                    </td>
                    <td>` + item.to + `
                    </td>
                    <td>` + item.blockindex + `</td>
                    </tr>`
                    $("#assets-tran-list").append(html);
                })
            } else {
                let html = `<tr><td colspan="3" >There is no data</td></tr>`
                $("#assets-tran-list").append(html);
            }
            
        }

        async loadAssetBalanceView(nep5id: string) {
            let balanceList = await WWW.getrankbyasset(nep5id);
            $("#assets-balance-list").empty();
            if (balanceList) {
                let rank = 1;
                balanceList.forEach((item) => {
                    console.log(item);
                    for (var key in item) {
                        let href = Url.href_address(item[key]);
                        let html = `
                    <tr>
                    <td>` + rank + `
                    </td>
                    <td><a target="_self" href="`+ href + `">` + key + `
                    </a></td>
                    <td>` + item[key] + `</td>
                    </tr>`
                        $("#assets-balance-list").append(html);
                    }
                    rank++;
                })
            } else {
                let html = `<tr><td colspan="3" >There is no data</td></tr>`
                $("#assets-balance-list").append(html);
            }

        }
    }
}