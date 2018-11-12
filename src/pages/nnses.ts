namespace WebBrowser
{
    //资产页面管理器
    export class NNSevents implements Page
    {
        div: HTMLDivElement = document.getElementById("nns-page") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        gonnsBeing: HTMLAnchorElement = document.getElementById("gonnsBeing") as HTMLAnchorElement;
        gonnsRank: HTMLAnchorElement = document.getElementById("gonnsRank") as HTMLAnchorElement;
        sorttype: string;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        constructor() {
            let self = this;
            $("#inputDomain").on("keydown", function (e) {
                let domainname: string = $("#inputDomain").val() as string;
                if (e.keyCode == 13) {
                    self.seachDomainInfo(domainname);
                }                
            })
            $("#searchDomain").on("click", function () {
                let domainname: string = $("#inputDomain").val() as string;
                self.seachDomainInfo(domainname);
            })

            $("#sort-type").change(() => {
                this.sorttype = $("#sort-type option:selected").val() as string;
                this.getDomainList(this.sorttype);
            })
        }

        async start()
        {
            $("#inputDomain").val();
            $("#searchBox").hide();
            this.getStatistics();
            this.sorttype = $("#sortlist-type option:selected").val() as string;
            $("#sort-type").val(this.sorttype);
            $("#sortlist-type").val(this.sorttype);
            this.getDomainList(this.sorttype);
            this.getDomainRank();
            this.gonnsBeing.href = Url.href_nnsbeing();
            this.gonnsRank.href = Url.href_nnsrank();
            if (locationtool.getNetWork() == 'testnet')
                $("#searchPng").attr('src', '../../fonts/search.svg');
            else
                $("#searchPng").attr('src', '../../img/search-main.png');
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        //获取统计
        async getStatistics() {
            let res = await WWW.apiaggr_getstatistics();
            if (res) {
                $("#coninpool").html(res[0].bonus + " CGAS");
                $("#accumulated").html(res[0].profit + " CGAS");
                $("#useCount").html(res[0].usedDomainCount);
                $("#beingCount").html(res[0].auctingDomainCount);
            } else {
                $("#coninpool").html("0 CGAS");
                $("#accumulated").html("0 CGAS");
                $("#useCount").html("0");
                $("#beingCount").html("0");
            }
        }
        //语言切换
        languageToggle() {
            //let status = '';
            let arr: Array<string> = [];
            arr[0] = "Domain name";
            arr[1] = "Txid";
            arr[2] = "Hammer price";
            arr[3] = "Current owner";
            arr[4] = "Expiration date";
            arr[5] = "Highest bid";
            arr[6] = "Bidder";
            arr[7] = "Auction-starting block";
           
            if (location.pathname == '/zh/') {
                arr[0] = "域名";
                arr[1] = "交易ID";
                arr[2] = "成交价";
                arr[3] = "当前拥有者";
                arr[4] = "域名过期时间";
                arr[5] = "当前最高价";
                arr[6] = "竞标人";
                arr[7] = "状态";
            }

            return arr;
        }
        //检测输入域名是否合法
        checkDomainname(domainname:string) {
            let domain = domainname;
            if (/\.neo$/.test(domainname)) {
                domain = domain.substring(0, domain.length - 4);
            }
            else if (/\.test$/.test(domainname)) {
                domain = domain.substring(0, domain.length - 5);
            }
            else {
                return false;
            }
            if (domain.length >= 2 && domain.length <= 32) {
                return true;
            } else {
                return false;
            }
        }
        //查询域名
        async seachDomainInfo(domainname: string) {
            $("#domainInfo").empty();
            $("#domainMsg").empty();
            let checkResult = this.checkDomainname(domainname.toLocaleLowerCase());
            if (!checkResult) {
                let html = `<span style="font-size:16px">Domain names must be English characters or numbers, and can only be 2 to 32 characters in length.<br>Please don't forget to add ".neo"  suffix to the domain, e.g.“xxx.neo”</span>`;
                if (location.pathname == '/zh/') {
                    html = `<span style="font-size:16px">域名长度需要在2～32个字节之间，只能是字母和数字。请加上后缀，“例如：XXXXXX.neo”</span>`;
                }
                $("#domainMsg").append(html);
                $("#searchBox").show();
                return false;
            }
            
            let status = '';
            let html = '';            
            let strArr = this.languageToggle();
            let res = await WWW.apiaggr_searchbydomain(domainname.toLocaleLowerCase());
           
            if (!res) {
                let href = '';
                if (locationtool.getNetWork() == 'testnet')
                    href = "https://testwallet.nel.group/";
                else
                    href = "https://wallet.nel.group/";

                $("#domainMsg").html(domainname + " is available!");
                html = `<div style="text-align: center;margin-top:20px;">You can <a href="` + href + `" target="_blank">login</a> your wallet and start an auction!</div>`;
                if (location.pathname == '/zh/') {
                    $("#domainMsg").html(domainname + " 可以被竞拍!");
                    html = `<div style="text-align: center;margin-top:20px;">您可以 <a href="` + href + `" target="_blank">登陆</a> 您的钱包来竞拍此域名!</div>`;
                }
                $("#domainInfo").append(html);
                $("#searchBox").show();
                return false;
            }
            let domainInfo = res[0];

            if (domainInfo.auctionState == "0501" || domainInfo.auctionState == "0601") {//可开拍
                let href = '';
                if (locationtool.getNetWork() == 'testnet')
                    href = "https://testwallet.nel.group/";
                else
                    href = "https://wallet.nel.group/";

                $("#domainMsg").html(domainname + " is available!");
                html = `<div style="text-align: center;margin-top:20px;">You can <a href="` + href + `" target="_blank">login</a> your wallet and start an auction!</div>`;
                if (location.pathname == '/zh/') {
                    $("#domainMsg").html(domainname + " 可以被竞拍!");
                    html = `<div style="text-align: center;margin-top:20px;">您可以 <a href="` + href + `" target="_blank">登陆</a> 您的钱包来竞拍此域名!</div>`;
                }
            }
            else {//已经开拍过的
                let href = Url.href_nns(domainInfo.fulldomain);
                let hreftxid = Url.href_transaction(domainInfo.auctionId);
                let hrefaddr = Url.href_address(domainInfo.maxBuyer);
                if (domainInfo.auctionState == "0201" || domainInfo.auctionState == "0301") {
                    switch (domainInfo.auctionState) {
                        case '0201':
                            status = "Auction period";
                            if (location.pathname == '/zh/') {
                                status = '确定期';
                            }
                            break;
                        case '0301':
                            status = "Overtime bidding";
                            if (location.pathname == '/zh/') {
                                status = '随机期';
                            }
                            break;
                    }
                    $("#domainMsg").html(domainInfo.fulldomain + " is being auctioned.");
                    if (location.pathname == '/zh/') {
                        $("#domainMsg").html(domainInfo.fulldomain + " 正在竞拍中。");
                    }
                    html = `<div class="list-line"><div class="line-title"><span>` + strArr[0] + `</span></div> <div class="line-content line-href"><a href="` + href + `">` + domainInfo.fulldomain + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ strArr[1] + `</span></div> <div class="line-content line-href"><a href="` + hreftxid + `">` + domainInfo.auctionId + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ strArr[5] + `</span></div> <div class="line-content"><span>` + domainInfo.maxPrice + ` CGAS</span></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ strArr[6] + `</span></div> <div class="line-content line-href"><a href="` + hrefaddr +`">` + domainInfo.maxBuyer + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ strArr[7] + `</span></div> <div class="line-content"><span>` + status + `</span></div></div>`;
                }
                else {
                    $("#domainMsg").html(domainInfo.fulldomain + " is already owned.");
                    if (location.pathname == '/zh/') {
                        $("#domainMsg").html(domainInfo.fulldomain + " 已经成交了。");
                    }
                    let endtime = '';
                    if (domainInfo["ttl"] != 0) {
                        endtime = DateTool.getTime(domainInfo["ttl"]);
                    } else {
                        endtime = 'Unknown';
                        if (location.pathname == '/zh/') {
                            endtime = '未知';
                        }
                    }
                    html = `<div class="list-line"><div class="line-title"><span>` + strArr[0] + `</span></div> <div class="line-content line-href"><a href="` + href + `">` + domainInfo["fulldomain"] + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ strArr[1] + `</span></div> <div class="line-content line-href"><a href="` + hreftxid + `">` + domainInfo["auctionId"] + `</a></div></div>
                            
                            <div class="list-line"><div class="line-title"><span>`+ strArr[3] + `</span></div> <div class="line-content line-href"><a href="` + hrefaddr +`">` + domainInfo["owner"] + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ strArr[4] + `</span></div> <div class="line-content"><span>` + endtime + `</span></div></div>`;
                }
            }
            $("#domainInfo").append(html);
            $("#searchBox").show();
            $("#inputDomain").val("")
        }
        //获取域名正在竞拍列表 默认时间排序
        async getDomainList(sorttype:string) {
            $("#domainBeingList").empty();
            let domain: DomainBiding;
            if (sorttype === 'Time') {
                domain = await WWW.apiaggr_getauctingdomain(1, 10) as DomainBiding;
            } else if (sorttype === 'Price') {
                domain = await WWW.apiaggr_getauctingdomainbymaxprice(1, 10) as DomainBiding;
            }
            
            if (!domain || domain[0].count == 0) {
                $("#domainBeing").hide();
                let msg = "There is no data";
                if (location.pathname == '/zh/') {
                    msg = '没有数据';
                }
                $("#domainBeing").hide();
                let html = `
                        <tr>
                        <td colspan="6">`+msg+ `</td>
                        </tr>`;
                $("#domainBeingList").append(html);
                return
            }
            if (domain[0].count < 10) {
                $("#domainBeing").hide();
            } else {
                $("#domainBeing").show();
            }
            if (domain) {
                let domainList = domain[0].list;
                domainList.forEach((domain) => {
                    let href = Url.href_nns(domain.fulldomain);
                    let hreftxid = Url.href_transaction(domain.lastTime.txid);
                    let hrefaddr = Url.href_address(domain.maxBuyer);
                    let txid = domain.lastTime.txid.substring(0, 4) + '...' + domain.lastTime.txid.substring(domain.lastTime.txid.length - 4);
                    let address = '';
                    if (domain.maxBuyer != '') {
                        address = domain.maxBuyer.substring(0, 4) + '...' + domain.maxBuyer.substring(domain.maxBuyer.length - 4);
                    }
                    let status = '';
                    switch (domain.auctionState) {
                        case '0401':
                            status = 'End';
                            if (location.pathname == '/zh/') {
                                status = '已结束';
                            }
                            break;
                        case '0201':
                            status = "Auction period";
                            if (location.pathname == '/zh/') {
                                status = '确定期';
                            }
                            break;
                        case '0301':
                            status = "Overtime bidding";
                            if (location.pathname == '/zh/') {
                                status = '随机期';
                            }
                            break;
                    }
                    let html = `
                        <tr>
                        <td> <a href="`+ href + `" target="_self">` + domain.fulldomain + `</a></td>
                        <td> <a href="`+ hreftxid + `" target="_self">` + txid + `</a></td>
                        <td>` + domain.maxPrice+` CGAS` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + address + `</a></td>
                        <td>` + status + `</td>
                        </tr>`;
                    $("#domainBeingList").append(html);
                });
            }
        }
        //获取域名价值列表
        async getDomainRank() {
            $("#domainUseList").empty();
            let rank: DomainBided = await WWW.apiaggr_getaucteddomain(1, 10) as DomainBided;
            if (!rank || rank[0].count == 0) {
                $("#domainUse").hide();
                let msg = "There is no data";
                if (location.pathname == '/zh/') {
                    msg = '没有数据';
                }
                $("#domainUse").hide();
                let html = `
                        <tr>
                        <td colspan="6">`+ msg + `</td>
                        </tr>`;
                $("#domainUseList").append(html);
                return
            }
            if (rank[0].count < 10) {
                $("#domainUse").hide();
            } else {
                $("#domainUse").show();
            }
            if (rank) {
                let rankList = rank[0].list;
                rankList.forEach((domain) => {
                    let endtime = '';
                    if (domain.ttl != "0") {
                        let time = parseFloat(domain.ttl);
                        endtime = DateTool.getTime(time);
                    } else {
                        endtime = 'Unknown';
                        if (location.pathname == '/zh/') {
                            endtime = '未知';
                        }
                    }
                    let href = Url.href_nns(domain.fulldomain);
                    let hreftxid = Url.href_transaction(domain.txid);
                    let hrefaddr = Url.href_address(domain.maxBuyer);
                    let txid = domain.lastTime.txid.substring(0, 4) + '...' + domain.lastTime.txid.substring(domain.lastTime.txid.length - 4);
                    let address = '';
                    if (domain.maxBuyer != '') {
                        address = domain.maxBuyer.substring(0, 4) + '...' + domain.maxBuyer.substring(domain.maxBuyer.length - 4);
                    }
                    
                    let html = `
                        <tr>
                        <td>` + domain.range + `</td>
                        <td> <a href="`+ href + `" target="_self">` + domain.fulldomain + `</a></td>
                        <td> <a href="`+ hreftxid + `" target="_self">` + txid + `</a></td>
                        <td>` + domain.maxPrice + ` CGAS` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + address + `</a></td>
                        <td>` + endtime + `</td>
                        </tr>`;
                    $("#domainUseList").append(html);
                });
            }
        }
    }
}