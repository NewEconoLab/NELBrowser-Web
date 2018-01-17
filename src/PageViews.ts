import * as $ from "jquery";
import { Balance, Utxo, Asset, PageUtil, Tx } from './Entitys';
export class AddressInfoView{
    public balances:Balance[];
    public utxo:Utxo[];
    public address:string;
    constructor(balances:Balance[],utxo:Utxo[],address:string){
        this.balances = balances;
        this.address = address;
        this.utxo = utxo;
    }
    /**
     * loadView
     */
    public loadView() {
        $("#address").text('address | '+this.address);
        // console.log(this.balances);
        this.balances.forEach((balance:Balance)=>{
            
            let html ='';
            let name = balance.name.map((name)=>{ return name.name}).join('|');
            html += '<div class="col-md-6">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title">'+name+'</h3>';
            html += '</div>';
            html += '<div id="size" class="panel-body code">';
            html += balance.balance;
            html += '</div></div></div>';
           $("#balance").append(html);
        });
        this.utxo.forEach((utxo:Utxo)=>{
            let html ='';
            html+="<tr>"
            html+="<td><a class='code' href='./txInfo.html?txid="+utxo.txid+"'>"+utxo.txid
            html+="</a></td>"
            html+="<td><a href='./blcokInfo.html?index="+utxo.n+"'>"+utxo.n
            html+="</a></td>"
            html+="<td>"+utxo.value;
            html+="</td>"
            html+="<td class='code'>"+utxo.asset;
            html+="</td>"
            html+="</tr>"
            $("#utxos").append(html);
        });
    }
}

export class AssetsView{
    private assets:Asset[];
    constructor(allAsset:Asset[]){
        this.assets = allAsset;
    }
    
    /**
     * loadView 页面展现
     */
    public loadView() {
        console.log(this.assets);
        this.assets.forEach((asset:Asset)=>{
            let html ='';
            let name = asset.name.map((name)=>{ return name.name})
            let names = name.join("|");
            html += '<div class="col-md-4">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title">'+names+'</h3>';
            html += '</div>';
            html += '<ul id="size" class="list-group" >';
            html += '<li class="list-group-item"> 类型: '
            html += asset.type
            html += '</li>'
            html += '<li class="list-group-item"> 总量: '
            html += asset.amount
            html += '</li>'
            html += '<li class="list-group-item code"> id: '
            html += asset.id
            html += '</li>'
            html += '<li class="list-group-item code"> admin: '
            html += asset.admin
            html += '</li>'
            html += '<li class="list-group-item ">'
            html += asset.amount
            html += '</li>'
            html += '</ul></div></div>';
           $("#assets").append(html);
        });
    }
}

/**
 * @class 交易记录
 */
export class Trasctions{
    constructor(){}
    //更新交易记录
    public loadView(txs:Tx[]){
        $("#transactions").empty();
        txs.forEach((tx)=>{
            // console.log(tx);
            let html:string="";
            html+="<tr>"
            html+="<td><a class='code' href='./txInfo.html?txid="+tx.txid+"'>"+tx.txid
            html+="</a></td>"
            html+="<td><a href='./blcokInfo.html?index="+tx.blockindex+"'>"+tx.blockindex
            html+="</a></td>"
            html+="<td>"+tx.type
            html+="</td>"
            html+="<td>"+(tx.gas==undefined?'0':tx.gas)
            html+="</td>"
            html+="<td>"+tx.size+" bytes"
            html+="</td>"
            html+="</tr>"
            $("#transactions").append(html);
        });
    }
}


