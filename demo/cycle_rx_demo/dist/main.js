webpackJsonp([0],{

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _rxjs = __webpack_require__(30);

var _rxjs2 = _interopRequireDefault(_rxjs);

var _rxjsRun = __webpack_require__(88);

var _dom = __webpack_require__(89);

var _snabbdomJsx = __webpack_require__(44);

var _AutoCompleteInput = __webpack_require__(457);

var _TodoList = __webpack_require__(459);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function appMain(sources) {

    var autoCompleteSource = {
        DOM: sources.DOM,
        props: {
            title: "AUTO-COMPLETE-INPUT",
            summary: "my own cyclejs custom components to search github repo. here is the data source api: https://api.github.com/search/repositories?q=",
            placeholder: "请输入搜索关键词"
        }
    };
    var autoCompleteInput = (0, _AutoCompleteInput.AutoCompleteInput)(autoCompleteSource);

    var todoListSource = {
        DOM: sources.DOM,
        props: {
            title: "CycleJS Demo-Todolist",
            summary: "it's a small app repo, like most of mv* framework to study how to build a beautiful code.",
            list: [{ title: "Test1", edit: false, id: "test1" }, { title: "Test2", edit: false, id: "test2" }]
        }
    };
    var todoList = (0, _TodoList.TodoList)(todoListSource);

    return {
        DOM: _rxjs2.default.Observable.combineLatest(autoCompleteInput.DOM, todoList.DOM).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                domA = _ref2[0],
                domB = _ref2[1];

            return (0, _snabbdomJsx.html)(
                'ul',
                { className: 'demo-list ui items' },
                (0, _snabbdomJsx.html)(
                    'li',
                    { className: 'demo-item ui item' },
                    (0, _snabbdomJsx.html)(
                        'h2',
                        null,
                        '\u641C\u7D22\u81EA\u52A8\u8865\u5168'
                    ),
                    domA
                ),
                (0, _snabbdomJsx.html)(
                    'li',
                    { className: 'demo-item ui item' },
                    (0, _snabbdomJsx.html)(
                        'h2',
                        null,
                        ' Todo List '
                    ),
                    domB
                )
            );
        })
    };
}

(0, _rxjsRun.run)(appMain, {
    DOM: (0, _dom.makeDOMDriver)("#app")
});

/***/ }),

/***/ 457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AutoCompleteInput = AutoCompleteInput;

var _rxjs = __webpack_require__(30);

var _rxjs2 = _interopRequireDefault(_rxjs);

var _snabbdomJsx = __webpack_require__(44);

var _utilAjax = __webpack_require__(458);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _intent_(srcDom) {
    return srcDom.select(".search-box .prompt").events("input").map(function (ev) {
        return ev.target.value;
    });
} /**
   * 这是一个简单的自动填充搜索结果的input框
   * 
   * Stream Thinking: 
   * 1: Focus -> Input -> debounceTime 1s -> Ajax Search -> Render Result -> ShowList
   * 2: Blur/Fouces -> HideList/ShowList
   * 3: debounceTime 1s -> loading icon -> Ajax Search -> loaded icon
   * 4: Ajax Search -> Xhr Request -> Wait Response -> Response
   * 
   * 重点是弄清楚stream之间的依赖关系，combine和merge的区别
   * 
   * 需要用到的状态：
   * loading -> 是否正在获取后台数据
   * hidelist -> 是否显示list
   */

function _model_(action$, props) {
    var click$ = action$.map(function (val) {
        return function (state) {
            return Object.assign({}, state, { value: val });
        };
    });

    var search$ = action$.debounceTime(1000);

    var searchNull$ = search$.map(function (query) {
        return function (state) {
            if (!query) {
                return Object.assign({}, state, { hidestate: 1 });
            }
            return state;
            // else{
            //     return Object.assign({}, state, {hidestate: false});
            // }
        };
    });

    var searchNotNull$ = search$.filter(function (val) {
        return val ? true : false;
    });

    var loading$ = searchNotNull$.map(function (res) {
        return function (state) {
            return Object.assign({}, state, { loading: true, result: {} });
        };
    });

    var fetchData$ = searchNotNull$.flatMap(function (query) {
        return _rxjs2.default.Observable.from((0, _utilAjax.xhr2promise)({
            methods: "get",
            url: "https://api.github.com/search/repositories?q=" + query,
            params: ""
        }));
    }).map(function (res) {
        res = JSON.parse(res);

        res.items = res.items.slice(0, 5).map(function (val, index) {
            return {
                name: val.name,
                full_name: val.full_name,
                html_url: val.html_url
            };
        });

        return res;
    }).map(function (res) {
        return function (state) {
            return Object.assign({}, state, { result: res, loading: false, hidestate: -1 });
        };
    });

    var state$ = _rxjs2.default.Observable.merge(click$, loading$, fetchData$, searchNull$).scan(function (state, change) {
        return change(state);
    }, props).startWith(props).catch(function (err) {
        return console.log(err);
    });

    return state$;
}

function _view_(srcDom, state$) {
    // var blurlist$ = srcDom.select(".search-box .search").events("blur")
    //     .map(ev => true);
    // var focusinput$ = srcDom.select(".search-box .prompt").events("focus")
    //     .map(ev => false);
    // // var focuslist$ = srcDom.select(".search-box .results .result").events("focus")
    // //     .map(ev => false);
    // var hidelist$ = Rx.Observable.merge(blurlist$, focusinput$)
    //     .startWith(false);

    // return Rx.Observable.combineLatest(state$, hidelist$).map(([state, hidestate]) => {
    return state$.map(function (state) {
        var hidestate = state.hidestate;
        var resultHtml;

        if (!!state.result || state.result === null) {
            var resultList = [];
            if (state.result === null) {
                resultList.push((0, _snabbdomJsx.html)(
                    'a',
                    { className: 'result', href: val.html_url },
                    (0, _snabbdomJsx.html)(
                        'div',
                        { className: 'content' },
                        (0, _snabbdomJsx.html)(
                            'div',
                            { className: 'title' },
                            '\u65E0\u641C\u7D22\u7ED3\u679C'
                        )
                    )
                ));
            }

            if (state.result.items) {
                state.result.items.map(function (val) {
                    resultList.push((0, _snabbdomJsx.html)(
                        'a',
                        { className: 'result', href: val.html_url },
                        (0, _snabbdomJsx.html)(
                            'div',
                            { className: 'content' },
                            (0, _snabbdomJsx.html)(
                                'div',
                                { className: 'title' },
                                val.full_name
                            )
                        )
                    ));
                });
            }

            resultHtml = (0, _snabbdomJsx.html)(
                'div',
                { className: hidestate !== -1 ? "results" : "results transition visible" },
                resultList
            );
        } else {
            resultHtml = (0, _snabbdomJsx.html)(
                'div',
                { className: 'results' },
                (0, _snabbdomJsx.html)(
                    'a',
                    { className: 'result' },
                    (0, _snabbdomJsx.html)(
                        'div',
                        { className: 'content' },
                        (0, _snabbdomJsx.html)(
                            'div',
                            { className: 'title' },
                            'null'
                        )
                    )
                )
            );
        }

        return (0, _snabbdomJsx.html)(
            'div',
            { className: 'search-box' },
            (0, _snabbdomJsx.html)(
                'h3',
                null,
                state.title
            ),
            (0, _snabbdomJsx.html)(
                'p',
                null,
                state.summary
            ),
            (0, _snabbdomJsx.html)(
                'div',
                { className: 'ui search' },
                (0, _snabbdomJsx.html)(
                    'div',
                    { className: 'ui icon input' },
                    (0, _snabbdomJsx.html)('input', { className: 'prompt', type: 'text', placeholder: state.placeholder, value: state.value }),
                    (0, _snabbdomJsx.html)('i', { className: state.loading ? "spinner loading icon" : "search icon" })
                ),
                resultHtml
            )
        );
    });
}

function AutoCompleteInput(sources) {
    var props = sources.props;

    var action$ = _intent_(sources.DOM);
    var state$ = _model_(action$, props);
    var vdom$ = _view_(sources.DOM, state$);

    return {
        DOM: vdom$,
        value: state$
    };
}

/***/ }),

/***/ 458:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.xhr2promise = xhr2promise;
function xhr2promise(opts) {
    // console.log(opts);
    return new Promise(function (resolve, reject) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(opts.methods, opts.url, true);

        xmlHttp.onload = function () {
            resolve(xmlHttp.responseText);
        };
        xmlHttp.send(opts.params);

        xmlHttp.ontimeout = function (e) {
            reject(new Error("Ajax Timeout!"));
        };
        xmlHttp.onerror = function (e) {
            reject(new Error("Some Error ocurred: " + e));
        };
        // xmlHttp.upload.onprogress = function(e) {... };
    });
}

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TodoList = TodoList;

var _rxjs = __webpack_require__(30);

var _rxjs2 = _interopRequireDefault(_rxjs);

var _snabbdomJsx = __webpack_require__(44);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 
 */

function _intent_(sourceDom) {
    // return sourceDom.select(".mainlist").events("click")
    //     .map(ev => ev.srcElement)
    //     .filter(deleEle => deleEle.className.indexOf('content') >= -1 ? true : false);

    var addItem$ = sourceDom.select(".mainedit .add").events("click").map(function (ev) {
        var val = document.querySelector(".mainedit input").value;
        return val ? val : false;
    }).filter(function (val) {
        if (val) {
            return val;
        } else {
            alert("添加待办事项名称不能为空");
            return false;
        }
    }).filter(function (val) {
        return confirm("确认添加待办事项 - " + val);
    }).map(function (val) {
        document.querySelector(".mainedit input").value = '';
        return val;
    });

    var delegateItem$ = _rxjs2.default.Observable.from(sourceDom.select(".mainlist").events("click")).map(function (ev) {
        return ev.srcElement;
    });

    var editItem$ = delegateItem$.filter(function (editEle) {
        return editEle.className.indexOf('content') > -1 ? true : false;
    }).buffer(_rxjs2.default.Observable.interval(500)).filter(function (val) {
        return val.length == 2 ? true : false;
    }).map(function (editEle) {
        editEle[0].focus();
        return editEle[0].parentElement.getAttribute("data-id");
    });

    var deleItem$ = delegateItem$.filter(function (deleEle) {
        return deleEle.className.indexOf('remove') > -1 ? true : false;
    }).map(function (deleEle) {
        return deleEle.parentElement.getAttribute("data-id");
    }).filter(function (val) {
        return confirm("确认删除待办事项 - " + val);
    });

    var modifyItem$ = _rxjs2.default.Observable.from(sourceDom.select(".mainlist").events("keypress")).filter(function (ev) {
        return ev.srcElement.className.indexOf('content') > -1 ? true : false;
    }).filter(function (ev) {
        return ev.keyCode == 13 ? true : false;
    }).map(function (ev) {
        return {
            id: ev.srcElement.parentElement.getAttribute("data-id"),
            title: ev.srcElement.innerText.trim()
        };
    });

    return { addItem$: addItem$, editItem$: editItem$, deleItem$: deleItem$, modifyItem$: modifyItem$ };
}

function _model_(action$, props) {
    var addState$ = action$.addItem$.map(function (val) {
        return function (state) {
            state.list.push({ title: val, edit: false, id: "list" + Math.random().toString(16).substring(2) });
            return state;
        };
    });

    var editState$ = action$.editItem$.map(function (val) {
        return function (state) {
            state.list = state.list.map(function (item, ind) {
                if (item.id == val) {
                    item.edit = true;
                }
                return item;
            });
            return state;
        };
    });

    var deleState$ = action$.deleItem$.map(function (val) {
        return function (state) {
            state.list = state.list.filter(function (item, ind) {
                return item.id == val ? false : true;
            });
            return state;
        };
    });

    var modiState$ = action$.modifyItem$.map(function (val) {
        return function (state) {
            state.list = state.list.map(function (item, ind) {
                if (item.id == val.id) {
                    item.title = val.title;
                    item.edit = false;
                }
                return item;
            });
            return state;
        };
    });

    return _rxjs2.default.Observable.merge(addState$, editState$, deleState$, modiState$).scan(function (state, change) {
        return change(state);
    }, props).startWith(props).catch(console.log);
}

function _view_(state$) {
    return state$.map(function (state) {

        var listEle = [];
        state.list.map(function (val, ind) {
            listEle.push((0, _snabbdomJsx.html)(
                "div",
                { className: "item ui icon input", attrs: { "data-id": val.id } },
                (0, _snabbdomJsx.html)(
                    "div",
                    { className: "content", attrs: { contenteditable: val.edit } },
                    val.title
                ),
                (0, _snabbdomJsx.html)("i", { className: "circular remove link icon" })
            ));
        });

        return (0, _snabbdomJsx.html)(
            "div",
            { className: "todolist-box" },
            (0, _snabbdomJsx.html)(
                "h3",
                null,
                state.title
            ),
            (0, _snabbdomJsx.html)(
                "p",
                null,
                state.summary
            ),
            (0, _snabbdomJsx.html)(
                "div",
                { className: "ui icon input mainedit" },
                (0, _snabbdomJsx.html)("input", { type: "text", placeholder: "Add Something Todo:" }),
                (0, _snabbdomJsx.html)("i", { className: "circular add link icon" })
            ),
            (0, _snabbdomJsx.html)(
                "div",
                { className: "ui mainlist segment" },
                listEle
            )
        );
    });
}

function TodoList(sources) {
    var props = sources.props;

    var action$ = _intent_(sources.DOM);

    var state$ = _model_(action$, props);

    var vdom$ = _view_(state$);

    return {
        DOM: vdom$,
        value: state$
    };
}

/***/ })

},[105]);