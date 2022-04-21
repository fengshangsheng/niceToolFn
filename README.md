`npm install --save nicetoolfn`

### 方法

<details>
<summary style="font-size: 18px; font-weight: bold">🔥 Popup---弹窗</summary>
<pre style="padding: 0;font-size: 14px;background-color: transparent;">

```javascript
import { Popup } from 'nicetoolfn';
import 'nicetoolfn/dist/nicetoolfn.css'

/**
 * @param props {
 *    closePopup: Function  关闭当前弹窗
 *    closeAllPopup: Function   关闭全部弹窗
 *    emit: (data: {[key:string]:any}) => void   向父弹窗传递数据
 *    childData: {[key:string]:any}   接受子弹窗数据
 * }
 *
 * ext: 传入function组件为展示弹窗内容,可通过props对象接受一系列事件方法
 * */
new Popup((props) => {
  const [count, updateCount] = useState(0);
  const [data] = useState(Date.now());

  useEffect(() => {
    const {childCount = 0} = props.childData;
    updateCount(childCount + count);
  }, [props.childData]);
  return (
    <div className='modal'>
      <h1>{data}</h1>

      count:{count}

      <button onClick={() => updateCount(count + 1)}>click</button>
      <button onClick={() => handlePopup()}>open</button>
      <button onClick={() => props.closePopup()}>close</button>
      <button onClick={() => props.closeAllPopup()}>closeAll</button>
      <button onClick={() => {
        props.closePopup()
        props.emit({childCount: count})
      }}>emit
      </button>
    </div>
  )
});
```

</pre>
</details>

<details>
<summary style="font-size: 18px; font-weight: bold">🔥 CountDown---倒计时</summary>
<pre style="padding: 0;font-size: 14px;background-color: transparent;">

```javascript
import { CountDown } from 'nicetoolfn';

const target = new CountDown(
  '2021-08-08T00:00:00', // 换成时间戳也行
  {
    day: true, hour: true, minute: true, milli: true, // [day,hour,minute,milli]需要返回什么，就相应的设置为true,否则不填写即可
    callback: (data: {[key: number]:string}|false) => {
      if (data === false) {
        // 倒计时结束了
      }
      updateTime({...data});
    }
  }
)
target.stopCountDown(); // 拿到实例后，停止倒计时
```

</pre>
</details>

### Hooks

<details>
<summary style="font-size: 18px; font-weight: bold">🔥 usePages---分页</summary>
<pre style="padding: 0;font-size: 14px;background-color: transparent;">

```javascript
import { usePages } from 'nicetoolfn'

const [
  pageIdx, // 当前页码索引 
  pageCount, // 总共分页数
  table, // 当前分页展示的数据
  handleChangePage // 页码切换，首页为1，末页为pageCount
] = usePages(
  3, // 分页大小
  list // 总列表数据
);
```

</pre>
</details>  <details>
<summary style="font-size: 18px; font-weight: bold">🔥 useTransition---css动画</summary>
<pre style="padding: 0;font-size: 14px;background-color: transparent;">

```javascript
import { usePages } from 'nicetoolfn'

const [
  style, // 当前激活的css样式对象
  updateStyle // 更新激活的css对象
] = useTransition(
  // 初始化默认样式
  {opacity: 0, transform: 'scale(0)'},
  // 切换的样式列表
  [
    [100, {
      transform: 'scale(1)',
      opacity: 1
    }],
    [100, {
      transform: 'scale(0.8)',
      color: 'yellow',
      opacity: 0
    }]
  ],
  (step:number)=>{
    // step 标识当前激活样式list的索引
    // 当css样式切换成功, 会执行当前回调函数
    // 初始化时, 当前函数不执行
  }
);
```

</pre>
</details>  

### 组件

<details>
<summary style="font-size: 18px; font-weight: bold">🔥 LoopFrames---帧动画</summary>
<pre style="padding: 0;font-size: 14px;background-color: transparent;">

```javascript
import { LoopFrames } from 'nicetoolfn'

function App() {
  return (
    <LoopFrames
      frames={[
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00000.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00001.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00002.png'
      ]}
      pace={120} // 帧切换速率
      className={'myclass'}
    />
  )
}
```

</pre>
</details>
<details>
<summary style="font-size: 18px; font-weight: bold">🔥 Tooltip---工具提示</summary>
<pre style="padding: 0;font-size: 14px;background-color: transparent;">

```javascript
import { Tooltip } from 'nicetoolfn'

const TipBox = (props: any) => {
  return <div>
    <p>~~~~{props.count}~~~</p>
    <p>{Date.now()}</p>
    <p>{props.count % 2}</p>
  </div>
}

function App() {
  return (
    <Tooltip trigger={'click'} // 必填:事件类型: click, mouse
             placement={['top', 'right']} // 必填:弹出位置: left,right,top,bottom 
             popup={() => <TipBox count={count}/>} // 选填:弹出组件
             gap={10}// 选填: 弹出组件与目标元素之间的间隔大小
    >
      <button style={({ background: 'red'})} onClick={() => handleEv()}>component</button>
    </Tooltip>
  )
}
```

</pre>
</details>

