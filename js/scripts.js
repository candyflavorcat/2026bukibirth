/**
 * 플립북 설정 관리 객체
 */
const FlipbookConfig = {
    totalPage: 70,          // 전체 이미지 장수
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

    // 2. 반응형 사이즈 계산 함수 (추가)
    function resizeBook() {
        // 화면 너비의 90% 정도를 최대치로 잡습니다.
        const windowWidth = $(window).width() * 0.9;
        const windowHeight = $(window).height() * 0.8;

        // 원본 비율 (1000 : 700) 계산
        const ratio = FlipbookConfig.bookWidth / FlipbookConfig.bookHeight;

        let width = windowWidth;
        let height = width / ratio;

        // 계산된 높이가 화면 높이를 초과할 경우 높이 기준으로 재계산
        if (height > windowHeight) {
            height = windowHeight;
            width = height * ratio;
        }

        // turn.js에 사이즈 적용
        $book.turn('size', width, height);
    }

   // 3. 플립북 초기화
    function initFlipbook() {
        $book.turn({
            width: FlipbookConfig.bookWidth,
            height: FlipbookConfig.bookHeight,
            autoCenter: true,
            duration: 800,
            gradients: true,
            acceleration: true,
            // 모바일/작은 화면에서는 한 페이지씩 보이게 설정하고 싶다면 아래 옵션 참고
            // display: $(window).width() < 1000 ? 'single' : 'double'
        });

        // 초기 실행 시 사이즈 조정
        resizeBook();
    }

    // 실행
    buildPages();
    initFlipbook();

    // 브라우저 리사이즈 시 대응
    $(window).on('resize', function() {
        resizeBook();
    });

    // 키보드 방향키로 페이지 넘기기 기능 추가
    $(window).keydown(function(e) {
        if (e.keyCode === 37) $book.turn('previous'); // 왼쪽 방향키
        else if (e.keyCode === 39) $book.turn('next'); // 오른쪽 방향키
    });
});
