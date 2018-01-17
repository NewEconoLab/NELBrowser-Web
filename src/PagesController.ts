import * as $ from "jquery";
import { Ajax, LocationUtil, NeoUtil } from './Util';
import { Utxo, Balance, Asset, AssetEnum } from './Entitys';
import { AddressInfoView,AssetsView } from './PageViews';

export class SearchController{
    public locationUtil:LocationUtil=new LocationUtil();
    constructor(){
        let page:string = $('#page').val() as string;
        let url:string = ""; 
        let neoUtil: NeoUtil = new NeoUtil();
        if(page =='index'){
            url = './page/';
        }else{
            url = './';
        }
        $("#searchBtn").click(()=>{
            let search:string= $("#searchText").val() as string;
            if(search.length==34){
                if(neoUtil.verifyPublicKey(search)){
                    window.location.href=url+'address.html?index='+search;
                }else{
                    alert('请输入正确的地址');
                }
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
        let balances:Balance[] = await this.ajax.post('getbalance',[this.address]);
        let utxo:Utxo[] = await this.ajax.post('getutxo',[this.address]);
        balances.map((balance)=>{
            if(balance.asset==AssetEnum.NEO){
                balance.name=[{lang:'en',name:'NEO'}];
            }
            if(balance.asset==AssetEnum.GAS){
                balance.name=[{lang:'en',name:"GAS"}];
            }
        });
        let addInfo:AddressInfoView = new AddressInfoView(balances,utxo,this.address);
        addInfo.loadView(); //加载页面
    }
}

//资产页面管理器
export class AssetControll{
    private ajax:Ajax = new Ajax();
    constructor(){}
    public async allAsset(){
        let allAsset:Asset[] = await this.ajax.post('getallasset',[]);
        allAsset.map((asset)=>{
            if(asset.id==AssetEnum.NEO){
                asset.name=[{lang:'en',name:'NEO'}];
            }
            if(asset.id==AssetEnum.GAS){
                asset.name=[{lang:'en',name:"GAS"}];
            }
        });
        let assetView : AssetsView = new AssetsView(allAsset);
        assetView.loadView();   //调用loadView方法渲染页面
    }
    
}