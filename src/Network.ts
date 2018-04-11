namespace WebBrowser {

    export class NetWork {
        title = document.getElementById("network") as HTMLSpanElement;
        testbtn = document.getElementById("testnet-btn") as HTMLLIElement;
        testa = document.getElementById("testa") as HTMLAnchorElement;
        mainbtn = document.getElementById("mainnet-btn") as HTMLLIElement;
        maina = document.getElementById("maina") as HTMLAnchorElement;
        css = document.getElementById("netCss") as HTMLLinkElement;

        start()
        {
            this.testa.onclick = () =>
            {
                var href: string[] = window.location.href.split("#");
                var net: string = href[1].replace("mainnet", "");
                net = net.replace("testnet", "");
                net = "#testnet" + net;
                window.location.href = href[0] + net;
            }
            this.maina.onclick = () =>
            {
                var href: string[] = window.location.href.split("#");
                var net: string = href[1].replace("mainnet", "");
                net = net.replace("testnet", "");
                net = "#mainnet" + net;
                window.location.href = href[0] + net;
            }
        }

        changeNetWork(net: string) {
            if (net == "testnet") {
                this.title.innerText = "TestNet";
                this.testbtn.classList.add("active");
                this.mainbtn.classList.remove("active");
                this.css.href = "./css/testnet.css";
            }
            if (net == "mainnet") {
                this.title.innerText = "MainNet";
                this.mainbtn.classList.add("active");
                this.testbtn.classList.remove("active");
                this.css.href = "./css/mainnet.css";
            }
        }
    }
}