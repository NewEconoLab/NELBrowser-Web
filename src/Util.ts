///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
import { PageUtil, TableMode, result } from './Entitys';
export class Ajax{
    private _network:string;
    /**
     * get network
     */
    public get network() {
        return this._network;
    }
    /**
     * set network
     */
    public set network(nextwork:string) {
        this._network = nextwork;
    }
    constructor(){
        this._network="testnet";
    }
    /**
     * async post
     */
    public async post(method:string,params:any[]):Promise<any> {
        let promise = new Promise<any>((resolve,reject)=>{
            $.ajax({
                type: 'POST',
                url: 'http://47.96.168.8:81/api/'+this._network,
                data: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": method,
                    "params": params,
                    "id": 1
                  }),
                contentType: "application/json; charset=utf-8", 
                dataType: "json", 
                success: (data:Object,status)=>{
                    if('result' in data){          
                        // console.log(data['result']);              
                        resolve(data['result']);
                    }else if('error' in data){
                        if(data['error']['code']==-1){
                            resolve([]);
                        }else{
                            resolve([]);
                            reject("参数出错 code:-100");
                        }
                        
                    }
                },
                error:()=>{
                    reject("请求失败");
                }
                
            });
        });
        return promise;
    }

    /**
     * async post
     */
    public async get():Promise<any> {
        let promise = new Promise<any>((resolve,reject)=>{
            $.ajax({
                type: 'GET',
                url: 'https://47.96.168.8:4431/api/testnet?jsonrpc=2.0&method=getblock&params=%5b1000%5d&id=1001',
            
                success: (data,status)=>{
                    resolve(data['result']);
                },
                error:()=>{
                    reject("请求失败");
                }
                
            });
        });
        return promise;
    }
}

export class LocationUtil {
    public LocString = String(location.href);
    constructor(){}
    GetQueryString(name:string):string {
        let rs = new RegExp("(^|)" + name + "=([^&]*)(&|$)", "gi").exec(this.LocString), tmp;
        if (tmp = rs) {
            return decodeURI(tmp[2]);
        }
        // parameter cannot be found
        return "";
    }

    getRootPath_web() {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        console.log(curWwwPath);
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        console.log(pathName);
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        console.log(pos);
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        console.log(localhostPaht);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        console.log(projectName);
        return (localhostPaht + projectName);
    }
    getRootPath() {
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        if (webName == "") {
            return window.location.protocol + '//' + window.location.host;
        }
        else {
            return window.location.protocol + '//' + window.location.host + '/' + webName;
        }
    }
}

export class NeoUtil{
    constructor(){}
    /**
     * verifyPublicKey 验证公钥
     * @param publicKey 公钥
     */
    public verifyPublicKey(publicKey:string){
        
        var array: Uint8Array = Neo.Cryptography.Base58.decode(publicKey);
        //var hexstr = array.toHexString();
        //var salt = array.subarray(0, 1);
        //var hash = array.subarray(1, 1 + 20);
        var check = array.subarray(21, 21 + 4); //

        var checkdata = array.subarray(0, 21);//
        var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);//
        hashd = Neo.Cryptography.Sha256.computeHash(hashd);//
        var hashd = hashd.slice(0, 4);//
        var checked = new Uint8Array(hashd);//

        var error = false;
        for (var i = 0; i < 4; i++) {
            if (checked[i] != check[i]) {
                error = true;
                break;
            }
        }
        return !error;
    }
    /**
     * wifDecode wif解码
     * @param wif wif私钥
     */
    public wifDecode(wif:string) {
        let result:result={err:false,result:{pubkey:"",prikey:"",address:""}};
        
        var prikey: Uint8Array;
        var pubkey: Uint8Array;
        var address: string;
        try {
            prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            var hexstr = prikey.toHexString();
            result.result.prikey=hexstr;
        }
        catch (e) { 
            result.err=true;
            result.result=e.message;
            return result
        }
        try {
            pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
            var hexstr = pubkey.toHexString();
            result.result.pubkey=hexstr;
        }
        catch (e) {
            result.err=true;
            result.result=e.message;
            return result
        }
        try {
            address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            result.result.address=address;
        }
        catch (e) {
            result.err=true;
            result.result=e.message;
            return result
        }
        return result;
    }
    /**
     * nep2FromWif
     */
    public nep2FromWif(wif:string,password:string):result {
        var prikey: Uint8Array;
        var pubkey: Uint8Array;
        var address: string;
        let res:result={err:false,result:{address:"",nep2:""}};
        try {
            prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            var n = 16384;
            var r = 8;
            var p = 8
            ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) => {
                res.err=false;
                res.result.nep2 = result;
                pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                var hexstr = pubkey.toHexString();
                address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                res.result.address = address
                return res;
            });
        }
        catch (e) {
            res.err=true;
            res.result= e.message;
            return res;
        }
    }

    /**
     * nep2TOWif
     */
    public async nep2ToWif(nep2:string,password:string):Promise<result> {
        var prikey: Uint8Array;
        var pubkey: Uint8Array;
        var address: string;
        let promise:Promise<result> = new Promise((resolve,reject)=>{
            let n:number = 16384;
            var r:number = 8;
            var p:number = 8
            ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, n, r, p, (info, result) => {
                //spanNep2.textContent = "info=" + info + " result=" + result;
                console.log("result=" + "info=" + info + " result=" + result);
                prikey = result as Uint8Array;
                if (prikey != null) {
                    var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    var wif = ThinNeo.Helper.GetWifFromPrivateKey(prikey);
                    console.log('1:'+address);
                    resolve({err:false,result:{pubkey,address,prikey}});
                }
                else {
                    // spanWif.textContent = "result=" + "info=" + info + " result=" + result;
                    reject({err:false,result:result});
                }
            });
        }); 
        return promise;
    }

    /**
     * nep6Load
     */
    public async nep6Load(wallet: ThinNeo.nep6wallet,password:string) {
        // let promise:Promise<result> = new Promise((resolve,reject)=>{
            try {
                //getPrivateKey 是异步方法，且同时只能执行一个
                var istart = 0;
                let res:any[] = new Array<any>();
                var getkey: (n: number) => void = null;
                // getkey = async (keyindex: number) => {
                for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                    let account = wallet.accounts[keyindex];
                    try {
                        let result:result = await this.getPriKeyfromAccount(wallet.scrypt,password,account);
                        res.push(result.result);
                    } catch (error) {
                        console.error(error);
                        return {err:true,result:error}
                    }
                }
                return {err:false,result:res}
            }
            catch (e) {
            }
        // });
        // return promise;
    }

    /**
     * getPriKeyform
     */
    public async getPriKeyfromAccount(scrypt: ThinNeo.nep6ScryptParameters,password:string,account:ThinNeo.nep6account):Promise<result> {
        let promise:Promise<result> = 
        new Promise((resolve,reject)=>{
            account.getPrivateKey(scrypt, password, (info, result) => {
                if (info == "finish") {
                    var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result as Uint8Array);
                    var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    var wif = ThinNeo.Helper.GetWifFromPrivateKey(result as Uint8Array);
                    var hexkey = (result as Uint8Array).toHexString();
                    console.log(info + "|" + address + " wif="+wif );
                    resolve({err:false,result:{pubkey:pubkey,address:address,prikey:result as Uint8Array}});
                }
                else {
                    // info2.textContent += info + "|" + result;
                    reject({err:true,result:result});
                }

            });
        })
        return promise;
    }
    
}

export function pageCut(pageUtil:PageUtil){        
    if(pageUtil.totalPage-pageUtil.currentPage){
        $("#next").removeClass('disabled');
    }else{
        $("#next").addClass('disabled');
    }
    if(pageUtil.currentPage-1){
        $("#previous").removeClass('disabled');
    }else{
        $("#previous").addClass('disabled');
    }
}

export class TableView{
    private _tableMode:TableMode;
    private divId:string;
    constructor(divId:string,tableMode:TableMode){
        this._tableMode = tableMode;
        this.divId = divId;
        let html = "<table id='"+tableMode.tablId+"'>"
        +"<thead><head></head></thead><tbody></tbody></table>";
        $("#"+this.divId).append(html);
    }
    update(){
        this._tableMode.ths.forEach((th)=>{
            $("#blocklist").children('thead').append('<th>'+th+'</th>');
        });
        let tbody = $("#blocklist").children('tbody');
        let tr:string ='';
        this._tableMode.tds.forEach((tdMap)=>{
            let td="";
            this._tableMode.ths.forEach((val,key)=>{
                td += "<td>"+tdMap.get(key)+"</td>";
            });
            tr += "<tr>"+td+"</tr>"; 
        });
        tbody.empty();
        tbody.append(tr);
    }
    set className(className:string){
        $("#"+this._tableMode.tablId).addClass(className);

    }
    set tableMode(tableMode:TableMode){
        this._tableMode = tableMode;
    }
}

export class walletStorage{
    public wallets = localStorage.getItem("Nel_wallets");
    
    /**
     * setWallet
     */
    public setWallet(address,nep2) {
        let json = {address,nep2};  
        let wallets:any[] = JSON.parse(this.wallets);
    }
}


export class GetNep5Info{
    
    constructor() {
    }
    //http://47.96.168.8:20332/?jsonrpc=2.0&id=1&method=invokescript&params=[%2200c1046e616d6567056bd94ecab6fe9607014624ef66bbc991dbcc3f%22]

    makeRpcUrl(url: string, method: string, ..._params: any[]) {
        if (url[url.length - 1] != '/')
            url = url + "/";
        var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
        for (var i = 0; i < _params.length; i++) {
            urlout += JSON.stringify(_params[i]);
            if (i != _params.length - 1)
                urlout += ",";
        }
        urlout += "]";
        return urlout;
    }
    nep5decimals: number = 0;
    async getInfo(sid:string):Promise<result>{
        let res:result = {err:false,result:{name:"",symbol:"",decimals:0,totalsupply:0}};
        try {
            //拼接三次调用
            var sb = new ThinNeo.ScriptBuilder();

            sb.EmitParamJson(JSON.parse("[]"));//参数倒序入
            sb.EmitParamJson("(str)name");//参数倒序入
            var shash = sid.hexToBytes();
            sb.EmitAppCall(shash.reverse());//nep5脚本

            sb.EmitParamJson(JSON.parse("[]"));
            sb.EmitParamJson("(str)symbol");
            var shash = sid.hexToBytes();
            sb.EmitAppCall(shash.reverse());

            sb.EmitParamJson(JSON.parse("[]"));
            sb.EmitParamJson("(str)decimals");
            var shash = sid.hexToBytes();
            sb.EmitAppCall(shash.reverse());
            
            sb.EmitParamJson(JSON.parse("[]"));
            sb.EmitParamJson("(str)totalSupply");
            var shash = sid.hexToBytes();
            sb.EmitAppCall(shash.reverse());

            var data = sb.ToArray();

            var url = this.makeRpcUrl("http://47.96.168.8:20332", "invokescript", data.toHexString());
            let response = await fetch(url, { "method": "get" });
            let json = await response.json();
            
            // info1.textContent = JSON.stringify(r);
            try {
                var state = json.result.state as string;
                // info2.textContent = "";
                if (state.includes("HALT")) {
                    // info2.textContent += "Succ\n";
                    res.err= false;
                }
                var stack = json.result.stack as any[];
                //find name 他的type 有可能是string 或者ByteArray
                if (stack[0].type == "String"){
                    // info2.textContent += "name=" + stack[0].value + "\n";
                    res.result.name = stack[0].value;
                }
                else if (stack[0].type == "ByteArray") {
                    var bs = (stack[0].value as string).hexToBytes();
                    var str = ThinNeo.Helper.Bytes2String(bs);
                    // info2.textContent += "name=" + str + "\n";
                    res.result.name = str
                }
                //find symbol 他的type 有可能是string 或者ByteArray
                if (stack[1].type == "String"){
                    // info2.textContent += "symbol=" + stack[1].value + "\n";
                    res.result.symbol = stack[1].value;
                }
                else if (stack[1].type == "ByteArray") {
                    var bs = (stack[1].value as string).hexToBytes();
                    var str = ThinNeo.Helper.Bytes2String(bs);
                    // info2.textContent += "symbol=" + str + "\n";
                    res.result.symbol = str;
                }

                //find decimals 他的type 有可能是 Integer 或者ByteArray
                if (stack[2].type == "Integer") {
                    this.nep5decimals = (new Neo.BigInteger(stack[2].value as string)).toInt32();
                }
                else if (stack[2].type == "ByteArray") {
                    var bs = (stack[2].value as string).hexToBytes();
                    var num = new Neo.BigInteger(bs);
                    this.nep5decimals = num.toInt32();
                }
                //find decimals 他的type 有可能是 Integer 或者ByteArray
                if (stack[3].type == "Integer") {
                    var totalsupply = (new Neo.BigInteger(stack[3].value as string)).toInt32();
                }
                else if (stack[3].type == "ByteArray") {
                    var bs = (stack[3].value as string).hexToBytes();
                    var num = new Neo.BigInteger(bs);
                    totalsupply = num.toInt32();
                }
                // info2.textContent += "decimals=" + this.nep5decimals + "\n";
                res.result.totalsupply = totalsupply;
                res.result.decimals = this.nep5decimals;
                return res;
            }
            catch (e) {
                return e.message;
            }
        }
        catch (e) {
            return e.message;
        }

    }
    async getBalance(sid:string,addr:string):Promise<result>{
        let res:result = {err:false,result:0};
        var sb = new ThinNeo.ScriptBuilder();
        sb.EmitParamJson(["(addr)" + addr]);//参数倒序入
        sb.EmitParamJson("(str)balanceOf");//参数倒序入 //name//totalSupply//symbol//decimals
        var shash = sid.hexToBytes();
        sb.EmitAppCall(shash.reverse());//nep5脚本

        var data = sb.ToArray();
        // info1.textContent = data.toHexString();        
        try {
            var url = this.makeRpcUrl("http://47.96.168.8:20332", "invokescript", data.toHexString());
            let response = await fetch(url, { "method": "get" })
            let json = await response.json();
            var state = json.result.state as string;
            // info2.textContent = "";
            if (state.includes("HALT")) {
                // info2.textContent += "Succ\n";
            }
            var stack = json.result.stack as any[];

            var bnum = new Neo.BigInteger(0);
            //find decimals 他的type 有可能是 Integer 或者ByteArray
            if (stack[0].type == "Integer") {

                bnum = new Neo.BigInteger(stack[0].value);
            }
            else if (stack[0].type == "ByteArray") {
                var bs = (stack[0].value as string).hexToBytes();
                bnum = new Neo.BigInteger(bs);
            }
            var v = 1;
            for (var i = 0; i < this.nep5decimals; i++) {
                v *= 10;
            }
            var intv = bnum.divide(v).toInt32();
            var smallv = bnum.mod(v).toInt32() / v;
            // info2.textContent += "count=" + (intv + smallv);
            res.result=intv+smallv;
            return res;
        }
        catch (e) {
            return {err:true,result:"^_^ 请尝试输入正确的地址"};
        }
    }
}

export class StorageUtil{
    /**
     * setStorage
     */
    public setStorage(name:string,str:string) {
        localStorage.setItem(name,str);
    }
    /**
     * getStorage
     */
    public getStorage(name:string,decoder:string):any {
        let res = localStorage.getItem(name)
        if(!res){
            localStorage.setItem(name,"");
        }
        if(decoder){
            if(!res){
                return [];
            }
            let item = localStorage.getItem(name).split(decoder);
            return item;
        }else{
            let item = JSON.parse(localStorage.getItem(name));
            return item;
        }
    }
}

