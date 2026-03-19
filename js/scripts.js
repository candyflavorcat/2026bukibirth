/**
 * 플립북 설정 관리 객체
 */
const FlipbookConfig = {
    totalPage: 194,          // 전체 이미지 장수
    imagePath: 'pages/page', // 이미지 경로 및 파일명 앞부분
    extension: '.jpg',      // 확장자
    bookWidth: 3380,        // 전체 가로 길이 
    bookHeight: 2250,        // 세로 길이
    aspectRatio: 3380 / 2250,
    

    // 북마크 설정 (페이지 번호 : 라벨명)
    bookmarks: {
        5: "하나",
        21: "두울",
        51: "세엣"
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
            });
            
            $book.append($page);
        }
    }

    // 화면 크기에 맞게 사이즈를 계산하고 적용하는 함수
    function resizeFlipbook() {
    const isSingle = $book.turn('display') === 'single';
    const currentAspectRatio = isSingle ? (FlipbookConfig.aspectRatio / 2) : FlipbookConfig.aspectRatio;

    // 2. 컨테이너 여백 설정
    const paddingW = $(window).width() < 600 ? 0.85 : 0.8;
    const paddingH = $(window).width() < 600 ? 0.7 : 0.8;

    const containerWidth = $(window).width() * paddingW;
    const containerHeight = $(window).height() * paddingH;

    let width = containerWidth;
    let height = width / currentAspectRatio;

    // 3. 계산된 높이가 화면보다 크면 높이를 기준으로 너비를 재계산
    if (height > containerHeight) {
        height = containerHeight;
        width = height * currentAspectRatio;
    }

    $book.turn('size', width, height);
}

    function initBookmarks() {
        const $container = $('#bookmark-container');
        $container.empty();

        // 설정객체에 있는 북마크 정보를 순회하며 생성
        Object.keys(FlipbookConfig.bookmarks).forEach(page => {
            const label = FlipbookConfig.bookmarks[page];
            const $bookmark = $(`<div class="bookmark-fixed">${label}</div>`);

            $bookmark.on('click', function() {
                // 클릭 시 해당 페이지로 이동
                $book.turn('page', parseInt(page));
            });

            $container.append($bookmark);
        });
    }
    

    function initFlipbook() {

        const isMobile = $(window).width() < 1000;
        
        $book.turn({
            width: FlipbookConfig.bookWidth,
            height: FlipbookConfig.bookHeight,
            autoCenter: true,
            duration: 800,
            gradients: true,
            acceleration: true,
            display: $(window).width() < 1000 ? 'single' : 'double',
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

        
        setTimeout(resizeFlipbook, 100);

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

    buildPages();
    initBookmarks();
    initFlipbook();

    $(window).on('resize', function() {
        resizeFlipbook();
    });

    $(window).keydown(function(e) {
        if (e.keyCode === 37) $book.turn('previous');
        else if (e.keyCode === 39) $book.turn('next');
    });
});
