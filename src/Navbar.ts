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