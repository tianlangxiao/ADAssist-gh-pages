(function () {
    // 修复列表内标题
    if (document.querySelectorAll('ol > h2, ol > h3, ol > h4').length > 0) {
        document.querySelectorAll('form > ol').forEach(el => {
            el.outerHTML = el.outerHTML
                .replace(/<h([2-4]( [^>]+)?)>/mg, '</ol><h$1>')
                .replace(/<\/h([2-4])>/mg, '</h$1><ol>');
        })
    }

    // 清空默认勾选
    document.querySelectorAll('input[checked]').forEach((el) => {
        el.checked = false;
    });

    /* 修改样式 */

    // 提交按钮样式
    document.querySelector('#formSubmit')
        .classList.add('btn', 'btn-outline-primary',
            'float-right', 'mr-5', 'mb-3', 'px-3');

    // 主要样式
    document.querySelector('body').classList.add('container-fluid');

    // 图片最大宽度
    document.querySelectorAll('img').forEach((el) => {
        el.classList.add('mw-100', 'p-1')
    });
    // 文本框、数字框边距
    document.querySelectorAll('input[type=text], input[type=number]').forEach((el) => {
        let txt = el.nextSibling
        el.classList.add('form-control'); // 用于表单中该项是否填写验证
        el.classList.remove('radio_type');
        if (txt && txt.wholeText && (txt.wholeText.trim() === '年' || txt.wholeText.trim() === '秒')) {
            // 优化带单位文本框样式
            let elGroup = document.createElement('div');
            elGroup.classList.add('input-group', 'w-20');
            let elGroupText = document.createElement('div');
            elGroupText.classList.add('input-group-text');
            elGroupText.innerHTML = txt.wholeText.trim();
            let elGroupAppend = document.createElement('div');
            elGroupAppend.classList.add('input-group-append');
            elGroupAppend.appendChild(elGroupText);
            txt.remove();
            el.min = 0;
            el.before(elGroup);
            elGroup.appendChild(el);
            elGroup.appendChild(elGroupAppend);
        } else {
            // 优化正常文本框边距
            el.classList.add('mx-1', 'mb-1');
        }
    });

    // 单选框
    document.querySelectorAll('input[type=radio], input[type=checkbox]').forEach((el) => {
        let next = el.nextSibling;
        let type = el.type;
        if (next.nodeName === '#text') {
            eId = el.name + el.value;
            eText = next.wholeText.trim();
            eInput = el.cloneNode(true);
            eInput.id = eId;
            eInput.classList.add('custom-control-input');
            eInput.classList.remove('radio_type');
            eLabel = document.createElement('label')
            eLabel.classList.add('custom-control-label');
            eLabel.innerText = eText;
            eLabel.setAttribute('for', eId);
            eDiv = document.createElement('div')
            eDiv.classList.add('custom-' + type);
            eDiv.classList.add('custom-control', 'custom-control-inline');
            eDiv.appendChild(eInput);
            eDiv.appendChild(eLabel);
            next.remove();
            el.replaceWith(eDiv);
        }
    });

    // 计时按钮
    document.querySelectorAll('input[type=button]').forEach((el) => {
        if (el.value.includes('计时')) {
            el.classList.add('btn', 'btn-info');
        } else if (el.value.includes('开始') || el.value.includes('停止')) {
            el.classList.add('btn', 'btn-info', 'btn-sm');
        }
    });

    // 增加标题
    let eTitle = document.createElement('div');
    eTitle.innerHTML =
        '<div id="title-block" class="d-inline-block p-2 mx-auto px-4">' +
        document.title + '</div>';
    eTitle.classList.add('m-2', 'text-center', 'font-weight-bold');
    if ($('#pname').length) {
        $('#pname').after(eTitle);
    } else {
        document.querySelector('body').prepend(eTitle);
    }

    /* 默认操作 */

    // 处理指导语
    let eInstructs = document.querySelectorAll('p');
    eInstructs = [...eInstructs].filter(el => el.innerText.startsWith('指导语：'));
    eInstructs.forEach(el => {
        let summary = document.createElement('summary');
        summary.classList.add('mb-2');
        summary.innerHTML = '指导语<small>（点击查看）</small>';
        let info = document.createElement('p');
        info.innerHTML = el.innerHTML
            .replace(/^ *指导语： *(?:“ *([^]+?)”。?|([^]+?)) *$/m, '$1$2');
        info.innerHTML = info.innerHTML.replace(/\[[^\]]+\]/g,
            '<small>$&</small>');
        let details = document.createElement('details');
        details.append(summary, info);
        el.replaceWith(details);
    });

    // 增加边框（fieldset）
    /*   暂时无法使用
    document.querySelectorAll('li').forEach(el => {
        let firstP = el.querySelector('p');
        if (!firstP) {return;}
        let legend = document.createElement('legend');
        legend.innerHTML = firstP.innerHTML;
        let fieldset = document.createElement('field');
        fieldset.innerHTML = el.innerHTML.replace(firstP.outerHTML, '');
        fieldset.prepend(legend);
        el.replaceWith(fieldset);
    })
    */

    // 处理“填写时间”标签
    let timeInput = document.querySelector('form input[name=date]');
    if (timeInput) {
        timeInput.id = 'date';
        timeInput.type = 'date';
        timeInput.classList.add('form-control-inline', 'w-25');
        let timeLabel = timeInput.previousElementSibling
        if (timeLabel.innerHTML === '填写时间:') {
            timeLabel.outerHTML = '<label for="date">填写时间:</label>';
        }
    }

    // 设置默认时间
    let n = new Date();
    let datestring = n.getFullYear() + '-' +
        (n.getMonth() + 1).toString().padStart(2, '0') + '-' +
        n.getDate().toString().padStart(2, '0');
    let eDate = document.querySelector('input[type=date]');
    if (eDate && eDate.value === '') {
        eDate.defaultValue = datestring;
    }

    // 设置未填选项验证
    document.getElementById('form1').classList.add('was-validated');
    let invaildFeedback = '<div class="invalid-feedback">（必填）</div>';
    let addCheck = function (el) {
        if (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'button') {
            el.required = true;
        } else {
            el.childNodes.forEach(chEl => {
                if (chEl.tagName === 'INPUT' && chEl.type !== 'checkbox' && chEl.type !== 'button') {
                    chEl.required = true;
                    let next = chEl.nextElementSibling;
                    if (next && next.nodeName !== 'INPUT' && chEl.type !== 'text') {
                        chEl.outerHTML += invaildFeedback;
                    }
                } else if (
                    chEl.tagName === 'DIV' && (
                        chEl.classList.contains('custom-control') ||
                        chEl.classList.contains('input-group')
                    )) {
                    chEl.childNodes.forEach(chChEl => {
                        if (chChEl.tagName === 'INPUT' && chChEl.type !== 'checkbox') {
                            chChEl.required = true;
                            let parent = chEl;
                            let pNext = parent.nextElementSibling;
                            if (pNext && pNext.tagName === 'BR') {
                                pNext = pNext.nextElementSibling;
                            }
                            if (!pNext || !pNext.classList.contains('custom-control')) {
                                parent.innerHTML += invaildFeedback;
                            }
                        }
                    })
                } else if (chEl.tagName === 'P') {
                    chEl.childNodes.forEach(chChEl => {
                        if (chChEl.tagName === 'INPUT' && chChEl.type !== 'checkbox') {
                            chChEl.required = true;
                        }
                    })
                }
            })
        }
    };
    addCheck(document.getElementById('date'));
    document.querySelectorAll('li').forEach(addCheck);
    document.querySelectorAll('li div.row > div').forEach(addCheck);
    document.querySelectorAll('li div.d-inline').forEach(addCheck);
    document.querySelectorAll('li div.d-inline-flex').forEach(addCheck);

    // 隐藏选项
    $('li').on('click', 'input.radio_collapse', function () {
        let that = this;
        let name = $(that).attr('name');
        let cid = '#' + name + '-collapse';
        let state = ['有', '是'].includes($('input[type=radio][name=' + name + ']:checked')[0].value) ? 'show' : 'hide';
        $(cid).collapse(state);

        // 处理隐藏选项未填验证
        let cardbody = document.querySelector(cid + ' .card-body');
        if (state === 'show') {
            addCheck(cardbody);
        } else if (state === 'hide') {
            cardbody.querySelectorAll(':required').forEach(el => {
                el.required = false;
            })
        } else {
            console.error('state error');
        }
    })

    // 调整顶部定位标签预留空间
    let pad = $('.link-label-pad');
    if (pad.length > 0) {
        let padHeight = $(pad[0]).height();
        $('h2[id^=test]').each(function (idx, e) {
            $(e).css('padding-top', padHeight);
        })
    }
})();
