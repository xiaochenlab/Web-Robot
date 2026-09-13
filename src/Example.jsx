import GradualBlur from './components/GradualBlur/GradualBlur';

function YourComponent() {
  return (
    <section style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
      {/* 可滚动内容 */}
      <div style={{ height: '100%', overflowY: 'auto', padding: '6rem 2rem' }}>
        <h2>滚动查看底部渐隐模糊效果</h2>
        <p>第1段内容</p>
        <p>第2段内容</p>
        <p>第3段内容</p>
        <p>第4段内容</p>
        <p>第5段内容</p>
        <p>第6段内容</p>
        <p>第7段内容</p>
        <p>第8段内容</p>
        <p>第9段内容</p>
        <p>第10段内容</p>
        <p>第11段内容</p>
        <p>第12段内容</p>
        <p>第13段内容</p>
      </div>

      {/* 🔥 渐隐模糊组件 */}
      <GradualBlur
        target="parent"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </section>
  );
}

export default YourComponent;
