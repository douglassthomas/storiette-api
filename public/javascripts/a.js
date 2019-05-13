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


    var data = $.ajax({
        url: 'https://storiette-api.azurewebsites.net/data/1.txt',
        type: 'GET'
    })

    data.done(function (result) {
        // var d = result[0].data
        // var data = JSON.parse(d)


        console.log(JSON.parse(result))

        // for(let i=0; i<data.length; i++){
        //     console.log(data[i])
        // }
    })
})