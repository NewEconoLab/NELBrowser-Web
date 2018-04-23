/// <reference types="jquery" />

namespace WebBrowser
{
    export class Blocks implements Page
    {
        pageUtil: PageUtil;
        div: HTMLDivElement = document.getElementById( 'blocks-page' ) as HTMLDivElement;
        async start()
        {
            var count = await WWW.api_getHeight();
            this.pageUtil = new PageUtil(count, 15);
            await this.updateBlocks(this.pageUtil);
            this.div.hidden = false;
            $("#blocks-page").find("#next").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateBlocks(this.pageUtil);
                }
            });
            $("#blocks-page").find("#previous").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateBlocks(this.pageUtil);
                }
            });
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

            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            let pageMsg = "Blocks " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#blocks-page").find("#page-msg").html(pageMsg);
            
            let newDate = new Date();
            blocks.forEach((item, index, input) => {
                newDate.setTime(item.time * 1000);
                let html = `
                <tr>
                <td><a href="`+ Url.href_block(item.index) + `" target="_self">` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + newDate.toLocaleString() + `</td>
                </tr>`;
                $("#blocks-page").find("tbody").append(html);
            });
        }

    }
}