function register() {
    let userId = $('#userId').val()
    let nickName = $('#nickName').val()
    let password = $('#password').val()
    let confirmPassword = $('#confirmPassword').val()

    if(password !== confirmPassword) return alert("두 비밀번호가 일치하지 않습니다")
 
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
        let tmpHtml = `
        <li><a href="/user" style="font-size:3vh; padding-top:65%;">로그인</a></li>
        `
        $('#authFunc').append(tmpHtml)
        // if (status == 401) {
        //   alert("로그인이 필요합니다.");
        // } else {
        //   localStorage.clear();
        //   alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
        // }
        // window.location.href = "/";
      },
    });
  }

function logout() {
    localStorage.clear();
    window.location.href = "/";
}