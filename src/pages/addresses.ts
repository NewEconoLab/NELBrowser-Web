namespace WebBrowser
{
    //地址列表
    export class Addresses implements Page
    {
        div: HTMLDivElement = document.getElementById('addrs-page') as HTMLDivElement;
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
        public async addrlistInit()
        {
            let addrlist: Addr[] = await WWW.getaddrs(this.pageUtil.pageSize, this.pageUtil.currentPage);
            //let newDate: Date = new Date();
            addrlist.map( ( item ) =>
            {
                let firstTime = DateTool.getTime(item.firstuse.blocktime.$date);
                //if (location.pathname == '/zh/') {
                //    let newDate = new Date();
                //    newDate.setTime(item.firstuse.blocktime.$date);
                //    firstTime = newDate.toLocaleString();
                //}
                item.firstDate = firstTime;
                let lastTime = DateTool.getTime(item.lastuse.blocktime.$date);
                //if (location.pathname == '/zh/') {
                //    let newDate = new Date();
                //    newDate.setTime(item.lastuse.blocktime.$date);
                //    lastTime = newDate.toLocaleString();
                //}
                item.lastDate = lastTime;
            } );
            this.loadView( addrlist );

            //let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
            //let maxNum = this.pageUtil.totalCount;
            //let diffNum = maxNum - minNum;
            //if (diffNum > 15) {
            //    maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
            //}
            //let pageMsg = "Addresses " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
            let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
            }
            $("#addrs-page").find("#addrs-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#addrs-page-next").removeClass('disabled');
            } else {
                $("#addrs-page-next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#addrs-page-previous").removeClass('disabled');
            } else {
                $("#addrs-page-previous").addClass('disabled');
            }

        }
        /**
         * start
         */
        public async start()
        {
            this.div.hidden = false;
            
            let prom = await WWW.getaddrcount();
            this.pageUtil = new PageUtil(prom, 15);
            await this.addrlistInit();
            //this.addrlistInit();
            $("#addrs-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.addrlistInit();
                }
            });
            $("#addrs-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.addrlistInit();
                }
            });
            $("#addrs-input").val('');
            $("#addrs-input").off("input").on('input', () => {
                this.doGoPage(false)
            });
            $("#addrs-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doGoPage(true);
                }
            });
            $("#addrs-gopage").off("click").click(() => {
                this.doGoPage(true)
            });
            this.footer.hidden = false;
        }
        //跳转页面
        public doGoPage(gopage: boolean) {
            let page: number = parseInt($("#addrs-input").val() as string);
            if (page && page > this.pageUtil.totalPage) {
                page = this.pageUtil.totalPage;
                $("#addrs-input").val(this.pageUtil.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#addrs-input").val(1);
            }
            if (gopage) {
                this.pageUtil.currentPage = page;
                this.addrlistInit();
                $("#addrs-input").val('');
            }
        }
        /**
         * loadView
         */
        public loadView( addrlist: Addr[] )
        {
            $( "#addrlist" ).empty();
            addrlist.forEach( item =>
            {
                let href = Url.href_address( item.addr );
                let html = `
                <tr>
                <td><a class="code" target="_self" href="`+ href + `">` + item.addr + `</a></td>
                <td>` + item.firstDate + `</td>
                <td>`+ item.lastDate + `</td>
                <td>` + item.txcount + `</td></tr>`;
                $( '#addrlist' ).append( html );
            } );
        }
    }
}