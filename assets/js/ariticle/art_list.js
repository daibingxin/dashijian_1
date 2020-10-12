$(function () {
    //为art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ":" + ss
    }
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    //定义查询参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ""
    }
    //2. 初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                var str = template('tpl-table', res)
                $('tbody').html(str)
                //分页
                renderPage(res.total)
            }

        })
    }
    // 3.初始化分类
    var form = layui.form;
    initTCate();//调用函数
    function initTCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值 渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //4.筛选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        //获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })
    //5.分页
    var laypage = layui.laypage;


    function renderPage(total) {
        // alert(num)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页


            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],


            jump: function (obj, first) {
                //obj包含了当前分页的所有参数 比如
                //赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }

    //6.删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        //先获取id 进入到函数中this代指就改变了
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //因为我们更新成功了 所以要重新渲染页面中的数据
                    initTable()
                    layer.msg('恭喜您,文章删除成功!')
                    //页面汇总删除按钮个数等于1  页码大于1 
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }

            })
            layer.close(index);
        });
    })
})