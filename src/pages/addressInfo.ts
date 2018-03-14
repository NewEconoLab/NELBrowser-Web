namespace WebBrowser
{
    export class Address
    {
        div: HTMLDivElement;
        start()
        {
            this.div = document.getElementById("address-info") as HTMLDivElement;
            this.div.hidden = true;
            this.div.innerHTML = pages.addres;
        }
    }
}