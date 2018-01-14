import * as $ from "jquery";
import {Ajax as Ajax} from "./Ajax";
import {PageUtil as PageUtil} from "./Entitys";

export class Block{
    constructor(){}
    public async updateBlocks(pageUtil:PageUtil){
        let ajax:Ajax = new Ajax();
        let blocks = await ajax.post('getblocks',[pageUtil.pageSize,pageUtil.currentPage]);
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
        blocks.forEach((item,index,input)=>{
            var newDate = new Date();
            newDate.setTime(item['time'] * 1000);
            let html:string;
            html+='<tr><td>'
            html+='<a href="../page/blockInfo.html?index='+item['index']+'">';
            html+=item['index']+'</a></td><td>'+item['size'];
            html+=' bytes</td><td>'+newDate.toLocaleString()+'</td></tr>';
            $("#blocks").append(html);
        });
    }

    public async queryBlock(index:number){
        let ajax:Ajax = new Ajax();
        var newDate = new Date();
        let result = await ajax.post('getblock',[index]);
        let block = result[0];
        console.log(block);
        newDate.setTime(block['time'] * 1000);
        $("#hash").text(block['hash']);
        $("#size").text(block['size']+' byte');
        $("#time").text(newDate.toLocaleString());
        $("#version").text(block['version']);
        $("#index").text(block['index']);
        let txs:{
            attributes:any[],
            net_fee:string,
            nonce:number,
            scripts:any[],
            size:number,
            sys_fee:string,
            txid:string,
            type:string,
            version:number
        }[] = block['tx']
        txs.forEach(tx => {
            $("#txs").append('<tr><td><a href="./txInfo.html?txid='+tx.txid+'">'+tx.txid+'</a></td><td>'+tx.type+'</td><td>'+tx.size+' bytes</td><td>'+tx.version+'</td></tr>');
        });


    }
}
