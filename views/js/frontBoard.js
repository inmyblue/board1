function writeArticle(){
    let title = $('#title').val()
    let userName = $('#userName').val()
    let password = $('#password').val()
    let content = $('#content').val()

    $.ajax({
        type : "POST",
        url : "/board",
        data : {
            title : title,
            userName : userName,
            password : password,
            content : content
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
function updateArticle(article_id){
    let title = $('#title').val()
    let userName = $('#userName').val()
    let password = $('#password').val()
    let content = $('#content').val()

    $.ajax({
        type : "PUT",
        url : "/board/"+article_id,
        data : {
            title,
            userName,
            password,
            content
        },
        success : function(response){
            if(response['success'] === true) {
                alert(response['msg'])
                window.location.href='/board'
            }else{
                alert(response['msg'])
            }
        }
    })
}
function deleteArticle(article_id){
    let password = $('#password').val()
    $.ajax({
        type : "DELETE",
        url : "/board/"+article_id,
        data : { password },
        success : function(response){
            if(response['success'] === true) {
                alert(response['msg'])
                window.location.href='/board'
            }else{
                alert(response['msg'])
            }
        }
    })
}