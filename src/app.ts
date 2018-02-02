///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
import { Ajax as Ajax, LocationUtil as LocationUtil, NeoUtil } from './Util';
import { SearchController, AddressControll, AssetControll, addrlistControll, BlocksControll, WalletControll } from './PagesController';
import { PageUtil, Block, result } from './Entitys';
import {BlockPage}from "./blocks";
import {Trasctions,TrasctionInfo}from "./Trasction";
import { WWW } from './tools/wwwtool';
let ajax:Ajax = new Ajax();
ajax.network="testnet";
//主页
async function indexPage(){
    //查询区块高度(区块数量-1)
    let blockCount = await ajax.post('getblockcount',[]);
    let blockHeight = blockCount[0]['blockcount']-1;
    $("#blockHeight").text(blockHeight.toLocaleString());//显示在页面
    
    //查询交易数量
    let txCount = await ajax.post('gettxcount',[]);
    txCount = txCount[0]['txcount'];
    $("#txcount").text(txCount.toLocaleString());//显示在页面

    //查询地址总数
    let addrCount:number = await ajax.post('getaddrcount',[])
    addrCount = addrCount[0]['addrcount'];
    $("#addrCount").text(addrCount.toLocaleString());
    $("#index-page").find("#blocks").children("tbody").empty();
    //分页查询区块数据
    let blocks:Block[] = await ajax.post('getblocks',[10,1]);
    blocks.forEach((item,index,input)=>{
        var newDate = new Date();
        newDate.setTime(item.time * 1000);
        let html = '';
        html += '<tr><td><a class="code" class="code" target="_blank" rel="external nofollow"  href="./page/blockInfo.html?index='+item.index+'">';
        html += item.index+'</a></td><td>'+item.size+' bytes</td><td>';
        html += newDate.toLocaleString()+'</td>';
        html += '<td>'+item.tx.length+'</td></tr>';
        $("#index-page").find("#blocks").append(html);
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
    $("#index-page").find("#transactions").children("tbody").empty();   
    txs.forEach((tx)=>{
        let txid : string = tx.txid;
        txid = txid.replace('0x','');
        txid = txid.substring(0,4)+'...'+txid.substring(txid.length-4);
        let html:string="";
        html+="<tr>"
        html+="<td><a class='code' class='code' target='_blank' rel='external nofollow'  href='./page/txInfo.html?txid="+tx.txid+"'>"+txid+"</a>"
        html+="</td>"
        html+="<td>"+tx.type
        html+="</td>"
        html+="<td>"+tx.blockindex
        html+="</td>"
        html+="<td>"+tx.size+" bytes"
        html+="</td>"
        html+="</tr>"
        $("#index-page").find("#transactions").children("tbody").append(html);
    });

};

//区块列表
async function blocksPage(){
    //查询区块数量
    let blockCount = await ajax.post('getblockcount',[]);
    //分页查询区块数据
    let pageUtil:PageUtil = new PageUtil(blockCount[0]['blockcount'],15);
    let block:BlockPage = new BlockPage();
    block.updateBlocks(pageUtil);
    //监听下一页
    $("#blocks-page").find("#next").click(()=>{
        if(pageUtil.currentPage==pageUtil.totalPage){
            alert('当前页已经是最后一页了');
            return;
        }
        pageUtil.currentPage +=1;
        block.updateBlocks(pageUtil);
    });
    $("#blocks-page").find("#previous").click(()=>{
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
    let locationutil:LocationUtil = new LocationUtil();
    let hash = location.hash;
    redirect(hash);
    new SearchController();
    if(page==='txInfo'){
        let txid:string = locationutil.GetQueryString("txid");
        let ts:TrasctionInfo = new TrasctionInfo();
        ts.updateTxInfo(txid);
    }
    if(page==='blockInfo'){
        let index:number = Number(locationutil.GetQueryString("index"));
        let block:BlockPage = new BlockPage();
        block.queryBlock(index);
    }
    if(page==='addrInfo'){
        let addr:string = locationutil.GetQueryString("addr");
        let addrInfo:AddressControll = new AddressControll(addr);
        addrInfo.addressInfo();
    }
});


function redirect(page:string){
    if(page===''){
        indexPage();
        $('#index-page').show();
        $("#index-btn").addClass("active");
        $("#brow-btn").removeClass("active");
    }else{
        $('#index-page').hide();
        $("#brow-btn").addClass("active");
        $("#index-btn").removeClass("active");
    }
    if(page==='#blocks-page'){
        // let blocks=new BlocksControll();
        // blocks.start();
        blocksPage();
        $(page).show();
        $("#blocks-btn").addClass("active");
    }else{
        $('#blocks-page').hide();
        $("#blocks-btn").removeClass("active");
    }
    if(page==='#txlist-page'){
        let ts:Trasctions = new Trasctions();
        $(page).show();
        $("#txlist-btn").addClass("active");
    }else{
        $('#txlist-page').hide();
        $("#txlist-btn").removeClass("active");
    }
    if(page==='#addrs-page'){
        let addrlist:addrlistControll = new addrlistControll();
        addrlist.start();
        $(page).show();
        $("#addrs-btn").addClass("active");
    }else{
        $('#addrs-page').hide();
        $("#addrs-btn").removeClass("active");
    }
    if(page==='#asset-page'){
        //启动asset管理器
        let assetControll:AssetControll = new AssetControll();
        assetControll.allAsset();
        $(page).show();
        $("#asset-btn").addClass("active");
    }else{
        $('#asset-page').hide();
        $("#asset-btn").removeClass("active");
    }
    if(page=="#wallet-page"){
        let wallet:WalletControll = new WalletControll();
        $(page).show();
        $("#wallet-btn").addClass("active");
        $("#brow-btn").removeClass("active");

    }else{
        $("#wallet-page").hide();
        $("#wallet-btn").removeClass("active");
    }
}

function onhash(){
    let hash = location.hash;
    redirect(hash);
}

document.getElementsByTagName("body")[0].onhashchange=()=>{onhash()};
WWW.rpc_getURL();