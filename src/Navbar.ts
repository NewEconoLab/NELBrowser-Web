/// <reference path="./tools/neotool.ts" />
namespace WebBrowser
{
    export class Navbar
    {
        indexBtn: HTMLLIElement = document.getElementById("index-btn") as HTMLLIElement;
        indexa: HTMLAnchorElement = document.getElementById("indexa") as HTMLAnchorElement;
        browBtn: HTMLLIElement = document.getElementById("brow-btn") as HTMLLIElement;
        blockBtn: HTMLLIElement = document.getElementById("blocks-btn") as HTMLLIElement;
        blocka: HTMLAnchorElement = document.getElementById("blocksa") as HTMLAnchorElement;
        txlistBtn: HTMLLIElement = document.getElementById("txlist-btn") as HTMLLIElement;
        txlista: HTMLAnchorElement = document.getElementById("txlista") as HTMLAnchorElement;
        addrsBtn: HTMLLIElement = document.getElementById("addrs-btn") as HTMLLIElement;
        addrsa: HTMLAnchorElement = document.getElementById("addrsa") as HTMLAnchorElement;
        assetBtn: HTMLLIElement = document.getElementById("asset-btn") as HTMLLIElement;
        asseta: HTMLAnchorElement = document.getElementById("assetsa") as HTMLAnchorElement;
        walletBtn: HTMLLIElement = document.getElementById("wallet-btn") as HTMLLIElement;
        walleta: HTMLAnchorElement = document.getElementById( "walleta" ) as HTMLAnchorElement;
        searchBtn: HTMLButtonElement = document.getElementById( "searchBtn" ) as HTMLButtonElement;
        searchText: HTMLInputElement = document.getElementById( "searchText" ) as HTMLInputElement;


        start()
        {
            this.indexa.onclick = () =>
            {
                this.skip("");
            }
            this.blocka.onclick = () =>
            {
                this.skip("/blocks");                
            }
            this.txlista.onclick = () =>
            {
                this.skip("/transactions");  
            }
            this.addrsa.onclick = () =>
            {
                this.skip("/addresses");  
            }
            this.asseta.onclick = () =>
            {
                this.skip("/assets");  
            }
            this.searchBtn.onclick = () =>
            {
                this.jump();
            }
            this.searchText.onkeydown = (e) => {
                if (e.keyCode == 13) {
                    this.jump();
                }
            }
            this.walletBtn.onclick = () =>
            {
                if ( locationtool.getNetWork() == 'testnet' )
                    window.open( "https://testwallet.nel.group/" );
                else
                    window.open( "https://wallet.nel.group/" );
            }
        }

        skip(page: string)
        {
            window.location.href =locationtool.getUrl() + page;
        }
        jump()
        {
            let search: string = this.searchText.value;
            if ( search.length == 34 )
            {
                if ( Neotool.verifyPublicKey( search ) )
                {
                    window.open( locationtool.getUrl() + '/address/' + search );
                } else
                {
                    $("#errContent").text('请输入正确的地址');
                    $('#errMsg').modal('show');
                }
            }
            search = search.replace( '0x', '' );
            if (search.length == 64) {
                window.open(locationtool.getUrl() + '/transaction/' + search);
            } else if (!isNaN(Number(search)))
            {
                window.open(locationtool.getUrl() + '/block/' + search);
            } else
            {
                $("#errContent").text('输入有误，请重新输入');
                $('#errMsg').modal('show');
                return false;
            }
        }

        
    }
}