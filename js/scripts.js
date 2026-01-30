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

    // 화면 크기에 맞게 사이즈를 계산하고 적용하는 함수
    function resizeFlipbook() {
        const containerWidth = $(window).width() * 0.9; // 화면 너비의 90% 사용
        const containerHeight = $(window).height() * 0.8; // 화면 높이의 80% 사용

        let width = containerWidth;
        let height = width / FlipbookConfig.aspectRatio;

        // 계산된 높이가 컨테이너보다 크면 높이 기준으로 재계산
        if (height > containerHeight) {
            height = containerHeight;
            width = height * FlipbookConfig.aspectRatio;
        }

        // turn.js 사이즈 업데이트
        $book.turn('size', width, height);
    }

    function initFlipbook() {
        $book.turn({
            width: FlipbookConfig.baseWidth,
            height: FlipbookConfig.baseHeight,
            autoCenter: true,
            duration: 800,
            gradients: true,
            acceleration: true,
            // 모바일/태블릿 대응을 위해 디스플레이 모드 설정
            display: $(window).width() < 1000 ? 'single' : 'double'
            
        });

        $book.turn('peel', false);

        // 초기 실행 시 사이즈 조정
        resizeFlipbook();

        $book.on('click', function(e) {
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

    buildPages();
    initFlipbook();

    // 윈도우 리사이즈 이벤트 발생 시 호출
    $(window).on('resize', function() {
        resizeFlipbook();
    });

    // 키보드 방향키로 페이지 넘기기 기능 추가
    $(window).keydown(function(e) {
        if (e.keyCode === 37) $book.turn('previous'); // 왼쪽 방향키
        else if (e.keyCode === 39) $book.turn('next'); // 오른쪽 방향키
    });
});
