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
        balancePage: boolean;
        currentPage: number;
        pageUtil: PageUtil;
        rankPageUtil: PageUtil;
        async start()
        {
            var nep5id = locationtool.getParam();
            let href = locationtool.getUrl() + "/assets";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all assets</a>';
            $("#goallasset").empty();
            $("#goallasset").append(html);
            this.loadNep5InfoView(nep5id);
            
            var rankcount = await WWW.api_getrankbyassetcount(nep5id);
            this.rankPageUtil = new PageUtil(rankcount[0].count, 10);
            this.updateAssetBalanceView(nep5id, this.rankPageUtil);

            var assetType = locationtool.getType();
            if (assetType == 'nep5') {
                //$(".asset-nep5-warp").show();
                let count = await WWW.api_getnep5count('asset', nep5id);
                this.pageUtil = new PageUtil(count[0].nep5count, 10);
                this.updateNep5TransView(nep5id, this.pageUtil);
                $(".asset-tran-warp").show();
            } else {
                //$(".asset-nep5-warp").hide();
                $(".asset-tran-warp").hide();
            }

            //排行翻页
            $("#assets-balance-next").off("click").click(() => {
                if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
                    this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
                } else {
                    this.rankPageUtil.currentPage += 1;
                    this.updateAssetBalanceView(nep5id, this.rankPageUtil);
                }
            });
            $("#assets-balance-previous").off("click").click(() => {
                if (this.rankPageUtil.currentPage <= 1) {
                    this.rankPageUtil.currentPage = 1;
                } else {
                    this.rankPageUtil.currentPage -= 1;
                    this.updateAssetBalanceView(nep5id, this.rankPageUtil);
                }
            });
            //交易翻页
            $("#assets-tran-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateNep5TransView(nep5id, this.pageUtil);
                }
            });
            $("#assets-tran-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateNep5TransView(nep5id, this.pageUtil);
                }
            });

            this.div.hidden = false;
            this.footer.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        //nep5的详情
        loadNep5InfoView(nep5id: string)
        {           
            WWW.api_getnep5(nep5id).then((data) =>
            {
                var nep5 = data[0];
                $("#name").text(nep5.name);
                $("#asset-info-type").text("Nep5");
                $("#id").text(nep5.assetid);
                $("#available").text(nep5.totalsupply);
                $("#precision").text(nep5.decimals);
                $("#admin").text("-");                
            })
        }

        async updateAssetBalanceView(nep5id: string, pageUtil: PageUtil) {
            let balanceList = await WWW.getrankbyasset(nep5id, pageUtil.pageSize, pageUtil.currentPage);
            $("#assets-balance-list").empty();

            if (balanceList)
            {
                let rank = (pageUtil.currentPage-1)*10 +1;
                balanceList.forEach((item) => {
                    let href = Url.href_address(item.addr);
                    this.loadAssetBalanceView(rank, href, item.addr, item.balance);
                    rank++;
                });
            }
            else
            {
                let html = `<tr><td colspan="3" >There is no data</td></tr>`;
                $("#assets-balance-list").append(html);
                if (pageUtil.currentPage == 1) {
                    $(".asset-balance-page").hide();
                } else {
                    $("#assets-balance-next").addClass('disabled');
                    $(".asset-balance-page").show();
                }
            }
            if (pageUtil.totalCount > 10)
            {
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#assets-balance-next").removeClass('disabled');
                } else {
                    $("#assets-balance-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#assets-balance-previous").removeClass('disabled');
                } else {
                    $("#assets-balance-previous").addClass('disabled');
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 10) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "Banlance Rank " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#assets-balance-msg").html(pageMsg);
                $(".asset-balance-page").show();
            }
            else
            {
                $(".asset-balance-page").hide();
            }
        }

        async updateNep5TransView(nep5id: string, pageUtil: PageUtil) {
            let tranList: TransOfAsset[] = await WWW.api_getnep5transfersbyasset(nep5id, pageUtil.pageSize, pageUtil.currentPage);
            $("#assets-tran-list").empty();
            if (tranList) {
                tranList.forEach((item) => {
                    if (!item.from) {
                        item.from = '-'
                    }
                    if (!item.to) {
                        item.to = '-'
                    }
                    this.loadAssetTranView(item.txid, item.from, item.to, item.blockindex);
                })
            } else {
                let html = `<tr><td colspan="4" >There is no data</td></tr>`;
                $("#assets-tran-list").append(html);
                if (pageUtil.currentPage == 1) {
                    $(".asset-tran-page").hide();
                } else {
                    $(".asset-tran-page").show();
                }
            }

            if (pageUtil.totalCount > 10) {
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#assets-tran-next").removeClass('disabled');
                } else {
                    $("#assets-tran-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#assets-tran-previous").removeClass('disabled');
                } else {
                    $("#assets-tran-previous").addClass('disabled');
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 10) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#assets-tran-msg").html(pageMsg);
                $(".asset-tran-page").show();
            } else {
                $(".asset-tran-page").hide();
            }

            
        }

        loadAssetTranView(txid:string,from:string,to:string,blockindex:number)
        {
            let html = `
                    <tr>
                    <td><a class="code omit" href="`+ Url.href_transaction(txid) + `" target="_self">` + txid.replace('0x', '') + `
                    </a></td>
                    <td>` + from + `
                    </td>
                    <td>` + to + `
                    </td>
                    <td>` + blockindex + `</td>
                    </tr>`
            $("#assets-tran-list").append(html);            
        }


        loadAssetBalanceView(rank:number,href:string,address:string,balance:number) {
            let html = `
                    <tr>
                    <td>` + rank + `
                    </td>
                    <td><a target="_self" href="`+ href + `">` + address + `
                    </a></td>
                    <td>` + balance + `</td>
                    </tr>`
            $("#assets-balance-list").append(html);
        }
    }
}