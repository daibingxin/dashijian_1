$(function () {
    //1.自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间!"
            }
        }
    })
    //   2.初始化用户信息
    initUserInfo();
    //初始化用户信息封装 后面还要用
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 3.表单重置
    $("#btnReset").on('click', function (e) {
        //阻止重置
        e.preventDefault();
        //从新用户渲染
        initUserInfo()
    })
    $('.layui-form').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败!")
                }
                layer.msg('更新用户信息成功!')
                window.parent.getUserInof()
            }
        })
    })
})