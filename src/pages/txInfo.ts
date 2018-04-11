namespace WebBrowser
{
    export class Transaction implements Page
    {
        div: HTMLDivElement;

        start()
        {
            this.div = document.getElementById("transaction-info") as HTMLDivElement;
            this.div.hidden = true;
            this.div.innerHTML = pages.transaction;
            
        }
    }
}