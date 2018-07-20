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
                let pageMsg = "Domain name being auctioned " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
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
                let hreftxid = Url.href_transaction(domain.txid);
                let hrefaddr = Url.href_address(domain.maxBuyer);
                let state = '';
                switch (domain.auctionState) {
                    case '0':
                        state = 'End';
                        if (location.pathname == '/zh/') {
                            state = '已结束';
                        }
                        break;
                    case '1':
                        state = "Fixed period";
                        if (location.pathname == '/zh/') {
                            state = '确定期';
                        }
                        break;
                    case '2':
                        state = "Random period";
                        if (location.pathname == '/zh/') {
                            state = '随机期';
                        }
                        break;
                }
                let html = `
                        <tr>
                        <td> <a href="`+ href + `" target="_self">` + domain.fulldomain + `</a></td>
                        <td> <a href="`+ hreftxid + `" target="_self">` + domain.txid + `</a></td>
                        <td>` + domain.maxPrice + ` SGas` + `</td>
                        <td><a href="`+ hrefaddr + `" target="_self">` + domain.maxBuyer + `</a></td>
                        <td>` + state + `</td>
                        </tr>`;
                $( '#domainBeingListPage' ).append( html );
            } );
        }
    }
}