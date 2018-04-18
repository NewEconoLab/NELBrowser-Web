
namespace WebBrowser
{
    export class WWW
    {
        static api: string = "https://api.nel.group/api/";
        static apiaggr: string = "https://apiaggr.nel.group/api/testnet";

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
        static async api_getUTXO(address: string)
        {
            var str = WWW.makeRpcUrl( "getutxo", address);
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
            var str = WWW.makeUrl("getaddresstxs", WWW.apiaggr, addr, size, page);
            var result = await fetch(str, { "method": "get"});
            var json = await result.json();
            var r = json["result"];
            return r as TransOfAddress[];
        }

        static async api_getaddrMsg(addr: string) {
            var str = WWW.makeRpcUrl("getaddr", addr);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r as AddressMsg[];
        }
    }
}