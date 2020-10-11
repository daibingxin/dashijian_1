$(function () {
    //1.初始化分类
    var form = layui.form;
    var layer = layui.layer
    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮 选择文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //5.设置图片
    $("#coverFile").change(function (e) {
        //拿到用户选择的文件
        var file = e.target.files[0]
        //非空校验  URL.createObjectURL() 参数不能为undefined
        if (file == undefined) {
            return alert('选择文件失败')
        }
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //6.设置状态
    var state = "已发布";
    $('#btnSave2').on('click', function () {
        state = "草稿";
    })

    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', state)
        //放入图片
        $image.cropper('getCroppedCanvas', {//创建一个Canvas画布
            width: 400,
            height: 280
        })
            //将Canvas画布上的内容 转化为文件对象
            .toBlob(function (blob) {
                fd.append('cover_img', blob);
                //文章发布
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //跳转页面
                layer.msg('添加文章成功,跳转中...')
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click()
                }, 1500)
            }
        })
    }
}) 
