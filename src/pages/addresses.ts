namespace WebBrowser
{
    //地址列表
    export class Addresses implements Page
    {
        div: HTMLDivElement = document.getElementById( 'addrs-page' ) as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
        }
        private pageUtil: PageUtil;

        /**
         * addrlistInit
         */
        public async addrlistInit()
        {
            let prom = await WWW.getaddrcount();
            this.pageUtil = new PageUtil(prom, 15);
            let addrlist: Addr[] = await WWW.getaddrs(this.pageUtil.pageSize, this.pageUtil.currentPage);
            let newDate: Date = new Date();
            addrlist.map( ( item ) =>
            {
                newDate.setTime( item.firstuse.blocktime.$date );
                item.firstDate = newDate.toLocaleString();
                newDate.setTime( item.lastuse.blocktime.$date );
                item.lastDate = newDate.toLocaleString();
            } );
            this.loadView( addrlist );
            pageCut(this.pageUtil);

            let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
            let maxNum = this.pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
            }
            let pageMsg = "Addresses " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
            $("#addrs-page").find("#addrs-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#addrs-page").find("#next").removeClass('disabled');
            } else {
                $("#addrs-page").find("#next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#addrs-page").find("#previous").removeClass('disabled');
            } else {
                $("#addrs-page").find("#previous").addClass('disabled');
            }

            $("#addrs-page").find("#next").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                    return;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.addrlistInit();
                }
            });
            $("#addrs-page").find("#previous").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                    return;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.addrlistInit();
                }
            });
        }
        /**
         * start
         */
        public async start()
        {
            this.div.hidden = false;
            await this.addrlistInit();
            //this.addrlistInit();
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
                <td><a class="code" target="_blank" href="`+ href + `">` + item.addr + `</a></td>
                <td>` + item.firstDate + `</td>
                <td>`+ item.lastDate + `</td>
                <td>` + item.txcount + `</td></tr>`;
                $( '#addrlist' ).append( html );
            } );
        }
    }
}