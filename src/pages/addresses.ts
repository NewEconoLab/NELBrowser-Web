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
                let firstTime = DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(item.firstuse.blocktime.$date));
                if (location.pathname == '/zh/') {
                    let newDate = new Date();
                    newDate.setTime(item.firstuse.blocktime.$date);
                    firstTime = newDate.toLocaleString();
                }
                item.firstDate = firstTime;
                let lastTime = DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(item.lastuse.blocktime.$date));
                if (location.pathname == '/zh/') {
                    let newDate = new Date();
                    newDate.setTime(item.lastuse.blocktime.$date);
                    lastTime = newDate.toLocaleString();
                }
                item.lastDate = lastTime;
            } );
            this.loadView( addrlist );

            let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
            let maxNum = this.pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
            }
            let pageMsg = "Addresses " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
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
            this.footer.hidden = false;
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