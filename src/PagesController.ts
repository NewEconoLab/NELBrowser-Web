/// <reference types="jquery" />
// import * as $ from "jquery";
import { Ajax, LocationUtil, NeoUtil, pageCut } from './Util';
import { Utxo, Balance, Asset, AssetEnum, PageUtil, Addr, Block, TableMode } from './Entitys';
import { AddressInfoView,AssetsView, AddrlistView, BlocksView } from './PageViews';

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
                    window.location.href=url+'address.html?addr='+search;
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
        let balances:Balance[] = await this.ajax.post('getbalance',[this.address]).catch((e)=>{
            alert(e);
        });;

        if(balances.length<1){
            alert("当前地址余额为零");
        }
        balances.map((balance)=>{
            if(balance.asset==AssetEnum.NEO){
                balance.name=[{lang:'en',name:'NEO'}];
            }
            if(balance.asset==AssetEnum.GAS){
                balance.name=[{lang:'en',name:"GAS"}];
            }
        });
        
        let utxo:Utxo[] = await this.ajax.post('getutxo',[this.address]).catch((e)=>{
            alert(e);
        });
        
        let allAsset:Asset[] = await this.ajax.post('getallasset',[]);
        allAsset.map((asset)=>{
            if(asset.id==AssetEnum.NEO){
                asset.name=[{lang:'en',name:'NEO'}];
            }
            if(asset.id==AssetEnum.GAS){
                asset.name=[{lang:'en',name:"GAS"}];
            }
        });

        utxo.map((item)=>{
            item.asset = allAsset.find(val => val.id==item.asset).name.map((name)=>{ return name.name}).join("|");
        })

        let addInfo:AddressInfoView = new AddressInfoView(balances,utxo,this.address);
        addInfo.loadView(); //加载页面
    }
}
//地址列表
export class addrlistControll{
    private pageUtil:PageUtil;
    private ajax:Ajax = new Ajax();
    constructor(){        
        $("#next").click(()=>{
            if(this.pageUtil.currentPage==this.pageUtil.totalPage){
                alert('当前页已经是最后一页了');
                return;
            }else{
                this.pageUtil.currentPage +=1;
                this.addrlistInit();
            }
        });
        $("#previous").click(()=>{
            if(this.pageUtil.currentPage <=1){
                alert('当前已经是第一页了');
                return;
            }else{
                this.pageUtil.currentPage -=1;
                this.addrlistInit();
            }
        });
    }
    /**
     * addrlistInit
     */
    public async addrlistInit() {
        let addrcount = await this.ajax.post('getaddrcount',[]).catch((e)=>{
            alert(e);
        });
        if(addrcount.length==0){
            alert('此地址余额为空，utxo为空');
        }
        this.pageUtil.totalCount = addrcount[0]['addrcount'];
        let addrlist:Addr[] = await this.ajax.post('getaddrs',[this.pageUtil.pageSize,this.pageUtil.currentPage]);        
        let newDate:Date = new Date();
        addrlist.map((item)=>{
            newDate.setTime(item.firstuse.blocktime.$date);
            item.firstDate=newDate.toLocaleString();
            newDate.setTime(item.lastuse.blocktime.$date);
            item.lastDate=newDate.toLocaleString();
        });
        let view:AddrlistView = new AddrlistView();
        view.loadView(addrlist);
        pageCut(this.pageUtil);
    }
    /**
     * start
     */
    public async start() {
        let prom = await this.ajax.post('getaddrcount',[]);            
        this.pageUtil = new PageUtil(prom[0]['addrcount'],15);
        this.addrlistInit();
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

export class BlocksControll{
    private ajax:Ajax = new Ajax();
    private pageUtil:PageUtil;
    private ul:HTMLUListElement;
    private previous:HTMLLIElement;
    private next:HTMLLIElement;
    private older:HTMLAnchorElement;
    private newer:HTMLAnchorElement;
    private text:HTMLAnchorElement;
    constructor(){
        
        this.previous=document.createElement("li");
        this.next=document.createElement("li");
        this.ul = document.createElement("ul");
        this.ul.className="pager";
        this.previous.className="previous disabled";
        this.next.className = "next";
        this.older = document.createElement("a");
        this.newer = document.createElement("a");
        this.text = document.createElement("a");
        this.previous.appendChild(this.older);
        this.next.appendChild(this.newer);
        this.older.text="← Older";
        this.newer.text="Newer →";
        this.ul.appendChild(this.previous);
        this.ul.appendChild(this.text);
        this.ul.appendChild(this.next);

        let div = document.getElementById("blocks-page");
        div.appendChild(this.ul);

        this.next.onclick = () => {
            if(this.pageUtil.currentPage==this.pageUtil.totalPage){
                alert('当前页已经是最后一页了');
                return;
            }else{
                this.pageUtil.currentPage +=1;
                this.blocksInit()
            }
        }
        this.previous.onclick = () => {
            if(this.pageUtil.currentPage <=1){
                alert('当前已经是第一页了');
                return;
            }else{
                this.pageUtil.currentPage -=1;
                this.blocksInit()
            }
        }
    }
    /**
     * blocksInit
     */
    private async blocksInit() {
        //分页查询区块数据
        let blocks:Block[] = await this.ajax.post(
            'getblocks',
            [
                this.pageUtil.pageSize,
                this.pageUtil.currentPage
            ]
        ); 
        let ths:Map<string,any> = new Map();
        let tds:Array<Map<string,any>> = new Array<Map<string,any>>();
        
        ths.set('index','index');
        ths.set('size','size');
        ths.set('time','time');
        ths.set('txnumber','txnumber');
        let newDate = new Date();
        blocks.forEach((block:Block)=>{
            let td:Map<string,any> = new Map();
            newDate.setTime(block.time * 1000);
            let a:string ='<a href="./page/blockInfo.html?index='+block.index+'">';
            a+=block.index+'</a>';
            td.set('index',a);
            td.set('size',block.size);
            td.set('time',newDate.toLocaleString());
            td.set('txnumber',block.tx.length);
            tds.push(td);
        });
        
        let tbmode:TableMode = new TableMode(ths,tds,"blocklist");
        let blocksView:BlocksView = new BlocksView(tbmode,this.next,this.previous,this.text);
        blocksView.loadView(this.pageUtil);
    }

    /**
     * start
     */
    public async start() {
        //查询区块数量
        let blockCount = await this.ajax.post('getblockcount',[]);
        this.pageUtil = new PageUtil(blockCount[0]['blockcount'],15);
        this.blocksInit();
    }
}