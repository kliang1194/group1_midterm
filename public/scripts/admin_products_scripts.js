$(document).ready(function() {

  $(function () {
    $('#delete-button').submit(function(event) {

      if(window.confirm("Do you really want to delete this item?")) {
        window.open('/products', "Item deleted!");
      }

    });

    $('.openbtn').on("click", function() {
      openNav();
    });

    $('.closebtn').on("click", function() {
      closeNav();
    });
  });


  /* Set the width of the sidebar to 250px (show it) */
  function openNav() {
    document.getElementById("filter-sidepanel").style.width = "250px";
  };

  /* Set the width of the sidebar to 0 (hide it) */
  function closeNav() {
    document.getElementById("filter-sidepanel").style.width = "0";
  };

});
