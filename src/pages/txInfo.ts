namespace WebBrowser
{
    export class Transaction
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