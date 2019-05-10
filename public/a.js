function getDetail(){
    
}

(function () {
    console.log("start")
    var detail = $.ajax({
        url: 'https://storiette-api.azurewebsites.net/',
        type: 'GET'
        // data:{
        //     courseid: 1
        // }
    })

    detail.done(function (result) {
        console.log(result);
    })
})