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
        private ajax: Ajax = new Ajax();
        constructor()
        {

            $( "#addrs-page" ).find( "#next" ).click( () =>
            {
                if ( this.pageUtil.currentPage == this.pageUtil.totalPage )
                {
                    alert( '当前页已经是最后一页了' );
                    return;
                } else
                {
                    this.pageUtil.currentPage += 1;
                    this.addrlistInit();
                }
            } );
            $( "#addrs-page" ).find( "#previous" ).click( () =>
            {
                if ( this.pageUtil.currentPage <= 1 )
                {
                    alert( '当前已经是第一页了' );
                    return;
                } else
                {
                    this.pageUtil.currentPage -= 1;
                    this.addrlistInit();
                }
            } );
        }
        /**
         * addrlistInit
         */
        public async addrlistInit()
        {
            let addrcount = await this.ajax.post( 'getaddrcount', [] ).catch( ( e ) =>
            {
                alert( e );
            } );
            if ( addrcount.length == 0 )
            {
                alert( '此地址余额为空，utxo为空' );
            }
            this.pageUtil.totalCount = addrcount[0]['addrcount'];
            let addrlist: Addr[] = await this.ajax.post( 'getaddrs', [this.pageUtil.pageSize, this.pageUtil.currentPage] );
            let newDate: Date = new Date();
            addrlist.map( ( item ) =>
            {
                newDate.setTime( item.firstuse.blocktime.$date );
                item.firstDate = newDate.toLocaleString();
                newDate.setTime( item.lastuse.blocktime.$date );
                item.lastDate = newDate.toLocaleString();
            } );
            this.loadView( addrlist );
            pageCut( this.pageUtil );
        }
        /**
         * start
         */
        public async start()
        {
            let prom = await this.ajax.post( 'getaddrcount', [] );
            this.pageUtil = new PageUtil( prom[0]['addrcount'], 15 );
            this.addrlistInit();
            this.addrlistInit();
            this.div.hidden = false;
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