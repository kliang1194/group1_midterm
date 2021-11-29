$(document).ready(function() {

  const renderProducts = function(products) {
    // loops through products
    for (const product of products) {
      renderProduct(product);
    }
  };

  // Helper function that renders a single product
  const renderProduct = function(product) {
    const $product = createProductElement(product);         // calls createProductElement for each product
    $('#products-container').prepend($product);             // takes return value and appends it to the tweets container
    $("p.tw").first().text(tweet.content.text);             // Escape text to prevent XSS
  };

    /* Takes in tweet object and return a tweet <article> element */
    const createProductElement = function(product) {
      const $tweet = $(`
      <article class="product">
        <header>
          <div>
            <img src="${tweet.user.avatars}" alt="avatar.png">
            ${tweet.user.name}
          </div>
          ${tweet.user.handle}
        </header>
        <div class="tweet-content">
          <p class="tw"></p>
        </div>
        <footer>
          <p>${timeago.format(tweet.created_at)}</p>
          <div>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>`);
      return $tweet;
    };

  const loadProducts = function() {
    $.ajax({
      url: '/products',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log('this request succeeded and here\'s the data', data);
        renderProducts(data);
      },
      error: (error) => {
        console.log('this request failed and this was the error', error);
      }
    });
  };


});