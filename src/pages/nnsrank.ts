namespace WebBrowser
{
    //地址列表
    export class NNSRank implements Page
    {
        div: HTMLDivElement = document.getElementById('nnsrank-page') as HTMLDivElement;
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
        public async domainRankListInit(first: boolean)
        {
            $("#domainUseListPage").empty();
            let domain: DomainBided;
            if (!first) {  //判断是否为初始加载
                domain = await WWW.apiaggr_getaucteddomain(this.pageUtil.currentPage, this.pageUtil.pageSize) as DomainBided;
            } else {     //初始加载
                domain = await WWW.apiaggr_getaucteddomain(1, 15) as DomainBided;
                if (domain) {
                    this.pageUtil = new PageUtil(domain[0].count, 15);
                }
            }
            if (domain) {
                this.loadView(domain[0].list);
                $("#nnsrank-wrap").show();
                let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
                let maxNum = this.pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 15) {
                    maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
                }
                let pageMsg = "Domain name being auctioned " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
                $("#nnsrank-page").find("#nnsrank-page-msg").html(pageMsg);
                if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                    $("#nnsrank-page-next").removeClass('disabled');
                } else {
                    $("#nnsrank-page-next").addClass('disabled');
                }
                if (this.pageUtil.currentPage - 1) {
                    $("#nnsrank-page-previous").removeClass('disabled');
                } else {
                    $("#nnsrank-page-previous").addClass('disabled');
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
                $('#domainUseListPage').append(html);
                $("#nnsrank-wrap").hide();
            }
        }
        /**
         * start
         */
        public async start()
        {
            await this.domainRankListInit(true);

            $("#nnsrank-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.domainRankListInit(false);
                }
            });
            $("#nnsrank-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.domainRankListInit(false);
                }
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        /**
         * loadView
         */
        public loadView(rankList)
        {
            console.log(rankList);
            rankList.forEach((domain) =>
            {
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
                $( '#domainUseListPage' ).append( html );
            } );
        }
    }
}