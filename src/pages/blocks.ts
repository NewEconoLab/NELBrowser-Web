/// <reference types="jquery" />

namespace WebBrowser
{
    export class Blocks implements Page
    {
        pageUtil: PageUtil;
        div: HTMLDivElement = document.getElementById('blocks-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        async start()
        {
            var count = await WWW.api_getHeight();
            this.pageUtil = new PageUtil(count, 15);
            await this.updateBlocks(this.pageUtil);
            this.div.hidden = false;
            this.footer.hidden = false;
            $("#blocks-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateBlocks(this.pageUtil);
                }
            });
            $("#blocks-page-previous").off("click").click(() => {
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
            this.footer.hidden = true;
        }
        public async updateBlocks(pageUtil: PageUtil) {
            let blocks: Block[] = await WWW.getblocks( pageUtil.pageSize, pageUtil.currentPage );
            $("#blocks-page").children("table").children("tbody").empty();
            if (pageUtil.totalPage - pageUtil.currentPage) {
                $("#blocks-page-next").removeClass('disabled');
            } else {
                $("#blocks-page-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#blocks-page-previous").removeClass('disabled');
            } else {
                $("#blocks-page-previous").addClass('disabled');
            }

            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            let pageMsg = "Blocks " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#blocks-page-msg").html(pageMsg);
            
            //let newDate = new Date();
            blocks.forEach((item, index, input) => {
                //newDate.setTime(item.time * 1000);
                let time = DateTool.getTime(item.time);
                //if (location.pathname == '/zh/') {
                //    let newDate = new Date();
                //    newDate.setTime(item.time * 1000);
                //    time = newDate.toLocaleString();
                //} 
                let html = `
                <tr>
                <td><a href="`+ Url.href_block(item.index) + `" target="_self">` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + time + `</td><td>` + item.tx.length + `</td>
                </tr>`;
                $("#blocks-page").find("tbody").append(html);
            });
        }

    }
}