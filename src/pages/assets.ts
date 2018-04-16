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
        private pageUtil: PageUtil;
        private assetlist: JQuery<HTMLElement>;
        private assets: Asset[];
        private nep5s: nep5Asset[];
        private assetType: string;
        constructor() {

            this.assetlist = $("#asset-page");
            //监听交易列表选择框
            $("#asset-TxType").change(() => {
                this.pageUtil.currentPage = 1;
                this.assetType = <string>$("#asset-TxType").val();
                if (this.assetType == "Assets") {
                    this.pageUtil = new PageUtil(this.assets.length, 15);
                    this.pageUtil.currentPage = 1;
                    if (this.assets.length > 15) {
                        this.updateAssets(this.pageUtil);
                        this.assetlist.find(".page").show();
                    } else {
                        this.loadAssetView(this.assets);
                        let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                } else if (this.assetType == "Nep5") {
                    this.pageUtil = new PageUtil(this.nep5s.length, 15);
                    this.pageUtil.currentPage = 1;
                    if (this.nep5s.length > 15) {
                        this.updateNep5s(this.pageUtil);
                        this.assetlist.find(".page").show();
                    } else {
                        this.loadNep5View(this.nep5s);
                        let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                }
            });

            this.assetlist.find("#next").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                    return;
                } else {
                    this.pageUtil.currentPage += 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    } else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });
            this.assetlist.find("#previous").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                    return;
                } else {
                    this.pageUtil.currentPage -= 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    } else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });

        }
        //更新asset表格
        public async updateAssets(pageUtil: PageUtil) {
            $("#asset-page").find("#asset-page-msg").html("");
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            let arrAsset = new Array();
            for (let i = minNum; i < maxNum;i++) {
                arrAsset.push(this.assets[i]);
            }
            this.loadAssetView(arrAsset);

            let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#asset-page").find("#asset-page-msg").html(pageMsg);
        }

        //更新asset表格
        public async updateNep5s(pageUtil: PageUtil) {
            $("#asset-page").find("#asset-page-msg").html("");
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum =  maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            } else {
                maxNum = pageUtil.totalCount;
            }
            let arrNep5s = new Array();
            for (let i = minNum; i < maxNum; i++) {
                arrNep5s.push(this.nep5s[i]);
            }
            this.loadNep5View(arrNep5s);

            let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#asset-page").find("#asset-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#asset-page").find("#next").removeClass('disabled');
            } else {
                $("#asset-page").find("#next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#asset-page").find("#previous").removeClass('disabled');
            } else {
                $("#asset-page").find("#previous").addClass('disabled');
            }
        }

        async start()
        {
            $("#asset-TxType").val("Assets");
            this.assetType = <string>$("#asset-TxType").val();
            this.assets = await WWW.api_getAllAssets();
            this.pageUtil = new PageUtil(this.assets.length, 15);
            if (this.assets.length > 15) {
                this.updateAssets(this.pageUtil);
                this.assetlist.find(".page").show();
            } else {
                this.loadAssetView(this.assets);
                let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                $("#asset-page").find("#asset-page-msg").html(pageMsg);
                this.assetlist.find(".page").hide();
            }

            this.nep5s = await WWW.getallnep5asset();

            this.div.hidden = false;
        }
        
        /**
         * loadView 页面展现
         */
        public loadAssetView(assets: Asset[])
        {
            $( "#assets" ).empty();
            assets.forEach((asset: Asset) => {
                let href = Url.href_asset(asset.id);
                let html = `
                    <tr>
                    <td> <a href="`+ href + `">` + CoinTool.assetID2name[asset.id] + `</a></td>
                    <td>` + asset.type + `</td>
                    <td>` + (asset.amount <= 0 ? asset.available : asset.amount) + `</td>
                    <td>` + asset.precision + `</td>
                    </tr>`;
                $("#assets").append(html);
            });
        }

        public loadNep5View(nep5s: nep5Asset[]) {
            $("#assets").empty();
            nep5s.forEach((nep5s: nep5Asset) => {
                let href = Url.href_nep5(nep5s.assetid);
                let html = `
                    <tr>
                    <td> <a href="`+ href + `">` + nep5s.name + `</a></td>
                    <td> Nep5 </td>
                    <td>` + nep5s.totalsupply + `</td>
                    <td>` + nep5s.decimals + `</td>
                    </tr>`;
                $("#assets").append(html);
            });
        }
    }
}