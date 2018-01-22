/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Ajax {
    constructor() { }
    /**
     * async post
     */
    post(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'POST',
                    url: 'http://47.96.168.8:81/api/testnet',
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
exports.Ajax = Ajax;
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
exports.LocationUtil = LocationUtil;
class NeoUtil {
    constructor() { }
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
}
exports.NeoUtil = NeoUtil;
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
exports.pageCut = pageCut;
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
exports.TableView = TableView;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @private currentPage 当前页
 * @private pageSize 每页条数
 * @private totalCount 总记录数
 * @private currentPage 当前页
 */
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
exports.PageUtil = PageUtil;
var AssetEnum;
(function (AssetEnum) {
    AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
    AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
})(AssetEnum = exports.AssetEnum || (exports.AssetEnum = {}));
class TableMode {
    constructor(ths, tds, tableId) {
        this.ths = ths;
        this.tds = tds;
        this.tablId = tableId;
    }
}
exports.TableMode = TableMode;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
const Util_1 = __webpack_require__(0);
const PagesController_1 = __webpack_require__(3);
const Entitys_1 = __webpack_require__(1);
const blocks_1 = __webpack_require__(5);
const Trasction_1 = __webpack_require__(6);
let ajax = new Util_1.Ajax();
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
            html += '<tr><td><a class="code" href="./page/blockInfo.html?index=' + item.index + '">';
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
            txid = txid.substring(0, 4) + '...' + txid.substring(txid.length - 4);
            let html = "";
            html += "<tr>";
            html += "<td><a class='code' href='./page/txInfo.html?txid=" + tx.txid + "'>" + txid + "</a>";
            html += "</td>";
            html += "<td>" + tx.type;
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
        let pageUtil = new Entitys_1.PageUtil(blockCount[0]['blockcount'], 15);
        let block = new blocks_1.BlockPage();
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
    let locationutil = new Util_1.LocationUtil();
    let hash = location.hash;
    redirect(hash);
    new PagesController_1.SearchController();
    if (page === 'txInfo') {
        let txid = locationutil.GetQueryString("txid");
        let ts = new Trasction_1.TrasctionInfo();
        ts.updateTxInfo(txid);
    }
    if (page === 'blockInfo') {
        let index = Number(locationutil.GetQueryString("index"));
        let block = new blocks_1.BlockPage();
        block.queryBlock(index);
    }
    if (page === 'addrInfo') {
        let addr = locationutil.GetQueryString("addr");
        let addrInfo = new PagesController_1.AddressControll(addr);
        addrInfo.addressInfo();
    }
});
$("#txlist-btn").click(() => { redirect('#txlist-page'); });
$("#addrs-btn").click(() => { redirect("#addrs-page"); });
$("#blocks-btn").click(() => { redirect("#blocks-page"); });
$("#asset-btn").click(() => { redirect("#asset-page"); });
$("#index-btn").click(() => { redirect(""); });
$("#wallet-btn").click(() => { redirect("#wallet-page"); });
function redirect(page) {
    if (page === '') {
        indexPage();
        $('#index-page').show();
    }
    else {
        $('#index-page').hide();
    }
    if (page === '#blocks-page') {
        // let blocks=new BlocksControll();
        // blocks.start();
        blocksPage();
        $(page).show();
    }
    else {
        $('#blocks-page').hide();
    }
    if (page === '#txlist-page') {
        let ts = new Trasction_1.Trasctions();
        $(page).show();
    }
    else {
        $('#txlist-page').hide();
    }
    if (page === '#addrs-page') {
        let addrlist = new PagesController_1.addrlistControll();
        addrlist.start();
        $(page).show();
    }
    else {
        $('#addrs-page').hide();
    }
    if (page === '#asset-page') {
        //启动asset管理器
        let assetControll = new PagesController_1.AssetControll();
        assetControll.allAsset();
        $(page).show();
    }
    else {
        $('#asset-page').hide();
    }
    if (page == "#wallet-page") {
        $(page).show();
    }
    else {
        $("#wallet-page").hide();
    }
}
$("#wallet-new").click(() => {
    $('#exampleModal').modal('show');
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jquery" />
// import * as $ from "jquery";
const Util_1 = __webpack_require__(0);
const Entitys_1 = __webpack_require__(1);
const PageViews_1 = __webpack_require__(4);
class SearchController {
    constructor() {
        this.locationUtil = new Util_1.LocationUtil();
        let page = $('#page').val();
        let url = "";
        let neoUtil = new Util_1.NeoUtil();
        if (page == 'index') {
            url = './page/';
        }
        else {
            url = './';
        }
        $("#searchBtn").click(() => {
            let search = $("#searchText").val();
            if (search.length == 34) {
                if (neoUtil.verifyPublicKey(search)) {
                    window.location.href = url + 'address.html?addr=' + search;
                }
                else {
                    alert('请输入正确的地址');
                }
            }
            search = search.replace('0x', '');
            if (search.length == 64) {
                window.location.href = url + 'txInfo.html?txid=' + search;
            }
            if (!isNaN(Number(search))) {
                window.location.href = url + 'blockInfo.html?index=' + search;
            }
        });
    }
}
exports.SearchController = SearchController;
class AddressControll {
    constructor(address) {
        this.ajax = new Util_1.Ajax();
        this.address = address;
    }
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
                if (balance.asset == Entitys_1.AssetEnum.NEO) {
                    balance.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (balance.asset == Entitys_1.AssetEnum.GAS) {
                    balance.name = [{ lang: 'en', name: "GAS" }];
                }
            });
            let utxo = yield this.ajax.post('getutxo', [this.address]).catch((e) => {
                alert(e);
            });
            let allAsset = yield this.ajax.post('getallasset', []);
            allAsset.map((asset) => {
                if (asset.id == Entitys_1.AssetEnum.NEO) {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (asset.id == Entitys_1.AssetEnum.GAS) {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
            });
            utxo.map((item) => {
                item.asset = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name; }).join("|");
            });
            let addInfo = new PageViews_1.AddressInfoView(balances, utxo, this.address);
            addInfo.loadView(); //加载页面
        });
    }
}
exports.AddressControll = AddressControll;
//地址列表
class addrlistControll {
    constructor() {
        this.ajax = new Util_1.Ajax();
        $("#next").click(() => {
            if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                alert('当前页已经是最后一页了');
                return;
            }
            else {
                this.pageUtil.currentPage += 1;
                this.addrlistInit();
            }
        });
        $("#previous").click(() => {
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
            let view = new PageViews_1.AddrlistView();
            view.loadView(addrlist);
            Util_1.pageCut(this.pageUtil);
        });
    }
    /**
     * start
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            let prom = yield this.ajax.post('getaddrcount', []);
            this.pageUtil = new Entitys_1.PageUtil(prom[0]['addrcount'], 15);
            this.addrlistInit();
        });
    }
}
exports.addrlistControll = addrlistControll;
//资产页面管理器
class AssetControll {
    constructor() {
        this.ajax = new Util_1.Ajax();
    }
    allAsset() {
        return __awaiter(this, void 0, void 0, function* () {
            let allAsset = yield this.ajax.post('getallasset', []);
            allAsset.map((asset) => {
                if (asset.id == Entitys_1.AssetEnum.NEO) {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (asset.id == Entitys_1.AssetEnum.GAS) {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
            });
            let assetView = new PageViews_1.AssetsView(allAsset);
            assetView.loadView(); //调用loadView方法渲染页面
        });
    }
}
exports.AssetControll = AssetControll;
class BlocksControll {
    constructor() {
        this.ajax = new Util_1.Ajax();
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
            let tbmode = new Entitys_1.TableMode(ths, tds, "blocklist");
            let blocksView = new PageViews_1.BlocksView(tbmode, this.next, this.previous, this.text);
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
            this.pageUtil = new Entitys_1.PageUtil(blockCount[0]['blockcount'], 15);
            this.blocksInit();
        });
    }
}
exports.BlocksControll = BlocksControll;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = __webpack_require__(0);
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
            html += '<div id="size" class="panel-body code">';
            html += balance.balance;
            html += '</div></div></div>';
            $("#balance").append(html);
        });
        this.utxo.forEach((utxo) => {
            let html = '';
            html += "<tr>";
            html += "<td><a class='code' href='./txInfo.html?txid=" + utxo.txid + "'>" + utxo.txid;
            html += "</a></td>";
            html += "<td><a href='./blcokInfo.html?index=" + utxo.n + "'>" + utxo.n;
            html += "</a></td>";
            html += "<td>" + utxo.value;
            html += "</td>";
            html += "<td class='code'>" + utxo.asset;
            html += "</td>";
            html += "</tr>";
            $("#utxos").append(html);
        });
    }
}
exports.AddressInfoView = AddressInfoView;
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
            html += '<td><a class="code" href="./address.html?addr=' + item.addr + '">' + item.addr + '</td>';
            html += '<td>' + item.firstDate + '</td>';
            html += '<td>' + item.lastDate + '</td>';
            html += '<td>' + item.txcount + '</td>';
            html += '</tr>';
        });
        $('#addrlist').append(html);
    }
}
exports.AddrlistView = AddrlistView;
class AssetsView {
    constructor(allAsset) {
        this.assets = allAsset;
    }
    /**
     * loadView 页面展现
     */
    loadView() {
        $("#assets").empty();
        this.assets.forEach((asset) => {
            let html = '';
            let name = asset.name.map((name) => { return name.name; });
            let names = name.join("|");
            html += '<div class="col-md-4">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title">' + names + '</h3>';
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
            html += '<li class="list-group-item code"> admin: ';
            html += asset.admin;
            html += '</li>';
            html += '<li class="list-group-item ">';
            html += asset.amount;
            html += '</li>';
            html += '</ul></div></div>';
            $("#assets").append(html);
        });
    }
}
exports.AssetsView = AssetsView;
/**
 * @class 交易记录
 */
class Trasctions {
    constructor() { }
    //更新交易记录
    loadView(txs) {
        $("#transactions").empty();
        txs.forEach((tx) => {
            // console.log(tx);
            let html = "";
            html += "<tr>";
            html += "<td><a class='code' href='./txInfo.html?txid=" + tx.txid + "'>" + tx.txid;
            html += "</a></td>";
            html += "<td><a href='./blcokInfo.html?index=" + tx.blockindex + "'>" + tx.blockindex;
            html += "</a></td>";
            html += "<td>" + tx.type;
            html += "</td>";
            html += "<td>" + (tx.gas == undefined ? '0' : tx.gas);
            html += "</td>";
            html += "<td>" + tx.size + " bytes";
            html += "</td>";
            html += "</tr>";
            $("#transactions").append(html);
        });
    }
}
exports.Trasctions = Trasctions;
class BlocksView {
    constructor(tbmode, next, previous, text) {
        this.next = next;
        this.previous = previous;
        this.text = text;
        this.tbview = new Util_1.TableView("blocks-page", tbmode);
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
exports.BlocksView = BlocksView;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as $ from "jquery";
/// <reference types="jquery" />
const Util_1 = __webpack_require__(0);
class BlockPage {
    constructor() {
        $("#searchBtn").click(() => {
            window.location.href = './blockInfo.html?index=' + $("#searchText").val();
        });
    }
    updateBlocks(pageUtil) {
        return __awaiter(this, void 0, void 0, function* () {
            let ajax = new Util_1.Ajax();
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
                html += '<a href="../page/blockInfo.html?index=' + item.index + '">';
                html += item.index + '</a></td><td>' + item.size;
                html += ' bytes</td><td>' + newDate.toLocaleString() + '</td></tr>';
                $("#blocks-page").find("tbody").append(html);
            });
        });
    }
    queryBlock(index) {
        return __awaiter(this, void 0, void 0, function* () {
            let ajax = new Util_1.Ajax();
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
exports.BlockPage = BlockPage;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as $ from "jquery";
/// <reference types="jquery" />
const Util_1 = __webpack_require__(0);
const Entitys_1 = __webpack_require__(1);
const Entitys_2 = __webpack_require__(1);
/**
 * @class 交易记录
 */
class Trasctions {
    constructor() {
        this.ajax = new Util_1.Ajax();
        this.txlist = $("#txlist-page");
        this.start();
        //监听交易列表选择框
        $("#TxType").change(() => {
            this.updateTrasctions(this.pageUtil, $("#TxType").val());
        });
        this.txlist.find(".next").click(() => {
            if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                alert('当前页已经是最后一页了');
                return;
            }
            else {
                this.pageUtil.currentPage += 1;
                this.updateTrasctions(this.pageUtil, $("#TxType").val());
            }
        });
        this.txlist.find(".previous").click(() => {
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
                txid = txid.substring(0, 6) + '...' + txid.substring(txid.length - 6);
                let html = "";
                html += "<tr>";
                html += "<td><a class='code' href='./txInfo.html?txid=" + tx.txid + "'>" + txid;
                html += "</a></td>";
                html += "<td><a href='./blcokInfo.html?index=" + tx.blockindex + "'>" + tx.blockindex;
                html += "</a></td>";
                html += "<td>" + tx.type;
                html += "</td>";
                html += "<td>" + (tx.gas == undefined ? '0' : tx.gas);
                html += "</td>";
                html += "<td>" + tx.size + " bytes";
                html += "</td>";
                html += "</tr>";
                this.txlist.find("table").children("tbody").append(html);
            });
            Util_1.pageCut(this.pageUtil);
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
            this.pageUtil = new Entitys_2.PageUtil(txCount, 15);
            this.updateTrasctions(this.pageUtil, $("#TxType").val());
        });
    }
}
exports.Trasctions = Trasctions;
/**
 * @class 交易详情
 */
class TrasctionInfo {
    constructor() {
        this.ajax = new Util_1.Ajax();
    }
    updateTxInfo(txid) {
        return __awaiter(this, void 0, void 0, function* () {
            let txInfos = yield this.ajax.post('getrawtransaction', [txid]);
            let txInfo = txInfos[0];
            $("#txInfo").text(txInfo.type + " | Hash: " + txInfo.txid);
            $("#index").text(txInfo.blockindex);
            $("#size").text(txInfo.size + " bytes");
            let allAsset = yield this.ajax.post('getallasset', []);
            allAsset.map((asset) => {
                if (asset.id == Entitys_1.AssetEnum.NEO) {
                    asset.name = [{ lang: 'en', name: 'NEO' }];
                }
                if (asset.id == Entitys_1.AssetEnum.GAS) {
                    asset.name = [{ lang: 'en', name: "GAS" }];
                }
            });
            txInfo.vin.forEach((vin, index, arry) => __awaiter(this, void 0, void 0, function* () {
                let txInfos = yield this.ajax.post('getrawtransaction', [vin.txid]);
                let vout = txInfos[0].vout[vin.vout];
                let address = vout.address;
                let value = vout.value;
                let name = allAsset.find(val => val.id == vout.asset).name.map(name => { return name.name; }).join("|");
                $("#from").append('<li class="list-group-item">' + address + ' ' + value + ' ' + name + ' </br> txid: <a class="code" href="./txInfo.html?txid=' + vin.txid + '">' + vin.txid + '</a> </br>n:' + vin.vout + ' </li>');
            }));
            txInfo.vout.forEach(vout => {
                let name = allAsset.find(val => val.id == vout.asset).name.map(name => name.name).join("|");
                $("#to").append('<li class="list-group-item">' + vout.address + ' ' + vout.value + ' ' + name + '</br>n :' + vout.n + '</li>');
            });
        });
    }
}
exports.TrasctionInfo = TrasctionInfo;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map