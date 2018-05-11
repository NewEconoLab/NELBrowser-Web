var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var WebBrowser;
(function (WebBrowser) {
    class Block {
        constructor() {
            this.div = document.getElementById("block-info");
            this.footer = document.getElementById('footer-box');
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        start() {
            //this.div.innerHTML = pages.block;
            this.queryBlock(WebBrowser.locationtool.getParam());
            let href = WebBrowser.locationtool.getUrl() + "/blocks";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all blocks</a>';
            $("#goallblock").empty();
            $("#goallblock").append(html);
            $("#block-tran-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                }
                else {
                    this.pageUtil.currentPage += 1;
                    this.updateBlockTrans(this.pageUtil);
                }
            });
            $("#block-tran-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    this.updateBlockTrans(this.pageUtil);
                }
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        queryBlock(index) {
            return __awaiter(this, void 0, void 0, function* () {
                let ajax = new WebBrowser.Ajax();
                let blocks = yield ajax.post('getblock', [index]);
                let block = blocks[0];
                let time = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(block.time * 1000));
                if (location.pathname == '/zh/') {
                    let newDate = new Date();
                    newDate.setTime(block.time * 1000);
                    time = newDate.toLocaleString();
                }
                $("#hash").text(block.hash);
                $("#size").text(block.size + ' byte');
                $("#time").text(time);
                $("#version").text(block.version);
                $("#index").text(block.index);
                //`<a href="`+ Url.href_block(item.index) + `" target="_self">`
                $("#previos-block").html(`<a href="` + WebBrowser.Url.href_block(block.index - 1) + `" target="_self">` + (block.index - 1) + `</a>`);
                $("#next-block").html(`<a href="` + WebBrowser.Url.href_block(block.index + 1) + `" target="_self">` + (block.index + 1) + `</a>`);
                this.txs = block.tx;
                let txsLength = this.txs.length;
                this.pageUtil = new WebBrowser.PageUtil(this.txs.length, 10);
                if (txsLength > this.pageUtil.pageSize) {
                    $(".block-tran-page").show();
                }
                else {
                    $(".block-tran-page").hide();
                }
                this.updateBlockTrans(this.pageUtil);
            });
        }
        updateBlockTrans(pageUtil) {
            $("#txs").empty();
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > pageUtil.pageSize) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            else {
                maxNum = pageUtil.totalCount;
            }
            let arrtxs = new Array();
            for (let i = minNum; i < maxNum; i++) {
                arrtxs.push(this.txs[i]);
            }
            arrtxs.forEach(tx => {
                var id = tx.txid.replace('0x', '');
                id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
                this.loadBlockTransView(tx.txid, id, tx.type, tx.size, tx.version);
            });
            let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#block-tran-msg").html(pageMsg);
            if (pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#block-tran-next").removeClass('disabled');
            }
            else {
                $("#block-tran-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#block-tran-previous").removeClass('disabled');
            }
            else {
                $("#block-tran-previous").addClass('disabled');
            }
        }
        loadBlockTransView(txid, id, type, size, version) {
            let html = `
                    <tr>
                        <td><a href="` + WebBrowser.Url.href_transaction(txid) + `" target="_self">` + id + `</a></td>
                        <td>` + type.replace("Transaction", "") + `</td>
                        <td>` + size + ` bytes</td>
                        <td>` + version + `</td>
                    </tr>`;
            $("#txs").append(html);
        }
    }
    WebBrowser.Block = Block;
})(WebBrowser || (WebBrowser = {}));
/// <reference types="jquery" />
var WebBrowser;
/// <reference types="jquery" />
(function (WebBrowser) {
    class Blocks {
        constructor() {
            this.div = document.getElementById('blocks-page');
            this.footer = document.getElementById('footer-box');
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                var count = yield WebBrowser.WWW.api_getHeight();
                this.pageUtil = new WebBrowser.PageUtil(count, 15);
                yield this.updateBlocks(this.pageUtil);
                this.div.hidden = false;
                this.footer.hidden = false;
                $("#blocks-page-next").off("click").click(() => {
                    if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                        this.pageUtil.currentPage = this.pageUtil.totalPage;
                    }
                    else {
                        this.pageUtil.currentPage += 1;
                        this.updateBlocks(this.pageUtil);
                    }
                });
                $("#blocks-page-previous").off("click").click(() => {
                    if (this.pageUtil.currentPage <= 1) {
                        this.pageUtil.currentPage = 1;
                    }
                    else {
                        this.pageUtil.currentPage -= 1;
                        this.updateBlocks(this.pageUtil);
                    }
                });
            });
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        updateBlocks(pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                let blocks = yield WebBrowser.WWW.getblocks(pageUtil.pageSize, pageUtil.currentPage);
                $("#blocks-page").children("table").children("tbody").empty();
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#blocks-page-next").removeClass('disabled');
                }
                else {
                    $("#blocks-page-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#blocks-page-previous").removeClass('disabled');
                }
                else {
                    $("#blocks-page-previous").addClass('disabled');
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 15) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "Blocks " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#blocks-page-msg").html(pageMsg);
                //let newDate = new Date();
                blocks.forEach((item, index, input) => {
                    //newDate.setTime(item.time * 1000);
                    let time = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(item.time * 1000));
                    if (location.pathname == '/zh/') {
                        let newDate = new Date();
                        newDate.setTime(item.time * 1000);
                        time = newDate.toLocaleString();
                    }
                    let html = `
                <tr>
                <td><a href="` + WebBrowser.Url.href_block(item.index) + `" target="_self">` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + time + `</td>
                </tr>`;
                    $("#blocks-page").find("tbody").append(html);
                });
            });
        }
    }
    WebBrowser.Blocks = Blocks;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class WWW {
        static makeRpcUrl(method, ..._params) {
            var url = WWW.api + WebBrowser.locationtool.getNetWork();
            var urlout = WWW.makeUrl(method, url, ..._params);
            return urlout;
        }
        static makeUrl(method, url, ..._params) {
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
        //获得高度
        static api_getHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getblockcount");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                var height = parseInt(r[0]["blockcount"]) - 1;
                return height;
            });
        }
        //获得交易总数
        static gettxcount(type) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("gettxcount", type);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r[0]['txcount'];
            });
        }
        //地址总数
        static getaddrcount() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getaddrcount");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r[0]['addrcount'];
            });
        }
        /**
         * 获取区块列表
         * @param size 记录条数
         * @param page 页码
         */
        static getblocks(size, page) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getblocks", size, page);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        //查询交易列表
        static getrawtransactions(size, page, txtype) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getrawtransactions", size, page, txtype);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static getaddrs(size, page) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getaddrs", size, page);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static getrawtransaction(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getrawtransaction", txid);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r[0];
            });
        }
        static getallnep5asset() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getallnep5asset");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getAllAssets() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getallasset");
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getUTXOCount(address) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getutxo", address);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getUTXO(address, size, page) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getutxo", address, 1, size, page);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getbalances(address) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getbalance", address);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getasset(asset) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getasset", asset);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getnep5(nep5) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getnep5asset", nep5);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getallnep5assetofaddress(nep5) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getallnep5assetofaddress", nep5, 1);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static getaddrsesstxs(addr, size, page) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeUrl("getaddresstxs", WWW.apiaggr + WebBrowser.locationtool.getNetWork(), addr, size, page);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getaddrMsg(addr) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getaddr", addr);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        //资产排行
        static getrankbyasset(nep5id, size, page) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeUrl("getrankbyasset", WWW.apiaggr + WebBrowser.locationtool.getNetWork(), nep5id, size, page);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        //资产排行总数
        static api_getrankbyassetcount(id) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeUrl("getrankbyassetcount", WWW.apiaggr + WebBrowser.locationtool.getNetWork(), id);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getnep5transfersbyasset(nep5id, size, page) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getnep5transfersbyasset", nep5id, size, page);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        static api_getnep5count(type, nep5id) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getnep5count", type, nep5id);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
        //根据txid获取nep5
        static api_getnep5transferbytxid(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getnep5transferbytxid", txid);
                var result = yield fetch(str, { "method": "get" });
                var json = yield result.json();
                var r = json["result"];
                return r;
            });
        }
    }
    WWW.api = "https://api.nel.group/api/";
    WWW.apiaggr = "https://apiaggr.nel.group/api/";
    WebBrowser.WWW = WWW;
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
    class DateTool {
        /**************************************时间格式化处理************************************/
        static dateFtt(fmt, date) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds() //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
    WebBrowser.DateTool = DateTool;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../tools/wwwtool.ts" />
/// <reference path="../tools/cointool.ts" />
/// <reference path="../tools/timetool.ts" />
var WebBrowser;
/// <reference path="../tools/wwwtool.ts" />
/// <reference path="../tools/cointool.ts" />
/// <reference path="../tools/timetool.ts" />
(function (WebBrowser) {
    class Address {
        constructor() {
            this.div = document.getElementById("address-info");
            this.footer = document.getElementById('footer-box');
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                //this.div.innerHTML = pages.addres;
                var address = WebBrowser.locationtool.getParam();
                let href = WebBrowser.locationtool.getUrl() + "/addresses";
                let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all addresses</a>';
                $("#goalladress").empty();
                $("#goalladress").append(html);
                var addrMsg = yield WebBrowser.WWW.api_getaddrMsg(address);
                var utxos = yield WebBrowser.WWW.api_getUTXOCount(address);
                var balances = yield WebBrowser.WWW.api_getbalances(address);
                var nep5ofAddress = yield WebBrowser.WWW.api_getallnep5assetofaddress(address);
                if (addrMsg) {
                    this.loadAddressInfo(address, addrMsg);
                    this.pageUtil = new WebBrowser.PageUtil(addrMsg[0].txcount, 10);
                    this.initTranPage(addrMsg[0].txcount, address);
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
                else {
                    $("#address").text("-");
                    $("#created").text("-");
                    $("#totalTran").text("-");
                    let html = `<div class="line" style="text-align:center;padding:16px;font-size:16px;">There is no data</div>`;
                    $("#addr-trans").append(html);
                }
                this.loadView(balances, nep5ofAddress);
                if (utxos) {
                    this.pageUtilUtxo = new WebBrowser.PageUtil(utxos.length, 10);
                    this.initUTXOPage(utxos.length, address);
                    this.updateAddrUTXO(address, this.pageUtilUtxo);
                }
                else {
                    let html = `<tr><td colspan="3" >There is no data</td></tr>`;
                    $("#add-utxos").append(html);
                }
                //this.loadUTXOView(utxos);
                this.div.hidden = false;
                this.footer.hidden = false;
            });
        }
        //AddressInfo视图
        loadAddressInfo(address, addrMsg) {
            let createdTime = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(addrMsg[0].firstuse.blocktime.$date));
            if (location.pathname == '/zh/') {
                let newDate = new Date();
                newDate.setTime(addrMsg[0].firstuse.blocktime.$date);
                createdTime = newDate.toLocaleString();
            }
            let totalTran = addrMsg[0].txcount;
            $("#address").text(address);
            $("#created").text(createdTime);
            $("#totalTran").text(totalTran);
        }
        loadView(balances, nep5ofAddress) {
            $("#balance").empty();
            if (balances) {
                balances.forEach((balance) => {
                    var name = WebBrowser.CoinTool.assetID2name[balance.asset];
                    let html = `
                <div class="line" > <div class="title-nel" > <span>` + name + ` </span></div >
                <div class="content-nel" > <span> ` + balance.balance + ` </span></div > </div>`;
                    $("#balance").append(html);
                });
            }
            if (nep5ofAddress) {
                nep5ofAddress.forEach((nep5ofAddress) => {
                    let html = `
                <div class="line" > <div class="title-nel" > <span>` + nep5ofAddress.symbol + ` </span></div >
                <div class="content-nel" > <span> ` + nep5ofAddress.balance + ` </span></div > </div>`;
                    $("#balance").append(html);
                });
            }
            if (!balances && !nep5ofAddress) {
                let html = `<div class="line"><div class="title-nel" style="width:100%;text-align:center;display: block;line-height: 56px;"><span>There is no data</span></div> </div>`;
                $("#balance").append(html);
            }
        }
        loadUTXOView(utxos) {
            $("#add-utxos").empty();
            if (utxos) {
                utxos.forEach((utxo) => {
                    let html = `
                <tr>
                <td class='code'>` + WebBrowser.CoinTool.assetID2name[utxo.asset] + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_self' href='` + WebBrowser.Url.href_transaction(utxo.txid) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`;
                    $("#add-utxos").append(html);
                });
            }
        }
        initTranPage(transtotal, address) {
            if (transtotal > 10) {
                $("#trans-page-msg").show();
                $("#addr-trans-page").show();
            }
            else {
                $("#trans-page-msg").hide();
                $("#addr-trans-page").hide();
            }
            $("#trans-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                    $('#errMsg').modal('show');
                }
                else {
                    this.pageUtil.currentPage += 1;
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
            });
            $("#trans-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    this.updateAddrTrasctions(address, this.pageUtil);
                }
            });
        }
        initUTXOPage(utxototal, address) {
            if (utxototal > 10) {
                $("#utxo-page-msg").show();
                $("#addr-utxo-page").show();
            }
            else {
                $("#utxo-page-msg").hide();
                $("#addr-utxo-page").hide();
            }
            $("#utxo-next").off("click").click(() => {
                if (this.pageUtilUtxo.currentPage == this.pageUtilUtxo.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                }
                else {
                    this.pageUtilUtxo.currentPage += 1;
                    this.updateAddrUTXO(address, this.pageUtilUtxo);
                }
            });
            $("#utxo-previous").off("click").click(() => {
                if (this.pageUtilUtxo.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                }
                else {
                    this.pageUtilUtxo.currentPage -= 1;
                    this.updateAddrUTXO(address, this.pageUtilUtxo);
                }
            });
        }
        //更新交易记录
        updateAddrTrasctions(address, pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                $("#addr-trans").empty();
                //分页查询交易记录
                let txlist = yield WebBrowser.WWW.getaddrsesstxs(address, pageUtil.pageSize, pageUtil.currentPage);
                let listLength = 0;
                if (txlist) {
                    if (txlist.length < 10) {
                        listLength = txlist.length;
                    }
                    else {
                        listLength = pageUtil.pageSize;
                    }
                    for (var n = 0; n < listLength; n++) {
                        let txid = txlist[n].txid;
                        let time = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(txlist[n].blocktime.$date));
                        if (location.pathname == '/zh/') {
                            let newDate = new Date();
                            newDate.setTime(txlist[n].blocktime.$date);
                            time = newDate.toLocaleString();
                        }
                        let html = yield this.getAddrTransLine(txid, txlist[n].type, time, txlist[n].vin, txlist[n].vout);
                        $("#addr-trans").append(html);
                    }
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 10) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#trans-page-msg").html(pageMsg);
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#trans-next").removeClass('disabled');
                }
                else {
                    $("#trans-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#trans-previous").removeClass('disabled');
                }
                else {
                    $("#trans-previous").addClass('disabled');
                }
            });
        }
        //更新UTXO记录
        updateAddrUTXO(address, pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                $("#add-utxos").empty();
                //分页查询交易记录
                let utxolist = yield WebBrowser.WWW.api_getUTXO(address, pageUtil.pageSize, pageUtil.currentPage);
                let listLength = 0;
                if (utxolist) {
                    if (utxolist.length < 10) {
                        listLength = utxolist.length;
                    }
                    else {
                        listLength = pageUtil.pageSize;
                    }
                    this.loadUTXOView(utxolist);
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 10) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "UTXO " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#utxo-page-msg").html(pageMsg);
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#utxo-next").removeClass('disabled');
                }
                else {
                    $("#utxo-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#utxo-previous").removeClass('disabled');
                }
                else {
                    $("#utxo-previous").addClass('disabled');
                }
            });
        }
        getAddrTransLine(txid, type, time, vins, vouts) {
            return __awaiter(this, void 0, void 0, function* () {
                var id = txid.replace('0x', '');
                id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
                return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="` + WebBrowser.Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
                    <div class="content-nel"><span>` + type.replace("Transaction", "") + `</span></div>
                    <div class="content-nel"><span>` + time + `</a></span></div>
                </div>
                <a onclick="txgMsg(this)" class="end" id="genbtn"><img src="../img/open.svg" /></a>
                <div class="transaction" style="width:100%;display: none;" vins='` + JSON.stringify(vins) + `' vouts='` + JSON.stringify(vouts) + `'>
                </div>
            </div>
            `;
            });
        }
        static getTxMsg(vins, vouts, div) {
            return __awaiter(this, void 0, void 0, function* () {
                vins = JSON.parse(vins);
                vouts = JSON.parse(vouts);
                let myAddress = $("#address").text();
                let form = "";
                vins.forEach(vins => {
                    let name = WebBrowser.CoinTool.assetID2name[vins.asset];
                    let href = WebBrowser.Url.href_address(vins.address);
                    let addrStr = '';
                    if (vins.address == myAddress) {
                        addrStr = `<div class="address"><a class="color-FDBA27">` + vins.address + `</a></div>`;
                    }
                    else {
                        addrStr = `<div class="address"><a href="` + href + `" target="_self">` + vins.address + `</a></div>`;
                    }
                    form +=
                        `
                <div class="item">` + addrStr + `
                    <ul class="amount"><li>` + vins.value + ` ` + name + `</li></ul>
                </div>
                `;
                });
                let tostr = "";
                vouts.forEach(vout => {
                    let name = WebBrowser.CoinTool.assetID2name[vout.asset];
                    let href = WebBrowser.Url.href_address(vout.address);
                    let addrStr = '';
                    if (vout.address == myAddress) {
                        addrStr = `<div class="address"><a class="color-FDBA27">` + vout.address + `</a></div>`;
                    }
                    else {
                        addrStr = `<div class="address"><a href="` + href + `" target="_self">` + vout.address + `</a></div>`;
                    }
                    tostr +=
                        `
                <div class="item">` + addrStr + `
                    <ul class="amount"><li>` + vout.value + ` ` + name + `</li></ul>
                </div>
                `;
                });
                var res = `
            <div class="formaddr">
                ` + form + `
            </div>
            <div class="turnto"><img src="../img/turnto.svg" /></div>
            <div class="toaddr">
                ` + tostr + `
            </div>
            `;
                div.innerHTML = res;
            });
        }
    }
    WebBrowser.Address = Address;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    //地址列表
    class Addresses {
        constructor() {
            this.div = document.getElementById('addrs-page');
            this.footer = document.getElementById('footer-box');
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        /**
         * addrlistInit
         */
        addrlistInit() {
            return __awaiter(this, void 0, void 0, function* () {
                let addrlist = yield WebBrowser.WWW.getaddrs(this.pageUtil.pageSize, this.pageUtil.currentPage);
                //let newDate: Date = new Date();
                addrlist.map((item) => {
                    let firstTime = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(item.firstuse.blocktime.$date));
                    if (location.pathname == '/zh/') {
                        let newDate = new Date();
                        newDate.setTime(item.firstuse.blocktime.$date);
                        firstTime = newDate.toLocaleString();
                    }
                    item.firstDate = firstTime;
                    let lastTime = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(item.lastuse.blocktime.$date));
                    if (location.pathname == '/zh/') {
                        let newDate = new Date();
                        newDate.setTime(item.lastuse.blocktime.$date);
                        lastTime = newDate.toLocaleString();
                    }
                    item.lastDate = lastTime;
                });
                this.loadView(addrlist);
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
                }
                else {
                    $("#addrs-page-next").addClass('disabled');
                }
                if (this.pageUtil.currentPage - 1) {
                    $("#addrs-page-previous").removeClass('disabled');
                }
                else {
                    $("#addrs-page-previous").addClass('disabled');
                }
            });
        }
        /**
         * start
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                this.div.hidden = false;
                let prom = yield WebBrowser.WWW.getaddrcount();
                this.pageUtil = new WebBrowser.PageUtil(prom, 15);
                yield this.addrlistInit();
                //this.addrlistInit();
                $("#addrs-page-next").off("click").click(() => {
                    if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                        this.pageUtil.currentPage = this.pageUtil.totalPage;
                    }
                    else {
                        this.pageUtil.currentPage += 1;
                        this.addrlistInit();
                    }
                });
                $("#addrs-page-previous").off("click").click(() => {
                    if (this.pageUtil.currentPage <= 1) {
                        this.pageUtil.currentPage = 1;
                    }
                    else {
                        this.pageUtil.currentPage -= 1;
                        this.addrlistInit();
                    }
                });
                this.footer.hidden = false;
            });
        }
        /**
         * loadView
         */
        loadView(addrlist) {
            $("#addrlist").empty();
            addrlist.forEach(item => {
                let href = WebBrowser.Url.href_address(item.addr);
                let html = `
                <tr>
                <td><a class="code" target="_self" href="` + href + `">` + item.addr + `</a></td>
                <td>` + item.firstDate + `</td>
                <td>` + item.lastDate + `</td>
                <td>` + item.txcount + `</td></tr>`;
                $('#addrlist').append(html);
            });
        }
    }
    WebBrowser.Addresses = Addresses;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class AssetInfo {
        constructor() {
            this.div = document.getElementById("asset-info");
            this.footer = document.getElementById('footer-box');
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                var assetid = WebBrowser.locationtool.getParam();
                let href = WebBrowser.locationtool.getUrl() + "/assets";
                let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all assets</a>';
                $("#goallasset").empty();
                $("#goallasset").append(html);
                this.loadAssetInfoView(assetid);
                var assetType = WebBrowser.locationtool.getType();
                if (assetType == 'nep5') {
                    //$(".asset-nep5-warp").show();
                    $(".asset-tran-warp").show();
                }
                else {
                    //$(".asset-nep5-warp").hide();
                    $(".asset-tran-warp").hide();
                }
                //资产排行
                var rankcount = yield WebBrowser.WWW.api_getrankbyassetcount(assetid);
                this.rankPageUtil = new WebBrowser.PageUtil(rankcount[0].count, 10);
                this.updateAssetBalanceView(assetid, this.rankPageUtil);
                //排行翻页
                $("#assets-balance-next").off("click").click(() => {
                    if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
                        this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
                    }
                    else {
                        this.rankPageUtil.currentPage += 1;
                        this.updateAssetBalanceView(assetid, this.rankPageUtil);
                    }
                });
                $("#assets-balance-previous").off("click").click(() => {
                    if (this.rankPageUtil.currentPage <= 1) {
                        this.rankPageUtil.currentPage = 1;
                    }
                    else {
                        this.rankPageUtil.currentPage -= 1;
                        this.updateAssetBalanceView(assetid, this.rankPageUtil);
                    }
                });
                this.div.hidden = false;
                this.footer.hidden = false;
            });
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        loadAssetInfoView(assetid) {
            //this.div.innerHTML = pages.asset;
            WebBrowser.WWW.api_getasset(assetid).then((data) => {
                var asset = data[0];
                asset.names = WebBrowser.CoinTool.assetID2name[asset.id];
                $("#name").text(asset.names);
                $("#asset-info-type").text(asset.type);
                $("#id").text(asset.id);
                $("#available").text(asset.available);
                $("#precision").text(asset.precision);
                $("#admin").text(asset.admin);
            });
        }
        updateAssetBalanceView(assetid, pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                let balanceList = yield WebBrowser.WWW.getrankbyasset(assetid, pageUtil.pageSize, pageUtil.currentPage);
                $("#assets-balance-list").empty();
                if (balanceList) {
                    let rank = (pageUtil.currentPage - 1) * 10 + 1;
                    balanceList.forEach((item) => {
                        let href = WebBrowser.Url.href_address(item.addr);
                        this.loadAssetBalanceView(rank, href, item.addr, item.balance);
                        rank++;
                    });
                }
                else {
                    let html = `<tr><td colspan="3" >There is no data</td></tr>`;
                    $("#assets-balance-list").append(html);
                    if (pageUtil.currentPage == 1) {
                        $(".asset-balance-page").hide();
                    }
                    else {
                        $("#assets-balance-next").addClass('disabled');
                        $(".asset-balance-page").show();
                    }
                }
                if (pageUtil.totalCount > 10) {
                    if (pageUtil.totalPage - pageUtil.currentPage) {
                        $("#assets-balance-next").removeClass('disabled');
                    }
                    else {
                        $("#assets-balance-next").addClass('disabled');
                    }
                    if (pageUtil.currentPage - 1) {
                        $("#assets-balance-previous").removeClass('disabled');
                    }
                    else {
                        $("#assets-balance-previous").addClass('disabled');
                    }
                    let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                    let maxNum = pageUtil.totalCount;
                    let diffNum = maxNum - minNum;
                    if (diffNum > 10) {
                        maxNum = pageUtil.currentPage * pageUtil.pageSize;
                    }
                    let pageMsg = "Banlance Rank " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                    $("#assets-balance-msg").html(pageMsg);
                    $(".asset-balance-page").show();
                }
                else {
                    $(".asset-balance-page").hide();
                }
            });
        }
        loadAssetBalanceView(rank, href, address, balance) {
            let html = `
                    <tr>
                    <td>` + rank + `
                    </td>
                    <td><a target="_self" href="` + href + `">` + address + `
                    </a></td>
                    <td>` + balance + `</td>
                    </tr>`;
            $("#assets-balance-list").append(html);
        }
    }
    WebBrowser.AssetInfo = AssetInfo;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    //资产页面管理器
    class Assets {
        constructor() {
            this.div = document.getElementById("asset-page");
            this.footer = document.getElementById('footer-box');
            this.assetlist = $("#asset-page");
            //监听交易列表选择框
            $("#asset-TxType").change(() => {
                this.pageUtil.currentPage = 1;
                this.assetType = $("#asset-TxType").val();
                if (this.assetType == "Assets") {
                    this.pageUtil = new WebBrowser.PageUtil(this.assets.length, 15);
                    this.pageUtil.currentPage = 1;
                    if (this.assets.length > 15) {
                        this.updateAssets(this.pageUtil);
                        this.assetlist.find(".page").show();
                    }
                    else {
                        this.loadAssetView(this.assets);
                        let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                }
                else if (this.assetType == "Nep5") {
                    this.pageUtil = new WebBrowser.PageUtil(this.nep5s.length, 15);
                    this.pageUtil.currentPage = 1;
                    if (this.nep5s.length > 15) {
                        this.updateNep5s(this.pageUtil);
                        this.assetlist.find(".page").show();
                    }
                    else {
                        this.loadNep5View(this.nep5s);
                        let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                }
            });
            $("#asset-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                }
                else {
                    this.pageUtil.currentPage += 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    }
                    else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });
            $("#asset-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    }
                    else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        //更新asset表格
        updateAssets(pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                $("#asset-page").find("#asset-page-msg").html("");
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 15) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let arrAsset = new Array();
                for (let i = minNum; i < maxNum; i++) {
                    arrAsset.push(this.assets[i]);
                }
                this.loadAssetView(arrAsset);
                let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#asset-page").find("#asset-page-msg").html(pageMsg);
            });
        }
        //更新asset表格
        updateNep5s(pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                $("#asset-page").find("#asset-page-msg").html("");
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 15) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                else {
                    maxNum = pageUtil.totalCount;
                }
                let arrNep5s = new Array();
                for (let i = minNum; i < maxNum; i++) {
                    arrNep5s.push(this.nep5s[i]);
                }
                this.loadNep5View(arrNep5s);
                let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#asset-page").find("#asset-page-msg").html(pageMsg);
                if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                    $("#asset-page-next").removeClass('disabled');
                }
                else {
                    $("#asset-page-next").addClass('disabled');
                }
                if (this.pageUtil.currentPage - 1) {
                    $("#asset-page-previous").removeClass('disabled');
                }
                else {
                    $("#asset-page-previous").addClass('disabled');
                }
            });
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                $("#asset-TxType").val("Assets");
                this.assetType = $("#asset-TxType").val();
                this.assets = yield WebBrowser.WWW.api_getAllAssets();
                this.pageUtil = new WebBrowser.PageUtil(this.assets.length, 15);
                if (this.assets.length > 15) {
                    this.updateAssets(this.pageUtil);
                    this.assetlist.find(".page").show();
                }
                else {
                    this.loadAssetView(this.assets);
                    let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                    $("#asset-page").find("#asset-page-msg").html(pageMsg);
                    this.assetlist.find(".page").hide();
                }
                this.nep5s = yield WebBrowser.WWW.getallnep5asset();
                this.div.hidden = false;
                this.footer.hidden = false;
            });
        }
        /**
         * loadView 页面展现
         */
        loadAssetView(assets) {
            $("#assets").empty();
            assets.forEach((asset) => {
                let href = WebBrowser.Url.href_asset(asset.id);
                let html = `
                    <tr>
                    <td> <a href="` + href + `" target="_self">` + WebBrowser.CoinTool.assetID2name[asset.id] + `</a></td>
                    <td>` + asset.type + `</td>
                    <td>` + (asset.amount <= 0 ? asset.available : asset.amount) + `</td>
                    <td>` + asset.precision + `</td>
                    </tr>`;
                $("#assets").append(html);
            });
        }
        loadNep5View(nep5s) {
            $("#assets").empty();
            nep5s.forEach((nep5s) => {
                let href = WebBrowser.Url.href_nep5(nep5s.assetid);
                let assetname = '(' + nep5s.assetid.substring(2, 5) + '...' + nep5s.assetid.substring(nep5s.assetid.length - 3) + ')';
                let html = `
                    <tr>
                    <td> <a href="` + href + `" target="_self">` + nep5s.name + assetname + `</a></td>
                    <td> Nep5 </td>
                    <td>` + nep5s.totalsupply + `</td>
                    <td>` + nep5s.decimals + `</td>
                    </tr>`;
                $("#assets").append(html);
            });
        }
    }
    WebBrowser.Assets = Assets;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    /**
     * @class 交易详情
     */
    class Transaction {
        constructor() {
            this.div = document.getElementById("transaction-info");
            this.footer = document.getElementById('footer-box');
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        start() {
            //this.div.innerHTML = pages.transaction;
            this.updateTxInfo(WebBrowser.locationtool.getParam());
            let href = WebBrowser.locationtool.getUrl() + "/transactions";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all transactions</a>';
            $("#goalltrans").empty();
            $("#goalltrans").append(html);
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        updateTxInfo(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                let txInfo = yield WebBrowser.WWW.getrawtransaction(txid);
                $("#type").text(txInfo.type.replace("Transaction", ""));
                $("#txid").text(txInfo.txid);
                $("#blockindex").empty();
                $("#blockindex").append("<a href='" + WebBrowser.Url.href_block(txInfo.blockindex) + "'>" + txInfo.blockindex + "</a>");
                $("#txsize").text(txInfo.size + " bytes");
                $("#sysfee").text(txInfo["sys_fee"] + " gas");
                $("#netfee").text(txInfo["net_fee"] + " gas");
                let ajax = new WebBrowser.Ajax();
                let blocks = yield ajax.post('getblock', [txInfo.blockindex]);
                let block = blocks[0];
                let time = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(block.time * 1000));
                if (location.pathname == '/zh/') {
                    let newDate = new Date();
                    newDate.setTime(block.time * 1000);
                    time = newDate.toLocaleString();
                }
                $("#transaction-time").text(time);
                //let allAsset: Asset[] = await WWW.api_getAllAssets();
                let arr = new Array();
                for (let index = 0; index < txInfo.vin.length; index++) {
                    const vin = txInfo.vin[index];
                    try {
                        let txInfo = yield WebBrowser.WWW.getrawtransaction(vin.txid);
                        let vout = txInfo.vout[vin.vout];
                        let address = vout.address;
                        let value = vout.value;
                        let name = WebBrowser.CoinTool.assetID2name[vout.asset];
                        arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
                    }
                    catch (error) {
                    }
                }
                $("#from").empty();
                let array = Transaction.groupByaddr(arr);
                for (let index = 0; index < array.length; index++) {
                    const item = array[index];
                    let html = "";
                    html += '<div class="line" > <div class="title-nel" > <span>Address </span></div >';
                    html += '<div class="content-nel" > <span id="size" >' + item.addr + ' </span></div > </div>';
                    for (let i = 0; i < item.data.length; i++) {
                        const element = item.data[i];
                        html += '<div class="line" > <div class="title-nel" > <span>' + element.name + ' </span></div >';
                        html += '<div class="content-nel" > <span id="size" >' + element.amount + ' </span></div > </div>';
                    }
                    $("#from").append(html);
                }
                $("#to").empty();
                txInfo.vout.forEach(vout => {
                    let name = WebBrowser.CoinTool.assetID2name[vout.asset];
                    let sign = "";
                    if (array.find(item => item.addr == vout.address)) {
                        sign = "(change)";
                    }
                    let html = "";
                    html += '<div class="line" > <div class="title-nel" > <span>Address </span></div >';
                    html += '<div class="content-nel" > <span id="size" >' + vout.address + ' </span></div > </div>';
                    html += '<div class="line" > <div class="title-nel" > <span>' + name + ' </span></div >';
                    html += '<div class="content-nel" > <span id="size" >' + vout.value + sign + ' </span></div > </div>';
                    $("#to").append(html);
                });
                $("#txidnep5").empty();
                let txidNep = yield WebBrowser.WWW.api_getnep5transferbytxid(txid);
                console.log(txidNep);
                if (txidNep) {
                    $(".txidnep-warp").show();
                    txidNep.forEach((item) => {
                        this.loadTxidNep5View(item.asset, item.from, item.to, item.value);
                    });
                }
                else {
                    $(".txidnep-warp").hide();
                }
            });
        }
        loadTxidNep5View(asset, from, to, value) {
            return __awaiter(this, void 0, void 0, function* () {
                let href = WebBrowser.Url.href_nep5(asset);
                let nep5Name = yield WebBrowser.WWW.api_getnep5(asset);
                let html = `
                    <tr>
                    <td> <a href="` + href + `" target="_self">` + nep5Name[0].name + `</a></td>
                    <td>` + from + `</td>
                    <td>` + to + `</td>
                    <td>` + value + `</td>
                    </tr>`;
                $("#txidnep5").append(html);
            });
        }
        static groupByaddr(arr) {
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
    WebBrowser.Transaction = Transaction;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="./block.ts" />
/// <reference path="./address.ts" />
/// <reference path="./transaction.ts" />
var WebBrowser;
/// <reference path="./block.ts" />
/// <reference path="./address.ts" />
/// <reference path="./transaction.ts" />
(function (WebBrowser) {
    var pages;
    (function (pages) {
        pages.block = `
    <div class="title"><span>Block Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Block </span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>Hash</span></div> <div class="content-nel"><span id="hash"></span></div></div>
          <div class="line"><div class="title-nel"><span>Index</span></div> <div class="content-nel"><span id="index"></span></div></div>
          <div class="line"><div class="title-nel"><span>Time</span></div> <div class="content-nel"><span id="time"></span></div></div>
          <div class="line"><div class="title-nel"><span>Size</span></div><div class="content-nel"><span id="size"></span></div></div>
          <div class="line"><div class="title-nel"><span>Previous Block</span></div><div class="content-nel"></div><span></span></div>
          <div class="line"><div class="title-nel"><span>Next Block</span></div><div class="content-nel"></div><span></span></div>
      </div>
    </div>
    <div class="title">
        <span>Transactions</span>
    </div>
    <table class="table table-nel cool">
        <thead>
            <tr>
                <th>TXID</th>
                <th>Type</th>
                <th>Size</th>
                <th>Version</th>
            </tr>
        </thead>
        <tbody id="txs"></tbody>
    </table>
    `;
        pages.transaction = `
    <div class="title"><span>Transaction Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Transaction </span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>TXID</span></div> <div class="content-nel"><span id="txid"></span></div></div>
          <div class="line"><div class="title-nel"><span>Type</span></div> <div class="content-nel"><span id="type"></span></div></div>
          <div class="line"><div class="title-nel"><span>Network Fee</span></div><div class="content-nel"><span id="netfee"></span></div></div>
          <div class="line"><div class="title-nel"><span>System Fee</span></div><div class="content-nel"><span id="sysfee"></span></div></div>
          <div class="line"><div class="title-nel"><span>Size</span></div><div class="content-nel"><span id="txsize"></span></div></div>
          <div class="line"><div class="title-nel"><span>Included in Block</span></div><div class="content-nel"><span id="blockindex"></span></div></div>
      </div>
    </div>
    <div style="padding-top:25px">
      <div class="row">
         <div class="col-md-6">
            <div class="list-nel">
              <div class="list-head">
                  <div class="line"><div class="title-nel"><span>Input</span></div></div>
              </div>
              <div class="list-body" id="from" >
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="list-nel">
              <div class="list-head">
                  <div class="line"><div class="title-nel"><span>Output</span></div></div>
              </div>
              <div class="list-body" id="to" >
              </div>
            </div>
           </div>
        </div>
    </div>
    `;
        pages.addres = `
    <div class="container">
        <div class="container-box">
            <div class="title">
                <span>Address info</span>
                <div class="go-back" id="goalladress"></div>
            </div>
        
            <div class="list-nel">
                <div class="list-head">
                    <div class="line">
                    
                    </div>
                </div>
                <div class="list-body" id="address-info">
                    <div class="line">
                        <div class="title-nel"><span>Address</span></div> 
                        <div class="content-nel"><span id="address"></span></div>
                    </div>
                    <div class="line">
                        <div class="title-nel"><span>Created</span></div> 
                        <div class="content-nel"><span id="created"></span></div>
                    </div>
                    <div class="line">
                        <div class="title-nel"><span>Transactions</span></div> 
                        <div class="content-nel"><span id="totalTran"></span></div>
                    </div>
                </div>
            </div>

            <div class="title"><span>Balance</span></div>
            <div class="list-nel">
                <div class="list-head">
                    <div class="line">
                    
                    </div>
                </div>
                <div class="list-body" id="balance">
                    <div class="line">
                    </div>
                </div>
            </div>

            <div class="title"><span>Transactions</span></div>
            <div class="list-nel">
	            <div class="list-head">
		            <div class="line">
			            <div class="title-content"><span>TXID</span></div>
			            <div class="title-content"><span>Type</span></div>
			            <div class="title-content"><span>Time</span></div>
			            <div class="title-nel" style="width:60px;"></div>
		            </div>
	            </div>
	            <div class="list-body" id="addr-trans">
	            </div>
            </div>
            <div class="page-number">
                <span id="trans-page-msg"></span>
            </div>
            <div class="page" id="addr-trans-page">
                <div id="trans-previous" class="page-previous">
                    <img src="./img/lefttrangle.svg" alt="">
                </div>
                <div style="width:1px;"></div>
                <div id="trans-next" class="page-next">
                    <img src="./img/righttrangle.svg" alt="">
                </div>
            </div>

            <div class="title">
                <span>UTXO</span>
            </div>
            <table class="table table-nel cool">
                <thead>
                    <tr>
                        <th>asset</th>
                        <th>number</th>
                        <th>txid</th>
                    </tr>
                </thead>
                <tbody id="add-utxos"></tbody>
            </table>
            <div class="page-number">
                <span id="utxo-page-msg"></span>
            </div>
            <div class="page" id="addr-utxo-page">
                <div id="utxo-previous" class="page-previous">
                    <img src="./img/lefttrangle.svg" alt="">
                </div>
                <div style="width:1px;"></div>
                <div id="utxo-next" class="page-next">
                    <img src="./img/righttrangle.svg" alt="">
                </div>
            </div>
        <div>
    </div>
    `;
        pages.asset = `
    <div class="title"><span>Asset Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Asset information</span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>Asset</span></div> <div class="content-nel"><span id="name"></span></div></div>
          <div class="line"><div class="title-nel"><span>Type</span></div> <div class="content-nel"><span id="type"></span></div></div>
          <div class="line"><div class="title-nel"><span>ID</span></div> <div class="content-nel"><span id="id"></span></div></div>
          <div class="line"><div class="title-nel"><span>Available</span></div><div class="content-nel"><span id="available"></span></div></div>
          <div class="line"><div class="title-nel"><span>Precision</span></div><div class="content-nel"><span id="precision"></span></div></div>
          <div class="line"><div class="title-nel"><span>Admin</span></div><div class="content-nel"><span id="admin"></span></div></div>
      </div>
    </div>
    `;
    })(pages = WebBrowser.pages || (WebBrowser.pages = {}));
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../app.ts"/>
var WebBrowser;
/// <reference path="../app.ts"/>
(function (WebBrowser) {
    class Index {
        constructor() {
            this.div = document.getElementById('index-page');
            this.footer = document.getElementById('footer-box');
            this.viewtxlist = document.getElementById("viewtxlist");
            this.viewblocks = document.getElementById("viewblocks");
            this.alladdress = document.getElementById("alladdress");
            this.allblock = document.getElementById("allblock");
            this.alltxlist = document.getElementById("alltxlist");
            this.cnbtn = document.getElementById("cn-btn");
            this.enbtn = document.getElementById("en-btn");
            this.cnbtn.onclick = () => {
                $("#cn-btn").attr('href', '/zh/' + location.hash);
            };
            this.enbtn.onclick = () => {
                $("#en-btn").attr('href', '/' + location.hash);
            };
        }
        close() {
            this.div.hidden = true;
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                this.viewtxlist.href = WebBrowser.Url.href_transactions();
                this.viewblocks.href = WebBrowser.Url.href_blocks();
                this.alladdress.href = WebBrowser.Url.href_addresses();
                this.allblock.href = WebBrowser.Url.href_blocks();
                this.alltxlist.href = WebBrowser.Url.href_transactions();
                this.div.hidden = false;
                //查询区块高度(区块数量-1)
                let blockHeight = yield WebBrowser.WWW.api_getHeight();
                //查询交易数量
                let txCount = yield WebBrowser.WWW.gettxcount("");
                //查询地址总数
                let addrCount = yield WebBrowser.WWW.getaddrcount();
                //分页查询区块数据
                let blocks = yield WebBrowser.WWW.getblocks(10, 1);
                //分页查询交易记录
                let txs = yield WebBrowser.WWW.getrawtransactions(10, 1, '');
                $("#blockHeight").text(WebBrowser.NumberTool.toThousands(blockHeight)); //显示在页面
                $("#txcount").text(WebBrowser.NumberTool.toThousands(txCount)); //显示在页面
                $("#addrCount").text(WebBrowser.NumberTool.toThousands(addrCount));
                $("#index-page").find("#blocks").children("tbody").empty();
                $("#index-page").find("#transactions").children("tbody").empty();
                let html_blocks = ``;
                let html_txs = ``;
                blocks.forEach((item, index, input) => {
                    //var newDate = new Date();
                    //newDate.setTime(item.time * 1000);
                    let time = WebBrowser.DateTool.dateFtt("dd-MM-yyyy hh:mm:ss", new Date(item.time * 1000));
                    if (location.pathname == '/zh/') {
                        let newDate = new Date();
                        newDate.setTime(item.time * 1000);
                        time = newDate.toLocaleString();
                    }
                    html_blocks += `
                <tr><td>
                <a class="code" target="_self" href ='` + WebBrowser.Url.href_block(item.index) + `' > 
                ` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td>
                <td>` + time + `</td>
                <td>` + item.tx.length + `</td></tr>`;
                });
                txs.forEach((tx) => {
                    let txid = tx.txid;
                    let txtype = tx.type.replace("Transaction", "");
                    txid = txid.replace('0x', '');
                    txid = txid.substring(0, 4) + '...' + txid.substring(txid.length - 4);
                    html_txs += `
                <tr>
                <td><a class='code' target='_self'
                 href ='` + WebBrowser.Url.href_transaction(tx.txid) + `' > ` + txid + ` </a>
                </td>
                <td>` + txtype + `
                </td>
                <td> ` + tx.blockindex + `
                </td>
                <td> ` + tx.size + ` bytes
                </td>
                </tr>`;
                });
                $("#index-page").find("#blocks").children("tbody").append(html_blocks);
                $("#index-page").find("#transactions").children("tbody").append(html_txs);
                this.footer.hidden = false;
            });
        }
    }
    WebBrowser.Index = Index;
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
            this._totalPage = this.totalCount % this.pageSize == 0 ? this.totalCount / this.pageSize : Math.ceil((this.totalCount / this.pageSize));
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
    class Url {
        static href_blocks() {
            return WebBrowser.locationtool.getUrl() + '/blocks';
        }
        static href_transactions() {
            return WebBrowser.locationtool.getUrl() + '/transactions';
        }
        static href_addresses() {
            return WebBrowser.locationtool.getUrl() + '/addresses';
        }
        static href_assets() {
            return WebBrowser.locationtool.getUrl() + '/assets';
        }
        static href_block(block) {
            return WebBrowser.locationtool.getUrl() + "/block/" + block;
        }
        static href_transaction(tx) {
            return WebBrowser.locationtool.getUrl() + "/transaction/" + tx;
        }
        static href_address(addr) {
            return WebBrowser.locationtool.getUrl() + "/address/" + addr;
        }
        static href_asset(asset) {
            return WebBrowser.locationtool.getUrl() + '/asset/' + asset;
        }
        static href_nep5(nep5) {
            return WebBrowser.locationtool.getUrl() + '/nep5/' + nep5;
        }
    }
    WebBrowser.Url = Url;
    class Nep5as {
    }
    WebBrowser.Nep5as = Nep5as;
    let AssetEnum;
    (function (AssetEnum) {
        AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
    })(AssetEnum = WebBrowser.AssetEnum || (WebBrowser.AssetEnum = {}));
    class Detail {
        constructor(address, height, balances) {
            this.address = address;
            this.height = height;
            this.balances = balances;
        }
    }
    WebBrowser.Detail = Detail;
    WebBrowser.network = "mainnet";
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
var WebBrowser;
/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
(function (WebBrowser) {
    /**
     * @class 交易记录
     */
    class Transactions {
        constructor() {
            this.div = document.getElementById("txlist-page");
            this.footer = document.getElementById('footer-box');
            this.txlist = $("#txlist-page");
            //监听交易列表选择框
            $("#TxType").change(() => {
                this.pageUtil.currentPage = 1;
                this.updateTransactions(this.pageUtil, $("#TxType").val());
            });
            $("#txlist-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                }
                else {
                    this.pageUtil.currentPage += 1;
                    this.updateTransactions(this.pageUtil, $("#TxType").val());
                }
            });
            $("#txlist-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                }
                else {
                    this.pageUtil.currentPage -= 1;
                    this.updateTransactions(this.pageUtil, $("#TxType").val());
                }
            });
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        //更新交易记录
        updateTransactions(pageUtil, txType) {
            return __awaiter(this, void 0, void 0, function* () {
                this.txlist.find("#txlist-page-transactions").empty();
                //分页查询交易记录
                let txs = yield WebBrowser.WWW.getrawtransactions(pageUtil.pageSize, pageUtil.currentPage, txType);
                let txCount = yield WebBrowser.WWW.gettxcount(txType);
                pageUtil.totalCount = txCount;
                let listLength = 0;
                if (txs.length < 15) {
                    this.txlist.find(".page").hide();
                    listLength = txs.length;
                }
                else {
                    this.txlist.find(".page").show();
                    listLength = pageUtil.pageSize;
                }
                for (var n = 0; n < listLength; n++) {
                    let txid = txs[n].txid;
                    let html = yield this.getTxLine(txid, txs[n].type, txs[n].size.toString(), txs[n].blockindex.toString(), txs[n].vin, txs[n].vout);
                    this.txlist.find("#txlist-page-transactions").append(html);
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 15) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#txlist-page").find("#txlist-page-msg").html(pageMsg);
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#txlist-page-next").removeClass('disabled');
                }
                else {
                    $("#txlist-page-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#txlist-page-previous").removeClass('disabled');
                }
                else {
                    $("#txlist-page-previous").addClass('disabled');
                }
            });
        }
        /**
         * async start
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                let type = $("#TxType").val();
                let txCount = yield WebBrowser.WWW.gettxcount(type);
                //初始化交易列表
                this.pageUtil = new WebBrowser.PageUtil(txCount, 15);
                this.updateTransactions(this.pageUtil, type);
                this.div.hidden = false;
                this.footer.hidden = false;
            });
        }
        getTxLine(txid, type, size, index, vins, vouts) {
            return __awaiter(this, void 0, void 0, function* () {
                var id = txid.replace('0x', '');
                id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
                return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="` + WebBrowser.Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
                    <div class="content-nel"><span>` + type.replace("Transaction", "") + `</span></div>
                    <div class="content-nel"><span>` + size + ` bytes</span></div>
                    <div class="content-nel"><span><a href="` + WebBrowser.Url.href_block(parseInt(index)) + `" target="_self">` + index + `</a></span></div>
                </div>
                <a onclick="txgeneral(this)" class="end" id="genbtn"><img src="../img/open.svg" /></a>
                <div class="transaction" style="width:100%;display: none;" vins='` + JSON.stringify(vins) + `' vouts='` + JSON.stringify(vouts) + `'>
                </div>
            </div>
            `;
            });
        }
        static getTxgeneral(vins, vouts, div) {
            return __awaiter(this, void 0, void 0, function* () {
                vins = JSON.parse(vins);
                vouts = JSON.parse(vouts);
                var ajax = new WebBrowser.Ajax();
                let allAsset = yield ajax.post('getallasset', []);
                allAsset.map((asset) => {
                    if (asset.id == WebBrowser.AssetEnum.NEO) {
                        asset.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (asset.id == WebBrowser.AssetEnum.GAS) {
                        asset.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                let arr = new Array();
                for (let index = 0; index < vins.length; index++) {
                    const vin = vins[index];
                    try {
                        let txInfos = yield ajax.post('getrawtransaction', [vin.txid]);
                        let vout = txInfos[0].vout[vin.vout];
                        let address = vout.address;
                        let value = vout.value;
                        let name = allAsset.find(val => val.id == vout.asset).name.map(name => { return name.name; }).join("|");
                        arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
                    }
                    catch (error) {
                    }
                }
                let arra = WebBrowser.Transaction.groupByaddr(arr);
                let form = "";
                for (let index = 0; index < arra.length; index++) {
                    const item = arra[index];
                    let li = '';
                    for (let i = 0; i < item.data.length; i++) {
                        const element = item.data[i];
                        li += `<li>` + element.amount + ` ` + element.name + `</li>`;
                    }
                    form +=
                        `
                <div class="item"><div class="address"><a>` + item.addr + `</a></div><ul class="amount">` + li + `</ul></div>
                `;
                }
                let tostr = "";
                vouts.forEach(vout => {
                    let name = allAsset.find(val => val.id == vout.asset).name.map(name => name.name).join("|");
                    let sign = "";
                    if (arra.find(item => item.addr == vout.address)) {
                        sign = "(change)";
                    }
                    tostr +=
                        `
                <div class="item">
                    <div class="address"><a>` + vout.address + `</a></div>
                    <ul class="amount"><li>` + vout.value + ` ` + name + sign + `</li></ul>
                </div>
                `;
                });
                var res = `
            <div class="formaddr" style="width:41.3%">
                ` + form + `
            </div>
            <div class="turnto"><img src="../img/turnto.svg" /></div>
            <div class="toaddr" style="width:41.3%">
                ` + tostr + `
            </div>
            <div style="width:60px;"></div>
            `;
                div.innerHTML = res;
            });
        }
    }
    WebBrowser.Transactions = Transactions;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../app.ts"/>
var WebBrowser;
/// <reference path="../app.ts"/>
(function (WebBrowser) {
    class Nep5page {
        constructor() {
            this.div = document.getElementById("asset-info");
            this.footer = document.getElementById('footer-box');
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                var nep5id = WebBrowser.locationtool.getParam();
                let href = WebBrowser.locationtool.getUrl() + "/assets";
                let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all assets</a>';
                $("#goallasset").empty();
                $("#goallasset").append(html);
                this.loadNep5InfoView(nep5id);
                var rankcount = yield WebBrowser.WWW.api_getrankbyassetcount(nep5id);
                this.rankPageUtil = new WebBrowser.PageUtil(rankcount[0].count, 10);
                this.updateAssetBalanceView(nep5id, this.rankPageUtil);
                var assetType = WebBrowser.locationtool.getType();
                if (assetType == 'nep5') {
                    //$(".asset-nep5-warp").show();
                    let count = yield WebBrowser.WWW.api_getnep5count('asset', nep5id);
                    this.pageUtil = new WebBrowser.PageUtil(count[0].nep5count, 10);
                    this.updateNep5TransView(nep5id, this.pageUtil);
                    $(".asset-tran-warp").show();
                }
                else {
                    //$(".asset-nep5-warp").hide();
                    $(".asset-tran-warp").hide();
                }
                //排行翻页
                $("#assets-balance-next").off("click").click(() => {
                    if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
                        this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
                    }
                    else {
                        this.rankPageUtil.currentPage += 1;
                        this.updateAssetBalanceView(nep5id, this.rankPageUtil);
                    }
                });
                $("#assets-balance-previous").off("click").click(() => {
                    if (this.rankPageUtil.currentPage <= 1) {
                        this.rankPageUtil.currentPage = 1;
                    }
                    else {
                        this.rankPageUtil.currentPage -= 1;
                        this.updateAssetBalanceView(nep5id, this.rankPageUtil);
                    }
                });
                //交易翻页
                $("#assets-tran-next").off("click").click(() => {
                    if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                        this.pageUtil.currentPage = this.pageUtil.totalPage;
                    }
                    else {
                        this.pageUtil.currentPage += 1;
                        this.updateNep5TransView(nep5id, this.pageUtil);
                    }
                });
                $("#assets-tran-previous").off("click").click(() => {
                    if (this.pageUtil.currentPage <= 1) {
                        this.pageUtil.currentPage = 1;
                    }
                    else {
                        this.pageUtil.currentPage -= 1;
                        this.updateNep5TransView(nep5id, this.pageUtil);
                    }
                });
                this.div.hidden = false;
                this.footer.hidden = false;
            });
        }
        close() {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        //nep5的详情
        loadNep5InfoView(nep5id) {
            WebBrowser.WWW.api_getnep5(nep5id).then((data) => {
                var nep5 = data[0];
                $("#name").text(nep5.name);
                $("#asset-info-type").text("Nep5");
                $("#id").text(nep5.assetid);
                $("#available").text(nep5.totalsupply);
                $("#precision").text(nep5.decimals);
                $("#admin").text("-");
            });
        }
        updateAssetBalanceView(nep5id, pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                let balanceList = yield WebBrowser.WWW.getrankbyasset(nep5id, pageUtil.pageSize, pageUtil.currentPage);
                $("#assets-balance-list").empty();
                if (balanceList) {
                    let rank = (pageUtil.currentPage - 1) * 10 + 1;
                    balanceList.forEach((item) => {
                        let href = WebBrowser.Url.href_address(item.addr);
                        this.loadAssetBalanceView(rank, href, item.addr, item.balance);
                        rank++;
                    });
                }
                else {
                    let html = `<tr><td colspan="3" >There is no data</td></tr>`;
                    $("#assets-balance-list").append(html);
                    if (pageUtil.currentPage == 1) {
                        $(".asset-balance-page").hide();
                    }
                    else {
                        $("#assets-balance-next").addClass('disabled');
                        $(".asset-balance-page").show();
                    }
                }
                if (pageUtil.totalCount > 10) {
                    if (pageUtil.totalPage - pageUtil.currentPage) {
                        $("#assets-balance-next").removeClass('disabled');
                    }
                    else {
                        $("#assets-balance-next").addClass('disabled');
                    }
                    if (pageUtil.currentPage - 1) {
                        $("#assets-balance-previous").removeClass('disabled');
                    }
                    else {
                        $("#assets-balance-previous").addClass('disabled');
                    }
                    let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                    let maxNum = pageUtil.totalCount;
                    let diffNum = maxNum - minNum;
                    if (diffNum > 10) {
                        maxNum = pageUtil.currentPage * pageUtil.pageSize;
                    }
                    let pageMsg = "Banlance Rank " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                    $("#assets-balance-msg").html(pageMsg);
                    $(".asset-balance-page").show();
                }
                else {
                    $(".asset-balance-page").hide();
                }
            });
        }
        updateNep5TransView(nep5id, pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                let tranList = yield WebBrowser.WWW.api_getnep5transfersbyasset(nep5id, pageUtil.pageSize, pageUtil.currentPage);
                $("#assets-tran-list").empty();
                if (tranList) {
                    tranList.forEach((item) => {
                        if (!item.from) {
                            item.from = '-';
                        }
                        if (!item.to) {
                            item.to = '-';
                        }
                        this.loadAssetTranView(item.txid, item.from, item.to, item.blockindex);
                    });
                }
                else {
                    let html = `<tr><td colspan="4" >There is no data</td></tr>`;
                    $("#assets-tran-list").append(html);
                    if (pageUtil.currentPage == 1) {
                        $(".asset-tran-page").hide();
                    }
                    else {
                        $(".asset-tran-page").show();
                    }
                }
                if (pageUtil.totalCount > 10) {
                    if (pageUtil.totalPage - pageUtil.currentPage) {
                        $("#assets-tran-next").removeClass('disabled');
                    }
                    else {
                        $("#assets-tran-next").addClass('disabled');
                    }
                    if (pageUtil.currentPage - 1) {
                        $("#assets-tran-previous").removeClass('disabled');
                    }
                    else {
                        $("#assets-tran-previous").addClass('disabled');
                    }
                    let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                    let maxNum = pageUtil.totalCount;
                    let diffNum = maxNum - minNum;
                    if (diffNum > 10) {
                        maxNum = pageUtil.currentPage * pageUtil.pageSize;
                    }
                    let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                    $("#assets-tran-msg").html(pageMsg);
                    $(".asset-tran-page").show();
                }
                else {
                    $(".asset-tran-page").hide();
                }
            });
        }
        loadAssetTranView(txid, from, to, blockindex) {
            let html = `
                    <tr>
                    <td><a class="code omit" href="` + WebBrowser.Url.href_transaction(txid) + `" target="_self">` + txid.replace('0x', '') + `
                    </a></td>
                    <td>` + from + `
                    </td>
                    <td>` + to + `
                    </td>
                    <td>` + blockindex + `</td>
                    </tr>`;
            $("#assets-tran-list").append(html);
        }
        loadAssetBalanceView(rank, href, address, balance) {
            let html = `
                    <tr>
                    <td>` + rank + `
                    </td>
                    <td><a target="_self" href="` + href + `">` + address + `
                    </a></td>
                    <td>` + balance + `</td>
                    </tr>`;
            $("#assets-balance-list").append(html);
        }
    }
    WebBrowser.Nep5page = Nep5page;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../app.ts"/>
var WebBrowser;
/// <reference path="../app.ts"/>
(function (WebBrowser) {
    class Notfound {
        start() {
            this.btn = document.getElementById("notfound");
            this.btn.onclick = () => {
                window.location.href = WebBrowser.locationtool.getUrl();
            };
            $(".notfound").show();
        }
        close() {
            $('.notfound').hide();
        }
    }
    WebBrowser.Notfound = Notfound;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class locationtool {
        static getNetWork() {
            var hash = window.location.hash;
            let arr = hash.split("/");
            return arr[0].replace("#", "");
        }
        static getUrl() {
            var href = window.location.href;
            let arr = href.split("#");
            var hash = window.location.hash;
            let hasharr = hash.split("/");
            let net = (hasharr[0] != "#mainnet" && hasharr[0] != "#testnet") ? "#mainnet" : hasharr[0];
            return arr[0] + net;
        }
        static getPage() {
            var page = location.hash;
            var arr = page.split('/');
            if (arr.length == 1 && (arr[0] == "#mainnet" || arr[0] == "#testnet"))
                page = 'explorer';
            else
                page = arr[1];
            return page;
        }
        static getParam() {
            var page = location.hash;
            var arr = page.split('/');
            return arr[2];
        }
        static getType() {
            var page = location.hash;
            var arr = page.split('/');
            return arr[1];
        }
    }
    WebBrowser.locationtool = locationtool;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class NumberTool {
        static toThousands(num) {
            var num = (num || 0).toString(), result = '';
            while (num.length > 3) {
                result = ',' + num.slice(-3) + result;
                num = num.slice(0, num.length - 3);
            }
            if (num) {
                result = num + result;
            }
            return result;
        }
    }
    WebBrowser.NumberTool = NumberTool;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
var WebBrowser;
/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
(function (WebBrowser) {
    class Route {
        constructor() {
            this.pagelist = new Array();
        }
        start(app) {
            WebBrowser.CoinTool.initAllAsset();
            var hash = location.hash;
            if (hash == "") {
                window.location.hash = "#mainnet";
                return;
            }
            let arr = hash.split('/');
            if (arr[0] == '#mainnet')
                app.netWork.changeNetWork('mainnet');
            if (arr[0] == "#testnet")
                app.netWork.changeNetWork('testnet');
            this.app = app;
            this.pagelist.push(app.indexpage);
            this.pagelist.push(app.blocks);
            this.pagelist.push(app.block);
            this.pagelist.push(app.transactions);
            this.pagelist.push(app.transaction);
            this.pagelist.push(app.addresses);
            this.pagelist.push(app.address);
            this.pagelist.push(app.assets);
            this.pagelist.push(app.assetinfo);
            this.closePages();
            var page = this.render();
            page.start();
        }
        render() {
            var page = WebBrowser.locationtool.getPage();
            switch (page) {
                case "explorer":
                    this.app.navbar.indexBtn.classList.add("active");
                    return this.app.indexpage;
                case "blocks":
                    this.app.navbar.blockBtn.classList.add("active");
                    return this.app.blocks;
                case "block":
                    this.app.navbar.blockBtn.classList.add("active");
                    return this.app.block;
                case "transactions":
                    this.app.navbar.txlistBtn.classList.add("active");
                    return this.app.transactions;
                case "transaction":
                    this.app.navbar.txlistBtn.classList.add("active");
                    return this.app.transaction;
                case "addresses":
                    this.app.navbar.addrsBtn.classList.add("active");
                    return this.app.addresses;
                case "address":
                    this.app.navbar.addrsBtn.classList.add("active");
                    return this.app.address;
                case "assets":
                    this.app.navbar.assetBtn.classList.add("active");
                    return this.app.assets;
                case "asset":
                    this.app.navbar.assetBtn.classList.add("active");
                    return this.app.assetinfo;
                case "nep5":
                    return this.app.nep5;
                default:
                    return this.app.notfound;
            }
        }
        closePages() {
            let i = 0;
            while (i < this.pagelist.length) {
                this.pagelist[i].close();
                i++;
                this.app.navbar.indexBtn.classList.remove("active");
                this.app.navbar.blockBtn.classList.remove("active");
                this.app.navbar.txlistBtn.classList.remove("active");
                this.app.navbar.addrsBtn.classList.remove("active");
                this.app.navbar.assetBtn.classList.remove("active");
            }
        }
    }
    WebBrowser.Route = Route;
})(WebBrowser || (WebBrowser = {}));
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
var WebBrowser;
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
(function (WebBrowser) {
    class Ajax {
        /**
         * async post
         */
        post(method, params) {
            return __awaiter(this, void 0, void 0, function* () {
                var href = window.location.href.split("#");
                var arr = href[1].split("/");
                let promise = new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'POST',
                        url: 'https://api.nel.group/api/' + arr[0],
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
                var href = window.location.href.split("#");
                var arr = href[1].split("/");
                let promise = new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'GET',
                        url: 'https://api.nel.group/api/' + arr[0] + '?jsonrpc=2.0&method=getblock&params=%5b1000%5d&id=1001',
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
var WebBrowser;
(function (WebBrowser) {
    class Neotool {
        constructor() { }
        /**
         * verifyPublicKey 验证公钥
         * @param publicKey 公钥
         */
        static verifyPublicKey(publicKey) {
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
        static wifDecode(wif) {
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
        static nep2FromWif(wif, password) {
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
        static nep2ToWif(nep2, password) {
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
                        prikey = result;
                        if (prikey != null) {
                            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                            var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                            var wif = ThinNeo.Helper.GetWifFromPrivateKey(prikey);
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
        static nep6Load(wallet, password) {
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
        static getPriKeyfromAccount(scrypt, password, account) {
            return __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    account.getPrivateKey(scrypt, password, (info, result) => {
                        if (info == "finish") {
                            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                            var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                            var wif = ThinNeo.Helper.GetWifFromPrivateKey(result);
                            var hexkey = result.toHexString();
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
    WebBrowser.Neotool = Neotool;
})(WebBrowser || (WebBrowser = {}));
/// <reference path="./tools/neotool.ts" />
var WebBrowser;
/// <reference path="./tools/neotool.ts" />
(function (WebBrowser) {
    class Navbar {
        constructor() {
            this.indexBtn = document.getElementById("index-btn");
            this.indexa = document.getElementById("indexa");
            this.browBtn = document.getElementById("brow-btn");
            this.blockBtn = document.getElementById("blocks-btn");
            this.blocka = document.getElementById("blocksa");
            this.txlistBtn = document.getElementById("txlist-btn");
            this.txlista = document.getElementById("txlista");
            this.addrsBtn = document.getElementById("addrs-btn");
            this.addrsa = document.getElementById("addrsa");
            this.assetBtn = document.getElementById("asset-btn");
            this.asseta = document.getElementById("assetsa");
            this.walletBtn = document.getElementById("wallet-btn");
            this.walleta = document.getElementById("walleta");
            this.searchBtn = document.getElementById("searchBtn");
            this.searchText = document.getElementById("searchText");
        }
        start() {
            this.indexa.onclick = () => {
                this.skip("");
            };
            this.blocka.onclick = () => {
                this.skip("/blocks");
            };
            this.txlista.onclick = () => {
                this.skip("/transactions");
            };
            this.addrsa.onclick = () => {
                this.skip("/addresses");
            };
            this.asseta.onclick = () => {
                this.skip("/assets");
            };
            this.searchBtn.onclick = () => {
                this.jump();
            };
            this.searchText.onkeydown = (e) => {
                if (e.keyCode == 13) {
                    this.jump();
                }
            };
            this.walletBtn.onclick = () => {
                if (WebBrowser.locationtool.getNetWork() == 'testnet')
                    window.open("https://testwallet.nel.group/");
                else
                    window.open("https://wallet.nel.group/");
            };
        }
        skip(page) {
            window.location.href = WebBrowser.locationtool.getUrl() + page;
        }
        jump() {
            let search = this.searchText.value;
            if (search.length == 34) {
                if (WebBrowser.Neotool.verifyPublicKey(search)) {
                    window.open(WebBrowser.locationtool.getUrl() + '/address/' + search);
                }
                else {
                    $("#errContent").text('请输入正确的地址');
                    $('#errMsg').modal('show');
                }
            }
            search = search.replace('0x', '');
            if (search.length == 64) {
                window.open(WebBrowser.locationtool.getUrl() + '/transaction/' + search);
            }
            else if (!isNaN(Number(search))) {
                window.open(WebBrowser.locationtool.getUrl() + '/block/' + search);
            }
            else {
                $("#errContent").text('输入有误，请重新输入');
                $('#errMsg').modal('show');
                return false;
            }
        }
    }
    WebBrowser.Navbar = Navbar;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class NetWork {
        constructor() {
            this.title = document.getElementById("network");
            this.testbtn = document.getElementById("testnet-btn");
            this.testa = document.getElementById("testa");
            this.mainbtn = document.getElementById("mainnet-btn");
            this.maina = document.getElementById("maina");
            this.css = document.getElementById("netCss");
        }
        start() {
            this.testa.onclick = () => {
                var href = window.location.href.split("#");
                var net = href[1].replace("mainnet", "");
                net = net.replace("testnet", "");
                net = "#testnet" + net;
                window.location.href = href[0] + net;
            };
            this.maina.onclick = () => {
                var href = window.location.href.split("#");
                var net = href[1].replace("mainnet", "");
                net = net.replace("testnet", "");
                net = "#mainnet" + net;
                window.location.href = href[0] + net;
            };
        }
        changeNetWork(net) {
            if (net == "testnet") {
                this.testbtn.classList.add("active");
                this.mainbtn.classList.remove("active");
                if (location.pathname == '/zh/') {
                    this.title.innerText = "测试网";
                    this.css.href = "../css/testnet.css";
                }
                else {
                    this.title.innerText = "TestNet";
                    this.css.href = "./css/testnet.css";
                }
            }
            if (net == "mainnet") {
                this.mainbtn.classList.add("active");
                this.testbtn.classList.remove("active");
                if (location.pathname == '/zh/') {
                    this.title.innerText = "主网";
                    this.css.href = "../css/mainnet.css";
                }
                else {
                    this.title.innerText = "MainNet";
                    this.css.href = "./css/mainnet.css";
                }
            }
        }
    }
    WebBrowser.NetWork = NetWork;
})(WebBrowser || (WebBrowser = {}));
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
var WebBrowser;
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
(function (WebBrowser) {
    class App {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
            this.navbar = new WebBrowser.Navbar();
            this.netWork = new WebBrowser.NetWork();
            this.block = new WebBrowser.Block();
            this.blocks = new WebBrowser.Blocks();
            this.address = new WebBrowser.Address();
            this.addresses = new WebBrowser.Addresses();
            this.transaction = new WebBrowser.Transaction();
            this.transactions = new WebBrowser.Transactions();
            this.assets = new WebBrowser.Assets();
            this.indexpage = new WebBrowser.Index();
            this.assetinfo = new WebBrowser.AssetInfo();
            this.notfound = new WebBrowser.Notfound();
            this.nep5 = new WebBrowser.Nep5page();
            this.routet = new WebBrowser.Route();
        }
        strat() {
            WebBrowser.CoinTool.initAllAsset();
            this.netWork.start();
            this.navbar.start();
            this.routet.start(this);
            document.getElementsByTagName("body")[0].onhashchange = () => {
                this.routet.start(this);
            };
            $("#searchText").focus(() => {
                $("#nel-search").addClass("nel-input");
            });
            $("#searchText").focusout(() => {
                $("#nel-search").removeClass("nel-input");
            });
        }
        //区块列表
        blocksPage() {
            return __awaiter(this, void 0, void 0, function* () {
                //查询区块数量
                let blockCount = yield this.ajax.post('getblockcount', []);
                //分页查询区块数据
                let pageUtil = new WebBrowser.PageUtil(blockCount[0]['blockcount'], 15);
                let block = new WebBrowser.Blocks();
                block.updateBlocks(pageUtil);
                //监听下一页
                $("#blocks-page-next").off("click").click(() => {
                    if (pageUtil.currentPage == pageUtil.totalPage) {
                        pageUtil.currentPage = pageUtil.totalPage;
                    }
                    pageUtil.currentPage += 1;
                    block.updateBlocks(pageUtil);
                });
                $("#blocks-page-previous").off("click").click(() => {
                    if (pageUtil.currentPage <= 1) {
                        pageUtil.currentPage = 1;
                    }
                    pageUtil.currentPage -= 1;
                    block.updateBlocks(pageUtil);
                });
            });
        }
    }
    WebBrowser.App = App;
    window.onload = () => {
        //WWW.rpc_getURL();
        var app = new App();
        app.strat();
    };
})(WebBrowser || (WebBrowser = {}));
function txgeneral(obj) {
    var div = obj.parentNode;
    var tran = div.getElementsByClassName("transaction")[0];
    if (tran.style.display == "") {
        tran.style.display = "none";
        obj.classList.remove("active");
    }
    else {
        tran.style.display = "";
        obj.classList.add("active");
        var vins = tran.getAttribute('vins');
        var vouts = tran.getAttribute('vouts');
        WebBrowser.Transactions.getTxgeneral(vins, vouts, tran);
    }
}
function txgMsg(obj) {
    var div = obj.parentNode;
    var tran = div.getElementsByClassName("transaction")[0];
    if (tran.style.display == "") {
        tran.style.display = "none";
        obj.classList.remove("active");
    }
    else {
        tran.style.display = "";
        obj.classList.add("active");
        var vins = tran.getAttribute('vins');
        var vouts = tran.getAttribute('vouts');
        WebBrowser.Address.getTxMsg(vins, vouts, tran);
    }
}
//# sourceMappingURL=app.js.map