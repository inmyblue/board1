function register() {
    let userId = $('#userId').val()
    let nickName = $('#nickName').val()
    let password = $('#password').val()
    let confirmPassword = $('#confirmPassword').val()

    if(password !== confirmPassword) return alert("두 비밀번호가 일치하지 않습니다")
    if(password.search(userId) > -1) return alert("비밀번호에 아이디가 포함되었습니다")
    if(password.search(nickName) > -1) return alert("비밀번호에 닉네임이 포함되었습니다")
 
    $.ajax({
        type : "POST",
        url : "/user/register",
        data : {
            userId,
            nickName,
            password,
            confirmPassword
        },
        success : function(response) {
            alert(response['msg'])
            window.location.href="/user"
        },
        error : function(error){
            alert(error.responseJSON.msg)
        }
    })
}

function login() {
    let userId = $('#userId').val()
    let password = $('#password').val()

    $.ajax({
        type : "POST",
        url : "/user",
        data : {
            userId,
            password
        },
        success : function(response){
            localStorage.setItem("token", response.token);
            window.location.href="/board"
        },
        error : function(error){
            alert("입력하신 정보가 올바르지 않습니다")
            window.location.reload()
        }
    })
}

function getSelf(callback) {
    $.ajax({
        type: "GET",
        url: "/user/me",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        success: function (response) {
            let tmpHtml = `
                <li><a href="" onclick="logout()" style="font-size:3vh; padding-top:55%;">로그아웃</a></li>
            `
            $('#authFunc').append(tmpHtml)
            authUserNo = response.userNo
            authNickName = response.nickName
            callback(response.user);
        },
        error: function (xhr, status, error) {
        },
    }); 
  }

function logout() {
    localStorage.clear();
    window.location.href = "/";
}