import * as $ from "jquery";
import {Ajax as Ajax} from "./Ajax";
import {Tx as Tx} from "./Entitys";
import {PageUtil as PageUtil} from "./Entitys";

export class Trasction{
    private ajax :Ajax = new Ajax();
    constructor(){}
    public async updateTrasctions(pageUtil:PageUtil){
        //分页查询交易记录
        let txs:Tx[] = await this.ajax.post('getrawtransactions',[pageUtil.pageSize,pageUtil.currentPage]);
        txs.forEach((tx)=>{
            console.log(tx);
            let html:string="";
            html+="<tr>"
            html+="<td><a href='./txInfo.html?txid="+tx.txid+"'>"+tx.txid
            html+="</a></td>"
            html+="<td>"+tx.type
            html+="</td>"
            html+="<td>"+(tx.gas==undefined?'':tx.gas)
            html+="</td>"
            html+="<td><a href='./blcokInfo.html?index="+tx.blockindex+"'"+tx.blockindex
            html+="</td>"
            html+="<td>"+tx.size
            html+="</td>"
            html+="</tr>"
            $("#transactions").append(html);
        });
    }

    public async updateTxInfo(txid:string){
        let txInfos:Tx[] = await this.ajax.post('getrawtransaction',[txid]);
        let txInfo:Tx = txInfos[0];
        $("#txInfo").text(txInfo.type+" | Hash: "+txInfo.txid);
        // $().text(txInfo[0].vin[0].txid)
        $("#index").text(txInfo.blockindex);
        $("#size").text(txInfo.size+" bytes");
        
        txInfo.vin.forEach(async (vin,index,arry)=>{
            let txInfos:Tx[] = await this.ajax.post('getrawtransaction',[vin.txid]);
            let address:string = txInfos[0].vout[vin.vout].address;
            let value :string = txInfos[0].vout[vin.vout].value;
            $("#from").append('<li class="list-group-item">'+address+' '+value+' NEO</li>');
        });
        txInfo.vout.forEach(vout=>{
            $("#to").append('<li class="list-group-item">'+vout.address+' '+vout.value+' NEO</li>');
        });
    }
}