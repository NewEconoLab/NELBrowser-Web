/// <reference types="jquery" />
// import * as $ from "jquery";
import { Ajax, LocationUtil, NeoUtil, pageCut, GetNep5Info, StorageUtil } from './Util';
import { Utxo, Balance, Asset, AssetEnum, PageUtil, Addr, Block, TableMode, result, Nep5as } from './Entitys';
import { AddressInfoView,AssetsView, AddrlistView, BlocksView } from './PageViews';

export class SearchController{
    public locationUtil:LocationUtil=new LocationUtil();
    constructor(){
        let page:string = $('#page').val().toString();
        let url:string = ""; 
        let neoUtil: NeoUtil = new NeoUtil();
        if(page =='index'){
            url = './page/';
        }else{
            url = './';
        }
        $("#searchBtn").click(()=>{
            let search:string= $("#searchText").val().toString();
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
    private addInfo:AddressInfoView
    constructor(address:string){
        this.address = address;
        $("#nep5-btn").click(()=>{
            this.nep5Info();
        })
    }
    /**
     * nep5Info
     */
    public async nep5Info() {
        let getNep5:GetNep5Info = new GetNep5Info();
        let asset:string = $("#nep5-text").val().toString();
        let stouitl:StorageUtil = new StorageUtil();
        if(asset.length<1)
            alert("请输入资产id");
        getNep5.getInfo(asset).then((res)=>{
            if(!res.err){
                let name = res.result["name"];
                let symbol = res.result["symbol"];
                return res;
            }else{
                alert("-_-!!!抱歉您的资产id好像不太正确 \n error["+res.result+"]");
            }
        })
        .then((res)=>{
            getNep5.getBalance(asset,this.address)
            .then((balance)=>{
                if(balance.err){
                    alert("=_=!抱歉查询查询余额失败，请检查您的资产id \n error["+balance.result+"]");
                }else{
                    this.addInfo.loadNep5(res.result.name,res.result.symbol,balance.result);
                    let asids:string[] =  stouitl.getStorage("assetIds_nep5","|");
                    if(!asids.find(as=>as==asset)){
                        asids.push(asset);
                        stouitl.setStorage("assetIds_nep5",asids.join('|'));
                    }
                }
            })
        })
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

        this.addInfo = new AddressInfoView(balances,utxo,this.address);
        this.addInfo.loadView(); //加载页面
    }
}
//地址列表
export class addrlistControll{
    private pageUtil:PageUtil;
    private ajax:Ajax = new Ajax();
    constructor(){        
        $("#addrs-page").find("#next").click(()=>{
            if(this.pageUtil.currentPage==this.pageUtil.totalPage){
                alert('当前页已经是最后一页了');
                return;
            }else{
                this.pageUtil.currentPage +=1;
                this.addrlistInit();
            }
        });
        $("#addrs-page").find("#previous").click(()=>{
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
            let name = asset.name.map((name)=>{ return name.name})
            asset.names = name.join("|");
        });
        let nep5Info:GetNep5Info = new GetNep5Info ();
        let storutil:StorageUtil = new StorageUtil();
        let nep5asids:string[] = storutil.getStorage("assetIds_nep5","|");
        let nep5s:Asset[] = new Array<Asset>();
        for(let n=0;n<nep5asids.length;n++){
            let res = await nep5Info.getInfo(nep5asids[n]);
            let assetnep5:Nep5as = new Nep5as();
            if(!res.err){
                assetnep5.names=res.result["name"];
                assetnep5.type= res.result["symbol"]
                assetnep5.amount = res.result["totalsupply"];
                assetnep5.id = nep5asids[n];
            }nep5s.push(assetnep5);
        }
        let assetView : AssetsView = new AssetsView(allAsset,nep5s);
        await assetView.loadView();   //调用loadView方法渲染页面
        
        
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

export class WalletControll{
    private wifInput:JQuery<HTMLElement>;
    private p1Input:JQuery<HTMLElement>;
    private p2Input:JQuery<HTMLElement>;
    private neoUtil:NeoUtil = new NeoUtil();

    constructor(){
        this.wifInput = $('#createWallet').find("#wif-input").children('input');
        this.p1Input = $('#password1');
        this.p2Input = $('#password2');
        this.wifInput.blur(()=>{
            this.verifWif();
        });
        this.p1Input.blur(()=>{
            this.verifpassword();
        });
        this.p2Input.blur(()=>{
            this.verifpassword();
        })
        $('#send-wallet').click(()=>{
            if(this.verifWif()==1){
                if(this.verifpassword()){
                    let res = this.neoUtil.nep2FromWif(this.wifInput.val().toString(),this.p1Input.val().toString());
                    if(!res.err){
                        res.result
                    }
                }
            }
            if(this.verifWif()>1){
                this.verifpassword();
            }
        })
    }
    
    public verifWif():number{
        let wifGroup:JQuery<HTMLElement> = $('#createWallet').find("#wif-input");
        var wif:string = this.wifInput.val().toString();
        
        if (wif.length) {   //如果填写了wif则进行验证
            try {
                let result= this.neoUtil.wifDecode(wif);
                if (result.err) {
                    wifGroup.addClass("has-error");
                    wifGroup.children("p").text("请输入正确的WIF");
                    return 0;
                }else{
                    wifGroup.addClass("has-success");
                    wifGroup.removeClass("has-error");
                    wifGroup.children("p").text("");
                    return 1;
                }
            } catch (error) {
                return 0;
            }
        }else{
            wifGroup.removeClass("has-error has-success");
            wifGroup.addClass("has-error");
            wifGroup.children("p").text("不得为空");
            return 2;
        }
    }
    /**
     * verif
     */
    public verifpassword() {
        let p1Group:JQuery<HTMLElement> = $("#p1group");
        let p2Group:JQuery<HTMLElement> = $("#p2group");
        var p1:string = this.p1Input.val().toString();
        var p2:string = this.p2Input.val().toString();
        let neoUtil:NeoUtil = new NeoUtil();

        if(p1.length>7){
            p1Group.addClass("has-success");
            p1Group.removeClass("has-error");
            p1Group.children("p").text("");
            if(p2===p1){
                p2Group.addClass("has-success");
                p2Group.removeClass("has-error");
                p2Group.children("p").text("");
            }else{
                p2Group.addClass("has-error");
                p2Group.removeClass("has-success");
                p2Group.children("p").text("请您输入相同的登陆密码");
            }
        }else{
            p1Group.addClass("has-error");
            p1Group.removeClass("has-success");
            p1Group.children("p").text("密码不能小于8位");
        }
        
    }


}