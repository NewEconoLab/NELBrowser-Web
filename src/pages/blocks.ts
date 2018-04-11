/// <reference types="jquery" />

namespace WebBrowser
{
    export class Blocks implements Page
    {
        div: HTMLDivElement = document.getElementById( 'blocks-page' ) as HTMLDivElement;
        start(): void
        {
            this.updateBlocks( new PageUtil( 1,15 ) );
            this.div.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
        }
        public async updateBlocks(pageUtil: PageUtil) {
            let blocks: Block[] = await WWW.getblocks( pageUtil.pageSize, pageUtil.currentPage );
            console.log("blocks-page");
            $("#blocks-page").children("table").children("tbody").empty();
            if (pageUtil.totalPage - pageUtil.currentPage) {
                $("#blocks-page").find("#next").removeClass('disabled');
            } else {
                $("#blocks-page").find("#next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#blocks-page").find("#previous").removeClass('disabled');
            } else {
                $("#blocks-page").find("#previous").addClass('disabled');
            }
            let newDate = new Date();
            blocks.forEach((item, index, input) => {
                newDate.setTime(item.time * 1000);
                let html = `
                <tr>
                <td><a href="`+ Url.href_block( item.index) + `">` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + newDate.toLocaleString() + `</td>
                </tr>`;
                $("#blocks-page").find("tbody").append(html);
            });
        }

        public async queryBlock( index: number )
        {
            let ajax: Ajax = new Ajax();
            let newDate = new Date();
            let blocks: Block[] = await ajax.post('getblock', [index]);
            let block: Block = blocks[0];
            console.log(block);
            newDate.setTime(block.time * 1000);
            $("#hash").text(block.hash);
            $("#size").text(block.size + ' byte');
            $("#time").text(newDate.toLocaleString());
            $("#version").text(block.version);
            $("#index").text(block.index);
            let txs: Tx[] = block.tx;
            txs.forEach(tx =>
            {
                $( "#txs" ).append( `
                    <tr>
                        <td><a href="` + Url.href_transaction( tx.txid) + `> + tx.txid + '</a></td>
                        <td>` + tx.type + `</td>
                        <td>` + tx.size + ` bytes</td>
                        <td>` + tx.version + `</td>
                    </tr>` );
            });

        }
    }
}