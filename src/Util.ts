///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
import { PageUtil, TableMode, result } from './Entitys';
export class Ajax{
    constructor(){}
    /**
     * async post
     */
    public async post(method:string,params:any[]):Promise<any> {
        let promise = new Promise<any>((resolve,reject)=>{
            $.ajax({
                type: 'POST',
                url: 'http://47.96.168.8:81/api/testnet',
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


