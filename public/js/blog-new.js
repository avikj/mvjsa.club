
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

$("#new-blog-post-form").submit(function(evt) {
  evt.preventDefault();
  var title = $('#post-title-input').val();
  var body = $('#post-content-textarea').val();
  if(title.length * body.length == 0) {
    alert('Please fill out all fields.');
    return;
  }
  $.post('/blog/new', {
    postTitle: title,
    postBody: body
  }, function(data) {
    alert(data);
  });
});