/// <reference path="../tools/wwwtool.ts" />
/// <reference path="../tools/cointool.ts" />
/// <reference path="../tools/timetool.ts" />
namespace WebBrowser
{
    export class Address implements Page
    {
        close(): void
        {
            this.div.hidden = true;
        }
        div: HTMLDivElement = document.getElementById("address-info") as HTMLDivElement;
        private pageUtil: PageUtil;
        private pageUtilUtxo: PageUtil;
        async start()
        {
            this.div.innerHTML = pages.addres;
            var address = locationtool.getParam();
            var addrMsg = await WWW.api_getaddrMsg(address);
            var utxos = await WWW.api_getUTXO(address );
            var balances = await WWW.api_getbalances(address);
            var nep5ofAddress = await WWW.api_getallnep5assetofaddress(address);
            
            this.loadAddressInfo(address, addrMsg);
            this.loadView(balances, nep5ofAddress, utxos);


            this.pageUtil = new PageUtil(addrMsg[0].txcount, 10);
            this.initPage(addrMsg[0].txcount, address);
            this.updateAddrTrasctions(address, this.pageUtil);


            this.div.hidden = false;
        }
        
        //AddressInfo视图
        loadAddressInfo(address: string, addrMsg: AddressMsg[])
        {
            let createdTime = DateTool.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(addrMsg[0].firstuse.blocktime.$date));
            let totalTran = addrMsg[0].txcount;
            $("#address").text(address);
            $("#created").text(createdTime);
            $("#totalTran").text(totalTran);
            let href = locationtool.getUrl() + "/addresses";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all addresses</a>';
            $("#goalladress").append(html);
        }

        loadView( balances: Balance[], nep5ofAddress: Nep5OfAddress[], utxos: Utxo[] )
        {
            $( "#utxos" ).empty();
            
            balances.forEach( ( balance: Balance ) =>
            {
                var name = CoinTool.assetID2name[balance.asset];

                let html = `
                <div class="line" > <div class="title-nel" > <span>` + name + ` </span></div >
                <div class="content-nel" > <span> ` + balance.balance + ` </span></div > </div>`;
                $( "#balance" ).append( html );
            });
            if (nep5ofAddress)
            {
                nep5ofAddress.forEach((nep5ofAddress: Nep5OfAddress) => {
                    let html = `
                <div class="line" > <div class="title-nel" > <span>` + nep5ofAddress.symbol + ` </span></div >
                <div class="content-nel" > <span> ` + nep5ofAddress.balance + ` </span></div > </div>`;
                    $("#balance").append(html);
                })
            }
            
            utxos.forEach( ( utxo: Utxo ) =>
            {
                let html = `
                <tr>
                <td class='code'>` + CoinTool.assetID2name[utxo.asset] + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_blank' href='`+ Url.href_transaction( utxo.txid ) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`
                $( "#utxos" ).append( html );
            } );
        }

        initPage(transtotal: number,address: string) {
            if (transtotal > 10) {
                $("#trans-page-msg").show();
                $("#addr-trans-page").show();
            } else {
                $("#trans-page-msg").hide();
                $("#addr-trans-page").hide();
            }

            $("#trans-next").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
            });
            $("#trans-previous").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
            });
        }

        //更新交易记录
        public async updateAddrTrasctions(address:string, pageUtil: PageUtil) {
            $("#addr-trans").empty();
            //分页查询交易记录
            let txlist: TransOfAddress[] = await WWW.getaddrsesstxs(address, pageUtil.pageSize, pageUtil.currentPage);
            let listLength = 0;
            if (txlist.length < 10)
            {
                listLength = txlist.length;
            } else {
                listLength = pageUtil.pageSize;
            }
            for (var n = 0; n < listLength; n++)
            {
                let txid = txlist[n].txid;
                let time = DateTool.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(txlist[n].blocktime.$date));
                let html: string = await this.getAddrTransLine(txid, txlist[n].type, "xxxxxxx",time, txlist[n].vin, txlist[n].vout);
                $("#addr-trans").append(html);
            }
            
            pageCut(this.pageUtil);

            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 10) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            let pageMsg = "Trasctions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#trans-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#trans-next").removeClass('disabled');
            } else {
                $("#trans-next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#trans-previous").removeClass('disabled');
            } else {
                $("#trans-previous").addClass('disabled');
            }
        }

        async getAddrTransLine(txid: string, type: string, from:string, time: number, vins, vouts) {
            var id = txid.replace('0x', '');
            id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
            return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" >` + id + `</a></span></div>
                    <div class="content-nel"><span>`+ type.replace("Transaction", "") + `</span></div>
                    <div class="content-nel"><span>`+ time + `</a></span></div>
                </div>
                <a onclick="txgMsg(this)" class="end" id="genbtn"><img src="../img/open.svg" /></a>
                <div class="transaction" style="width:100%;display: none;" vins='`+ JSON.stringify(vins) + `' vouts='` + JSON.stringify(vouts) + `'>
                </div>
            </div>
            `;
        }

        static async getTxMsg(vins, vouts, div: HTMLDivElement) {
            vins = JSON.parse(vins);
            vouts = JSON.parse(vouts);
            let myAddress = $("#address").text();

            let form = "";
            vins.forEach(vins => {
                let name = CoinTool.assetID2name[vins.asset];
                let addrStr = '';
                if (vins.address == myAddress) {
                    addrStr = `<div class="address"><a class="color-FDBA27">` + vins.address + `</a></div>`
                } else {
                    addrStr = `<div class="address"><a>` + vins.address + `</a></div>`
                }
                form +=
                    `
                <div class="item">`+ addrStr +`
                    <ul class="amount"><li>`+ vins.value + ` ` + name + `</li></ul>
                </div>
                `
            });

            let tostr = "";
            vouts.forEach(vout => {
                let name = CoinTool.assetID2name[vout.asset];
                let addrStr = '';
                if (vout.address == myAddress) {
                    addrStr = `<div class="address"><a class="color-FDBA27">` + vout.address + `</a></div>`
                } else {
                    addrStr = `<div class="address"><a>` + vout.address + `</a></div>`
                }
                tostr +=
                    `
                <div class="item">`+ addrStr + `
                    <ul class="amount"><li>`+ vout.value + ` ` + name + `</li></ul>
                </div>
                `
            });

            var res = `
            <div class="formaddr">
                `+ form + `
            </div>
            <div class="turnto"><img src="../img/turnto.svg" /></div>
            <div class="toaddr">
                `+ tostr + `
            </div>
            `
            div.innerHTML = res;
        }

    }
}