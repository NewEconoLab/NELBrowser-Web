/**
 * @private currentPage 当前页
 * @private pageSize 每页条数
 * @private totalCount 总记录数
 * @private currentPage 当前页
 */
namespace WebBrowser
{
    export class PageUtil
    {
        private _currentPage: number;// 当前页
        private _pageSize: number;// 每页大小
        private _totalCount: number;// 总记录数
        private _totalPage: number;// 总页数

        /**
         * 
         * @param total 总记录数
         * @param pageSize 每页条数
         */
        constructor(total: number, pageSize: number)
        {
            this._currentPage = 1;
            this._totalCount = total;
            this._pageSize = pageSize;
            this._totalPage = total % pageSize == 0 ? total / pageSize : Math.ceil((total / pageSize));
        };
        /**
         * currentPage 返回当前页码
         */
        public get currentPage()
        {
            this._totalPage = this.totalCount % this.pageSize == 0 ? this.totalCount / this.pageSize : Math.ceil((this.totalCount / this.pageSize));
            return this._currentPage;
        }
        /**
         * 
         */
        public set currentPage(currentPage: number)
        {
            this._currentPage = currentPage;
        }
        /**
         * pageSize 每页条数
         */
        public get pageSize()
        {
            return this._pageSize;
        }
        /**
         * set count
         */
        public set pageSize(pageSize: number)
        {
            this._pageSize = pageSize;
        }
        /**
         * pageSize 每页条数
         */
        public get totalCount()
        {
            return this._totalCount;
        }
        /**
         * set count
         */
        public set totalCount(totalCount: number)
        {
            this._totalCount = totalCount;
        }
        /**
     * pageSize 总页数
     */
        public get totalPage()
        {
            this._totalPage = this._totalCount % this._pageSize == 0 ? this._totalCount / this._pageSize : Math.ceil(this._totalCount / this._pageSize);
            return this._totalPage;
        }
    }

    export interface Tx
    {
        txid: string;
        size: number;
        type: string;
        version: number;
        blockindex: number;
        gas: string;
        vin: {
            txid: string;
            vout: number;
        }[];
        vout: {
            address: string;
            asset: string;
            n: number;
            value: string;
        }[];
    }

    export class Url
    {
        static href_blocks()
        {
            return locationtool.getUrl() + '/blocks';
        }
        static href_transactions()
        {
            return locationtool.getUrl() + '/transactions';
        }
        static href_addresses()
        {
            return locationtool.getUrl() +  '/addresses'
        }
        static href_assets()
        {
            return locationtool.getUrl() +  '/assets'
        }
        static href_nnsevent() {
            return locationtool.getUrl() + '/nnsevent'
        }
        static href_block( block: number )
        {
            return locationtool.getUrl() +  "/block/" + block;
        }
        static href_transaction( tx: string )
        {
            return locationtool.getUrl() +  "/transaction/" + tx;
        }
        static href_address( addr: string )
        {
            return locationtool.getUrl() +  "/address/" + addr;
        }
        static href_asset(asset)
        {
            return locationtool.getUrl() + '/asset/'+asset
        }
        static href_nep5(nep5) {
            return locationtool.getUrl() + '/nep5/' + nep5
        }
        static href_nnsbeing() {
            return locationtool.getUrl() + '/nnsauction/'
        }
        static href_nnsrank() {
            return locationtool.getUrl() + '/nnsrank/'
        }
        static href_nns(domain) {
            return locationtool.getUrl() + '/nns/' + domain
        }
    }

    export interface Page
    {
        div: HTMLDivElement;
        footer: HTMLDivElement;
        start(): void;
        close(): void;
    }

    export interface Block
    {
        hash: string;
        size: number;
        version: number;
        previousblockhash: string;
        merkleroot: string;
        time: number;
        index: number;
        nonce: string;
        nextconsensus: string;
        script: {
            invocation: string;
            verification: string;
        };
        tx: Tx[];
    }

    export interface Utxo
    {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        value: string;
        used: string;
        name: string;
    }

    export interface Balance
    {
        asset: string;
        balance: number;
        name: {
            lang: string;
            name: string;
        }[];
    }
    export interface AddressMsg {
        addr: string;
        firstuse: {
            txid: string;
            blockindex: number;
            blocktime: {
                $date: number;
            }
        };
        lastuse: {
            txid: string;
            blockindex: number;
            blocktime: {
                $date: number;
            }
        };
        txcount: number;
    }

    export interface TransOfAddress {
        addr: string,
        txid: string,
        blockindex: number,
        blocktime: {
            $date: number
        },
        type: string,
        vout: [
            {
                n: number,
                asset: string,
                value: number,
                address: string
            }
        ],
        vin: [
            {
                n: number,
                asset: string,
                value: number,
                address: string
            }
        ]
    }

    export interface Nep5OfAddress {
        assetid: string;
        balance: number;
        symbol: string;
    }

    export interface Addr
    {
        addr: string;
        firstDate: string;
        lastDate: string;
        firstuse: {
            txid: string;
            blockindex: number;
            blocktime: { $date: number; };
        };
        lastuse: {
            txid: string;
            blockindex: number;
            blocktime: { $date: number; };
        };
        txcount: number;
    }

    export interface Asset
    {
        type: string;
        name: {
            lang: string;
            name: string;
        }[];
        names: string;      //name
        amount: number;
        precision: number;  //decimals
        available: number;  //totalsupply
        owner: string;
        admin: string;
        id: string;     //assetid
    }


    export class Nep5as implements Asset
    {
        type: string;
        name: { lang: string; name: string; }[];
        names: string;
        amount: number;
        precision: number;
        available: number;
        owner: string;
        admin: string;
        id: string;
    }

    export interface nep5Asset
    {
        assetid: string;
        totalsupply: string;
        name: string;
        symbol: string;
        decimals: string;
    }

    export interface TransOfAsset
    {
        asset: string;
        blockindex: number;
        from: string;
        n: number;
        to: string;
        txid: string;
        value: number;
    }

    export interface DomainBided
    {
        count: number;
        list: {
            fulldomain: string;            
            maxPrice: string;
            maxBuyer: string;
            lastTime: {
                txid: string;
            }
            range: number;
            ttl: string;
        }[];
    }
    export interface DomainBiding {
        count: number;
        list: {
            fulldomain: string;
            auctionState: string;
            lastTime: {
                txid: string;
            }
            maxBuyer: string;
            maxPrice: string;
            
        }[];
    }
    export interface DomainInfo {
        auctionId: string,
        fulldomain: string,
        auctionState: string,
        startTime: {
            blockindex: number,
            blocktime: number,
        }
        maxPrice: string,
        maxBuyer: string,
        endTime: {
            blocktime:number
        }
        ttl: number;
    }
    export interface DomainPriceRank {
        count: number;
        list: {
            address: string;
            range: number;            
            totalValue: string;
        }[];        
    }
    export interface DomainInfoHistory {
        count: number;
        list: {
            address: string;
            amount: string;
            time: number;
            txid: string;
            type: string;
        }[];
    }

    export interface result
    {
        err: boolean, result: any
    }

    export enum AssetEnum
    {
        NEO = '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        GAS = '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    }

    export class Detail
    {
        public address: string;
        public height: number;
        public balances: Balance[];
        constructor(address: string, height: number, balances: Balance[])
        {
            this.address = address;
            this.height = height;
            this.balances = balances;
        }
    }

    export let network: string = "mainnet";

    

}