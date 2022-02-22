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

const curModal = new Modal((props) => {
  const [a, setA] = useState(0);
  console.log(props);
  return (
    <div>
      <h1>{Date.now()}</h1>
      <h2>count:{count}
        <button onClick={handleAddCount}>add count</button>
      </h2>
      <h3>a:{a}
        <button onClick={() => setA(a + 1)}>add a</button>
      </h3>
      <button onClick={handleModal}>click</button>
      <button onClick={props.handleClose}>close</button>
    </div>
  )
})
```
