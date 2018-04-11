namespace WebBrowser
{
    export class Block implements Page
    {
        div: HTMLDivElement = document.getElementById( "block-info" ) as HTMLDivElement;
        close(): void
        {
            this.div.hidden = false;
        }

        start()
        {
            this.div.hidden = true;
            this.div.innerHTML = pages.block;
        }
    }
}