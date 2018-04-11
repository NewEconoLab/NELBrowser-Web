namespace WebBrowser
{
    export class Address implements Page
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