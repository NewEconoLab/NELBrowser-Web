/// <reference types="jquery" />
// import * as $ from "jquery";
import { Ajax, LocationUtil, NeoUtil, pageCut, GetNep5Info, StorageUtil } from './Util';
import { Utxo, Balance, Asset, AssetEnum, PageUtil, Addr, Block, TableMode, result, Nep5as, Detail } from './Entitys';
import { AddressInfoView,AssetsView, AddrlistView, BlocksView, WalletView } from './PageViews';

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
     * queryNep5AssetById
     */
    public async queryNep5AssetById(id:string):Promise<result>{
        let getNep5:GetNep5Info = new GetNep5Info();
        let res:result;
        try {
            res= await getNep5.getInfo(id);
            let name = res.result["name"];
            let symbol = res.result["symbol"];
        } catch (error) {
            alert("^_^ 请尝试输入正确的资产id");
            return;
        }
        try {
            let balance = await getNep5.getBalance(id,this.address);
            res.result.balance = balance.result;
            return res;
        } catch (error) {
            alert("^_^ 请尝试输入正确的地址");
            return;
        }
    }

    async initNep5Asset(){
        let stouitl:StorageUtil = new StorageUtil();
        let asids:string[] =  stouitl.getStorage("assetIds_nep5","|");
        if(asids.length==0){return}
        else{
            try {
                let ress:Array<any>=new Array<any>();
                for (let index = 0; index < asids.length; index++) {
                    let res= await this.queryNep5AssetById(asids[index]);
                    console.log(res.result["balance"]);
                    if(res.result["balance"]) ress.push(res);
                }
                if(ress.length) this.addInfo.initNep5(ress);
            } catch (error) {
                console.error("查询nep5资产出错");
            }
        }
    }

    /**
     * nep5Info
     */
    public async nep5Info() {
        let asset:string = $("#nep5-text").val().toString();
        let stouitl:StorageUtil = new StorageUtil();
        if(asset.length<1)
            alert("请输入资产id");
        try {
            let res = await this.queryNep5AssetById(asset);
            this.addInfo.loadNep5(res.result["name"],res.result["symbol"],res.result["balance"]);
            let asids:string[] =  stouitl.getStorage("assetIds_nep5","|");
            if(!asids.find(as=>as==asset)){
                asids.push(asset);
                stouitl.setStorage("assetIds_nep5",asids.join('|'));
            }
        } catch (err) {
            console.error("查询nep5资产出错");
            
        }
    }
    /**
     * 
     */
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
        this.initNep5Asset();
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
    private neoUtil:NeoUtil = new NeoUtil();
    private walletview:WalletView = new WalletView();
    private ajax:Ajax = new Ajax();

    constructor(){
        $("#import-wif").click(()=>{
            $("#importWif").modal('show');
        })  
        this.wifInput = $('#importWif').find("#wif-input").children('input');

        $("#import-nep2").click(()=>{
            $("#importNep2").modal('show');
        })
        $("#import-nep6").click(()=>{
            $("#importNep6").modal('show');
        })
        $("#send-nep2").click(()=>{
            this.nep2init();
        })
        $('#send-wif').click(()=>{
            // alert(this.wifInput.val().toString());
            let res = this.verifWif();
            if(res.err){

            }else{
                this.details(res.result["address"]).then(()=>{
                    $("#wallet-details").empty();
                    $("#importWif").modal('hide');
                })
            }
        })
        this.nep6Init();
    }
    /**
     * nep6Init
     */
    public nep6Init() {
        let file:HTMLInputElement = <HTMLInputElement>document.getElementById("nep6-select");
        var wallet: ThinNeo.nep6wallet;
        var reader = new FileReader();
        reader.onload = (e: Event) => {
            var walletstr = reader.result as string;
            wallet = new ThinNeo.nep6wallet();
            wallet.fromJsonStr(walletstr);
            var textContent = "";
            for (var i = 0; i < wallet.accounts.length; i++) {
                textContent += wallet.accounts[i].address;
                if (wallet.accounts[i].nep2key != null)
                    textContent += "(have key)";
                textContent += "\r\n";
            }
            // alert(2+":"+textContent);
        };
        file.onchange = (ev: Event) => {
            if (file.files[0].name.includes(".json")) {
                // alert("1:json");
                reader.readAsText(file.files[0]);
            }
        }
        $("#send-nep6").click(()=>{
            let password = $("#nep6-password").val().toString();
            this.neoUtil.nep6Load(wallet,password)
            .then((res:result)=>{
                console.log("成功返回："+res.result[0]);
                $('#importNep6').modal('hide');
                if(!res.err){
                    $("#wallet-details").empty();
                    res.result.forEach((result)=>{
                        this.details(result["address"]);
                    })
                }
            })
            .catch((err)=>{
                alert("失败");
                console.log("失败："+err.result);
            })
        })
    }
    /**
     * nep2init
     */
    public async nep2init() {
        let nep2:string = $("#nep2-string").val().toString();
        let password:string = $("#nep2-password").val().toString();
        try {
            let res:result = await this.neoUtil.nep2ToWif(nep2,password);
            console.log(res);
            if(!res.err){
                $("#importNep2").modal('hide');
                $("#wallet-details").empty();
                this.details(res.result["address"]);
            }
        } catch (err) {
            console.log("err:"+err);
        }
    }
    /**
     * details
     */
    public async details(address:string) {
        let height:number = 0;
        this.ajax.post('getbalance',[address])
        .then(async(balances:Balance[])=>{            
            balances.map((balance)=>{
                if(balance.asset==AssetEnum.NEO){
                    balance.name=[{lang:'en',name:'NEO'}];
                }
                if(balance.asset==AssetEnum.GAS){
                    balance.name=[{lang:'en',name:"GAS"}];
                }
            });
            
            let blockCount = await this.ajax.post('getblockcount',[]);
            let blockHeight = blockCount[0]['blockcount']-1;
            let detail:Detail = new Detail(address,blockHeight,balances);
            this.walletview.showDetails(detail);
        })
        .catch((e)=>{
            alert(e);
        });;
        
    }
    /**
     * 验证
     */
    public verifWif():result{
        var wif:string = this.wifInput.val().toString();
        let result:result;
        if (wif.length) {   //如果填写了wif则进行验证
            try {
                let result= this.neoUtil.wifDecode(wif);
                if (result.err) {
                    $("#wif-input").addClass("has-error");
                    $("#wif-input").children("p").text("请输入正确的WIF");
                    return result;
                }else{
                    $("#wif-input").addClass("has-success");
                    $("#wif-input").removeClass("has-error");
                    $("#wif-input").children("p").text("验证通过");
                    return result;
                }
            } catch (error) {
                result = {err:true,result:error.message};
                return result;
            }
        }else{
            $("#wif-input").removeClass("has-error has-success");
            $("#wif-input").addClass("has-error");
            $("#wif-input").children("p").text("不得为空");
            result = {err:true,result:"wif is null"};
            return result;
        }
    }



}