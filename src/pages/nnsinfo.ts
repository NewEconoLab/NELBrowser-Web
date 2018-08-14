namespace WebBrowser
{
    export class NNSInfo implements Page
    {
        div: HTMLDivElement = document.getElementById("domain-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        domainDetail: DomainInfo;
        private pageUtil: PageUtil;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }

        start()
        {
            let domainname:string = locationtool.getParam();
            this.queryDomain(domainname);
            let html = '<a href="#" target="_self" onclick="javascript: window.history.go(-1);return false;">&lt&lt&ltGo Back</a>';
            if (location.pathname == '/zh/') {
                html = '<a href="#" target="_self" onclick="javascript: window.history.go(-1);return false;">&lt&lt&lt返回</a>';
            }
            $("#goBackDomain").empty();
            $("#goBackDomain").append(html);
            $("#domainHistory-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.domainInfoInit(this.domainDetail.id, false);                    
                }
            });
            $("#domainHistory-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.domainInfoInit(this.domainDetail.id, false);  
                }
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }

        async queryDomain(domainname: string )
        {
            $("#domaininfo-msg").empty();
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
            let str3 = "Auction start time";
            if (location.pathname == '/zh/') {
                str3 = "竞拍开始时间";
            }
            let str4 = "Estimated end time";
            if (location.pathname == '/zh/') {
                str4 = "预计结束时间";
            }
            let str5 = "Highest bid";
            if (location.pathname == '/zh/') {
                str5 = "当前最高价";
            }
            let str6 = "Bidder";
            if (location.pathname == '/zh/') {
                str6 = "竞标人";
            }
            let str7 = "Status";
            if (location.pathname == '/zh/') {
                str7 = "状态";
            }
            let str8 = "Included in block";
            if (location.pathname == '/zh/') {
                str8 = "区块高度";
            }
            let str9 = "Auction end time";
            if (location.pathname == '/zh/') {
                str9 = "竞拍结束时间";
            }
            let str10 = "Hammer price";
            if (location.pathname == '/zh/') {
                str10 = "成交价";
            }
            let str11 = "Owner";
            if (location.pathname == '/zh/') {
                str11 = "中标人";
            }
            let str12 = "Expiration date";
            if (location.pathname == '/zh/') {
                str12 = "域名过期时间";
            }
            let res = await WWW.apiaggr_getdomaininfo(domainname);
            if (!res) {
                html = `<div class="line" style="text-align: center;padding: 16px;font-size: 16px;color:#fff;"><span>There is no data </span></div>`;
                if (location.pathname == '/zh/') {
                    html = `<div class="line" style="text-align: center;padding: 16px;font-size: 16px;color:#fff;"><span>没有数据</span></div>`;
                }
                $("#domaininfo-msg").append(html);
                this.domainInfoInit("", true); 
                return false;
            }
            this.domainDetail = res[0] as DomainInfo;
            this.domainInfoInit(this.domainDetail.id, true);  
            if (this.domainDetail.auctionState) {
                //开标时间
                let startTime = '';
                if (this.domainDetail.startAuctionTime != "0") {
                    let time = parseFloat(this.domainDetail.startAuctionTime);
                    startTime = DateTool.getTime(time);
                    //if (location.pathname == '/zh/') {
                    //    let newDate = new Date();
                    //    newDate.setTime(time * 1000);
                    //    startTime = newDate.toLocaleString();
                    //}
                } else {
                    startTime = 'Unknown';
                    if (location.pathname == '/zh/') {
                        startTime = '未知';
                    }
                }
                //预计竞拍结束时间
                let endTime = '';
                if (this.domainDetail.endBlockTime != "0") {
                    let time = parseFloat(this.domainDetail.endBlockTime);
                    endTime = DateTool.getTime(time);
                    //if (location.pathname == '/zh/') {
                    //    let newDate = new Date();
                    //    newDate.setTime(time * 1000);
                    //    endTime = newDate.toLocaleString();
                    //}
                } else {
                    endTime = 'Unknown';
                    if (location.pathname == '/zh/') {
                        endTime = '未知';
                    }
                }
                //过期时间
                let expireTime = '';
                if (this.domainDetail.ttl != "0") {
                    let time = parseFloat(this.domainDetail.ttl);
                    expireTime = DateTool.getTime(time);
                    //if (location.pathname == '/zh/') {
                    //    let newDate = new Date();
                    //    newDate.setTime(time * 1000);
                    //    expireTime = newDate.toLocaleString();
                    //}
                } else {
                    expireTime = 'Unknown';
                    if (location.pathname == '/zh/') {
                        expireTime = '未知';
                    }
                }
                let hrefblock = Url.href_transaction(this.domainDetail.blockindex);
                let hrefaddr = Url.href_address(this.domainDetail.maxBuyer);
                if (this.domainDetail.auctionState != "0") {
                    switch (this.domainDetail.auctionState) {
                        case '1':
                            status = "Auction period";
                            if (location.pathname == '/zh/') {
                                status = '确定期';
                            }
                            break;
                        case '2':
                            status = "Overtime bidding";
                            if (location.pathname == '/zh/') {
                                status = '随机期';
                            }
                            break;
                    }
                    let tips = "  ( This end time is uncertain. Please bid early to avoid missing domain names. )";
                    if (location.pathname == '/zh/') {
                        tips = " ( 结束时间并不是确定的，为了避免您错失想要的域名，请尽早出价。 )";
                    }
                    
                    html = `<div class="line"><div class="title-nel"><span>` + str1 + `</span></div> <div class="content-nel"><span>` + this.domainDetail.domain + `</span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str2 + `</span></div> <div class="content-nel"><span>` + this.domainDetail.txid + `</span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str3 + `</span></div> <div class="content-nel"><span>` + startTime + `</span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str4 + `</span></div><div class="content-nel"><span style="white-space: nowrap;">` + endTime + tips + `</span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str5 + `</span></div><div class="content-nel"><span>` + this.domainDetail.maxPrice + `</span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str6 + `</span></div><div class="content-nel"><span><a href="` + hrefaddr + `">` + this.domainDetail.maxBuyer + `</a></span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str7 + `</span></div><div class="content-nel"><span>` + status + `</span></div></div>
                            <div class="line"><div class="title-nel"><span>`+ str8 + `</span></div><div class="content-nel"><span><a href="` + hrefblock + `">` + this.domainDetail.blockindex + `</a></span></div></div>`;
                }
                else {
                    html = `<div class="line"><div class="title-nel"><span>` + str1 + `</span></div> <div class="content-nel"><span>` + this.domainDetail.domain + `</span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str2 + `</span></div> <div class="content-nel"><span>` + this.domainDetail.txid + `</span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str3 + `</span></div> <div class="content-nel"><span>` + startTime + `</span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str9 + `</span></div><div class="content-nel"><span>` + endTime + `</span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str10 + `</span></div><div class="content-nel"><span>` + this.domainDetail.maxPrice + `</span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str11 + `</span></div><div class="content-nel"><span><a href="` + hrefaddr + `">` + this.domainDetail.maxBuyer + `</a></span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str12 + `</span></div><div class="content-nel"><span>` + expireTime + `</span></div></div>
                    <div class="line"><div class="title-nel"><span>` + str8 + `</span></div><div class="content-nel"><span><a href="` + hrefblock + `">` + this.domainDetail.blockindex + `</a></span></div></div>`;
                }
                
            }
            $("#domaininfo-msg").append(html);
        }

        async domainInfoInit(id: string, first: boolean) {
            $("#auctionInfo").empty();
            let domain: DomainInfoHistory;
            if (!first) {  //判断是否为初始加载
                domain = await WWW.apiaggr_getbiddetailbyauctionid(id, this.pageUtil.currentPage, this.pageUtil.pageSize) as DomainInfoHistory;
            } else {     //初始加载
                domain = await WWW.apiaggr_getbiddetailbyauctionid(id, 1, 10) as DomainInfoHistory;
                if (domain) {
                    this.pageUtil = new PageUtil(domain[0].count, 10);
                }
            }
            if (domain && domain[0].list.length!=0) {
                this.loadDomainView(domain[0].list);

                if (domain.count <= 11) {
                    $("#domainHistory-page").hide();
                } else {
                    $("#domainHistory-next").addClass('disabled');
                    $("#domainHistory-page").show();
                }
            }
            else {
                let html = `<tr><td colspan="5">There is no data</td></tr>`;
                if (location.pathname == '/zh/') {
                    html = `<tr><td colspan="5">没有数据</td></tr>`;
                }
                $("#domainHistory-page").hide();
                $("#auctionInfo").append(html);
                return
            }
            

            let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
            let maxNum = this.pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 10) {
                maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
            }
            let pageMsg = "Auction information " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
            $("#domainHistory-page").find("#domainHistory-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#domainHistory-next").removeClass('disabled');
            } else {
                $("#domainHistory-next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#domainHistory-previous").removeClass('disabled');
            } else {
                $("#domainHistory-previous").addClass('disabled');
            }

        }

        public loadDomainView(bidHistory) {
            bidHistory.forEach((domain) => {
                let bidTime = '';
                if (domain.addPriceTime != "0") {
                    let time = parseFloat(domain.addPriceTime);
                    bidTime = DateTool.getTime(time);
                    //if (location.pathname == '/zh/') {
                    //    let newDate = new Date();
                    //    newDate.setTime(time * 1000);
                    //    bidTime = newDate.toLocaleString();
                    //}
                } else {
                    bidTime = 'Unknown';
                    if (location.pathname == '/zh/') {
                        bidTime = '未知';
                    }
                }
                let hreftxid = Url.href_transaction(domain.txid);
                let hrefaddr = Url.href_address(domain.maxBuyer);
                let html = `
                        <tr>
                        <td> <a href="`+ hreftxid + `" target="_self">` + domain.txid + `</a></td>
                        <td>` + domain.maxPrice + ` SGas` + `</td>
                        <td>` + domain.raisebid + ` SGas` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + domain.maxBuyer + `</a></td>
                        <td>` + bidTime + `</td>
                        </tr>`;
                $('#auctionInfo').append(html);
            });
        }
    }
}