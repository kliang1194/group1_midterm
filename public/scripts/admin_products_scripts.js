$(document).ready(function() { 

  $(function() {
    $('#delete-button').submit(function(event) {

      if(window.confirm("Do you really want to delete this item?")) {
        window.open('/products', "Item deleted!");
      }

    })
  })

})