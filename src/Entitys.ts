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
