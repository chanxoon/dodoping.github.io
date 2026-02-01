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
    if (wrap) wrap.style.top = '';
    window.scrollTo(0, scrollY);
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

    // 프로젝트 영역
    const tabsEl = document.getElementById('tabs');
    const projectListEl = document.getElementById('projectList');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('close');

    let projectData = null;

    /* ===== JSON 불러오기 ===== */
    fetch('./projects.json')
        .then(res => {
        if (!res.ok) throw new Error('JSON load failed');
        return res.json();
        })
        .then(data => {
        projectData = data;
        renderTabs('all');
        renderProjects('all');
        })
        .catch(err => console.error(err));

    /* ===== 탭 렌더링 ===== */
    function renderTabs(activeType) {
        tabsEl.innerHTML = '';
        projectData.tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.className = 'tab' + (tab.id === activeType ? ' active' : '');
        btn.textContent = tab.label;
        btn.dataset.type = tab.id;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(tab.id);
        });

        tabsEl.appendChild(btn);
        });
    }

    /* ===== 프로젝트 렌더링 ===== */
    function renderProjects(type) {
    projectListEl.innerHTML = '';

    projectData.projects
        .filter(p => type === 'all' || p.type === type)
        .forEach(project => {
        const card = document.createElement('div');
        card.className = 'project';

        card.innerHTML = `
            <div class="thumb">
                <img src="${project.image}" alt="${project.title}">
                <div class="overlay">
                    <span>VIEW</span>
                </div>
            </div>
            <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.desc}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            modalImg.src = project.image;
            modal.classList.add('active');
            bodyLock();

            // 모달 컨텐츠 스크롤 최상단
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) modalContent.scrollTop = 0;
        });

        projectListEl.appendChild(card);
        });
    }


    /* ===== 모달 닫기 ===== */
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        bodyUnlock();
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) {
            e.stopPropagation();
            modal.classList.remove('active');
            bodyUnlock();
        }
    });
});

// 동적 include 헤더도 적용되도록 이벤트 위임 사용
$(document).on('click', '.navList a', function(e) {
    e.preventDefault();

    const targetClass = $(this).data('target');       // data-target에 클래스명 넣기
    const $target = $('.' + targetClass);             // 클래스 선택
    if (!$target.length) return;

    const headerHeight = $('#header').outerHeight() || 0; // 헤더가 fixed이면 높이 고려
    const offsetTop = $target.offset().top - headerHeight;

    $('html, body').stop().animate({ scrollTop: offsetTop }, 500);
});


/* ------------------------------
   window 이벤트
--------------------------------*/

window.addEventListener('resize', syncHeight);
