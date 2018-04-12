/// <reference types="jquery" />
/// <reference path="./tools/cointool.ts" />
/// <reference path="./tools/wwwtool.ts" />
namespace WebBrowser
{

    export class AddressControll
    {
        private ajax: Ajax = new Ajax();
        private address: string;
        private addInfo: AddressInfoView
        constructor(address: string)
        {
            this.address = address;
            $("#nep5-btn").click(() =>
            {
                this.nep5Info();
            })
            
        }

        /**
         * queryNep5AssetById
         */
        public async queryNep5AssetById(id: string): Promise<result>
        {
            let getNep5: GetNep5Info = new GetNep5Info();
            let res: result;
            try
            {
                res = await getNep5.getInfo(id);
                let name = res.result["name"];
                let symbol = res.result["symbol"];
            } catch (error)
            {
                alert("^_^ 请尝试输入正确的资产id");
                return;
            }
            try
            {
                let balance = await getNep5.getBalance(id, this.address);
                res.result.balance = balance.result;
                return res;
            } catch (error)
            {
                alert("^_^ 请尝试输入正确的地址");
                return;
            }
        }

        async initNep5Asset()
        {
            let stouitl: StorageUtil = new StorageUtil();
            let asids: string[] = stouitl.getStorage("assetIds_nep5", "|");
            if (asids.length == 0) { return }
            else
            {
                try
                {
                    let ress: Array<any> = new Array<any>();
                    for (let index = 0; index < asids.length; index++)
                    {
                        let res = await this.queryNep5AssetById(asids[index]);
                        if (res.result["balance"]) ress.push(res);
                    }
                    if (ress.length) this.addInfo.initNep5(ress);
                } catch (error)
                {
                    console.error("查询nep5资产出错");
                }
            }
        }

        /**
         * nep5Info
         */
        public async nep5Info()
        {
            let asset: string = $("#nep5-text").val().toString();
            let stouitl: StorageUtil = new StorageUtil();
            if (asset.length < 1)
                alert("请输入资产id");
            try
            {
                let res = await this.queryNep5AssetById(asset);
                this.addInfo.loadNep5(res.result["name"], res.result["symbol"], res.result["balance"]);
                let asids: string[] = stouitl.getStorage("assetIds_nep5", "|");
                if (!asids.find(as => as == asset))
                {
                    asids.push(asset);
                    stouitl.setStorage("assetIds_nep5", asids.join('|'));
                }
            } catch (err)
            {
                console.error("查询nep5资产出错");

            }
        }
        /**
         * 
         */
        public async addressInfo()
        {
            let balances: Balance[] = await this.ajax.post('getbalance', [this.address]).catch((e) =>
            {
                alert(e);
            });;

            if (balances.length < 1)
            {
                alert("This address has no record of transactions");
            }
            balances.map((balance) =>
            {
                if (balance.asset == AssetEnum.NEO)
                {
                    balance.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (balance.asset == AssetEnum.GAS)
                {
                    balance.name = [{ lang: 'en', name: "GAS" }];
                }
            });

            let utxo: Utxo[] = await this.ajax.post('getutxo', [this.address]).catch((e) =>
            {
                alert(e);
            });

            let allAsset: Asset[] = await this.ajax.post('getallasset', []);
            allAsset.map((asset) =>
            {
                if (asset.id == AssetEnum.NEO)
                {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (asset.id == AssetEnum.GAS)
                {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
            });

            utxo.map((item) =>
            {
                item.asset = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name }).join("|");
            })

            this.addInfo = new AddressInfoView(balances, utxo, this.address);
            this.addInfo.loadView(); //加载页面
            this.initNep5Asset();
        }
    }
    //地址列表
    export class addrlistControll
    {
        private pageUtil: PageUtil;
        private ajax: Ajax = new Ajax();
        constructor()
        {
            
            $("#addrs-page").find("#next").click(() =>
            {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage)
                {
                    alert('当前页已经是最后一页了');
                    return;
                } else
                {
                    this.pageUtil.currentPage += 1;
                    this.addrlistInit();
                }
            });
            $("#addrs-page").find("#previous").click(() =>
            {
                if (this.pageUtil.currentPage <= 1)
                {
                    alert('当前已经是第一页了');
                    return;
                } else
                {
                    this.pageUtil.currentPage -= 1;
                    this.addrlistInit();
                }
            });
        }
        /**
         * addrlistInit
         */
        public async addrlistInit()
        {
            let addrcount = await this.ajax.post('getaddrcount', []).catch((e) =>
            {
                alert(e);
            });
            if (addrcount.length == 0)
            {
                alert('此地址余额为空，utxo为空');
            }
            this.pageUtil.totalCount = addrcount[0]['addrcount'];
            let addrlist: Addr[] = await this.ajax.post('getaddrs', [this.pageUtil.pageSize, this.pageUtil.currentPage]);
            let newDate: Date = new Date();
            addrlist.map((item) =>
            {
                newDate.setTime(item.firstuse.blocktime.$date);
                item.firstDate = newDate.toLocaleString();
                newDate.setTime(item.lastuse.blocktime.$date);
                item.lastDate = newDate.toLocaleString();
            });
            let view: AddrlistView = new AddrlistView();
            view.loadView(addrlist);
            pageCut(this.pageUtil);
        }
        /**
         * start
         */
        public async start()
        {
            let prom = await this.ajax.post('getaddrcount', []);
            this.pageUtil = new PageUtil(prom[0]['addrcount'], 15);
            this.addrlistInit();
        }
    }

    //资产页面管理器
    export class AssetControll
    {
        private ajax: Ajax = new Ajax();
        assets: Asset[];
        constructor() { }
        async start()
        {
        }
        public async allAsset()
        {
            this.assets = await this.ajax.post('getallasset', []);
            this.assets.map((asset) =>
            {
                if (asset.id == AssetEnum.NEO)
                {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (asset.id == AssetEnum.GAS)
                {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
                let name = asset.name.map((name) => { return name.name })
                asset.names = name.join("|");
            });
            let nep5Info: GetNep5Info = new GetNep5Info();
            let storutil: StorageUtil = new StorageUtil();
            let nep5asids: string[] = storutil.getStorage("assetIds_nep5", "|");
            let nep5s: Asset[] = new Array<Asset>();
            for (let n = 0; n < nep5asids.length; n++)
            {
                let res = await nep5Info.getInfo(nep5asids[n]);
                let assetnep5: Nep5as = new Nep5as();
                if (!res.err)
                {
                    assetnep5.names = res.result["name"];
                    assetnep5.type = res.result["symbol"]
                    assetnep5.amount = res.result["totalsupply"];
                    assetnep5.id = nep5asids[n];
                } nep5s.push(assetnep5);
            }
            let assetView: AssetsView = new AssetsView(this.assets, nep5s);
            await assetView.loadView();   //调用loadView方法渲染页面

        }


    }

    export class BlocksControll
    {
        private ajax: Ajax = new Ajax();
        private pageUtil: PageUtil;
        private ul: HTMLUListElement;
        private previous: HTMLLIElement;
        private next: HTMLLIElement;
        private older: HTMLAnchorElement;
        private newer: HTMLAnchorElement;
        private text: HTMLAnchorElement;
        constructor()
        {
            this.previous = document.createElement("li");
            this.next = document.createElement("li");
            this.ul = document.createElement("ul");
            this.ul.className = "pager";
            this.previous.className = "previous disabled";
            this.next.className = "next";
            this.older = document.createElement("a");
            this.newer = document.createElement("a");
            this.text = document.createElement("a");
            this.previous.appendChild(this.older);
            this.next.appendChild(this.newer);
            this.older.text = "← Older";
            this.newer.text = "Newer →";
            this.ul.appendChild(this.previous);
            this.ul.appendChild(this.text);
            this.ul.appendChild(this.next);

            let div = document.getElementById("blocks-page");
            div.appendChild(this.ul);

            this.next.onclick = () =>
            {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage)
                {
                    alert('当前页已经是最后一页了');
                    return;
                } else
                {
                    this.pageUtil.currentPage += 1;
                    this.blocksInit()
                }
            }
            this.previous.onclick = () =>
            {
                if (this.pageUtil.currentPage <= 1)
                {
                    alert('当前已经是第一页了');
                    return;
                } else
                {
                    this.pageUtil.currentPage -= 1;
                    this.blocksInit()
                }
            }
        }
        /**
         * blocksInit
         */
        private async blocksInit()
        {
            //分页查询区块数据
            let blocks: Block[] = await this.ajax.post(
                'getblocks',
                [
                    this.pageUtil.pageSize,
                    this.pageUtil.currentPage
                ]
            );
            let ths: Map<string, any> = new Map();
            let tds: Array<Map<string, any>> = new Array<Map<string, any>>();

            ths.set('index', 'index');
            ths.set('size', 'size');
            ths.set('time', 'time');
            ths.set('txnumber', 'txnumber');
            let newDate = new Date();
            blocks.forEach((block: Block) =>
            {
                let td: Map<string, any> = new Map();
                newDate.setTime(block.time * 1000);
                let a: string = '<a href="./page/blockInfo.html?index=' + block.index + '">';
                a += block.index + '</a>';
                td.set('index', a);
                td.set('size', block.size);
                td.set('time', newDate.toLocaleString());
                td.set('txnumber', block.tx.length);
                tds.push(td);
            });

            let tbmode: TableMode = new TableMode(ths, tds, "blocklist");
            let blocksView: BlocksView = new BlocksView(tbmode, this.next, this.previous, this.text);
            blocksView.loadView(this.pageUtil);
        }

        /**
         * start
         */
        public async start()
        {
            //查询区块数量
            let blockCount = await this.ajax.post('getblockcount', []);
            this.pageUtil = new PageUtil(blockCount[0]['blockcount'], 15);
            this.blocksInit();
        }
    }
    
}