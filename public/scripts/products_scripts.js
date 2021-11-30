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
    $('#products-container').append($product);             // takes return value and appends it to the tweets container
  };

    /* Takes in product object and return a product <article> element */
    const createProductElement = function(product) {
      const $product = $(`
      <article class="product">
        <div class="image-content">
          <img src="${product.image_url}" width="300" height="300">
        </div>

        <div class="product-content">
          <div class="description-section">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>

          <div class="link-section">
            <form method="GET" action="/products/<%= product_id %>">
              <button type="submit" class="btn btn-primary">EDIT</button>
            </form>
            <a class="nav-item-nav-link" href="/products/${product.id}/:user_id/newFavorite">Favourite This</a>
            <a class="nav-item-nav-link" href="/messages/${product.seller_id}">Contact Seller</a>
          </div>
        </div>
      </article>
      `);
      return $product;
    };

  const loadProducts = function() {
    $.ajax({
      url: '/products/json',
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

  // Test / driver code
  loadProducts();
});