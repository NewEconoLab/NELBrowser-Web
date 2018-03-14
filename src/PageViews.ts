// import * as $ from "jquery";
namespace WebBrowser
{
    export class AddressInfoView
    {
        public balances: Balance[];
        public utxo: Utxo[];
        public address: string;
        constructor(balances: Balance[], utxo: Utxo[], address: string)
        {
            this.balances = balances;
            this.address = address;
            this.utxo = utxo;
        }
        /**
         * loadView
         */
        public loadView()
        {
            $("#balance").empty();
            $("#utxos").empty();
            $("#address").text('address | ' + this.address);
            // console.log(this.balances);
            this.balances.forEach((balance: Balance) =>
            {
                let html = '';
                let name = balance.name.map((name) => { return name.name }).join('|');
                html += '<div class="col-md-6">';
                html += '<div class="panel panel-default" style="height:100%">';
                html += '<div class="panel-heading">';
                html += '<h3 class="panel-title">' + name + '</h3>';
                html += '</div>';
                html += '<div id="size" class="panel-body">';
                html += balance.balance;
                html += '</div></div></div>';
                $("#balance").append(html);
            });
            this.utxo.forEach((utxo: Utxo) =>
            {
                let html = '';
                html += "<tr>"
                html += "<td class='code'>" + utxo.asset;
                html += "</td>"
                html += "<td>" + utxo.value;
                html += "</td>"
                html += "<td><a class='code' target='_blank' rel='external nofollow' href='./#" + locationtool.getNetWork()+"/transaction/" + utxo.txid + "'>" + utxo.txid
                html += "</a>[" + utxo.n + "]</td>"
                html += "</tr>"
                $("#utxos").append(html);
            });
        }
        /**
         * loadNep5
         */
        public loadNep5(name: string, symbol: string, balance: number)
        {
            $("#nep5balance").empty();
            $("#nep5balance").append('<li class="list-group-item">[' + symbol + '] ' + name + ': ' + balance + '</li>');
        }
        /**
         * initNep5
         */
        public initNep5(arr: Array<result>)
        {
            $("#nep5AssetList").empty();
            $("#nep5assets").show();
            arr.forEach(element =>
            {
                let symbol: string = element.result["symbol"];
                let name: string = element.result["name"];
                let balance: number = element.result["balance"];
                $("#nep5AssetList").append('<li class="list-group-item">[' + symbol + '] ' + name + ': ' + balance + '</li>');
            });
        }
    }

    export class AddrlistView
    {
        constructor() { }

        /**
         * loadView
         */
        public loadView(addrlist: Addr[])
        {
            $("#addrlist").empty();
            let html = '';
            addrlist.forEach(item =>
            {
                html += '<tr>';
                html += '<td><a class="code" target="_blank" rel="external nofollow" '
                html += 'href="./#' + locationtool.getNetWork() + "/address/" + item.addr + '">' + item.addr + '</a></td>';
                html += '<td>' + item.firstDate + '</td>';
                html += '<td>' + item.lastDate + '</td>';
                html += '<td>' + item.txcount + '</td>';
                html += '</tr>';
            });
            $('#addrlist').append(html);
        }
    }

    export class AssetsView
    {
        private assets: Asset[];
        private nep5s: Asset[];
        constructor(allAsset: Asset[], nep5s: Asset[])
        {
            this.assets = allAsset;
            console.log(nep5s);
            this.nep5s = nep5s;
        }

        /**
         * loadView 页面展现
         */
        public loadView()
        {
            $("#assets").empty();
            $("#nep5ass").empty();
            console.log("assets:" + JSON.stringify(this.assets));
            console.log("nep5s:" + JSON.stringify(this.nep5s));
            this.assets.forEach((asset: Asset) =>
            {
                let html = '';
                html += '<tr>';
                html += '<td>' + asset.names + '</td>';
                html += '<td>' + asset.type + '</td>';
                html += '<td>' + (asset.amount <= 0 ? asset.available : asset.amount); + '</td>';
                html += '<td>' + asset.precision + '</td>';
                html += '</tr>';
                $("#assets").append(html);
            });
            this.nep5s.forEach((asset: Asset) =>
            {
                let html = '';
                html += '<tr>';
                html += '<td>' + asset.names + '</td>';
                html += '<td>' + asset.type + '</td>';
                html += '<td>' + asset.names + '</td>';
                html += '<td>' + (asset.amount <= 0 ? asset.available : asset.amount); + '</td>';
                html += '<td>' + asset.names + '</td>';
                html += '</tr>';
                $("#nep5ass").append(html);
            });
        }
    }

    export class BlocksView
    {
        private previous: HTMLLIElement;
        private next: HTMLLIElement;
        private text: HTMLAnchorElement;
        private tbview: TableView;
        constructor(tbmode: TableMode, next: HTMLLIElement, previous: HTMLLIElement, text: HTMLAnchorElement)
        {
            this.next = next;
            this.previous = previous;
            this.text = text;
            this.tbview = new TableView("blocks-page", tbmode);
            this.tbview.className = "table cool table-hover";
            this.tbview.update();
        }
        /**
         * loadView()
         */
        public loadView(pageUtil: PageUtil)
        {
            this.text.text = "总记录数:" + pageUtil.totalCount + " 总页数:" + pageUtil.totalPage + " 当前页:" + pageUtil.currentPage;
            if (pageUtil.totalPage - pageUtil.currentPage)
            {
                this.next.classList.remove('disabled');
            } else
            {
                this.next.classList.add('disabled');
            }
            if (pageUtil.currentPage - 1)
            {
                this.previous.classList.remove('disabled');
            } else
            {
                this.previous.classList.add('disabled');
            }
            this.tbview.update();
        }
    }

    export class WalletView
    {
        constructor() { }
        /**
         * showDetails
         */
        public showDetails(detail: Detail)
        {
            $("#wallet-details").empty();
            let html: string = "";
            let ul = '';
            for (let n = 0; n < detail.balances.length; n++)
            {
                const balance = detail.balances[n];
                let name = balance.name.map((name) => { return name.name }).join('|');
                ul += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
            }
            detail.balances.forEach((balance: Balance) =>
            {
            });
            html += '<div class="row"><div class=" col-lg-6">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title code" >' + detail.address + '</h3>';
            html += '</div>';
            html += '<div class=" panel-body" >api:' + detail.height + ' </div>';
            html += '</div>';
            html += '</div>';
            html += '<div class=" col-lg-6">';
            html += '<div class="panel panel-default" style="height:100%">';
            html += '<div class="panel-heading">';
            html += '<h3 class="panel-title code" >Balance</h3>';
            html += '</div>';
            html += '<ul id="balance-wallet" class="list-group" >';
            html += ul;
            html += '</ul>';
            html += '</div></div>';
            $("#wallet-details").append(html);
        }

        /**
         * showSelectAddrs
         */
        public showSelectAddrs(addrs: string[])
        {
            $("#selectAddress").empty();
            addrs.forEach((addr) =>
            {
                $("#selectAddress").append('<label><input type="radio" name="addrRadio" id="addrRadio1" value="' + addr + '" aria-label="...">' + addr + '</label>');
            })

            $("#selectAddr").modal("show");
        }

        /**
         * showUtxo
         */
        public showUtxo(utxos: Utxo[])
        {
            $("#wallet-utxos").empty();
            utxos.forEach((utxo) =>
            {
                let html = '';
                html += "<tr>"
                html += "<td class='code'>" + utxo.name;
                html += "</td>"
                html += "<td>" + utxo.value;
                html += "</td>"
                html += "<td><a class='code' target='_blank' rel='external nofollow' href='./#" + locationtool.getNetWork() +"/transaction/"+ utxo.txid + "'>" + utxo.txid
                html += "</a>[" + utxo.n + "]</td>"
                html += "</tr>"
                $("#wallet-utxos").append(html);
            });
        }
    }
}