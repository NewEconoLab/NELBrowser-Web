// import * as $ from "jquery";
/// <reference types="jquery" />
import { Balance, Utxo, Asset, PageUtil, Tx, Addr, TableMode, Nep5as } from './Entitys';
import { TableView } from './Util';
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
        $("#balance").empty();
        $("#utxos").empty();
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
            html += '<div id="size" class="panel-body">';
            html += balance.balance;
            html += '</div></div></div>';
           $("#balance").append(html);
        });
        this.utxo.forEach((utxo:Utxo)=>{
            let html ='';
            html+="<tr>"
            html+="<td class='code'>"+utxo.asset;
            html+="</td>"
            html+="<td>"+utxo.value;
            html+="</td>"
            html+="<td><a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid="+utxo.txid+"'>"+utxo.txid
            html+="</a>["+utxo.n+"]</td>"
            html+="</tr>"
            $("#utxos").append(html);
        });
    }
    /**
     * loadNep5
     */
    public loadNep5(name:string,symbol:string,balance:number) {
        $("#nep5balance").empty();
        $("#nep5balance").append('<li class="list-group-item">['+symbol+'] '+name+': '+balance+'</li>');
    }
}

export class AddrlistView{
    constructor(){}

    /**
     * loadView
     */
    public loadView(addrlist:Addr[]) {
        $("#addrlist").empty();
        let html = '';
        addrlist.forEach(item => {
            html+='<tr>';
            html+='<td><a class="code" target="_blank" rel="external nofollow" href="./page/address.html?addr='+item.addr+'">'+item.addr+'</a></td>';
            html+='<td>'+item.firstDate+'</td>';
            html+='<td>'+item.lastDate+'</td>';
            html+='<td>'+item.txcount+'</td>';
            html+='</tr>';
        });
        $('#addrlist').append(html);
    }
}

export class AssetsView{
    private assets:Asset[];
    private nep5s:Asset[];
    constructor(allAsset:Asset[],nep5s:Asset[]){
        this.assets = allAsset;
        console.log(nep5s);
        this.nep5s = nep5s;
    }
    
    /**
     * loadView 页面展现
     */
    public loadView() {
        $("#assets").empty();
        this.assets.forEach((asset:Asset)=>{
            let html ='';
            html += '<div class="col-md-4">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title">'+asset.names+'</h3>';
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
            html += '</ul></div></div>';
           $("#assets").append(html);
        });
        this.nep5s.forEach((asset:Asset)=>{
            let html ='';
            html += '<div class="col-md-4">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title">'+asset.names+'</h3>';
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
            html += '</ul></div></div>';
           $("#nep5ass").append(html);
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


export class BlocksView{
    private previous:HTMLLIElement;
    private next:HTMLLIElement;
    private text:HTMLAnchorElement;
    private tbview:TableView;
    constructor(tbmode:TableMode,next:HTMLLIElement,previous:HTMLLIElement,text:HTMLAnchorElement){
        this.next=next;
        this.previous = previous;
        this.text = text;
        this.tbview = new TableView("blocks-page",tbmode);
        this.tbview.className = "table cool table-hover";
        this.tbview.update();     
    }
    /**
     * loadView()
     */
    public loadView(pageUtil:PageUtil) {
        this.text.text="总记录数:"+pageUtil.totalCount+" 总页数:"+pageUtil.totalPage+" 当前页:"+pageUtil.currentPage;
        if(pageUtil.totalPage-pageUtil.currentPage){
            this.next.classList.remove('disabled');
        }else{
            this.next.classList.add('disabled');
        }
        if(pageUtil.currentPage-1){
            this.previous.classList.remove('disabled');
        }else{
            this.previous.classList.add('disabled');
        }
        this.tbview.update();     
    }
}