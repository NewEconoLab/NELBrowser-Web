namespace WebBrowser
{
    export class Block implements Page
    {
        div: HTMLDivElement = document.getElementById("block-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        private pageUtil: PageUtil;
        private txs: Tx[];
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }

        start()
        {
            //this.div.innerHTML = pages.block;
            this.queryBlock(locationtool.getParam() as number);
            let href = locationtool.getUrl() + "/blocks";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all blocks</a>';
            if (location.pathname == '/zh/') {
                html = '<a href="' + href + '" target="_self">&lt&lt&lt返回</a>';
            }
            $("#goallblock").empty();
            $("#goallblock").append(html);

            $("#block-tran-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateBlockTrans(this.pageUtil);                    
                }
            });
            $("#block-tran-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateBlockTrans(this.pageUtil);  
                }
            });
            $("#block-input").val('');
            $("#block-input").off("input").on('input', () => {
                this.doGoPage(false)
            });
            $("#block-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doGoPage(true);
                }
            });
            $("#block-gopage").off("click").click(() => {
                this.doGoPage(true)
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }
        //跳转页面
        public doGoPage(gopage: boolean) {
            let page: number = parseInt($("#block-input").val() as string);
            if (page && page > this.pageUtil.totalPage) {
                page = this.pageUtil.totalPage;
                $("#block-input").val(this.pageUtil.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#block-input").val(1);
            }
            if (gopage) {
                this.pageUtil.currentPage = page;
                this.updateBlockTrans(this.pageUtil); 
                $("#block-input").val('');
            }
        }

        public async queryBlock( index: number )
        {
            let ajax: Ajax = new Ajax();
            let blocks: Block[] = await ajax.post( 'getblock', [index] );
            let block: Block = blocks[0];
            let time = DateTool.getTime(block.time);
            //if (location.pathname == '/zh/') {
            //    let newDate = new Date();
            //    newDate.setTime(block.time * 1000);
            //    time = newDate.toLocaleString();
            //} 

            $("#hash" ).text( block.hash );
            $("#size" ).text( block.size + ' byte' );
            $("#time").text(time);
            $("#version" ).text( block.version );
            $("#index").text(block.index);
            //`<a href="`+ Url.href_block(item.index) + `" target="_self">`
            $("#previos-block").html(`<a href="` + Url.href_block(block.index - 1) + `" target="_self">` + (block.index - 1)+`</a>`);
            $("#next-block").html(`<a href="` + Url.href_block(block.index + 1) + `" target="_self">` + (block.index + 1) + `</a>`);
            this.txs = block.tx;
            let txsLength = this.txs.length;
            this.pageUtil = new PageUtil(this.txs.length, 10);
            if (txsLength > this.pageUtil.pageSize) {
                $(".block-tran-page").show();
            } else {
                $(".block-tran-page").hide();
            }
            this.updateBlockTrans(this.pageUtil);
        }
        updateBlockTrans(pageUtil: PageUtil) {
            $("#txs").empty();
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > pageUtil.pageSize) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            } else {
                maxNum = pageUtil.totalCount;
            }
            let arrtxs = new Array();
            for (let i = minNum; i < maxNum; i++) {
                arrtxs.push(this.txs[i]);
            }
            arrtxs.forEach(tx => {
                var id = tx.txid.replace('0x', '');
                id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
                this.loadBlockTransView(tx.txid, id, tx.type, tx.size, tx.version);
            });

            //let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            let pageMsg = "Page " + this.pageUtil.currentPage + " , " + this.pageUtil.totalPage + " pages in total";
            if (location.pathname == '/zh/') {
                pageMsg = "第 " + this.pageUtil.currentPage + " 页，共 " + this.pageUtil.totalPage + " 页"
            }
            $("#block-tran-msg").html(pageMsg);
            if (pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#block-tran-next").removeClass('disabled');
            } else {
                $("#block-tran-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#block-tran-previous").removeClass('disabled');
            } else {
                $("#block-tran-previous").addClass('disabled');
            }
        }
        loadBlockTransView(txid: string, id: string, type: string, size: number, version: number) {
            let html = `
                    <tr>
                        <td><a href="` + Url.href_transaction(txid) + `" target="_self">` + id + `</a></td>
                        <td>` + type.replace("Transaction", "") + `</td>
                        <td>` + size + ` bytes</td>
                        <td>` + version + `</td>
                    </tr>`;
            $("#txs").append(html);
        }
    }
}