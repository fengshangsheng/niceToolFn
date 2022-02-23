> 第一步： `npm init -y`  
> 第二部： 编写index.js文件  
> 第三步： 链接npn官网仓库=>`npm login`  
> 第四步： 发布包`npm publish`  
> =======================================  
> 第五步： 更新版本号`npm version patch` => `npm publish`  
> 第六步： 撤销更新  
>    `npm unpublish [packageName]` // 撤销已发布的包  
>    `npm unpublish [packageName] --force` // 强制撤销  
>    `npm unpublish [packageName]@1.0.2` // 撤销某个版本包  

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
