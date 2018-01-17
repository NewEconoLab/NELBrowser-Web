///<reference path="../lib/neo-ts.d.ts"/>
import * as $ from "jquery";
import * as bootstrap from "bootstrap";
import {Ajax as Ajax,LocationUtil as LocationUtil} from "./Util";
import { SearchController, AddressControll, AssetControll } from './PagesController';
import {PageUtil} from "./Entitys";
import {BlockPage}from "./blocks";
import {Trasctions}from "./Trasction";
import {TrasctionInfo}from "./Trasction";

let ajax:Ajax = new Ajax();
var array: Uint8Array = Neo.Cryptography.Base58.decode("ALjSnMZidJqd18iQaoCgFun6iqWRm2cVtj");
var hexstr = array.toHexString();
var salt = array.subarray(0, 1);
var hash = array.subarray(1, 1 + 20);
var check = array.subarray(21, 21 + 4);
console.log(salt.toHexString());
console.log(hash.toHexString());
console.log(check.toHexString());
//主页
async function indexPage(){

    //查询区块高度(区块数量-1)
    let blockCount = await ajax.post('getblockcount',[]);
    let blockHeight = blockCount[0]['blockcount']-1;
    $("#blockHeight").text(blockHeight.toLocaleString());//显示在页面
    
    //查询交易数量
    let txcount = await ajax.post('gettxcount',[]);
    txcount = txcount[0]['txcount'];
    $("#txcount").text(txcount.toLocaleString());//显示在页面

    //分页查询区块数据
    let blocks = await ajax.post('getblocks',[10,1]);
    blocks.forEach((item,index,input)=>{
        var newDate = new Date();
        newDate.setTime(item['time'] * 1000);
        $("#blocks").append('<tr><td><a class="code" href="./page/blockInfo.html?index='+item['index']+'">'+item['index']+'</a></td><td>'+item['size']+' bytes</td><td>'+newDate.toLocaleString()+'</td></tr>')
    });

    //分页查询交易记录
    let txs:{
        txid:string,
        size:number,
        type:string,
        version:number,
        blockindex:number,
        gas:string,
    }[] = await ajax.post('getrawtransactions',[10,1]);
    txs.forEach((tx)=>{
        let html:string="";
        html+="<tr>"
        html+="<td><a class='code' href='./page/txInfo.html?txid="+tx.txid+"'>"+tx.txid+"</a>"
        html+="</td>"
        html+="<td>"+tx.type
        html+="</td>"
        html+="<td>"+(tx.gas==undefined?'':tx.gas)
        html+="</td>"
        html+="<td>"+tx.blockindex
        html+="</td>"
        html+="<td>"+tx.size+" bytes"
        html+="</td>"
        html+="</tr>"
        $("#transactions").append(html);
    });

};

//区块列表
async function blocksPage(){
    //查询区块数量
    let blockCount = await ajax.post('getblockcount',[]);
    //分页查询区块数据
    $("#blocks").empty();
    let pageUtil:PageUtil = new PageUtil(blockCount[0]['blockcount'],15);
    let block:BlockPage = new BlockPage();
    block.updateBlocks(pageUtil);
    //监听下一页
    $("#next").click(()=>{
        if(pageUtil.currentPage==pageUtil.totalPage){
            alert('当前页已经是最后一页了');
            return;
        }
        pageUtil.currentPage +=1;
        block.updateBlocks(pageUtil);
    });
    $("#previous").click(()=>{
        if(pageUtil.currentPage <=1){
            alert('当前已经是第一页了');
            return;
        }
        pageUtil.currentPage -=1;
        block.updateBlocks(pageUtil);
    });
}


$(()=>{
    let page = $('#page').val();
    let location:LocationUtil = new LocationUtil();

    new SearchController();

    if(page==='index'){
        indexPage();
    }
    
    if(page==='blocks'){
        let index:number = 0;      //
        blocksPage();
    }
    if(page==='transction'){
        let ts:Trasctions = new Trasctions();
    }
    if(page==='txInfo'){
        let txid:string = location.GetQueryString("txid");
        let ts:TrasctionInfo = new TrasctionInfo();
        ts.updateTxInfo(txid);
    }
    if(page==='blockInfo'){
        let index:number = Number(location.GetQueryString("index"));
        let block:BlockPage = new BlockPage();
        block.queryBlock(index);
    }
    if(page==='addressInfo'){
        let address:string = location.GetQueryString("index");
        let addControll:AddressControll = new AddressControll(address);
        addControll.addressInfo();
    }
    if(page==='assets'){
        //启动asset管理器
        let assetControll:AssetControll = new AssetControll();
        assetControll.allAsset();
    }
});
