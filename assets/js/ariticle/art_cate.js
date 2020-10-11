$(function () {
    var layer = layui.layer;
    initArtCateList();
    var indexAdd = null;
    //点击添加分类  弹出弹框
    $("#btnAdd").on('click', function () {
        //每一种弹层调用方式，都会返回一个index
        // layer.open（）  弹出层   每一种弹层调用方式，都会返回一个index    它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
        indexAdd = layer.open({
            //type  指定弹出层是哪种类型  1 为页面层
            type: 1,
            title: '添加文章分类',
            //area  设置弹出框的大小
            area: ['500px', '260px'],
            //content  不仅可以传入普通的html内容，还可以指定DOM，更可以随着type的不同而不同
            // content: '<form><input type="submit" /></form>'
            content: $("#dialog-add").html(),
        });

    })



    // 添加文章分类  通过代理的形式，为 form-add 表单绑定 submit 事件
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //渲染列表
                initArtCateList();
                //关闭弹出层  
                //layer.close（）如果想关闭最新弹出的层 把最新的弹出层的索引 添加到layer.close（）中就行
                layer.close(indexAdd);
            }

        })

    })
    //点击编辑文章分类 弹出框
    var indexEdit = null;
    var form = layui.form;
    $("tbody").on('click', ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-edit").html(),
        });
        //根据id获取信息  渲染编辑页面
        var Id = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })
    //编辑文章分类  代理绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexEdit);

            }
        })
    })
    //删除文章分类  代理绑定submit事件
    $("tbody").on('click', ".btn-delete", function () {
        //获取当前点击的自定义属性id值
        var id = $(this).attr("data-id");
        layer.confirm(' 是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    initArtCateList();
                }
            })

            layer.close(index);
        });
    })
    //封装初始化分类列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template("tpl_table", res);
                $('tbody').html(htmlStr);
            }
        })
    }
})