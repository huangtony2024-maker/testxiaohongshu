/**
 * 通用测试壳 - 主程序
 * 无需修改此文件
 */

let currentQuestion = 0;
let answers = { A: 0, B: 0, C: 0, D: 0 };

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('test-title').textContent = TEST_CONFIG.info.title;
    document.getElementById('test-desc').textContent = TEST_CONFIG.info.desc;
});

// 开始测试
function startTest() {
    showPage('question-page');
    loadQuestion();
}

// 加载问题
function loadQuestion() {
    const question = TEST_CONFIG.questions[currentQuestion];
    const total = TEST_CONFIG.questions.length;

    // 更新进度条
    const progress = ((currentQuestion) / total) * 100;
    document.getElementById('progress').style.width = progress + '%';

    // 更新题目
    document.getElementById('question-num').textContent = `第 ${currentQuestion + 1} 题 / 共 ${total} 题`;
    document.getElementById('question-text').textContent = question.text;

    // 更新选项
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.onclick = () => selectOption(option.type);
        optionsContainer.appendChild(btn);
    });
}

// 选择选项
function selectOption(type) {
    answers[type]++;

    currentQuestion++;

    if (currentQuestion >= TEST_CONFIG.questions.length) {
        showResult();
    } else {
        loadQuestion();
    }
}

// 显示结果
function showResult() {
    // 找出得分最高的类型
    let maxType = 'A';
    let maxScore = 0;

    for (const type in answers) {
        if (answers[type] > maxScore) {
            maxScore = answers[type];
            maxType = type;
        }
    }

    const result = TEST_CONFIG.results[maxType];

    // 更新结果页面
    document.getElementById('result-icon').textContent = result.icon;
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-desc').textContent = result.desc;

    // 更新标签
    const tagsContainer = document.getElementById('result-tags');
    tagsContainer.innerHTML = '';
    result.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // 更新详情
    const detailsContainer = document.getElementById('result-details');
    detailsContainer.innerHTML = '<h4>📖 详细解读</h4><ul>';
    result.details.forEach(detail => {
        detailsContainer.innerHTML += `<li>${detail}</li>`;
    });
    detailsContainer.innerHTML += '</ul>';

    // 更新进度条到100%
    document.getElementById('progress').style.width = '100%';

    showPage('result-page');
}

// 重新测试
function restartTest() {
    currentQuestion = 0;
    answers = { A: 0, B: 0, C: 0, D: 0 };
    showPage('start-page');
}

// 分享结果
function shareResult() {
    const shareData = {
        title: TEST_CONFIG.share.title,
        text: TEST_CONFIG.share.desc,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // 复制链接
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('链接已复制，快去分享给朋友吧！');
        });
    }
}

// 切换页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}
