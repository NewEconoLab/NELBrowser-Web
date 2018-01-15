import * as $ from "jquery";
import { Ajax , LocationUtil} from './Util';
import { Utxo, Balance } from './Entitys';
import { AddressInfoView } from './PageViews';

export class SearchController{
    public locationUtil:LocationUtil=new LocationUtil();
    constructor(){
        let page:string = $('#page').val() as string;
        let url:string = ""; 
        if(page =='index'){
            url = './page/';
        }else{
            url = './';
        }
        $("#searchBtn").click(()=>{
            let search:string= $("#searchText").val() as string;
            if(search.length==34){
                window.location.href=url+'address.html?index='+search;
            }
            search = search.replace('0x','');
            if(search.length==64){
                window.location.href=url+'txInfo.html?txid='+search;
            }
            if(!isNaN(Number(search))){
                window.location.href=url+'blockInfo.html?index='+search;
            }
        });
    }
}

export class AddressControll{
    private ajax:Ajax = new Ajax();
    private address:string;
    constructor(address:string){
        this.address = address;
    }
    public async addressInfo(){
        let balance:Balance[] = await this.ajax.post('getbalance',[this.address]);
        let utxo:Utxo[] = await this.ajax.post('getutxo',[this.address]);
        let addInfo:AddressInfoView = new AddressInfoView(balance,utxo,this.address);
        addInfo.loadView(); //加载页面
    }
}