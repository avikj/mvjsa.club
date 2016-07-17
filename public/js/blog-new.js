$(document).ready(function(){
  tinymce.init({
    selector: '#post-content-textarea',
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table contextmenu paste code'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    browser_spellcheck: true,
    contextmenu: true
  });
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
  $("#new-blog-post-form").submit(function(evt) {
    evt.preventDefault();
    var title = $('#post-title-input').val();
    var body = tinymce.activeEditor.getContent();
    if(title == '' || body == '') {
      Materialize.toast('Please fill out all fields.');
      return;
    }
    $.post('/blog/new', {
      postTitle: title,
      postBody: body
    }, function(data) {
      if(data == 'OK') {
        window.location.replace('/blog');
      } else {
        Materialize.toast('Could not submit post.', 2000);
      }
    });
  });
});