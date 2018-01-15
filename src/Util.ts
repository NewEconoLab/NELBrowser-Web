import * as $ from "jquery";
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
                dataType: 'json',
                data: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": method,
                    "params": params,
                    "id": 1
                  }),
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
