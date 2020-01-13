//Creazione di una piccola applicazione web per gestire una lista di "todo".
$(document).ready(function(){
  var template_html = $('#myTemplate').html();//recupero il codice html del template
  var template_function = Handlebars.compile(template_html);//do in pasto a handlebars il codice html


$.ajax({
      url : 'http://157.230.17.132:' + PORTA,
      method : 'get',
      success : function(data) {
        alert()
      },
  error : function() {
        alert('film error');
      }
    });

});
