$(document).ready(function() {

  $(function () {
    $('[id*="favorite-button"]').submit(function(event) {
      event.preventDefault();                                         // Pause form submition
      const target_id = event.target.id;
      alert(event.target.action);
      $(`#${target_id}`).css("display", "none");
      $(`#un${target_id}`).css("display", "inline-block");

      $(this).unbind('submit').submit();                              // Submit form
    })

    $('[id*="unfavorite-button"]').submit(function(event) {
      event.preventDefault();                                         // Pause form submition

      const target_id = event.target.id;
      const target_id_2 = target_id.replace("un", "");
      $(`#${target_id}`).css("display", "none");
      $(`#${target_id_2}`).css("display", "inline-block");

      $(this).unbind('submit').submit();                              // Submit form
    })
  });
  
  const renderUnfavorites = function(data) {
    for (const product of data) {
      $(`#favorite-button-${product.product_id}`).css("display", "none");
      $(`#unfavorite-button-${product.product_id}`).css("display", "inline-block");
    }
  };

  const loadFavorites = function() {
    $.ajax({
      url: '/favorites',
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