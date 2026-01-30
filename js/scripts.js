const FlipbookConfig = {
    totalPage: 120, // 실제 이미지 개수로 수정하세요
    imagePath: 'pages/page', 
    extension: '.jpg',
    ratio: 1.414,
    bookmarks: { 3: "서론", 50: "중간", 100: "결론" }
};

$(document).ready(function() {
    const $book = $('#flipbook');
    let loadedCount = 0;

    // 1. 페이지를 순서대로 미리 생성 (비어있는 상태)
    for (let i = 1; i <= FlipbookConfig.totalPage; i++) {
        const $page = $('<div class="page"></div>').attr('id', 'p' + i);
        $book.append($page);
    }

    // 2. 이미지 로딩 함수
    function loadImages() {
        for (let i = 1; i <= FlipbookConfig.totalPage; i++) {
            const pageNum = String(i).padStart(3, '0');
            const imgUrl = `${FlipbookConfig.imagePath}${pageNum}${FlipbookConfig.extension}`;
            
            const img = new Image();
            img.src = imgUrl;
            img.onload = function() {
                // 이미지가 로드되면 해당 페이지 배경으로 삽입
                $(`#p${i}`).css({
                    'background-image': `url(${imgUrl})`,
                    'background-size': '100% 100%'
                });

                // 북마크 추가
                if (FlipbookConfig.bookmarks[i]) {
                    const $bm = $(`<div class="bookmark">🔖 ${FlipbookConfig.bookmarks[i]}</div>`);
                    $bm.on('click', (e) => { e.stopPropagation(); $book.turn('page', i); });
                    $(`#p${i}`).append($bm);
                }

                loadedCount++;
                // 최소 앞부분 10장 이상 로드되었을 때 플립북 초기화 시작 (또는 전체 로드 후)
                if (loadedCount === 10 || loadedCount === FlipbookConfig.totalPage) {
                    if (!$book.hasClass('js-turn-done')) {
                        initFlipbook();
                    }
                }
            };
            
            img.onerror = function() {
                console.error(`${imgUrl} 파일을 찾을 수 없습니다. 이름 규칙을 확인하세요.`);
                loadedCount++; // 에러가 나도 카운트는 올려서 멈춤 방지
            };
        }
    }

    function initFlipbook() {
        $book.addClass('js-turn-done');
        $book.turn({
            acceleration: true,
            gradients: true,
            elevation: 50,
            display: $(window).width() < $(window).height() ? 'single' : 'double',
            when: {
                turned: function(e, page) {
                    console.log('현재 페이지:', page);
                }
            }
        });
        resizeBook();
    }

    function resizeBook() {
        if (!$book.hasClass('js-turn-done')) return;

        const containerWidth = $(window).width() * 0.95;
        const containerHeight = $(window).height() * 0.9;
        let width, height;

        if ($(window).width() < $(window).height()) {
            $book.turn('display', 'single');
            width = containerWidth;
            height = width * FlipbookConfig.ratio;
        } else {
            $book.turn('display', 'double');
            height = containerHeight;
            width = (height / FlipbookConfig.ratio) * 2;
            if (width > containerWidth) {
                width = containerWidth;
                height = (width / 2) * FlipbookConfig.ratio;
            }
        }
        $book.turn('size', width, height);
    }

    $(window).on('resize', resizeBook);
    loadImages(); // 실행 시작
});
