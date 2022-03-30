function writeArticle(){
    let title = $('#title').val()
    let content = $('#content').val()
    let nickName = $('#nickName').val()
    let userNo = $('#userNo').val()

    $.ajax({
        type : "POST",
        url : "/board/write",
        data : {
            title, content, nickName, userNo
        },
        success : function(response){
            alert(response['msg'])
            window.location.href='/board'
        },
        error : function(status){
            alert(status.responseJSON.msg)
            if(status.responseJSON.reason == "tokenVerify"){
                $.removeCookie('ggactk', {path:'/'})
                window.location.replace('/')
            }
        }
    })
}
function updateArticle(articleId){
    let title = $('#title').val()
    let content = $('#content').val()
    let nickName = $('#nickName').val()
    let userNo = $('#userNo').val()

    $.ajax({
        type : "PUT",
        url : "/board/write/"+articleId,
        data : {title, content, nickName, userNo},
        success : function(response){
            alert(response['msg'])
            window.location.href='/board'
        },error : function(status){
            alert(status.responseJSON.msg)
            if(status.responseJSON.reason == "tokenVerify"){
                $.removeCookie('ggactk', {path:'/'})
                window.location.replace('/')
            }
        }
    })
}
function deleteArticle(articleId){
    if(confirm('게시글은 삭제하면 복구할수 없습니다 삭제하시겠습니까?') == true){
        $.ajax({
            type : "DELETE",
            url : "/board/"+articleId,
            data : {},
            success : function(response){
                alert(response['msg'])
                window.location.href='/board'
            },
            error : function(status) {
                alert(status.responseJSON.msg)
                if(status.responseJSON.reason == "tokenVerify"){
                    $.removeCookie('ggactk', {path:'/'})
                    window.location.replace('/')
                }
            }
        })
    }
}
function commentWrite(articleId){
    let content = $('#comment').val()
    $.ajax({
        type : "POST",
        url : "/board/comment",
        data : {
            articleId,
            content,
        },
        success : function(response){
            alert(response['msg'])
            window.location.reload()
        },
        error : function(status){
            alert("로그인 하신 후 사용할 수 있습니다.")
            window.location.href='/user'
        }        
    })
}

function commentUpdate(articleId, commentId){
    let content = $('#upComment_'+commentId).val()
    $.ajax({
        type : "PATCH",
        url : "/board/comment",
        data : {articleId, commentId, content},
        success : function(response){
            alert(response['msg'])
            window.location.reload()
        },
        error : function(status){
            alert(status.responseJSON.msg)
            if(status.responseJSON.reason == "tokenVerify"){
                $.removeCookie('ggactk', {path:'/'})
                window.location.replace('/')
            }
        }
    })
}

function commentDelete(articleId, commentId){
    if(confirm('댓글을 삭제하시겠습니까?') == true){
        $.ajax({
            type : "DELETE",
            url : "/board/comment",
            data : {articleId,commentId},
            success : function(response){
                alert(response["msg"])
                window.location.reload()
            }, 
            error : function(status){
                alert(status.responseJSON.msg)
                if(status.responseJSON.reason == "tokenVerify"){
                    $.removeCookie('ggactk', {path:'/'})
                 window.location.replace('/')
                }
            }
        })
    }
}

function likeDo(articleId, userNo){
    if(!userNo){
        alert("로그인한 사용자만 이용하실수 있습니다.") 
        return window.location.replace("/user")
    }

    $.ajax({
        type : "PATCH",
        url : "/board/like",
        data : {articleId, userNo},
        success : function (response){
            alert(response['msg'])
            window.location.reload()
        },
        error : function(status){
            alert(status.responseJSON.msg)
            if(status.responseJSON.reason == "tokenVerify"){
                $.removeCookie('ggactk', {path:'/'})
                window.location.replace('/')
            }
        }
    })
}

function unlikeDo(articleId, userNo){
    $.ajax({
        type : "PATCH",
        url : "/board/unlike",
        data : {articleId, userNo},
        success : function(response){
            alert(response['msg'])
            window.location.reload()
        },
        error : function(status){
            alert(status.responseJSON.msg)
            if(status.responseJSON.reason == "tokenVerify"){
                $.removeCookie('ggactk', {path:'/'})
                window.location.replace('/')
            }
        }
    })
}