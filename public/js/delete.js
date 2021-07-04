$('.delete').click(function() {
    var response = confirm("Do you want to delete News data ?")
    id = this.id;
    console.log(response)
    if(response === true){
        $.ajax({
            type: 'DELETE',
            url: '/news/deleteNews',
            method: 'delete',
            data: {"id":id},
            success: function(data){
                console.log('data is '+JSON.stringify(data));
                window.location.reload()
            },
            error: function(){
                alert('No data');
            }
        });
    }
    else{
        console.log("not deleted")
    }
});