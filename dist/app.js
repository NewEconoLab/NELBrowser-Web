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
        }
        close() {
            this.div.hidden = false;
        }
        start() {
            this.div.hidden = true;
            this.div.innerHTML = WebBrowser.pages.block;
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
        }
        start() {
            this.updateBlocks(new WebBrowser.PageUtil(1, 15));
            this.div.hidden = false;
        }
        close() {
            this.div.hidden = true;
        }
        updateBlocks(pageUtil) {
            return __awaiter(this, void 0, void 0, function* () {
                let blocks = yield WebBrowser.WWW.getblocks(pageUtil.pageSize, pageUtil.currentPage);
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
                    let html = `
                <tr>
                <td><a href="` + WebBrowser.Url.href_block(item.index) + `">` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + newDate.toLocaleString() + `</td>
                </tr>`;
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
                    $("#txs").append(`
                    <tr>
                        <td><a href="` + WebBrowser.Url.href_transaction(tx.txid) + `> + tx.txid + '</a></td>
                        <td>` + tx.type + `</td>
                        <td>` + tx.size + ` bytes</td>
                        <td>` + tx.version + `</td>
                    </tr>`);
                });
            });
        }
    }
    WebBrowser.Blocks = Blocks;
})(WebBrowser || (WebBrowser = {}));
var WebBrowser;
(function (WebBrowser) {
    class Address {
        constructor() {
            this.div = document.getElementById("address-info");
        }
        close() {
            this.div.hidden = false;
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                this.div.innerHTML = WebBrowser.pages.addres;
                var address = WebBrowser.locationtool.getParam();
                var utxos = yield WebBrowser.WWW.api_getUTXO(address);
                var balances = yield WebBrowser.WWW.api_getbalances(address);
                this.loadView(address, balances, utxos);
                this.div.hidden = false;
            });
        }
        loadView(address, balances, utxos) {
            //$("#balance").empty();
            $("#utxos").empty();
            $("#address").text(address);
            // console.log(this.balances);
            balances.forEach((balance) => {
                let html = '';
                var name = WebBrowser.CoinTool.assetID2name[balance.asset];
                html += '<div class="line" > <div class="title-nel" > <span>' + name + ' </span></div >';
                html += '<div class="content-nel" > <span> ' + balance.balance + ' </span></div > </div>';
                $("#balance").append(html);
            });
            utxos.forEach((utxo) => {
                let html = `
                <tr>
                <td class='code'>` + WebBrowser.CoinTool.assetID2name[utxo.asset] + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_blank' href='` + WebBrowser.Url.href_transaction(utxo.txid) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`;
                $("#utxos").append(html);
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
            this.ajax = new WebBrowser.Ajax();
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
        close() {
            this.div.hidden = true;
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
                this.loadView(addrlist);
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
                this.addrlistInit();
                this.div.hidden = false;
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
                <td><a class="code" target="_blank" href="` + href + `">` + item.addr + `</a></td>
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
        }
        start() {
            this.view(WebBrowser.locationtool.getParam());
            this.div.hidden = false;
        }
        close() {
            this.div.hidden = true;
        }
        view(assetid) {
            this.div.innerHTML = WebBrowser.pages.asset;
            WebBrowser.WWW.api_getAllAssets().then((arr) => {
                var asset = arr.find((value) => {
                    return value.id == assetid;
                });
                asset.names = WebBrowser.CoinTool.assetID2name[asset.id];
                $("#name").text(asset.names);
                $("#type").text(asset.type);
                $("#id").text(asset.id);
                $("#available").text(asset.available);
                $("#precision").text(asset.precision);
                $("#admin").text(asset.admin);
            });
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
        }
        close() {
            this.div.hidden = true;
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                this.allAsset();
                this.div.hidden = false;
            });
        }
        allAsset() {
            return __awaiter(this, void 0, void 0, function* () {
                var assets = yield WebBrowser.WWW.api_getAllAssets();
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
                this.loadView(assets, nep5s); //调用loadView方法渲染页面
            });
        }
        /**
         * loadView 页面展现
         */
        loadView(assets, nep5ass) {
            $("#assets").empty();
            $("#nep5ass").empty();
            assets.forEach((asset) => {
                let href = WebBrowser.Url.href_asset(asset.id);
                let html = `
                <tr>
                <td> <a href="` + href + `">` + WebBrowser.CoinTool.assetID2name[asset.id] + `</a></td>
                <td>` + asset.type + `</td>
                <td>` + (asset.amount <= 0 ? asset.available : asset.amount) + `</td>
                <td>` + asset.precision + `</td>
                </tr>`;
                $("#assets").append(html);
            });
            nep5ass.forEach((asset) => {
                let html = `
                <tr>
                <td>` + asset.names + `</td>
                <td>` + asset.type + `</td><td>` + asset.names + `</td>
                <td>` + (asset.amount <= 0 ? asset.available : asset.amount);
                +`</td>
                <td>` + asset.names + `</td></tr>`;
                $("#nep5ass").append(html);
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
        }
        close() {
            this.div.hidden = true;
        }
        updateTxInfo(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                let txInfo = yield WebBrowser.WWW.getrawtransaction(txid);
                $("#type").text(txInfo.type.replace("Transaction", ""));
                $("#txid").text(txInfo.txid);
                $("#blockindex").append("<a href='" + WebBrowser.Url.href_block(txInfo.blockindex) + "</a>");
                $("#txsize").append(txInfo.size + " bytes");
                $("#sysfee").text(txInfo["sys_fee"] + " gas");
                $("#netfee").text(txInfo["net_fee"] + " gas");
                let allAsset = yield WebBrowser.WWW.api_getAllAssets();
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
                        let txInfo = yield WebBrowser.WWW.getrawtransaction(vin.txid);
                        let vout = txInfo.vout[vin.vout];
                        let address = vout.address;
                        let value = vout.value;
                        let name = allAsset.find(val => val.id == vout.asset).name.map(name => { return name.name; }).join("|");
                        arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
                    }
                    catch (error) {
                    }
                }
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
                txInfo.vout.forEach(vout => {
                    let name = allAsset.find(val => val.id == vout.asset).name.map(name => name.name).join("|");
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
        start() {
            this.div.innerHTML = WebBrowser.pages.transaction;
            this.div.hidden = false;
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
          <div class="line"><div class="title-nel"><span>Block 1723980</span></div></div>
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
                <th>Vesion</th>
            </tr>
        </thead>
        <tbody id="txs"></tbody>
    </table>
    `;
        pages.transaction = `
    <div class="title"><span>Transaction Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Block 1723980</span></div></div>
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
        <div class="title"><span>Address info</span></div>

        <div class="list-nel">
            <div class="list-head">
                <div class="line"><div class="title-nel"><span id="address"></span></div></div>
            </div>
            <div class="list-body" id="balance">
                <div class="line"><div class="title-nel"><span>Address</span></div> <div class="content-nel"><span id="hash"></span></div></div>
            </div>
        </div>

        <div class="title"><span>Nep5</span></div>
        <div class="input-group " id="nel-search">
            <input id="nep5-text" type="text" class="form-control nel" placeholder="TxHash/Addr/blockHeight">
            <span id="nep5-btn" class="input-group-addon nel ">
                <img src="fonts/search.svg" width="18" height="18" />
            </span>
        </div>
        <div class="list-nel">
            <div class="list-head">
                <div class="line"><div class="title-nel"><span></span></div></div>
            </div>
            <div class="list-body" id="nep5balance">
            </div>
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
        <tbody id="utxos"></tbody>
    </table>
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
            this.viewtxlist = document.getElementById("viewtxlist");
            this.viewblocks = document.getElementById("viewblocks");
            this.alladdress = document.getElementById("alladdress");
            this.allblock = document.getElementById("allblock");
            this.alltxlist = document.getElementById("alltxlist");
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
                //查询区块高度(区块数量-1)
                let blockHeight = yield WebBrowser.WWW.api_getHeight();
                //查询交易数量
                let txCount = yield WebBrowser.WWW.gettxcount();
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
                    var newDate = new Date();
                    newDate.setTime(item.time * 1000);
                    html_blocks += `
                <tr><td>
                <a class="code" target="_blank" href ='` + WebBrowser.Url.href_block(item.index) + `' > 
                ` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td>
                <td>` + newDate.toLocaleString() + `</td>
                <td>` + item.tx.length + `</td></tr>`;
                });
                txs.forEach((tx) => {
                    let txid = tx.txid;
                    let txtype = tx.type.replace("Transaction", "");
                    txid = txid.replace('0x', '');
                    txid = txid.substring(0, 4) + '...' + txid.substring(txid.length - 4);
                    html_txs += `
                <tr>
                <td><a class='code' class='code' target='_blank'
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
                this.div.hidden = false;
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
    }
    WebBrowser.Url = Url;
    class Nep5as {
    }
    WebBrowser.Nep5as = Nep5as;
    class nep5Asset {
    }
    WebBrowser.nep5Asset = nep5Asset;
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
            this.txlist = $("#txlist-page");
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
        close() {
            this.div.hidden = true;
        }
        //更新交易记录
        updateTrasctions(pageUtil, txType) {
            return __awaiter(this, void 0, void 0, function* () {
                this.txlist.find("#transactions").empty();
                //分页查询交易记录
                let txs = yield WebBrowser.WWW.getrawtransactions(pageUtil.pageSize, pageUtil.currentPage, txType);
                console.log(txs);
                this.txlist.find("table").children("tbody").empty();
                for (var n = 0; n < pageUtil.pageSize; n++) {
                    let txid = txs[n].txid;
                    let html = yield this.getTxLine(txid, txs[n].type, txs[n].size.toString(), txs[n].blockindex.toString(), txs[n].vin, txs[n].vout);
                    this.txlist.find("#transactions").append(html);
                }
                WebBrowser.pageCut(this.pageUtil);
            });
        }
        /**
         * async start
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                let txCount = yield WebBrowser.WWW.gettxcount();
                //初始化交易列表
                this.pageUtil = new WebBrowser.PageUtil(txCount, 15);
                this.updateTrasctions(this.pageUtil, $("#TxType").val());
                this.div.hidden = false;
            });
        }
        getTxLine(txid, type, size, index, vins, vouts) {
            return __awaiter(this, void 0, void 0, function* () {
                var id = txid.replace('0x', '');
                id = txid.substring(0, 6) + '...' + id.substring(txid.length - 6);
                return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="` + WebBrowser.Url.href_transaction(txid) + `" >` + id + `</a></span></div>
                    <div class="content-nel"><span>` + type.replace("Transaction", "") + `</span></div>
                    <div class="content-nel"><span>` + size + ` bytes</span></div>
                    <div class="content-nel"><span><a href="` + WebBrowser.Url.href_block(parseInt(index)) + `" >` + index + `</a></span></div>
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
            return arr[0] + hasharr[0];
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
            this.pagelist.push(app.transactions);
            this.pagelist.push(app.addresses);
            this.pagelist.push(app.assets);
            this.closePages();
            var page = this.render();
            page.start();
        }
        render() {
            switch (WebBrowser.locationtool.getPage()) {
                case "explorer":
                    this.app.navbar.indexBtn.classList.add("active");
                    return this.app.indexpage;
                case "blocks":
                    this.app.navbar.blockBtn.classList.add("active");
                    return this.app.blocks;
                case "transactions":
                    this.app.navbar.txlistBtn.classList.add("active");
                    return this.app.transactions;
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
                    alert('请输入正确的地址');
                }
            }
            search = search.replace('0x', '');
            if (search.length == 64) {
                window.open(WebBrowser.locationtool.getUrl() + '/transaction/' + search);
            }
            if (!isNaN(Number(search))) {
                window.open(WebBrowser.locationtool.getUrl() + '/block/' + search);
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
                this.title.innerText = "TestNet";
                this.testbtn.classList.add("active");
                this.mainbtn.classList.remove("active");
                this.css.href = "./css/testnet.css";
            }
            if (net == "mainnet") {
                this.title.innerText = "MainNet";
                this.mainbtn.classList.add("active");
                this.testbtn.classList.remove("active");
                this.css.href = "./css/mainnet.css";
            }
        }
    }
    WebBrowser.NetWork = NetWork;
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
        static makeRpcUrl(method, ..._params) {
            var url = WWW.api + WebBrowser.locationtool.getNetWork();
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
        static gettxcount() {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("gettxcount");
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
        //查询区块列表
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
                var str = WWW.makeRpcUrl("getallnep5asset", [20, 1]);
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
        static api_getUTXO(address) {
            return __awaiter(this, void 0, void 0, function* () {
                var str = WWW.makeRpcUrl("getutxo", address);
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
    }
    WWW.api = "https://api.nel.group/api/";
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
    class AddressControll {
        constructor(address) {
            this.ajax = new WebBrowser.Ajax();
            this.address = address;
            $("#nep5-btn").click(() => {
                this.nep5Info();
            });
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
                    alert("This address has no record of transactions");
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
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        allAsset() {
            return __awaiter(this, void 0, void 0, function* () {
                this.assets = yield this.ajax.post('getallasset', []);
                this.assets.map((asset) => {
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
                let assetView = new WebBrowser.AssetsView(this.assets, nep5s);
                yield assetView.loadView(); //调用loadView方法渲染页面
            });
        }
    }
    WebBrowser.AssetControll = AssetControll;
    class BlocksControll {
        constructor() {
            this.ajax = new WebBrowser.Ajax();
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
/// <reference path="./tools/locationtool.ts" />
/// <reference path="./tools/numbertool.ts" />
/// <reference path="./tools/routetool.ts" />
/// <reference path="./Util.ts" />
/// <reference path="./Navbar.ts" />
/// <reference path="./Network.ts" />
/// <reference path="./PagesController.ts" />
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
/// <reference path="./tools/locationtool.ts" />
/// <reference path="./tools/numbertool.ts" />
/// <reference path="./tools/routetool.ts" />
/// <reference path="./Util.ts" />
/// <reference path="./Navbar.ts" />
/// <reference path="./Network.ts" />
/// <reference path="./PagesController.ts" />
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
            this.routet = new WebBrowser.Route();
        }
        strat() {
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
var WebBrowser;
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
            //$("#balance").empty();
            $("#utxos").empty();
            $("#address").text(this.address);
            // console.log(this.balances);
            this.balances.forEach((balance) => {
                let html = '';
                let name = balance.name.map((name) => { return name.name; }).join('|');
                html += '<div class="line" > <div class="title-nel" > <span>' + name + ' </span></div >';
                html += '<div class="content-nel" > <span> ' + balance.balance + ' </span></div > </div>';
                $("#balance").append(html);
            });
            this.utxo.forEach((utxo) => {
                let html = `
                <tr>
                <td class='code'>` + utxo.asset + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_blank' href='` + WebBrowser.Url.href_transaction(utxo.txid) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`;
                $("#utxos").append(html);
            });
        }
        /**
         * loadNep5
         */
        loadNep5(name, symbol, balance) {
            $("#nep5balance").empty();
            var html = '<div class="line" > <div class="title-nel" > <span>[' + symbol + '] ' + name + ' </span></div>';
            html += '<div class="content-nel" > <span>' + balance + ' </span></div> </div>';
            $("#nep5balance").append(html);
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
                var html = '<div class="line" > <div class="title-nel" > <span>[' + symbol + '] ' + name + ' </span></div >';
                html += '<div class="content-nel" > <span>' + balance + ' </span></div > </div>';
                $("#nep5assets").append(html);
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
            addrlist.forEach(item => {
                let href = WebBrowser.locationtool.getUrl() + `/address/` + item.addr;
                let html = `
                <tr>
                <td><a class="code" target="_blank" href="` + href + `">` + item.addr + `</a></td>
                <td>` + item.firstDate + `</td>
                <td>` + item.lastDate + `</td>
                <td>` + item.txcount + `</td></tr>`;
                $('#addrlist').append(html);
            });
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
                let href = './#' + WebBrowser.locationtool.getNetWork() + '/asset/' + asset.id;
                let html = `
                <tr>
                <td> <a href="` + href + `">` + asset.names + `</a></td>
                <td>` + asset.type + `</td>
                <td>` + (asset.amount <= 0 ? asset.available : asset.amount) + `</td>
                <td>` + asset.precision + `</td>
                </tr>`;
                $("#assets").append(html);
            });
            this.nep5s.forEach((asset) => {
                let html = `
                <tr>
                <td>` + asset.names + `</td>
                <td>` + asset.type + `</td><td>` + asset.names + `</td>
                <td>` + (asset.amount <= 0 ? asset.available : asset.amount);
                +`</td>
                <td>` + asset.names + `</td></tr>`;
                $("#nep5ass").append(html);
            });
        }
    }
    WebBrowser.AssetsView = AssetsView;
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
            let lis = '';
            for (let n = 0; n < detail.balances.length; n++) {
                const balance = detail.balances[n];
                let name = balance.name.map((name) => { return name.name; }).join('|');
                lis += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
            }
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
            html += lis;
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
                let html = `
                <tr>
                <td class='code'>` + utxo.name + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_blank' rel='external nofollow' href='` + WebBrowser.Url.href_transaction(utxo.txid) + `'>` + utxo.txid + `
                </a>[" + utxo.n + "]</td>"
                </tr>`;
                $("#wallet-utxos").append(html);
            });
        }
    }
    WebBrowser.WalletView = WalletView;
})(WebBrowser || (WebBrowser = {}));
//# sourceMappingURL=app.js.map