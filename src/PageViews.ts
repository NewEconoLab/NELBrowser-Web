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
            $("#utxos").empty();
            $("#address").text( this.address);
            this.balances.forEach((balance: Balance) =>
            {
                let html = '';
                let name = balance.name.map((name) => { return name.name }).join('|');

                html += '<div class="line" > <div class="title-nel" > <span>' + name + ' </span></div >';
                html += '<div class="content-nel" > <span> ' + balance.balance + ' </span></div > </div>';
                $("#balance").append(html);
            });
            this.utxo.forEach((utxo: Utxo) =>
            {
                let html = `
                <tr>
                <td class='code'>` + utxo.asset+`
                </td>
                <td>` + utxo.value+`
                </td>
                <td><a class='code' target='_blank' href='`+ Url.href_transaction( utxo.txid) + `'>` + utxo.txid +`
                </a>[` + utxo.n + `]</td>
                </tr>`
                $("#utxos").append(html);
            });
        }
        /**
         * loadNep5
         */
        public loadNep5(name: string, symbol: string, balance: number)
        {
            $("#nep5balance").empty();

            var html = '<div class="line" > <div class="title-nel" > <span>[' + symbol + '] ' + name + ' </span></div>';
            html += '<div class="content-nel" > <span>' + balance + ' </span></div> </div>';
            $("#nep5balance").append(html);
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
                var html = '<div class="line" > <div class="title-nel" > <span>[' + symbol + '] ' + name + ' </span></div >';
                html += '<div class="content-nel" > <span>' + balance + ' </span></div > </div>';
                $("#nep5assets").append(html);
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
            addrlist.forEach(item =>
            {
                let href = locationtool.getUrl() + `/address/` + item.addr;
                let html =`
                <tr>
                <td><a class="code" target="_blank" href="`+ href + `">` + item.addr + `</a></td>
                <td>` + item.firstDate + `</td>
                <td>`+ item.lastDate + `</td>
                <td>` + item.txcount + `</td></tr>`;
                $('#addrlist').append(html);
            });
        }
    }

    export class AssetsView
    {
        private assets: Asset[];
        private nep5s: Asset[];
        constructor(allAsset: Asset[], nep5s: Asset[])
        {
            this.assets = allAsset;
            this.nep5s = nep5s;
        }

        /**
         * loadView 页面展现
         */
        public loadView()
        {
            $("#assets").empty();
            $("#nep5ass").empty();
            this.assets.forEach((asset: Asset) =>
            {
                let href = './#' + locationtool.getNetWork() + '/asset/' + asset.id ;
                let html = `
                <tr>
                <td> <a href="`+ href +`">` + asset.names + `</a></td>
                <td>` + asset.type + `</td>
                <td>` + (asset.amount <= 0 ? asset.available : asset.amount) +`</td>
                <td>` + asset.precision + `</td>
                </tr>`;
                $("#assets").append(html);
            });
            this.nep5s.forEach((asset: Asset) =>
            {
                let html = `
                <tr>
                <td>` + asset.names + `</td>
                <td>`+ asset.type + `</td><td>` + asset.names + `</td>
                <td>` + (asset.amount <= 0 ? asset.available : asset.amount); + `</td>
                <td>` + asset.names + `</td></tr>`;
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
            let lis = '';
            for (let n = 0; n < detail.balances.length; n++)
            {
                const balance = detail.balances[n];
                let name = balance.name.map((name) => { return name.name }).join('|');
                lis += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
            }
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
            html += lis;
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
                let html = `
                <tr>
                <td class='code'>` + utxo.name+`
                </td>
                <td>` + utxo.value+`
                </td>
                <td><a class='code' target='_blank' rel='external nofollow' href='`+ Url.href_transaction( utxo.txid )+`'>` + utxo.txid+`
                </a>[" + utxo.n + "]</td>"
                </tr>`
                $("#wallet-utxos").append(html);
            });
        }
    }
}