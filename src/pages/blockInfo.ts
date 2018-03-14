namespace WebBrowser
{
    export class Block
    {
        div: HTMLDivElement;

        start()
        {
            this.div = document.getElementById("block-info") as HTMLDivElement;
            this.div.hidden = true;
            this.div.innerHTML = pages.block;
        }
    }
}