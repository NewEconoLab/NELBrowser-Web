namespace WebBrowser
{
    //资产页面管理器
    export class NNSevents implements Page
    {
        div: HTMLDivElement = document.getElementById("nns-page") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        gonnsBeing: HTMLAnchorElement = document.getElementById("gonnsBeing") as HTMLAnchorElement;
        gonnsRank: HTMLAnchorElement = document.getElementById("gonnsRank") as HTMLAnchorElement;
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
        }

        async start()
        {
            $("#inputDomain").val();
            $("#searchBox").hide();
            this.getStatistics();
            this.getDomainList();
            this.getDomainRank();
            this.gonnsBeing.href = Url.href_nnsbeing();
            this.gonnsRank.href = Url.href_nnsrank();
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        //获取统计
        async getStatistics() {
            let res = await WWW.apiaggr_getstatistics();
            if (res) {
                $("#coninpool").html(res[0].bonus + " SGas");
                $("#accumulated").html(res[0].profit + " SGas");
                $("#useCount").html(res[0].usedDomainCount);
                $("#beingCount").html(res[0].auctingDomainCount);
            } else {
                $("#coninpool").html("0 SGas");
                $("#accumulated").html("0 SGas");
                $("#useCount").html("0");
                $("#beingCount").html("0");
            }
        }
        //查询域名
        async seachDomainInfo(domainname:string) {
            //let domainname = $("#searchDomain").val();
            console.log("-----input domainname--------");
            console.log($("#inputDomain").val());
            console.log(domainname.indexOf(".neo"));
            if (domainname.indexOf(".neo") == -1) {
                domainname = domainname + ".neo";
            } 
            $("#domainInfo").empty();
            let status = '';
            let html = '';
            let str1 = "Domain name";
            if (location.pathname == '/zh/') {
                str1 = "域名";
            }
            let str2 = "Txid";
            if (location.pathname == '/zh/') {
                str2 = "交易ID";
            }
            let str3 = "Hammer price";
            if (location.pathname == '/zh/') {
                str3 = "成交价";
            }
            let str4 = "Owner";
            if (location.pathname == '/zh/') {
                str4 = "中标人";
            }
            let str5 = "Expire date";
            if (location.pathname == '/zh/') {
                str5 = "域名过期时间";
            }
            let str6 = "Highest bid";
            if (location.pathname == '/zh/') {
                str6 = "当前最高价";
            }
            let str7 = "Bidder";
            if (location.pathname == '/zh/') {
                str7 = "竞标人";
            }
            let str8 = "Status";
            if (location.pathname == '/zh/') {
                str8 = "状态";
            }
            let res = await WWW.apiaggr_getdomaininfo(domainname);
            console.log(res);
            if (!res) {
                return false;
            }
            let domainInfo: DomainInfo = res[0] as DomainInfo;
            console.log("-----------domaininfo------------------")
            console.log(domainInfo);
            if (domainInfo.auctionState) {
                let href = Url.href_nns(domainInfo.domain);
                let hreftxid = Url.href_transaction(domainInfo.txid);
                let hrefaddr = Url.href_address(domainInfo.maxBuyer);
                if (domainInfo.auctionState != "0") {
                    switch (domainInfo.auctionState) {
                        case '1':
                            status = "Fixed period";
                            if (location.pathname == '/zh/') {
                                status = '确定期';
                            }
                            break;
                        case '2':
                            status = "Random period";
                            if (location.pathname == '/zh/') {
                                status = '随机期';
                            }
                            break;
                    }
                    $("#domainMsg").html(domainInfo.domain + " is being auctioned.");
                    if (location.pathname == '/zh/') {
                        $("#domainMsg").html(domainInfo.domain + " 正在竞拍中。");
                    }
                    html = `<div class="list-line"><div class="line-title"><span>` + str1 + `</span></div> <div class="line-content line-href"><a href="` + href + `">` + domainInfo.domain + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str2 + `</span></div> <div class="line-content line-href"><a href="` + hreftxid + `">` + domainInfo.txid + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str6 + `</span></div> <div class="line-content"><span>` + domainInfo.maxPrice + `</span></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str7 + `</span></div> <div class="line-content line-href"><a href="` + hrefaddr +`">` + domainInfo.maxBuyer + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str8 + `</span></div> <div class="line-content"><span>` + status + `</span></div></div>`;
                }
                else {
                    $("#domainMsg").html(domainInfo.domain + " is already owned.");
                    if (location.pathname == '/zh/') {
                        $("#domainMsg").html(domainInfo.domain + " 已经成交了。");
                    }
                    let endtime = '';
                    if (domainInfo.ttl != "0") {
                        let time = parseFloat(domainInfo.ttl);
                        endtime = DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(time * 1000));
                        if (location.pathname == '/zh/') {
                            let newDate = new Date();
                            newDate.setTime(time * 1000);
                            endtime = newDate.toLocaleString();
                        }
                    } else {
                        endtime = 'Unknown';
                        if (location.pathname == '/zh/') {
                            endtime = '未知';
                        }
                    }
                    html = `<div class="list-line"><div class="line-title"><span>` + str1 + `</span></div> <div class="line-content line-href"><a>` + domainInfo.domain + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str2 + `</span></div> <div class="line-content line-href"><a>` + domainInfo.txid + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str3 + `</span></div> <div class="line-content"><span>` + domainInfo.maxPrice + `</span></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str4 + `</span></div> <div class="line-content line-href"><a>` + domainInfo.maxBuyer + `</a></div></div>
                            <div class="list-line"><div class="line-title"><span>`+ str5 + `</span></div> <div class="line-content"><span>` + endtime + `</span></div></div>`;
                }
            }
            else
            {
                let href = '';
                if (locationtool.getNetWork() == 'testnet')
                    href = "https://testwallet.nel.group/";
                else
                    href = "https://wallet.nel.group/";

                $("#domainMsg").html(domainname + " is available!");
                html = `<div style="text-align: center;margin-top:20px;">You can <a href="` + href +`" target="_blank">login</a> your wallet and start an auction!</div>`;
                if (location.pathname == '/zh/') {
                    $("#domainMsg").html(domainname + " 可以被竞拍!");
                    html = `<div style="text-align: center;margin-top:20px;">您可以<a href="` + href +`" target="_blank">登陆</a> 您的钱包来竞拍此域名!</div>`;
                }
            }
            $("#domainInfo").append(html);
            $("#searchBox").show();
            
        }
        //获取域名竞拍列表
        async getDomainList() {
            $("#domainBeingList").empty();
            let domain: DomainBiding = await WWW.apiaggr_getauctingdomain(1, 10) as DomainBiding;
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
                    let hreftxid = Url.href_transaction(domain.txid);
                    let hrefaddr = Url.href_address(domain.maxBuyer);
                    let status = '';
                    switch (domain.auctionState) {
                        case '0':
                            status = 'End';
                            if (location.pathname == '/zh/') {
                                status = '已结束';
                            }
                            break;
                        case '1':
                            status = "Fixed period";
                            if (location.pathname == '/zh/') {
                                status = '确定期';
                            }
                            break;
                        case '2':
                            status = "Random period";
                            if (location.pathname == '/zh/') {
                                status = '随机期';
                            }
                            break;
                    }
                    let html = `
                        <tr>
                        <td> <a href="`+ href + `" target="_self">` + domain.fulldomain + `</a></td>
                        <td> <a href="`+ hreftxid + `" target="_self">` + domain.txid + `</a></td>
                        <td>` + domain.maxPrice+` SGas` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + domain.maxBuyer + `</a></td>
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
                        endtime = DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(time * 1000));
                        if (location.pathname == '/zh/') {
                            let newDate = new Date();
                            newDate.setTime(time * 1000);
                            endtime = newDate.toLocaleString();
                        }
                    } else {
                        endtime = 'Unknown';
                        if (location.pathname == '/zh/') {
                            endtime = '未知';
                        }
                    }
                    let href = Url.href_nns(domain.fulldomain);
                    let hreftxid = Url.href_transaction(domain.txid);
                    let hrefaddr = Url.href_address(domain.maxBuyer);
                    
                    let html = `
                        <tr>
                        <td>` + domain.range + `</td>
                        <td> <a href="`+ href + `" target="_self">` + domain.fulldomain + `</a></td>
                        <td> <a href="`+ hreftxid + `" target="_self">` + domain.txid + `</a></td>
                        <td>` + domain.maxPrice + ` SGas` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + domain.maxBuyer + `</a></td>
                        <td>` + endtime + `</td>
                        </tr>`;
                    $("#domainUseList").append(html);
                });
            }
        }
    }
}