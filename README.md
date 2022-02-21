### 弹窗
```javascript
import Modal from 'nicetoolfn/Modal';

new Modal((props) => {
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
