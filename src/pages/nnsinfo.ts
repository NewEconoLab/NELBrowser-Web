namespace WebBrowser
{
    export class NNSInfo implements Page
    {
        div: HTMLDivElement = document.getElementById("domain-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        domainDetail: DomainInfo;
        private pageUtil: PageUtil;
        private rankpageUtil: PageUtil;
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
                    this.domainInfoInit(this.domainDetail.auctionId, false);                    
                }
            });
            $("#domainHistory-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.domainInfoInit(this.domainDetail.auctionId, false);  
                }
            });
            $("#domainRank-next").off("click").click(() => {
                if (this.rankpageUtil.currentPage == this.pageUtil.totalPage) {
                    this.rankpageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.rankpageUtil.currentPage += 1;
                    this.getDomainRank(this.domainDetail.auctionId, false);
                }
            });
            $("#domainRank-previous").off("click").click(() => {
                if (this.rankpageUtil.currentPage <= 1) {
                    this.rankpageUtil.currentPage = 1;
                } else {
                    this.rankpageUtil.currentPage -= 1;
                    this.getDomainRank(this.domainDetail.auctionId, false);
                }
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        //语言切换
        languageToggle() {
            //let status = '';
            let arr: Array<string> = [];
            arr[0] = "Domain name";
            arr[1] = "Txid";
            arr[2] = "Auction start time";
            arr[3] = "Estimated end time";
            arr[4] = "Highest bid";
            arr[5] = "Bidder";
            arr[6] = "Status";
            arr[7] = "Auction-starting block";
            arr[8] = "Auction end time";
            arr[9] = "Hammer price";
            arr[10] = "Owner";
            arr[11] = "Expiration date";
            arr[12] = `<p>The auction period is the first stage of the auction and its duration is 3 days, during which all bids are valid. An overtime bidding of up to 2 days will be triggered when someone bids on the last day of the auction period. Otherwise the auction ends at the end of the auction period.</p>
                        <p>The overtime bidding is the second stage of the auction. Its maximum duration is 2 days. During this period, any bid may trigger the end of the bidding of this domain and the bid will be invalid. The latter one bids, the more likely it triggers the end of the bidding. So it's advised to place a bid as early as possible to avoid missing this domain. </p>`

            if (location.pathname == '/zh/') {
                arr[0] = "域名";
                arr[1] = "交易ID";
                arr[2] = "竞拍开始时间";
                arr[3] = "预计结束时间";
                arr[4] = "当前最高价";
                arr[5] = "竞标人";
                arr[6] = "状态";
                arr[7] = "开标所属区块";
                arr[8] = "竞拍结束时间";
                arr[9] = "成交价";
                arr[10] = "中标人";
                arr[11] = "域名过期时间";
                arr[12] = `<p>确定期为竞拍第一阶段，时长为3天，此期间所有的出价都有效。当确定期最后一天有人出价时将触发最大时长为2天的随机期。否则竞拍即在确定期结束。</p>
                        <p>随机期为竞拍第二阶段，最大时长为2天，此期间任意一个出价都有可能触发该域名竞拍的结束从而出价无效，越靠后的出价触发结束的可能性越大，因此请尽早出价以免错失该域名。</p>`;
            }
            return arr;
        }

        //加载域名信息详情
        async queryDomain(domainname: string )
        {
            $("#domaininfo-msg").empty();
            let html = '';
            let res = await WWW.apiaggr_getauctioninfo(domainname);
            if (!res) {
                html = `<div class="line" style="text-align: center;padding: 16px;font-size: 16px;color:#fff;"><span>There is no data </span></div>`;
                if (location.pathname == '/zh/') {
                    html = `<div class="line" style="text-align: center;padding: 16px;font-size: 16px;color:#fff;"><span>没有数据</span></div>`;
                }
                $("#domaininfo-msg").append(html);
                this.getDomainRank("", true);
                this.domainInfoInit("", true); 
                return false;
            }
            this.domainDetail = res[0] as DomainInfo;
            console.log(this.domainDetail)
            this.domainInfoInit(this.domainDetail.auctionId, true);
            this.getDomainRank(this.domainDetail.auctionId, true);
            let strArr = this.languageToggle();
            /**域名详情start*/
            //开标时间
            let startTime = '';
            if (this.domainDetail.startTime.blocktime != 0) {
                startTime = DateTool.getTime(this.domainDetail.startTime.blocktime);
            } else {
                startTime = 'Unknown';
                if (location.pathname == '/zh/') {
                    startTime = '未知';
                }
            }
            //预计竞拍结束时间
            let endTime = '';
            if (this.domainDetail.endTime.blocktime != 0) {
                endTime = DateTool.getTime(this.domainDetail.endTime.blocktime);
            } else {
                endTime = 'Unknown';
                if (location.pathname == '/zh/') {
                    endTime = '未知';
                }
            }
            //过期时间
            let expireTime = '';
            if (this.domainDetail.ttl != 0) {
                expireTime = DateTool.getTime(this.domainDetail.ttl);
            } else {
                expireTime = 'Unknown';
                if (location.pathname == '/zh/') {
                    expireTime = '未知';
                }
            }
            let hrefblock = Url.href_transaction(this.domainDetail.startTime.blockindex.toString()); //区块高度的链接
            let hrefaddr = Url.href_address(this.domainDetail.maxBuyer);
                
            let imgIcon = '';
            if (this.domainDetail.auctionState == "0201" || this.domainDetail.auctionState == "0301") {
                
                switch (this.domainDetail.auctionState) {
                    case '0201':
                        imgIcon = `<div class="hint-box">
                                <div class="hint-msg">
                                    <div class="hint-img">
                                        <img src="../../img/notice-g.png" alt="">
                                    </div>
                                    <div class="hint-content">  
                                        ${strArr[12]}
                                    </div>
                                </div>
                            </div>`;
                        status = `<span style="color:#2DDE4F">Auction period</span>${imgIcon}`;
                        if (location.pathname == '/zh/') {
                            status = `<span style="color:#2DDE4F">确定期</span>${imgIcon}`;
                        }
                            
                        break;
                    case '0301':
                        imgIcon = `<div class="hint-box">
                                <div class="hint-msg">
                                    <div class="hint-img">
                                        <img src="../../img/notice-b.png" alt="">                              
                                    </div>
                                    <div class="hint-content">  
                                        ${strArr[12]}
                                    </div>
                                </div>
                            </div>`;
                        status = `<span style="color:#2DDE4F">Overtime bidding</span>${imgIcon}`;
                        if (location.pathname == '/zh/') {
                            status = `<span style="color:#2DDE4F">随机期</span>${imgIcon}`;
                        }
                            
                        break;
                }
                let tips = "  ( This end time is uncertain. Please bid early to avoid missing domain names. )";
                if (location.pathname == '/zh/') {
                    tips = " ( 结束时间并不是确定的，为了避免您错失想要的域名，请尽早出价。 )";
                }

                html = `<div class="line"><div class="title-nel"><span>` + strArr[0] + `</span></div> <div class="content-nel"><span>` + this.domainDetail.fulldomain + `</span></div></div>
                        <div class="line"><div class="title-nel"><span>`+ strArr[1] + `</span></div> <div class="content-nel"><span>` + this.domainDetail.auctionId + `</span></div></div>
                        <div class="line"><div class="title-nel"><span>`+ strArr[2] + `</span></div> <div class="content-nel"><span>` + startTime + `</span></div></div>
                        <div class="line"><div class="title-nel"><span>`+ strArr[3] + `</span></div><div class="content-nel"><span style="white-space: nowrap;">` + endTime + tips + `</span></div></div>
                        <div class="line"><div class="title-nel"><span>`+ strArr[4] + `</span></div><div class="content-nel"><span>` + this.domainDetail.maxPrice + `</span></div></div>
                        <div class="line"><div class="title-nel"><span>`+ strArr[5] + `</span></div><div class="content-nel"><span><a href="` + hrefaddr + `">` + this.domainDetail.maxBuyer + `</a></span></div></div>
                        <div class="line"><div class="title-nel"><span>`+ strArr[6] + `</span></div><div class="content-nel">` + status + `</div></div>
                        <div class="line"><div class="title-nel"><span style="font-size:14px;">`+ strArr[7] + `</span></div><div class="content-nel"><span><a href="` + hrefblock + `">` + this.domainDetail.startTime.blockindex + `</a></span></div></div>`;
            }
            else {
                html = `<div class="line"><div class="title-nel"><span>` + strArr[0] + `</span></div> <div class="content-nel"><span>` + this.domainDetail.fulldomain + `</span></div></div>
                <div class="line"><div class="title-nel"><span>` + strArr[1] + `</span></div> <div class="content-nel"><span>` + this.domainDetail.auctionId +`</span></div></div>
                <div class="line"><div class="title-nel"><span>` + strArr[2] + `</span></div> <div class="content-nel"><span>` + startTime + `</span></div></div>
                <div class="line"><div class="title-nel"><span>` + strArr[8] + `</span></div><div class="content-nel"><span>` + endTime + `</span></div></div>
                <div class="line"><div class="title-nel"><span>` + strArr[9] + `</span></div><div class="content-nel"><span>` + this.domainDetail.maxPrice + `</span></div></div>
                <div class="line"><div class="title-nel"><span>` + strArr[10] + `</span></div><div class="content-nel"><span><a href="` + hrefaddr + `">` + this.domainDetail.maxBuyer + `</a></span></div></div>
                <div class="line"><div class="title-nel"><span>` + strArr[11] + `</span></div><div class="content-nel"><span>` + expireTime + `</span></div></div>
                <div class="line"><div class="title-nel"><span style="font-size:14px;">` + strArr[7] + `</span></div><div class="content-nel"><span><a href="` + hrefblock + `">` + this.domainDetail.startTime.blockindex + `</a></span></div></div>`;
            }
            $("#domaininfo-msg").append(html);
        }
        //加载域名竞拍金额排名
        async getDomainRank(domainid: string, first: boolean) {
            $("#auctionRank").empty();
            let domain: DomainPriceRank;
            if (!first) {  //判断是否为初始加载
                domain = await WWW.apiaggr_getauctioninfoRank(domainid, this.rankpageUtil.currentPage, this.rankpageUtil.pageSize) as DomainPriceRank;
            } else {     //初始加载
                domain = await WWW.apiaggr_getauctioninfoRank(domainid, 1, 10) as DomainPriceRank;
                if (domain) {
                    this.rankpageUtil = new PageUtil(domain[0].count, 10);
                }
            }            
            if (domain && domain[0].list.length != 0) {
                this.loadDomainRankView(domain[0].list);

                if (domain[0].count < 10) {
                    $("#domainRank-page").hide();
                } else {
                    $("#domainRank-next").addClass('disabled');
                    $("#domainRank-page").show();
                }
            }
            else {
                let html = `<tr><td colspan="5">There is no data</td></tr>`;
                if (location.pathname == '/zh/') {
                    html = `<tr><td colspan="5">没有数据</td></tr>`;
                }
                $("#domainRank-page").hide();
                $("#auctionRank").append(html);
                return
            }

            let minNum = this.rankpageUtil.currentPage * this.rankpageUtil.pageSize - this.rankpageUtil.pageSize;
            let maxNum = this.rankpageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 10) {
                maxNum = this.rankpageUtil.currentPage * this.rankpageUtil.pageSize;
            }
            let pageMsg = "Bid rank " + (minNum + 1) + " to " + maxNum + " of " + this.rankpageUtil.totalCount;
            $("#domainRank-page").find("#domainRank-msg").html(pageMsg);
            if (this.rankpageUtil.totalPage - this.rankpageUtil.currentPage) {
                $("#domainRank-next").removeClass('disabled');
            } else {
                $("#domainRank-next").addClass('disabled');
            }
            if (this.rankpageUtil.currentPage - 1) {
                $("#domainRank-previous").removeClass('disabled');
            } else {
                $("#domainRank-previous").addClass('disabled');
            }

        }

        //加载域名操作详情
        async domainInfoInit(id: string, first: boolean) {
            $("#auctionInfo").empty();
            let domain: DomainInfoHistory;
            if (!first) {  //判断是否为初始加载
                domain = await WWW.apiaggr_getauctioninfoTx(id, this.pageUtil.currentPage, this.pageUtil.pageSize) as DomainInfoHistory;
            } else {     //初始加载
                domain = await WWW.apiaggr_getauctioninfoTx(id, 1, 10) as DomainInfoHistory;
                if (domain) {
                    this.pageUtil = new PageUtil(domain[0].count, 10);
                }
            }
            if (domain && domain[0].list.length!=0) {
                this.loadDomainView(domain[0].list);

                if (domain[0].count <= 11) {
                    $("#domainHistory-page").hide();
                } else {
                    $("#domainHistory-next").addClass('disabled');
                    $("#domainHistory-page").show();
                }
            }
            else {
                let html = `<tr><td colspan="6">There is no data</td></tr>`;
                if (location.pathname == '/zh/') {
                    html = `<tr><td colspan="6">没有数据</td></tr>`;
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
        //加载竞拍信息
        public loadDomainView(bidHistory) {
            console.log(bidHistory)
            bidHistory.forEach((domain) => {
                let bidTime = '';
                if (domain.time != 0) {
                    bidTime = DateTool.getTime(domain.time);
                } else {
                    bidTime = 'Unknown';
                    if (location.pathname == '/zh/') {
                        bidTime = '未知';
                    }
                }                               
                
                let type = '';
                switch (domain.type) {
                    case '500301':
                        type = "Open Auction";
                        if (location.pathname == '/zh/') {
                            type = "开标";
                        }
                        break;
                    case '500302':
                        type = "Raise Bid";
                        if (location.pathname == '/zh/') {
                            type = "加价";
                        }
                        break;
                    case '500303':
                        let strTip = '<p>This bid triggered the closing of the domain auction and was not successful.</p>';
                        if (location.pathname == '/zh/') {
                            strTip = "<p>此次出价触发竞拍结束，出价失败。</p>";
                        }
                        let imgIcon = `<div class="hint-box">
                                <div class="hint-msg">
                                    <div class="hint-img">
                                        <img src="../../img/notice-g.png" alt="">
                                    </div>
                                    <div class="hint-content hint-width">
                                        ${strTip}
                                    </div>
                                </div>
                            </div>`;
                        type = "End of Auction" + imgIcon;
                        if (location.pathname == '/zh/') {
                            type = "竞拍结束" + imgIcon;
                        }
                        break;
                    case '500304':
                        type = "Recover SGas";
                        if (location.pathname == '/zh/') {
                            type = "领回SGas";
                        }
                        break;
                    case '500305':
                        type = "Get Domain";
                        if (location.pathname == '/zh/') {
                            type = "领取域名";
                        }
                        break;
                }
                let hreftxid = Url.href_transaction(domain.txid);
                let txid = domain.txid.substring(0, 4) + '...' + domain.txid.substring(domain.txid.length - 4);
                let addr = "null";
                if (!!domain.address) {
                    let hrefaddr = Url.href_address(domain.address);
                    let address = domain.address.substring(0, 4) + '...' + domain.address.substring(domain.address.length - 4);
                    addr = `<a href="` + hrefaddr + `" target="_self">` + address + `</a>`
                }               
                
                let html = `
                        <tr>
                        <td> <a href="`+ hreftxid + `" target="_self">` + txid + `</a></td>
                        <td>` + type + `</td>
                        <td>` + addr + `</td>
                        <td>` + domain.amount + ` SGas` + `</td>
                        <td>` + bidTime + `</td>
                        </tr>`;
                $('#auctionInfo').append(html);
            });
        }
        //加载竞拍排名
        public loadDomainRankView(bidRank) {
            bidRank.forEach((domain) => {
                let hrefaddr = Url.href_address(domain.address);
                let html = `
                        <tr>
                        <td>` + domain.range + `</td>
                        <td>` + domain.totalValue + ` SGas` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + domain.address + `</a></td>
                        </tr>`;
                $('#auctionRank').append(html);
            });
        }
    }
}