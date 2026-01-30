/**
 * 플립북 설정 관리 객체
 */
const FlipbookConfig = {
    totalPage: 12,          // 전체 이미지 장수
    imagePath: 'pages/page', // 이미지 경로 및 파일명 앞부분
    extension: '.jpg',      // 확장자
    bookWidth: 1000,        // 전체 가로 길이 (2페이지 펼침 기준)
    bookHeight: 700,        // 세로 길이
    
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
            
            // 페이지 요소 생성
            const $page = $('<div class="page"></div>').css({
                'background-image': `url(${imgPath})`
            });

            // 해당 페이지에 북마크 설정이 있다면 추가
            if (FlipbookConfig.bookmarks[i]) {
                const label = FlipbookConfig.bookmarks[i];
                const $bookmark = $(`<div class="bookmark">🔖 ${label}</div>`);
                
                $bookmark.on('click', function(e) {
                    e.stopPropagation(); // 페이지 넘김 이벤트 간섭 방지
                    $book.turn('page', i);
                });
                
                $page.append($bookmark);
            }

            $book.append($page);
        }
    }

    // 2. 플립북 초기화
    function initFlipbook() {
        $book.turn({
            width: FlipbookConfig.bookWidth,
            height: FlipbookConfig.bookHeight,
            autoCenter: true,
            duration: 800,     // 넘기는 속도 (밀리초)
            gradients: true,   // 입체적인 그림자 효과
            acceleration: true // 가속도 센서 활용 (모바일)
        });
    }

    // 실행
    buildPages();
    initFlipbook();

    // 키보드 방향키로 페이지 넘기기 기능 추가
    $(window).keydown(function(e) {
        if (e.keyCode === 37) $book.turn('previous'); // 왼쪽 방향키
        else if (e.keyCode === 39) $book.turn('next'); // 오른쪽 방향키
    });
});
