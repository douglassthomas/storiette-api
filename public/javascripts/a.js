function getDetail(){
    
}

$(function () {
    console.log("start")
    var detail = $.ajax({
        url: 'https://storiette-api.azurewebsites.net/detail',
        type: 'POST',
        data:{
            id: 1
        }
    })

    detail.done(function (result) {
        console.log(result);
        $('#ok').html(result.synopsis)
    })

    var detail = $.ajax({
        url: 'https://storiette-api.azurewebsites.net/story',
        type: 'POST',
        data:{
            id: 1
        }
    })

    detail.done(function (result) {
        console.log(result);
        // $('#audio').attr('src', result.audio)
    })

})