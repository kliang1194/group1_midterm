$(document).ready(function() {

  $(function () {
    $('[id*="favorite-button"]').submit(function(event) {
      event.preventDefault();

      const target_id = event.target.id;
      $(`#${target_id}`).css("display", "none");
      $(`#un${target_id}`).css("display", "inline-block");
    })

    $('[id*="unfavorite-button"]').submit(function(event) {
      event.preventDefault();

      const target_id = event.target.id;
      const target_id_2 = target_id.replace("un", "");
      $(`#${target_id}`).css("display", "none");
      $(`#${target_id_2}`).css("display", "inline-block");
    })
  });


});