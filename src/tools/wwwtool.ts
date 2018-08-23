
namespace WebBrowser
{
    export class WWW
    {
        static api: string = "https://api.nel.group/api/";
        static apiaggr: string = "https://apiscan.nel.group/api/";

        static makeRpcUrl(method: string, ..._params: any[])
        {
            var url = WWW.api + locationtool.getNetWork();
            var urlout = WWW.makeUrl(method, url, ..._params);
            return urlout;
        }
        static makeUrl(method: string, url: string, ..._params: any[]) 
        {
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++) {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
        }
        static makeRpcPostBody(method: string, ..._params: any[]): {}
        {
            var body = {};
            body["jsonrpc"] = "2.0";
            body["id"] = 1;
            body["method"] = method;
            var params = [];
            for (var i = 0; i < _params.length; i++)
            {
                params.push(_params[i]);
            }
            body["params"] = params;
            return body;
        }
        //获得高度
        static async  api_getHeight()
        {
            var str = WWW.makeRpcUrl( "getblockcount");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"] as string) - 1;
            return height;
        }
        //获得交易总数
        static async gettxcount(type: string)
        {
            var str = WWW.makeRpcUrl("gettxcount", type);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r[0]['txcount'] as number;
        }
        //地址总数
        static async getaddrcount()
        {
            var str = WWW.makeRpcUrl(  "getaddrcount" );
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r[0]['addrcount'] as number;
        }
        /**
         * 获取区块列表
         * @param size 记录条数
         * @param page 页码
         */
        static async getblocks( size: number, page: number )
        {
            var str = WWW.makeRpcUrl(  "getblocks", size, page );
            var result = await fetch( str, { "method": "get" } );
            var json = await result.json();
            var r = json["result"];
            return r as Block[];
        }
        //查询交易列表
        static async getrawtransactions( size: number, page: number, txtype: string )
        {
            var str = WWW.makeRpcUrl( "getrawtransactions", size, page, txtype );
            var result = await fetch( str, { "method": "get" } );
            var json = await result.json();
            var r = json["result"];
            return r as Tx[];
        }

        static async getaddrs(size: number, page: number) {
            var str = WWW.makeRpcUrl("getaddrs", size, page);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r as Addr[];
        }

        static async getrawtransaction( txid: string )
        {
            var str = WWW.makeRpcUrl( "getrawtransaction", txid );
            var result = await fetch( str, { "method": "get" } );
            var json = await result.json();
            var r = json["result"];
            return r[0] as Tx;
        }

        static async getallnep5asset() {
            var str = WWW.makeRpcUrl( "getallnep5asset");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r: nep5Asset[] = json["result"];
            return r;
        }

        static async api_getAllAssets()
        {
            var str = WWW.makeRpcUrl( "getallasset");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getUTXOCount(address: string)
        {
            var str = WWW.makeRpcUrl( "getutxo", address);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getUTXO(address: string, size: number, page: number) {
            var str = WWW.makeRpcUrl("getutxo", address, 1, size, page);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getbalances( address: string )
        {
            var str = WWW.makeRpcUrl( "getbalance", address );
            var result = await fetch( str, { "method": "get" } );
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getasset(asset: string) {
            var str = WWW.makeRpcUrl("getasset", asset);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getnep5(nep5: string) {
            var str = WWW.makeRpcUrl("getnep5asset", nep5);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }

        static async api_getallnep5assetofaddress(nep5: string) {
            var str = WWW.makeRpcUrl("getallnep5assetofaddress", nep5, 1);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }

        static async getaddrsesstxs(addr: string, size: number, page: number) {
            var str = WWW.makeUrl("getaddresstxs", WWW.apiaggr + locationtool.getNetWork(), addr, size, page);
            var result = await fetch(str, { "method": "get"});
            var json = await result.json();
            var r = json["result"];
            if (r) {
                r = json["result"][0];
                return r["list"] as TransOfAddress[];
            }
            return r
        }

        static async api_getaddrMsg(addr: string) {
            var str = WWW.makeRpcUrl("getaddr", addr);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r as AddressMsg[];
        }
        //资产排行
        static async getrankbyasset(nep5id: string, size: number, page: number) {
            var str = WWW.makeUrl("getrankbyasset", WWW.apiaggr + locationtool.getNetWork(), nep5id, size, page);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //资产排行总数
        static async api_getrankbyassetcount(id: string) {
            var str = WWW.makeUrl("getrankbyassetcount", WWW.apiaggr + locationtool.getNetWork(), id);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }

        static async api_getnep5transfersbyasset(nep5id: string, size: number, page: number) {
            var str = WWW.makeRpcUrl("getnep5transfersbyasset", nep5id, size, page);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r as TransOfAsset[];
        }

        static async api_getnep5count(type:string,nep5id: string) {
            var str = WWW.makeRpcUrl("getnep5count", type, nep5id);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        
        //根据txid获取nep5
        static async api_getnep5transferbytxid(txid: string) {
            var str = WWW.makeRpcUrl("getnep5transferbytxid", txid);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //search asset list
        static async apiaggr_searchAsset(str: string) {
            var str = WWW.makeUrl("fuzzysearchasset", WWW.apiaggr + locationtool.getNetWork(), str);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        /*NNS start*/
        //nns统计
        static async apiaggr_getstatistics() {
            var str = WWW.makeUrl("getstatistics", WWW.apiaggr + locationtool.getNetWork());
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //根据txid获取nep5
        static async api_getnep5balanceofaddress(nep5: string,addr: string) {
            var str = WWW.makeRpcUrl("getnep5balanceofaddress", nep5, addr);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //查询domain竞拍情况
        static async apiaggr_getdomaininfo(domainname: string) {
            var str = WWW.makeUrl("getdomaininfo", WWW.apiaggr + locationtool.getNetWork(), domainname);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //domain正在竞拍列表
        static async apiaggr_getauctingdomain( page: number, pagesize: number) {
            var str = WWW.makeUrl("getauctingdomain", WWW.apiaggr + locationtool.getNetWork(), page, pagesize);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //domain竞拍价值排名列表
        static async apiaggr_getaucteddomain( page: number, pagesize: number) {
            var str = WWW.makeUrl("getaucteddomain", WWW.apiaggr + locationtool.getNetWork(), page, pagesize);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        //domain竞拍加价详情
        static async apiaggr_getbiddetailbyauctionid(id: string, page: number, pagesize: number) {
            var str = WWW.makeUrl("getbiddetailbyauctionid", WWW.apiaggr + locationtool.getNetWork(), id, page, pagesize);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        /*NNS end*/
    }
}