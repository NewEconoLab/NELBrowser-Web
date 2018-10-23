namespace WebBrowser
{
    //资产页面管理器
    export class Assets implements Page
    {
        div: HTMLDivElement = document.getElementById("asset-page") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
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
                        //let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
                        if (location.pathname == '/zh/') {
                            pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
                        }
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
                        //let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
                        if (location.pathname == '/zh/') {
                            pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
                        }
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                }
            });

            $("#asset-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    } else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });
            $("#asset-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    } else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });
            $("#asset-input").val('');
            $("#asset-input").off("input").on('input', () => {
                this.doGoPage(false)
            });
            $("#asset-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doGoPage(true);
                }
            });
            $("#asset-gopage").off("click").click(() => {
                this.doGoPage(true)
            });

        }
        //跳转页面
        public doGoPage(gopage: boolean) {
            let page: number = parseInt($("#asset-input").val() as string);
            if (page && page > this.pageUtil.totalPage) {
                page = this.pageUtil.totalPage;
                $("#asset-input").val(this.pageUtil.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#asset-input").val(1);
            }
            if (gopage) {
                this.pageUtil.currentPage = page;
                if (this.assetType == "Assets") {
                    this.updateAssets(this.pageUtil);
                } else if (this.assetType == "Nep5") {
                    this.updateNep5s(this.pageUtil);
                }
                $("#asset-input").val('');
            }
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

            //let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
            }
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

            //let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
            }
            $("#asset-page").find("#asset-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#asset-page-next").removeClass('disabled');
            } else {
                $("#asset-page-next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#asset-page-previous").removeClass('disabled');
            } else {
                $("#asset-page-previous").addClass('disabled');
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
                //let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
                if (location.pathname == '/zh/') {
                    pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
                }
                $("#asset-page").find("#asset-page-msg").html(pageMsg);
                this.assetlist.find(".page").hide();
            }

            this.nep5s = await WWW.getallnep5asset();

            this.div.hidden = false;
            this.footer.hidden = false;
        }        
        
        /**
         * loadView 页面展现
         */
        public loadAssetView(assets: Asset[])
        {
            $( "#assets" ).empty();
            assets.forEach((asset: Asset) => {
                let href = Url.href_asset(asset.id);
                let assetId = asset.id.substring(2, 6) + '...' + asset.id.substring(asset.id.length - 4);
                let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + CoinTool.assetID2name[asset.id] + `</a></td>
                    <td> <a href="`+ href + `" target="_self">` + assetId + `</a></td>
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
                let assetId =  nep5s.assetid.substring(2, 6) + '...' + nep5s.assetid.substring(nep5s.assetid.length-4) ;
                let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + nep5s.name + `</a></td>
                    <td> <a href="`+ href + `" target="_self">` + assetId + `</a></td>
                    <td> Nep5 </td>
                    <td>` + nep5s.totalsupply + `</td>
                    <td>` + nep5s.decimals + `</td>
                    </tr>`;
                $("#assets").append(html);
            });
        }
    }
}