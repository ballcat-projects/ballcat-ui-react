### Demo

```typescript jsx
<Auth permission={'system:dict:read'} type={'a'} text={'权限测试'} />

<Auth permission={'system:dict:read'} type={'a'} text={'权限测试'} prefix={true} onClick={() => {
  alert('单击');
}} />

<Auth permission={'system:dict:read'} type={'button'} localeKey={'menu.welcome'} prefix={true} />

<Auth permission={'system:dict:read'} type={<span>自定义</span>} localeKey={'menu.welcome'} prefix={true} />

<Auth permission={'system:dict:read'} type={(text) => <span>自定义-{text}</span>} localeKey={'menu.welcome'}
      prefix={true} />

<Auth.A permission={'system:dict:read'} localeKey={'menu.welcome'} prefix={true} />

<Auth.Button permission={'system:dict:read'} localeKey={'menu.welcome'} prefix={true} />

```
