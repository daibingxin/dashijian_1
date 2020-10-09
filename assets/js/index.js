$(function () {
    // 1.获取用户信息
    getUserInof();
})
//2.退出
var layer = layui.layer;
$("#btnLogout").on('click', function () {
    //框架提供的询问框
    layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
        //do something
        //1.清空本地token
        localStorage.removeItem('token');
        // 2.页面跳转
        location.href = "/login.html";
        //关闭询问框
        layer.close(index);
    });
})
//获取用户信息 (封装到入口函数的外面)
//原因 方便其他页面调用
function getUserInof() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {

            //判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //渲染用户头像
            rendreAvatar(res.data)
        },
        // complete: function (res) {
        //     console.log(res);
        //     //判断 如果是身份认证失败 跳转回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //1.删除本地token
        //         localStorage.removeItem('token');
        //         //2.页面跳转
        //         location.href = '/login.html'
        //     }
        // }
    })
}
//封装用户头像渲染函数
function rendreAvatar(user) {
    //1.用户名(昵称优先 没有用username)
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //2.用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        //没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}
