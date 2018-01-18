// import * as $ from "jquery";
/// <reference types="jquery" />
import {Ajax as Ajax} from "./Util";
import { PageUtil as PageUtil, Tx as Tx,Block as Block } from './Entitys';

export class BlockPage{
    constructor(){
        $("#searchBtn").click(()=>{
            window.location.href='./blockInfo.html?index='+$("#searchText").val();
        });
    }
    public async updateBlocks(pageUtil:PageUtil){
        let ajax:Ajax = new Ajax();
        let blocks:Block[] = await ajax.post('getblocks',[pageUtil.pageSize,pageUtil.currentPage]);
        $("#blocks").empty();
        if(pageUtil.totalPage-pageUtil.currentPage){
            $("#next").removeClass('disabled');
        }else{
            $("#next").addClass('disabled');
        }
        if(pageUtil.currentPage-1){
            $("#previous").removeClass('disabled');
        }else{
            $("#previous").addClass('disabled');
        }
        let newDate = new Date();
        blocks.forEach((item,index,input)=>{
            newDate.setTime(item.time * 1000);
            let html:string;
            html+='<tr><td>'
            html+='<a href="../page/blockInfo.html?index='+item.index+'">';
            html+=item.index+'</a></td><td>'+item.size;
            html+=' bytes</td><td>'+newDate.toLocaleString()+'</td></tr>';
            $("#blocks").append(html);
        });
    }

    public async queryBlock(index:number){
        let ajax:Ajax = new Ajax();
        let newDate = new Date();
        let blocks:Block[] = await ajax.post('getblock',[index]);
        let block:Block = blocks[0];
        console.log(block);
        newDate.setTime(block.time * 1000);
        $("#hash").text(block.hash);
        $("#size").text(block.size+' byte');
        $("#time").text(newDate.toLocaleString());
        $("#version").text(block.version);
        $("#index").text(block.index);
        let txs:Tx[] = block.tx;
        txs.forEach(tx => {
            $("#txs").append('<tr><td><a href="./txInfo.html?txid='+tx.txid+'">'+tx.txid+'</a></td><td>'+tx.type+'</td><td>'+tx.size+' bytes</td><td>'+tx.version+'</td></tr>');
        });

    }
}
