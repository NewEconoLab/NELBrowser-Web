/**
 * @private currentPage 当前页
 * @private pageSize 每页条数
 * @private totalCount 总记录数
 * @private currentPage 当前页
 */
export class PageUtil{
    private _currentPage:number;// 当前页
    private _pageSize:number;// 每页大小
    private _totalCount:number;// 总记录数
    private _totalPage:number ;// 总页数

    /**
     * 
     * @param total 总记录数
     * @param pageSize 每页条数
     */
    constructor(total:number,pageSize:number){
        this._currentPage=1;
        this._totalCount=total;
        this._pageSize = pageSize;
        this._totalPage = total % pageSize == 0 ? total / pageSize : Math.ceil((total / pageSize)) ;
    };
    /**
     * currentPage 返回当前页码
     */
    public get currentPage(){
        return this._currentPage;
    }
    /**
     * 
     */
    public set currentPage(currentPage:number) {
        this._currentPage = currentPage;
    }
    /**
     * pageSize 每页条数
     */
    public get pageSize() {
        return this._pageSize;
    }
    /**
     * set count
     */
    public set pageSize(pageSize:number){
        this._pageSize = pageSize;
    }
    /**
     * pageSize 每页条数
     */
    public get totalCount() {
        return this._totalCount;
    }
    /**
     * set count
     */
    public set totalCount(totalCount:number){
        this._totalCount = totalCount;
    }
        /**
     * pageSize 总页数
     */
    public get totalPage() {
        this._totalPage=this._totalCount % this._pageSize == 0 ? this._totalCount / this._pageSize : Math.ceil(this._totalCount / this._pageSize);
        return this._totalPage;
    }
}

export interface Tx {
    txid:string;
    size:number;
    type:string;
    version:number;
    blockindex:number;
    gas:string;
    vin:{
        txid:string;
        vout:number;
    }[];
    vout:{
        address:string;
        asset:string;
        n:number;
        value:string;
    }[];   
}

export interface Block{
    hash:string;
    size:number;
    version:number;
    previousblockhash:string;
    merkleroot:string;
    time:number;
    index:number;
    nonce:string;
    nextconsensus:string;
    script:{
        invocation:string;
        verification:string;
    };
    tx:Tx[];
}

export interface Utxo{
    addr: string;
    txid: string;
    n: number;
    asset: string;
    value: string;
    used: string;
}

export interface Balance{
    asset: string;
    balance: number;
    name: {
        lang: string;
        name: string;
    }[];
}

export interface Addr{
    addr:string;
    firstDate:string;
    lastDate:string;
    firstuse:{
        txid:string;
        blockindex:number;
        blocktime:{$date:number;};
    };
    lastuse:{
        txid:string;
        blockindex:number;
        blocktime:{$date:number;};
    };
    txcount:number;
}

export interface Asset{
    type:string;
    name: {
        lang: string;
        name: string;
    }[];
    amount:string;
    precision:number;
    owner:string;
    admin:string;
    id:string;
}

export interface result{
    err:boolean,result:any
}

export enum AssetEnum{
    NEO='0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
    GAS='0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
}

export class TableMode{
    public tablId:string;
    public ths:Map<string,string>;
    public tds:Map<string,string>[];
    constructor(ths:Map<string,string>,tds:Map<string,string>[],tableId:string){
        this.ths = ths;
        this.tds = tds;
        this.tablId = tableId;
    }
}
