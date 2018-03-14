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
        walleta: HTMLAnchorElement = document.getElementById("walleta") as HTMLAnchorElement;

        start(network: string)
        {
            this.indexa.href = "./#" + network;
            this.blocka.href = "./#" + network + "/blocks";
            this.txlista.href = "./#" + network + "/transactions";
            this.addrsa.href = "./#" + network + "/addresses";
            this.asseta.href = "./#" + network + "/assets";
            
        }

        skip(page: string)
        {
            var href: string[] = window.location.href.split("#");
            var arr = href[1].split("/");
            var net = "#" + arr[0];
            var url = href[0] + net + page;
            window.location.href = url;
        }
        
    }
}