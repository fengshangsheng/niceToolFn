`npm install --save nicetoolfn`

### Popup---弹窗
```javascript
import { Popup } from 'nicetoolfn';

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
