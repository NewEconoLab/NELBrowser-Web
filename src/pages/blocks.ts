/// <reference types="jquery" />

namespace WebBrowser
{
    export class Blocks implements Page
    {
        div: HTMLDivElement = document.getElementById( 'blocks-page' ) as HTMLDivElement;
        async start()
        {
            await this.updateBlocks( new PageUtil( 1, 15 ) );
            this.div.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
        }
        public async updateBlocks(pageUtil: PageUtil) {
            let blocks: Block[] = await WWW.getblocks( pageUtil.pageSize, pageUtil.currentPage );
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

    }
}