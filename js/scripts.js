/**
 * 플립북 설정 관리 객체
 */
const FlipbookConfig = {
    totalPage: 70,          // 전체 이미지 장수
    imagePath: 'pages/page', // 이미지 경로 및 파일명 앞부분
    extension: '.jpg',      // 확장자
    bookWidth: 1000,        // 전체 가로 길이 (2페이지 펼침 기준)
    bookHeight: 700,        // 세로 길이
    aspectRatio: 1000 / 700,
    
    // 북마크 설정 (페이지 번호 : 라벨명)
    bookmarks: {
        3: "시작하며",
        7: "중요 포인트",
        10: "마치며"
    }
};

$(document).ready(function() {
    const $book = $('#flipbook');

    // 1. 페이지 자동 생성 로직
    function buildPages() {
        for (let i = 1; i <= FlipbookConfig.totalPage; i++) {
            const pageNum = String(i).padStart(3, '0');
            const imgPath = `${FlipbookConfig.imagePath}${pageNum}${FlipbookConfig.extension}`;
            
            const $page = $('<div class="page"></div>').css({
                'background-image': `url(${imgPath})`,
                'background-size': '100% 100%' // 이미지 꽉 차게 설정
            });

            if (FlipbookConfig.bookmarks[i]) {
                const label = FlipbookConfig.bookmarks[i];
                const $bookmark = $(`<div class="bookmark">🔖 ${label}</div>`);
                
                $bookmark.on('click', function(e) {
                    e.stopPropagation();
                    $book.turn('page', i);
                });
                
                $page.append($bookmark);
            }
            $book.append($page);
        }
    }

    // 화면 크기에 맞게 사이즈를 계산하고 적용하는 함수
    function resizeFlipbook() {
        const containerWidth = $(window).width() * 0.9;
        const containerHeight = $(window).height() * 0.8;

        let width = containerWidth;
        let height = width / FlipbookConfig.aspectRatio;

        if (height > containerHeight) {
            height = containerHeight;
            width = height * FlipbookConfig.aspectRatio;
        }

        $book.turn('size', width, height);
    }

    function initFlipbook() {
        $book.turn({
            // 주의: baseWidth 대신 bookWidth 사용 (Config 객체 기준)
            width: FlipbookConfig.bookWidth,
            height: FlipbookConfig.bookHeight,
            autoCenter: true,
            duration: 800,
            gradients: true,
            acceleration: true,
            display: $(window).width() < 1000 ? 'single' : 'double',
            // 괄호 구조 수정됨
            when: {
                turned: function(event, page, view) {
                    let displayPage;
                    if ($book.turn('display') === 'single') {
                        displayPage = page;
                    } else {
                        if (page === 1) displayPage = "1";
                        else if (page >= FlipbookConfig.totalPage) displayPage = FlipbookConfig.totalPage;
                        else displayPage = `${page}-${page + 1}`;
                    }
                    $('#page-number').text(`${displayPage} / ${FlipbookConfig.totalPage}`);
                }
            } // when 끝
        }); // turn 끝

        resizeFlipbook();

        // 클릭 이벤트 핸들러
        $book.on('click', function(e) {
            // turn.js 내부 클릭 이벤트와 충돌할 수 있으므로 상황에 따라 조정 필요
            const offset = $book.offset();
            const x = e.pageX - offset.left;
            const width = $book.width();

            if (x < width / 2) {
                $book.turn('previous');
            } else {
                $book.turn('next');
            }
        });
    }

    // 실행 순서
    buildPages();
    initFlipbook();

    $(window).on('resize', function() {
        resizeFlipbook();
    });

    $(window).keydown(function(e) {
        if (e.keyCode === 37) $book.turn('previous');
        else if (e.keyCode === 39) $book.turn('next');
    });
});
