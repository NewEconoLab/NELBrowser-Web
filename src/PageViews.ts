import * as $ from "jquery";
import { Balance, Utxo } from './Entitys';
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
        console.log(this.balances);
        this.balances.forEach((balance:Balance)=>{
            let html ='';
            let name = balance.name.find(i => i.lang == 'zh-CN').name;
            html += '<div class="col-md-6">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title">'+name+'</h3>';
            html += '</div>';
            html += '<div id="size" class="panel-body" style="word-break:break-all;">';
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