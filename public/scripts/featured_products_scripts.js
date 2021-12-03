$(document).ready(function() {

  $(function () {

  });

  const renderFeatured = function(data) {
    let counter = 1;
    for (const product of data) {
      $(`#slide-${counter} > a`).attr('href', `products/${product.id}`);
      $(`#slide-${counter} > a > img`).attr('src', product.image_url);
      counter++;
    };
  };

  const loadFeatures = function() {
    $.ajax({
      url: '/features/json',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log('this request succeeded and here\'s the data', data);
        renderFeatured(data);
      },
      error: (error) => {
        console.log('this request failed and this was the error', error);
      }
    });
  };

  loadFeatures();

});
