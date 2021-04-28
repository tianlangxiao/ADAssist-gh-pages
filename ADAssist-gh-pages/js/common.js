function disableF5(e) {
  if ((e.which || e.keyCode) == 116)
    // 在所有患者页面允许 F5 刷新
    if (document.location.pathname === "/contents/all_patients.html") return
    e.preventDefault();
};

$(document).on("keydown", disableF5);

$.fn.serializeFormToJson = function () {
    var arr = $(this).serializeArray(); //form表单数据 name：value
    var param = {};
    $.each(arr, function (i, obj) { //将form表单数据封装成json对象
        param[obj.name] = obj.value;
    })
    return param;
}

$.fn.values = function (data) {
    var els = $(this).find(':input').get();

    if (typeof data != 'object') {
        // return all data
        data = {};

        $.each(els, function () {
            if (this.name && !this.disabled && (this.checked ||
                    /select|textarea/i.test(this.nodeName) ||
                    /text|hidden|password/i.test(this.type))) {
                data[this.name] = $(this).val();
            }
        });
        return data;
    } else {
        $.each(els, function () {
            if (this.name && data[this.name]) {
                if (this.type == 'checkbox' || this.type == 'radio') {
                    // $(this).attr("checked", (data[this.name] == $(this).val()));
                    if (data[this.name] === $(this).val()) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                } else {
                    $(this).val(data[this.name]);
                }
            }
        });
        return $(this);
    }
};

function getRequest(type) {
    var url,
        theRequest = {},
        i, strs;
    type = type || 'search';
    switch (type) {
        case 'hash':
            url = window.location.href.split('#')[1] || '';
            break;
        case 'search':
            // 避免hash不规范情况
            url = window.location.href.split('?')[1] || '';
            url = url.split('#')[0];
            break;
    }
    strs = url.split('&');
    for (i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
    return theRequest;
}

function getId(pid, type, formID, callback = function () {}) {
    /**
     * @param {Int} pid - Patient ID
     * @param {Int} type - Form Type
     * @param {String} formID - Form JQuery Selector
     *
     * @callback callback
     * @param {int} tid - the new form id
     */
    console.debug({function: 'getId', pid, type, formID});
    var formData = $(formID).serializeFormToJson();
    $.ajax({
        url: "http://par.ict.ac.cn:10000/3/survey",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "did": $.cookie("uid"),
            "pid": pid,
            "type": type,
            "date": formData.date.replace(/-/g, ""),
            "finish": 0,
            "paramMap": formData
        }),
        success: function (data) {
            if (data.status == 0) {
                callback(data.result);
            } else {
                console.warn(data);
            }
        }
    });
}

function initForm(tid, pid, type, formID) {
    /**
     * @param {Int} tid - Form ID
     * @param {Int} pid - Patient ID
     * @param {Int} type - form type
     * @param {String} formID - Form JQuery Selector
     */
    console.debug({function: 'initForm', tid, pid, type, formID});
    var formData = $(formID).serializeFormToJson();
    if (!formData) {return;}
    $.ajax({
        url: "http://par.ict.ac.cn:10000/3/survey/" + tid,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "did": $.cookie("uid"),
            "pid": pid,
            "id": tid,
            "type": type,
            "date": formData.date.replace(/-/g, ""),
            "finish": 0,
            "paramMap": formData
        }),
        success: function (data) {
            //window.location.href=""
            if (data.status == 0) {

            } else {

            }
            console.info({
                text: "数据请求成功:",
                data
            });
        },
        fail: function (res) {
            console.error(res);
        }
    });
}

function initData(tid, pid, type, formID, callback = function () {}) {
    /**
     * @param {Int} tid - Form ID
     * @param {Int} pid - Patient ID
     * @param {Int} type - Form Type
     * @param {String} formID - Form JQuery Selector
     *
     * @callback callback
     */
    console.debug({function: 'initData', tid, pid, type, formID});
    $("#formSubmit").on("click", function () {
        console.debug({function: 'onSubmit', tid, pid, type, formID});
        let form = document.querySelector(formID);
        if (form.checkValidity() === false) {
            // event.preventDefault();
            // event.stopPropagation();
            return;
        }
        var formData = $(form).serializeFormToJson();
        if (confirm("是否确认提交测试!")) {
            $.ajax({
                url: "http://par.ict.ac.cn:10000/3/survey/" + tid,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    "did": $.cookie("uid"),
                    "pid": pid,
                    "id": tid,
                    "type": type,
                    "date": formData.date.replace(/-/g, ""),
                    "finish": 1,
                    "paramMap": formData
                }),
                success: function (data) {
                    //window.location.href=""
                    callback(data);
                    if (data.status == 0) {
                        window.history.go(-1)
                        console.log(data);
                    } else {
                        console.warn(data);
                        alert(data.reason);
                    }
                }
            });
        } else {
            $.ajax({
                url: "http://par.ict.ac.cn:10000/3/survey/delete/" + tid,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data.status == 0) {
                        window.history.go(-1);
                        console.info("数据 删除:")
                    }
                }
            });
        }
        return false;
    })
}

function getData(tid, type, formID, callback = function () {}) {
    /**
     * @param {Int} tid - Form ID
     * @param {Int} type - Form Type
     * @param {String} formID - Form JQuery Selector
     *
     * @callback callback
     * @param {Object} data
     * @param {int} data.pid
     * @param {int} data.tid
     */
    console.debug({function: 'getData', tid, type, formID});

    let addEdit = function () {
        let submit = document.querySelector('#formSubmit')
        let edit = submit.cloneNode();

        // 禁用编辑
        document.querySelectorAll('input').forEach(el => {
            el.disabled = true;
        })
        submit.disabled = true;

        // 添加编辑按钮
        edit.id = 'formEdit';
        edit.innerHTML = '编辑';
        edit.classList.replace('btn-outline-primary', 'btn-info');
        edit.onclick = function (e) {
            // 启用编辑
            document.querySelectorAll('input').forEach(el => {
                el.disabled = false;
            })
            document.querySelector('#formSubmit').disabled = false;
            edit.remove();
        }
        submit.after(edit);
    }

    $.ajax({
        url: "http://par.ict.ac.cn:10000/3/survey/" + tid,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.status == 0) {
                var result = JSON.parse(data.result.data).paramMap;
                console.debug({function: 'getDataSuccess', data, result});
                $(formID).values(result);
                callback({
                    tid: data.result.id,
                    pid: data.result.pid,
                });
                if(data.result.finish === 1) addEdit();
            } else {
                console.warn(data);
            }
        }
    });
}

function getUnfinished(pid, type, callback = function () {}) {
    /**
     * @param {Int} tid - Form ID
     * @param {Int} type - Form Type
     *
     * @callback callback
     * @param {int} tid - unfinished tid | undefined
     */

    $.ajax({
        url: "http://par.ict.ac.cn:10000/3/survey/list/find",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "did": $.cookie("uid"),
            "pid": pid,
            "type": type,
        }),
        async: false,
        success: function (data) {
            if (data.status == 0) {
                console.log(data.result)
                let unfinishedItem = data.result.filter(item => item.finish == 0);
                if (unfinishedItem.length > 0) {
                    callback(unfinishedItem[0].id);
                } else {
                    callback(undefined);
                }
            } else {
                callback(undefined);
            }
        },
        fail: function (res) {
            console.error(res);
        }
    });
}
