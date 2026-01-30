const totalPages = 70;

for(let i = 1; i <= totalPages; i++) {
  $("#book").append(
    `<img loading="lazy" src="pages/page${i}.jpg">`
  );
}

$("#book").turn({
  width: $("#book").width(),
  height: $("#book").height(),
  autoCenter: true
});
