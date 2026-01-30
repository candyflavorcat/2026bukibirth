const FlipbookConfig = {
    totalPage: 120,          
    imagePath: 'pages/page', 
    extension: '.jpg',      
    ratio: 1.414,           // 중요: 페이지의 가로세로 비율 (A4 기준 1:1.414)
    bookmarks: { 3: "시작", 7: "중안", 120: "끝" }
};

$(document).ready(function() {
    const $book = $('#flipbook');

    // 1. 페이지 생성 (이전과 동일)
    for (let i = 1; i <= FlipbookConfig.totalPage; i++) {
        const pageNum = String(i).padStart(3, '0');
        const imgPath = `${FlipbookConfig.imagePath}${pageNum}${FlipbookConfig.extension}`;
        const $page = $('<div class="page"></div>').css('background-image', `url(${imgPath})`);

        if (FlipbookConfig.bookmarks[i]) {
            const $bookmark = $(`<div class="bookmark">🔖 ${FlipbookConfig.bookmarks[i]}</div>`);
            $bookmark.on('click', (e) => { e.stopPropagation(); $book.turn('page', i); });
            $page.append($bookmark);
        }
        $book.append($page);
    }

    // 2. 반응형 크기 계산 함수
    function resizeBook() {
        const containerWidth = $(window).width() * 0.9; // 화면 너비의 90%
        const containerHeight = $(window).height() * 0.8; // 화면 높이의 80%

        let width, height;

        // 화면이 세로 모드일 때 (한 페이지만 보여주기 권장)
        if ($(window).width() < $(window).height()) {
            $book.turn('display', 'single'); // 한 페이지씩 보기
            width = containerWidth;
            height = width * FlipbookConfig.ratio;
        } else {
            // 가로 모드일 때 (두 페이지 펼침)
            $book.turn('display', 'double');
            height = containerHeight;
            width = height / FlipbookConfig.ratio * 2;
            
            // 만약 계산된 너비가 화면보다 크면 조정
            if (width > containerWidth) {
                width = containerWidth;
                height = (width / 2) * FlipbookConfig.ratio;
            }
        }

        $book.turn('size', width, height);
    }

    // 3. 플립북 초기화
    $book.turn({
        acceleration: true,
        gradients: true,
        elevation: 50,
        when: {
            turning: function(e, page, view) {
                // 페이지 넘길 때 사운드나 효과 추가 가능
            }
        }
    });

    // 4. 리사이즈 및 회전 감지
    $(window).on('resize', function() {
        resizeBook();
    });

    // 초기 실행 시 크기 조절
    resizeBook();
});
