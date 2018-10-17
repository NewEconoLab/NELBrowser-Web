/// <reference types="jquery" />

namespace WebBrowser
{
    export class Blocks implements Page
    {
        pageUtil: PageUtil;
        div: HTMLDivElement = document.getElementById('blocks-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        //constructor() {
            
        //}
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
            $("#blocks-input").val('');
            $("#blocks-input").off("input").on('input', () => {
                this.doGoPage(false)
            });
            $("#blocks-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doGoPage(true);
                }
            });  
            $("#blocks-gopage").off("click").click(() => {
                this.doGoPage(true)
            });
        }
        //跳转页面
        public doGoPage(gopage: boolean) {
            let page: number = $("#blocks-input").val() as number;
            if (page && page > this.pageUtil.totalPage) {
                page = this.pageUtil.totalPage;
                $("#blocks-input").val(this.pageUtil.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#blocks-input").val(1);
            }
            if (gopage) {
                this.pageUtil.currentPage = page;
                this.updateBlocks(this.pageUtil);
                $("#blocks-input").val('');
            }            
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        public async updateBlocks(pageUtil: PageUtil) {
            let blocks: BlockList[] = await WWW.getblocks( pageUtil.pageSize, pageUtil.currentPage );
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

            //let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            //let maxNum = pageUtil.totalCount;
            //let diffNum = maxNum - minNum;
            //if (diffNum > 15) {
            //    maxNum = pageUtil.currentPage * pageUtil.pageSize;
            //}
            //let pageMsg = "Blocks " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount + " <br/> page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage +" pages in total";
            let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
            }
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
                <td>` + item.size + ` bytes</td><td>` + time + `</td><td>` + item.txcount + `</td>
                </tr>`;
                $("#blocks-page").find("tbody").append(html);
            });
        }

    }
}