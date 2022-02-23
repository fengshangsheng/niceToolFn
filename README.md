### 引入前准备

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'styled-components': path.resolve(__dirname, './../node_modules/styled-components'),
      'react': path.resolve(__dirname, './../node_modules/react'),
      'react-dom': path.resolve(__dirname, './../node_modules/react-dom')
    }
  }
}
```

### 弹窗

```javascript
import Modal from 'nicetoolfn/lib/components/Modal';

/**
 * 方式一: 传入function组件
 * */
const curModal = new Modal((props) => {
  const [count, updateCount] = useState(0);
  return (
    <div>
      <h1>count:{count}
        <button onClick={() => updateCount(count + 1)}>add a</button>
      </h1>
      <button onClick={props.closeModal}>close</button>
      <button onClick={props.emitFn}>emit</button>
    </div>
  )
}, {
  closeModal: () => curModal.closeModal(),
  emitFn: () => {
    // 父组件更新state
    handleUpdatePrentsComponentState();
    // 组件实例关闭弹窗
    curModal.closeModal();
  }
})
/**
 * 方式二: 传入组件实例
 * */
const Componet = (props) => {
  const [count, updateCount] = useState(0);
  return (
    <div>
      <h1>count:{count}
        <button onClick={() => updateCount(count + 1)}>add a</button>
      </h1>
      <button onClick={props.closeModal}>close</button>
      <button onClick={props.emitFn}>emit</button>
    </div>
  )
}
const curModal = new Modal(<Componet
  closeModal={() => curModal.closeModal()}
  emitFn={() => {
    // 父组件更新state
    handleUpdatePrentsComponentState();
    // 组件实例关闭弹窗
    curModal.closeModal();
  }}
/>);
```
