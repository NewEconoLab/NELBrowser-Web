/// <reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
/// <reference path="./pages/block.ts" />
/// <reference path="./pages/blocks.ts" />
/// <reference path="./pages/address.ts" />
/// <reference path="./pages/addresses.ts" />
/// <reference path="./pages/asset.ts" />
/// <reference path="./pages/assets.ts" />
/// <reference path="./pages/html-str.ts" />
/// <reference path="./pages/index.ts"/>
/// <reference path="./pages/transactions.ts"/>
/// <reference path="./pages/transaction.ts"/>
/// <reference path="./pages/nep5.ts"/>
/// <reference path="./pages/404.ts"/>
/// <reference path="./tools/locationtool.ts" />
/// <reference path="./tools/numbertool.ts" />
/// <reference path="./tools/routetool.ts" />
/// <reference path="./tools/cointool.ts" />
/// <reference path="./Util.ts" />
/// <reference path="./Navbar.ts" />
/// <reference path="./Network.ts" />

namespace WebBrowser
{

    export class App
    {
        ajax: Ajax = new Ajax();
        navbar: Navbar = new Navbar();
        netWork: NetWork = new NetWork();
        block: Block = new Block();
        blocks: Blocks = new Blocks();
        address: Address = new Address();
        addresses: Addresses = new Addresses();
        transaction: Transaction = new Transaction();
        transactions: Transactions = new Transactions();
        assets: Assets = new Assets();
        indexpage: Index = new Index();
        assetinfo: AssetInfo = new AssetInfo();
        notfound: Notfound = new Notfound();
        nep5: Nep5page = new Nep5page();
        routet: Route = new Route();
        strat()
        {
            CoinTool.initAllAsset();
            this.netWork.start();
            this.navbar.start();
            this.routet.start( this );

            document.getElementsByTagName("body")[0].onhashchange = () =>
            {
                this.routet.start( this );
            };

            $("#searchText").focus(() =>
            {
                $("#nel-search").addClass("nel-input");
            })
            $("#searchText").focusout(() =>
            {
                $("#nel-search").removeClass("nel-input");
            });

        }        

        //区块列表
        async blocksPage()
        {
            //查询区块数量
            let blockCount = await this.ajax.post('getblockcount', []);
            //分页查询区块数据
            let pageUtil: PageUtil = new PageUtil(blockCount[0]['blockcount'], 15);
            let block: Blocks = new Blocks();
            block.updateBlocks(pageUtil);
            //监听下一页
            $("#blocks-page-next").click(() =>
            {
                if (pageUtil.currentPage == pageUtil.totalPage)
                {
                    pageUtil.currentPage = pageUtil.totalPage;
                }
                pageUtil.currentPage += 1;
                block.updateBlocks(pageUtil);
            });
            $("#blocks-page-previous").click(() =>
            {
                if (pageUtil.currentPage <= 1)
                {
                    pageUtil.currentPage = 1;
                }
                pageUtil.currentPage -= 1;
                block.updateBlocks(pageUtil);
            });
        }
    }

    window.onload = () =>
    {
        //WWW.rpc_getURL();
        var app = new App();
        app.strat();
    }
    
}
function txgeneral( obj: HTMLAnchorElement )
{
    var div: HTMLDivElement = obj.parentNode as HTMLDivElement;
    var tran: HTMLDivElement = div.getElementsByClassName( "transaction" )[0] as HTMLDivElement;
    if ( tran.style.display == "" )
    {
        tran.style.display = "none";
        obj.classList.remove( "active" );

    } else
    {
        tran.style.display = "";
        obj.classList.add( "active" );
        var vins = tran.getAttribute( 'vins' );
        var vouts = tran.getAttribute( 'vouts' )
        WebBrowser.Transactions.getTxgeneral( vins, vouts, tran )
    }


}
function txgMsg(obj: HTMLAnchorElement) {
    var div: HTMLDivElement = obj.parentNode as HTMLDivElement;
    var tran: HTMLDivElement = div.getElementsByClassName("transaction")[0] as HTMLDivElement;
    if (tran.style.display == "") {
        tran.style.display = "none";
        obj.classList.remove("active");

    } else {
        tran.style.display = "";
        obj.classList.add("active");
        var vins = tran.getAttribute('vins');
        var vouts = tran.getAttribute('vouts')
        WebBrowser.Address.getTxMsg(vins, vouts, tran);
    }


}