var name;
var newsId;
var to_be_updated;
        $(document).ready(function() {
            $('#myTable').DataTable();
            });
        // edit data
        $('.update').click(function() {
          id= this.id;
          console.log(this.id);
                $.ajax({
                    type: 'GET',
                    url: '/news/find_by_name',
                    data: {"id":id},
                    success: function(data){
                      console.log('response data',data);
                            to_be_updated = data.title;
                            newsId= id;
                            $("#update_title").attr("value", data.title);
                            $("#update_description").attr("value", data.description);
                            $("#update_imageurl").attr("value", data.imageurl);
                            $('#myModal').modal({show: true});
                        },
                    error: function(){
                        alert('No data',id);
                    }
                    });
            });




            
            // update data
                  $(function(){
                      $('#update_table').on('click', function(e){
                        console.log('i am indsd');
                        console.log("data to be updated",newsId)
                        var data = $('#update_user').serialize();
                        debugger;
                        console.log(JSON.stringify(data));
                        e.preventDefault();
                        $.ajax({
                          url: '/news/updateNews?newsId='+newsId,
                          type:'PUT',
                          data : data,
                          success: function(data){
                            console.log('i am googleapis');
                            window.location.reload()
                        },
                        error: function(){
                          alert('No data');
                        }
                      });
                  });
                  });