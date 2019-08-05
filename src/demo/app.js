import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import GridManager from '../js/index.js';

const gridManagerName = 'testReact';
// 组件: 操作列
function ActionInner(props) {
    const actionAlert = event => {
        alert('操作栏th是由React模板渲染的');
    };
    return <span onClick={actionAlert} style={{display: 'block', color: 'red'}}>{props.text}</span>;
}

function ActionComponents(props) {
    return <ActionInner text={props.text}/>;
}

// 组件: 空模板
function EmptyTemplate(props) {
    return (
        <section style={{textAlign: 'center'}}>
            {props.text}
        </section>
    );
}

// 组件: 标题
function TitleComponents(props) {
    return (
        <a href={'https://www.lovejavascript.com/#!zone/blog/content.html?id=' + props.row.id} target={'_black'}>{props.row.title}</a>
    );
}

// 组件: 类型
function TypeComponents(props) {
    // 博文类型
    const TYPE_MAP = {
        '1': 'HTML/CSS',
        '2': 'nodeJS',
        '3': 'javaScript',
        '4': '前端鸡汤',
        '5': 'PM Coffee',
        '6': '前端框架',
        '7': '前端相关'
    };
    return (
        <button>{TYPE_MAP[props.type]}</button>
    );
}

// 组件: 删除
function EditComponents(props) {
    const {index, row} = props;
    const editAction = () => {
        row.title = row.title + '(编辑于' + new Date().toLocaleDateString() +')';
        GridManager.updateRowData(gridManagerName, 'id', row);
    };

    return (
        <span className={'plugin-action'} onClick={editAction} data-index={index} title={row.title}>编辑</span>
    );
}

// 表格组件配置
const option = {
    gridManagerName,
    disableCache: false,
    emptyTemplate: <EmptyTemplate text={'这个React表格, 什么数据也没有'}/>,
    // topFullColumn: {
    //     template: (row, index) => {
    //         return (<div style={{padding: '12px', textAlign: 'center'}}>
    //             {index} - 快速、灵活的对Table标签进行实例化，让Table标签充满活力。该项目已开源,
    //                     <a target="_blank" href="https://github.com/baukh789/GridManager">点击进入</a>
    //                     github
    //                </div>);
    //     }
    // },
    columnData: [{
        key: 'pic',
        remind: 'the pic',
        width: '110px',
        text: '缩略图',
        template: (pic, row) => {
            return (
                <img style={{width: '90px', height:'58.5px', margin: '0 auto'}} src={'https://www.lovejavascript.com' + pic} title={row.name}/>
            );
        }
    },{
        key: 'title',
        remind: 'the title',
        text: '标题',
        template: <TitleComponents/>
    },{
        key: 'type',
        text: '博文分类',
        width: '150px',
        align: 'center',
        template: (type, row, index) => {
            return <TypeComponents type={type}/>;
        }
    },{
        key: 'info',
        text: '简介',
    },{
        key: 'username',
        remind: 'the username',
        width: '100px',
        text: '作者',
        // 使用函数返回 dom node
        template: (username, row, index) => {
            return (
                <a href={'https://github.com/baukh789'} target={'_black'}>{username}</a>
            );
        }
    },{
        key: 'createDate',
        remind: 'the createDate',
        width: '130px',
        text: '创建时间',
        sorting: 'DESC',
        // 使用函数返回 htmlString
        template: function(createDate, rowObject){
            return new Date(createDate).toLocaleDateString();
        }
    },{
        key: 'lastDate',
        remind: 'the lastDate',
        width: '130px',
        text: '最后修改时间',
        sorting: '',
        // 使用函数返回 htmlString
        template: function(lastDate, rowObject){
            return new Date(lastDate).toLocaleDateString();
        }
    },{
        key: 'action',
        remind: 'the action',
        width: '100px',
        disableCustomize: true,
        text: <ActionComponents text={'操作'}/>,
        // 快捷方式，将自动向组件的props增加row、index属性
        template: <EditComponents/>
    }],
    supportRemind: true,
    isCombSorting:  true,
    supportAjaxPage: true,
    supportSorting: true,
    ajaxData: 'http://www.lovejavascript.com/blogManager/getBlogList',
    ajaxType: 'POST',
};

// 渲染回调函数
const callback = query => {
    console.log('callback => ', query);
};

ReactDOM.render(
    <GridManager
        option={option} // 也可以将option中的配置项展开
        height={'100%'} // 展开后的参数，会覆盖option中的值
        callback={callback}
    />,
    document.querySelector('#example')
);

function SearchComponent() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    function setQuery() {
        GridManager.setQuery(option.gridManagerName, {title, content});
    }

    function reset() {
        setTitle('');
        setContent('');
    }
    return (
        <div className="search-area">
            <div className="sa-ele">
                <label className="se-title">名称:</label>
                <input className="se-con" value={title} onChange={event=>{setTitle(event.target.value)}}/>
            </div>
            <div className="sa-ele">
                <label className="se-title">内容:</label>
                <input className="se-con" value={content} onChange={event=>{setContent(event.target.value)}}/>
            </div>
            <div className="sa-ele">
                <button className="search-action" onClick={setQuery}>搜索</button>
                <button className="reset-action" onClick={reset}>重置</button>
            </div>
        </div>
    );
}

ReactDOM.render(
    <SearchComponent/>,
    document.querySelector('#search')
);


function FooterComponent() {
    const init = () => {
        document.querySelector(`table[grid-manager="${option.gridManagerName}"]`).GM('init', option);
    };
    const destroy = () => {
        GridManager.destroy(option.gridManagerName);
    };
    return (
        <div className="bottom-bar">
            <button onClick={init}>init</button>
            <button onClick={destroy}>destroy</button>
        </div>
    );
}
ReactDOM.render(
    <FooterComponent/>,
    document.querySelector('#footer')
);
