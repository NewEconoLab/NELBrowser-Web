/// <reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
/// <reference path="./pages/blockInfo.ts" />
/// <reference path="./pages/addressInfo.ts" />
/// <reference path="./pages/txInfo.ts" />
/// <reference path="./pages/asset.ts" />
/// <reference path="./pages/html-str.ts" />
/// <reference path="./tools/locationtool.ts" />
/// <reference path="./pages/index.ts"/>

namespace WebBrowser
{

    export class App
    {
        ajax: Ajax = new Ajax();
        navbar: Navbar = new Navbar();
        netWork: NetWork = new NetWork();
        block: Block = new Block();
        address: Address = new Address();
        transaction: Transaction = new Transaction();
        search: SearchController = new SearchController();
        assetControll: AssetControll = new AssetControll();
        assetinfo: AssetInfo;
        viewtxlist: HTMLAnchorElement = document.getElementById("viewtxlist") as HTMLAnchorElement;
        viewblocks: HTMLAnchorElement = document.getElementById("viewblocks") as HTMLAnchorElement;
        alladdress: HTMLAnchorElement = document.getElementById("alladdress") as HTMLAnchorElement;
        allblock: HTMLAnchorElement = document.getElementById("allblock") as HTMLAnchorElement;
        alltxlist: HTMLAnchorElement = document.getElementById("alltxlist") as HTMLAnchorElement;
        strat()
        {
            this.netWork.start();
            this.block.start();
            this.transaction.start();
            this.address.start();
            this.navbar.start();
            this.assetinfo = new AssetInfo();
            this.assetinfo.start(this);
            this.redirect();
            document.getElementsByTagName("body")[0].onhashchange = () =>
            {
                this.redirect()
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
        
        //主页
        async indexPage()
        {
            this.viewtxlist.href = "./#" + locationtool.getNetWork() + "/transactions";
            this.viewblocks.href = "./#" + locationtool.getNetWork() + "/blocks";

            this.alladdress.href = "./#" + locationtool.getNetWork() + "/addresses";
            this.allblock.href = "./#" + locationtool.getNetWork() + "/blocks";
            this.alltxlist.href = "./#" + locationtool.getNetWork() + "/transactions";
            this.search.start();
            //查询区块高度(区块数量-1)
            let blockCount = await this.ajax.post('getblockcount', []);
            let blockHeight = blockCount[0]['blockcount'] - 1;
            $("#blockHeight").text(blockHeight.toLocaleString());//显示在页面

            //查询交易数量
            let txCount = await this.ajax.post('gettxcount', []);
            txCount = txCount[0]['txcount'];
            $("#txcount").text(txCount.toLocaleString());//显示在页面

            //查询地址总数
            let addrCount: number = await this.ajax.post('getaddrcount', [])
            addrCount = addrCount[0]['addrcount'];
            $("#addrCount").text(addrCount.toLocaleString());
            $("#index-page").find("#blocks").children("tbody").empty();
            //分页查询区块数据
            let blocks: Block[] = await this.ajax.post('getblocks', [10, 1]);
            blocks.forEach((item, index, input) =>
            {
                var newDate = new Date();
                newDate.setTime(item.time * 1000);
                let html = '';
                html += '<tr><td><a class="code" class="code" target="_blank" rel="external nofollow"  '
                html += " href ='./#" + locationtool.getNetWork() + "/block/" + item.index + "' > ";
                html += item.index + '</a></td><td>' + item.size + ' bytes</td><td>';
                html += newDate.toLocaleString() + '</td>';
                html += '<td>' + item.tx.length + '</td></tr>';
                $("#index-page").find("#blocks").append(html);
            });

            //分页查询交易记录
            let txs: {
                txid: string,
                size: number,
                type: string,
                version: number,
                blockindex: number,
                gas: string,
            }[] = await this.ajax.post('getrawtransactions', [10, 1]);
            $("#index-page").find("#transactions").children("tbody").empty();
            txs.forEach((tx) =>
            {
                let txid: string = tx.txid;
                txid = txid.replace('0x', '');
                txid = txid.substring(0, 4) + '...' + txid.substring(txid.length - 4);
                let html: string = "";
                html += "<tr>"
                html += "<td><a class='code' class='code' target='_blank' rel='external nofollow' ";
                html += " href ='./#" + locationtool.getNetWork() + "/transaction/" + tx.txid + "' > " + txid + " </a>"
                html += "</td>"
                html += "<td>" + tx.type.replace("Transaction", "");
                html += "</td>"
                html += "<td>" + tx.blockindex
                html += "</td>"
                html += "<td>" + tx.size + " bytes"
                html += "</td>"
                html += "</tr>"
                $("#index-page").find("#transactions").children("tbody").append(html);
            });

        };

        //区块列表
        async blocksPage()
        {
            //查询区块数量
            let blockCount = await this.ajax.post('getblockcount', []);
            //分页查询区块数据
            let pageUtil: PageUtil = new PageUtil(blockCount[0]['blockcount'], 15);
            let block: BlockPage = new BlockPage();
            block.updateBlocks(pageUtil);
            //监听下一页
            $("#blocks-page").find("#next").click(() =>
            {
                if (pageUtil.currentPage == pageUtil.totalPage)
                {
                    alert('当前页已经是最后一页了');
                    return;
                }
                pageUtil.currentPage += 1;
                block.updateBlocks(pageUtil);
            });
            $("#blocks-page").find("#previous").click(() =>
            {
                if (pageUtil.currentPage <= 1)
                {
                    alert('当前已经是第一页了');
                    return;
                }
                pageUtil.currentPage -= 1;
                block.updateBlocks(pageUtil);
            });
        }

        redirect()
        {
            var href = window.location.href;
            var page: string = "";
            var param: any; 
            let hash = location.hash;
            var urlarr: string[] = hash.split("/");
            if (urlarr.length == 1)
            {
                page = urlarr[0];
            }
            if (urlarr.length == 2)
            {
                page = urlarr[1];
            }
            if (urlarr.length == 3)
            {
                page = urlarr[1];
                param = urlarr[2];
            }
            if (urlarr[0] == "")
            {
                var newhref = href.replace("#", "");
                newhref += "#mainnet";
                window.location.href = newhref;
            }
            this.netWork.changeNetWork(urlarr[0]);
            if (page === '#mainnet' || page === "#testnet")
            {
                this.indexPage();
                $('#index-page').show();
                $("#index-btn").addClass("active");
                $("#brow-btn").removeClass("active");
            } else
            {
                $('#index-page').hide();
                $("#brow-btn").addClass("active");
                $("#index-btn").removeClass("active");
            }
            if (page === 'blocks')
            {
                this.blocksPage();
                $("#blocks-page").show();
                $("#blocks-btn").addClass("active");
            } else
            {
                $('#blocks-page').hide();
                $("#blocks-btn").removeClass("active");
            }
            if (page === 'transactions')
            {
                let ts: Trasctions = new Trasctions();
                $("#txlist-page").show();
                $("#txlist-btn").addClass("active");
            } else
            {
                $('#txlist-page').hide();
                $("#txlist-btn").removeClass("active");
            }
            if (page === 'addresses')
            {
                let addrlist: addrlistControll = new addrlistControll();
                addrlist.start();
                $("#addrs-page").show();
                $("#addrs-btn").addClass("active");
            } else
            {
                $('#addrs-page').hide();
                $("#addrs-btn").removeClass("active");
            }
            if (page === 'assets')
            {
                //启动asset管理器
                this.assetControll.allAsset();
                $("#asset-page").show();
                $("#asset-btn").addClass("active");
                $("#brow-btn").removeClass("active");
            } else
            {
                $('#asset-page').hide();
                $("#asset-btn").removeClass("active");
            }
            if (page == "#wallet-page")
            {
                $("#wallet-btn").addClass("active");
                $("#brow-btn").removeClass("active");

            } else
            {
                $("#wallet-page").hide();
                $("#wallet-btn").removeClass("active");
            }
            if (page == "block")
            {
                this.block.div.hidden = false;
                let index: number = param;
                let block: BlockPage = new BlockPage();
                block.queryBlock(index);
            } else
            {
                this.block.div.hidden = true;
            }
            if (page == "asset")
            {
                let assetid: string = param;
                //let ts: TrasctionInfo = new TrasctionInfo();
                //ts.updateTxInfo(txid);
            }
            if (page == "transaction")
            {
                this.transaction.div.hidden = false;
                let txid: string = param;
                let ts: TrasctionInfo = new TrasctionInfo();
                ts.updateTxInfo(txid);
            } else
            {
                this.transaction.div.hidden = true;
            }
            if (page == "address")
            {
                this.address.div.hidden = false;
                let addr: string = param;
                let addrInfo: AddressControll = new AddressControll(addr);
                addrInfo.addressInfo();
            } else
            {
                this.address.div.hidden = true;
            }
            if (page == "asset")
            {
                this.assetinfo.div.hidden = false;
                let id: string = param;
                this.assetinfo.view(id);

            } else
            {
                this.assetinfo.div.hidden = true;
            }

        }
    }

    window.onload = () =>
    {
        //WWW.rpc_getURL();
        var app = new App();
        app.strat();
    }
    
}
function txgeneral(obj: HTMLAnchorElement)
{
    var div: HTMLDivElement = obj.parentNode as HTMLDivElement;
    var tran: HTMLDivElement = div.getElementsByClassName("transaction")[0] as HTMLDivElement;
    if (tran.style.display=="")
    {
        tran.style.display = "none";
        obj.classList.remove("active");

    } else
    {
        tran.style.display = "";
        obj.classList.add("active");
        var vins = tran.getAttribute('vins');
        var vouts = tran.getAttribute('vouts')
        WebBrowser.Trasctions.getTxgeneral(vins, vouts, tran)
    }


}