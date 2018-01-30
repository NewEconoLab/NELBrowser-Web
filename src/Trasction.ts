// import * as $ from "jquery";
/// <reference types="jquery" />
import {Ajax as Ajax, pageCut} from "./Util";
import {Tx as Tx, Asset, AssetEnum, network} from "./Entitys";
import {PageUtil as PageUtil} from "./Entitys";

/**
 * @class 交易记录
 */
export class Trasctions{
    private ajax :Ajax = new Ajax();
    private pageUtil:PageUtil;
    private txlist:JQuery<HTMLElement>;
    constructor(){
        this.ajax.network = network;
        this.txlist = $("#txlist-page");
        this.start();
        //监听交易列表选择框
        $("#TxType").change(()=>{
        this.updateTrasctions(this.pageUtil,<string>$("#TxType").val());
        });
        
        this.txlist.find(".next").click(()=>{
            if(this.pageUtil.currentPage==this.pageUtil.totalPage){
                alert('当前页已经是最后一页了');
                return;
            }else{
                this.pageUtil.currentPage +=1;
                this.updateTrasctions(this.pageUtil,<string>$("#TxType").val());
            }
        });
        this.txlist.find(".previous").click(()=>{
            if(this.pageUtil.currentPage <=1){
                alert('当前已经是第一页了');
                return;
            }else{
                this.pageUtil.currentPage -=1;
                this.updateTrasctions(this.pageUtil,<string>$("#TxType").val());
            }
        });
        
    }

    //更新交易记录
    public async updateTrasctions(pageUtil:PageUtil,txType:string){
        //分页查询交易记录
        let txs:Tx[] = await this.ajax.post('getrawtransactions',[pageUtil.pageSize,pageUtil.currentPage,txType]);
        this.txlist.find("table").children("tbody").empty();
        txs.forEach((tx)=>{
            let txid = tx.txid;
            txid = txid.replace('0x','');
            txid = txid.substring(0,6)+'...'+txid.substring(txid.length-6);
            let html:string="";
            html+="<tr>"
            html+="<td><a class='code' target='_blank' rel='external nofollow' href='./page/txInfo.html?txid="+tx.txid+"'>"+txid 
            html+="</a></td>"
            html+="<td><a href='./page/blcokInfo.html?index="+tx.blockindex+"'>"+tx.blockindex
            html+="</a></td>"
            html+="<td>"+tx.type
            html+="</td>"
            html+="<td>"+(tx.gas==undefined?'0':tx.gas)
            html+="</td>"
            html+="<td>"+tx.size+" bytes"
            html+="</td>"
            html+="</tr>"
            this.txlist.find("table").children("tbody").append(html);
        });
        pageCut(this.pageUtil);
    }
    /**
     * async start
     */
    public async start() {
        let txCount = await this.ajax.post('gettxcount',[]);
        txCount = txCount[0]['txcount'];
        //初始化交易列表
        this.pageUtil = new PageUtil(txCount,15);
        this.updateTrasctions(this.pageUtil,<string>$("#TxType").val());
    } 
}

/**
 * @class 交易详情
 */
export class TrasctionInfo{
    private ajax :Ajax = new Ajax();
    constructor(){
        this.ajax.network = network;}
    public async updateTxInfo(txid:string){
        let txInfos:Tx[] = await this.ajax.post('getrawtransaction',[txid]);
        let txInfo:Tx = txInfos[0];
        $("#type").text(txInfo.type);
        $("#txInfo").text("Hash: "+txInfo.txid);
        $("#index").text(txInfo.blockindex);
        $("#size").text(txInfo.size+" bytes");
        
        let allAsset:Asset[] = await this.ajax.post('getallasset',[]);
        allAsset.map((asset)=>{
            if(asset.id==AssetEnum.NEO){
                asset.name=[{lang:'en',name:'NEO'}];
            }
            if(asset.id==AssetEnum.GAS){
                asset.name=[{lang:'en',name:"GAS"}];
            }
        });

        let arr = new Array<any>();
        for (let index = 0; index < txInfo.vin.length; index++) {
            const vin = txInfo.vin[index];
            let txInfos:Tx[] = await this.ajax.post('getrawtransaction',[vin.txid]);
            let vout = txInfos[0].vout[vin.vout]
            let address:string = vout.address;
            let value :string = vout.value;            
            let name = allAsset.find(val=>val.id==vout.asset).name.map(name=>{return name.name}).join("|");
            arr.push({vin:vin.txid,vout:vin.vout,addr:address,name:name,amount:value});
        }
        let array = this.groupByaddr(arr);
        console.log(array);
        for (let index = 0; index < array.length; index++) {
            const item = array[index];
            let html = "";
            html += '<li class="list-group-item">'
            html += '<table class="table">'
            html += '<thead><h4 class="code">'+item.addr+'</h4></thead>'
            html += '<th>name</th><th>amount</th><th>txid</th>'
            for (let i = 0; i < item.data.length; i++) {
                const element = item.data[i];
                html += '<tr><td>'+element.name+'</td><td>'+element.amount+' </td><td class="code">'+element.vin+' ['+element.vout+']</td></tr>'
            }
            html += '</table>'
            html += '</li>'
            $("#from").append(html);
        }

        // txInfo.vin.forEach(async (vin,index,arry)=>{
        //     let txInfos:Tx[] = await this.ajax.post('getrawtransaction',[vin.txid]);
        //     let vout = txInfos[0].vout[vin.vout]
        //     let address:string = vout.address;
        //     let value :string = vout.value;            
        //     let name = allAsset.find(val=>val.id==vout.asset).name.map(name=>{return name.name}).join("|");
            
        //     $("#from").append('<li class="list-group-item"> </br> txid: <a class="code" href="./txInfo.html?txid='+vin.txid+'">'+vin.txid+'</a>['+vin.vout+'] </li>');
        // });
        txInfo.vout.forEach(vout=>{
            let name = allAsset.find(val=>val.id==vout.asset).name.map(name=>name.name).join("|");
            $("#to").append('<li class="list-group-item"><div class="row"><div class="col-md-1"><h4>['+vout.n+']</h4></div><div class="col-md-11"><div class="row"><div class="col-md-12">'+name+' '+vout.value+' </div><div class="col-md-12"> <a class="code">'+vout.address+'</a></div></div></div></li>');
        });
    }

    groupByaddr(arr:any[]){
        var map = {},
        dest = [];
        for(var i = 0; i < arr.length; i++){
            var ai = arr[i];
            if(!map[ai.addr]){
                dest.push({
                    addr: ai.addr,
                    data: [ai]
                });
                map[ai.addr] = ai;
            }else{
                for(var j = 0; j < dest.length; j++){
                    var dj = dest[j];
                    if(dj.addr == ai.addr){
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        return dest;
    }

}

