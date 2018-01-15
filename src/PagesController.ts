import * as $ from "jquery";
import { Ajax as Ajax, LocationUtil as LocationUtil} from './Util';

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
            // window.location.href='./blockInfo.html?index='+$("#searchText").val();
            // window.location.href='./txInfo.html?txid='+$("#searchText").val();
        });
    }
}