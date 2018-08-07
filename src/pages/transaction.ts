namespace WebBrowser
{

    /**
     * @class 交易详情
     */
    export class Transaction implements Page
    {
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        div: HTMLDivElement = document.getElementById("transaction-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;

        start()
        {
            //this.div.innerHTML = pages.transaction;
            this.updateTxInfo(locationtool.getParam());
            let href = locationtool.getUrl() + "/transactions";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all transactions</a>';
            if (location.pathname == '/zh/') {
                html = '<a href="' + href + '" target="_self">&lt&lt&lt返回</a>';
            }
            $("#goalltrans").empty();
            $("#goalltrans").append(html);
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        public async updateTxInfo(txid: string)
        {
            let txInfo: Tx = await WWW.getrawtransaction( txid );
            $("#type").text(txInfo.type.replace("Transaction", ""));
            $("#txid").text(txInfo.txid);
            $("#blockindex").empty();
            $("#blockindex").append("<a href='" + Url.href_block(txInfo.blockindex) + "'>" + txInfo.blockindex + "</a>");
            $("#txsize").text(txInfo.size + " bytes");
            $("#sysfee").text(txInfo["sys_fee"] + " gas");
            $("#netfee").text(txInfo["net_fee"] + " gas");
            let ajax: Ajax = new Ajax();
            let blocks: Block[] = await ajax.post('getblock', [txInfo.blockindex]);
            let block: Block = blocks[0];
            let time = DateTool.getTime(block.time);
            //if (location.pathname == '/zh/') {
            //    let newDate = new Date();
            //    newDate.setTime(block.time * 1000);
            //    time = newDate.toLocaleString();
            //}
            $("#transaction-time").text(time);
            //let allAsset: Asset[] = await WWW.api_getAllAssets();

            let arr = new Array<any>();
            for (let index = 0; index < txInfo.vin.length; index++)
            {
                const vin = txInfo.vin[index];
                try
                {
                    let txInfo: Tx = await WWW.getrawtransaction( vin.txid );
                    let vout = txInfo.vout[vin.vout]
                    let address: string = vout.address;
                    let value: string = vout.value;
                    let name = CoinTool.assetID2name[vout.asset];
                    arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
                } catch (error)
                {

                }
            }
            $("#from").empty();
            let array = Transaction.groupByaddr(arr);
            for (let index = 0; index < array.length; index++)
            {
                const item = array[index];
                let html = "";

                html += '<div class="line" > <div class="title-nel" > <span>Address </span></div >';
                html += '<div class="content-nel" > <span id="size" >' + item.addr + ' </span></div > </div>';
                for (let i = 0; i < item.data.length; i++)
                {
                    const element = item.data[i];
                    html += '<div class="line" > <div class="title-nel" > <span>' + element.name + ' </span></div >';
                    html += '<div class="content-nel" > <span id="size" >' + element.amount + ' </span></div > </div>';
                }
                $("#from").append(html);
            }
            $("#to").empty();
            txInfo.vout.forEach(vout =>
            {
                let name = CoinTool.assetID2name[vout.asset];
                let sign: string = "";
                if (array.find(item => item.addr == vout.address))
                {
                    sign = "(change)"
                }
                let html = "";
                html += '<div class="line" > <div class="title-nel" > <span>Address </span></div >';
                html += '<div class="content-nel" > <span id="size" >' + vout.address + ' </span></div > </div>';
                html += '<div class="line" > <div class="title-nel" > <span>' + name+' </span></div >';
                html += '<div class="content-nel" > <span id="size" >' + vout.value + sign + ' </span></div > </div>';
                $("#to").append(html);
            });

            $("#txidnep5").empty();
            let txidNep = await WWW.api_getnep5transferbytxid(txid);
            //console.log(txidNep);
            if (txidNep) {
                $(".txidnep-warp").show();
                txidNep.forEach((item) => {
                    this.loadTxidNep5View(item.asset, item.from, item.to, item.value);
                })
            } else {
                $(".txidnep-warp").hide();
            }
        }

        async loadTxidNep5View(asset: string, from: string, to: string, value: number) {
            let href = Url.href_nep5(asset);
            let nep5Name = await WWW.api_getnep5(asset);
            let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + nep5Name[0].name + `</a></td>
                    <td>` + from + `</td>
                    <td>` + to + `</td>
                    <td>` + value + `</td>
                    </tr>`
            $("#txidnep5").append(html);
        }

        public static groupByaddr(arr: any[])
        {
            var map = {},
                dest = [];
            for (var i = 0; i < arr.length; i++)
            {
                var ai = arr[i];
                if (!map[ai.addr])
                {
                    dest.push({
                        addr: ai.addr,
                        data: [ai]
                    });
                    map[ai.addr] = ai;
                } else
                {
                    for (var j = 0; j < dest.length; j++)
                    {
                        var dj = dest[j];
                        if (dj.addr == ai.addr)
                        {
                            dj.data.push(ai);
                            break;
                        }
                    }
                }
            }
            return dest;
        }

    }

}
