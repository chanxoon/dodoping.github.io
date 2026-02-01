let scrollY = 0;
let wrap = null;

/* ------------------------------
   공통 유틸
--------------------------------*/

// 스크린 높이 계산
function syncHeight() {
    document.documentElement.style.setProperty(
        '--window-inner-height',
        `${window.innerHeight}px`
    );
}

// body scroll lock
function bodyLock() {
    scrollY = window.scrollY;
    document.documentElement.classList.add('is-locked');
    if (wrap) wrap.style.top = `-${scrollY}px`;
}

// body scroll unlock
function bodyUnlock() {
    document.documentElement.classList.remove('is-locked');
    window.scrollTo(0, scrollY);
    if (wrap) wrap.style.top = '';
}

// tab menu
function tabMenuEvent() {
    $('.tabMenu li').off('click').on('click', function () {
        const tabId = $(this).data('tab');
        const $wrap = $(this).closest('.tabWrap');

        $wrap.find('.tabMenu li').removeClass('active');
        $(this).addClass('active');

        $wrap.find('.tabPanel').removeClass('active');
        $('#' + tabId).addClass('active');
    });
}

// popup
function modalOpen(id) {
    $('#' + id).fadeIn('fast');
    $('#dim').fadeIn('fast');
    bodyLock();
    tabMenuEvent();
}

function modalClose(el) {
    $(el).closest('.popWrap').fadeOut('fast');
    $('#dim').fadeOut('fast');
    bodyUnlock();
}

// header scroll check
function headerActiveCheck() {
    const top = $(window).scrollTop();
    $('#header').toggleClass('active', top >= 100);
}

/* ------------------------------
   ⭐ include 완료 후 초기화
--------------------------------*/

document.addEventListener('include:done', () => {
    console.log('✅ include 완료');

    wrap = document.getElementById('wrap');

    // AOS
    if (window.AOS) {
        AOS.init({ duration: 1000 });
    }

    // header scroll
    headerActiveCheck();
    $(window).on('scroll', headerActiveCheck);

    // scroll down 버튼
    $('.scrollBtn button').on('click', () => {
        const $target = $('.introSec');
        if (!$target.length) return;

        const y =
            $target.offset().top + $target.outerHeight();

        $('html, body').stop().animate(
            { scrollTop: y },
            500
        );
    });

    // 메뉴 버튼
    $('.navBtn button').on('click', function () {
        $(this).toggleClass('active');
        $('#header').toggleClass('on');
        $('.navListWrap').toggleClass('active');

        $(this).hasClass('active')
            ? bodyLock()
            : bodyUnlock();
    });

    // 최초 실행
    syncHeight();
});

/* ------------------------------
   window 이벤트
--------------------------------*/

window.addEventListener('resize', syncHeight);
