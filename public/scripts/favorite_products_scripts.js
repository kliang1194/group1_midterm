$(document).ready(function() {

  $(function () {
 
    $('[id*="unfavorite-button"]').submit(function(event) {
      event.preventDefault();                                         // Pause form submition
      alert(event.target.action);

      const target_id = event.target.id;
      $(`#${target_id}`).attr("disabled", true);                      // Set to disabled after click
      $(`#${target_id} > button`).attr("disabled", true);             // Set to disabled after click

      $(this).unbind('submit').submit();                              // Submit form
    })
  });
  
  const renderUnfavorites = function(data) {
    for (const product of data) {
      $(`#unfavorite-button-${product.product_id}`).css("display", "inline-block");
    }
  };

  const loadFavorites = function() {
    $.ajax({
      url: '/favorites/json',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log('this request succeeded and here\'s the data', data);
        renderUnfavorites(data);
      },
      error: (error) => {
        console.log('this request failed and this was the error', error);
      }
    });
  };

  loadFavorites();

});