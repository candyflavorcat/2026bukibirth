console.log("script loaded"); // 이거 뜨는지부터 확인

const totalPages = 70;

for(let i = 1; i <= totalPages; i++) {
  $("#book").append(
    `<img src="pages/page${i}.jpg">`
  );
}

$("#book").turn({
  width: $("#book").width(),
  height: $("#book").height(),
  autoCenter: true
});
