function writeArticle(){
    let title = $('#title').val()
    let content = $('#content').val()
    let nickName = $('#nickName').val()
    let userNo = $('#userNo').val()

    $.ajax({
        type : "POST",
        url : "/board",
        data : {
            title, content, nickName, userNo
        },
        success : function(response){
            alert(response['msg'])
            window.location.href='/board'
        },
        error : function(error){
            alert(error.responseJSON.msg)
        }
    })
}
function updateArticle(articleId){
    let title = $('#title').val()
    let content = $('#content').val()
    let nickName = $('#nickName').val()
    let userNo = $('#userNo').val()
    console.log(articleId)

    $.ajax({
        type : "PUT",
        url : "/board/"+articleId,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data : {title, content, nickName, userNo},
        success : function(response){
            alert(response['msg'])
            window.location.href='/board'
        },error : function(error){
            alert(error.responseJSON.msg)
        }
    })
}
function deleteArticle(articleId){
    $.ajax({
        type : "DELETE",
        url : "/board/"+articleId,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data : {},
        success : function(response){
            alert(response['msg'])
            window.location.href='/board'
        }
    })
}
function writeAuth(articleId){
    $.ajax({
        type : "GET",
        url : "/board/auth",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        success : function(response){
            let nickName = response['nickName']
            let userNo = response['userNo']
            if(articleId == undefined) articleId = ''
            let txt = nickName+"&"+userNo+"&"+articleId
            window.location.href=`/board/write/${txt}`
        },
        error : function(xhr, status, error){
            alert("로그인 후 사용하실 수 있습니다")
            window.location.href="/user"
        }
    })
}
function commentWrite(articleId){
    let content = $('#comment').val()
    // let userNo = authUserNo
    // let nickName = authNickName
    $.ajax({
        type : "POST",
        url : "/board/comment",
        headers : {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data : {
            articleId,
            content,
        },
        success : function(response){
            alert(response['msg'])
            window.location.reload()
        }        
    })
}
function commentRead(articleId){
    $.ajax({
        type : "GET",
        url : "/board/comment",
        headers : {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data :{articleId},
        success : function(response){
            let tmpHtml
            let rows = response['comment']

            for(let i=0; i < rows.length; i++){
                let {commentId, nickName, datetime, content, userNo} = rows[i]
                if(userNo == authUserNo){
                    tmpHtml = `
                        <div class = "comment_out">
                        <div class = "com_username">${nickName}<span style="margin-left : 50px; font-size : 10px;">${datetime}</span>
                        <span id="comment_auth">
                            <span class="update_post" 
                            onclick="$('#comment_${commentId}').removeClass('hide'); $('#txtComment_${commentId}').addClass('hide');">수정하기</span>
                            <span class="delete_post" onclick="commentDelete(${commentId})">삭제하기</span>
                        </span></div>
                        <div class="com_contents" id="txtComment_${commentId}">${content}</div>
                        <div class="com_contents update hide" id="comment_${commentId}"><textarea id="upComment_${commentId}"rows="3" style="width:90%;">${content}</textarea>
                        <input type="button" class="btn btn-default" value="등록하기"
                            style="width:8%;min-height:5vh;margin-left:2px;" onclick="commentUpdate(${commentId})">
                        </div>
                        </div>
                    `
                    $('#comment_view').append(tmpHtml)
                } else {
                    tmpHtml = `
                        <div class = "comment_out">
                        <div class = "com_username">${nickName}<span style="margin-left : 50px; font-size : 10px;">${datetime}</span>
                        <span id="comment_auth"></span></div>
                        <div class = "com_contents">${content}</div>
                        </div>
                    `
                    $('#comment_view').append(tmpHtml)
                }
                
            }
        }
    })
}
function commentUpdate(commentId){
    let content = $('#upComment_'+commentId).val()
    $.ajax({
        type : "PATCH",
        url : "/board/comment",
        headers : {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data : {commentId, content},
        success : function(response){
            alert(response['msg'])
            window.location.reload()
        }
    })
}

function commentDelete(commentId){
    if(confirm('댓글을 삭제하시겠습니까?') != true) window.location.reload()
    $.ajax({
        type : "DELETE",
        url : "/board/comment",
        headers : {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data : {commentId},
        success : function(response){
            alert(response["msg"])
            window.location.reload()
        }, 
        error : function(response){
            alert(response["msg"])
        }
    })
}