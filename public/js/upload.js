$(document).ready(function() {
  //when the upload button is clicked then the input button will be triggered
  $('.upload-btn').on('click', function() {
    $('#upload-input').click();

    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');

  });
  $('#upload-input').on('change', function(){
    //get the value from inside the input filed
    var uploadInput = $('#upload-input').val();

    if(uploadInput != ''){
      var formData = new FormData();
//we get the key here which is the name of the input field
      formData.append('upload', uploadInput.files);
//using ajax to send the data to the server
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          //empty the input field
          uploadInput.val('');
        },
        xhr: function(){
          var xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', function(e){
            //if thr length of the size of upload is normal
            if(e.lengthComputable){
              //number of bytes that is transferred since the beginning of the upload/ total number of bytes
              var uploadPercent = e.loaded / e.total;
              uploadPercent = (uploadPercent * 100);

              $('.progress-bar').text(uploadPercent + '%');
              $('.progress-bar').width(uploadPercent + '%');

              if(uploadPercent === 100){
                $('.progress-bar').text('Done');
                $('#completed').text('File Uploaded');

              }

            }
          }, false);
          return xhr;
        }

      })

    }
  })

})
