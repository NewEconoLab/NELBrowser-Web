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
            this.footer.hidden = true;
        }
        div: HTMLDivElement = document.getElementById("address-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        private pageUtil: PageUtil;
        private pageUtilUtxo: PageUtil;
        async start()
        {
            //this.div.innerHTML = pages.addres;
            var address = locationtool.getParam();
            let href = locationtool.getUrl() + "/addresses";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all addresses</a>';
            if (location.pathname == '/zh/') {
                html = '<a href="' + href + '" target="_self">&lt&lt&lt返回</a>';
            }
            $("#goalladress").empty();
            $("#goalladress").append(html);
            var addrMsg = await WWW.api_getaddrMsg(address);
            var utxos = await WWW.api_getUTXOCount(address );
            var balances = await WWW.api_getbalances(address);
            var nep5ofAddress = await WWW.api_getallnep5assetofaddress(address);

            if (addrMsg) {
                this.loadAddressInfo(address, addrMsg);
                this.pageUtil = new PageUtil(addrMsg[0].txcount, 10);
                this.initTranPage(addrMsg[0].txcount, address);
                this.updateAddrTrasctions(address, this.pageUtil);
            } else {
                $("#trans-page-msg").hide();
                $("#addr-trans-page").hide();
                $("#address").text("-");
                $("#created").text("-");
                $("#totalTran").text("-");
                let html = `<div class="line" style="text-align:center;padding:16px;font-size:16px;">There is no data</div>`;
                if (location.pathname == '/zh/') {
                    html = `<div class="line" style="text-align:center;padding:16px;font-size:16px;">没有数据</div>`;
                }
                $("#addr-trans").append(html);
            }

            this.loadView(balances, nep5ofAddress);
            
            if (utxos) {
                this.pageUtilUtxo = new PageUtil(utxos.length, 10);
                this.initUTXOPage(utxos.length, address);
                this.updateAddrUTXO(address, this.pageUtilUtxo);
            } else {
                $("#utxo-page-msg").hide();
                $("#addr-utxo-page").hide();
                let html = `<tr><td colspan="3" >There is no data</td></tr>`;
                if (location.pathname == '/zh/') {
                    html = `<tr><td colspan="3" >没有数据</td></tr>`;
                }
                $("#add-utxos").append(html);
            }
            //this.loadUTXOView(utxos);
             
            $("#trans-input").val('');
            $("#trans-input").off("input").on('input', () => {
                this.doTranGoPage(address,false)
            });
            $("#trans-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doTranGoPage(address,true);
                }
            });
            $("#trans-gopage").off("click").click(() => {
                this.doTranGoPage(address,true)
            });

            $("#utxo-input").val('');
            $("#utxo-input").off("input").on('input', () => {
                this.doUtxoGoPage(address,false)
            });
            $("#utxo-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doUtxoGoPage(address,true);
                }
            });
            $("#utxo-gopage").off("click").click(() => {
                this.doUtxoGoPage(address,true)
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        //跳转页面
        public doTranGoPage(address:string,gopage: boolean) {
            let page: number = $("#trans-input").val() as number;
            if (page && page > this.pageUtil.totalPage) {
                page = this.pageUtil.totalPage;
                $("#trans-input").val(this.pageUtil.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#trans-input").val(1);
            }
            if (gopage) {
                this.pageUtil.currentPage = page;
                this.updateAddrTrasctions(address, this.pageUtil);
                $("#trans-input").val('');
            }
        }
        //跳转页面
        public doUtxoGoPage(address:string,gopage: boolean) {
            let page: number = $("#utxo-input").val() as number;
            if (page && page > this.pageUtilUtxo.totalPage) {
                page = this.pageUtilUtxo.totalPage;
                $("#utxo-input").val(this.pageUtilUtxo.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#utxo-input").val(1);
            }
            if (gopage) {
                this.pageUtilUtxo.currentPage = page;
                this.updateAddrUTXO(address, this.pageUtilUtxo)
                $("#utxo-input").val('');
            }
        }
        //AddressInfo视图
        loadAddressInfo(address: string, addrMsg: AddressMsg[])
        {
            let createdTime = DateTool.getTime(addrMsg[0].firstuse.blocktime.$date);
            //if (location.pathname == '/zh/') {
            //    let newDate = new Date();
            //    newDate.setTime(addrMsg[0].firstuse.blocktime.$date);
            //    createdTime = newDate.toLocaleString();
            //} 
            let totalTran = addrMsg[0].txcount;
            $("#address").text(address);
            $("#created").text(createdTime);
            $("#totalTran").text(totalTran);
            
        }

        loadView( balances: Balance[], nep5ofAddress: Nep5OfAddress[] )
        {
            $("#balance").empty();
            if (balances) {
                balances.forEach((balance: Balance) => {
                    var name = CoinTool.assetID2name[balance.asset];

                    let html = `
                <div class="line" > <div class="title-nel" > <span>` + name + ` </span></div >
                <div class="content-nel" > <span> ` + balance.balance + ` </span></div > </div>`;
                    $("#balance").append(html);
                });
            }

            if (nep5ofAddress)
            {
                nep5ofAddress.forEach((nep5ofAddress: Nep5OfAddress) => {
                    let html = `
                <div class="line" > <div class="title-nel" > <span>` + nep5ofAddress.symbol + ` </span></div >
                <div class="content-nel" > <span> ` + nep5ofAddress.balance + ` </span></div > </div>`;
                    $("#balance").append(html);
                })
            }
            if (!balances && !nep5ofAddress) {
                let html = `<div class="line"><div class="title-nel" style="width:100%;text-align:center;display: block;line-height: 56px;"><span>There is no data</span></div> </div>`;
                if (location.pathname == '/zh/') {
                    html = `<div class="line"><div class="title-nel" style="width:100%;text-align:center;display: block;line-height: 56px;"><span>没有数据</span></div> </div>`;
                }
                $("#balance").append(html);
            }
        }
        loadUTXOView(utxos: Utxo[])
        {
            $("#add-utxos").empty();
            if (utxos) {
                utxos.forEach((utxo: Utxo) => {
                    let html = `
                <tr>
                <td class='code'>` + CoinTool.assetID2name[utxo.asset] + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_self' href='`+ Url.href_transaction(utxo.txid) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`
                    $("#add-utxos").append(html);
                });
            }
        }

        initTranPage(transtotal: number,address: string) {
            if (transtotal > 10) {
                $("#trans-page-msg").show();
                $("#addr-trans-page").show();
            } else {
                $("#trans-page-msg").hide();
                $("#addr-trans-page").hide();
            }

            $("#trans-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                    $('#errMsg').modal('show');
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
            });
            $("#trans-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
            });
        }
        initUTXOPage(utxototal: number, address: string) {
            if (utxototal > 10) {
                $("#utxo-page-msg").show();
                $("#addr-utxo-page").show();
            } else {
                $("#utxo-page-msg").hide();
                $("#addr-utxo-page").hide();
            }

            $("#utxo-next").off("click").click(() => {
                if (this.pageUtilUtxo.currentPage == this.pageUtilUtxo.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtilUtxo.currentPage += 1;
                    this.updateAddrUTXO(address, this.pageUtilUtxo)
                }
            });
            $("#utxo-previous").off("click").click(() => {
                if (this.pageUtilUtxo.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtilUtxo.currentPage -= 1;
                    this.updateAddrUTXO(address, this.pageUtilUtxo)
                }
            });
        }

        //更新交易记录
        public async updateAddrTrasctions(address:string, pageUtil: PageUtil) {
            $("#addr-trans").empty();
            //分页查询交易记录
            let txlist: TransOfAddress[] = await WWW.getaddrsesstxs(address, pageUtil.pageSize, pageUtil.currentPage);
            let listLength = 0;
            if (txlist) {
                if (txlist.length < 10) {
                    listLength = txlist.length;
                } else {
                    listLength = pageUtil.pageSize;
                }
                for (var n = 0; n < listLength; n++) {
                    let txid = txlist[n].txid;
                    let time = DateTool.getTime(txlist[n].blocktime.$date);
                    //if (location.pathname == '/zh/') {
                    //    let newDate = new Date();
                    //    newDate.setTime(txlist[n].blocktime.$date);
                    //    time = newDate.toLocaleString();
                    //}
                    let html: string = await this.getAddrTransLine(txid, txlist[n].type, time, txlist[n].vin, txlist[n].vout);
                    $("#addr-trans").append(html);
                }
            } else {
                let html = `<div class="line" style="text-align:center;padding:16px;font-size:16px;">There is no data</div>`;
                if (location.pathname == '/zh/') {
                    html = `<div class="line" style="text-align:center;padding:16px;font-size:16px;">没有数据</div>`;
                }
                $("#addr-trans").append(html);
            }

            //let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            //let maxNum = pageUtil.totalCount;
            //let diffNum = maxNum - minNum;
            //if (diffNum > 10) {
            //    maxNum = pageUtil.currentPage * pageUtil.pageSize;
            //}
            //let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            let pageMsg = "Page " + pageUtil.currentPage + " , " + pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + pageUtil.currentPage + " 页，共 " + pageUtil.totalPage + " 页"
            }
            $("#trans-page-msg").html(pageMsg);
            if (pageUtil.totalPage - pageUtil.currentPage) {
                $("#trans-next").removeClass('disabled');
            } else {
                $("#trans-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#trans-previous").removeClass('disabled');
            } else {
                $("#trans-previous").addClass('disabled');
            }
        }

        //更新UTXO记录
        public async updateAddrUTXO(address: string, pageUtil: PageUtil) {
            $("#add-utxos").empty();
            //分页查询交易记录
            let utxolist: Utxo[] = await WWW.api_getUTXO(address, pageUtil.pageSize, pageUtil.currentPage);
            let listLength = 0;
            if (utxolist) {
                if (utxolist.length < 10) {
                    listLength = utxolist.length;
                } else {
                    listLength = pageUtil.pageSize;
                }
                this.loadUTXOView(utxolist);
            }

            //let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            //let maxNum = pageUtil.totalCount;
            //let diffNum = maxNum - minNum;
            //if (diffNum > 10) {
            //    maxNum = pageUtil.currentPage * pageUtil.pageSize;
            //}
            //let pageMsg = "UTXO " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            let pageMsg = "Page " + pageUtil.currentPage + " , " + pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + pageUtil.currentPage + " 页，共 " + pageUtil.totalPage + " 页"
            }
            $("#utxo-page-msg").html(pageMsg);
            if (pageUtil.totalPage - pageUtil.currentPage) {
                $("#utxo-next").removeClass('disabled');
            } else {
                $("#utxo-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#utxo-previous").removeClass('disabled');
            } else {
                $("#utxo-previous").addClass('disabled');
            }
        }

        async getAddrTransLine(txid: string, type: string, time: string, vins, vouts) {
            var id = txid.replace('0x', '');
            id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
            return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
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
                let href = Url.href_address(vins.address);
                let addrStr = '';
                if (vins.address == myAddress) {
                    addrStr = `<div class="address"><a class="color-FDBA27">` + vins.address + `</a></div>`
                } else {
                    addrStr = `<div class="address"><a href="` + href +`" target="_self">` + vins.address + `</a></div>`
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
                let href = Url.href_address(vout.address);
                let addrStr = '';
                if (vout.address == myAddress) {
                    addrStr = `<div class="address"><a class="color-FDBA27">` + vout.address + `</a></div>`
                } else {
                    addrStr = `<div class="address"><a href="` + href +`" target="_self">` + vout.address + `</a></div>`
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