var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
var WebBrowser;
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
(function (WebBrowser) {
    class Ajax {
        constructor() {
            this._network = "testnet";
        }
        /**
         * get network
         */
        get network() {
            return this._network;
        }
        /**
         * set network
         */
        set network(nextwork) {
            this._network = nextwork;
        }
        /**
         * async post
         */
        post(method, params) {
            return __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'POST',
                        url: 'http://47.96.168.8:81/api/' + this._network,
                        data: JSON.stringify({
                            "jsonrpc": "2.0",
                            "method": method,
                            "params": params,
                            "id": 1
                        }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: (data, status) => {
                            if ('result' in data) {
                                // console.log(data['result']);              
                                resolve(data['result']);
                            }
                            else if ('error' in data) {
                                if (data['error']['code'] == -1) {
                                    resolve([]);
                                }
                                else {
                                    resolve([]);
                                    reject("参数出错 code:-100");
                                }
                            }
                        },
                        error: () => {
                            reject("请求失败");
                        }
                    });
                });
                return promise;
            });
        }
        /**
         * async post
         */
        get() {
            return __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'GET',
                        url: 'https://47.96.168.8:4431/api/testnet?jsonrpc=2.0&method=getblock&params=%5b1000%5d&id=1001',
                        success: (data, status) => {
                            resolve(data['result']);
                        },
                        error: () => {
                            reject("请求失败");
                        }
                    });
                });
                return promise;
            });
        }
    }
    WebBrowser.Ajax = Ajax;
    class LocationUtil {
        constructor() {
            this.LocString = String(location.href);
        }
        GetQueryString(name) {
            let rs = new RegExp("(^|)" + name + "=([^&]*)(&|$)", "gi").exec(this.LocString), tmp;
            if (tmp = rs) {
                return decodeURI(tmp[2]);
            }
            // parameter cannot be found
            return "";
        }
        getRootPath_web() {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            console.log(curWwwPath);
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName = window.document.location.pathname;
            console.log(pathName);
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            console.log(pos);
            var localhostPaht = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/uimcardprj
            console.log(localhostPaht);
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            console.log(projectName);
            return (localhostPaht + projectName);
        }
        getRootPath() {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
            if (webName == "") {
                return window.location.protocol + '//' + window.location.host;
            }
            else {
                return window.location.protocol + '//' + window.location.host + '/' + webName;
            }
        }
    }
    WebBrowser.LocationUtil = LocationUtil;
    class NeoUtil {
        constructor() { }
        /**
         * verifyPublicKey 验证公钥
         * @param publicKey 公钥
         */
        verifyPublicKey(publicKey) {
            var array = Neo.Cryptography.Base58.decode(publicKey);
            //var hexstr = array.toHexString();
            //var salt = array.subarray(0, 1);
            //var hash = array.subarray(1, 1 + 20);
            var check = array.subarray(21, 21 + 4); //
            var checkdata = array.subarray(0, 21); //
            var hashd = Neo.Cryptography.Sha256.computeHash(checkdata); //
            hashd = Neo.Cryptography.Sha256.computeHash(hashd); //
            var hashd = hashd.slice(0, 4); //
            var checked = new Uint8Array(hashd); //
            var error = false;
            for (var i = 0; i < 4; i++) {
                if (checked[i] != check[i]) {
                    error = true;
                    break;
                }
            }
            return !error;
        }
        /**
         * wifDecode wif解码
         * @param wif wif私钥
         */
        wifDecode(wif) {
            let result = { err: false, result: { pubkey: "", prikey: "", address: "" } };
            var prikey;
            var pubkey;
            var address;
            try {
                prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                var hexstr = prikey.toHexString();
                result.result.prikey = hexstr;
            }
            catch (e) {
                result.err = true;
                result.result = e.message;
                return result;
            }
            try {
                pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                var hexstr = pubkey.toHexString();
                result.result.pubkey = hexstr;
            }
            catch (e) {
                result.err = true;
                result.result = e.message;
                return result;
            }
            try {
                address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                result.result.address = address;
            }
            catch (e) {
                result.err = true;
                result.result = e.message;
                return result;
            }
            return result;
        }
        /**
         * nep2FromWif
         */
        nep2FromWif(wif, password) {
            var prikey;
            var pubkey;
            var address;
            let res = { err: false, result: { address: "", nep2: "" } };
            try {
                prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                var n = 16384;
                var r = 8;
                var p = 8;
                ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) => {
                    res.err = false;
                    res.result.nep2 = result;
                    pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    var hexstr = pubkey.toHexString();
                    address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    res.result.address = address;
                    return res;
                });
            }
            catch (e) {
                res.err = true;
                res.result = e.message;
                return res;
            }
        }
        /**
         * nep2TOWif
         */
        nep2ToWif(nep2, password) {
            return __awaiter(this, void 0, void 0, function* () {
                var prikey;
                var pubkey;
                var address;
                let promise = new Promise((resolve, reject) => {
                    let n = 16384;
                    var r = 8;
                    var p = 8;
                    ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, n, r, p, (info, result) => {
                        //spanNep2.textContent = "info=" + info + " result=" + result;
                        console.log("result=" + "info=" + info + " result=" + result);
                        prikey = result;
                        if (prikey != null) {
                            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                            var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                            var wif = ThinNeo.Helper.GetWifFromPrivateKey(prikey);
                            console.log('1:' + address);
                            resolve({ err: false, result: { pubkey, address, prikey } });
                        }
                        else {
                            // spanWif.textContent = "result=" + "info=" + info + " result=" + result;
                            reject({ err: false, result: result });
                        }
                    });
                });
                return promise;
            });
        }
        /**
         * nep6Load
         */
        nep6Load(wallet, password) {
            return __awaiter(this, void 0, void 0, function* () {
                // let promise:Promise<result> = new Promise((resolve,reject)=>{
                try {
                    //getPrivateKey 是异步方法，且同时只能执行一个
                    var istart = 0;
                    let res = new Array();
                    var getkey = null;
                    // getkey = async (keyindex: number) => {
                    for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                        let account = wallet.accounts[keyindex];
                        try {
                            let result = yield this.getPriKeyfromAccount(wallet.scrypt, password, account);
                            res.push(result.result);
                        }
                        catch (error) {
                            console.error(error);
                            return { err: true, result: error };
                        }
                    }
                    return { err: false, result: res };
                }
                catch (e) {
                }
                // });
                // return promise;
            });
        }
        /**
         * getPriKeyform
         */
        getPriKeyfromAccount(scrypt, password, account) {
            return __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    account.getPrivateKey(scrypt, password, (info, result) => {
                        if (info == "finish") {
                            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                            var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                            var wif = ThinNeo.Helper.GetWifFromPrivateKey(result);
                            var hexkey = result.toHexString();
                            console.log(info + "|" + address + " wif=" + wif);
                            resolve({ err: false, result: { pubkey: pubkey, address: address, prikey: result } });
                        }
                        else {
                            // info2.textContent += info + "|" + result;
                            reject({ err: true, result: result });
                        }
                    });
                });
                return promise;
            });
        }
    }
    WebBrowser.NeoUtil = NeoUtil;
    function pageCut(pageUtil) {
        if (pageUtil.totalPage - pageUtil.currentPage) {
            $("#next").removeClass('disabled');
        }
        else {
            $("#next").addClass('disabled');
        }
        if (pageUtil.currentPage - 1) {
            $("#previous").removeClass('disabled');
        }
        else {
            $("#previous").addClass('disabled');
        }
    }
    WebBrowser.pageCut = pageCut;
    class TableView {
        constructor(divId, tableMode) {
            this._tableMode = tableMode;
            this.divId = divId;
            let html = "<table id='" + tableMode.tablId + "'>"
                + "<thead><head></head></thead><tbody></tbody></table>";
            $("#" + this.divId).append(html);
        }
        update() {
            this._tableMode.ths.forEach((th) => {
                $("#blocklist").children('thead').append('<th>' + th + '</th>');
            });
            let tbody = $("#blocklist").children('tbody');
            let tr = '';
            this._tableMode.tds.forEach((tdMap) => {
                let td = "";
                this._tableMode.ths.forEach((val, key) => {
                    td += "<td>" + tdMap.get(key) + "</td>";
                });
                tr += "<tr>" + td + "</tr>";
            });
            tbody.empty();
            tbody.append(tr);
        }
        set className(className) {
            $("#" + this._tableMode.tablId).addClass(className);
        }
        set tableMode(tableMode) {
            this._tableMode = tableMode;
        }
    }
    WebBrowser.TableView = TableView;
    class walletStorage {
        constructor() {
            this.wallets = localStorage.getItem("Nel_wallets");
        }
        /**
         * setWallet
         */
        setWallet(address, nep2) {
            let json = { address, nep2 };
            let wallets = JSON.parse(this.wallets);
        }
    }
    WebBrowser.walletStorage = walletStorage;
    class GetNep5Info {
        constructor() {
            this.nep5decimals = 0;
        }
        //http://47.96.168.8:20332/?jsonrpc=2.0&id=1&method=invokescript&params=[%2200c1046e616d6567056bd94ecab6fe9607014624ef66bbc991dbcc3f%22]
        makeRpcUrl(url, method, ..._params) {
            if (url[url.length - 1] != '/')
                url = url + "/";
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++) {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
        }
        getInfo(sid) {
            return __awaiter(this, void 0, void 0, function* () {
                let res = { err: false, result: { name: "", symbol: "", decimals: 0, totalsupply: 0 } };
                try {
                    //拼接三次调用
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(JSON.parse("[]")); //参数倒序入
                    sb.EmitParamJson("(str)name"); //参数倒序入
                    var shash = sid.hexToBytes();
                    sb.EmitAppCall(shash.reverse()); //nep5脚本
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitParamJson("(str)symbol");
                    var shash = sid.hexToBytes();
                    sb.EmitAppCall(shash.reverse());
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitParamJson("(str)decimals");
                    var shash = sid.hexToBytes();
                    sb.EmitAppCall(shash.reverse());
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitParamJson("(str)totalSupply");
                    var shash = sid.hexToBytes();
                    sb.EmitAppCall(shash.reverse());
                    var data = sb.ToArray();
                    var url = this.makeRpcUrl("http://47.96.168.8:20332", "invokescript", data.toHexString());
                    let response = yield fetch(url, { "method": "get" });
                    let json = yield response.json();
                    // info1.textContent = JSON.stringify(r);
                    try {
                        var state = json.result.state;
                        // info2.textContent = "";
                        if (state.includes("HALT")) {
                            // info2.textContent += "Succ\n";
                            res.err = false;
                        }
                        var stack = json.result.stack;
                        //find name 他的type 有可能是string 或者ByteArray
                        if (stack[0].type == "String") {
                            // info2.textContent += "name=" + stack[0].value + "\n";
                            res.result.name = stack[0].value;
                        }
                        else if (stack[0].type == "ByteArray") {
                            var bs = stack[0].value.hexToBytes();
                            var str = ThinNeo.Helper.Bytes2String(bs);
                            // info2.textContent += "name=" + str + "\n";
                            res.result.name = str;
                        }
                        //find symbol 他的type 有可能是string 或者ByteArray
                        if (stack[1].type == "String") {
                            // info2.textContent += "symbol=" + stack[1].value + "\n";
                            res.result.symbol = stack[1].value;
                        }
                        else if (stack[1].type == "ByteArray") {
                            var bs = stack[1].value.hexToBytes();
                            var str = ThinNeo.Helper.Bytes2String(bs);
                            // info2.textContent += "symbol=" + str + "\n";
                            res.result.symbol = str;
                        }
                        //find decimals 他的type 有可能是 Integer 或者ByteArray
                        if (stack[2].type == "Integer") {
                            this.nep5decimals = (new Neo.BigInteger(stack[2].value)).toInt32();
                        }
                        else if (stack[2].type == "ByteArray") {
                            var bs = stack[2].value.hexToBytes();
                            var num = new Neo.BigInteger(bs);
                            this.nep5decimals = num.toInt32();
                        }
                        //find decimals 他的type 有可能是 Integer 或者ByteArray
                        if (stack[3].type == "Integer") {
                            var totalsupply = (new Neo.BigInteger(stack[3].value)).toInt32();
                        }
                        else if (stack[3].type == "ByteArray") {
                            var bs = stack[3].value.hexToBytes();
                            var num = new Neo.BigInteger(bs);
                            totalsupply = num.toInt32();
                        }
                        // info2.textContent += "decimals=" + this.nep5decimals + "\n";
                        res.result.totalsupply = totalsupply;
                        res.result.decimals = this.nep5decimals;
                        return res;
                    }
                    catch (e) {
                        return e.message;
                    }
                }
                catch (e) {
                    return e.message;
                }
            });
        }
        getBalance(sid, addr) {
            return __awaiter(this, void 0, void 0, function* () {
                let res = { err: false, result: 0 };
                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(addr)" + addr]); //参数倒序入
                sb.EmitParamJson("(str)balanceOf"); //参数倒序入 //name//totalSupply//symbol//decimals
                var shash = sid.hexToBytes();
                sb.EmitAppCall(shash.reverse()); //nep5脚本
                var data = sb.ToArray();
                // info1.textContent = data.toHexString();        
                try {
                    var url = this.makeRpcUrl("http://47.96.168.8:20332", "invokescript", data.toHexString());
                    let response = yield fetch(url, { "method": "get" });
                    let json = yield response.json();
                    var state = json.result.state;
                    // info2.textContent = "";
                    if (state.includes("HALT")) {
                        // info2.textContent += "Succ\n";
                    }
                    var stack = json.result.stack;
                    var bnum = new Neo.BigInteger(0);
                    //find decimals 他的type 有可能是 Integer 或者ByteArray
                    if (stack[0].type == "Integer") {
                        bnum = new Neo.BigInteger(stack[0].value);
                    }
                    else if (stack[0].type == "ByteArray") {
                        var bs = stack[0].value.hexToBytes();
                        bnum = new Neo.BigInteger(bs);
                    }
                    var v = 1;
                    for (var i = 0; i < this.nep5decimals; i++) {
                        v *= 10;
                    }
                    var intv = bnum.divide(v).toInt32();
                    var smallv = bnum.mod(v).toInt32() / v;
                    // info2.textContent += "count=" + (intv + smallv);
                    res.result = intv + smallv;
                    return res;
                }
                catch (e) {
                    return { err: true, result: "^_^ 请尝试输入正确的地址" };
                }
            });
        }
    }
    WebBrowser.GetNep5Info = GetNep5Info;
    class StorageUtil {
        /**
         * setStorage
         */
        setStorage(name, str) {
            localStorage.setItem(name, str);
        }
        /**
         * getStorage
         */
        getStorage(name, decoder) {
            let res = localStorage.getItem(name);
            if (!res) {
                localStorage.setItem(name, "");
            }
            if (decoder) {
                if (!res) {
                    return [];
                }
                let item = localStorage.getItem(name).split(decoder);
                return item;
            }
            else {
                let item = JSON.parse(localStorage.getItem(name));
                return item;
            }
        }
    }
    WebBrowser.StorageUtil = StorageUtil;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
/// <reference path="Util.ts" />
var WebBrowser;
/// <reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
/// <reference path="Util.ts" />
(function (WebBrowser) {
    let ajax = new WebBrowser.Ajax();
    ajax.network = "testnet";
    //主页
    function indexPage() {
        return __awaiter(this, void 0, void 0, function* () {
            //查询区块高度(区块数量-1)
            let blockCount = yield ajax.post('getblockcount', []);
            let blockHeight = blockCount[0]['blockcount'] - 1;
            $("#blockHeight").text(blockHeight.toLocaleString()); //显示在页面
            //查询交易数量
            let txCount = yield ajax.post('gettxcount', []);
            txCount = txCount[0]['txcount'];
            $("#txcount").text(txCount.toLocaleString()); //显示在页面
            //查询地址总数
            let addrCount = yield ajax.post('getaddrcount', []);
            addrCount = addrCount[0]['addrcount'];
            $("#addrCount").text(addrCount.toLocaleString());
            $("#index-page").find("#blocks").children("tbody").empty();
            //分页查询区块数据
            let blocks = yield ajax.post('getblocks', [10, 1]);
            blocks.forEach((item, index, input) => {
                var newDate = new Date();
                newDate.setTime(item.time * 1000);
                let html = '';
                html += '<tr><td><a class="code" class="code" target="_blank" rel="external nofollow"  href="./page/blockInfo.html?index=' + item.index + '">';
                html += item.index + '</a></td><td>' + item.size + ' bytes</td><td>';
                html += newDate.toLocaleString() + '</td>';
                html += '<td>' + item.tx.length + '</td></tr>';
                $("#index-page").find("#blocks").append(html);
            });
            //分页查询交易记录
            let txs = yield ajax.post('getrawtransactions', [10, 1]);
            $("#index-page").find("#transactions").children("tbody").empty();
            txs.forEach((tx) => {
                let txid = tx.txid;
                txid = txid.replace('0x', '');
                txid = txid.substring(0, 4) + '...' + txid.substring(txid.length - 4);
                let html = "";
                html += "<tr>";
                html += "<td><a class='code' class='code' target='_blank' rel='external nofollow'  href='./page/txInfo.html?txid=" + tx.txid + "'>" + txid + "</a>";
                html += "</td>";
                html += "<td>" + tx.type.replace("Transaction", "");
                html += "</td>";
                html += "<td>" + tx.blockindex;
                html += "</td>";
                html += "<td>" + tx.size + " bytes";
                html += "</td>";
                html += "</tr>";
                $("#index-page").find("#transactions").children("tbody").append(html);
            });
        });
    }
    ;
    //区块列表
    function blocksPage() {
        return __awaiter(this, void 0, void 0, function* () {
            //查询区块数量
            let blockCount = yield ajax.post('getblockcount', []);
            //分页查询区块数据
            let pageUtil = new WebBrowser.PageUtil(blockCount[0]['blockcount'], 15);
            let block = new WebBrowser.BlockPage();
            block.updateBlocks(pageUtil);
            //监听下一页
            $("#blocks-page").find("#next").click(() => {
                if (pageUtil.currentPage == pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                    return;
                }
                pageUtil.currentPage += 1;
                block.updateBlocks(pageUtil);
            });
            $("#blocks-page").find("#previous").click(() => {
                if (pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                    return;
                }
                pageUtil.currentPage -= 1;
                block.updateBlocks(pageUtil);
            });
        });
    }
    $(() => {
        let page = $('#page').val();
        let locationutil = new WebBrowser.LocationUtil();
        let hash = location.hash;
        redirect(hash);
        new WebBrowser.SearchController();
        if (page === 'txInfo') {
            let txid = locationutil.GetQueryString("txid");
            let ts = new WebBrowser.TrasctionInfo();
            ts.updateTxInfo(txid);
        }
        if (page === 'blockInfo') {
            let index = Number(locationutil.GetQueryString("index"));
            let block = new WebBrowser.BlockPage();
            block.queryBlock(index);
        }
        if (page === 'addrInfo') {
            let addr = locationutil.GetQueryString("addr");
            let addrInfo = new WebBrowser.AddressControll(addr);
            addrInfo.addressInfo();
        }
    });
    function redirect(page) {
        if (page === '') {
            indexPage();
            $('#index-page').show();
            $("#index-btn").addClass("active");
            $("#brow-btn").removeClass("active");
        }
        else {
            $('#index-page').hide();
            $("#brow-btn").addClass("active");
            $("#index-btn").removeClass("active");
        }
        if (page === '#blocks-page') {
            // let blocks=new BlocksControll();
            // blocks.start();
            blocksPage();
            $(page).show();
            $("#blocks-btn").addClass("active");
        }
        else {
            $('#blocks-page').hide();
            $("#blocks-btn").removeClass("active");
        }
        if (page === '#txlist-page') {
            let ts = new WebBrowser.Trasctions();
            $(page).show();
            $("#txlist-btn").addClass("active");
        }
        else {
            $('#txlist-page').hide();
            $("#txlist-btn").removeClass("active");
        }
        if (page === '#addrs-page') {
            let addrlist = new WebBrowser.addrlistControll();
            addrlist.start();
            $(page).show();
            $("#addrs-btn").addClass("active");
        }
        else {
            $('#addrs-page').hide();
            $("#addrs-btn").removeClass("active");
        }
        if (page === '#asset-page') {
            //启动asset管理器
            let assetControll = new WebBrowser.AssetControll();
            assetControll.allAsset();
            $(page).show();
            $("#asset-btn").addClass("active");
            $("#brow-btn").removeClass("active");
        }
        else {
            $('#asset-page').hide();
            $("#asset-btn").removeClass("active");
        }
        if (page == "#wallet-page") {
            //let wallet: WalletControll = new WalletControll();
            //$(page).show();
            $("#wallet-btn").addClass("active");
            $("#brow-btn").removeClass("active");
        }
        else {
            $("#wallet-page").hide();
            $("#wallet-btn").removeClass("active");
        }
    }
    function onhash() {
        let hash = location.hash;
        redirect(hash);
    }
    window.onload = () => {
        document.getElementsByTagName("body")[0].onhashchange = () => { onhash(); };
        WebBrowser.WWW.rpc_getURL();
        $("#searchText").focus(() => {
            $("#nel-search").addClass("nel-input");
        });
        $("#searchText").focusout(() => {
            $("#nel-search").removeClass("nel-input");
        });
    };
})(WebBrowser || (WebBrowser = {}));
// import * as $ from "jquery";
/// <reference types="jquery" />
var WebBrowser;
// import * as $ from "jquery";
/// <reference types="jquery" />
(function (WebBrowser) {
    class BlockPage {
        constructor() {
            $("#searchBtn").click(() => {
                window.location.href = './blockInfo.html?index=' + $("#searchText").val();
            });
        }
        updateBlocks(pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                let ajax = new WebBrowser.Ajax();
                let blocks = yield ajax.post('getblocks', [pageUtil.pageSize, pageUtil.currentPage]);
                console.log("blocks-page");
                $("#blocks-page").children("table").children("tbody").empty();
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#blocks-page").find("#next").removeClass('disabled');
                }
                else {
                    $("#blocks-page").find("#next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#blocks-page").find("#previous").removeClass('disabled');
                }
                else {
                    $("#blocks-page").find("#previous").addClass('disabled');
                }
                let newDate = new Date();
                blocks.forEach((item, index, input) => {
                    newDate.setTime(item.time * 1000);
                    let html;
                    html += '<tr><td>';
                    html += '<a href="./page/blockInfo.html?index=' + item.index + '">';
                    html += item.index + '</a></td><td>' + item.size;
                    html += ' bytes</td><td>' + newDate.toLocaleString() + '</td></tr>';
                    $("#blocks-page").find("tbody").append(html);
                });
            });
        }
        queryBlock(index) {
            return __awaiter(this, void 0, void 0, function* () {
                let ajax = new WebBrowser.Ajax();
                let newDate = new Date();
                let blocks = yield ajax.post('getblock', [index]);
                let block = blocks[0];
                console.log(block);
                newDate.setTime(block.time * 1000);
                $("#hash").text(block.hash);
                $("#size").text(block.size + ' byte');
                $("#time").text(newDate.toLocaleString());
                $("#version").text(block.version);
                $("#index").text(block.index);
                let txs = block.tx;
                txs.forEach(tx => {
                    $("#txs").append('<tr><td><a href="./txInfo.html?txid=' + tx.txid + '">' + tx.txid + '</a></td><td>' + tx.type + '</td><td>' + tx.size + ' bytes</td><td>' + tx.version + '</td></tr>');
                });
            });
        }
    }
    WebBrowser.BlockPage = BlockPage;
})(WebBrowser || (WebBrowser = {}));
/**
 * @private currentPage 当前页
 * @private pageSize 每页条数
 * @private totalCount 总记录数
 * @private currentPage 当前页
 */
var WebBrowser;
/**
 * @private currentPage 当前页
 * @private pageSize 每页条数
 * @private totalCount 总记录数
 * @private currentPage 当前页
 */
(function (WebBrowser) {
    class PageUtil {
        /**
         *
         * @param total 总记录数
         * @param pageSize 每页条数
         */
        constructor(total, pageSize) {
            this._currentPage = 1;
            this._totalCount = total;
            this._pageSize = pageSize;
            this._totalPage = total % pageSize == 0 ? total / pageSize : Math.ceil((total / pageSize));
        }
        ;
        /**
         * currentPage 返回当前页码
         */
        get currentPage() {
            return this._currentPage;
        }
        /**
         *
         */
        set currentPage(currentPage) {
            this._currentPage = currentPage;
        }
        /**
         * pageSize 每页条数
         */
        get pageSize() {
            return this._pageSize;
        }
        /**
         * set count
         */
        set pageSize(pageSize) {
            this._pageSize = pageSize;
        }
        /**
         * pageSize 每页条数
         */
        get totalCount() {
            return this._totalCount;
        }
        /**
         * set count
         */
        set totalCount(totalCount) {
            this._totalCount = totalCount;
        }
        /**
     * pageSize 总页数
     */
        get totalPage() {
            this._totalPage = this._totalCount % this._pageSize == 0 ? this._totalCount / this._pageSize : Math.ceil(this._totalCount / this._pageSize);
            return this._totalPage;
        }
    }
    WebBrowser.PageUtil = PageUtil;
    class Nep5as {
    }
    WebBrowser.Nep5as = Nep5as;
    let AssetEnum;
    (function (AssetEnum) {
        AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
    })(AssetEnum = WebBrowser.AssetEnum || (WebBrowser.AssetEnum = {}));
    class TableMode {
        constructor(ths, tds, tableId) {
            this.ths = ths;
            this.tds = tds;
            this.tablId = tableId;
        }
    }
    WebBrowser.TableMode = TableMode;
    class Detail {
        constructor(address, height, balances) {
            this.address = address;
            this.height = height;
            this.balances = balances;
        }
    }
    WebBrowser.Detail = Detail;
    WebBrowser.network = "testnet";
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class UTXO {
    }
    WebBrowser.UTXO = UTXO;
    class CoinTool {
        static initAllAsset() {
            return __awaiter(this, void 0, void 0, function* () {
                var allassets = yield WebBrowser.WWW.api_getAllAssets();
                for (var a in allassets) {
                    var asset = allassets[a];
                    var names = asset.name;
                    var id = asset.id;
                    var name = "";
                    if (id == CoinTool.id_GAS) {
                        name = "GAS";
                    }
                    else if (id == CoinTool.id_NEO) {
                        name = "NEO";
                    }
                    else {
                        for (var i in names) {
                            name = names[i].name;
                            if (names[i].lang == "en")
                                break;
                        }
                    }
                    CoinTool.assetID2name[id] = name;
                    CoinTool.name2assetID[name] = id;
                }
            });
        }
        static makeTran(utxos, targetaddr, assetid, sendcount) {
            if (sendcount.compareTo(Neo.Fixed8.Zero) <= 0)
                throw new Error("can not send zero.");
            var tran = new ThinNeo.Transaction();
            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0; //0 or 1
            tran.extdata = null;
            tran.attributes = [];
            tran.inputs = [];
            var scraddr = "";
            utxos[assetid].sort((a, b) => {
                return a.count.compareTo(b.count);
            });
            var us = utxos[assetid];
            var count = Neo.Fixed8.Zero;
            for (var i = 0; i < us.length; i++) {
                var input = new ThinNeo.TransactionInput();
                input.hash = us[i].txid.hexToBytes().reverse();
                input.index = us[i].n;
                input["_addr"] = us[i].addr; //利用js的隨意性，臨時傳個值
                tran.inputs.push(input);
                count = count.add(us[i].count);
                scraddr = us[i].addr;
                if (count.compareTo(sendcount) > 0) {
                    break;
                }
            }
            if (count.compareTo(sendcount) >= 0) {
                tran.outputs = [];
                //输出
                var output = new ThinNeo.TransactionOutput();
                output.assetId = assetid.hexToBytes().reverse();
                output.value = sendcount;
                output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                tran.outputs.push(output);
                //找零
                var change = count.subtract(sendcount);
                if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                    var outputchange = new ThinNeo.TransactionOutput();
                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                    outputchange.value = change;
                    outputchange.assetId = assetid.hexToBytes().reverse();
                    tran.outputs.push(outputchange);
                }
            }
            else {
                throw new Error("no enough money.");
            }
            return tran;
        }
    }
    CoinTool.id_GAS = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
    CoinTool.id_NEO = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
    CoinTool.assetID2name = {};
    CoinTool.name2assetID = {};
    WebBrowser.CoinTool = CoinTool;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class WWW {
        static makeRpcUrl(url, method, ..._params) {
            if (url[url.length - 1] != '/')
                url = url + "/";
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++) {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
        }
        static makeRpcPostBody(method, ..._params) {
            var body = {};
            body["jsonrpc"] = "2.0";
            body["id"] = 1;
            body["method"] = method;
            var params = [];
            for (var i = 0; i < _params.length; i++) {
                params.push(_params[i]);
            }
            body["params"] = params;
            return body;
        }
        static api_getHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl(WWW.api, "getblockcount");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                var height = parseInt(r[0]["blockcount"]) - 1;
                return height;
            });
        }
        static api_getAllAssets() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl(WWW.api, "getallasset");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getUTXO(address) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl(WWW.api, "getutxo", address);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static rpc_postRawTransaction(data) {
            return __awaiter(this, void 0, void 0, function* () {
                var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
                var result = yield fetch(WWW.rpc, { "method": "post", "body": JSON.stringify(postdata) });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static rpc_getURL() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl(WWW.api, "getnoderpcapi");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"][0];
                var url = r.nodeList[0];
                WWW.rpc = url;
                WWW.rpcName = r.nodeType;
                return url;
            });
        }
        static rpc_getHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl(WWW.rpc, "getblockcount");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                var height = parseInt(r) - 1;
                return height;
            });
        }
    }
    WWW.api = "http://47.96.168.8:81/api/testnet";
    WWW.rpc = "";
    WWW.rpcName = "";
    WebBrowser.WWW = WWW;
})(WebBrowser || (WebBrowser = {}));
/// <reference types="jquery" />
/// <reference path="./tools/cointool.ts" />
/// <reference path="./tools/wwwtool.ts" />
var WebBrowser;
/// <reference types="jquery" />
/// <reference path="./tools/cointool.ts" />
/// <reference path="./tools/wwwtool.ts" />
(function (WebBrowser) {
    class SearchController {
        constructor() {
            this.locationUtil = new WebBrowser.LocationUtil();
            let page = $('#page').val().toString();
            let url = "";
            let neoUtil = new WebBrowser.NeoUtil();
            if (page == 'index') {
                url = './page/';
            }
            else {
                url = './';
            }
            $("#searchBtn").click(() => {
                let search = $("#searchText").val().toString();
                if (search.length == 34) {
                    if (neoUtil.verifyPublicKey(search)) {
                        window.open(url + 'address.html?addr=' + search);
                    }
                    else {
                        alert('请输入正确的地址');
                    }
                }
                search = search.replace('0x', '');
                if (search.length == 64) {
                    window.open(url + 'txInfo.html?txid=' + search);
                }
                if (!isNaN(Number(search))) {
                    window.open(url + 'blockInfo.html?index=' + search);
                }
            });
        }
    }
    WebBrowser.SearchController = SearchController;
    class AddressControll {
        constructor(address) {
            this.ajax = new WebBrowser.Ajax();
            this.address = address;
            $("#nep5-btn").click(() => {
                this.nep5Info();
            });
            this.ajax.network = WebBrowser.network;
        }
        /**
         * queryNep5AssetById
         */
        queryNep5AssetById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let getNep5 = new WebBrowser.GetNep5Info();
                let res;
                try {
                    res = yield getNep5.getInfo(id);
                    let name = res.result["name"];
                    let symbol = res.result["symbol"];
                }
                catch (error) {
                    alert("^_^ 请尝试输入正确的资产id");
                    return;
                }
                try {
                    let balance = yield getNep5.getBalance(id, this.address);
                    res.result.balance = balance.result;
                    return res;
                }
                catch (error) {
                    alert("^_^ 请尝试输入正确的地址");
                    return;
                }
            });
        }
        initNep5Asset() {
            return __awaiter(this, void 0, void 0, function* () {
                let stouitl = new WebBrowser.StorageUtil();
                let asids = stouitl.getStorage("assetIds_nep5", "|");
                if (asids.length == 0) {
                    return;
                }
                else {
                    try {
                        let ress = new Array();
                        for (let index = 0; index < asids.length; index++) {
                            let res = yield this.queryNep5AssetById(asids[index]);
                            console.log(res.result["balance"]);
                            if (res.result["balance"])
                                ress.push(res);
                        }
                        if (ress.length)
                            this.addInfo.initNep5(ress);
                    }
                    catch (error) {
                        console.error("查询nep5资产出错");
                    }
                }
            });
        }
        /**
         * nep5Info
         */
        nep5Info() {
            return __awaiter(this, void 0, void 0, function* () {
                let asset = $("#nep5-text").val().toString();
                let stouitl = new WebBrowser.StorageUtil();
                if (asset.length < 1)
                    alert("请输入资产id");
                try {
                    let res = yield this.queryNep5AssetById(asset);
                    this.addInfo.loadNep5(res.result["name"], res.result["symbol"], res.result["balance"]);
                    let asids = stouitl.getStorage("assetIds_nep5", "|");
                    if (!asids.find(as => as == asset)) {
                        asids.push(asset);
                        stouitl.setStorage("assetIds_nep5", asids.join('|'));
                    }
                }
                catch (err) {
                    console.error("查询nep5资产出错");
                }
            });
        }
        /**
         *
         */
        addressInfo() {
            return __awaiter(this, void 0, void 0, function* () {
                let balances = yield this.ajax.post('getbalance', [this.address]).catch((e) => {
                    alert(e);
                });
                ;
                if (balances.length < 1) {
                    alert("当前地址余额为零");
                }
                balances.map((balance) => {
                    if (balance.asset == WebBrowser.AssetEnum.NEO) {
                        balance.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (balance.asset == WebBrowser.AssetEnum.GAS) {
                        balance.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                let utxo = yield this.ajax.post('getutxo', [this.address]).catch((e) => {
                    alert(e);
                });
                let allAsset = yield this.ajax.post('getallasset', []);
                allAsset.map((asset) => {
                    if (asset.id == WebBrowser.AssetEnum.NEO) {
                        asset.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (asset.id == WebBrowser.AssetEnum.GAS) {
                        asset.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                utxo.map((item) => {
                    item.asset = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name; }).join("|");
                });
                this.addInfo = new WebBrowser.AddressInfoView(balances, utxo, this.address);
                this.addInfo.loadView(); //加载页面
                this.initNep5Asset();
            });
        }
    }
    WebBrowser.AddressControll = AddressControll;
    //地址列表
    class addrlistControll {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
            this.ajax.network = WebBrowser.network;
            $("#addrs-page").find("#next").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                    return;
                }
                else {
                    this.pageUtil.currentPage += 1;
                    this.addrlistInit();
                }
            });
            $("#addrs-page").find("#previous").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                    return;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    this.addrlistInit();
                }
            });
        }
        /**
         * addrlistInit
         */
        addrlistInit() {
            return __awaiter(this, void 0, void 0, function* () {
                let addrcount = yield this.ajax.post('getaddrcount', []).catch((e) => {
                    alert(e);
                });
                if (addrcount.length == 0) {
                    alert('此地址余额为空，utxo为空');
                }
                this.pageUtil.totalCount = addrcount[0]['addrcount'];
                let addrlist = yield this.ajax.post('getaddrs', [this.pageUtil.pageSize, this.pageUtil.currentPage]);
                let newDate = new Date();
                addrlist.map((item) => {
                    newDate.setTime(item.firstuse.blocktime.$date);
                    item.firstDate = newDate.toLocaleString();
                    newDate.setTime(item.lastuse.blocktime.$date);
                    item.lastDate = newDate.toLocaleString();
                });
                let view = new WebBrowser.AddrlistView();
                view.loadView(addrlist);
                WebBrowser.pageCut(this.pageUtil);
            });
        }
        /**
         * start
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                let prom = yield this.ajax.post('getaddrcount', []);
                this.pageUtil = new WebBrowser.PageUtil(prom[0]['addrcount'], 15);
                this.addrlistInit();
            });
        }
    }
    WebBrowser.addrlistControll = addrlistControll;
    //资产页面管理器
    class AssetControll {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
            this.ajax.network = WebBrowser.network;
        }
        allAsset() {
            return __awaiter(this, void 0, void 0, function* () {
                let allAsset = yield this.ajax.post('getallasset', []);
                allAsset.map((asset) => {
                    if (asset.id == WebBrowser.AssetEnum.NEO) {
                        asset.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (asset.id == WebBrowser.AssetEnum.GAS) {
                        asset.name = [{ lang: 'en', name: "GAS" }];
                    }
                    let name = asset.name.map((name) => { return name.name; });
                    asset.names = name.join("|");
                });
                let nep5Info = new WebBrowser.GetNep5Info();
                let storutil = new WebBrowser.StorageUtil();
                let nep5asids = storutil.getStorage("assetIds_nep5", "|");
                let nep5s = new Array();
                for (let n = 0; n < nep5asids.length; n++) {
                    let res = yield nep5Info.getInfo(nep5asids[n]);
                    let assetnep5 = new WebBrowser.Nep5as();
                    if (!res.err) {
                        assetnep5.names = res.result["name"];
                        assetnep5.type = res.result["symbol"];
                        assetnep5.amount = res.result["totalsupply"];
                        assetnep5.id = nep5asids[n];
                    }
                    nep5s.push(assetnep5);
                }
                let assetView = new WebBrowser.AssetsView(allAsset, nep5s);
                yield assetView.loadView(); //调用loadView方法渲染页面
            });
        }
    }
    WebBrowser.AssetControll = AssetControll;
    class BlocksControll {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
            this.ajax.network = WebBrowser.network;
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
            this.next.onclick = () => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                    return;
                }
                else {
                    this.pageUtil.currentPage += 1;
                    this.blocksInit();
                }
            };
            this.previous.onclick = () => {
                if (this.pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                    return;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    this.blocksInit();
                }
            };
        }
        /**
         * blocksInit
         */
        blocksInit() {
            return __awaiter(this, void 0, void 0, function* () {
                //分页查询区块数据
                let blocks = yield this.ajax.post('getblocks', [
                    this.pageUtil.pageSize,
                    this.pageUtil.currentPage
                ]);
                let ths = new Map();
                let tds = new Array();
                ths.set('index', 'index');
                ths.set('size', 'size');
                ths.set('time', 'time');
                ths.set('txnumber', 'txnumber');
                let newDate = new Date();
                blocks.forEach((block) => {
                    let td = new Map();
                    newDate.setTime(block.time * 1000);
                    let a = '<a href="./page/blockInfo.html?index=' + block.index + '">';
                    a += block.index + '</a>';
                    td.set('index', a);
                    td.set('size', block.size);
                    td.set('time', newDate.toLocaleString());
                    td.set('txnumber', block.tx.length);
                    tds.push(td);
                });
                let tbmode = new WebBrowser.TableMode(ths, tds, "blocklist");
                let blocksView = new WebBrowser.BlocksView(tbmode, this.next, this.previous, this.text);
                blocksView.loadView(this.pageUtil);
            });
        }
        /**
         * start
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                //查询区块数量
                let blockCount = yield this.ajax.post('getblockcount', []);
                this.pageUtil = new WebBrowser.PageUtil(blockCount[0]['blockcount'], 15);
                this.blocksInit();
            });
        }
    }
    WebBrowser.BlocksControll = BlocksControll;
    class WalletControll {
        constructor() {
            this.neoUtil = new WebBrowser.NeoUtil();
            this.walletview = new WebBrowser.WalletView();
            this.ajax = new WebBrowser.Ajax();
            this.ajax.network = WebBrowser.network;
            $("#import-wif").click(() => {
                $("#importWif").modal('show');
            });
            this.wifInput = $('#importWif').find("#wif-input").children('input');
            $("#import-nep2").click(() => {
                $("#importNep2").modal('show');
            });
            $("#import-nep6").click(() => {
                $("#importNep6").modal('show');
            });
            $("#send-nep2").click(() => {
                this.nep2init();
            });
            $('#send-wif').click(() => {
                // alert(this.wifInput.val().toString());
                let res = this.verifWif();
                if (res.err) {
                }
                else {
                    this.details(res.result["address"]).then(() => {
                        $("#wallet-details").empty();
                        $("#importWif").modal('hide');
                    })
                        .catch((err) => {
                        alert(err);
                    });
                }
            });
            this.nep6Init();
            $("#send-transfer").click(() => {
                this.tranfer();
            });
        }
        /**
         * nep6Init
         */
        nep6Init() {
            let file = document.getElementById("nep6-select");
            var wallet;
            var reader = new FileReader();
            reader.onload = (e) => {
                var walletstr = reader.result;
                wallet = new ThinNeo.nep6wallet();
                wallet.fromJsonStr(walletstr);
                var textContent = "";
                for (var i = 0; i < wallet.accounts.length; i++) {
                    textContent += wallet.accounts[i].address;
                    if (wallet.accounts[i].nep2key != null)
                        textContent += "(have key)";
                    textContent += "\r\n";
                }
                // alert(2+":"+textContent);
            };
            file.onchange = (ev) => {
                if (file.files[0].name.includes(".json")) {
                    // alert("1:json");
                    reader.readAsText(file.files[0]);
                }
            };
            $("#send-nep6").click(() => {
                let password = $("#nep6-password").val().toString();
                this.neoUtil.nep6Load(wallet, password)
                    .then((res) => {
                    console.log("成功返回：" + res.result[0]);
                    $('#importNep6').modal('hide');
                    if (res.result.length > 1) {
                        let addrs = res.result.map(item => { return item.address; });
                        this.walletview.showSelectAddrs(addrs);
                    }
                    if (!res.err) {
                        $("#wallet-details").empty();
                        res.result.forEach((result) => {
                            this.details(result["address"]);
                        });
                        this.loadKeys = res.result;
                    }
                })
                    .catch((err) => {
                    alert("失败");
                    console.log("失败：" + err.result);
                });
            });
            $("#send-Addr").click(() => {
                let addr = $('#selectAddress input[name="addrRadio"]:checked ').val().toString();
                this.details(addr);
                $("#selectAddr").modal("hide");
            });
        }
        /**
         * nep2init
         */
        nep2init() {
            return __awaiter(this, void 0, void 0, function* () {
                let nep2 = $("#nep2-string").val().toString();
                let password = $("#nep2-password").val().toString();
                try {
                    let res = yield this.neoUtil.nep2ToWif(nep2, password);
                    console.log(res);
                    if (!res.err) {
                        $("#importNep2").modal('hide');
                        $("#wallet-details").empty();
                        this.details(res.result["address"]);
                    }
                }
                catch (err) {
                    console.log("err:" + err);
                }
            });
        }
        /**
         * details
         */
        details(address) {
            return __awaiter(this, void 0, void 0, function* () {
                this.address = address;
                let height = 0;
                try {
                    let balances = yield this.ajax.post('getbalance', [address]);
                    balances.map((balance) => {
                        if (balance.asset == WebBrowser.AssetEnum.NEO) {
                            balance.name = [{ lang: 'en', name: 'NEO' }];
                        }
                        if (balance.asset == WebBrowser.AssetEnum.GAS) {
                            balance.name = [{ lang: 'en', name: "GAS" }];
                        }
                    });
                    let blockCount = yield this.ajax.post('getblockcount', []);
                    let blockHeight = blockCount[0]['blockcount'] - 1;
                    let detail = new WebBrowser.Detail(address, blockHeight, balances);
                    this.walletview.showDetails(detail);
                    try {
                        let allAsset = yield this.ajax.post('getallasset', []);
                        allAsset.map((asset) => {
                            if (asset.id == WebBrowser.AssetEnum.NEO) {
                                asset.name = [{ lang: 'en', name: 'NEO' }];
                            }
                            if (asset.id == WebBrowser.AssetEnum.GAS) {
                                asset.name = [{ lang: 'en', name: "GAS" }];
                            }
                        });
                        var utxos = yield WebBrowser.WWW.api_getUTXO(address);
                        this.utxos = utxos;
                        utxos.map((item) => {
                            item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name; }).join("|");
                        });
                        this.walletview.showUtxo(utxos);
                        $("#wallet-details").show();
                        $("#wallet-utxo").show();
                        $("#wallet-transaction").show();
                    }
                    catch (error) {
                    }
                }
                catch (error) {
                }
            });
        }
        /**
         * 验证
         */
        verifWif() {
            var wif = this.wifInput.val().toString();
            let result;
            if (wif.length) {
                try {
                    let result = this.neoUtil.wifDecode(wif);
                    if (result.err) {
                        $("#wif-input").addClass("has-error");
                        $("#wif-input").children("p").text("请输入正确的WIF");
                        return result;
                    }
                    else {
                        $("#wif-input").addClass("has-success");
                        $("#wif-input").removeClass("has-error");
                        $("#wif-input").children("p").text("验证通过");
                        return result;
                    }
                }
                catch (error) {
                    result = { err: true, result: error.message };
                    return result;
                }
            }
            else {
                $("#wif-input").removeClass("has-error has-success");
                $("#wif-input").addClass("has-error");
                $("#wif-input").children("p").text("不得为空");
                result = { err: true, result: "wif is null" };
                return result;
            }
        }
        getassets() {
            // var utxos = this.utxos;
            var assets = {};
            for (var i in this.utxos) {
                var item = this.utxos[i];
                var txid = item.txid;
                var n = item.n;
                var asset = item.asset;
                var count = item.value;
                if (assets[asset] == undefined) {
                    assets[asset] = [];
                }
                var utxo = new WebBrowser.UTXO();
                utxo.addr = item.addr;
                utxo.asset = asset;
                utxo.n = n;
                utxo.txid = txid;
                utxo.count = Neo.Fixed8.parse(count);
                assets[asset].push(utxo);
            }
            return assets;
        }
        /**
         * tranfer
         */
        tranfer() {
            return __awaiter(this, void 0, void 0, function* () {
                var targetaddr = $("#targetaddr").val().toString();
                var asset = $("#transfer-asset").val().toString();
                yield WebBrowser.CoinTool.initAllAsset();
                var assetid = WebBrowser.CoinTool.name2assetID[asset];
                var count = $("#transfer-amount").val().toString();
                var utxos = this.getassets();
                var _count = Neo.Fixed8.parse(count);
                var tran = WebBrowser.CoinTool.makeTran(utxos, targetaddr, assetid, _count);
                // console.log(tran);
                let type = ThinNeo.TransactionType[tran.type].toString();
                let version = tran.version.toString();
                let inputcount = tran.inputs.length;
                var inputAddrs = [];
                //輸入顯示
                $("#transactionInfo").empty();
                $("#transactionInfo").append('<li class="list-group-item">type: ' + type + '</li>');
                $("#transactionInfo").append('<li class="list-group-item">version: ' + version + '</li>');
                $("#transactionInfo").append('<li class="list-group-item">inputcount: ' + inputcount + '</li>');
                for (var i = 0; i < tran.inputs.length; i++) {
                    var _addr = tran.inputs[i]["_addr"];
                    if (inputAddrs.indexOf(_addr) < 0) {
                        inputAddrs.push(_addr);
                    }
                    //必须clone后翻转,因爲這個hash是input的成員，直接反轉會改變它
                    var rhash = tran.inputs[i].hash.clone().reverse();
                    var inputhash = rhash.toHexString();
                    var outstr = "    input[" + i + "]" + inputhash + "(" + tran.inputs[i].index + ")";
                    var txid = inputhash;
                    $("#transactionInfo").append('<li class="list-group-item"><a class="code" href="http://be.nel.group/page/txInfo.html?txid=' + inputhash + '">' + outstr + '</a></li>');
                }
                for (var i = 0; i < tran.outputs.length; i++) {
                    var addrt = tran.outputs[i].toAddress;
                    var address = ThinNeo.Helper.GetAddressFromScriptHash(addrt);
                    // var a = lightsPanel.QuickDom.addA(this.panel, "    outputs[" + i + "]" + address, "http://be.nel.group/page/address.html?addr=" + address);
                    // a.target = "_blank";
                    var outputs = "outputs[" + i + "]" + address;
                    $("#transactionInfo").append('<li class="list-group-item"><a class="code" href="http://be.nel.group/page/address.html?addr=' + address + '">' + outputs + '</a></li>');
                    var assethash = tran.outputs[i].assetId.clone().reverse();
                    var assetid = "0x" + assethash.toHexString();
                    if (inputAddrs.length == 1 && address == inputAddrs[0]) {
                        // lightsPanel.QuickDom.addSpan(this.panel, "    (change)" + CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString());
                        var addr = "(change)" + WebBrowser.CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString();
                        $("#transactionInfo").append('<li class="list-group-item">' + addr + '</li>');
                    }
                    else {
                        // lightsPanel.QuickDom.addSpan(this.panel, "    " + CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString());
                        var addr = WebBrowser.CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString();
                        $("#transactionInfo").append('<li class="list-group-item">' + addr + '</li>');
                    }
                    // lightsPanel.QuickDom.addElement(this.panel, "br");
                }
                let msg = tran.GetMessage();
                var msglen = msg.length;
                var txid = tran.GetHash().toHexString();
                $("#transactionInfo").append("<li class='list-group-item code'>--this TXLen=" + msglen + "--this TXID=" + txid + "</li>");
                for (var i = 0; i < inputAddrs.length; i++) {
                    let must = "must witness[" + i + "]=" + inputAddrs[i];
                    $("#transactionInfo").append("<li class='list-group-item code'>" + must + "</li>");
                }
                $("#Sing-send").click(() => {
                    tran.witnesses = [];
                    this.setTran(tran, inputAddrs);
                });
            });
        }
        setTran(tran, inputaddr) {
            $("#sign").show();
            if (tran.witnesses == null)
                tran.witnesses = [];
            let txid = tran.GetHash().clone().reverse().toHexString();
            $("#Sign-list").empty();
            this.setPanelList("Sign-list", '<a href="http://be.nel.group/page/txInfo.html?txid=' + txid + '">TXID:' + txid + '</a>');
            this.setPanelList("Sign-list", "need witness:");
            for (var i = 0; i < inputaddr.length; i++) {
                this.setPanelList("Sing-list", "Withess[" + i + "]:" + inputaddr[i]);
                var hadwit = false;
                for (var w = 0; w < tran.witnesses.length; w++) {
                    if (tran.witnesses[w].Address == inputaddr[i]) {
                        //m
                        this.setPanelList("Sing-list", "V_script:" + tran.witnesses[w].VerificationScript.toHexString());
                        this.setPanelList("Sing-list", "I_script:" + tran.witnesses[w].InvocationScript.toHexString());
                        this.setPanelList("Sing-list", "delete witness");
                        let witi = w;
                        this.setPanelList("Sing-list", "<button id='del-witness' class='btn btn-info'>delete witness</button>");
                        $("#del-witness").click(() => {
                            tran.witnesses.splice(witi, 1);
                            this.setTran(tran, inputaddr);
                            return;
                        });
                        // btn.onclick = () =>
                        // {
                        //     tran.witnesses.splice(witi, 1);
                        //     this.setTran(tran, inputaddr);
                        //     return;
                        // };
                        hadwit = true;
                        break;
                    }
                }
                if (hadwit == false) {
                    this.setPanelList("Sing-list", "NoWitness");
                    this.setPanelList("Sing-list", "");
                    let loadKey = this.loadKeys.find(load => load.address == this.address);
                    if (inputaddr[i] == loadKey.address) {
                        this.setPanelList("Sign-list", "<button id='addWitness' class='btn btn-info'>Add witness by current key</button>");
                        $("#addWitness").click(() => {
                            var msg = tran.GetMessage();
                            var pubkey = loadKey.pubkey;
                            var signdata = ThinNeo.Helper.Sign(msg, loadKey.prikey);
                            tran.AddWitness(signdata, pubkey, loadKey.address);
                            this.setTran(tran, inputaddr);
                        });
                    }
                }
                $("#btn-boadcast").click(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        var result = yield WebBrowser.WWW.rpc_postRawTransaction(tran.GetRawData());
                        if (result == true) {
                            alert("txid=" + txid);
                        }
                    }
                    catch (error) {
                    }
                }));
            }
        }
        setPanelList(id, value) {
            $("#" + id).append("<li class='list-group-item code'>" + value + "</li>");
        }
    }
    WebBrowser.WalletControll = WalletControll;
})(WebBrowser || (WebBrowser = {}));
// import * as $ from "jquery";
var WebBrowser;
// import * as $ from "jquery";
(function (WebBrowser) {
    class AddressInfoView {
        constructor(balances, utxo, address) {
            this.balances = balances;
            this.address = address;
            this.utxo = utxo;
        }
        /**
         * loadView
         */
        loadView() {
            $("#balance").empty();
            $("#utxos").empty();
            $("#address").text('address | ' + this.address);
            // console.log(this.balances);
            this.balances.forEach((balance) => {
                let html = '';
                let name = balance.name.map((name) => { return name.name; }).join('|');
                html += '<div class="col-md-6">';
                html += '<div class="panel panel-default" style="height:100%">';
                html += '<div class="panel-heading">';
                html += '<h3 class="panel-title">' + name + '</h3>';
                html += '</div>';
                html += '<div id="size" class="panel-body">';
                html += balance.balance;
                html += '</div></div></div>';
                $("#balance").append(html);
            });
            this.utxo.forEach((utxo) => {
                let html = '';
                html += "<tr>";
                html += "<td class='code'>" + utxo.asset;
                html += "</td>";
                html += "<td>" + utxo.value;
                html += "</td>";
                html += "<td><a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid=" + utxo.txid + "'>" + utxo.txid;
                html += "</a>[" + utxo.n + "]</td>";
                html += "</tr>";
                $("#utxos").append(html);
            });
        }
        /**
         * loadNep5
         */
        loadNep5(name, symbol, balance) {
            $("#nep5balance").empty();
            $("#nep5balance").append('<li class="list-group-item">[' + symbol + '] ' + name + ': ' + balance + '</li>');
        }
        /**
         * initNep5
         */
        initNep5(arr) {
            $("#nep5AssetList").empty();
            $("#nep5assets").show();
            arr.forEach(element => {
                let symbol = element.result["symbol"];
                let name = element.result["name"];
                let balance = element.result["balance"];
                $("#nep5AssetList").append('<li class="list-group-item">[' + symbol + '] ' + name + ': ' + balance + '</li>');
            });
        }
    }
    WebBrowser.AddressInfoView = AddressInfoView;
    class AddrlistView {
        constructor() { }
        /**
         * loadView
         */
        loadView(addrlist) {
            $("#addrlist").empty();
            let html = '';
            addrlist.forEach(item => {
                html += '<tr>';
                html += '<td><a class="code" target="_blank" rel="external nofollow" href="./page/address.html?addr=' + item.addr + '">' + item.addr + '</a></td>';
                html += '<td>' + item.firstDate + '</td>';
                html += '<td>' + item.lastDate + '</td>';
                html += '<td>' + item.txcount + '</td>';
                html += '</tr>';
            });
            $('#addrlist').append(html);
        }
    }
    WebBrowser.AddrlistView = AddrlistView;
    class AssetsView {
        constructor(allAsset, nep5s) {
            this.assets = allAsset;
            console.log(nep5s);
            this.nep5s = nep5s;
        }
        /**
         * loadView 页面展现
         */
        loadView() {
            $("#assets").empty();
            $("#nep5ass").empty();
            this.assets.forEach((asset) => {
                let html = '';
                html += '<div class="col-md-4">';
                html += '<div class="panel panel-default" style="height:100%">';
                html += '<div class="panel-heading">';
                html += '<h3 class="panel-title">' + asset.names + '</h3>';
                html += '</div>';
                html += '<ul id="size" class="list-group" >';
                html += '<li class="list-group-item"> 类型: ';
                html += asset.type;
                html += '</li>';
                html += '<li class="list-group-item"> 总量: ';
                html += (asset.amount <= 0 ? asset.available : asset.amount);
                html += '</li>';
                html += '<li class="list-group-item code"> id: ';
                html += asset.id;
                html += '</li>';
                html += '<li class="list-group-item code"> admin: ';
                html += asset.admin;
                html += '</li>';
                html += '</ul></div></div>';
                $("#assets").append(html);
            });
            this.nep5s.forEach((asset) => {
                let html = '';
                html += '<div class="col-md-4">';
                html += '<div class="panel panel-default" style="height:100%">';
                html += '<div class="panel-heading">';
                html += '<h3 class="panel-title">' + asset.names + '</h3>';
                html += '</div>';
                html += '<ul id="size" class="list-group" >';
                html += '<li class="list-group-item"> 类型: ';
                html += asset.type;
                html += '</li>';
                html += '<li class="list-group-item"> 总量: ';
                html += asset.amount;
                html += '</li>';
                html += '<li class="list-group-item code"> id: ';
                html += asset.id;
                html += '</li>';
                html += '</ul></div></div>';
                $("#nep5ass").append(html);
            });
        }
    }
    WebBrowser.AssetsView = AssetsView;
    /**
     * @class 交易记录
     */
    //export class Trasctions
    //{
    //    constructor() { }
    //    //更新交易记录
    //    public loadView(txs: Tx[])
    //    {
    //        $("#transactions").empty();
    //        txs.forEach((tx) =>
    //        {
    //            // console.log(tx);
    //            let html: string = "";
    //            html += "<tr>"
    //            html += "<td><a class='code' href='./txInfo.html?txid=" + tx.txid + "'>" + tx.txid
    //            html += "</a></td>"
    //            html += "<td><a href='./blcokInfo.html?index=" + tx.blockindex + "'>" + tx.blockindex
    //            html += "</a></td>"
    //            html += "<td>" + tx.type
    //            html += "</td>"
    //            html += "<td>" + (tx.gas == undefined ? '0' : tx.gas)
    //            html += "</td>"
    //            html += "<td>" + tx.size + " bytes"
    //            html += "</td>"
    //            html += "</tr>"
    //            $("#transactions").append(html);
    //        });
    //    }
    //}
    class BlocksView {
        constructor(tbmode, next, previous, text) {
            this.next = next;
            this.previous = previous;
            this.text = text;
            this.tbview = new WebBrowser.TableView("blocks-page", tbmode);
            this.tbview.className = "table cool table-hover";
            this.tbview.update();
        }
        /**
         * loadView()
         */
        loadView(pageUtil) {
            this.text.text = "总记录数:" + pageUtil.totalCount + " 总页数:" + pageUtil.totalPage + " 当前页:" + pageUtil.currentPage;
            if (pageUtil.totalPage - pageUtil.currentPage) {
                this.next.classList.remove('disabled');
            }
            else {
                this.next.classList.add('disabled');
            }
            if (pageUtil.currentPage - 1) {
                this.previous.classList.remove('disabled');
            }
            else {
                this.previous.classList.add('disabled');
            }
            this.tbview.update();
        }
    }
    WebBrowser.BlocksView = BlocksView;
    class WalletView {
        constructor() { }
        /**
         * showDetails
         */
        showDetails(detail) {
            $("#wallet-details").empty();
            let html = "";
            let ul = '';
            for (let n = 0; n < detail.balances.length; n++) {
                const balance = detail.balances[n];
                let name = balance.name.map((name) => { return name.name; }).join('|');
                ul += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
            }
            detail.balances.forEach((balance) => {
            });
            html += '<div class="row"><div class=" col-lg-6">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title code" >' + detail.address + '</h3>';
            html += '</div>';
            html += '<div class=" panel-body" >api:' + detail.height + ' </div>';
            html += '</div>';
            html += '</div>';
            html += '<div class=" col-lg-6">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title code" >Balance</h3>';
            html += '</div>';
            html += '<ul id="balance-wallet" class="list-group" >';
            html += ul;
            html += '</ul>';
            html += '</div></div>';
            $("#wallet-details").append(html);
        }
        /**
         * showSelectAddrs
         */
        showSelectAddrs(addrs) {
            $("#selectAddress").empty();
            addrs.forEach((addr) => {
                $("#selectAddress").append('<label><input type="radio" name="addrRadio" id="addrRadio1" value="' + addr + '" aria-label="...">' + addr + '</label>');
            });
            $("#selectAddr").modal("show");
        }
        /**
         * showUtxo
         */
        showUtxo(utxos) {
            $("#wallet-utxos").empty();
            utxos.forEach((utxo) => {
                let html = '';
                html += "<tr>";
                html += "<td class='code'>" + utxo.name;
                html += "</td>";
                html += "<td>" + utxo.value;
                html += "</td>";
                html += "<td><a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid=" + utxo.txid + "'>" + utxo.txid;
                html += "</a>[" + utxo.n + "]</td>";
                html += "</tr>";
                $("#wallet-utxos").append(html);
            });
        }
    }
    WebBrowser.WalletView = WalletView;
})(WebBrowser || (WebBrowser = {}));
// import * as $ from "jquery";
/// <reference path ="Util.ts"/>
var WebBrowser;
// import * as $ from "jquery";
/// <reference path ="Util.ts"/>
(function (WebBrowser) {
    /**
     * @class 交易记录
     */
    class Trasctions {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
            this.ajax.network = WebBrowser.network;
            this.txlist = $("#txlist-page");
            this.start();
            //监听交易列表选择框
            $("#TxType").change(() => {
                this.updateTrasctions(this.pageUtil, $("#TxType").val());
            });
            this.txlist.find("#next").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    alert('当前页已经是最后一页了');
                    return;
                }
                else {
                    this.pageUtil.currentPage += 1;
                    this.updateTrasctions(this.pageUtil, $("#TxType").val());
                }
            });
            this.txlist.find("#previous").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    alert('当前已经是第一页了');
                    return;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    this.updateTrasctions(this.pageUtil, $("#TxType").val());
                }
            });
        }
        //更新交易记录
        updateTrasctions(pageUtil, txType) {
            return __awaiter(this, void 0, void 0, function* () {
                //分页查询交易记录
                let txs = yield this.ajax.post('getrawtransactions', [pageUtil.pageSize, pageUtil.currentPage, txType]);
                this.txlist.find("table").children("tbody").empty();
                txs.forEach((tx) => {
                    let txid = tx.txid;
                    txid = txid.replace('0x', '');
                    txid = txid.substring(0, 6) + '...' + txid.substring(txid.length - 6);
                    let html = "";
                    html += "<tr>";
                    html += "<td><a class='code' target='_blank' rel='external nofollow' href='./page/txInfo.html?txid=" + tx.txid + "'>" + txid;
                    html += "</a></td>";
                    html += "<td><a href='./page/blcokInfo.html?index=" + tx.blockindex + "'>" + tx.blockindex;
                    html += "</a></td>";
                    html += "<td>" + tx.type.replace("Transaction", "");
                    html += "</td>";
                    html += "<td>" + (tx.gas == undefined ? '0' : tx.gas);
                    html += "</td>";
                    html += "<td>" + tx.size + " bytes";
                    html += "</td>";
                    html += "</tr>";
                    this.txlist.find("table").children("tbody").append(html);
                });
                WebBrowser.pageCut(this.pageUtil);
            });
        }
        /**
         * async start
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                let txCount = yield this.ajax.post('gettxcount', []);
                txCount = txCount[0]['txcount'];
                //初始化交易列表
                this.pageUtil = new WebBrowser.PageUtil(txCount, 15);
                this.updateTrasctions(this.pageUtil, $("#TxType").val());
            });
        }
    }
    WebBrowser.Trasctions = Trasctions;
    /**
     * @class 交易详情
     */
    class TrasctionInfo {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
            this.ajax.network = WebBrowser.network;
        }
        updateTxInfo(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                let txInfos = yield this.ajax.post('getrawtransaction', [txid]);
                let txInfo = txInfos[0];
                $("#type").text(txInfo.type.replace("Transaction", ""));
                $("#txInfo").text("Hash: " + txInfo.txid);
                $("#index").text(txInfo.blockindex);
                $("#size").text(txInfo.size + " bytes");
                let allAsset = yield this.ajax.post('getallasset', []);
                allAsset.map((asset) => {
                    if (asset.id == WebBrowser.AssetEnum.NEO) {
                        asset.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (asset.id == WebBrowser.AssetEnum.GAS) {
                        asset.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                let arr = new Array();
                for (let index = 0; index < txInfo.vin.length; index++) {
                    const vin = txInfo.vin[index];
                    try {
                        let txInfos = yield this.ajax.post('getrawtransaction', [vin.txid]);
                        let vout = txInfos[0].vout[vin.vout];
                        let address = vout.address;
                        let value = vout.value;
                        let name = allAsset.find(val => val.id == vout.asset).name.map(name => { return name.name; }).join("|");
                        arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
                    }
                    catch (error) {
                    }
                }
                let array = this.groupByaddr(arr);
                for (let index = 0; index < array.length; index++) {
                    const item = array[index];
                    let html = "";
                    html += '<li class="list-group-item">';
                    html += '<table class="table">';
                    html += '<thead><h4 class="code">' + item.addr + '</h4></thead>';
                    html += '<th>name</th><th>amount</th><th>txid</th>';
                    for (let i = 0; i < item.data.length; i++) {
                        const element = item.data[i];
                        html += '<tr><td>' + element.name + '</td><td>' + element.amount + ' </td><td class="code">' + element.vin + ' [' + element.vout + ']</td></tr>';
                    }
                    html += '</table>';
                    html += '</li>';
                    $("#from").append(html);
                }
                txInfo.vout.forEach(vout => {
                    let name = allAsset.find(val => val.id == vout.asset).name.map(name => name.name).join("|");
                    let sign = "";
                    if (array.find(item => item.addr == vout.address)) {
                        sign = "(change)";
                    }
                    $("#to").append('<li class="list-group-item"><div class="row"><div class="col-md-1"><h4>[' + vout.n + ']</h4></div><div class="col-md-11"><div class="row"><div class="col-md-12">' + name + ' ' + vout.value + sign + ' </div><div class="col-md-12"> <a class="code">' + vout.address + '</a></div></div></div></li>');
                });
            });
        }
        groupByaddr(arr) {
            var map = {}, dest = [];
            for (var i = 0; i < arr.length; i++) {
                var ai = arr[i];
                if (!map[ai.addr]) {
                    dest.push({
                        addr: ai.addr,
                        data: [ai]
                    });
                    map[ai.addr] = ai;
                }
                else {
                    for (var j = 0; j < dest.length; j++) {
                        var dj = dest[j];
                        if (dj.addr == ai.addr) {
                            dj.data.push(ai);
                            break;
                        }
                    }
                }
            }
            return dest;
        }
    }
    WebBrowser.TrasctionInfo = TrasctionInfo;
})(WebBrowser || (WebBrowser = {}));
//# sourceMappingURL=app.js.map