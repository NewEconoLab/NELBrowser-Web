namespace WebBrowser
{
    //地址列表
    export class NNSAuction implements Page
    {
        div: HTMLDivElement = document.getElementById('nnsbeing-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        private pageUtil: PageUtil;

        /**
         * addrlistInit
         */
        public async domainListInit(first: boolean)
        {
            $("#domainBeingListPage").empty();
            let domain: DomainBiding;
            if (!first) {     //判断是否为初始加载               
                domain = await WWW.apiaggr_getauctingdomain(this.pageUtil.currentPage, this.pageUtil.pageSize) as DomainBiding;                
            } else {    //初始加载
                domain = await WWW.apiaggr_getauctingdomain(1, 15) as DomainBiding;                  
                if (domain) {
                    this.pageUtil = new PageUtil(domain[0].count, 15);
                }
            }

            if (domain) {
                this.loadView(domain[0].list);
                $("#nnsbeing-wrap").show();
                let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
                let maxNum = this.pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 15) {
                    maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
                }
                let pageMsg = "Live auctions " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
                $("#nnsbeing-page").find("#nnsbeing-page-msg").html(pageMsg);
                if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                    $("#nnsbeing-page-next").removeClass('disabled');
                } else {
                    $("#nnsbeing-page-next").addClass('disabled');
                }
                if (this.pageUtil.currentPage - 1) {
                    $("#nnsbeing-page-previous").removeClass('disabled');
                } else {
                    $("#nnsbeing-page-previous").addClass('disabled');
                }
            } else {
                let msg = "There is no data";
                if (location.pathname == '/zh/') {
                    msg = '没有数据';
                }
                let html = `
                        <tr>
                        <td colspan="6">`+ msg + `</td>
                        </tr>`;
                $('#domainBeingListPage').append(html);
                $("#nnsbeing-wrap").hide();
            }
        }
        /**
         * start
         */
        public async start()
        {
            await this.domainListInit(true);

            $("#nnsbeing-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.domainListInit(false);
                }
            });
            $("#nnsbeing-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.domainListInit(false);
                }
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        /**
         * loadView
         */
        public loadView(domainlist)
        {
            domainlist.forEach((domain) =>
            {
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
                        <td>` + domain.maxPrice + ` CGAS` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + address + `</a></td>
                        <td>` + status + `</td>
                        </tr>`;
                $( '#domainBeingListPage' ).append( html );
            } );
        }
    }
}