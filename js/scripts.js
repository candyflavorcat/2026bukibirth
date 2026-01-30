/**
 * 플립북 설정 관리 객체
 */
const FlipbookConfig = {
    totalPage: 120,          
    imagePath: 'pages/page', 
    extension: '.jpg',       
    ratio: 1.414,            // 가로 대비 세로 비율 (A4 기준 1.414)
    
    // 북마크 설정 (페이지 번호 : 라벨명)
    bookmarks: {
        3: "시작하며",
        7: "중요 포인트",
        10: "마치며"
    }
};

$(document).ready(function() {
    const $book = $('#flipbook');

    // 1. 페이지 생성
    for (let i = 1; i <= FlipbookConfig.totalPage; i++) {
        const pageNum = String(i).padStart(3, '0');
        const $page = $('<div class="page"></div>').css({
            'background-image': `url(${FlipbookConfig.imagePath}${pageNum}${FlipbookConfig.extension})`,
            'background-size': '100% 100%'
        });
        $book.append($page);
    }

    // 2. 핵심: 반응형 크기 계산 함수
    function resizeBook() {
        const winW = $(window).width();
        const winH = $(window).height();
        
        // 여백 제외 실제 가용한 최대 영역 (90% 사용)
        const maxW = winW * 0.9;
        const maxH = winH * 0.9;

        let finalW, finalH;

        // 세로 모드 체크 (화면 너비가 좁을 때)
        if (winW < winH || winW < 768) {
            $book.turn('display', 'single'); // 한 페이지씩 보기
            finalW = maxW;
            finalH = finalW * FlipbookConfig.ratio;

            // 높이가 화면을 벗어나면 높이 기준으로 재계산
            if (finalH > maxH) {
                finalH = maxH;
                finalW = finalH / FlipbookConfig.ratio;
            }
        } else {
            // 가로 모드 (두 페이지 펼침)
            $book.turn('display', 'double');
            finalH = maxH;
            finalW = (finalH / FlipbookConfig.ratio) * 2;

            // 너비가 화면을 벗어나면 너비 기준으로 재계산
            if (finalW > maxW) {
                finalW = maxW;
                finalH = (finalW / 2) * FlipbookConfig.ratio;
            }
        }

        // turn.js에 계산된 크기 적용
        $book.turn('size', finalW, finalH);
    }

    // 3. 플립북 초기화
    $book.turn({
        acceleration: true,
        gradients: true,
        elevation: 50,
        duration: 1000,
        when: {
            turned: function(e, page) {
                console.log("Current page: " + page);
            }
        }
    });

    // 4. 이벤트 바인딩 (리사이즈 및 회전)
    $(window).on('resize', function() {
        resizeBook();
    });

    // 초기 실행
    resizeBook();
});

    // 키보드 방향키로 페이지 넘기기 기능 추가
    $(window).keydown(function(e) {
        if (e.keyCode === 37) $book.turn('previous'); // 왼쪽 방향키
        else if (e.keyCode === 39) $book.turn('next'); // 오른쪽 방향키
    });
});
